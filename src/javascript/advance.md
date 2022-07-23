# JavaScript 进阶

## 手写 `getQueryString`

```ts
var url = 'https://www.baidu.com/s?id=123&name=why&phone=13876769797';

export const getQueryString = (name: string, url: string): string => {
  let str = '';
  let index = url.indexOf('?');
  if(index == -1) return undefined
  
  str = index.subtring(index + 1).split('&')

  for(let i = 0; i < strs.length; i++) {
    let splitItem = str[i].split('=')
    if(splitItem[0] == name) {
      return splitItem[0]
    }
  }
}

getQueryString('name') // why
```

## 手写自己的 `setInterval`
:::tip
用 `requestAnimationFrame` 实现自己的 `setInterval` 方法
:::

```js
let obj = {
  timer: null,
  setInterval: function(callback, interval) {
    const now = Date.now;
    let startTime = now()
    let endTime = startTime;
    const self = this;
    const loop = function() {
      self.timer = requestAnimationFrame(loop)
      endTime = now();
      if(endTime - startTime >= interval) {
        startTime = endTime = now()
        callback && callback()
      }
    }
    this.timer = requestAnimationFrame(loop)
    return this.timer
  }
  clearInterval: function() {
    cancelAnimationFrame(this.timer)
  }
}

🌰 :
let count = 0;
const timer = obj.setInterval(() => {
  console.log('interval...')
  count++
  if (count >= 3) {
    obj.clearInterval()
  } 
}, 500)
```