---
title: JS类型隐式转换与装箱拆箱
description: 搞明白JS动态弱类型语言的隐式转换规则及装箱拆箱规则来提高你的程序稳定性
head:
  - - meta
    - name: keywords
      content: 类型隐式转换,装箱拆箱,运算转换,类型转换规则,type conversion,toPrimitive,弱类型,OrdinaryToPrimitive
---

# JS类型隐式转换与装箱拆箱
如果你写过大多数强类型语言如`Java`对数据的类型一定不会陌生，如定义两个变量：`int num = 1`和`boolean bool = false`，比较两个变量是否相等时结果很明显时`false`(不同类型直接会报错)，类型不同的变量永远不会相等。由于JS被定位成`动态弱类型语言`，其往往会颠覆你的认知。

JS引擎往往会最大限度的降低程序的错误，假如你会写`num = 1;num.name=xxx`这种很明显的错误，但当你运行时却不会报错，这里就涉及到了`装箱和拆箱`；还有`1 == true; 1 == [1]`你会发现竟然结果都为`true`，如果你不了解JS内部的装箱、拆箱和类型的隐式转换规则，这些可能都会让你产生困惑，如果你有这些疑惑，接着看下面的内容吧。

> 注：如遇到有一些链接无法访问可能需要科学上网

## 装箱与拆箱
什么是装箱和拆箱？JS中有`string`、`number`、`boolean`基础类型，它们都有对应的包装类型(引用类型)`String`、`Number`、`Boolean`，<u>装箱就是将基础类型转换为对应的包装类型，而拆箱则将包装类型转换为对应的基础类型。</u>

<u>如果你对**拆箱**操作不了解，将会影响你对隐式转换的理解。</u>

### 装箱
装箱可以通过显式new进行装箱，JS引擎也可以隐式装箱，下面就来了解下两种不同的装箱操作。

1. 显式装箱
```js
// string
str = new Object('str')
str = new String('str')

// boolean
bool = new Object(true)
bool = new Boolean(true)

// number
num = new Object(1)
num = new Number(1)
```

2. 隐式装箱
```js
name = 'js'
// 例1
name.toUpperCase(); // JS

// 例2
name.age = 1; // 自动装箱 => name = new String('js') => name.age = 1 => 下一行前销毁当前对象
console.log(name.age); // undefined
```
上面隐式装箱`name`是个基础类型，基础类型不会有属性的，但却拥有`toUpperCase`方法，其本质还是`String`对象的方法，当执行此方法时会隐式的将name转换为对象`name => new String(name)`，然后就会拥有对应的方法；而给其设置`age`属性后重新获取却为`undefined`，这里JS引擎就处理了错误的赋值操作，也会将`name`转换为`new String(name)`然后在执行下一行前又会销毁此对象，可以理解为当前对象就是来为赋值操作服务的。

### 拆箱
拆箱则是将包装类型转化为对应的基础类型，通过执行`valueOf`方法可以得到它的原始值：
```js
num = new Number(123); // Number {123}
typeof num; // object
num.valueOf(); // 123

bool = new Object(true); // Boolean {true}
typeof booll; // object
bool.valueOf(); // true
```
除了执行`valueOf`，`toString`方法也可以将包装类型转换为基础类型字符串形式，其实除了以上几个包装类型拆箱，其他的引用类型也会根据一定的规则进行转换，下面就来一起看看。

