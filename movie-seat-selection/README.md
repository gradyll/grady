---
url: /movie-seat-selection/README.md
---
# 电影票选座系统

这是一个基于HTML Canvas的电影票选座系统，允许用户通过点击交互选择和取消选择电影院座位。支持手势缩放功能，方便在移动设备上查看和选择座位。

## 功能特点

* 使用HTML5 Canvas绘制电影院座位图
* 点击选中座位，再次点击取消选择
* 默认座位为未选中状态
* 显示已选座位的行数和列数信息
* 支持一键清除所有选择
* 支持自定义行数、列数和颜色等配置
* **支持手势缩放和平移功能**：
  * 双指捏合手势进行缩放（移动设备）
  * 鼠标滚轮缩放（桌面设备）
  * 拖动画布进行平移
  * 支持重置视图功能

## 使用方法

1. 将`index.html`和`script.js`文件放在同一目录下
2. 在浏览器中打开`index.html`文件
3. 点击座位进行选择或取消选择
4. 已选择的座位信息会显示在下方
5. 使用以下方式进行缩放和平移：
   * **触摸设备**：双指捏合进行缩放，单指拖动画布
   * **桌面设备**：使用鼠标滚轮缩放，按住鼠标左键拖动画布
   * 点击"重置视图"按钮返回原始视图

## 自定义配置

可以通过修改`MovieSeatSelection`类的初始化参数来自定义座位选择界面：

```javascript
const seatSelection = new MovieSeatSelection('seatCanvas', 'selectedSeats', {
    rows: 8,             // 座位行数
    cols: 12,            // 座位列数
    seatSize: 30,        // 座位大小(像素)
    seatPadding: 10,     // 座位间距(像素)
    seatColor: '#ccc',   // 未选中座位颜色
    selectedColor: '#66aaff', // 选中座位颜色
    borderColor: '#999', // 座位边框颜色
    textColor: '#333',   // 文字颜色
    showRowColLabels: true, // 是否显示行列标签
    labelPadding: 30,    // 标签间距
    seatRadius: 5,       // 座位圆角半径
    minScale: 0.5,       // 最小缩放比例
    maxScale: 3,         // 最大缩放比例
    initialScale: 1      // 初始缩放比例
});
```

## API

该`MovieSeatSelection`类提供以下方法：

* `clearSelection()`: 清除所有选中的座位
* `getSelectedSeats()`: 获取当前选中的座位数组
* `preselectSeats(seats)`: 预选座位，传入一个包含`{row, col}`对象的数组
* `resetView()`: 重置缩放和平移状态到初始视图

## 技术实现

* 使用HTML5 Canvas绘制座位和标签
* 使用事件委托处理座位点击
* 支持触摸和鼠标事件处理
* 实现画布的变换（缩放和平移）
* 使用面向对象编程思想封装功能
* 支持自定义配置和外部API
* 响应式设计，适配不同设备

## 移动设备支持

系统针对移动设备做了特别优化：

* 添加了触摸事件支持（touchstart, touchmove, touchend）
* 使用 touch-action: none 防止浏览器默认的触摸行为干扰
* 针对移动设备提供了响应式样式调整
* 添加了直观的使用说明

## 示例

```html
<!-- HTML部分 -->
<div class="canvas-container">
    <canvas id="seatCanvas"></canvas>
</div>
<div id="selectedSeats"></div>
<button id="resetViewButton">重置视图</button>

<!-- JavaScript部分 -->
<script src="script.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const seatSelection = new MovieSeatSelection('seatCanvas', 'selectedSeats', {
            minScale: 0.5,
            maxScale: 3
        });
        
        document.getElementById('resetViewButton').addEventListener('click', function() {
            seatSelection.resetView();
        });
    });
</script>
```
