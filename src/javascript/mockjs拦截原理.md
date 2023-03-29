# mockjs拦截原理

## 前言

最近在搭建vite 项目时，用到了`vite-plugin-mock`，想到和`mockjs`有什么区别，于是，翻看了源码。发现它也是基于`mockjs`进行了封装实现的。继续深挖看看`mockjs`的原理。

## 原理

`Mockjs` 是重新手写了 `XMLHttpRequest`的方法，用函数的方式返回数据，不是真正意义上的请求。

我们可以看下面代码：
[源码src/mock.js](src/mock.js)
```js
Mock.mock = function(rurl, rtype, template) {
    ...
    // 拦截 XHR
    if (XHR) window.XMLHttpRequest = XHR
    Mock._mocked[rurl + (rtype || '')] = {
        rurl: rurl,
        rtype: rtype,
        template: template
    }
    return Mock
}

module.exports = Mock
```

通过上面的代码可以看出。`XMLHttpRequest` 被一个 `XHR`赋值。我们再看看它是怎么实现的。

查看源码`src/mock/xhr/xhr.js`发现,XHR 是一个函数MockXMLHttpRequest ，里面定义了一个`custom`对象。
```js
function MockXMLHttpRequest() {
    // 初始化 custom 对象，用于存储自定义属性
    this.custom = {
        events: {},
        requestHeaders: {},
        responseHeaders: {}
    }
}
```
`MockXMLHttpRequest` 通过在原型上进行继承实现拦截请求的方法，主要属性和发放如下：

## 请求相关设置
```js
// 初始化 Request 相关的属性和方法
Util.extend(MockXMLHttpRequest.prototype, {
    // https://xhr.spec.whatwg.org/#the-open()-method
    // Sets the request method, request URL, and synchronous flag.
    open: function(method, url, async, username, password) {
        var that = this

        Util.extend(this.custom, {
            method: method,
            url: url,
            async: typeof async === 'boolean' ? async : true,
            username: username,
            password: password,
            options: {
                url: url,
                type: method
            }
        })

        this.custom.timeout = function(timeout) {
            if (typeof timeout === 'number') return timeout
            if (typeof timeout === 'string' && !~timeout.indexOf('-')) return parseInt(timeout, 10)
            if (typeof timeout === 'string' && ~timeout.indexOf('-')) {
                var tmp = timeout.split('-')
                var min = parseInt(tmp[0], 10)
                var max = parseInt(tmp[1], 10)
                return Math.round(Math.random() * (max - min)) + min
            }
        }(MockXMLHttpRequest._settings.timeout)

        // 查找与请求参数匹配的数据模板
        var item = find(this.custom.options)

        function handle(event) {
            // 同步属性 NativeXMLHttpRequest => MockXMLHttpRequest
            for (var i = 0; i < XHR_RESPONSE_PROPERTIES.length; i++) {
                try {
                    that[XHR_RESPONSE_PROPERTIES[i]] = xhr[XHR_RESPONSE_PROPERTIES[i]]
                } catch (e) {}
            }
            // 触发 MockXMLHttpRequest 上的同名事件
            that.dispatchEvent(new Event(event.type /*, false, false, that*/ ))
        }

        // 如果未找到匹配的数据模板，则采用原生 XHR 发送请求。
        if (!item) {
            // 创建原生 XHR 对象，调用原生 open()，监听所有原生事件
            var xhr = createNativeXMLHttpRequest()
            this.custom.xhr = xhr

            // 初始化所有事件，用于监听原生 XHR 对象的事件
            for (var i = 0; i < XHR_EVENTS.length; i++) {
                xhr.addEventListener(XHR_EVENTS[i], handle)
            }

            // xhr.open()
            if (username) xhr.open(method, url, async, username, password)
            else xhr.open(method, url, async)

            // 同步属性 MockXMLHttpRequest => NativeXMLHttpRequest
            for (var j = 0; j < XHR_REQUEST_PROPERTIES.length; j++) {
                try {
                    xhr[XHR_REQUEST_PROPERTIES[j]] = that[XHR_REQUEST_PROPERTIES[j]]
                } catch (e) {}
            }

            return
        }

        // 找到了匹配的数据模板，开始拦截 XHR 请求
        this.match = true
        this.custom.template = item
        this.readyState = MockXMLHttpRequest.OPENED
        this.dispatchEvent(new Event('readystatechange' /*, false, false, this*/ ))
    },
    setRequestHeader: function(name, value) {},
    timeout: 0,
    withCredentials: false,
    upload: {},
    send: function send(data) {
        var that = this
        this.custom.options.body = data

        // 原生 XHR
        if (!this.match) {
            this.custom.xhr.send(data)
            return
        }

        // 拦截 XHR

        // X-Requested-With header
        this.setRequestHeader('X-Requested-With', 'MockXMLHttpRequest')

        // loadstart The fetch initiates.
        this.dispatchEvent(new Event('loadstart' /*, false, false, this*/ ))

        if (this.custom.async) setTimeout(done, this.custom.timeout) // 异步
        else done() // 同步

        function done() {
            that.readyState = MockXMLHttpRequest.HEADERS_RECEIVED
            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
            that.readyState = MockXMLHttpRequest.LOADING
            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))

            that.status = 200
            that.statusText = HTTP_STATUS_CODES[200]

            // fix #92 #93 by @qddegtya
            that.response = that.responseText = JSON.stringify(
                convert(that.custom.template, that.custom.options),
                null, 4
            )

            that.readyState = MockXMLHttpRequest.DONE
            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
            that.dispatchEvent(new Event('load' /*, false, false, that*/ ));
            that.dispatchEvent(new Event('loadend' /*, false, false, that*/ ));
        }
    },
    abort: function abort() {}
})
```

## 响应体的设置

```js
// 初始化 Response 相关的属性和方法
Util.extend(MockXMLHttpRequest.prototype, {
    responseURL: '',
    status: MockXMLHttpRequest.UNSENT,
    statusText: '',
    // https://xhr.spec.whatwg.org/#the-getresponseheader()-method
    getResponseHeader: function(name) {
        // 原生 XHR
        if (!this.match) {
            return this.custom.xhr.getResponseHeader(name)
        }

        // 拦截 XHR
        return this.custom.responseHeaders[name.toLowerCase()]
    },
    // https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
    // http://www.utf8-chartable.de/
    getAllResponseHeaders: function() {
        // 原生 XHR
        if (!this.match) {
            return this.custom.xhr.getAllResponseHeaders()
        }

        // 拦截 XHR
        var responseHeaders = this.custom.responseHeaders
        var headers = ''
        for (var h in responseHeaders) {
            if (!responseHeaders.hasOwnProperty(h)) continue
            headers += h + ': ' + responseHeaders[h] + '\r\n'
        }
        return headers
    },
    overrideMimeType: function( /*mime*/ ) {},
    responseType: '', // '', 'text', 'arraybuffer', 'blob', 'document', 'json'
    response: null,
    responseText: '',
    responseXML: null
})
```