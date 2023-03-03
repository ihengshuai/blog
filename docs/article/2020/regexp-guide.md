---
title: 深入浅出RegExp
description: 玩转正则表达式(regexp)的使用技巧,使用regexp提高开发效率
head:
  - - meta
    - name: keywords
      content: 正则表达式,RegExp,正则匹配,前端正则表达式
---

# 深入浅出RegExp

>JavaScript中的正则是Perl的大子集，但Perl内部的一些表达式却没有继承

正则表达式是用于匹配字符串中字符组合的模式([可参考MDN教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions))

## 一个例子
使用正则将一个数字以科学计数法进行表示，如：
```js
 // 10000000 => 10,000,000
```
现在用一个正则来解决
```js
const str = '10000000'
const reg = /(?=(\B)(\d{3})+$)/g
str.replace(reg, ',') // 10,000,000
```

## 修饰符
正则表达式是由`模式`和`修饰符`(可有可无)组成
常用的修饰符有：`i`、`g`、`m`、`u`、`y`
- `i`：匹配时不区分大小写
  ```js
  str = 'JavaScript'
  reg = /javascript/i
  reg.test(str) // => true
  ```
- `g`：匹配时会查找所有的匹配项，而不只是第一个
  ```js
  str = 'absKsdblsb'
  reg = /s/g
  str.match(reg) // => [s, s, s]
  ```
- `m`：匹配多行(会影响^、$操作符)
  ```js
  str = 'ab\nab'
  reg = /^ab/mg
  str.match(reg) // => [ab，ab]
  ```
- `u`：开启完整的 unicode 支持
- `y`：粘滞模式
  ```js
  str = 'Hello, world!';
  reg = /\w+/y;
  reg.lastIndex = 5; // 在位置 5 精确查找
  regexp.exec(str) // => null
  ```

## 字符类
`字符类`是个特殊的字符，用来匹配字符集中字符
如：匹配字符串中的数字
```js
const str = 'jhsd123fg903d'

// 匹配所有的数字
str.match(/\d/g) // => ['1', '2', '3', '9', '0', '3']
```

常用的字符表达式见下表:


| 表达式 | 描述 | 含义|
| --- | --- | --- |
| . | 匹配单个字符，除了换行和行结束符 |（小数点）默认匹配除换行符之外的任何单个字符。例如，/.n/ 将会匹配 "nay, an apple is on the tree" 中的 'an' 和 'on'，但是不会匹配 'nay'。如果 s ("dotAll") 标志位被设为 true，它也会匹配换行符。|
|\w|匹配单词字符|匹配一个单字字符（字母、数字或者下划线）。等价于 [A-Za-z0-9_]。例如, /\w/ 匹配 "apple," 中的 'a'，"$5.28,"中的 '5' 和 "3D." 中的 '3'。|
|\W|匹配非单词字符|匹配一个非单字字符。等价于 [^A-Za-z0-9_]。例如, /\W/ 或者 /[^A-Za-z0-9_]/ 匹配 "50%." 中的 '%'。|
|\d|匹配数字|匹配一个数字。等价于[0-9]。例如， /\d/ 或者 /[0-9]/ 匹配"B2 is the suite number."中的'2'。|
|\D|匹配非数字字符|匹配一个非数字字符。等价于[^0-9]。例如， /\D/ 或者 /[^0-9]/ 匹配"B2 is the suite number."中的'B' 。|
|\s|匹配空白字符|匹配一个空白字符，包括空格、制表符、换页符和换行符。等价于[ \f\n\r\t\v\u00a0\u1680\u180e\u2000-u200a\u2028\u2029\u202f\u205f\u3000\ufeff]。例如, /\s\w*/ 匹配"foo bar."中的' bar'。经测试，\s不匹配"\u180e"，在当前版本Chrome(v80.0.3987.122)和Firefox(76.0.1)控制台输入/\s/.test("\u180e")均返回false。|
|\S|匹配非空白字符|匹配一个非空白字符。等价于 [^ \f\n\r\t\v\u00a0\u1680\u180e\u2000-u200a\u2028\u2029\u202f\u205f\u3000\ufeff]。例如，/\S\w*/ 匹配"foo bar."中的'foo'。|
|\b|匹配单词边界|匹配一个词的边界。一个词的边界就是一个词不被另外一个“字”字符跟随的位置或者前面跟其他“字”字符的位置，例如在字母和空格之间。注意，匹配中不包括匹配的字边界。换句话说，一个匹配的词的边界的内容的长度是0。（不要和[\b]混淆了）使用"moon"举例：/\bm/匹配“moon”中的‘m’；/oo\b/并不匹配"moon"中的'oo'，因为'oo'被一个“字”字符'n'紧跟着。/oon\b/匹配"moon"中的'oon'，因为'oon'是这个字符串的结束部分。这样他没有被一个“字”字符紧跟着。/\w\b\w/将不能匹配任何字符串，因为在一个单词中间的字符永远也不可能同时满足没有“字”字符跟随和有“字”字符跟随两种情况。|
|\B|匹配非单词边界|匹配一个非单词边界。匹配如下几种情况：（1）字符串第一个字符为非“字”字符 （2）字符串最后一个字符为非“字”字符（3）两个单词字符之间（4）两个非单词字符之间（5）空字符串|
|\n|匹配换行符|匹配一个换行符 (U+000A)。|