## toPrimitive、 OrdinaryToPrimitive
对于引用类型在特殊条件下都会转换为基础类型，其拆箱都会遵循[【toPrimitive规则】](https://tc39.es/ecma262/#sec-toprimitive)

JS引擎內部toPrimitive的签名如下：input是待转换的对象，perferedType为转换的类型，有`string/number`两种
```ts
toPrimitive(input, perferedType);

// 1. If input is an Object, then
//   a. Let exoticToPrim be ? GetMethod(input, @@toPrimitive).
//   b. If exoticToPrim is not undefined, then
//     i. If preferredType is not present, let hint be "default".
//     ii. Else if preferredType is string, let hint be "string".
//     iii. Else,
//       1. Assert: preferredType is number.
//       2. Let hint be "number".
//     iv. Let result be ? Call(exoticToPrim, input, « hint »).
//     v. If result is not an Object, return result.
//     vi. Throw a TypeError exception.
//   c. If preferredType is not present, let preferredType be number.
//   d. Return ? OrdinaryToPrimitive(input, preferredType).
// 2. Return input.
```
这里的`toPrimitive`属性其实就是`Symbol.toPrimitive`属性，其内部转换可以概括步骤如下（**重点**）：
1. <u>**当进行类型转换时会首先判断有没有`Symbol.toPromitive`属性：**</u>
    + 当`perferedType`为`string`时，返回`string`条件结果。
    + 当`perferedType`为`number`时返回`number`条件结果。
    + 当`perferedType`为空时，返回`default`条件结果。
    + 如果以上返回的结果不是基本类型时抛异常`Cannot convert object to primitive value`
2. <u>**如果没有`Symbol.toPromitive`属性，会执行内部的[OrdinaryToPrimitive](https://tc39.es/ecma262/#sec-ordinarytoprimitive)方法，此方法会根据优先级调用`toString`和`valueOf`方法，其调用顺序如下：**</u>
    + 当指定转换类型为`string`时，会优先调用`toString`方法，若执行结果为基础类型则返回，否则执行`valueOf`方法，基本类型结果将会返回，否则将会抛异常。
    + 当指定转换类型为`number`时，会优先调用`valueOf`方法，若执行结果为基础类型则返回，否则执行`toString`方法，基本类型结果将会返回，否则将会抛异常。
    + 在不指定类型情况下，除了`Date`会优先执行`toString`方法，其余的都会优先执行`valueOf`方法，然后根据前两条规则执行。
  
`OrdinaryToPrimitive`签名如下：
```ts
OrdinaryToPrimitive(O, hint);

// 1. If hint is string, then
//   a. Let methodNames be « "toString", "valueOf" ».
// 2. Else,
//   a. Let methodNames be « "valueOf", "toString" ».
// 3. For each element name of methodNames, do
//   a. Let method be ? Get(O, name).
//   b. If IsCallable(method) is true, then
//     i. Let result be ? Call(method, O).
//     ii. If result is not an Object, return result.
// 4. Throw a TypeError exception.
```
`OrdinaryToPrimitive`的执行也可以在源码([c代码](https://source.chromium.org/chromium/chromium/src/+/main:v8/src/objects/js-objects.cc;l=2107?q=OrdinaryToPrimitive&ss=chromium%2Fchromium%2Fsrc&start=11)、[JS代码](https://source.chromium.org/chromium/chromium/src/+/main:third_party/devtools-frontend/src/node_modules/es-abstract/2020/OrdinaryToPrimitive.js;l=16?q=OrdinaryToPrimitive&sq=&ss=chromium))中找到，你可以在[source.chromium.org](https://source.chromium.org/chromium)中搜索对应的关键字`OrdinaryToPrimitive`，就可以找到。下面代码也证明了`OrdinaryToPrimitive`的执行的执行步骤
```js
module.exports = function OrdinaryToPrimitive(O, hint) {
  if (Type(O) !== 'Object') {
    throw new $TypeError('Assertion failed: Type(O) is not Object');
  }
  if (/* Type(hint) !== 'String' || */ hint !== 'string' && hint !== 'number') {
    throw new $TypeError('Assertion failed: `hint` must be "string" or "number"');
  }

  var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];

  for (var i = 0; i < methodNames.length; i += 1) {
    var name = methodNames[i];
    var method = Get(O, name);
    if (IsCallable(method)) {
      var result = Call(method, O);
      if (Type(result) !== 'Object') {
        return result;
      }
    }
  }

  throw new $TypeError('No primitive value for ' + inspect(O));
};
```

接下来通过下面的代码来证明以上总结的步骤，首先会执行`Symbol.toPrimitive`方法，没有则会执行`OrdinaryToPrimitive`的方法。

**Symbol.toPrimitive证明**
```js
// 根据toPrimitive签名定义方法
obj = {
  [Symbol.toPrimitive](perferedType) {
    if (perferedType === "number") return 1;
    if (perferedType === "string") return "str";
    return "default";
  }
}

// 1. perferedType为string
`${obj}`; // 'str'

// 2. perferedType为number
+obj; // 1

// 3. perferedType为 undefined
'' + obj; // 'default'

// 若返回的结果不是基础类型则抛异常，这里修改一个number返回对象
obj = {
  [Symbol.toPrimitive](perferedType) {
    if (perferedType === "number") return [1,2,3];
    if (perferedType === "string") return "str";
    return "default";
  }
}
+obj; // Uncaught TypeError: Cannot convert object to primitive value
```
通过上面的代码再次证明了确实是以上的步骤，接下来看OrdinaryToPrimitive

**OrdinaryToPrimitive证明**
```js{12,13}
// 1. hint为string会先执行toString方法
`${{valueOf: () => 1, toString: () => 2}}`; // '2'
Array.prototype.toString = () => 'array';
`${[1,2,3]}`; // 'array'

// 2. hint为number会先执行valueOf方法
+({valueOf: () => 1, toString: () => 2}); // 1
Array.prototype.valueOf = () => 2;
+[1,2,3]; // 2

// 3.当不指定 hint 类型时，除Date类型其它会优先执行`valueOf`，然后执行`toString`，Date正好相反
'' + ({valueOf: () => 1, toString: () => 2}); // '1'
1 + ({valueOf: () => 1, toString: () => 2}); // 2
'' + new Date(); // 'Thu Dec 01 2021 12:56:23 GMT+0800 (中国标准时间)'
Date.prototype.toString = () => 'date'; // 修改Date的toString方法
'' + new Date(); // date

// 4.若某一个方法返回的不是基础类型，继续执行下一个方法，否则抛异常
'' + ({valueOf: () => [1,2,3], toString: () => 2}); // 2 => 执行toSting
Date.prototype.toString = () => [1,2,3]; // 修改Date的toString方法
'' + new Date(); // '1609459200000' => 执行 valueOf
'' + ({valueOf: () => [1,2,3], toString: () => []}); // Uncaught TypeError: Cannot convert object to primitive value
```
以上就是OrdinaryToPrimitive的执行步骤，其实`valueOf`执行结果更趋向于自己原本的值(除Date外)，而`toString`一定会返回string类型，如：
```js
// valueOf
obj = { name: 1 };
obj.valueOf(); // { name: 1 }
(function(){}).valueOf(); // f(){}
[1,2,3].valueOf(); // [1,2,3]
new RegExp('^\d+','i').valueOf(); // /^d+/i

// toString
obj.toString(); // '[object Object]'
[1,2,3].toString(); // '1,2,3'
new RegExp('^\d+','i').toString(); // '/^d+/i'
```

通过上面的内容你应该对装箱与拆箱有了更深的认识，从拆箱中应该也看到了类型转换的影子(上面代码中12,13行高亮部分)`'' + ({valueOf: () => 1, toString: () => 2}); // '1'`，返回的结果是个<u>字符串1而不是数字</u>，而`1 + ({valueOf: () => 1, toString: () => 2}); // 2`返回的却是数字2，两者只因相加位类型的不同结果也不同，这里就涉及到了类型的隐式转换，`number => string`的转换。

了解了对象转换为原始类型(拆箱)后，接下来就来看看类型隐式转换是如何运作的。

## 类型隐式转换
:::warning 提示
如果你在类型隐式转换的阅读过程中产生的疑问过多，建议将装箱和拆箱的内容多读、多练几遍。
:::

<u>类型隐式转换可以归结为`number`、`string`和`boolean`等其它基础类型之间通过运算符`==`、`*、/、+、-`或逻辑运算的转换。</u>由于JS的弱类型特征，像`==`比较者可以为任意类型任意值，而`===`比较者的类型不同永远不会相等（`1 == 1`、`1 === '1'`）。

其实转换者可以是基础类型和对象类型，但归根还是基础类型之间的转换，<u>若转换者存在对象类型，会根据拆箱优先级进行拆箱转换为基础类型后</u>，然后在根据类型隐式转换的规则进行转换。

这里列出一张不同类型转换表格，里面包含了不同类型转换到原始值或其它基础类型的规则，通常情况下记住这张表的转换规则就可以解决所有隐式转换的问题了（当然对象类型转换为基础类型要学会前面讲的[拆箱规则](/frontend/js/implicit-conversion.html#拆箱toprimitive、-ordinarytoprimitive)）。

| 类型 | 值 | to Boolean | to Number | to String |
| :-----| ----: | :----: | :----: | :----: |
| Boolean | true | true | 1 | 'true' |
| Boolean | false | false | 0 | 'false' |
| Number | 100 | true | 100 | '100' |
| Number | Infinity | true | Infinity | 'Infinity' |
| Number | 0 | false | 0 | '0' |
| Number | NaN | false | NaN | 'NaN' |
| String | '' | false | 0 | '' |
| String | '100' | true | 100 | '100' |
| String | '100abc' | true | NaN | '100abc' |
| String | 'abc' | true | NaN | 'abc' |
| Null | null | false | 0 | 'null' |
| Undefined | undefined | false | NaN | 'undefined' |
| Function | function(){} | true | NaN | 'function(){}' |
| Object | {} | true | NaN | '[object Object]' |
| Array | [] | true | 0 | '' |
| Array | ['abc'] | true | NaN | 'abc' |
| Array | ['123'] | true | 123 | '123' |
| Array | ['123', 'abc'] | true | NaN | '123,abc' |
| Date | new Date | true | 数字(时间戳) | 'Wed Nov 16 2020 16:51:31 GMT+0800 (中国标准时间)' |
| Symbol | Symbol('a') | true | throw TypeError | throw TypeError |

## 算术运算符转换
算术运算符主要包括`+、-、*、/`，除了`+`运算符外，其余算术运算符都针对的是数字number，也就是说运算双方都必须是或转换为数字，这个相对来说简单直接套上面的表格即可，而`+`运算符最为特殊，`+`不仅可以进行算术运算也可以进行字符串的拼接，同时也是最常见的隐式转换。

### 减乘除
参与双方若是基础类型都会转换为`number`类型，而一方为<u>引用类型时会先进行内部拆箱转换成**最兼容number类型的基本类型**</u>，下面用一段代码加深下印象：
1. string转number
```js
'1' - 1  // 0
'1' * 1  // 0
'1a' - 1  // NaN
```
这里`'1'`会涉及到`string => number`的转换，从上面的表格中得到转换值为`1`，而`'1a'`转换后并不能兼容数字所以是`NaN`。

2. boolean转number
```js
true - 0  // 1
true * 1  // 1
false - 0  // 0
```
true转换为1，false转换为0。

3. undefined、null转number
```js
undefined - 1  // NaN
null - 1  // -1
null * 1  // 0
```
undefined转换为NaN，null转换为0。

4. 对象类型转number
```js
[] - 1  // -1
[] * 1  // 0
[1] - 1  // 0
[1, 'a'] - 1  // NaN
({}) - 1  // NaN
new Date() - 1  // 1577836799999
(function(){}) - 1  // NaN
new RegExp('^\w+', 'i') - 1  // NaN
```
对象类型会根据`OrdinaryToPrimitive`拆箱规则进行转换为基础类型number类型，然后进行计算。

以上便是`-、*、/`运算符转换为number类型的规则，比较简单。

### 加运算
加法运算最为特殊同时也是类型转换最多的，不仅可以进行算术运算也可以进行字符串的拼接。其转换规则为：
  1. 若一方是`string`类型，则另一方也会转换为字符串，进行字符串的拼接
  2. 若一方为`number`类型，另一方为原始类型，将其转换为number类型，进行算术相加。
  3. 若一方为`number`类型，另一方为引用类型，将其拆箱转换为基本类型后，进行字符串的拼接。

>以上转换规则优先级从高到低进行转换。

下面用几个例子演示这些规则：

转换规则1：
```js
'' + 1 // '1'
'' + true // 'true'
'str' + undefined // 'strundefined'
'' + null // 'null'
'' + [] // ''
'' + [1] // '1'
'' + [1,2,3] // '1,2,3'
'' + {name: 1} // '[object Object]'
'' + (function(){}) // 'function(){}'
```

转换规则2：
```js
1 + 1 // 2
1 + true // 2
1 + null // 1
1 + undefined // NaN
```

转换规则3：
```js
1 + [] // '1'
1 + [1,2] // '11,2'
1 + (function(){}) // '1function(){}'
1 + ({}) // '1[objectObject]'
1 + new Date() // '1Fri Dec 02 2020 11:40:48 GMT+0800 (中国标准时间)'
1 + new RegExp('\s', 'ig') // '1/s/gi'
```
以上便是加法的隐式转换，根据上面三条规则的优先级进行转换，基础不同类型转换的值可以根据上面的表格进行判断，引用类型根据拆箱规则结合转换优先级即可。

## 逻辑运算转换

### !运算转换
逻辑运算的转换常见的就是`!`和`==`的转换，相对来说非常简单。一般像`null、undefined、0、''、NaN、false`等为false外，其余的都是true（如：`[]、{}`等等）。
```js
!null // true
!undefined // true
!NaN // true
![] // false
!{} // false
```

### ==运算转换
`==`转换规则一般总结为一下五条：

- `NaN`和任何其他类型(包括自己)比较值都是false。
- `Boolean`和其他类型比较时，自己转化为`Number`类型然后进行比较.
- `Number`和`String`类型比较，将`String`类型转换为`Number`类型后进行比较。
- `undefined`除了和`null`比较结果为true外，其余的比较都是false。
- 原始值和引用类型进行比较时，引用类型根据拆箱规则转换成基础类型后进行比较。
```js
NaN == NaN // false
NaN == 0 // false
true == 2 // false  true => 1
1 = '1' // true  '1' => 1
undefined == null // true
undefined == NaN // false
null == false // false
[1] == 1 // true  [1] => 1
[1,2] == 1 // false  [1,2] => '1,2'
```

到这里基本上学会了以上的内容，隐式转换就可以搞懂了，其实也没什么难度，把这些转换概念摸清楚就可以游刃有余。

## 问题
有些同学可能看到这里，还没有完全掌握，这里就提供几个小菜，提供给大家练习，看和你的想法一直不，如果一直可以说清楚具体逻辑不，想法有出入那又是问什么？

```js
({}) + []
```
::: details 查看结果
答案：`'[object Object]'`，两者首先拆箱转换为基础类型，`{} => [object Object]`、`[] => ''`然后进行字符串拼接
:::

```js
[] == []
```
::: details 查看结果
答案：false，这里不会进行拆箱，类型相同的变量会直接比较，两者都是引用类型，地址不同不会相等
:::

```js
[] == ![]
```
:::details 查看结果
答案：true，`![]`先转换转换为false，`[]`进行拆箱变成0，`false`在转换成0
:::

这里笔者发现一个有趣的问题，看看通过上面的知识你能解决吗：
```js
let a;
// 请让变量a满足以下条件

if (a == 1 && a == 2 && a == 3) { console.log(true) };
```

:::details 查看结果
```js
a = {
  value: 1,
  valueOf:() => a.value++;
}
```
以上就是解决方案，是不是很简单。
首先要想a同时满足`1、2、3`的值，直接排除掉基础类型值，那么a一定是个引用类型，引用类型和基础类型的`==`比较，会通过拆箱规则转换，那么就会执行`valueOf、toString`方法，又根据拆箱优先级会先执行`valueOf`方法，那么在此方法做文章就可以了，每次读取值时进行自加，这样就会满足`1、2、3`
:::

## 总结
本篇主要讲了JS怎么进行隐式转换的，通过拆箱和装箱了解到JS引擎对程序的包容性还是很高的，学会引用类型根据`toPrimitive`优先级规则进行转换，也学会了从简单的算术运算到逻辑运算的隐式转换规则。

相关参考:
- https://tc39.es/ecma262/#sec-toprimitive
- https://source.chromium.org/chromium/chromium/src/+/main:third_party/devtools-frontend/src/node_modules/es-abstract/2020/OrdinaryToPrimitive.js;l=16?q=OrdinaryToPrimitive&sq=&ss=chromium
- https://www.youtube.com/watch?v=XYFg6_V-c9Q

<Reward />
<Gitalk />

