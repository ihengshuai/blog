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

## 拆箱toPrimitive
装箱基本上就是前面那么简单，而对JS的困惑往往都出自类型的拆箱，它是类型隐式转换的重点。拆箱遵循[【toPrimitive规则】](https://tc39.es/ecma262/#sec-toprimitive)

toPrimitive的签名如下：
```ts
toPrimitive(input, perferedType)
```

https://source.chromium.org/chromium/chromium/src/+/main:v8/src/objects/js-objects.cc;drc=1465f31f242ce74501d6d6898a624a885cdac088;l=2103
   - valueOf
   - toString
   - throw TypeError


 ## 类型隐式转换

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