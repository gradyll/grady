# JavaScript设计模式与开发实践

## 前言
设计模式是经过前人在工作当中总结提炼出来通用的方法，是面向对象软件设计过程中针对特定问题的简洁而优雅的解决方案。

## 总结
设计模式总共有三大类: `创建型模式`、`结构型模式`和`行为型模式`。总共 `23` 种模式

**创建型模式** *Creational Patterns*
  -  单例模式(Singleton Pattern): 确保一个类只有一个实例，并提供全局可访问点。
  - 工厂方法模式(Factory Method Pattern): 定义一个创建对象的接口，但由子类决定实例化的类是哪一个。
  - 抽象工厂模式(Abstract Factory Pattern): 提供一个接口，用于创建相关或者依赖对象的家族，而不需要指定具体类。
  - 建造者模式(Builder Pattern): 讲一个复杂对象的构建过程与其表示分离，使得同样的构建过程可以创建不同的表示。
  - 原型模式(Prototype Pattern): 通过复制现有对象来创建新对象，避免了使用new操作符创建对象。

**结构型模式** *Structural Patterns*
  - 适配器模式(Adapter Pattern): 将一个类的接口转换成客户端期望的另一个接口。
  - 桥接模式(Bridge Pattern): 将抽象部分与其实现部分分离，使它们可以独立变化。
  - 组合模式(Composite Pattern):将对象组合成树形结构以表示“整体-部分”的层次结构。
  - 装饰者模式(Decorator Pattern)：动态地给一个对象添加额外的职责，而不影响其原始类。
  - 外观模式(Facade Pattern)：为子系统中的一组接口提供一个统一的界面。
  - 享元模式(Flyweight Pattern)：运用共享技术有效地支持大量细粒度的对象。
  - 代理模式(Proxy Pattern)：为其他对象提供一个代理以控制对这个对象的访问。

**行为型模式** *Behavioral Patterns*
  - 模板方法模式（Template Method Pattern）：定义一个算法的骨架，而将一些步骤延迟到子类中实现。
  - 命令模式（Command Pattern）：将请求封装成一个对象，使得可以用不同的请求对客户进行参数化。
  - 迭代器模式（Iterator Pattern）：提供一种方法顺序访问一个聚合对象中的各个元素，而不暴露其内部表示。
  - 观察者模式（Observer Pattern）：定义对象间的一种一对多的依赖关系，使得当一个对象改变状态时，所有依赖它的对象都会被通知并自动更新。
  - 中介者模式（Mediator Pattern）：用一个中介对象来封装一系列的对象交互，使对象之间不再直接相互引用。
  - 备忘录模式（Memento Pattern）：在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。
  - 解释器模式（Interpreter Pattern）：给定一个语言，定义它的文法的一种表示，并定义一个解释器，用来解释语言中的句子。
  - 状态模式（State Pattern）：允许一个对象在其内部状态改变时改变其行为。
  - 策略模式（Strategy Pattern）：定义一系列算法，将每个算法封装起来，并使它们可以互换。
  - 访问者模式（Visitor Pattern）：在不改变数据结构的前提下，增加对数据结构的新操作。
  - 职责链模式（Chain of Responsibility Pattern）：将请求的发送者和接收者解耦，使多个对象都有机会处理该请求。
## 基础知识
:::tip 提示
编程语言按照数据类型大体可以分为两类，一类是`静态类型语言`，另一类是`动态类型语言`。
:::

### 静态语言的优缺点
**优点：**
  - 能够在编译时发现类型不匹配的错误。
  - 能够对程序进行优化工作，提高程序执行速度。

**缺点：**
  - 迫使程序员依照契约编写程序，为每个变量规定数据类型。
  - 规定类型的声明数量过多会增加更多的代码，分散开发业务逻辑。

### 动态语言的优缺点
**优点：**
  - 编写的代码数量少，简洁，也更容易理解业务逻辑。

**缺点：**
  - 无法保障变量的类型，可能发生与类型相关的错误
  - 规定类型的声明数量过多会增加更多的代码，分散开发业务逻辑。

根据上面的描述可知：***JavaScript 是一门动态语言***

### 鸭子类型
:::tip 概念
  鸭子类型(duck Typing) 通俗说法：“如果它走起路来像鸭子，叫起来像鸭子，那么它就是鸭子”
