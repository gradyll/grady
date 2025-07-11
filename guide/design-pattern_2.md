---
url: /grady/guide/design-pattern_2.md
---

# JavaScript设计模式与开发实践之设计模式

这一部分并没有涵盖 GoF 所提出的 23 种设计模式，只选择其中的 14 种。

## 单例模式

:::tip 定义
保证一个类只有一个实例，并提供一个访问它的全局访问点。
:::

**单例模式的用途**

1. 线程池
2. 全局缓存
3. 浏览器中的 window
4. 悬浮窗

```js
var Singleton = function(name) {
  this.name = name
  this.instance = null
}

Singleton.prototype.getName = function() {
  alert(this.name)
}

Singleton.prototype.getInstance = function(name) {
  if(!this.instance) {
    this.instance = new Singleton(name)
  }
  return this.instance
}

var a = Singleton.getInstance('sven1')
var b = Singleton.getInstance('sven2')
console.log(a === b)
```

### 透明单例模式

```js

var CreateDiv = (function() {
  var instance = null;
  var CreateDiv = function(html) {
    if(instance) {
      return instance
    }

    this.html = html;
    this.init()
    instance = this;
    return instance
  }
  CreateDiv.prototype.init = function() {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  }

})

```

### 代理模式单例

```js
var CreateDiv = function(html) {
  this.html = html;
  this.init()
}
CreateDiv.prototype.init = function() {
  var div = document.createElement('div');
  div.innerHTML = this.html;
  document.body.appendChild(div);
}

var ProxySingletonCreateDiv = (function() {
  var instance
  return function(html) {
    if(!instance) {
      instance = new CreateDiv(html)
    }
    return instance;
  }
})()

var a = new ProxySingletonCreateDiv('aaaa')
var b = new ProxySingletonCreateDiv('ccccc')

alert(a === b)
```

## 策略模式

::: tip 定义
定义一系列算法，把它们一个个封装起来，并且是他们可以相互替换。
:::

### 策略模式的优点

1. 策略模式利用组合、委托和等技术和思想，可以有效避免多重条件选择语句。
2. 策略模式提供了开发-封闭原则的完美支持，将算法封装在独立的函数中，易于理解，易于扩展，易于切换。
3. 策略模式中的算法也可以复用在系统的其他地方，可以避免重复使用的情况。
4. 策略模式中利用组合和委托让上下文 Context拥有执行算法的能力，这也是继承的一种更轻便的替代方案。

### 策略模式的缺点

1. 策略模式会在程序中增加许多策略类或者策略对象
2. 要使用策略模式，必须了解所有的strategy策略内容，必须了解各个strategy之间的不同点，这样才能选择一个合适的strategy。

### 策略模式的案例：计算奖金

案例描述：某公司的年终奖是根据员工的工资基数和年底绩效来发放的。例如，绩效为S的人年终奖有4倍工资，绩效为A的人年终奖有3倍工资，绩效为B的人年终奖有2倍工资，财务部要求我们提供一段代码，来方便他们计算员工的年终奖。

**计算奖金：最初版本**

```js
var calculateBonus = function( performanceLevel, salary) {
  if( performanceLevel == 'S') {
    return salary * 4
  }
  if( performanceLevel == 'A') {
    return salary * 3
  }
  if( performanceLevel == 'B') {
    return salary * 2
  }
  if( performanceLevel == 'C') {
    return salary * 1
  }
}


calculateBonus('S', 20000 );
calculateBonus('B', 2000);
```

:::info
可以发现，这段代码十分简单，但是存在着显而易见的缺点。

❏ calculateBonus函数比较庞大，包含了很多if-else语句，这些语句需要覆盖所有的逻辑分支。

❏ calculateBonus函数缺乏弹性，如果增加了一种新的绩效等级C，或者想把绩效S的奖金系数改为5，那我们必须深入calculateBonus函数的内部实现，这是违反开放-封闭原则的。

❏ 算法的复用性差，如果在程序的其他地方需要重用这些计算奖金的算法呢？我们的选择只有复制和粘贴。
:::

