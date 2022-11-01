---
title: 作用域、执行上下文、作用域链和闭包
description: 作用域、执行上下文、作用域链和闭包的理解
head:
  - - meta
    - name: keywords
      content: 作用域,作用域链,执行上下文,闭包,设计模式
---

# 作用域与闭包

## 作用域和词法环境
作用域和词法环境其实很简单，说白了就是关于变量能为谁提供服务，下面我们来搞明白其内部的步骤，首先我们来看下面一段代码：
```js{9,10,13,14,16}
// global scope
let name = "global";
{ // block scope
  let name = "scope";
  let age = 10;
  function log() {
    console.log(name, age);
  }
  console.log(name, age); // scope, 10
  log(); // scope, 10
}
log(); // scope, 10
console.log(name); // global
console.log(age); // age is not defined
{
  console.log(age); // age is not defined
}
```
首先看下执行结果，看是否和你想的一样：
![QQ截图20221101154923.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7podl7w9uj30i804bjst.jpg)

上面定义了一个全局变量`name`，在2-10行用花括号包起来的是个代码块，内部定义了两个变量`name`、`age`，还定义了一个函数`log`，函数也可以看作是变量，15-17行也是个代码块。当在第一个代码块中执行了`console.log(name, age)`和`log()`打印值都为scope、10，应该合乎情理。紧接着在代码块外部执行`log()`，也打印了scope、10，这里为啥也会打印代码块内部的变量值呢？再看看后面分别打印的name和age，分别为global和`age is not defined`，这里应该会奇怪同样是打印相同的变量，确是不同的结果，然后在第二个代码块中也是`age is not defined`，接下来我们来看看。

### 作用域
作用域是指变量所作用的范围，JS中有全局作用域和局部作用域。全局作用域的变量主要是指最顶层定义的变量，像在script顶层定义的变量，而没有嵌套其它如代码块、函数体等，在浏览器环境中全局变量就是指window，在最顶层定义的变量都能在window中访问到。除了全局作用域外，剩下的就是局部作用域，诸如代码块、函数体等内部定义的变量都是局部作用域变量。其实全局作用域也可以被认为包裹着代码块，只不过外层没有其他代码了。

全局作用域中的变量在代码中的任何位置都可以访问到，而在代码块中的变量只能在代码块中访问到，作用域的顶端是全局作用域，这里我们讲浏览器环境也就是window。首先当JS脚本开始运行时，会将脚本整体放入执行栈中执行，然后JS内部也会为当前作用域提供一个`变量对象(VO)`记录着当前上下文中的所有的变量，我们将全局作用域的变量对象称之为`GO(global object)`局部的就称为`VO(variable object)`，这里name被添加进GO：

![QQ截图20221101171236.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7pqs6ona8j30gl04qgmy.jpg)

接着会解析第一个代码块，里面定义了两个变量，


## 变量提升

## 执行上下文

## 作用域链

## 闭包