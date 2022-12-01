---
title: JS类型隐式转换与装箱拆箱
description: 搞明白JS动态弱类型语言的隐式转换规则及装箱拆箱操作让意外的结果不再束手无策
head:
  - - meta
    - name: keywords
      content: 类型隐式转换,装箱拆箱,类型转换规则,toPrimitive,弱类型
---

# JS类型隐式转换与装箱拆箱
如果你写过大多数强类型语言如`Java`对数据的类型一定不会陌生，如定义两个变量：`int num = 1`和`boolean bool = false`，比较两个变量是否相等时结果很明显时`false`(不同类型直接会报错)，类型不同的变量永远不会相等。由于JS被定位成`动态弱类型语言`，其往往会颠覆你的认知。

JS引擎往往会最大限度的降低程序的错误，假如你会写`num = 1;num.name=xxx`这种很明显的错误，但当你运行时却不会报错，这里就涉及到了`装箱和拆箱`；还有`1 == true`你会发现竟然结果为`true`，如果你不了解JS内部的装箱、拆箱和类型的隐式转换规则，这些可能都会让你产生困惑，如果你有这些疑惑，接着看下面的内容吧。

## 装箱与拆箱
什么是装箱和拆箱？其是相对于<u>基础类型</u>和<u>对象类型</u>两者之间的转换而言的。JS中有`string`、`number`、`boolean`等基础类型，`String`、`Number`、`Boolean`、`Object`、`Array`等对象类型。将基础类型转换为对应的对象类型就是`装箱`，而对象类型转换为基础类型则为`拆箱`。

<u>如果你不对**拆箱**操作不了解，将会影响你对隐式转换的理解。</u>

## 装箱
像`number`、`boolean`等都有对应的包装类型`Number`、`Boolean`等，可以通过显式new进行装箱，JS引擎也可以隐式装箱，下面就来了解下两种不同的装箱操作。

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

## 拆箱toPrimitive、 OrdinaryToPrimitive
装箱基本上就是前面那么简单，而对JS的困惑往往都出自类型的拆箱，它是类型隐式转换的重点。拆箱遵循[【toPrimitive规则】](https://tc39.es/ecma262/#sec-toprimitive)

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
```js
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
'' + new Date(); // 'Thu Dec 01 2021 12:56:23 GMT+0800 (中国标准时间)'
Date.prototype.toString = () => 'date'; // 修改Date的toString方法
'' + new Date(); // date

// 4.若某一个方法返回的不是基础类型，继续执行下一个方法，否则抛异常
'' + ({valueOf: () => [1,2,3], toString: () => 2}); // 2 => 执行toSting
Date.prototype.toString = () => [1,2,3]; // 修改Date的toString方法
'' + new Date(); // '1609459200000' => 执行 valueOf
'' + ({valueOf: () => [1,2,3], toString: () => []}); // Uncaught TypeError: Cannot convert object to primitive value
```
以上就是OrdinaryToPrimitive的执行步骤。

通过上面的内容你应该对装箱与拆箱有了更深的认识，从拆箱中应该也看到了类型转换的影子(`'' + ({valueOf: () => 1, toString: () => 2}); // '1'`)，返回的结果是个<u>字符串1而不是数字</u>，这里就涉及到了类型的隐式转换，`number => string`的转换。

了解了对象转换为原始类型(拆箱)后，接下来就来看看类型隐式转换是如何运作的。

## 类型隐式转换
:::warning 提示
如果你在类型隐式转换的阅读过程中产生的疑问过多，建议将装箱和拆箱的内容多读、多练几遍。
:::

<u>类型隐式转换可以总结为`number`、`string`和`boolean`三者之间的通过运算符`==`、`*、/、+、-`转换</u>，由于隐式转换`==`比较者可以为任意类型任意值，而`===`类型不同永远不会相等（`1 == 1`、`1 === '1'`）。

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
| Sysbol | Symbol('a') | true | throw TypeError | throw TypeError |

## 一些无聊的问题
```js
{} + []
[] + {}
```

// 待更新...


相关参考:
- https://www.freecodecamp.org/chinese/news/javascript-implicit-type-conversion/
- https://juejin.cn/post/6844903557968166926
- https://baobangdong.cn/objects-convert-to-primitive/
- https://tc39.es/ecma262/#sec-toprimitive