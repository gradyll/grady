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