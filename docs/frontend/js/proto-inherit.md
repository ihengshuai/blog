---
title: 原型链与继承
description: 一文吃透JavaScript的原型、原型链和继承概念和使用技巧
head:
  - - meta
    - name: keywords
      content: 原型,原型链,继承,前端继承,原型链继承,借用构造函数,组合继承,寄生式继承,寄生组合式继承,class继承
---

# 原型链与继承
众所周知js是基于原型的编程语言，相对于传统的[OOP面向对象编程](https://baike.baidu.com/item/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1)还是有一点区别的。每个对象拥有一个原型对象，并从原型那里获得属性、方法等等，这些属性和方法都是定义在其`构造函数的prototype`属性上，通过链接(`__proto__`)进行联系的。而对于传统的OOP，则会定义对应的类，然后在实例化对象时，将属性和方法复制到实例上。

本文将会全面介绍原型、原型链和继承。

## 什么是原型与原型链
Javascript有`string`、`number`、`boolean`、`undefined`、`null`、`symbol`、`bigint`等几种基本类型，其它都可以看做`object`类型，只有`object`对象才会有原型。<u>**每个对象内部都会包含一个隐藏的`[[Prototype]]`属性，这个属性就是原型**</u>，它不能直接被访问，现在可以通过`Object.getPrototypeOf(obj)`进行访问，取代非标准的`__proto__`属性进行访问，它是[[Prototype]]的历史原因，是原型对象的`getter/setter`，不过`__proto__`已被浏览器包括服务端都已支持，因此不用担心使用，以下都以`__proto__`作为原型属性介绍。

原型也是一个普通对象，指向构造函数的prototype属性，对象自己和原型之间通过链接的方式引用，当改变原型对象时，所有的子对象的原型都会同步改变。

```js
// 1. 创建原型对象
const user = { name: "Tom" };

// 2. 创建原型对象为user的u1、u2
const u1 = Object.create(user);
u1.age = 1;
const u2 = Object.create(user);
u2.age = 2;
console.log(u1.name, u2.name); // => Tom, Tom

// 3. 改变原型对象
user.name = "Jerry";
user.foo = "bar";
console.log(u1.name, u1.foo); // => Jerry, bar
console.log(u2.name, u2.foo); // => Jerry, bar
console.log(u1.__proto__ === u2.__proto__); // => true
console.log(u1.__proto__ === user); // => true
console.log(u2.__proto__ === user); // => true
```

以上代码可以看出原型对象和普通对象没有什么区别，对象本身和原型对象以引用的关系存在。

原型大家理解了后，那原型链也很快就懂了，这也是以上`u1/u2`可以访问到`name`属性的关键。

<u>**每个对象都有一个`[[Protype]]`或`__proto__`属性指向它的[构造函数](https://baike.baidu.com/item/%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0)的`prototype`属性也就是原型，原型对象也是个普通对象，它也有自己的原型即`__proto__`属性，也指向到它的构造函数的`prototype`属性，就这样层层向上，直到Object的原型`null`，也称为原型链的顶端，这就是原型链。**</u>

JS中当访问对象的属性时，会先查看当前对象是否存在此属性，如果不存在会从当前对象的原型链中查找属性，直到原型链的顶端，这也是为什么`u1/u2`可以访问`name`属性的原因。

## 原型链继承

## 借用构造函数继承

## 原型式继承

## 组合式继承

## 寄生式继承

## 寄生组合式继承

## class继承