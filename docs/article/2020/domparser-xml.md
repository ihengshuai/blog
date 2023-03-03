---
title: 关于DOMParser、XMLSerializer、createTreeWalker使用
description: 如何使用DOMParser、XMLSerializer、createTreeWalker,使用的场景有哪些
head:
  - - meta
    - name: keywords
      content: DOMParser,XMLSerializer,createTreeWalker,解析dom字符串,dom解析
---

# 关于DOMParser、XMLSerializer、createTreeWalker使用

## DOMParser
>DOMParser 可以将存储在字符串中的 XML 或 HTML 源代码解析为一个 DOM Document。

你可以使用XMLSerializer 接口执行相反的操作 - 将DOM树转换为XML或HTML源。

对于HTML文档，您还可以通过设置 Element.innerHTML 和outerHTML 属性的值，将部分 DOM 替换为从HTML构建的新 DOM 树。还可以读取这些属性以获取对应于相应 DOM 子树的 HTML 片段

### 语法
```js
let domparser = new DOMParser();
```
`domparser`是个`DOMParser`对象
![iShot2022-04-06 22.02.43.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h10cnj04f0j30q60ee430.jpg)

### 方法
domparser对象拥有一个`parseFromString`的方法，使用如下：
```js
let doc = domparser.parseFromString(string, mimeType);
```
返回值基于 mimeType 参数，返回 Document 或 XMLDocument 或其他文档类型。

`parseFromString`的参数解释：
- string：要解析的 DOMString。它必须包含 HTML、xml、xhtml+xml 或 svg 文档。
- mimeType：表示解析的文档类型，支持下表这些参数值
|mimeType|返回文档类型|
|--|--|
|text/html|Document|
|text/xml|XMLDocument|
|application/xml|XMLDocument|
|application/xhtml+xml|XMLDocument|
|image/xvg+xml|XMLDocument|

其中`Document`文档类型是会自动包含`<html>`和`<body>`标签的，而`XMLDocument`文档类型则不会主动添加`<html>`和`<body>`等标签

例子：
![iShot2022-04-06 22.14.17.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h10czrtn93j30qc0gojwk.jpg)

### 错误处理
当`DOMParser`对象按指定的`mimeType`解析错误时，不会抛出任何异常，而是会返回一个给定的错误文档：
```xml
<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">
(error description)
<sourcetext>(a snippet of the source XML)</sourcetext>
</parsererror>
```
![iShot2022-04-06 22.17.12.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h10d2mpudtj30qa0m012n.jpg)

## XMLSerializer
>XMLSerializer接口提供serializeToString() (en-US) 方法来构建一个代表 DOM 树的XML字符串。

### 语法
```js
let s = new XMLSerializer();
```
`s`是个`XMLSerializer`对象
![iShot2022-04-06 22.19.45.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h10d59333xj30q80csdk4.jpg)

### 方法
XMLSerializer对象拥有一个`serializeToString`的方法，使用如下：
```js
const str = s.serializeToString(document);
```
返回值是DOMString类型

`serializeToString`的参数解释：
- document: 是一个dom节点

例子：
![iShot2022-04-06 22.25.22.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h10db4mkdpj314w0qmqmt.jpg)

### 和outerHTML区别
`serializeToString`方法和`outerHTML`有些类似，但还是有所区别，主要有有下面两个：
1. outerHTML只能作用在Element元素上，但是不能是其他节点类型，例如文本节点，注释节点之类。但是serializeToString()方法适用于任意节点类型。包括：
|节点类型|释义|
|--|--|
|DocumentType|文档类型|
|Document|文档|
|DocumentFragment|文档片段|
|Element|元素|
|Comment|注释节点|
|Text|文本节点|
|ProcessingInstruction|处理指令|
|Attr|属性节点|
2. `serializeToString`方法会给根元素自动增加xmlns命名空间，如上图


<Reward />
<Gitalk />