:::
``` js
var duck = {
  duckSinging: function() {
    console.log('嘎嘎嘎')
  }
}

var chicken = {
  duckSinging: function() {
    console.log('嘎嘎嘎嘎')
  }
}

var choir = []; // 合唱团

var joinChoir = function(animal) {
  if(animal && typeof animal.duckSinging === 'function') {
    choir.push(animal);
    console.log('恭喜加入合唱团')
    console.log('合唱团已有成员数量:'+ choir.length)
  }
}

joinChoir(duck); // 恭喜加入合唱团
joinChoir(chicken); // 恭喜加入合唱团
```
<script>
  // 鸭子类型
  import './demo.js'
  // 多态
  import './demo1.js'
</script>

### 多态
:::tip 含义
  多态的含义是：同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果。
:::
``` js
var makeSound = function(animal) {
  if( animal instanceof Duck) {
    console.log('嘎嘎嘎嘎嘎')
  } else {
    console.log('咯咯咯')
  }
}

var Duck = function () {};
var Chicken = function() {};
makeSound(new Duck())
makeSound(new Chicken())
```
这段代码确实体现了“多态性”，当我们分别向鸭和鸡发出“叫唤”的消息时，它们根据此消息作出了各自不同的反应。但这样的“多态性”是无法令人满意的，如果后来又增加了一只动物，比如狗，显然狗的叫声是“汪汪汪”，此时我们必须得改动makeSound函数，才能让狗也发出叫声。修改代码总是危险的，修改的地方越多，程序出错的可能性就越大，而且当动物的种类越来越多时，makeSound有可能变成一个巨大的函数。

**多态背后的思想是将“做什么”和“谁去做以及怎样去做”分离开来，也就是将“不变的事物”与“可能改变的事物”分离开来。** 在这个故事中，动物都会叫，这是不变的，但是不同类型的动物具体怎么叫是可变的。把不变的部分隔离出来，把可变的部分封装起来，这给予了我们扩展程序的能力，程序看起来是可生长的，也是符合开放—封闭原则的，相对于修改代码来说，仅仅增加代码就能完成同样的功能，这显然优雅和安全得多。

#### 优化后的代码
``` js
var makeSound = function( animal ) {
  animal.sound()
}
var Duck = function() {};
Duck.prototype.sound = function () {
  console.log('嘎嘎嘎嘎嘎')
}
var Chicken = function() {};
Chicken.prototype.sound = function() {
  console.log('咯咯咯')
}
makeSound(new Duck());
makeSound(new Chicken())

var Dog = function() {};
Dog.prototype.sound = function() {
  console.log('汪汪汪汪')
}
makeSound(new Dog())
```
另外一个例子
``` js
var googleMap = {
  show: function() {
    console.log('开始渲染谷歌地图')
  }
}
var baiduMap = {
  show: function() {
    console.log('开始渲染百度地图')
  }
}

var renderMap = function( map ) {
  if( map.show instanceof Function) {
    map.show()
  }
}

renderMap(googleMap)
renderMap(baiduMap)

var aMap = {
  show: function() {
    console.log('开始渲染高德地图')
  }
}
renderMap(aMap)
```

### 封装
封装的目的是将信息隐藏。封装不仅仅是封装数据，也可以是封装实现。还有封装类型和封装变化。

::: code-group
``` js [封装数据]
var myObject = (function() {
  var _name = 'Seven'; // 私有（private）变量
  return {
    getName: function() { // 公开(public) 方法
      return _name;
    }
  }
})();

console.log(myObject.getName()); // Sven
console.log(myObject._name) // undefined
```
```js [封装实现]
/**
 * 封装也包含了隐藏实现细节、设计细节以及隐藏对象的类型等
 * 比如：数组的forEach方法，只需要使用不需要关心内部的具体细节
 * 即可实现我们想要的数据。
 */

```
```js [封装类型]
/**
 * 封装类型是静态类型语言中一种重要的封装方式。
 * 一般而言，封装类型是通过抽象类和接口来进行的。
 * 把对象的真正类型隐藏在抽象类或者接口之后，相比对象的类型，客户更关心对象的行为。
 * 在许多静态语言的设计模式中，想方设法地去隐藏对象的类型，也是促使这些模式诞生的原因之一。
 * 比如工厂方法模式、组合模式等。
 */
```
```js [封装变化]

```
:::

## 原型模式
::: tip 提示
原型模式不单是一种设计模式，也被称为一种编程泛型。

原型模式是通过克隆来创建对象的
:::
原型模式的实现关键，是语言本身是否提供了 clone 方法。
原型模式的真正目的是提供一种便携的方式去创建某个类型的对象。
```js
var Plane = function() {
  this.blood = 100;
  this.attackLevel = 1;
  this.defenseLevel = 1;
}
var plane = new Plane()
plane.blood = 500;
plane.attackLevel = 10;
plane.defenseLevel = 7;

var clonePlane = Object.create(plane)

console.log(clonePlane.blood); // 500
console.log(clonePlane.attackLevel); // 10
console.log(clonePlane.defenseLevel); // 7

// 在不支持 Object.create的浏览器
Object.create = Object.create || function(obj) {
  var F = function(){}
  F.prototype = obj;
  return new F();
}
```

