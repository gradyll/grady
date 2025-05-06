---
url: /lodash/chunk.md
---
# chunk

`chunk`是 Lodash 中用于将一维数组按指定长度分割为二维数组的实用函数。本文结合源码实现，从参数处理、核心逻辑到优化细节进行详细分析。

```typescript
function chunk<T>(array: T[], size: number): T[][]
```

## 一、函数功能与参数处理

1. ‌功能定义‌
   chunk(array, size) 将数组 array 分割为多个长度为 size 的子数组。若无法均分，最后一个子数组包含剩余元素‌12。
   ‌示例‌：

```javascript
chunk([10,20,30,40], 2)  // [[10,20], [30,40]]
chunk([10,20,30,40], 3)  // [[10,20,30], ]
```

2. ‌‌参数校验

* `‌size` 处理‌：通过 `size = Math.max(size, 0)` 确保 `size` 为非负数‌12。
* ‌边界条件‌：若 `array` 为空或 `size` < 1，直接返回空数组 \[]‌。

## 二、核心逻辑实现

1. ‌‌‌计算分割结果长度
   使用 `Math.ceil(length / size)` 确定结果数组长度，避免多次扩容‌。

```javascript
const result = new Array(Math.ceil(length / size));

```

2. 循环分割数组

* `‌while` 循环‌：通过 `index += size` 递增索引，利用 `array.slice(index, index + size) `
* ‌性能优化‌：直接调用原生 `slice` 方法减少循环次数，优于逐元素 `push` 操作‌。
  ‌代码片段‌：

```javascript
while (index < length) {
  result[resIndex++] = array.slice(index, (index += size));
}
```

## 三、依赖函数与内部处理

1. `‌slice` 函数‌

负责截取子数组，处理 start 和 end 的负数及越界情况‌。
‌示例‌：slice(\[1,2,3], -2, 4) 转换为有效索引 \[1,3]‌。

2. ‌类型转换工具‌
   `‌toInteger`‌：将参数转换为整数，处理非数值输入（如字符串 "3"→3）‌35。
   `‌toFinite`‌：确保数值在安全范围内（如 Infinity→Number.MAX\_SAFE\_INTEGER）‌35。

## 四、完整源码

```javascript

function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}


function chunk(array, size, guard) {
    if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
      size = 1;
    } else {
      size = nativeMax(toInteger(size), 0);
    }
    var length = array == null ? 0 : array.length;
    if (!length || size < 1) {
      return [];
    }
    var index = 0,
        resIndex = 0,
        result = Array(nativeCeil(length / size));

    while (index < length) {
      result[resIndex++] = baseSlice(array, index, (index += size));
    }
    return result;
  }

```