**计算奖金：策略模式**

```js
var performanceS = function( salary ) {
  return salary * 4
}
var performanceA = function( salary ) {
  return salary * 3
}
var performanceB = function( salary ) {
  return salary * 2
}

var calculateBonus = function( performanceLevel, salary) {
  if( performanceLevel == 'S') {
    return performanceS(salary)
  }
  if( performanceLevel == 'A') {
    return performanceA(salary)
  }
  if( performanceLevel == 'B') {
    return performanceB(salary)
  }
}

calculateBonus("B", 2000)
```

**计算奖金：模仿面向对象模式**

```js
var performanceS = function() {}
performanceS.prototype.calculate = function(salary) {
  return salary * 4
}
var performanceA = function() {}
performanceA.prototype.calculate = function(salary) {
  return salary * 3
}
var performanceB = function() {}
performanceB.prototype.calculate = function(salary) {
  return salary * 2
}

var Bonus = function() {
  this.salary = null; // 原始薪资
  this.strategy = null; // 绩效等级对应的策略
}

Bonus.prototype.setSalary = function(salary) {
  this.salary = salary
}

Bonus.prototype.setStrategy = function(strategy) {
  this.strategy = strategy
}
Bonus.prototype.getBonus = function() {
  return this.strategy.calculate(this.salary)
}

var bonus = new Bonus()

bonus.setSalary(4000);
bonus.setStrategy(new PerformanceS());
console.log(bonus.getBonus());  // 输出16000

bonus.setSalary(3000);
bonus.setStrategy(new PerformanceA());
console.log(bonus.getBonus());  // 输出9000

bonus.setSalary(2000);
bonus.setStrategy(new PerformanceB());
console.log(bonus.getBonus());  // 输出4000
```

**计算奖金：JavaScript 版本**

```js
var strategies = {
  "S": function( salary ) {
    return salary * 4
  },
  "A": function( salary ) {
    return salary * 3
  },
  "B": function( salary ) {
    return salary * 2
  },
}

var calculateBonus = function(level, salary) {
  return strategies[level](salary)
}

console.log(calculateBonus('S',4000));  // 输出16000
console.log(calculateBonus('A',3000));  // 输出9000
console.log(calculateBonus('B',2000));  // 输出4000
```

### 策略模式案例之 表单验证

:::tip
表单标签

1. 用户名(验证是否为空)
2. 密码(验证长度不能小于6位)
3. 手机号(验证是否是手机号格式)
   :::

```js
// 策略模式案例：表单验证
var strategies = {
  isEmpty: function(value,errMsg) {
    if(value==='') {
      return errMsg
    }
  },
  minLength: function(value,length,errMsg) {
    if(value.length<length) {
      return errMsg
    }
  },
  isMobile: function(value,errMsg) {
    if(!(/^1[34578]\d{9}$/.test(value))) {
      return errMsg
    }
  }
}
var Validator = function() {
  this.cache = [];
}
Validator.prototype.add = function(dom,rule,msg) {
  var ary = rule.split(':');
  this.cache.push(function(){
    var strategy = ary.shift();
    ary.unshift(dom.value);
    ary.push(msg);
    return strategies[strategy].apply(dom,ary);
  });
}
Validator.prototype.run = function() {
  for (let index = 0; index < this.cache.length; index++) {
    var msg = this.cache[index]();
    if(msg) {
      return msg;
    }
  }
}

var validateFunc = function() {
  var validator = new Validator();
  validator.add(registerForm.username,'isEmpty','用户名不能为空');
  validator.add(registerForm.password,'minLength:6','密码长度不能小于6位');
  validator.add(registerForm.phone,'isMobile','手机号格式不正确');
  var errMsg = validator.run();
  return errMsg;
}

var submitBtn = document.getElementById('submitBtn');
var registerForm = document.getElementById('registerForm');
submitBtn.onclick = function() {
  var errMsg = validateFunc();
  if(errMsg) {
    console.log(errMsg);
    return false;
  } else {
    console.log('表单验证成功')
  }
}
```
