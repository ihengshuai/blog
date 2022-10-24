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
Javascript有`string`、`number`、`boolean`、`undefined`、`null`、`symbol`、`bigint`等几种基本类型，其它都可以看做`object`类型，只有`object`对象才会有原型。<u>**每个对象内部都会包含一个隐藏的`[[Prototype]]`属性，这个属性就是原型，它指向它的构造函数的prototype属性**</u>，它不能直接被访问，现在推荐通过`Object.getPrototypeOf(obj)`进行访问，取代非标准的`__proto__`属性进行访问，它是[[Prototype]]的历史原因，是原型对象的`getter/setter`，不过`__proto__`已被浏览器包括服务端都已支持，因此不用担心使用，以下都以`__proto__`作为原型属性介绍。

原型也是一个普通对象，指向构造函数的prototype属性，对象自己和原型之间通过链接的方式引用，当改变原型对象时，所有的子对象的原型都会同步改变。

>若prototype属性不是很清楚后面会介绍，先记住概念，后面就会[解释](/frontend/js/proto-inherit.html#构造函数)

```js{9,12,15,17}
// 1. 创建原型对象
const user = { name: "Tom" };

// 2. 创建原型对象为user的u1、u2
const u1 = Object.create(user);
u1.age = 1;
const u2 = Object.create(user);
u2.age = 2;
console.log(u1.__proto__ === user); // => true
console.log(u2.__proto__ === user); // => true
console.log(u1.__proto__ === u2.__proto__); // => true
console.log(u1.name, u2.name); // => Tom, Tom

// 3. 改变原型对象
user.name = "Jerry";
user.foo = "bar";
console.log(u1.name, u1.foo); // => Jerry, bar
console.log(u2.name, u2.foo); // => Jerry, bar
```

:::warning
原型对象不能形成闭环，原型只能是对象或者null，其它值都会被忽略

__proto__不等于[[prototype]]

修改原型是个非常耗时的操作，避免频繁修改原型
:::

以上代码可以看出原型对象和普通对象没有什么区别，对象本身和原型对象以引用的关系存在。

原型大家理解了后，那原型链也很快就懂了，这也是以上`u1/u2`可以访问到`name`属性的关键。

<u>每个对象都有一个`[[Protype]]`或`__proto__`属性指向它的[构造函数](https://baike.baidu.com/item/%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0)的`prototype`属性也就是原型，原型对象也是个普通对象，它也有自己的原型即`__proto__`属性，也指向到它的构造函数的`prototype`属性，就这样层层向上，直到Object的原型`null`，也称为原型链的顶端，这就是原型链。</u>

>若prototype属性不是很清楚后面会介绍，先记住概念，后面就会[解释](/frontend/js/proto-inherit.html#构造函数)

JS中当访问对象的属性时，会先查看当前对象是否存在此属性，如果不存在会从当前对象的原型链中查找属性，直到原型链的顶端，这也是为什么`u1/u2`可以访问`name`属性的原因。

这是一张非常经典的原型链图，如果你能看懂这图，那你已经掌握了，如果有看不懂的，接着下面的内容。

![proto-chain.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7cwsf7066j30gz0l4jv0.jpg)

设置原型的方式有多种，下面介绍多种方式加深大家的理解。

### 属性访问器
前面介绍了`__proto__`其实是`[[Prototype]]`原型的`getter/setter`，可以直接对象属性赋值的方式改变原型，这种方式最好理解。

```js{6,10}
const cat = { name: 'cat', food: 'mouse' };

console.log(cat.__proto__ === Object.prototype); // true

// 通过 __proto__ 方式给原型添加方法 eat
cat.__proto__.eat = function () {
  console.log("eat: ", this.food); // this指向 cat
};

console.log(cat.__proto__ === Object.prototype); // true

// 执行原型中的eat方法
cat.eat(); // => mouse
```

从代码可以看出cat的原始原型就是`Object.prototype`(10行)，当手动给原型添加eat方法时，并没有覆盖原型，而是在Object.prototype的基础上添加了`eat`方法，因此cat的原型还是`Object.prototype`对象，看下此时的cat结构

![QQ截图20221021105110.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7cpy1resdj30le0bewip.jpg)

接着上面代码，直接设置原型对象而不是添加属性：

```js{9}
const cat = { name: 'cat', food: 'mouse' };
// 直接覆盖了原型对象
cat.__proto__ = {
  eat: function () {
    console.log("eat: ", this.food); // this指向 cat
  }
};
console.log(cat.__proto__ === Object.prototype); // false
console.log(cat.__proto__.__proto__ === Object.prototype); // true
console.dir(cat);
```

上面高亮那行代码，通过直接覆盖原型对象的方式添加原型不再是`Object.prototype`，而原型的原型才会是`Object.prototype`，现在看下`cat`的结构。

![QQ截图20221021111204.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7cqjnm2azj30n40bzafq.jpg)

以上便是`__proto__`方式添加原型，对于`prototype`属性接下来看看构造器。

### 构造函数
在JS世界里只有函数才会有[构造器](https://baike.baidu.com/item/%E6%9E%84%E9%80%A0%E5%99%A8)(尽管ES6有class这种类似Java的语法，其本质还是函数)，如前面的`Object`就是个函数用来构造对象，可以用`o = new Object([...args])`来构造一个普通对象。每个函数都有`prototype`属性，它和原型对象`[[Prototype]]`不是一个概念，可以认为是个普通的对象，默认只有一个属性`constructor`，它指向函数本身。

![QQ截图20221021121302.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7csb2wjjdj30fm048js6.jpg)

![QQ截图20221021113431.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7cr7016vjj30t905q40n.jpg)

普通函数的原型指向它的构造函数的`prototype`属性即：`App.__proto__ === Function.prototype`，在JS的世界里<u>所有构造函数</u>的原型指向Function的prototype，如：`Object.__proto__ === Function.prototype`

```js
Function.__proto__ === Function.prototype // true
Object.__proto__ === Function.prototype // true
Array.__proto__ === Function.prototype // true
String.__proto__ === Function.prototype // true
Boolean.__proto__ === Function.prototype // true
Number.__proto__ === Function.prototype // true
Date.__proto__ === Function.prototype // true
RegExp.__proto__ === Function.prototype // true
Blob.__proto__ === Function.prototype // true
ArrayBuffer.__proto__ === Function.prototype // true
```

了解了构造函数的原型后，下面来说函数特有属性`prototype`的作用。

<u>**在函数作为构造函数使用时`new 构造函数`会生成一个新的对象，这个对象的原型指向构造函数的prototype属性**</u>，而作为普通函数使用时，prototype和普通的对象属性没有区别。

```js{4}
function User() {};
// 作为构造函数
u1 = new User();
console.log(u1.__proto__ === User.prototype); // true

// 作为普通函数
u2 = User(); // undefined
```
上面第4行高亮处已经证明了，当函数作为构造函数时，函数的prototype属性，将会作为对象的原型，那原型的对象是不是就是prototype的原型，上面已经介绍过原型直接通过链接的方式引用，接下来证明上面的概念：

```js
function User(name) { this.name = name; };
User.prototype.say = function() { console.log("my name is ", this.name);};
u1 = new User('Tom');
u1.say(); // my name is Tom
console.log(u1.__proto__.__proto__ === User.prototype.__proto__) // true

// 修改prototype原型
const customProto = { name: "custom proto" };
Object.setPrototypeOf(User.prototype, customProto);
console.log(u1.__proto__.__proto__ === User.prototype.__proto__) // true
console.log(u1.__proto__.__proto__ === customProto) // true
console.log(User.prototype.__proto__ === customProto) // true

// 现在修改prototype的属性和原型
User.prototype.run = () => console.log('I am running...');
customProto.length = 1;
console.dir(u1);
```

![QQ截图20221021125128.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7ctf3fx0tj30nv0dvgqk.jpg)

从上图和代码中可以证明原型链都是以引用的方式存在，修改原型的属性会同步改变，函数prototype的改变也会影响到对象的原型。<u>如果将prototype设置为null，将不会影响到已有的对象，为什么呢？已生成的对象已经对原型对象做了引用，当赋值prototype为null时，原型对象的引用数将会变成已经存在的对象的数量。如果再次给原型对象赋值新的值，也不会影响到原有的对象。</u>

在原型的定义中我们知道原型指向它的的构造函数的prototype属性，通过上面构造函数的知识我们知道以`new`的形式生成指向prototype属性，那可能有人好奇，字面量定义的对象为什么符合这样的逻辑，那是因为字面量创建的对象<u>js内部会隐式的以`new Object`创建对象。</u>
```js
u1 = { name: "susi", age: 10 };
// js内部会以 new Object()的形式创建，如下没有区别
u2 = new Object({ name: "susi", age: 10 });
console.log(u1.__proto__ === Object.prototype); // true
console.log(u2.__proto__ === Object.prototype) // true
console.log(u1.__proto__ === u2.__proto__); // true

// 不过一般不会这样创建对象，都会以字面量的方式创建，简单方便易懂
```
### Object.create
这个方法也常来定义一个指定原型的对象，所以只能提前定义好原型对象，除了生成并没有提供对应的获取原型的方法，来看使用。
```js
u1 = Object.create({ name: "Tom" });
console.log(u1.__proto__.name); // Tom

// 定义原型为null的对象
u2 = Object.create(null);
```

更多详见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

### Object.setPrototypeOf/getPrototypeOf
这两个方法是ES6新添加的，[setPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)、[getPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)分别用来设置和获取原型，相对于`Object.create`方式更加完善。

```js
user = { name: "Tom" };
proto = {
  say: function() { console.log("I am ", this.name); }
}
// 设置原型
Object.setPrototypeOf(user, proto);
user.say(); // I am Tom

// 获取原型
console.log(Object.getPrototypeOf(user) === proto); // true
console.log(Object.getPrototypeOf(user));
```

![QQ截图20221021142342.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7cw31x3vaj30ij09mq7e.jpg)

讲了这么多原型和原型链大家应该已经明白是怎么回事了，那它到底有什么用呢？我们知道js访问对象的属性时会先访问对象本身是否存在该属性，如果不存在则会从它的原型链上去查询。假如已经定义了一个People对象，内部有很多属性和方法，现在要求新建一个Student对象，它不但会有People的所有方法还会有自定义的方法。所以能从People那边将方法移植到Student上，将会大大减小代码量，这也是个非常好的代码架构方式。

在JS中都是以原型为基础进行继承的，通过上面原型的学习，接下来让我们看看JS继承吧。

## new内幕
在了解继承前，先来看看new操作。
```js{10}
function User(name) { this.name = name; }
User.prototype.say = function() { console.log("I'm ", this.name) };
const user = new User("Lucky"); // User{ name: "Lucky" } => 具有User原型方法的对象

// 显式返回一个对象
function User(name) {
  this.name = name;
  return { age: 1 };
}
const user = new User("Lucky"); // { age: 1} => 普通对象(没意义)
```
当new构造函数时会产生一个全新的对象，new操作毫无意义(以下都是在无显式返回对象基础分析)，正常情况下这内部会涉及到哪些步骤：
- 生成一个全新对象，如果没有显式返回对象，这个对象会继承User的原型prototype
- 函数的this将会指向生成的对象上
- 生成的对象的原型指向函数的`prototype`对象
- 如果函数显式返回对象类型的值(`Object/Array/Function/RegExp`...)，new和普通函数调用将没有任何区别
- 如果返回非对象类型的值，将会忽略显式返回值并返回内部生成的新对象

我们知道了new做了什么后，其实可以自己手动实现new的操作，这里简单实现原理：
```js
// new implement
function newOperator(Ctor, ...args) {
  if (typeof Ctor !== "function") {
    throw TypeError(`${Ctor} is not a function!`)
  }
  const newObj = Object.create(Ctor.prototype);
  const ctorReturn = Ctor.apply(newObj, args || []);
  if (Object.prototype.toString.call(ctorReturn) !== "[object Null]" && typeof ctorReturn === "object") {
    return ctorReturn;
  }
  return newObj;
}
```

## 原型链继承
原型链继承是最基本的继承，这和所有对象都有`__proto__`属性概念一样

```js{12,26,27,28}
function Parent(name) {
  this.name = name;
  this.sons = ["Tom", "Jerry"];
}
Parent.prototype.say = function() {
  console.log("my name:", this.name);
}
function Child(food) {
  this.food = food;
}
// 将Parent的实例作为Child的prototype
Child.prototype = new Parent();
Child.prototype.eat = function() {
  console.log("I eat:", this.food);
}

const child = new Child('noodles');
child.say(); // my name: undefinded
child.eat(); // I eat noodles
console.log(c1.sons); // // ['Tom', 'Jerry']

const c2 = new Child("rice");
c2.eat(); // I eat rice
console.log(c2.sons); // ['Tom', 'Jerry']

c1.sons.push("Lucky");
console.log(c1.sons, c2.sons); //  ['Tom', 'Jerry', 'Lucky'], ['Tom', 'Jerry', 'Lucky']
console.log(c1.__proto__ === c2.__proto__); // true
```
以上就是最简单原型链继承，了解原型链相信一看就懂。这样继承子类可以拿到父类的属性还有`prototype`上的方法，但很明显的缺点就是，父类是个实例对象，那么所有子类对于父类的继承都是引用(28行已经证明了引用)，当一个子类修改父类中的属性或方法时，都会影响到其它的子类(代码26,27行)；还有一个缺点无法对父类进行传参。
- 优点：<u>可以继承父类的属性和原型方法；</u>
- 缺点：<u>父类在子类之间共享，会造成数据之间的污染和篡改；无法给父类传参；</u>

## 构造函数继承
所谓的构造函数继承是在实例化子类时，对父类构造函数通过`call/apply`改变内部的this指向，让其内部的this的属性可以转嫁给子类，来看下面代码：

```js
function Parent(name) {
  this.name = name;
  this.run = () => console.log("I am running...");
}
Parent.prototype.say = function() {
  console.log("hello");
}
function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
const child = new Child("Tom", 10);
console.log(child.name, child.age); // Tom, 10
child.run(); // I am running...
child.say(); // child.say is not a function
```

## 原型式继承

## 组合式继承

## 寄生式继承

## 寄生组合式继承

## class继承