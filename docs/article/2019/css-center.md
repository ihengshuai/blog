---
title: css的10中居中方式
description: css居中样式可以用10种方法完成
head:
  - - meta
    - name: keywords
      content: CSS居中,css垂直居中
---

# css的10中居中方式

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk67fvy7eqj30id06y3yk.jpg)

>要实现上图的效果看似很简单，实则暗藏玄机，本文总结了一下CSS实现水平垂直居中的方式大概有下面这些，本文将逐一介绍一下
仅居中元素定宽高适用
- absolute + 负margin
- absolute + margin auto
- absolute + calc

居中元素不定宽高
- absolute + transform
- lineheight
- writing-mode
- table
- css-table
- flex
- grid

## absolute + 负margin
为了实现上面的效果先来做些准备工作，假设HTML代码如下，总共两个元素，父元素和子元素
```html
<div class="wp">
    <div class="box size">123123</div>
</div>
```

wp是父元素的类名，box是子元素的类名，因为有定宽和不定宽的区别，size用来表示指定宽度，下面是所有效果都要用到的公共代码，主要是设置颜色和宽高

`后面不在重复这段公共代码，只会给出相应提示`

```css
/* 公共代码 */
.wp {
    border: 1px solid red;
    width: 300px;
    height: 300px;
}
.box {
    background: green;    
}
.box.size{
    width: 100px;
    height: 100px;
}
/* 公共代码 */
```
绝对定位的百分比是相对于父元素的宽高，通过这个特性可以让子元素的居中显示，但绝对定位是基于子元素的左上角，期望的效果是子元素的中心居中显示

为了修正这个问题，可以借助外边距的负值，负的外边距可以让元素向相反方向定位，通过指定子元素的外边距为子元素宽度一半的负值，就可以让子元素居中了，css代码如下

```css
/* 此处引用上面的公共代码 */
/* 此处引用上面的公共代码 */
/* 定位代码 */
.wp {
    position: relative;
}
.box {
    position: absolute;;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
}
```

这是我比较常用的方式，这种方式比较好理解，兼容性也很好，缺点是需要知道子元素的宽高

## absolute + margin auto
这种方式也要求居中元素的宽高必须固定，HTML代码如下

```css
<div class="wp">
    <div class="box size">123123</div>
</div>
```
这种方式通过设置各个方向的距离都是0，此时再讲margin设为auto，就可以在各个方向上居中了
```css
/* 此处引用上面的公共代码 */
/* 此处引用上面的公共代码 */
/* 定位代码 */
.wp {
    position: relative;
}
.box {
    position: absolute;;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```

这种方法兼容性也很好，缺点是需要知道子元素的宽高

## absolute + calc
这种方式也要求居中元素的宽高必须固定，所以我们为box增加size类，HTML代码如下

```html
<div class="wp">
    <div class="box size">123123</div>
</div>
```

感谢css3带来了计算属性，既然top的百分比是基于元素的左上角，那么在减去宽度的一半就好了，代码如下

```css
/* 此处引用上面的公共代码 */
/* 此处引用上面的公共代码 */
/* 定位代码 */
.wp {
    position: relative;
}
.box {
    position: absolute;;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
}
```

这种方法兼容性依赖calc的兼容性，缺点是需要知道子元素的宽高

## absolute + transform
还是绝对定位，但这个方法不需要子元素固定宽高，所以不再需要size类了，HTML代码如下
```html
<div class="wp">
    <div class="box">123123</div>
</div>
```

修复绝对定位的问题，还可以使用css3新增的transform，transform的translate属性也可以设置百分比，其是相对于自身的宽和高，所以可以讲translate设置为-50%，就可以做到居中了，代码如下

```css
/* 此处引用上面的公共代码 */
/* 此处引用上面的公共代码 */
/* 定位代码 */
.wp {
    position: relative;
}
.box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

`这种方法兼容性依赖translate2d的兼容性`

## lineheight
利用行内元素居中属性也可以做到水平垂直居中，HTML代码如下
```html
<div class="wp">
    <div class="box">123123</div>
</div>
```

把box设置为行内元素，通过`text-align`就可以做到水平居中，但很多同学可能不知道通过通过`vertical-align`也可以在垂直方向做到居中，代码如下
```css
/* 此处引用上面的公共代码 */
/* 此处引用上面的公共代码 */
/* 定位代码 */
.wp {
    line-height: 300px;
    text-align: center;
    font-size: 0px;
}
.box {
    font-size: 16px;
    display: inline-block;
    vertical-align: middle;
    line-height: initial;
    text-align: left; /* 修正文字 */
}
```

`这种方法需要在子元素中将文字显示重置为想要的效果`

## writing-mode
很多同学一定和我一样不知道`writing-mode`属性，感谢@张鑫旭老师的反馈，简单来说writing-mode可以改变文字的显示方向，比如可以通过`writing-mode`让文字的显示变为垂直方向
```html
<div class="div1">水平方向</div>
<div class="div2">垂直方向</div>
.div2 {
    writing-mode: vertical-lr;
}
```
更神奇的是所有水平方向上的css属性，都会变为垂直方向上的属性，比如text-align，通过`writing-mode`和`text-align`就可以做到水平和垂直方向的居中了，只不过要稍微麻烦一点
```html
<div class="wp">
    <div class="wp-inner">
        <div class="box">123123</div>
    </div>
