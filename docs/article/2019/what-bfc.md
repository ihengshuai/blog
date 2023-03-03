---
title: BFC渲染规则
description: 彻底搞懂CSS中的BFC概念帮助你写出更好地css
head:
  - - meta
    - name: keywords
      content: CSS,BFC,块级格式化上下文,margin重叠,css渲染规则,两栏布局
---

# BFC总结

## 前言
在写css样式时，可能是添加了一个样式后就达到了预期效果。有没有想过，是我们在不经意间触发了什么，帮助我们达到了效果？本文就快速介绍下css样式中经常使用的BFC，主要包括以下几个方面：
>1. 什么是BFC
>2. 如何生成BFC
>3. BFC的布局规则
>4. 应用

## 什么是BFC
### 首先看下什么是Formatting Context
- CSS2.1规范中的一个概念
- 它是指页面中的一块渲染区域，并拥有一套渲染规则，它决定了其子元素将如何定位，以及与其他元素的关系和相互作用。最常见的Formatting Context有BFC(Block Fomatting Context)和IFC(Inline Formatting Context)
- CSS2.1 中只有BFC和IFC，CSS3中还增加了GFC和FFC

### BFC
块级格式化上下文，它是一个独立的渲染区域，该区域拥有一套渲染规则来约束块级盒子的布局，并且与这个区域外部无关。

## 如何生成BFC
`CSS2.1规定满足下列CSS声明之一的元素便会生成BFC：`
- float的值不为none
- overflow的值不为visible
- display的值为inline-block、table-cell、table-caption、flex、inline-flex
- position的值为absolute或者fixed

## BFC的布局规则
1. 内部的元素会在垂直方向上一个接一个的放置；
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻的Box的margin会发生重叠；

### 可应用到解决margin重叠的问题中：
>可在其中一个元素外包裹一层容器，并触发该容器生成BFC（overflow:hidden;），这样两个元素就不属于同一个BFC了，就不会发生margin重叠的问题了。下面应用中会举例阐述。

3. 生成BFC元素的子元素中，每一个子元素的margin与包含块的左边界border相接触（对于从左到右的格式化，否则相反），即使存在浮动也是如此；
4. BFC的区域不会与float元素区域重叠

### 可应用到两栏布局中：
>一个元素是浮动元素，可触发另一个非浮动元素生成BFC（overflow:hidden;）。由于“BFC的区域不会与float元素区域重叠”，因此可以实现两栏布局。下面应用中会举例阐述。

5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。
6. 计算BFC的高度时，浮动元素也参与计算

### 可应用到解决浮动元素的父元素高度塌陷问题中：
>如果父元素的子元素都是浮动元素，那么父元素的高度会发生高度塌陷（height:0）。可触发父元素生成BFC（overflow:hidden;）那么在“计算BFC的高度时，浮动元素也参与计算”，实现清除了内部浮动的效果。下面应用中会举例阐述。

## 应用
在上述BFC的布局规则中已经简单介绍了下3个利用BFC布局规则的实例了，下面按序分别举例说明：
### 解决margin重叠的问题
**举例：**
```html
<!DOCTYPE html>
<html lang="en">

<head>
        <meta charset="UTF-8">
        <title>BFC的应用:解决margin重叠问题</title>
        <style type="text/css">
                body {
                        margin: 0;
                        padding: 0;
                }

                .container p {
                        margin: 25px 10px;
                        background-color: palevioletred;
                        border: 1px solid black;
                }
        </style>
</head>

<body>
        <div class="container">
                <p>the first line</p>
                <p>the second line</p>
                <p>the third line</p>
        </div>
</body>

</html>
```
**效果：**

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwumuirgrj30dr069gld.jpg)

以第一行来看，它距离顶部的垂直距离，和距离第二行的垂直距离是一样的。说明第一行的margin-bottom和第二行的margin-top发生了重叠，不然第一行到第二行的距离，应该是50px，是第一行距离顶部距离的两倍。

解决方法上面已经介绍过：可在其中一个元素外包裹一层容器，并触发该容器生成BFC（overflow:hidden;），这样两个元素就不属于同一个BFC了，就不会发生margin重叠的问题了。

**据此修改：**

```html
<!DOCTYPE html>
<html lang="en">

<head>
        <meta charset="UTF-8">
        <title>BFC的应用:解决margin重叠问题</title>
        <style type="text/css">
                body {
                        margin: 0;
                        padding: 0;
                }

                .container p {
                        margin: 25px 10px;
                        background-color: palevioletred;
                        border: 1px solid black;
                }

                .wrap {
                        overflow: hidden;
                }
        </style>
</head>

<body>
        <div class="container">
                <p>the first line</p>
                <div class="wrap">
                        <p>the second line</p>
                </div>
                <p>the third line</p>
        </div>
</body>

</html>
```
**效果**

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwunpjwzyj30dr07x3ya.jpg)

