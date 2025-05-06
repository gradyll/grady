---
url: /javascript/advance.md
---
# JavaScript 进阶

## 手写 `getQueryString`

```ts
var url = 'https://www.baidu.com/s?id=123&name=why&phone=13876769797';

export const getQueryString = (name: string, url: string): string => {
  let str = '';
  let index = url.indexOf('?');
  if(index == -1) return undefined
  
  str = index.subtring(index + 1).split('&')

  for(let i = 0; i < strs.length; i++) {
    let splitItem = str[i].split('=')
    if(splitItem[0] == name) {
      return splitItem[0]
    }
  }
}

getQueryString('name') // why
```

## 手写自己的 `setInterval`

:::tip
用 `requestAnimationFrame` 实现自己的 `setInterval` 方法
:::

```js
let obj = {
  timer: null,
  setInterval: function(callback, interval) {
    const now = Date.now;
    let startTime = now()
    let endTime = startTime;
    const self = this;
    const loop = function() {
      self.timer = requestAnimationFrame(loop)
      endTime = now();
      if(endTime - startTime >= interval) {
        startTime = endTime = now()
        callback && callback()
      }
    }
    this.timer = requestAnimationFrame(loop)
    return this.timer
  }
  clearInterval: function() {
    cancelAnimationFrame(this.timer)
  }
}

🌰 :
let count = 0;
const timer = obj.setInterval(() => {
  console.log('interval...')
  count++
  if (count >= 3) {
    obj.clearInterval()
  } 
}, 500)
```

## 手写自己的 `EventBus`

[Demo 地址](https://github.com/gradyll/grady/tree/master/src/examples/eventBus/index.html)

```js
// 存储事件／回调键值对
class EventBus {
  constructor() {
    this._events = new Map();
  }

  on(type, fn) {
    if (!type) throw Error('type is not valid')
    if (typeof fn !== 'function') throw Error('type is not function')
    const isValid = this._events.get(type)
    if (!isValid) {
      this._events.set(type, [fn])
    } else {
      isValid.push(fn)
    }
  }
  emit(type, args) {
    if (!type) throw Error('type is not valid')
    const isValid = this._events.get(type)
    if (isValid) {
      for (let i = 0; i < isValid.length; i++) {
        isValid[i](args)
      }
    }
    return true
  }
  off(type, fn) {
    if (!type) throw Error('type is not valid')
    if (typeof fn !== 'function') throw Error('type is not function')
    const isValid = this._events.get(type)
    if (isValid.length > 1) {
      isValid.splice(isValid.findIndex(f => f == fn), 1)
    } else {
      this._events.delete(type)
    }
  }
  once(type, fn) {
    if (!type) throw Error('type is not valid')
    if (typeof fn !== 'function') throw Error('type is not function')
    let _self = this
    function handler() {
      _self.off(type, handler)
      fn.apply(null, arguments)
    }
    this.on(type, handler)
  }
}

// 下面是 测试代码
function test1(...params) {
  console.log(11, params)
}

function test2(...params) {
  console.log(22, params)
}

function test3(...params) {
  console.log(33, params)
}

function test4(...params) {
  console.log(params)
  console.log(33, params)
}

let eb = new EventBus()
eb.on('event1', test1)
eb.on('event1', test2)
eb.on('event1', test3)
eb.emit('event1', '第一次')
eb.off('event1', test1)
eb.emit('event1', ['第二次1', '第二次2'])

eb.once('once', test4);
eb.emit('once', '执行一次', 1, 2, 3)
```

参考地址:

(进军的蜗牛)\[https://www.cnblogs.com/yalong/p/14294497.html]