## this、call 和 apply
::: tip 什么是 this
JavaScript 的 this 总是指向一个对象，具体指向哪个对象是运行时基于函数的执行环境动态绑定的，而非函数被声明时的环境。
:::

### this指向的4种情况：
  1. 作为对象的方法调用
  2. 作为普通函数调用
  3. 构造器调用
  4. Function.prototype.call 或者 Function.prototype.apply调用

**第一种：作为对象的方法调用**
```js
// 当函数作为对象的方法被调用时，this指向该对象
var obj = {
  a: 1,
  getA: function() {
    alert(this === obj); // 输出: true
    alert(this.a);       // 输出：1
  }
}
obj.getA()
```

**第二种：作为普通函数调用**
```js
/**
 * 当函数不作为对象的属性被调用时，也就是我们常说的普通函数方式，此时的this 总是指向全局对象。
 */
window.name = 'globalName';
var getName = function() {
  return this.name;
}
console.log(getName()); // globalName

window.name = 'globalName'
var myObject = {
  name: 'sven',
  getName: function() {
    return this.name;
  }
}

var getName = myObject.getName;
console.log( getName()); // globalName;

```
**第三种：构造器调用**
```js
var MyClass = function() {
  this.name = 'seven';
}
var obj = new MyClass()

alert(obj.name); // seven
/**
 * 当 new 运算符调用函数时，该函数总会返回一个对象，通常情况下，构造器里 this就指向返回的对象
 */
```
**第四种：call和 apply**
```js
var obj1 = {
  name: 'seven',
  getName: function() {
    return this.name;
  }
}

var obj2 = {
  name: 'anne'
};
console.log( obj1.getName()); // 输出：seven io'[

console.log(obj1.getName.call(obj2)) // 输出: anne
```

## call 和 apply 详解
::: tip 区别
1. apply 接受两个参数，第一个参数指定了函数体内this对象的指向，第二个参数为数组或者类数组
2. call 参数不固定，第一个参数置顶了函数体内 this对象的指向，第二个开始每个参数都会被传入函数里。
:::
``` js
// call 和 apply 的使用区别
var func = function(a,b,c) {
  alert([a,b,c])
}
// 当使用call和apply时，如果第一个参数传递的是null,则此时this指向全局对象
func.apply(null, [1,2,3])
func.call(null, 1,2,3)
```

## call 和 apply 用途
1. 改变this指向
2. Function.prototype.bind
3. 借用其他对象的方法

**改变this指向**
```js 
var obj1 = {
  name: 'seven'
}

var obj2 = {
  name: 'Grady'
}

window.name = 'window'

var getName = function() {
  return this.name
}

console.log(getName()) // window
console.log(getName.call(obj1)) // seven
console.log(getName.call(obj2)) // Grady
```
**Function.prototype.bind**
```js
// 基础版本
Function.prototype.bind = function(context) {
  var self = this;
  return function() {
    return self.apply(context, arguments)
  }
}
var obj = {
  name: 'Grady'
}

var func = function() {
  alert(this.name)
}.bind(obj)

func() // Grady

// 完整版的

Function.prototype.bind = function() {
  var self = this;
  var context = [].shift.call(arguments)
  var arg = [].slice.call(arguments)
  return function() {
    return self.apply(context, [].concat.call(args, [].slice.call(arguments)))
  }
}

var obj = {
  name: 'seven'
}

var func = function(a,b,c,d) {
  alert(this.name) // 输出 seven
  alert([a,b,c,d]) // 输出 [1,2,3,4]
}.bind(obj, 1,2)

func(3,4) 
```

**借用其他对象的方法**
```js
var A = function(name) {
  this.name = name
}

var B = function() {
  A.apply(this, arguments)
}

B.prototype.getName = function() {
  return this.name
}

var b = new B('Grady')
console.log(b.getName()) // Grady

```

## 闭包和高阶函数
闭包的形成与变量的作用域和变量的生存周期密切相关。

