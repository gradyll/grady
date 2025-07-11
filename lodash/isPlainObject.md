---
url: /grady/lodash/isPlainObject.md
---
# isPlainObject

## 功能概述

`isPlainObject` 函数是 `Lodash` 库中的一个函数，用于判断一个值是否为普通对象（plain object）。它返回一个布尔值，表示给定的值是否为普通对象。普通对象是指由 `{}` 或 `new Object()` 创建的对象，并且其原型链上不包含其他构造函数的对象。

## 源码实现

```js
function isObjectLike(value) {
  return value != null && typeof value == "object";
}

```

## 实现原理解析

### 1. 基础类型检查

函数首先进行两个基础检查：

```js
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
  }
```

* 通过 `isObjectLike` 确保值是类对象（非 null 的对象）
* 通过 `baseGetTag` 确保值的原始类型标签是 "\[object Object]"\\

### 2. 原型链检查

获取对象的原型后进行判断：

```js
var proto = getPrototype(value);
if (proto === null) {
  return true;
}
```

如果对象没有原型（proto 为 null），则认为是纯粹对象,比如以下创建对象方式

```js
const obj = {};
const obj2 = Object.create(null);
const obj3 = new Object();
```

### 3. 构造函数验证

最后一步是验证对象的构造函数：

```js
var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
return typeof Ctor == "function" && Ctor instanceof Ctor;
```

#### 3.1 `hasOwnProperty.call(proto, "constructor")`

确保 `proto` 对象自身拥有 `constructor` 属性，避免因原型污染或手动修改导致的误判。

```js

// 假设原型对象被修改，丢失了 constructor 属性
const obj = Object.create({ __proto__: null });
obj.constructor = null; // 手动删除 constructor 属性
// 若不检查 hasOwnProperty，直接通过 proto.constructor 获取会得到 undefined
// 导致后续类型判断失败
```

#### 3.2 `proto.constructor`

获取原型链中对象的构造函数。

```js
const obj = new (function Custom() {})();
const proto = Object.getPrototypeOf(obj); // 获取原型对象
// proto.constructor 指向 Custom 函数（自定义构造函数）
// 若 proto.constructor 为 undefined（如 Object.create(null)），则跳过后续检查
```

#### 3.3 `typeof Ctor == "function"`

过滤掉非函数类型的构造器（如字符串、数字等），确保后续逻辑安全。

```js
const obj = {};
// 将 constructor 属性设为字符串
Object.setPrototypeOf(obj, { constructor: "not a function" });
// Ctor 为 "not a function"（字符串类型），typeof Ctor 为 "string"，条件不成立
```

#### 3.4 `Ctor instanceof Ctor`

作用：确保构造函数未被篡改或污染，防止通过修改原型链绕过类型检查。

```js

// 假设原型链被恶意修改
function Malicious() {}
Malicious.prototype = Object.create(Array.prototype); // 将原型指向 Array.prototype
const obj = new Malicious();
const proto = Object.getPrototypeOf(obj); // 获取原型对象
const Ctor = proto.constructor; // Ctor 指向 Malicious 函数
// Malicious 函数的原型被修改为 Array.prototype，此时 Ctor instanceof Ctor 为 false
```

#### 3.5 `funcToString.call(Ctor) === objectCtorString`

区分 Object 构造函数与其他自定义构造函数（如 Array、Date 等），确保仅纯对象通过验证。

```js
// 自定义构造函数
function Custom() {}
const obj = new Custom();
const proto = Object.getPrototypeOf(obj); // 获取原型对象
const Ctor = proto.constructor; // Ctor 指向 Custom 函数
// funcToString.call(Ctor) 返回 "[object Function]"，与 objectCtorString（"[object Object]"）不匹配
```

这些条件共同确保了：

* 原型链未被篡改（条件 1、4、5）
* 构造函数类型正确（条件 3、5）
* 仅通过 {} 或 new Object() 创建的纯对象通过验证（条件 2、4、5）

## 总结

`isPlainObject` 函数通过多层次的检查机制，准确识别纯粹对象：

* 首先确保值是对象类型且具有正确的类型标签
* 然后检查原型链，处理无原型对象的特殊情况
* 最后通过构造函数的严格验证，确保对象是通过 Object 构造函数或对象字面量创建F
