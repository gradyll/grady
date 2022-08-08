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