...等等其他

### 例子

1. `.`字符
```js
var str = 'aa1bb'
str.match(/(\w)\1.(\w)\2/g) // => ['aa1bb']，此处 `.` 匹配的是 1

str = 'nay, an apple is on the tree'
str.match(/.n/g) // => ['an', 'on']，匹配两个结果，此处`.` 分别是 a, o
```
2. `\w`字符
```js
var str = 'a1ds23;.?]'
str.match(/\w/g) // => ['a', '1', 'd', 's', '2', '3']
```
3. `\d`字符
```js
var str = 'a1ds23;.?]'
str.match(/\w/g) // => ['1', '2', '3']
```
4. `\s`字符
```js
var str = 'a1 ds2 3;.?]'
str.match(/\w/g) // => [' ', ' ']，共有两处
```
5. `\b`字符
```js
var str = '2split1;word3'
str.match(/\b\d/g) // => [2]，先匹配数字[2,1,3]，而后单词边界的是 [2]
```
6. `\B`字符
```js
var str = '2split1;word3'
str.match(/\B\d/g) // => [1, 3]，先匹配数字[2,1,3]，而后非单词边界的是 [1,3]
```

## 复用
复用即量词，常见的量词包括：`*`、`+`、`?`、`{n}`，量词可以在匹配多个相同的模式的时候很管用，避免了重复写相同的模式

一个小例子：
```js
str = 'ab1c2d345e'
str.match(/\d/ig) // => [1, 2, 3, 4, 5]

// 使用量词 （这里涉及到了贪婪原则，后面会讲到）
str.match(/\d+/ig) // => [1, 2, 345]
```
来看下面的解释
- `*`：匹配前面的模式0个或多个，相当于`{0, n}`
    ```js
    // 还是上面的例子
    // 使用 *
    str.match(/\d*/ig) // => ['', '', '1', '', '2', '', '345', '', '']
    // 这里因为 * 0个也会匹配，所以每个位置都会匹配到空字符
    ```
- `+`：匹配前面的模式1个或多个，相当于`{1, n}`
    ```js
    // 使用 +，同理，至少得一个才能匹配上
    str.match(/\d+/ig) // => ['1', '2', '345']
    ```
- `?`：匹配前面模式0个或1个，相当于`{0, 1}`
    ```js
    str = 'Should I write color or colour'
    // 这里 ? 表示前面的 u 有或者没有都行
    str.match(/colou?r/ig) // => [color, colour]
    ```
- `{n}`：表示一个范围，可以是`{0,n}，{n,} 或者{n,m}`，表示知道得有左位数和最多位数
    ```js
    str = 'erabuiababidjabababkjlsdababababkl'
    // 至少得有2个ab，最多匹配3个ab
    str.match(/(ab){2,3}/ig) // => [abab, ababab, ababab]
    ```

## 选择、组合、捕获、引用
### 选择
选择是由`|`标识进行匹配，可以理解为or，如：`a|b`表示匹配a或者b
```js
str = 'absdfg'
// 匹配s或者d
str.match(/s|d/ig) // => ['s', 'd']
```
### 组合(字符集合范围)
组合在常用的匹配模式中还是常用的，`[]`用来组合匹配的范围或者其他

几个重要概念：
1. `[^..]`表示非组合的内容，`^`在开头代表不是后面要匹配的内容
2. `[\b]`匹配一个退格，不要和 `\b`混淆了
```js
// 匹配第一位是字符全是大写或者全是小写的字母
reg1 = /^[A-z]\d*/ig
reg1.test('s12314') // => true

// 匹配第一位是字母或者数字的，最后一个第一位是字母或者0-2之间的数字，很明显false
reg2 = /^[A-z|\d]\d*/ig
reg2.test('s12314') // => true
reg2.test('112314') // => true
reg3 = /^[A-z|0-2]\d*/ig
reg3.test('312314') // => false

// 匹配第一位不是字母
reg4 = /^[^A-z]\d*/ig
reg4.test('s12314') // => false
reg4.test(';12314') // => true
```