这样就解决了margin重叠的问题

### 两栏布局问题

两栏布局有很多解决方案，比如用flex，这里介绍BFC的解决方案

**举例：**

```html
<!DOCTYPE html>
<html lang="en">

<head>
        <meta charset="UTF-8">
        <title>BFC的应用</title>
        <style type="text/css">
                body {
                        margin: 0;
                        padding: 0;
                }

                .container {
                        width: 500px;
                        border: 1px solid black;
                }

                .left {
                        width: 200px;
                        height: 200px;
                        background-color: palevioletred;
                        float: left;
                }

                .right {
                        width: 300px;
                        height: 400px;
                        background-color: skyblue;
                }
        </style>
</head>

<body>
        <div class="container">
                <div class="left">left</div>
                <div class="right">right</div>
        </div>
</body>

</html>
```

**效果：**

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwuocvrf7j30hq0ect8j.jpg)

左栏是浮动元素，会脱离文档流，浮在文档流元素上。

BFC的解决方法：

可触发另一个非浮动元素生成BFC（overflow:hidden;）。由于“BFC的区域不会与float元素区域重叠”，因此可以实现两栏布局。

`修改.right的样式：`

```css
.right {
  ...
  overflow: hidden;
}
```

**效果**

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwuot30mmj30ht0egwea.jpg)

不过我个人觉得这样做只是让BFC的区域不会与float元素区域重叠，实现了两栏布局效果，但并不是自适应的两栏布局，上述例子只是刚好父容器的宽度=左盒子宽度+右盒子宽度（大于时也可以）。如果把父容器的container的宽度，设为一个小于左盒子的宽度+右边盒子的宽度值（200px+300px），如400px时，就会看到这样的效果：

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwup92fwsj30ep0lbdfn.jpg)

说明左右两个盒子并不会自动调整宽度来自适应的布局。

要想实现自适应的两栏布局也很简单，直接设置父元素的display:flex;即可。

修改样式：

```css
.container {
  ...
  display: flex;
}
```

右盒子不需要设置overflow:hidden;

**效果：**

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwupnyyabj30em0eeq2q.jpg)

可以看出左右盒子都按比例调整了自身的宽度:

200px:300px=2:3，

左栏新宽度=2/(2+3)*400=160px;

右栏新宽度=3/(2+3)*400=240px;

结果也确实如此：

**左栏：**

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwuqsn22wj30jh0c4jrq.jpg)

**右栏：**

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwurathszj30jh0bhglw.jpg)

### 解决浮动元素的父元素高度塌陷的问题

**举例：**

```html
<!DOCTYPE html>
<html lang="en">

<head>
        <meta charset="UTF-8">
        <title>BFC的应用:解决浮动问题</title>
        <style type="text/css">
                body {
                        margin: 0;
                        padding: 0;
                }

                .container {
                        width: 500px;
                        border: 1px solid black;
                }

                .left {
                        width: 200px;
                        height: 200px;
                        background-color: palevioletred;
                        float: left;
                }

                .right {
                        width: 300px;
                        height: 400px;
                        background-color: skyblue;
                        float:left;
                }
        </style>
</head>

<body>
        <div class="container">
                <div class="left">left</div>
                <div class="right">right</div>
        </div>
</body>

</html>
```

**效果：**

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwurofo2qj30i10e80sk.jpg)

如果父元素的子元素都是浮动元素，那么父元素的高度会发生高度塌陷。

解决方法：

可触发父元素生成BFC（overflow:hidden;）那么在“计算BFC的高度时，浮动元素也参与计算”，实现清除了内部浮动的效果。

修改样式，让父元素生成BFC：

```css
.container {
  ...
  overflow: hidden;
}
```

**效果：**

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gkwus4cz3bj30i10eaglf.jpg)

父元素的高度被撑起来了，为右盒子的高度400px;

## 小结

关于BFC的内容也是属于老生常谈的问题，关于BFC只需要知道，使用一定的CSS声明可以生成BFC，浏览器对生成的BFC有一系列的渲染规则，利用这些渲染规则可以达到一定的布局效果。为了达到特定的布局效果，我们让元素生成BFC

>本文内容摘自 [前端林子](https://cloud.tencent.com/developer/article/1385300)


<Reward />
<Gitalk />