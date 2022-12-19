# Canvas

```js
ctx = canvas.getContext("2d")
```

### 基本
```js
// 移动画笔
ctx.moveTo(x, y)

// 开始新的路径
ctx.beginPath()

// 直线
ctx.lineTo(x, y)

// 闭合路径
ctx.closePath()

// 保存
ctx.save()

// 重置，恢复至上一个save状态
ctx.restore()

// 绘制图形轮廓
ctx.stroke()

// stroke颜色
ctx.strokeStyle = "salmon"

// fill填充颜色
ctx.fillStyle = "blue"

// 绘制矩形
ctx.stokeRect(startX, startY, width, height);
ctx.fillRect(startX, startY, width, height);

// 填充闭合路径
ctx.fill();

// 清除画布
ctx.clearRect(startX, startY, width, height);
```

### 文字
```js
// 描边文字
ctx.strokeText(text, x, y, maxWidth?)

// 填充文字
ctx.fillText(text, x, y, maxWidth?)

// 字体(同css)
ctx.font = "20px sans-serif";

// 对齐方式 start end left right center
ctx.textAlign = "center"

// 基线对齐 top hanging middle alphabetic ideographic bottom
ctx.textBaseline = "alphabetic"

// 文字方向 ltr rtl inherit
ctx.direction = ""

// 测量文字宽度
ctx.measureText("haha")
```

### 圆弧
```js
// 画圆
ctx.arc(x, y, r, startAngle, endAngle, direction = true)
ctx.arc(100, 100, 100, 0, Math.PI * 2)

// 两个控制点画圆
ctx.arcTo(x1, y1, x2, y2, r)
```

### 坐标系转换
> translate、transform

```js

```