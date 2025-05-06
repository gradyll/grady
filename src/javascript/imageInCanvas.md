# 用JavaScript将Canvas内容转化成图片的方法

```javascript

const convertImageToCanvas = (image) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return canvas;
}

```

# 用JavaScript将画布保持成图片格式
```javascript

const convertCanvasToImage = (canvas) => {
    const image = new Image();
    image.onload = () => {
        // 图片加载完成后，可以进行进一步处理
      image.src = canvas.toDataURL('image/png');
    };
    return image;
}

```