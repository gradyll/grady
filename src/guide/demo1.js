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
