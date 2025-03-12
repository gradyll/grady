class MovieSeatSelection {
    constructor(canvasId, infoElementId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.infoElement = document.getElementById(infoElementId);
        
        // 默认配置
        this.config = {
            rows: options.rows || 8,           // 座位行数
            cols: options.cols || 12,          // 座位列数
            seatSize: options.seatSize || 30,  // 座位大小
            seatPadding: options.seatPadding || 10,   // 座位间距
            seatColor: options.seatColor || '#ccc',   // 未选中的座位颜色
            selectedColor: options.selectedColor || '#66aaff', // 选中的座位颜色
            borderColor: options.borderColor || '#999',     // 座位边框颜色
            textColor: options.textColor || '#333',         // 文字颜色
            showRowColLabels: options.showRowColLabels !== undefined ? options.showRowColLabels : true,  // 是否显示行列标签
            labelPadding: options.labelPadding || 30,       // 标签间距
            seatRadius: options.seatRadius || 5,            // 座位圆角半径
            minScale: options.minScale || 0.5,              // 最小缩放比例
            maxScale: options.maxScale || 3,                // 最大缩放比例
            initialScale: options.initialScale || 1,         // 初始缩放比例
        };
        
        // 存储选中的座位
        this.selectedSeats = [];
        
        // 计算画布大小
        this.canvasWidth = this.config.cols * (this.config.seatSize + this.config.seatPadding) + this.config.labelPadding;
        this.canvasHeight = this.config.rows * (this.config.seatSize + this.config.seatPadding) + this.config.labelPadding;
        
        // 设置画布大小
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        
        // 缩放和平移变量
        this.scale = this.config.initialScale;
        this.translateX = 0;
        this.translateY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.isDragging = false;
        this.pinchStartDistance = 0;
        this.initialPinchScale = 1;
        this.isPinching = false;
        this.touches = [];
        
        // 绑定事件处理
        this.bindEvents();
        
        // 初始绘制
        this.drawSeats();
    }
    
    // 绑定事件
    bindEvents() {
        // 鼠标点击事件
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        
        // 鼠标拖动事件
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // 鼠标滚轮缩放事件
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        
        // 触摸事件 (用于手机平板等触摸设备)
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    // 处理鼠标按下
    handleMouseDown(event) {
        // 只响应非左键点击作为拖动
        if (event.button === 0 && !this.isClickOnSeat(event.clientX, event.clientY)) {
            this.isDragging = true;
            this.lastX = event.clientX;
            this.lastY = event.clientY;
            this.canvas.style.cursor = 'grabbing';
        }
    }
    
    // 处理鼠标移动
    handleMouseMove(event) {
        if (this.isDragging) {
            const deltaX = event.clientX - this.lastX;
            const deltaY = event.clientY - this.lastY;
            
            this.translateX += deltaX / this.scale;
            this.translateY += deltaY / this.scale;
            
            this.lastX = event.clientX;
            this.lastY = event.clientY;
            
            this.drawSeats();
        }
    }
    
    // 处理鼠标释放
    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.canvas.style.cursor = 'default';
        }
    }
    
    // 处理鼠标滚轮
    handleWheel(event) {
        event.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // 转换为画布坐标
        const canvasX = (mouseX / this.scale) - this.translateX;
        const canvasY = (mouseY / this.scale) - this.translateY;
        
        // 缩放比例 (根据滚轮方向)
        const scaleFactor = event.deltaY < 0 ? 1.1 : 0.9;
        const newScale = this.scale * scaleFactor;
        
        // 限制缩放范围
        if (newScale >= this.config.minScale && newScale <= this.config.maxScale) {
            this.scale = newScale;
            
            // 调整平移以保持鼠标指向的点不变
            this.translateX = (mouseX / this.scale) - canvasX;
            this.translateY = (mouseY / this.scale) - canvasY;
            
            this.drawSeats();
        }
    }
    
    // 处理触摸开始
    handleTouchStart(event) {
        event.preventDefault();
        
        this.touches = Array.from(event.touches).map(touch => ({
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
        }));
        
        if (this.touches.length === 1) {
            // 单指触摸 - 检查是否点击了座位
            const touch = event.touches[0];
            this.handleSingleTouch(touch.clientX, touch.clientY);
            
            // 记录拖动起始位置
            this.lastX = touch.clientX;
            this.lastY = touch.clientY;
            this.isDragging = true;
        } else if (this.touches.length === 2) {
            // 双指触摸 - 准备缩放
            this.isPinching = true;
            this.isDragging = false;
            
            // 计算双指之间的距离
            this.pinchStartDistance = this.getDistance(
                this.touches[0].x, this.touches[0].y,
                this.touches[1].x, this.touches[1].y
            );
            this.initialPinchScale = this.scale;
        }
    }
    
    // 处理触摸移动
    handleTouchMove(event) {
        event.preventDefault();
        
        if (this.isPinching && event.touches.length === 2) {
            // 双指缩放
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            
            // 计算当前双指之间的距离
            const currentDistance = this.getDistance(
                touch1.clientX, touch1.clientY,
                touch2.clientX, touch2.clientY
            );
            
            // 计算缩放比例
            const scale = (currentDistance / this.pinchStartDistance) * this.initialPinchScale;
            
            // 限制缩放范围
            if (scale >= this.config.minScale && scale <= this.config.maxScale) {
                // 计算缩放中心点
                const rect = this.canvas.getBoundingClientRect();
                const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
                const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
                
                // 转换为画布坐标
                const canvasX = (centerX / this.scale) - this.translateX;
                const canvasY = (centerY / this.scale) - this.translateY;
                
                // 更新缩放
                this.scale = scale;
                
                // 调整平移以保持中心点不变
                this.translateX = (centerX / this.scale) - canvasX;
                this.translateY = (centerY / this.scale) - canvasY;
                
                this.drawSeats();
            }
        } else if (this.isDragging && event.touches.length === 1) {
            // 单指拖动
            const touch = event.touches[0];
            const deltaX = touch.clientX - this.lastX;
            const deltaY = touch.clientY - this.lastY;
            
            this.translateX += deltaX / this.scale;
            this.translateY += deltaY / this.scale;
            
            this.lastX = touch.clientX;
            this.lastY = touch.clientY;
            
            this.drawSeats();
        }
    }
    
    // 处理触摸结束
    handleTouchEnd(event) {
        // 更新当前触摸点
        this.touches = Array.from(event.touches).map(touch => ({
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
        }));
        
        // 如果没有触摸点，重置状态
        if (this.touches.length === 0) {
            this.isDragging = false;
            this.isPinching = false;
        } else if (this.touches.length === 1) {
            // 从双指到单指，重置为拖动模式
            this.isPinching = false;
            this.isDragging = true;
            this.lastX = this.touches[0].x;
            this.lastY = this.touches[0].y;
        }
    }
    
    // 计算两点之间的距离
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    // 检查点击位置是否在座位上
    isClickOnSeat(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        // 转换为画布坐标系
        const canvasX = (x / this.scale) - this.translateX;
        const canvasY = (y / this.scale) - this.translateY;
        
        // 检查是否点击了座位
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                const seatX = this.config.labelPadding + col * (this.config.seatSize + this.config.seatPadding);
                const seatY = this.config.labelPadding + row * (this.config.seatSize + this.config.seatPadding);
                
                if (
                    canvasX >= seatX && canvasX <= seatX + this.config.seatSize &&
                    canvasY >= seatY && canvasY <= seatY + this.config.seatSize
                ) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // 处理单指触摸（可能是点击座位）
    handleSingleTouch(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        // 转换为画布坐标系
        const canvasX = (x / this.scale) - this.translateX;
        const canvasY = (y / this.scale) - this.translateY;
        
        // 检查是否点击了座位
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                const seatX = this.config.labelPadding + col * (this.config.seatSize + this.config.seatPadding);
                const seatY = this.config.labelPadding + row * (this.config.seatSize + this.config.seatPadding);
                
                if (
                    canvasX >= seatX && canvasX <= seatX + this.config.seatSize &&
                    canvasY >= seatY && canvasY <= seatY + this.config.seatSize
                ) {
                    this.toggleSeat(row, col);
                    this.isDragging = false; // 如果点击了座位，不触发拖动
                    return;
                }
            }
        }
    }
    
    // 处理点击事件
    handleClick(event) {
        // 如果正在拖动，不处理点击
        if (this.isDragging) {
            return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // 转换为画布坐标系
        const canvasX = (x / this.scale) - this.translateX;
        const canvasY = (y / this.scale) - this.translateY;
        
        // 检查是否点击了座位
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                const seatX = this.config.labelPadding + col * (this.config.seatSize + this.config.seatPadding);
                const seatY = this.config.labelPadding + row * (this.config.seatSize + this.config.seatPadding);
                
                if (
                    canvasX >= seatX && canvasX <= seatX + this.config.seatSize &&
                    canvasY >= seatY && canvasY <= seatY + this.config.seatSize
                ) {
                    // 切换座位选中状态
                    this.toggleSeat(row, col);
                    return;
                }
            }
        }
    }
    
    // 切换座位选中状态
    toggleSeat(row, col) {
        const seatIndex = this.selectedSeats.findIndex(seat => seat.row === row && seat.col === col);
        
        if (seatIndex === -1) {
            // 添加座位
            this.selectedSeats.push({ row, col });
        } else {
            // 移除座位
            this.selectedSeats.splice(seatIndex, 1);
        }
        
        // 重新绘制
        this.drawSeats();
    }
    
    // 绘制座位
    drawSeats() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 保存当前状态
        this.ctx.save();
        
        // 应用缩放和平移变换
        this.ctx.translate(this.translateX * this.scale, this.translateY * this.scale);
        this.ctx.scale(this.scale, this.scale);
        
        // 绘制行列标签
        if (this.config.showRowColLabels) {
            this.drawLabels();
        }
        
        // 绘制所有座位
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                const x = this.config.labelPadding + col * (this.config.seatSize + this.config.seatPadding);
                const y = this.config.labelPadding + row * (this.config.seatSize + this.config.seatPadding);
                
                const isSelected = this.selectedSeats.some(seat => seat.row === row && seat.col === col);
                
                // 绘制座位
                this.ctx.fillStyle = isSelected ? this.config.selectedColor : this.config.seatColor;
                this.ctx.strokeStyle = this.config.borderColor;
                this.ctx.lineWidth = 1;
                
                // 座位为圆角矩形
                this.roundRect(
                    this.ctx, 
                    x, 
                    y, 
                    this.config.seatSize, 
                    this.config.seatSize, 
                    this.config.seatRadius, 
                    true, 
                    true
                );
            }
        }
        
        // 恢复状态
        this.ctx.restore();
        
        // 更新已选座位信息
        this.updateSelectedSeatsInfo();
    }
    
    // 绘制标签
    drawLabels() {
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = this.config.textColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // 绘制列标签 (1, 2, 3, ...)
        for (let col = 0; col < this.config.cols; col++) {
            const x = this.config.labelPadding + col * (this.config.seatSize + this.config.seatPadding) + this.config.seatSize / 2;
            const y = this.config.labelPadding / 2;
            this.ctx.fillText((col + 1).toString(), x, y);
        }
        
        // 绘制行标签 (A, B, C, ...)
        for (let row = 0; row < this.config.rows; row++) {
            const x = this.config.labelPadding / 2;
            const y = this.config.labelPadding + row * (this.config.seatSize + this.config.seatPadding) + this.config.seatSize / 2;
            this.ctx.fillText(String.fromCharCode(65 + row), x, y);
        }
    }
    
    // 绘制圆角矩形
    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }
    
    // 更新已选座位信息
    updateSelectedSeatsInfo() {
        if (this.selectedSeats.length === 0) {
            this.infoElement.textContent = '已选座位: 无';
        } else {
            const seatList = this.selectedSeats.map(seat => {
                const rowLabel = String.fromCharCode(65 + seat.row); // A, B, C, ...
                const colLabel = seat.col + 1; // 1, 2, 3, ...
                return `${rowLabel}排${colLabel}列`;
            }).join(', ');
            
            this.infoElement.textContent = `已选座位: ${seatList}`;
        }
    }
    
    // 获取已选择的座位
    getSelectedSeats() {
        return this.selectedSeats.map(seat => ({
            row: seat.row,
            col: seat.col,
            rowLabel: String.fromCharCode(65 + seat.row),
            colLabel: seat.col + 1
        }));
    }
    
    // 清除所有选中的座位
    clearSelection() {
        this.selectedSeats = [];
        this.drawSeats();
    }
    
    // 重置缩放和平移
    resetView() {
        this.scale = this.config.initialScale;
        this.translateX = 0;
        this.translateY = 0;
        this.drawSeats();
    }
    
    // 预选座位
    preselectSeats(seats) {
        if (!Array.isArray(seats)) return;
        
        seats.forEach(seat => {
            if (seat.row !== undefined && seat.col !== undefined) {
                // 检查是否已选中
                const exists = this.selectedSeats.some(s => s.row === seat.row && s.col === seat.col);
                if (!exists) {
                    this.selectedSeats.push({ row: seat.row, col: seat.col });
                }
            }
        });
        
        this.drawSeats();
    }
}

// 导出类以便在其他文件中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MovieSeatSelection;
} 