</div>
```
```css
/* 此处引用上面的公共代码 */
/* 此处引用上面的公共代码 */
/* 定位代码 */
.wp {
    writing-mode: vertical-lr;
    text-align: center;
}
.wp-inner {
    writing-mode: horizontal-tb;
    display: inline-block;
    text-align: center;
    width: 100%;
}
.box {
    display: inline-block;
    margin: auto;
    text-align: left;
}
```
`这种方法实现起来和理解起来都稍微有些复杂`

## table
曾经table被用来做页面布局，现在没人这么做了，但table也能够实现水平垂直居中，但是会增加很多冗余代码
```html
<table>
    <tbody>
        <tr>
            <td class="wp">
                <div class="box">123123</div>
            </td>
        </tr>
    </tbody>
</table>
```
tabel单元格中的内容天然就是垂直居中的，只要添加一个水平居中属性就好了
```css
.wp {
    text-align: center;
}
.box {
    display: inline-block;
}
```
`这种方法就是代码太冗余，而且也不是table的正确用法`

## css-table
css新增的table属性，可以让我们把普通元素，变为table元素的现实效果，通过这个特性也可以实现水平垂直居中
```html
<div class="wp">
    <div class="box">123123</div>
</div>
```
下面通过css属性，可以让div显示的和table一样
```css
.wp {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
.box {
    display: inline-block;
}
```

`这种方法和table一样的原理，但却没有那么多冗余代码，兼容性也还不错`

## flex
flex作为现代的布局方案，颠覆了过去的经验，只需几行代码就可以优雅的做到水平垂直居中
```html
<div class="wp">
    <div class="box">123123</div>
</div>
```
```css
.wp {
    display: flex;
    justify-content: center;
    align-items: center;
}
```
`目前在移动端已经完全可以使用flex了，PC端需要看自己业务的兼容性情况`

## grid
感谢@一丝姐 反馈的这个方案，css新出的网格布局，由于兼容性不太好，一直没太关注，通过grid也可以实现水平垂直居中

```html
<div class="wp">
    <div class="box">123123</div>
</div>
```
```css
.wp {
    display: grid;
}
.box {
    align-self: center;
    justify-self: center;
}
```
`代码量也很少，但兼容性不如flex，不推荐使用`

## 总结
下面对比下各个方式的优缺点，肯定又双叒叕该有同学说回字的写法了，简单总结下
- PC端有兼容性要求，宽高固定，推荐absolute + 负margin
- PC端有兼容要求，宽高不固定，推荐css-table
- PC端无兼容性要求，推荐flex
- 移动端推荐使用flex

|方法|居中元素定宽高固定|PC兼容性|移动端兼容性|
|:---------:|:---------:|:------------:|:----------------:|
|absolute + 负margin|是|ie6+, chrome4+, firefox2+|安卓2.3+, iOS6+|
|absolute + margin auto|是|ie6+, chrome4+, firefox2+|安卓2.3+, iOS6+|
|absolute + calc|是|ie9+, chrome19+, firefox4+|安卓4.4+, iOS6+|
|absolute + transform|否|ie9+, chrome4+, firefox3.5+|安卓3+, iOS6+|
|writing-mode|否|ie6+, chrome4+, firefox3.5+|安卓2.3+, iOS5.1+|
|lineheight|否|ie6+, chrome4+, firefox2+|安卓2.3+, iOS6+|
|table|否|ie6+, chrome4+, firefox2+	|安卓2.3+, iOS6+|
|css-table|否|ie8+, chrome4+, firefox2+|安卓2.3+, iOS6+|
|flex|否|ie10+, chrome4+, firefox2+|安卓2.3+, iOS6+|
|grid|否|ie10+, chrome57+, firefox52+	|安卓6+, iOS10.3+|

最近发现很多同学都对css不够重视，这其实是不正确的，比如下面的这么简单的问题都有那么多同学不会，我也是很无语
```html
<div class="red blue">123</div>
<div class="blue red">123</div>
.red {
    color: red
}

.blue {
    color: blue
}
```
问两个div的颜色分别是什么，竟然只有40%的同学能够答对，这40%中还有很多同学不知道为什么，希望这些同学好好补习下CSS基础


<Reward />
<Gitalk />