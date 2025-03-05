# getRawTag 

## 功能概述
`getRawTag` 函数是 `Lodash` 中一个重要的内部工具函数，主要用于获取对象的原始类型标签。它通过巧妙的方式解决了 `Symbol.toStringTag` 可能被篡改导致的类型误判问题，是 `Lodash` 类型检测系统中的关键组件。

## 源码实现
```js
 function getRawTag(value) {
  // 检查属性是否为对象自有
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag]; // 保存原始标签值

  try {
     // 尝试临时屏蔽标签
    value[symToStringTag] = undefined;
    // 标记已屏蔽
    var unmasked = true;
  } catch (e) {}
 // 获取类型标签
  var result = nativeObjectToString.call(value);
  // 如果已屏蔽
  if (unmasked) {
    if (isOwn) {
      // 恢复自有属性
      value[symToStringTag] = tag;
    } else {
       // 删除非自有属性，即删除临时添加的 undefined
      delete value[symToStringTag];
    }
  }
  return result;
}

```

## 实现原理解析

### 1. 属性检查与保护：
  函数首先通过 `hasOwnProperty.call(value, symToStringTag)` 检查 `Symbol.toStringTag` 是否为对象的自有属性。这一步骤非常重要

     - 区分属性是直接定义在对象上还是继承自原型链
     - 避免误操作原型链上的属性
     - 为后续的属性恢复做准备
### 2. 临时屏蔽机制
  函数采用了一个巧妙的临时屏蔽机制：
  ```js
    try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}
  ```
  这个机制的目的是:
   - 通过将 `Symbol.toStringTag` 设置为 `undefined`，强制 Object.prototype.toString 返回对象的原始类型标签
   - 使用 try-catch 块来处理可能的属性修改限制

### 3. 异常处理的必要性
   在某些情况下，对象的 Symbol.toStringTag 属性可能无法修改，比如：
  ```js
    // 示例：不可扩展对象
    "use strict";
    const obj = Object.freeze({
      [Symbol.toStringTag]: "CustomTag",
    });
    try {
      obj[Symbol.toStringTag] = undefined; // 抛出 TypeError
    } catch (e) {}
    // 报错信息
    /**
    * TypeError: Cannot assign to read only property 'Symbol(Symbol.toStringTag)' of object * '#<Object>'
    */ 

  ```
  报错以后，也就意味着，我们无法通过修改属性值来获取原始标签。也就是 Object.freeze 场景下，我们无法获取原始标签。

### 4. 恢复属性值
   函数最后会根据属性的原始状态进行恢复：
   ```js
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }

   ```
操作完成后，若标签是对象自有属性则恢复原值，否则删除临时修改。

## 总结

getRawTag 通过临时修改对象属性的方式，解决了 Symbol.toStringTag 被篡改导致的类型误判问题，是 Lodash 类型检测体系中防御性设计的典型体现。其实现兼顾了准确性、兼容性和性能优化，确保在复杂环境下仍能可靠工作。