**变量的作用域** 变量的作用域是指变量的有效范围。
```js
var a = 1;

var func1 = function() {
  var b = 2;;
  var func2 = function() {
    var c = 3;
    alert(a) // 1
    alert(b) // 2
  }
  func2()
  alert(c) // undefined
}
func1()
```
> 在JavaScript中，函数可以用来创造函数作用域。此时的函数像一层半透明的玻璃，在函数里面可以看到外面的变量，而在函数外面则无法看到函数里面的变量。这是因为当在函数中搜索一个变量的时候，如果该函数内并没有声明这个变量，那么此次搜索的过程会随着代码执行环境创建的作用域链往外层逐层搜索，一直搜索到全局对象为止。变量的搜索是从内到外而非从外到内的。

**变量的生命周期**
- 全局变量的生命周期是永久存在的，除非进行主动销毁变量。
- 局部变量会随着函数的退出而销毁

### 闭包的作用
1. 封装变量
2. 延续局部变量的生命周期
  
**封装变量**
```js
var mult = (function() {
  var cache = {}
  var calculate = function () {
    var a = 1;
    for(var i= 0, l = arguments.length; i< l; i++) {
      a = a * arguments[i]
    }
    return a
  }
  return function() {
    var arg = Array.prototype.join.call(arguments, '')
    if(arg in cache) {
      return cache[arg]
    }
    return cache[args] = calculate.apply(null, arguments)
  }
})()
console.log(mult(1,2,3,4)); // 输出24
```
**延长局部变量的生命周期**
```js
// 闭包的作用：延续局部变量的寿命
// 实例：利用img进行数据上报
var report = (function() {
  var imgs = [];
  return function(src) {
    var img = new Image();
    imgs.push(img);
    img.src = src;
  }
})()
```

**闭包和面向对象**
:::tip 
面向对象能够实现的，闭包也可以实现。
:::
```js
var extend = function() {
  var value = 0;
  return {
     call: function() {
      value++;
      console.log(value)
    }
  }
}
var extant = extend()

extend.call(); // 1
extend.call(); // 2
extend.call(); // 3


var extend = {
  value: 0,
  call: function() {
    this.value++
    console.log(this.value++)
  }
}
extend.call(); // 1
extend.call(); // 2
extend.call(); // 3
```

## 用闭包实现命令模式

**面向对象形式**
```html
<html>
  <body>
    <button id="execute">点击我执行命令</button>
    <button id="undo">点击我执行命令</button>
<script>

var Tv = {
  open: function(){
      console.log( '打开电视机' );
  },
  close: function(){
      console.log( '关上电视机' );
  }
};

var OpenTvCommand = function( receiver ){
  this.receiver = receiver;
};

OpenTvCommand.prototype.execute = function(){
  this.receiver.open();    // 执行命令，打开电视机
};

OpenTvCommand.prototype.undo = function(){
  this.receiver.close();    // 撤销命令，关闭电视机
};

var setCommand = function( command ){
  document.getElementById( 'execute' ).onclick = function(){
      command.execute();     // 输出：打开电视机
  }
  document.getElementById( 'undo' ).onclick = function(){
      command.undo();     // 输出：关闭电视机
  }
};

setCommand( new OpenTvCommand( Tv ) );

  </script>
  </body>
</html>
```

**闭包形式**
```js
var Tv = {
    open: function(){
      console.log( ’打开电视机’ );
    },
    close: function(){
        console.log( ’关上电视机’ );
    }
};

var createCommand = function( receiver ){

    var execute = function(){
        return receiver.open();    // 执行命令，打开电视机
    }

    var undo = function(){
        return receiver.close();    // 执行命令，关闭电视机
    }

    return {
        execute: execute,
        undo: undo
    }

};

var setCommand = function( command ){
    document.getElementById( 'execute' ).onclick = function(){
        command.execute();     // 输出：打开电视机
    }
    document.getElementById( 'undo' ).onclick = function(){
        command.undo();    // 输出：关闭电视机
    }
};

setCommand( createCommand( Tv ) );
```

### 闭包和缺点
> 局部变量本来应该在函数退出的时候被解除引用，但如果局部变量被封闭在闭包形成的环境中，那么这个局部变量就能一直生存下去。从这个意义上看，闭包的确会使一些数据无法被及时销毁。使用闭包的一部分原因是我们选择主动把一些变量封闭在闭包中，因为可能在以后还需要使用这些变量，把这些变量放在闭包中和放在全局作用域，对内存方面的影响是一致的，这里并不能说成是内存泄露。如果在将来需要回收这些变量，我们可以手动把这些变量设为null。

> 使用闭包的同时比较容易形成循环引用，如果闭包的作用域链中保存着一些DOM节点，这时候就有可能造成内存泄露。但这本身并非闭包的问题，也并非JavaScript的问题。在IE浏览器中，由于BOM和DOM中的对象是使用C++以COM对象的方式实现的，而COM对象的垃圾收集机制采用的是引用计数策略。在基于引用计数策略的垃圾回收机制中，如果两个对象之间形成了循环引用，那么这两个对象都无法被回收，但循环引用造成的内存泄露在本质上也不是闭包造成的。

