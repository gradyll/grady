---
url: /guide/js2file.md
---
# js 图片URL转file 文件对象

:::info 前景
在做项目时遇到一个需求，把图片URL上传到服务器。但是上传文件的接口需要的是file文件对象格式。
但遇到了一个比较棘手问题，图片跨域。下面是具体的解决方案。
如果单独设置 `crossOrigin` 属性依然显示跨域，但通过设置 img.src 里的 随机数，可以解决图片跨域问题。
:::

1. 准备图片的URL
2. 创建 `const img = new Image()` 构造函数
3. 设置  `img` 的 `src` 和 `crossOrigin` 属性
4. 在 `img` 的 `onload` 函数里创建 `canvas`
5. 设置 `canvas` 的宽高并转换成图片 `dataurl`
6. 把 `dataurl` 再转换成 `File` 对象

```js

function getBase64(imgUrl, cb) {
  let img = new Image();
  img.src = `${url}?v=${Math.randon()}`; // 处理缓存,fix缓存bug,有缓存，浏览器会报错;
  img.setAttribute('crossOrigin', 'Anonymous'); // 解决控制台跨域报错的问题
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.with = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0,0,width ,height)
    const dataURL = canvas.toDataURL("image/jpeg"); //转换图片为dataURL
    cb && cb(dataURL)
  }
}

function dataURLtoFile(url, filename) {
  //将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function setInitImg(url,callback){
  let img = url;//这里是淘宝上随便找的一张图片
  let _ = this
  let imgRes
  getBase64(img, (dataURL) => {
    imgRes = dataURLtoFile(dataURL,img);
    console.log(imgRes)
    callback(imgRes)
  });
}

```

## 调用

```js
setInitImg('https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',(file)=>{
	   this.fileList.push(file)
 })
```
