# JavaScript
## 原始类型
### 七种原始类型
+ string
+ number
+ boolean
+ null
+ undefined
+ Symbol
+ bigInt

## 对象类型
:::tip
在 JavaScript 中，除了原始类型，其他的都是对象类型，对象类型存储的是地址，而原始类型存储的是值。
:::

```js
let a = [];
let b = a;
a.push(0)
console.log(b); // [0]
```

在以上代码中，创建了一个对象类型a(数组)，再把a的地址赋值给了变量b，最后改变a的值，打印b时，b的值也同步发生了改变，因为它们在内存中使用的是同一个地址，改变其中任何一变量的值，都会影响到其他变量。

## apply()与call()的区别

都说温故知新，这不翻翻之前收藏的文章，发现了这篇并打算记录下来。

JavaScript 中的每一个 Function 对象都有一个 apply() 方法和 call() 方法，它们的语法分别为
```js
/**
 * apply() 方法
 */
function.apply(thisObj[, argArray])

/**
 * call() 方法
 */
function.call(thisObj[,arg1,[,arg2,[,...grnN]]])
```
它们各自的定义：
`apply` 调用一个对象的一个方法，用另一个对象替换当前对象。例如：B.apply(A, arguments);即 A 对象应用B对象的方法。

`call` 调用一个对象的一个方法，用另一个对象替换当前对象。例如：B.call(A,arg1,arg2);即 A 对象调用B对象的方法。

**它们的共同之处**：都可以用来代替另一个对象调用一个方法，将一个函数的对象上下文从初始的上下文改变为由 `thisObj` 指定的心对象

**它们的不同之处**：
`apply()`: 最多只能有两个参数-- 新this对象和一个数组 `argArray` 。如果给该防范传递多个参数，则把参数都写进这个数组里面，当然，即使只有一个参数，也要写进数组里。如果 `argArray` 不是一个有效的书组或者 `arguments` 对象，那么将导致一个 TypeError。如果没用提供 `argArray` 和 `thisObj` 任何一个参数，那么 `Global` 对象将被用做 `thisObj`,并且无法传递任何参数。

`call`： 它可以接受多个参数，第一个参数与 `apply` 一样，后面则是一串参数列表。这个方法主要用在 js 对象各个方法相互调用的时候，使当前 `this` 实例指针保持一致，或者在特殊情况下需要改变 `this` 指针。如果没有提供 `thisObj` 参数，那么 `Global` 对象被用做 `thisObj`

实际上，`apply` 和 `call` 的功能是一样的，只是传入的参数列表形式不同。

**示例代码：**
1. 基本用法
   ```js
    function add(a,b) {
    return a + b;
    }

    function sub(a,b) {
    return a - b;
    }

    var a1 = add.apply(sub, [4,2])
    var a2 = sub.apply(add, [4,2])

    console.log(a1) // 6
    console.log(a2) // 2
    
    var a1 = add.call(sub, 4,2)
   ```
2. 实现继承
   ```js
   function Animal(name) {
    this.name = name;
    this.showName = function() {
      console.log(this.name);
    }
   }

   function Cat(name) {
    Animal.apply(this, [name])
   }

   var cat = new Cat('咕咕')
   cat.showName();

   // call 用法
   Animal.call(this, name)

   ```
3. 多重继承
   ```js
    function Class10() {
      this.showSub = function(a,b) {
        console.log(a - b);
      }
    }

    function Class11() {
      this.showAdd = function() {
        console.log(a + b);****
      }
    }

    function Class12() {
      Class10.apply(this);
      Class11.apply(this);

      // Class10.call(this);
      // Class11.call(this);
    }

    var c2 = new Class12()
    c2.showSub(3,1) // 2
    c2.showAdd(3,1) // 4
   ```

`apply` 的一些其他巧妙用法

1. `Math.max` 可以实现得到数组中最大的一项：
   因为 `Math.max` 不支持 `Math.max([params1,params2])` 也就是数组，但是它支持 `Math.max(params1,params2)` ，所以根据 `apply` 的特点来解决 `var max = Math.max.apply(null, array)` ，这样就很轻易的可以得倒一个数组中的最大项 (`apply` 会将一个数组转换为一个参数接个参数的方式传递给方法)
   这块在调用的时候第一个参数给了 `null` ，这是因为没有对象去调用这个方法，我只需要用这个方法帮我运算，得到返回的结果就行，所以直接传递了一个`null` 过去。
   用这种方法也可以实现得到数组中的最小项：`Math.min.apply(null,array)`
2. `Array.prototype.push` 可以实现两个数组的合并
   同样 `push` 方法没有提供`push`一个数组，但是它提供了`push(param1,param2...paramN)`，同样也可以用apply来转换一下这个数组，即：
   ```js
   var arr1 = new Array([1,2,3])
   var arr2 = new Array([4,5,6])
   Array.prototype.push.apply(arr1, arr2)
   ```
   也可以这样理解，arr1调用了push方法，参数是通过apply将数组转换为参数列表的集合
   通常在什么情况下，可以使用apply类似Math.max等之类的特殊用法
   一般在目标函数只需要n个参数列表，而不接收一个数组的形式，可以通过apply的方式巧妙地解决这个问题。
## Proxy和defineProperty的区别
### 前言
为什么会有这个标题呢？起因是在学习Vue3源码里看到的全面采用了ES6里`Proxy`。遂想到和Vue2里的`definePropery`有什么区别。

