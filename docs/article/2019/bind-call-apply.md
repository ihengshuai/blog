---
title: 使用bind、call、apply改变this指向
description: js中如何使用bind、call、apply改变this指向
head:
  - - meta
    - name: keywords
      content: this指向,bind,apply,call,js,js改变this
---

# bind、call、apply使用技巧

## 介绍与使用方法
```js
// call
fn.call(thisArg[, arg1[, arg2[, arg3]]])
// apply
fn.apply(thisArg, [argsArray])
// bind
fn.bind(thisArg[, arg1[, arg2[, arg3]]])()
```
### apply介绍
语法：

`fun.apply(thisArg, [argsArray])`

- thisArg：在 fun 函数运行时指定的 this 值。需要注意的是，指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象（浏览器中就是window对象），同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象。
- argsArray：一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 fun 函数。如果该参数的值为null 或 undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。浏览器兼容性请参阅本文底部内容。

示例：
```js
var a ={
    name : "Cherry",
    fn : function (a,b) {
        console.log( a + b)
    }
}
var b = a.fn;
b.apply(a,[1,2])     // 3
```

### call介绍
语法：

`fun.call(thisArg[, arg1[, arg2[, ...]]])`

- call的参数是thisArg，thisArg代表若干个参数列表

示例：
```js
var a ={
    name : "Cherry",
    fn : function (a,b) {
        console.log( a + b)
    }
}
var b = a.fn;
b.call(a,1,2)       // 3
```

### bind介绍
语法：

`fun.bind(thisArg[, arg1[, arg2[, ...]]])()`

- bind的参数是thisArg，thisArg代表若干个参数列表
- bind改变this指向返回的是`function`需要手动调用

示例：
```js
var a ={
    name : "Cherry",
    fn : function (a,b) {
        console.log( a + b)
    }
}
var b = a.fn;
b.bind(a,1,2)()           // 3
```

## 三者区别

>apply和call基本上相似，他们的区别只是传入的参数不同

`bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。`

## 手写call，apply，bind
下面我们来简单的实现一下这三者

### 手写call
```js
Function.prototype.mycall = function(context){
    if(typeof this !== 'function'){
        throw new TypeError('Error')
    }
    context = context || window
    context.fn = this
    const args = [...argrments].slice(1)
    let result = context.fn(...args)
    delete context.fn
    return result
}
```
解析：

- 首先 `context` 为可选参数，如果不传的话默认上下文为 `window`
- 接下来给 `context` 创建一个 `fn` 属性，并将值设置为需要调用的函数
- 因为 `call` 可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来
- 然后调用函数并将对象上的函数删除

### 手写apply
```js
Function.prototype.myapply = function(context) {
    if(typeof this !== 'function'){
        throw new TypeError('Error')
    }
    context = context || window
    context.fn = this
    let result
    arguments[1] ? result = context.fn(...arguments[1]) : context.fn()
    delete context.fn
    return result
}
```

解析：
同上(基本相似)

### 手写bind
```js
Function.prototype.mybind = function(context) {
    if(typeof this !== 'function'){
        throw new TypeError('Error')
    }
    const args = [...arguments].slice(1)
    const _this = this
    return function F(){
        if(this instanceof F){
            return new _this(...args, ...arguments)
        }
        return _this.apply(context, args.concat(...arguments))
    }
}
```
解析：

- 前几步和之前的实现差不多，就不赘述了
- `bind` 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 `new` 的方式，我们先来说直接调用的方式
- 对于直接调用来说，这里选择了 `apply` 的方式实现，但是对于参数需要注意以下情况：因为 `bind` 可以实现类似这样的代码 `f.bind(obj, 1)(2)`，所以我们需要将两边的参数拼接起来，于是就有了这样的实现 `args.concat(...arguments)`
- 最后来说通过 `new` 的方式，在之前的章节中我们学习过如何判断 `this`，对于 `new` 的情况来说，不会被任何方式改变 `this`，所以对于这种情况我们需要忽略传入的 `this` 

## 最后
希望以上的解析还可以帮助你进一步理解三者的概念和使用方法，手写的实现方法可能会有一些小问题，你可以进行补充，如果你喜欢本篇文章，动动小手分享出去，关注[GitHub](https://github.com/ihengshuai)更多优质项目等你来开箱:smile:


<Reward />
<Gitalk />