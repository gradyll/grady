---
url: /lodash/isFunction.md
---
# isFunction

## 功能概述

`isFunction` 函数用于检查一个值是否为函数类型。它能够准确识别各种函数形式，包括普通函数、生成器函数、异步函数和代理函数等。

## 源码实现

```js
function isFunction(value) {
// 排除非对象类型的值
if (!isObject(value)) {
    return false;
}
// The use of `Object#toString` avoids issues with the `typeof` operator
// in Safari 9 which returns 'object' for typed arrays and other constructors.
var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

```

## 实现原理解析

### 1. 排除非对象类型的值

```js
if (!isObject(value)) {
  return false;
}
```

JavaScript 中函数本质是对象，排除非对象类型的值，确保仅对象类型的值进入后续类型判断。

### 2. 内部标签检查

```js
var tag = baseGetTag(value);
```

使用 baseGetTag 函数（相对准确）获取值的内部 \[\[Class]] 标签，例如：

```js
baseGetTag(function () {}); // "[object Function]"
baseGetTag(function* () {}); // "[object GeneratorFunction]"
baseGetTag(async function () {}); // "[object AsyncFunction]"
baseGetTag(new Proxy({}, {})); // "[object Proxy]"
```

### 3. 函数类型匹配

最后一步是验证对象的构造函数：

```js
return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;

```

通过检查标签值来匹配不同类型的函数：

* funcTag：普通函数标签 '\[object Function]'
* genTag：生成器函数标签 '\[object GeneratorFunction]'
* asyncTag：异步函数标签 '\[object AsyncFunction]'
* proxyTag：代理函数标签 '\[object Proxy]'

### 4. 示例

```js
// 普通函数
function foo() {}
isFunction(foo); // => true

// 箭头函数
const arrow = () => {};
isFunction(arrow); // => true

// 异步函数
async function asyncFoo() {}
isFunction(asyncFoo); // => true

// 生成器函数
function* generator() {}
isFunction(generator); // => true

// 类
class MyClass {}
isFunction(MyClass); // => true

// 非函数类型
isFunction(42); // => false
isFunction("function"); // => false
isFunction({}); // => false
isFunction([]); // => false
isFunction(null); // => false

```

## 总结

`isPlainObject` 该函数通过 类型过滤 + 标签校验 的组合策略，精准识别 JavaScript 中的函数类型，同时规避了 typeof 在旧版浏览器中的兼容性问题
