// var makeSound = function(animal) {
//   if( animal instanceof Duck) {
//     console.log('嘎嘎嘎嘎嘎')
//   } else {
//     console.log('咯咯咯')
//   }
// }

// var Duck = function () {};
// var Chicken = function() {};
// makeSound(new Duck())
// makeSound(new Chicken())

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

var myObject = (function() {
  var _name = 'Seven'; // 私有（private）变量
  return {
    getName: function() { // 公开(public) 方法
      return _name;
    }
  }
})();


// var obj1 = {
//   name: 'seven'
// }

// var obj2 = {
//   name: 'Grady'
// }

// window.name = 'window'

// var getNames = function(){
//   return this.name;
// }

// getNames() // window
// getNames.call(obj1) // seven
// getNames.call(obj2) // Grady

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
console.log(b.getName()) 


var Singleton = function(name) {
  this.name = name
  this.instance = null
}

Singleton.prototype.getName = function() {
  alert(this.name)
}

Singleton.getInstance = function(name) {
  if(!this.instance) {
    this.instance = new Singleton(name)
  }
  return this.instance
}

var a = Singleton.getInstance('sven1')
var b = Singleton.getInstance('sven2')
console.log(a === b, '单例模式')