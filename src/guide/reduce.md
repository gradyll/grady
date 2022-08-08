# reduce 用法 
**背景**
在项目当中遇到很多关于后台返回数据结构和需要的数据结构不一致的情况。传统的方法已经不能快速地解决当前遇到的问题。这时，我们急需去寻求更快，更好的处理办法。`reduce`就出现了在我们的眼前。

# 用法
`reduce`的用法很多很多。下面是项目当中常用的方法。

## 累加累积
```javascript
function Accumulation(...vals) {
    return vals.reduce((t, v) => t + v, 0);
}

function Multiplication(...vals) {
    return vals.reduce((t, v) => t * v, 1);
}
```
```javascript
Accumulation(1, 2, 3, 4, 5); // 15
Multiplication(1, 2, 3, 4, 5); // 120
```
## 权重求和
```javascript
const scores = [
    { score: 90, subject: "chinese", weight: 0.5 },
    { score: 95, subject: "math", weight: 0.3 },
    { score: 85, subject: "english", weight: 0.2 }
];
const result = scores.reduce((t, v) => t + v.score * v.weight, 0); // 90.5
```
## 代替reverse
```javascript
function Reverse(arr = []) {
    return arr.reduceRight((t, v) => (t.push(v), t), []);
}
```
```javascript
Reverse([1, 2, 3, 4, 5]); // [5, 4, 3, 2, 1]
```
## 代替map和filter
```javascript
const arr = [0, 1, 2, 3];

// 代替map：[0, 2, 4, 6]
const a = arr.map(v => v * 2);
const b = arr.reduce((t, v) => [...t, v * 2], []);

// 代替filter：[2, 3]
const c = arr.filter(v => v > 1);
const d = arr.reduce((t, v) => v > 1 ? [...t, v] : t, []);

// 代替map和filter：[4, 6]
const e = arr.map(v => v * 2).filter(v => v > 2);
const f = arr.reduce((t, v) => v * 2 > 2 ? [...t, v * 2] : t, []);
```
## 代替some和every
```javascript
const scores = [
    { score: 45, subject: "chinese" },
    { score: 90, subject: "math" },
    { score: 60, subject: "english" }
];

// 代替some：至少一门合格
const isAtLeastOneQualified = scores.reduce((t, v) => t || v.score >= 60, false); // true

// 代替every：全部合格
const isAllQualified = scores.reduce((t, v) => t && v.score >= 60, true); // false

```
## 数组分割
```javascript
function Chunk(arr = [], size = 1) {
    return arr.length ? arr.reduce((t, v) => (t[t.length - 1].length === size ? t.push([v]) : t[t.length - 1].push(v), t), [[]]) : [];
}
```

```javascript
const arr = [1, 2, 3, 4, 5];
Chunk(arr, 2); // [[1, 2], [3, 4], [5]]
```
## 数组过滤
```javascript
function Difference(arr = [], oarr = []) {
    return arr.reduce((t, v) => (!oarr.includes(v) && t.push(v), t), []);
}
```
```javascript
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [2, 3, 6]
Difference(arr1, arr2); // [1, 4, 5]
```
## 数组填充
```javascript
function Fill(arr = [], val = "", start = 0, end = arr.length) {
    if (start < 0 || start >= end || end > arr.length) return arr;
    return [
        ...arr.slice(0, start),
        ...arr.slice(start, end).reduce((t, v) => (t.push(val || v), t), []),
        ...arr.slice(end, arr.length)
    ];
}
```
```javascript
const arr = [0, 1, 2, 3, 4, 5, 6];
Fill(arr, "aaa", 2, 5); // [0, 1, "aaa", "aaa", "aaa", 5, 6]
```
## 数组扁平
```javascript
function Flat(arr = []) {
    return arr.reduce((t, v) => t.concat(Array.isArray(v) ? Flat(v) : v), [])
}
```
```javascript
const arr = [0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]];
Flat(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```
## 数组去重
```javascript
function Uniq(arr = []) {
    return arr.reduce((t, v) => t.includes(v) ? t : [...t, v], []);
}
```
```javascript
const arr = [2, 1, 0, 3, 2, 1, 2];
Uniq(arr); // [2, 1, 0, 3]
```
## 数组最大最小值
```javascript
function Max(arr = []) {
    return arr.reduce((t, v) => t > v ? t : v);
}

function Min(arr = []) {
    return arr.reduce((t, v) => t < v ? t : v);
}
```
```javascript
const arr = [12, 45, 21, 65, 38, 76, 108, 43];
Max(arr); // 108
Min(arr); // 12
```
## 数组成员独立拆解
```javascript
function Unzip(arr = []) {
    return arr.reduce(
        (t, v) => (v.forEach((w, i) => t[i].push(w)), t),
        Array.from({ length: Math.max(...arr.map(v => v.length)) }).map(v => [])
    );
}
```
```javascript
const arr = [["a", 1, true], ["b", 2, false]];
Unzip(arr); // [["a", "b"], [1, 2], [true, false]]
```

