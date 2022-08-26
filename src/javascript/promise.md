# Promise 相关知识

## 使用reduce进行Promise排队执行，按照顺序调接口
```js
const promises = [.....]
promises.reduce(
(prev, next) => prev.then(() => next.action()), 
Promise.resolve()
);
```