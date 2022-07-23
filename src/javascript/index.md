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