## 高阶函数
满足高阶函数的条件：
1. 函数可以作为参数传递
2. 函数可以作为返回值输出
   
**函数作为参数传递**
```js
var appendDiv = function(callback) {
  for(var i = 0; i < 100; i++) {
    var div = document.createElement('div');
    div.innerHTML = i
    document.body.appendChild(div);
    if(typeof callback == 'function') {
      callback(div)
    }
  }
}

appendDiv(function(node) {
  node.style.display = 'none'
})
```

**函数作为返回值输出**
```js
// 高阶函数的应用场景：函数作为返回值输出
// 应用场景：注册isType方法
var isType = function(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === '[object '+ type+']';
  }
}
var isNumber = isType('Number');
var isString = isType('String');
var isArray = isType('Array');
console.log(isNumber(12));      // 输出true
console.log(isString('abc'));   // 输出true
console.log(isArray([1,2,3]));  // 输出true
```

### 高阶函数实现 AOP(面向切面变成)
:::tip AOP
AOP 是把一些和业务逻辑无关的功能抽离出来。包括(日志统计、安全控制、异常处理)把这些功能抽离出来后，再通过动态织入的方式掺入业务逻辑模块中
:::

```js
// 高阶函数的应用场景：实现AOP
// 应用场景：装饰者模式
Function.prototype.before = function(beforeFn) {
  var _self = this;
  return function() {
    beforeFn.apply(this,arguments);
    return _self.apply(this,arguments);
  }
}
Function.prototype.after = function(afterFn) {
  var _self = this;
  return function() {
    var ret = _self.apply(this,arguments);
    afterFn.apply(this,arguments);
    return ret;
  }
}
var func = function() {
  console.log(2);
}
func = func.before(function(){
  console.log(1);
}).after(function(){
  console.log(3);
})
func();
```
### 高阶函数的其他用法

**柯里化**:又称部分求值，一个柯里化参数首先会接受一些参数，接受这些参数之后，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来，待到合适的时机一起求值。

```js
var currying = function( fn ) {
  var args = [];
  return function() {
    if(arguments.length == 0) {
      return fn.apply(this, args)
    } else {
      [].push.apply(args, arguments)
      return arguments.callee
    }
  }
} 

var cost = (function() {
  var money = 0;
  for(var i = 0, len = arguments.length; i < l; i++) {
    money += arguments[i]
  }
  return money
})()

var coat = currying(cost)

coat(100); // 未真正求值
coat(200); // 未真正求值
coat(300); // 未真正求值
coat();    // 600
```

## 高阶函数之 函数节流
:::tip 函数节流的场景
window.onresize事件

mouseover事件

scroll事件

其他
:::

```js

// 高阶函数其他用法：函数节流
// 应用场景：window.onresize事件
var throttle = function(fn,interval) {
  var timer = null;
  var firstTime = true;
  var _self = fn;
  return function() {
    var that = this;
    var args = arguments;
    
    // 判断是否第一次执行
    if(firstTime) {
      _self.apply(that,args);
      return firstTime = false
    }
    // 判断定时器是否执行完毕
    if(timer) {
      return false;
    }
    timer = setTimeout(function() {
      clearTimeout(timer);
      timer = null;
      _self.apply(that,args);
    },interval || 500)
  }
}
window.onresize = throttle(function(){
  console.log('window onsize');
}, 500)
```
## 高阶函数之 防抖(分时截流)
```js
// 高阶函数其他用法：分时函数
// 应用场景：分批次创建1000个DOM节点

// 分时函数
// 参数arr：要填充的数据
// 参数fn：要分时的函数
// 参数count：每一次分时的数量
// 参数interval：分时的间隔
var timeChunk = function(arr,fn,count,interval) {
  var timer = null;
  var data = null;
  var start = function() {
    for(var i = 0 ; i < Math.min(count || 1 , arr.length) ; i++) {
      data = arr.shift();
      fn(data);
    }
  }
  return function() {
    timer = setInterval(function(){
      if(arr.length == 0) {
        clearInterval(timer);
        timer = null;
        return;
      }
      start();
    }, interval || 200)
  }
}

var arr = [];
for(var i = 0 ; i < 1000 ; i++) {
  arr.push(i);
}

var renderDOMList = timeChunk(arr, function(data) {
  var div = document.createElement('div');
  div.innerHTML = data;
  document.body.appendChild(div);
},8,200);
renderDOMList();
```
