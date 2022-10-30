---
title: 从JavaScript中看设计模式
description: 一文吃透前端设计模式让你的代码水平更上一层楼
head:
  - - meta
    - name: keywords
      content: 设计模式,单例模式,发布订阅,策略模式,代理模式,装饰器模式,外观模式,工厂模式,迭代器模式,建造者模式,适配器模式等等
---

# 从JavaScript中看设计模式

![](https://cdn.jsdelivr.net/gh/1046224544/cdn1@master/imgs/design-index.png)

设计模式 (Design Pattern) 是一套被反复使用、多数人知晓的、经过分类的、代码设计经验的总结,任何事情都有套路，设计模式就是写代码中常见的套路，有些写法我们日常都在使用，下面我们来介绍一下。

## 概念

> 设计模式 (Design Pattern) 是一套被反复使用、多数人知晓的、经过分类的、代码设计经验的总结。
任何事情都有套路，`设计模式`就是写代码中常见的套路，有些写法我们日常都在使用，下面我们来介绍一下。

## 订阅/发布模式(观察者)

`pub/sub`这个应该大家用到的最广的设计 模式了

在这种模式中，并不是一个对象调用另一个对象的方法，而是一个对象`订阅`另一个对象

特定活动并在状态改变后获得通知，订阅者因此也成为观察者，而被观察的对象成为发布者或主题。当发生了一个重要事件的时候`发布者`会通知（调用）所有订阅者并且可能经常以事件对象的形式传递消息。

>  自己实现一个简单的发布订阅设计模式
```js
// 创建EventBus
class EventBus {
  constructor() {
    // 储存事件
    this.tasks = {};
  }
  // 绑定事件
  $on(eName, cb) {
    typeof cb == "function"
      ? this.tasks[eName] || (this.tasks[eName] = [])
      : this.Error(cb, "is not a function");
    this.tasks[eName].some(fn => fn == cb) 
      ? true 
      : this.tasks[eName].push(cb); // 避免重复绑定
  }
  // 触发事件
  $emit(eName, ...arg) {
    let taskQueue;
    this.tasks[eName] && this.tasks[eName].length > 0
      ? (taskQueue = this.tasks[eName])
      : this.Error(eName, "is not defined or is a array of having empty callback");
    taskQueue.forEach(fn => {
      fn(...arg);
    });
  }
  // 触发一次
  $once(eName, cb) {
    let fn = (...arg) => {
      this.$off(eName, fn);
      cb(...arg);
    };
    typeof cb == "function" && this.$on(eName, fn);
  }
  // 卸载事件
  $off(eName, cb) {
    let taskQueue;
    this.tasks[eName] && this.tasks[eName].length > 0
      ? (taskQueue = this.tasks[eName])
      : this.Error(eName, "is not exist");
    if (typeof cb === "function") {
      let index = taskQueue.findIndex(v => (v == cb));
      index != -1 &&
        taskQueue.splice(
          taskQueue.findIndex(v => (v == cb)),
          1
        );
    }
    if (typeof cb === "undefined") {
      taskQueue.length = 0;
    }
  }
  // 异常处理
  Error(node, errorMsg) {
    throw Error(`${node} ${errorMsg}`);
  }
}
```

下面我们针对自己的模式进行简单的使用:

```js
// 首先定义一个事件池
const EventSinks = {
  add(x, y) {
    console.log("总和: " + x + y);
  },
  multip(x, y) {
    console.log("乘积: " + x * y);
  },
  onceEvent() {
    console.log("我执行一次后就自动卸载");
  }
};
// 实例化对象
let bus = new EventBus();
bus.$on("operator", EventSinks.add); // 监听operator事件, 增加一个EventSinks.add
bus.$on("operator", EventSinks.add); // 当事件名和回调函数相同时，跳过，避免重复绑定
bus.$on("operator", EventSinks.multip); // 给operator事件增加一个EventSinks.multip回调函数
bus.$once("onceEvent", EventSinks.onceEvent); // 触发一次后卸载
console.log(bus.tasks); // { operator: [ [Function: add], [Function: multip] ], onceEvent: [ [Function: fn] ]}
bus.$emit("operator", 3, 5); // 总和:8  乘积:15
bus.$emit("onceEvent"); // 我就执行一次
console.log(bus.tasks); // { operator: [ [Function: add], [Function: multip] ], onceEvent: [] }
bus.$off("operator", EventSinks.add); // 卸载掉operator事件中的EventSinks.add函数体
console.log(bus.tasks); // { operator: [ [Function: multip] ], onceEvent: [] }
bus.$off("operator"); // 卸载operator事件的所有回调函数
console.log(bus.tasks); // { operator: [], onceEvent: [] }
bus.$emit("onceEvent"); // onceEvent is not defined or is a array of having empty callback
```

## 单例模式

> 单例模式的定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。实现的方法为先判断实例存在与否，如果存在则直接返回，否则就创建实例再返回，这就保证了一个类只实例化一次
使用场景：一个单一对象。比如：弹窗，无论点击多少次，弹窗只应该被创建一次，实现起来也很简单，用一个变量缓存起来即可。可以参考ElementUI模态框的实现

> 模仿一下单例模式（只要有个变量确保实例只创建一次）
```js
class Singleton {
  constructor() {}
}
Singleton.getInstance = (function() {
  let instance
  return function() {
    if (!instance) {
      instance = new Singleton()
    }
    return instance
  }
})()
let s1 = Singleton.getInstance()
let s2 = Singleton.getInstance()
console.log(s1 === s2) // true
```

当我们再次创建时，如果实例化了，就不在实例化，直接返回，上面可以看出，二者相同

## 策略模式

> 策略模式的定义：定义一系列的算法，把他们一个个封装起来，并且使他们可以互相替换
策略模式的目的就是将算法的使用算法的实现分离出来

一个基于策略模式的程序至少由两部分组成。第一部分是`一组策略类（可变）`，策略类封装了具体的算法，并负责具体的计算过程。第二部分是`环境类Context`（不变），Context接受客户的请求，随后将请求委托给某一个策略类。要做到这一点，说明Context中要维持对某个策略对象的引用

举个表单校验栗子:

```js
// 普通写法
const form = document.querySelector("#form");
form.onsubmit = () => {
  if (form.username.value == "") {
    console.log("用户名不能为空");
    return false;
  }
  if(form.username.password.length < 10){
    console.log('密码长度不能小于10')
    return false
  }
}
```

> 简单的策略模式
```js
// 创建校验器
const checker = {
  isEmpty(v, errorMsg){
    if(value === ''){
      return errorMsg
    }
  },
  minLength(v, length, errorMsg){
    if(value.length < length){
      return errorMsg
    }
  }
}
const validator = () => {
  // 校验规则存储
  this.cache = []
}
validator.prototype.add = () => {
  let arr = rule.split(':')
  this.cache.push(() => {
    let valit = arr.shift()
    arr.unshift(dom.value)
    arr.push(errorMsg)
    return checker[valit].apply(dom, arr)
  })
}
validator.prototype.start = () => {
  for(let i = 0, validatorFunc; validatorFunc = this.cache[i++];){
    // 开始校验，并取得校验后的返回值
    let msg = validatorFunc() 
    if(msg){
      return msg
    }
  }
}
const validatorFunc = () => {
  // 创建一个validator对象
  let valit = new validator() 
  valit.add(form.username, 'isEmpty', '用户名不能为空')
  valit.add(form.password, 'minLength', '密码长度不能小于10')
  // 获得校验结果
  let errorMsg = valit.start()  
  return errorMsg  
}
// 再次登录
const form = document.querySelector("#form");
form.onsubmit = () => {
  let errorMsg = validatorFunc()
  if(errorMsg){
    console.error(errorMsg)
    return false
  }
}
```

当创建校验器后，校验规则清晰明了，可以动态增改，便于维护

## 代理模式

> 代理模式的定义：为一个对象提供一个代用品或占位符，以便控制它的访问
常用的虚拟代理形式：某一个花销很大的操作，可以通过虚拟代理的方式延迟这种需要他的时候才去创建（例：使用虚拟代理实现图片懒加载）

图片懒加载的方式：先通过一张loading图占位，然后通过异步的方式加载图片，等图片加载好了再把请求成功的图片加载到img标签上

栗子:

```js
const imgFunc = (() => {
    const imgNode = document.createElement('img')
    document.body.appendChild(imgNode)
    return{
        setSrc: function(src){
            imgNode.src = src
        }
    }
})()
const proxyImage = (() => {
    let img = new Image()
    img.onload = function(){
        imgFunc.setSrc(this.src)
    }
    return {
        setSrc: function(src){
            imgFunc.setSrc('./loading.gif')
            img.src = src
        }
    }
})()
proxyImage.setSrc('./pic.png')()
```

上面的栗子实现了加载图片时，在图片加载成功前，指定特定的图片，加载完成后替换成真是的数据

> 在我们生活中常用的事件代理、节流防抖函数其实都是代理模式的实现
## 装饰器模式

> 装饰器模式的定义：在不改变对象自身的基础上，在程序运行期间给对象动态地添加方法，注解也可以理解为装饰器。常见应用：react的高阶组件，或者react-redux中的@connect或者自己定义一些高阶组件
简单实现:

```js
import React from 'react'
const withLog = Component => {
  // 完好无损渲染出来, 只是添加了两个生命周期函数
  class NewComponent extends React.Component{
    // 1
    componentWillMount(){ 
      console.time('ComponentRender')
      console.log('准备完毕了')
    }
    render(){  // 完好无损渲染出来
      return <Component { ...this.props }></Component>
    }
    // 2
    componentDidMount(){
      console.timeEnd('ComponentRender')
      console.log('渲染完毕了')
    }
  }
  return NewComponent
}
export { withLog }
@withLog
class xxx
```

在redux中可以找出装饰器的方式，其实`Vue`中的`v-input`，`v-checkbox`也可以认为是装饰器模式，对原生input和checkbox做一层装饰

装饰器模式和代理模式的结构看起来非常相似，这两种模式都描述了怎样为对象提供一定程度上的间接引用，并且向那个对象发送请求。代理模式和装饰器模式最重要的区别在于它们的意图和设计目的。`代理模式的目的是`：当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者。`装饰模式目的是`：为对象动态加入的行为，本体定义了关键功能，而装饰器提供或拒绝它的访问，或者在访问本体前做一些额外的事。

## 外观模式

> 外观模式的定义：即在内部让多个方法一起被调用
涉及到兼容性，参数支持多格式，有很多这种代码，对外暴露统一`API`，比如上面的`$on`支持数组，`$off`参数支持多种情况，对面只用一个函数，内部判断实现

举个简单的栗子：

```js
// 封装一些事件，让其兼容各个浏览器
const myEvent = {
  stopBubble(e){
    if(typeof e.preventDefault() === 'function'){
      e.preventDefault()
    }
    if(typeof e.stopPropagation() === 'function'){
      e.stopPropagation()
    }
    // for IE
    if(typeof e.returnValue === 'boolean'){
      e.returnValue = false
    }
    if(typeof e.cancelBubble === 'boolean'){
      e.cancelBubble = false
    }
  },
  addEvent(dom, type, cb){
    if(dom.addEventListener){
      dom.addEventListener(type, cb, false)
    } else if(dom.attachEvent){
      dom.attachEvent('on' + type, cb)
    }else{
      dom['on' + type] = cb
    }
  }
}
```

以上就用外观模式封装了两个基本事件，让其兼容各种浏览器，调用者不需要知道内部的构造，只要知道这个方法怎么用就行了。

## 工厂模式

> 工厂模式的定义：提供创建对象的接口，把成员对象的创建工作转交给一个外部对象，好处就是消除对象直接的耦合（也就是相互影响）
常见的栗子，我们的弹窗message，对外部提供API，都是调用API，然后新建一个弹窗或者message的实例，就是典型的工程模式

简单的栗子：

```js
class Man {
  constructor(name) {
    this.name = name
  }
  say(){
      console.log(`我的名字 ` + this.name)
  }
}
const p = new Man('JavaScript')
p.say() // 我的名字 JavaScript
```

当然工厂模式并不仅仅是用来 new 出实例

可以想象一个场景。假设有一份很复杂的代码需要用户去调用，但是用户并不关心这些复杂的代码，只需要你提供给我一个接口去调用，用户只负责传递需要的参数，至于这些参数怎么使用，内部有什么逻辑是不关心的，只需要你最后返回我一个实例。这个构造过程就是工厂。

再比如下面Vue这个例子：

```js
const Notification = function(options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  let userOnClose = options.onClose;
  let id = "notification_" + seed++;
  let postion = options.postion || "top-right";
  options.onClose = function() {
    Notification.close(id, userOnClose);
  };
  instance = new NotificationConstructor({
    data: options
  });
  if(isVNode(options.message)){
    instance.$slots.default = [options.message]
    options.message = 'REPLACED_BY_VNODE'
  }
  instance.id = id
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.visible = true
  instance.dom = instance.$el
  instance.dom.style.zIndex = PopupManager.nextZIndex()
  let verticalOffset = options.offset || 0
  instances.filter(item => {
    verticalOffset += item.$el.offsetHeight + 16
  })
  verticalOffset += 16
  instance.verticalOffset = verticalOffset
  instances.push(instance)
  return instance
};
```

在上述代码中，我们可以调用它封装好的方法就可以创建对象实例，至于它内部的实现原理我们并不关心。

## 建造者模式Builder

> 建造者模式的定义：和工厂者模式相比，参与了更多创建过程或者更加复杂
```js
const Person = function(name, work){
  // 创建应聘者缓存对象
  let _person = new Human()
  // 创建应聘者姓名解析对象
  _person.name = new NamedNodeMap(name)
  // 创建应聘者期望职位
  _person.work = new Worker(work)
  return _person
}
const p = new Person('小明', 'Java')
console.log(p)
```

## 迭代器模式

> 迭代器模式定义：指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素
比如常用的：every、map、filter、forEach等等

```js
const each = function(arr, callback){
  if(!Array.isArray(arr)){
    throw Error(`${arr} is not a Array`)
  }
  for(let i = 0, l = arr.length; i < l; i++){
    callback.call(arr[i], i, arr[i])
  }
}
each([1,2,4], function(i, n){
  console.log([i, n])
})
```

## 享元模式

> 享元（flyweight）模式的定义：一种用于性能优化的模式，`fly`在这里是苍蝇的意思，意为蝇量级。享元模式的核心是运用共享技术来有效支持大量细粒度的对象。如果系统中因为创建了大量类似的对象而导致内存占用过高，享元模式就是非常有用了。在JavaScript中，浏览器特别是移动端的浏览器分配的内存并不多，如何节省内存就成了一件非常有意义的事情
假设有个内衣工厂，目前的产品有50中男衣和50中女士内衣，为了推销产品，工厂决定生产一些塑料模特来穿上他们的内衣拍成广告照片。正常情况下需要50个男模特和50个女模特，然后让他们每人分别穿上一件内衣来拍照

普通的做法：

```js
const Model = function(sex, underwear){
  this.sex = sex
  this.underwear = underwear
}
Model.prototype.takePhoto = function(){
  console.log('sex=' + this.sex + ' underwear=' + this.underwear)
}
for(let i = 1; i <= 50; i++){
  let maleModel = new Model('male', 'underwear' + i)
  maleModel.takePhoto()
}
for(let join = 1; join <= 50; join++){
  let femaleModel = new Model('female', 'underwear' + join)
  femaleModel.takePhoto()
}
```

采用享元模式：

```js
const Model = function(sex){
  this.sex = sex
}
Model.prototype.takePhoto = function(){
  console.log('sex=' + this.sex + ' underwear=' + this.underwear)
}
// 分别创建一个男模特和一个女模特对象
let maleModel = new Model('male'),
    femaleModel = new Model('female')
// 给男模特依次穿上所有的男装，并进行拍照
for(let i = 1; i <= 50; i++){
  maleModel.underwear = 'underwear' + i
  maleModel.takePhoto()
}
// 给女模特依次穿上所有的女装，并进行拍照
for(let j = 1; j <= 50; j++){
  femaleModel.underwear = 'underwear' + j
  femaleModel.takePhoto()
}
```

- 内部状态存储于对象内部
- 内部状态可以被一些对象共享
- 内部状态独立于具体的场景，通常不会改变
- 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

## 职责链模式

> 职责链模式的定义：使多个对象都有机会处理请求，从而避免请求发送者和接受者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，知道有一个对象处理它为止。职责链模式的名字非常形象，一系列可能会处理请求的对象被连成一条链，请求在这些对象之间依次传递，知道遇到一个可以处理它的对象，我们把这些对象称为链中的节点
简单的栗子：假设我们负责一个售卖手机的电商网站，分别经过缴纳500元定金和200元定金的两轮预定后（订单已在此时生成），现在已经到了正式购买的阶段。公司针对支付过预定金的用户有一定的优惠政策。在正式购买后，已经支付过500元定金的用户会受到100元的商城优惠券，200元定金的用户可以收到50元的优惠券，而之前没有支付定金的用户只能进入普通购买模式，也就是没有优惠券，且在存库有限的情况下不一定保证买到

```js
let order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log("500元定金预购，得到100元优惠券");
  } else {
    // 我不知道下一个节点是谁，反正把请求往后面传递
    return "nextSuccessor";
  }
};
let order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log("200元定金预购，得到50元优惠券");
  } else {
    return "nextSuccessor";
  }
};
let orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log("普通购买， 无优惠券");
  } else {
    console.log("库存不足");
  }
};
let Chain = function(fn) {
  this.fn = fn;
  this.successor = null;
};
// Chain.prototype.setNextSuccessor 指定在链中的下一个节点
Chain.prototype.setNextSuccessor = function(successor) {
  return (this.successor = successor);
};
// Chain.prototype.passRequest 传递请求给某个节点
Chain.prototype.passRequest = function() {
  let ret = this.fn.apply(this, arguments);
  if (ret === "nextSuccessor") {
    return (
      this.successor &&
      this.successor.passRequest.apply(this.successor, arguments)
    );
  }
  return ret;
};
let chainOrder500 = new Chain(order500)
let chainOrder200 = new Chain(order200)
let chainOrderNormal = new Chain(orderNormal)
chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderNormal)
// 500元定金预购，得到100元优惠券
chainOrder500.passRequest(1, true, 500)
// 200元定金预购，得到50元优惠券
chainOrder500.passRequest(2, true, 500)
// 普通购买，无优惠券
chainOrder500.passRequest(3, true, 500)
// 库存不足
chainOrder500.passRequest(1, false, 0)
```

## 适配器模式

> 适配器模式定义：解决两个软件实体间的接口不兼容的问题。使用适配器模式之后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。适配器的别名是包装器（wrapper），这是一个相对简单的模式。在程序开发过程中有许多这样的场景：当我们试图调用模块或者对象的某个接口时，却发现这个接口的格式并不符合目前需求。这时候有两种解决办法，第一种是修改原来的接口实现，但如果原来的模板很复杂，或者我们拿到模块是一段别人编写的经过压缩的代码，修改原接口就显得不太现实了。第二种方法是创建一个适配器，将原接口转换为客户希望的另一个接口，客户只需要和适配器打交道
```js
let googleMap = {
  show: function(){
    console.log('开始渲染谷歌地图')
  }
}
let baiduMap = {
  display: function(){
    console.log('开始渲染百度地图')
  }
}
let baiduMapAdapter = {
  show: function(){
    return baiduMap.display()
  }
}
renderMap(googleMap)  // 开始渲染谷歌地图
renderMap(baiduMapAdapter)  // 开始渲染百度地图
```

适配器模式主要用来解决两个已有接口不匹配的问题，它不考虑这接口时怎么实现的，也不考虑他们将来可能会如何演化。适配器模式不需要改变已有的接口，就能够使他们协同作用

装饰模式和代理模式也不会改变原有对象的接口，但装饰器模式的作用是为了给对象增加功能。装饰器模式常常形成一条长的装饰链，适配器模式通常只包装一次。代理模式为了控制对对象的访问，通常也只包装一次。

我们设计很多插件，有默认值，也算是适配器的一种应用，vue的prop校验，default也算是适配器的应用了

外观模式的作用倒是和适配器比较相似，有人把外观模式看成一组对象的适配器，但外观模式最显著的特点是定义了一个新的接口。

## 模板方法模式

> 模板方法模式定义：在一个方法中定义一个算法骨架，而将一些步骤的实现延迟到子类中。模板方法使得子类可以在不改变算法结构的情况下，重新定义算法中某些步骤的具体实现
我们常用的有很多，vue中的slot，react中的children

```js
class Parent {
  constructor() {}
  render() {
    <div>
      <div name="tom"></div>
      {/* 算法过程：children要渲染在name为joe的div中 */}
      <div name="joe">{this.props.children}</div>
    </div>
  }
}
class Stage{
  constructor(){}
  render(){
    // 在parent中已经设定了children的渲染位置算法
    <Parent>
      // children的具体实现
      <div>child</div>
    </Parent>
  }
}
```

```html
<template>
  <div>
    <div name="tom"></div>
    <div name="joe">
      <slot />
    </div>
  </div>
</template>
<template>
  <div>
    <parent>
      <!-- children的具体实现 -->
      <div>child</div>
    </parent>
  </div>
</template>
```
## 中介者模式

> 中介者模式的定义：通过一个中介者对象，其他所有的相关对象都通过该中介者来通信，而不是相互引用，当其中的一个对象发生改变时，只需要通知中介者对象即可。通过中介者模式可以解除对象与对象之间的紧耦合关系（目的就是减少耦合）
栗子：现实生活中，航线上的飞机只需要和机场的塔台通信就能确定航线和飞行状态，而不需要和所有飞机通信。同时塔台作为中介者，知道每架飞机的飞行状态，所以可以安排所有飞机的起降和航信安排。

中介者模式使用场景：例如购物车需求，存在商品选择表单、颜色选择表单、购买数量表单等等，都会触发change事件，那么可以通过中介者来转发处理这些事件，实现各个事件间的解耦，仅仅维护中介者对象即可。

redux、vuex都属于中介者模式的实际应用，我们把共享的数据，抽离成一个单独的store，每个都通过tore这个中介者来操作对象

## 备忘录模式

> 备忘录模式定义：可以恢复到对象之前的某个状态，其实大家学习react或者redux的时候，时间旅行的功能，就算是备忘录模式的一个应用

## 推荐设计模式书籍
- [Head First设计模式](https://book.douban.com/subject/2243615/)
- [大话设计模式](https://book.douban.com/subject/2334288/)
- [设计模式（可复用面向对象软件的基础）(初学者不适)](https://book.douban.com/subject/1052241/)
- [JavaScript设计模式和开发实践](https://book.douban.com/subject/26382780/)
- [图解设计模式](https://book.douban.com/subject/26933281/)
## 总结
创建设计模式：工厂，单例、建造者、原型
结构化设计模式：外观，适配器，代理，装饰器，享元，桥接，组合
行为型模式：策略、模板方法、观察者、迭代器、责任链、命令、备忘录、状态、访问者、终结者、解释器


<Reward />
<Gitalk />