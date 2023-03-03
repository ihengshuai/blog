---
title: 原型、原型链与继承(构造函数继承、组合继承、寄生组合式继承、class继承)
description: 一文吃透JavaScript的原型、原型链和继承概念和使用技巧，让你明白原型链继承、构造函数继承、原型式继承、组合式继承、寄生式继承、寄生组合式继承、class继承等多种继承方式
head:
  - - meta
    - name: keywords
      content: 原型概念,原型链概念,什么是原型,继承,前端继承,原型链继承,构造函数继承,组合继承,寄生式继承,寄生组合式继承,class继承
---

# 原型、原型链与继承
众所周知js是基于原型的编程语言，相对于传统的[OOP面向对象编程](https://baike.baidu.com/item/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1)还是有一点区别的。在JS中每个对象都会拥有一个原型对象，自己可以从原型那里获得额外的属性、方法等等(可以看做继承)，这些属性和方法都是定义在其`构造函数的prototype`(即原型)属性上，可以通过属性(`__proto__`)进行获取。而对于传统的OOP，则会定义对应的类，然后在实例化对象时，将属性和方法复制到实例上。

本文将会全面介绍原型、原型链和继承。

## 什么是原型与原型链
Javascript有`string`、`number`、`boolean`、`undefined`、`null`、`symbol`、`bigint`等几种基本类型，其它都可以看做`object`类型，只有`object`对象才会有原型。

<u>**JS中每个对象内部都会包含一个隐藏的`[[Prototype]]`属性，这个属性就是原型，它指向它的构造函数的prototype属性，即原型对象为构造函数的`[[prototype]]`属性。**</u>由于历史原因，通常情况下大家都喜欢用`__proto__`访问和修改原型，但它不是ES标准，而是一些浏览器实现了这个非标准的`__proto__`，而后来官方推出`Object.get/setPrototypeOf(obj)`进行操作原型，取代非标准的`__proto__`属性进行访问。

`__proto__`是`[[Prototype]]`的历史原因，是原型对象的`getter/setter`，虽然官方不推荐，不过`__proto__`已被浏览器包括服务端都已支持，因此不用担心使用，以下都以`__proto__`作为原型属性介绍。由于修改原型是个极其耗时的工作，所以不推荐频繁修改它，一般都是在继承时初始化值后尽量减少修改。

原型也是一个普通对象，指向构造函数的prototype属性，对象自己和原型之间通过链接的方式引用，当改变原型对象时，所有的子对象的原型都会同步改变。

>关于构造函数或prototype属性不是很清楚后面会介绍，先记住概念，后面就会[解释](/frontend/js/proto-inherit.html#构造函数)

```js{10,12,14,18,19}
// 1. 创建原型对象
const parent = { parent: "parent" };
const user = { name: "Tom" };

// 2. 创建原型对象为user的u1、u2, 此时 u1和u2 自身都是空对象
const u1 = Object.create(user); // 创建原型为 user 的对象 u1 (Object.create后面会讲)
u1.age = 1; // 为 u1&u2 添加 age 属性
const u2 = Object.create(user);
u2.age = 2;
console.log(u1.__proto__ === user); // => true
console.log(u2.__proto__ === user); // => true
console.log(u1.__proto__ === u2.__proto__); // => true
console.log(u1.name, u2.name); // => Tom, Tom
console.log(u1.parent, u2.parent); // => parent, parent

// 3. 改变原型对象
user.name = "Jerry";
user.foo = "bar";
console.log(u1.name, u1.foo); // => Jerry, bar
console.log(u2.name, u2.foo); // => Jerry, bar
```

:::warning 需要注意
原型对象不能形成闭环，原型只能是对象或者null，其它值都会被忽略

__proto__不等于[[prototype]]

修改原型是个非常耗时的操作，避免频繁修改原型
:::

以上代码可以看出原型对象和普通对象没有什么区别，对象本身和原型对象以引用的关系存在(如上12、18和19行)。原型大家理解了后，那原型链也很快就懂了，这也是以上`u1/u2`可以访问到自身不存在的属性关键所在。

<u>**JS中每个对象都有一个`[[Protype]]`或`__proto__`属性指向它的[构造函数](https://baike.baidu.com/item/%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0)的`prototype`属性也就是原型，原型对象也是个普通对象，它也有自己的原型即`__proto__`属性，也指向到它的构造函数的`prototype`属性，就这样层层向上，直到Object的原型`null`，也称为原型链的顶端，这就是原型链。**</u>

>关于构造函数或prototype属性不是很清楚后面会介绍，先记住概念，后面就会[解释](/frontend/js/proto-inherit.html#构造函数)

JS中当访问对象的属性时，会先查看当前对象是否存在此属性，如果不存在会从当前对象的原型链中查找属性，直到原型链的顶端，这也就解释了`u1/u2`为什么可以访问到自身不存在的属性`name`、`parent`等等。

这是一张非常经典的原型链图，如果你已经掌握了原型的知识，相信看懂它想必并不难。如果有看不懂的，别着急接着下面的内容阅读完后再回头试试。

![proto-chain.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7cwsf7066j30gz0l4jv0.jpg)

首先设置原型的方式有多种，下面介绍多种方式加深大家的理解。

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

![QQ截图20221021105110.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7cpy1resdj30le0bewip.jpg)

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

![QQ截图20221021111204.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7cqjnm2azj30n40bzafq.jpg)

以上便是`__proto__`方式添加原型，对于`prototype`属性接下来看看构造器。

### 构造函数
在JS世界里只有函数才会有[构造器](https://baike.baidu.com/item/%E6%9E%84%E9%80%A0%E5%99%A8)(尽管ES6有class这种类似Java的语法，其本质还是函数)，如前面的`Object`是个创建对象的构造器，可以用`o = new Object([...args])`来构造一个普通对象。每个函数都有`prototype`属性，它和原型对象`[[Prototype]]`不是一个概念，可以认为是个普通的对象，<u>**默认只有一个属性`constructor`，它指向函数本身。**</u>

![QQ截图20221021121302.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7csb2wjjdj30fm048js6.jpg)

![QQ截图20221021113431.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7cr7016vjj30t905q40n.jpg)

函数也可以看做是一个特殊的对象也有自己的原型，<u>**JS中所有函数的原型指向它的构造函数Function的`prototype`属性**</u>如：`App.__proto__ === Function.prototype`、`Object.__proto__ === Function.prototype`、`Function.__proto__ === Function.prototype`

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

函数都有个特殊的属性`prototype`，默认情况下改属性对象只有`constructor`属性执行函数本身，<u>**在函数作为构造函数使用时`new 构造函数`会生成一个新的对象，这个对象的原型会指向构造函数的prototype属性**</u>，而作为普通函数使用时，prototype和普通的对象属性没有区别。

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

![QQ截图20221021125128.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7ctf3fx0tj30nv0dvgqk.jpg)

从上图和代码中可以证明原型链都是以引用的方式存在，修改原型的属性会同步改变，函数prototype的改变也会影响到对象的原型。<u>如果将prototype设置为null，将不会影响到已有的对象，为什么呢？已生成的对象已经对原型对象做了引用，当赋值prototype为null时，原型对象的引用数将会变成已经存在的对象的数量。如果再次给原型对象赋值新的值，也不会影响到原有的对象。</u>

在原型的定义中我们知道原型指向它的的构造函数的prototype属性，通过上面构造函数的知识我们知道以`new`的形式生成的对象如何指向prototype属性，那可能有人好奇，字面量定义的对象为什么符合这样的逻辑，那是因为字面量创建的对象<u>js内部会隐式的以`new Object`创建对象。</u>
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

![QQ截图20221021142342.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7cw31x3vaj30ij09mq7e.jpg)

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
前面讲了当new构造函数时会产生一个全新的对象，正常情况下内部会涉及到以下步骤：
- 生成一个全新对象，如果没有显式返回对象，这个对象会继承User的原型prototype
- 函数的this将会指向生成的对象上
- 生成的对象的原型指向函数的`prototype`对象
- 如果函数显式返回对象类型的值(`Object/Array/Function/RegExp`...)，new和普通函数调用将没有任何区别
- 如果返回非对象类型的值，将会忽略显式返回值并返回内部生成的新对象

我们知道了new做了什么后，其实可以自己手动实现new的操作，这里简单实现原理：
```js{8}
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
上面高亮代码判断如果函数返回的是`object`并且不是`null`类型的数据，就返回函数返回的值，反之返回自定义的对象。

new生成的对象可以用来做什么：
- 判断类型，获取对象类型
- 继承

```ts
function Fruit() {};
f = new Fruit();

const getFuntionName = (func: Function): string => func.toString().match(/function\s+(\w+)/i)?.[1];

console.log(f.constructor === Fruit); // true
console.log(getFuntionName(f.constructor)); // 'Fruit'
```
接下来看JS继承

## 原型链继承
原型链继承是最基本的继承，这和所有对象都有`__proto__`属性概念一样。这里就是让子类的`prototype`属性指向实例化后的父类实例，这样子类就会拥有父类的的属性和prototype中的属性方法。为什么呢？前面讲了`new`操作，正常情况会生成一个全新的内部对象，作为函数内部的this指向，并且原型指向`构造函数的prototype属性`，拥有构造函数prototype对象中的属性和方法。

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
Child.prototype = new Parent();  // 将会拥有parent实例属性和方法，也会拥有prototype对象中的属性和方法
Child.prototype.eat = function() {  // Child prototype对象现在是parent实例，也是个普通对象，可以添加属性和方法
  console.log("I eat:", this.food);
}

const c1 = new Child('noodles');
c1.say(); // my name: undefinded
c1.eat(); // I eat noodles
console.log(c1.sons); // // ['Tom', 'Jerry']

const c2 = new Child("rice");
c2.eat(); // I eat rice
console.log(c2.sons); // ['Tom', 'Jerry']

c1.sons.push("Lucky");
console.log(c1.sons, c2.sons); //  ['Tom', 'Jerry', 'Lucky'], ['Tom', 'Jerry', 'Lucky']
console.log(c1.__proto__ === c2.__proto__); // true
```
以上就是最简单原型链继承，当你了解原型链和new的原理相信一看就懂。这样继承子类可以拿到父类的属性还有`prototype`上的方法，但很明显的缺点就是，父类是个实例对象，那么所有子类对于父类的继承都是引用(28行已经证明了引用)，当一个子类修改父类中的属性或方法时，都会影响到其它的子类(代码26,27行)；还有一个缺点无法对父类进行传参。一图胜千言：
![iShot_2022-10-29_16.38.34.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7m8xrb8jyj314i0mwgow.jpg)
- 优点：<u>可以继承父类的属性和原型方法；</u>
- 缺点：<u>父类在子类之间共享，会造成数据之间的污染和篡改；无法给父类传参；</u>

## 构造函数继承
所谓的构造函数继承是在实例化子类时，对父类构造函数通过`call/apply`改变内部的this指向，让其内部的this的属性可以转嫁给子类，来看下面代码：

```js{9}
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
child.say(); // 报错 => child.say is not a function
```
在实例化Child时，内部会执行Parent方法(9行)并将child绑定为this，并将name传递给Parent，然后parent内部的this上绑定的属性转移到child上，这样child就会拥有`name`和`run`属性，这就是构造函数继承。再来看下child的原型链：
![iShot_2022-10-29_16.13.47.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7m88egs6qj317i0nsdse.jpg)
从图中可以看到child的原型为Child的prototype属性，却没有Parent的prototype相关方法(say)，父类只有将所有的属性定义在函数体内才能得到继承，所以这种继承并不能继承父类的`prototype`中的属性。
- 优点：<u>可以继承父类函数体内的属性和方法，并且向父类传参，并且多个实例不共享，不会造成污染</u>
- 缺点：<u>无法继承父类的prototype中的属性和方法</u>

## 原型式继承
原型式继承通过修改构造函数的prototype为目标对象，并实例化一个空对象达到继承的目的，来看下面这段代码：
```js{3,16,17,18,20,21}
function inherit(target) {
  function F() {};
  F.prototype = target; // 改变prototype
  return new F();
}
const parent = { name: 'parent', children: ['child1', 'child2'], say() { console.log('my name is parent.'); } };

const c1 = inherit(parent);
console.log(c1.name, c1.children); // parent, ['child1', 'child2']
c1.say(); // my name is parent.

const c2 = inherit(parent);
console.log(c2.name, c2.children); // parent, ['child1', 'child2']
c2.say(); // my name is parent.

console.log(c1.__proto__ === c2.__proto__); // true
c1.children.push('push by c1');
console.log(c2.children); // ['child1', 'child2', 'push by c1']

c1.name = 'c1';
console.log(c1.name, c2.name); // c1, parent
```
首先从上面16行看到子类的原型都指向同一个父类对象parent；在17-18行c1往children中添加了一个数据，c2中的children也发生了变化；同样的最后两行看到，c1改变了name后，c2却没有改变，这是为什么呢？当执行`c1.children`获取属性时，由于c1本身是不存在的，就会往原型链中找，所以会在parent中找到然后执行push方法，当然会改变其中的值，由于parent也是c2原型链，所以也会被改掉。而当执行`c1.name=c1`时，只要记住赋值操作`=`不会查找原型链，只会在当前对象中修改或添加属性，所以c1修改name时，只是在自己身上添加了name属性，并没有改变原型链中的name属性，所以c2的name还是parent中的不会发生变化。

来看下这种继承的原型结构：
![iShot_2022-10-29_17.18.34.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7ma3d4p1ej31600d2wkx.jpg)
一般这种继承应用场景如上面代码那样，继承对象是个对象的形式(parent)，而子类也是个简单的对象。但这种方式可以用原型链继承代替，如：`Object.create、__proto__、setPrototypeOf`(前面讲的设置原型的几种方式)，不用这么麻烦啰嗦。

- 优点：<u>继承操作简单容易理解</u>
- 缺点：<u>子类实例共享父类状态易篡改，无法给父类传参</u>

## 组合式继承
组合式继承则是结合原型链继承和构造函数继承，通过原型链对构造函数的原型进行继承，再通过构造函数对实例属性和方法进行继承，看下面代码：
```js{5,8}
function Parent(name) { this.name = name; };
Parent.prototype.children = ["child1", "child2"];
Parent.prototype.say = function() { console.log('my name is', this.name); };
function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = new Parent();
Child.prototype.intro = function() { console.log(`my name is ${this.name}, ${this.age} age`); };

const c1 = new Child('小明', 18);
const c2 = new Child("小红", 17);

console.log(c1.name, c2.name); // 小明, 小红
console.log(c2.age, c2.age); // 18, 17
c1.say(); // my name is 小明
c2.say(); // my name is 小红
c1.intro(); // my name is 小明, 18 age
c2.intro(); // my name is 小红, 17 age
```
上面组合继承看上去没什么问题，拿来看下原型图：
![iShot_2022-10-29_17.41.34.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7marb48ivj310u0f2gqj.jpg)
从图中可以明显看到，子类实例会拥有父类相同的属性的实例属性，由于原型链的作用父类中的实例属性并没有作用，为什么呢？从上面第8行中看到，会执行一个实例化parent的操作，前面我们知道new时会生成一个权限的对象作为this指向，所以就会实例属性或方法，但由于在实例child时，借用了parent的构造函数(第5行)，child实例也会拥有parent内部的实例属性和方法，对于原型链查找的规则，parent实例中的属性永远访问不到，很明显多余。

- 优点：<u>可以给父类构造器传参，拥有父类的实例属性和原型方法</u>
- 缺点：<u>会拥有父类相同的实例属性，但父类中的实例属性并没有被用到</u>

## 寄生式继承
寄生式继承是对原型式继承的加强版，由于原型式继承返回的是空对象，空对象中并没有属性和方法，那么寄生式就是在空对象中再添加一些属性和方法，就是所谓的加强版(没啥区别啊)，来看下面代码：
```ts{5,7,16,19}
function inherit(target, custom?: Record<string, any>) {
  function F() {};
  F.prototype = target; // 改变prototype
  const newObj = new F();
  newObj.show = () => console.log('call show...');
  // 添加自定义方法属性...
  custom && Object.keys(custom).forEach(k => (newObj[k] = custom[k]));
  return newObj;
}
const parent = { name: 'parent', children: ["child1", "child2"], say() { console.log('I\'m parent'); } };
const c1 = inherit(parent, { appendChildren(name) { this.children.push(name + "c1"); } });
const c2 = inherit(parent, { privateAttr: 'c2', appendChildren(name) { this.children.push(name + "c2"); } });

console.log(c1.name, c2.name); // parent, parent
console.log(c2.children === c2.chilrent); // true
console.log(c2.privateAttr, c1.privateAttr); // c2, undefinded
c1.appendChildren('pushed by c1');
c2.appendChildren('pushed by c2');
console.log(c1.children, c2.children); // ['child1', 'child2', 'pushed by c1c1', 'pushed by c2c2'], ['child1', 'child2', 'pushed by c1c1', 'pushed by c2c2']
```
如上寄生式和原型式继承一样，只不过添加了一些相同的属性和方法，还可以添加自定义属性或方法（5-7行）。上面给c2添加了属性privateAttr属性，c1并没有该属性。但是缺点也很明显和原型式继承一样(19行)，这里就不说了，看下原型图：

![iShot_2022-10-29_18.04.53.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7mbfjx1epj31am0nggyk.jpg)

- 优点：<u>原型式继承加强，可以添加自定义属性和方法</u>
- 缺点：<u>子类实例共享父类状态易篡改，无法给父类传参</u>

## 寄生组合式继承
到这里已经讲了5中继承方式了，每种方式都有自己的优点和缺点。在这里我们来看继承的本质，所谓继承这里都指函数的继承，像一些面向对象语言如Java、C#等等，通过class继承。在JS里对应的就是function，通过new操作来生成对象继承父类的属性和方法。

那在JS中前面讲了new的过程和本质，生成的对象会拥有实例属性和原型对象(`prototype`)的属性，实例属性是在构造函数中在new的时候自动添加到内部生成的对象上，而原型`prototype`对象会作为对象的原型`__proto__`，这样new生成的对象就会拥有实例属性和原型属性了。那么子类函数是不是只要在函数内部和原型对象上`prototype`拥有父类的属性和方法就行了，也就是new的时候也会拥有父类的实例属性和方法，然后生成的对象指向子类函数的`prototype`对象，只要prototype拥有父类的的prorotype属性和方法就可以了。

继承组合式继承就是来实现上面的操作的，其实也是平衡前面几种继承的优点和缺点，下面来简单实现下：
```js{11,15,17}
// 寄生组合式继承
function Parent(name) {
  this.name = name;
  this.children = [];
}
Parent.prototype.say = function() {
  console.log(`my name is ${this.name}`);
}
Parent.prototype.appendChildren = function(child) { this.children.push(child); };
function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
// 将Parent原型上的方法和属性移植到Child的原型上
Child.prototype = Object.create(Parent.prototype);
// 按照new规范将构造器指向Child自己
Child.prototype.constructor = Child;
// 添加Child自定义的原型方法
Child.prototype.intro = function() {
  console.log(`my name is ${this.name}, ${this.age} age.`);
}

const c1 = new Child("小明", 18);
const c2 = new Child("小红", 17);
console.log(c1.name, c1.age); // 小明, 18
console.log(c2.name, c2.age); // 小红, 17
c1.appendChildren('小明同学');
c2.appendChildren('小红同学');
console.log(c1.children, c2.children); // ['小明同学'] ['小红同学']

console.log(c1 instanceof Child); // true
```
以上通过将Child的prototype对象的原型设置为Parent的prototype对象，这样首先继承了Parent的prototype对象中的属性和方法，然后将Child的prototype的constructor指向Child自己，这是正常情况，然后添加Child自己的属性和方法intro。在Child函数体内借用Parent构造函数继承实例属性和方法(11行)，这样在创建Child实例时，不会实例化父类的构造函数。

这种方法巧妙的将父类原型方法拿到自己身上，实例方法也会在new时巧妙借用，而且父类构造器只会执行一次，在修改子类原型后，通过改变`prototype.constructor`属性为自己，又可以冒充正常的原型对象，并且instanceof等判断原型的方法也可以正常工作，这其实就是组合继承和寄生继承的加强版，这种方式比较成熟，通常情况下以这个作为继承版本。来看看原型结构：
![iShot_2022-10-30_08.01.14.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7mzlsi41xj31760mkgzf.jpg)
从上图可以很明显的看到继承关系，推荐使用。

- 优点：<u>不会实例化父类构造器，巧妙的借用父类实例和原型属性</u>
## class继承
ES6也引进了`class`和`extends`关键字，用于类似Java等面向对象语言类的实现和继承，但在JS中其本质还是function，看下使用：
```js{13,20,35}
class Parent {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
  say() {
    console.log(`my name is ${this.name}`);
  }
  appendChildren(child) {
    this.children.push(child);
  }

  static getUUid() {
    return "parent";
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }

  intro() {
    console.log(`my name is ${this.name}, ${this.age} age.`);
  }
}
const c1 = new Child("小明", 18);
const c2 = new Child("小红", 17);
console.log(c1.name, c1.age); // 小明, 18
console.log(c2.name, c2.age); // 小红, 17
c1.appendChildren("小明同学");
c2.appendChildren("小红同学");
console.log(c1.children, c2.children); // ['小明同学'] ['小红同学']
console.log(Child.getUUid()); // parent
```
以上就是class的继承使用方式，从中可看到Child继承了父类的实例属性，也继承了父类的原型，Child类也继承了父类的静态属性(代码13,35行)。

需要注意的是在Child的构造器中调用了`super(name)`(20行)，这个是什么？这其实就是执行了父类的构造函数，如果你了解过如Java的继承，那这个一定不陌生。那在JS中如何解释这个呢，其实在寄生组合继承中借用父类实例属性时会执行父类构造函数并将this指向子类，而这里super方法其实就是这个逻辑，并向Parent传递了参数name，这样子类就会拥有父类的实例属性`name、children`，并且规定：[在class继承中若子类执行constructor构造器时必须执行super方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super)。另外，<u>**super在子类构造函数中必须先于this属性相关操作调用**</u>，这又是为什么？其实就是让子类的属性能够覆盖父类的实例属性，这样子类可以更加灵活的修改父类的实例属性。

来看下实例的原型结构：
![iShot_2022-10-30_09.04.01.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7n1f3t85oj31640kidrg.jpg)
基本和我们自己写的寄生组合式继承的对象一致，在途中可以很明显看到class关键字继承。

上面给Parent添加了静态属性`getUUid`，Child也会拥有相同的静态属性，那什么是静态属性呢？在class中用`static`来标识这是类的静态属性或方法，而以函数的角度去看，其实就是函数的一个普通属性而已，来看下面代码：
```js
function App() {}
// 设置App静态方法 getUUid
App.getUUid = () => console.log('static method');
```
通过上面代码了解到静态属性就是一个函数的普通属性而已，而class其实也是这个道理(本质也是函数)，在上面的继承中，Child也会继承Parent的静态属性，那不就是`Child.__proto__ = Parent`吗？我们来证明下：
![iShot_2022-10-30_09.11.43.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7n1n3em33j30xi04saao.jpg)
果然是这样，那我们就明白了class继承时，也会将构造器本身作为子类构造器的原型来让其拥有其静态属性，即`Child.__proto__=Parent`，来看下Child本身的原型：
![iShot_2022-10-30_09.22.04.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7n2106dotj31b40redu7.jpg)
这样Child也会拥有Parent自身上其他的属性。在寄生组合继承中，也来稍微改造，让其支持静态属性这个特点：
```js
Child.__proto__ = Parent;
// 或
Object.setPrototypeOf(Child, Parent);
```
以上便是class继承，那class真正的实现方式是如何的呢，这里我们可以对class这种语法进行降级处理看看其实现方式，你可以使用typescript编译器直接编译或使用babel，这里为了方便使用`tsc`直接编译：
```js
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var Parent = /** @class */ (function () {
  function Parent(name) {
    this.name = name;
    this.children = [];
  }
  Parent.prototype.say = function () {
    console.log("my name is " + this.name);
  };
  Parent.prototype.appendChildren = function (child) {
    this.children.push(child);
  };
  Parent.getUUid = function () {
    return "parent";
  };
  return Parent;
}());
var Child = /** @class */ (function (_super) {
  __extends(Child, _super);
  function Child(name, age) {
    var _this = _super.call(this, name) || this;
    _this.age = age;
    return _this;
  }
  Child.prototype.intro = function () {
    console.log("my name is " + this.name + ", " + this.age + " age.");
  };
  return Child;
}(Parent));
```
其实也没那么难，感兴趣的可以自己看看。

## 总结
本篇主要讲解了什么是原型、原型链，JS是如何从原型链中查找属性的，学到了设置原型的几种方法，以及new的本质和作用。通过原型延伸到JS的继承方式，对比不同的继承让原型及原型链的知识进一步巩固。

<Reward />
<Gitalk />