### 捕获
捕获在匹配表达式中经常看到，他的作用非常强大，使用`()`一对括号进行修饰，这样就可以捕获到匹配到里面的内容，捕获经常和`引用`或者`修饰符`（*、+...）结合使用

在讲用法前，需要补充一下`排除捕获`，排除捕获也很重要很常用，可以用一些需要`()`但又不需要捕获后的值，用`?:`排除捕获

常见用法：

1. 使用捕获获取具体内容 `RegExp` 的静态属性 `$`

```js
str = 'I like Java coding'

// 忽略大小写
reg = /\w*(JAVA)\w*/ig

// 匹配字符
reg.test(str)
// 匹配后，捕获到的内容会按照捕获的顺序出现在 `RegExp`的静态属性上，以`$`开头
console.log(RegExp.$1) // => Java 
console.log(RegExp.$2) // => undefined ，只有一个捕获，不存在`$2`属性

// 使用`replace`方法
str.replace(reg, 'PHP') // => I like PHP coding
str.replace(reg, '【$1】') // => I like 【Java】 coding
str.replace(reg, '$1Script') // => I like JavaScript coding
str.replace(reg, ($, $1) => {
  console.log('匹配到了' + $1)
  return `【${$1}】`
}) // => I like 【Java】 coding  并且会打印 `匹配到了Java`
// 搜索段落标红关键字
str.replace(reg, '<span style="color:red">$1</span>') // => I like <span style='color:red'>Java</span> coding
```


2. 匹配表达式结合`引用`使用

引用其实和前面讲到的`RegExp`的静态属性类似，只不过引用是在匹配表达式中使用，写法不一样。在匹配表达式中使用 `\1` `\2`...斜杠加一个数字的形式引用所有引用的第一个，类似 `$1、$2...`

引用的顺序与`()`的使用顺序相关联，规则：`由左到右，由外到内，遇到排除捕获跳过当前()`
```js
str = 'qaabbccddq'
reg = /(\w)\1/ig
str.match(reg) // => ['aa', 'bb', 'cc', 'dd']
```

```js
str = 'qaaaabbbb11q'
reg = /(\w\w)\1(\d)\2?/ig
str.match(reg) // => ['bbbb11']

// 这里注意是 `\3` 而不是 `\2`
reg1 = /(\w\w)\1((\d)\3)?/ig
str.match(reg1) // => ['aaaa', 'bbbb11']

// 这里注意使用了 `?:` 排除捕获，所以是 `\2` 而不是 `\3`
reg2 = /(\w\w)\1(?:(\d)\2)?/ig
str.match(reg1) // => ['aaaa', 'bbbb11']
```

### 引用
引用在匹配表达式中使用 `\1` 这种以 `斜杠和数字` 结合的方式使用，需要注意的是，引用的数字和使用 `()`的规则相关，规则为：`由左到右，由外到内，遇到排除捕获跳过当前()`，这一点很重要

关于引用的用法，详见前面 `捕获`小结的使用方法即可

## 断言
通常我们要匹配的内容后面要跟着指定的内容，常见的断言`x(?=y)`、`x(?!y)`、`(?<=y)x`、`(?<!y)x`

### 前瞻断言
前瞻断言主要是`x(?=y)`和`x(?!y)`，`x(?=y)`表示匹配后面紧跟着y的x，`x(?!y)`表示匹配后面不是y的x

```js
str = '1 candy costs 50€'

// 假如要匹配后面是 `€` 的数字
str.match(/\d+(?=€)/) // => [50]

// 假如要匹配后面不是 `€` 的数字
str.match(/\d+(?!€)/) // => [1]
```

### 后瞻断言
前瞻断言主要是`(?<=y)x`和`(?<!y)x`，`(?<=y)x`表示匹配前面紧跟着y的x，`(?<!y)x`表示匹配前面不是y的x
```js
str = '1 candy costs $50'

// 假如要匹配前面是 `$` 的数字
str.match(/(?<=\$)\d+/) // => [50]

// 假如要匹配前面不是 `$` 的数字
str.match(/(?<!\$)\d+/) // => [1]
```

## 贪婪与惰性
正则的量词通常都是遵循`贪婪`原则，也就是有量词的时候，尽量匹配多的。而惰性则和这种原则相反，尽量匹配少，不匹配多。

`惰性`使用`?`紧跟在量词的后面，如：
```js
`\d+?` // 匹配一个数字就行
`\w{1,}?` // 匹配1个字母就行
`\d*?` // 匹配0个数字 => ['', ...]
```
例子
```js
// 匹配带 `""`号的水果
str = 'I like "apples" a little more than "oranges"'


// 1.贪婪
// 会发现结果并不理想，原因就是默认是贪婪原则，能匹配多的不匹配少的
// 首先，会匹配到第一个`"`
// 而后匹配下一个`"`，当匹配到`apples"`，还会继续往后匹配
// 看剩下的能不能匹配到 `.+"`，最后匹配到了`oranges"`(当然前面还有`than "`)
str.match(/".+"/g) // => ["apples" a little more than "oranges"]

