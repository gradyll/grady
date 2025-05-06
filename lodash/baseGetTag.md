---
url: /lodash/baseGetTag.md
---
# baseGetTag

## 功能概述

`baseGetTag` 函数是 `Lodash` 中的一个核心工具函数，主要用于获取值的原始类型标签。它是 `Lodash` 类型检测系统的基础，通过合理运用 `Object.prototype.toString` 方法，结合对 `Symbol.toStringTag` 的处理，实现了准确的类型标识获取。

## 源码实现

```js
function baseGetTag(value) {
  // 处理 null 和 undefined 值的情况
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  // 优先通过 Symbol.toStringTag 获取精确标签（避免环境兼容性问题），回退到 Object.prototype.toString 作为兜底方案。
  return symToStringTag && symToStringTag in Object(value)
    ? getRawTag(value)
    : objectToString(value);
}


```

## 实现原理解析

### 1. null 和 undefined 的处理

```
函数首先处理了 JavaScript 中的两个特殊值：
```

```js
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
```

这个处理很重要，因为：
\- null 和 undefined 都不能直接调用 toString 方法
\- 需要区分这两个值，返回不同的类型标签
\- 使用 == null 可以同时检测 null 和 undefined

### 2. `Symbol.toStringTag` 检测

函数采用了一个巧妙的临时屏蔽机制：

```js
symToStringTag && symToStringTag in Object(value)
  ? getRawTag(value)
  : objectToString(value);
```

* symToStringTag：ES6 引入的 Symbol.toStringTag 允许对象自定义 toString 的返回值。
* 若 symToStringTag 存在且 Object(value) 的原型链上包含该属性，则直接调用 getRawTag(value) 获取原始标签（如 "\[object String]"）
* 否则，回退到使用 objectToString(value)（即 Object.prototype.toString.call(value)）

### 3. 类型标签获取策略

baseGetTag 采用了分层的类型检测策略：

1. 对于 null 和 undefined：直接返回固定的类型标签
2. 对于不含 Symbol.toStringTag 的值：使用原生 toString 方法
3. 对于含 Symbol.toStringTag 的值：使用 getRawTag 处理

```js
// 基础类型
baseGetTag(42); // "[object Number]"
baseGetTag("str"); // "[object String]"

// 特殊值
baseGetTag(null); // "[object Null]"
baseGetTag(undefined); // "[object Undefined]"

// 自定义 Symbol.toStringTag
const obj = {
  [Symbol.toStringTag]: "Custom",
};
baseGetTag(obj); // "[object Custom]"

```

## 总结

baseGetTag 是 Lodash 类型检测系统的基石，它通过优雅的分层设计，解决了 JavaScript 类型检测中的各种边界情况。通过与 getRawTag 的配合，它完整地解决了包括 Symbol.toStringTag 在内的各种类型判断场景。
