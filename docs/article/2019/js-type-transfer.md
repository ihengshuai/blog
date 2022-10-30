---
title: JS隐式转换
description: JS的类型隐式转换规则,搞懂js的类型转换规则
head:
  - - meta
    - name: keywords
      content: js,类型转换,隐式转换,弱类型语言
---

# JS隐式转换
由于js是弱类型语言，程序对于数据的类型没有做严格的限制，导致会出现各种奇怪的转换；本文就来解密js的类型隐式转换的规则，让工作提高效率

## JS数据类型
- 原始类型
```js
null、undefined、string、number、boolean、symbol、bigint`
```
- 对象类型
```js
Object
    Object
    Date
    Array
    RegExp
    Math
    Function
    // 包装对象
    Number
    String
    Boolean
```
>注：symbol、bigint本篇不做讨论

在讨论隐士转换前，先了解一张`原始值`之间的转换关系图(包括复合类型向原始类型转换的范例)
![](http://tva1.sinaimg.cn/large/005HV6Avgy1gw1r1btxjkj30gk0oyjwl.jpg)

## 算术表达式转换
JS中算数表达式为：`+`、`-`、`*`、`/`
### 正常的减乘除
对于基本的算术表达式`-`、`*`、`/`它们的隐式转换比较简单，这些运算符的操作数只能是`number`，在执行运算时，将所有位转换为相应的`数值`，否则`NaN`
```js
1 - '1' = 0

'1' - '1' = 0

2 * '4' = 8

'10' / '2' = 5

10 * '2d' = NaN
```

### 另类的加

`+`运算符就比较复杂点，`+`可以进行`数值`的运算，也可以进行`字符串`的拼接，因此其结果往往取决于计算的`操作数`的类型，其次还和`运算顺序`相关，因此可以分类来讨论(这里只讨论两个操作数：x + y)
1. 相同类型
    - string: 字符串拼接
    - number: 数值相加
    - boolean: boolean转换成数字，进行数值相加
    - 
2. 不同类型
## 位运算转换
## 原始值转换

// 待更新...

<Reward />
<Gitalk />