### 什么是`Proxy`
`Proxy`是ES6推出的一个类，给对象架设一层拦截器，但凡要`访问`和`修改`这个对象上的值或者属性，都必须先经过这层拦截器，`Proxy`也叫`代理器`，它代理了对对象的操作。那和`Object.defineProperty`的区别

### 什么是`Object.defineProperty`
`Object.defineProperty`是对对象上的属性进行新增或者修改，有2种写法，`数据描述符`和`访问器描述符`
```javascript
const obj = {
	name: 'Chrome';
}

// 数据描述符
Object.defineProperty(obj, 'age',{
  configurable: true, // 这个定义是否可以被delete
  enumerable: true, // 这个值是否可以被for in 枚举,或者Object.keys获取到
  writable: true, // 定义是否可以被修改
  value: '100'
})
// 访问器描述符
Object.defineProperty(obj, 'child', {
	configurable: true,
  enumerable: true,
  set(value) {
  	console.log(value)
  },
  get() {
  	console.log(this.value)
  }
})
```

### `Object.defineProperty`和 `Proxy`的区别

- `Object.defineProperty`对对象自身做修改，而`Proxy`只是在Object基础上一层拦截，不修改原对象
- 监听不了数组的变化
- 监听手段比较单一，只能监听`set`和`get`，`Proxy`有十几种监听
- 必须得把所有的属性全部添加`defineProperty`。`Proxy`对整个对象都会进行拦截
### 1、为什么`Proxy`不用遍历每个属性

```javascript
var needProxyObj = {name: 'chrome', age:'800'}
var proxyObj = new Proxy(needProxyObj, {
    set(target, key, value, receiver) {
        consnole.log('proxy修改了', key, value)
    }
})
proxyObj.name = 'safari'; // proxy修改了 name safari

```
Proxy是代理在`对象`级别的，defineProperty是代理到`静态的值`级别，所以Proxy的强大就在这里

### 2、为什么`Proxy`不修改原对象，为什么`Proxy`是在对象上面加一层代理?
```javascript
var needProxyObj = {name: 'chrome', age:'800'}
var proxyObj = new Proxy(needProxyObj, {
    set(target, key, value, receiver) {
        consnole.log('proxy修改了', key, value)
    }
})
proxyObj.name = 'safari'; // proxy修改了 name safari
needProxyObj.child = 'sun'; // sun , 没有被拦截
console.log(proxyObj.child); // sun
needProxyObj === proxyObj; // false
```
看到没, 当我修改被代理之前的对象的时候，拦截器没有起作用，并且被代理的新对象proxyObj的child值也跟着变化了, 但是needProxyObj === proxyObj; // false, 这又是蜜汁操作之一了。其实也好理解，代理对象和被代理的对象，他们在表面上是不一样的，其实在底层是同一个对象。

### 3、为什么我又说Proxy不修改原对象也是不准确的。
这就涉及到Proxy和defineProperty的一个共同特性，不支持对象嵌套。需要递归去实现。
```javascript
var person = {
    name: '阿巴',
    age: '100',
    child: {
        name: '阿巴的儿子',
        age: '88'
    }
}
var proxyEvent = {
       
}
var deepProxy = function(obj) {
    if (typeof obj === 'object') {
        Object.entries(obj).forEach(([key, value]) => {
            obj[key] = deepProxy(value);
        })
        return new Proxy(obj, proxyEvent)
    }
    return obj;
}
deepProxy(person);
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1554877/1647167301464-1a29aebf-6af9-45eb-bf7c-8069598c9920.png#clientId=u5640932b-f4ee-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=199&id=u76118a0c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=397&originWidth=732&originalType=binary&ratio=1&rotation=0&showTitle=false&size=104884&status=done&style=none&taskId=u8c380741-92e1-4c0d-9d45-93bedcc7e35&title=&width=366)
这就是我说为什么不准确的原因了, 所以万不得已，真心不推荐用递归的方式去设置Proxy, 当然，有办法递归设置Proxy，咱们就有办法给它还原
```javascript

function proxyToObject(proxyObj) {
    const next = function (obj, mergeObj) {
        if (typeof obj === 'object') {
            Object.entries(obj).forEach(([key, value]) => {
                if (!value) {
                    mergeObj[key] = value;
                } else if (value instanceof Array) {
                    mergeObj[key] = next(value, []);
                } else if (value instanceof Object) {
                    mergeObj[key] = next(value, {});
                } else {
                    mergeObj[key] = value;
                }
            })
        }
        if (obj && obj instanceof Array) {
            for (let value of obj) {
                mergeObj.push(next(value, {}));
            }
        }
        return mergeObj;
    }
    return next(proxyObj, {});
}
proxyToObject(person); // 然后就恢复了
```
### 4、为什么说Proxy可以监听数组的访问
我们都知道在Vue中，由于defineProperty的局限性，数组的push被认为是变异的特性，为什么vue的push可以被监听到呢，是因为vue把数组对象的push给重写了，进行拦截，这导致增加了不少额外的操作
```javascript
// 来看看Proxy怎么实现
var arr = [1,2,3,4];
let arrProxy = new Proxy(arr, {
    get(target, propKey) {
        if (Array.isArray(target) && typeof Array.prototype[propKey] === 'function') {
            Promise.resolve().then(e => {
                console.log('操作了数组', propKey);
            })
        }
        return target[propKey]
    }
})
arrProxy.push(5);
console.log('push结束了');
// push结束了
// 操作了数组 push

```
为什么要使用Promise.resolve(), 是因为push是一个同步操作，在访问 push的时候还没有执行这个函数，所以想在push之后做一些事情，就可以用这个微任务机制来把操作滞后