// 2.惰性
str.match(/".+?"/g) // => ["apples", "oranges"]

// 3.其他方法
str.match(/"[^"]+"/g) // => ["apples", "oranges"]
```

## RegExp属性、方法
### 属性
常见的属性：source，global，ignoreCase，multiline，lastIndex等等...
1. source
表示正则对象的原表达式内容以字符串的形式输出，不包含修饰符
```js
reg = /(\d\s)\1/ig

reg.source // => '(\\d\\s)\\1'
```
2. global
表示是否匹配全部内容，而不是匹配到第一个就停止匹配，返回Boolean类型
```js
reg = /(\d\s)\1/ig

reg.global // => true
```
3. ignoreCase
表示匹配是否忽略大小写，返回Boolean类型
```js
reg = /(\d\s)\1/ig

reg.ignoreCase // => true
```
4. multiline
表示多行匹配，有回车符，换下一行从头匹配
```js
reg = /(\d\s)\1/ig

reg.multiline // => false
```
5. lastIndex
在全局匹配时，表示当前匹配的的索引，初始为0，当匹配到结果时，lastIndex值变为最新匹配的位置,如果不能匹配到结果了，然后重0开始
```js
str = 'day by day'

reg = /\w+/g

reg.exec(str) // => ['day', index: 0, input: 'day by day', groups: undefined]
reg.lastIndex // => 3

reg.exec(str) // => ['by', index: 4, input: 'day by day', groups: undefined]
reg.lastIndex // => 6

reg.exec(str) // => ['day', index: 7, input: 'day by day', groups: undefined]
reg.lastIndex // => 10

reg.exec(str) // => null
reg.lastIndex // => 0，重新从头开始
```
### 方法
常见的方法：exec、test
1. exec
一个在字符串中执行查找匹配的RegExp方法，它返回一个数组（未匹配到则返回 null）
同上`lastIndex`例子

2. test
一个在字符串中测试是否匹配的RegExp方法，它返回 true 或 false。
```js
str = '1a1aklk2b2bp'
reg = /(\d\w)\1+/
reg.test(str) // => true
```

## String常见的正则方法
常用的方法：`replace`、`match`、`matchAll`、`search`、`split`
1. replace：字符串替换指定的内容（表达式匹配）

```js
str = 'I like Java coding'

str.replace(/JAVA/i, 'PHP') // => 'I like PHP coding'
str.replace(/(JAVA)/i, '<$1>') // => 'I like <Java> coding'
str.replace(reg, ($, $1) => {
  console.log('匹配到了' + $1)
  return `【${$1}】`
}) // => I like 【Java】 coding  并且会打印 `匹配到了Java`
```

2. match：匹配所有符合表达式的内容，返回数组，否则null

```js
str = 'd1sd2asf43d5'

str.match(/\d+/) // => [1]
str.match(/\d+/g) // => [1, 2, 43, 5]
str.match(/\d\b/) // => [5]
str.match(/\d\B/) // => [1, 2, 43]
str.match(/\d\s/) // => null
```

3. matchAll：返回匹配正则表达式的迭代器，参数为 `RegExp` 类型，且必须带上 修饰符 `g`，否则报错；其匹配结果返回一个 `RegExpStringIterator` 类型的迭代器
```js
str = 'd1sd2asf43d5'

iterator = str.matchAll(/\d+/g) // => RegExpStringIterator {}
Object.prototype.toString.call(iterator) // => [object RegExp String Iterator]

// 返回结果基本和迭代器一致，value是类数组
iterator.next() // => {value: [1], done: false}
iterator.next() // => {value: [2], done: false}
iterator.next() // => {value: [43], done: false}
iterator.next() // => {value: [5], done: false}
iterator.next() // => {value: undefined, done: true}
```

![迭代器截图](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gwzlkiq4scj30oy0l5ai8.jpg)

4. search：匹配正则表达式，如果匹配成功返回第一个匹配的位置，否则返回-1

```js
str = '1 apple costs $50'

str.search(/(?<=\$)\d+/) // => 15
str.search(/\d+/) // => 0
str.search(/\d[A-z]/) // => -1
```
5. split：将以正则匹配的内容进行分割

```js
str = 'skJavaslkdJAVAllksdfJaVAlp'

// 将会以 java 或者 javas 进行分割（不区分大小写）
str.split(/javas?/i) // => ['sk', 'lkd', 'llksdf', 'lp']
```

<Reward />
<Gitalk />