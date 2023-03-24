---
title: Javascript异步编程
description: 前端异步编程演变历史是如何一步一步更利于开发体验的
head:
  - - meta
    - name: keywords
      content: Javascript异步编程,Promise,手写promise,回调函数,回调地狱,订阅发布,事件监听,async/await,迭代器
  - - meta
    - property: og:description
      content: 前端异步编程演变历史是如何一步一步更利于开发体验的
  - - meta
    - property: og:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-js.png
  - - meta
    - name: twitter:description
      content: 前端异步编程演变历史是如何一步一步更利于开发体验的
  - - meta
    - name: twitter:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-js.png
---

# Javascript异步编程

callback => 事件监听 => 发布订阅 => promise => generator => async/await

## 回调函数
ajax

## 事件监听
click

## 发布订阅
eventbus

## promise

## 迭代器generator
```js
// what is a generator
function *gen() {};
g = gen();
typeof g.next === "function" && typeof g.throw === "function"
```

## async/await
