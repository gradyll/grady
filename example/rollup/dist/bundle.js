(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  console.log('这是一个rollup包');


  function add(a,b) {
    return a + b
  }

  let a = add(1,2);

  console.log(a, 'file');

}));
