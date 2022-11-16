---
title: JS类型隐式转换与装箱拆箱
description: 搞明白JS动态弱类型语言的隐式转换规则和装箱拆箱操作对出乎意料的运算结果了如指掌
head:
  - - meta
    - name: keywords
      content: 类型隐式转换,装箱拆箱,类型转换规则,toPrimitive,弱类型
---

# JS类型隐式转换与装箱拆箱

## 装箱与拆箱
什么是装箱和拆箱？

### 装箱
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

// Symbol
syml = new Object(Symbol('syml'))
syml = Symbol('syml')
```
2. 隐式装箱
```js
const name = '小明'
name.age = 1; // 自动装箱 => name = new String('小明') => name.age = 1 => 下一行前销毁当前对象
console.log(name.age); // undefined
```

### 拆箱
由引用类型转化为基本类型

### 规则

1. 自动装箱和显示装箱：
2. 拆箱遵循[`toPrimitive`规则](https://tc39.es/ecma262/#sec-toprimitive)： https://source.chromium.org/chromium/chromium/src/+/main:v8/src/objects/js-objects.cc;drc=1465f31f242ce74501d6d6898a624a885cdac088;l=2103
   - valueOf
   - toString
   - throw TypeError
 
 基本包装类型

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

// 待更新...


相关参考:
- https://www.freecodecamp.org/chinese/news/javascript-implicit-type-conversion/
- https://juejin.cn/post/6844903557968166926
- https://tc39.es/ecma262/#sec-toprimitive