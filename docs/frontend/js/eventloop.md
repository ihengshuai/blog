---
title: 彻底搞懂EventLoop事件循环机制
description: 由于JavaScript是个单线程的语言,异步任务都会通过回调来解决单线程问题,JavaScript内部通过EventLoop事件循环机制来调度异步任务,本篇会对比浏览器的EventLoop和Node的EventLoop展开讲解
head:
  - - meta
    - name: keywords
      content: JS EventLoop,JS事件循环机制,浏览器EventLoop,NodeJS EventLoop,JS Engine,JS Runtime,JS异步编程,Promise,回调地狱,async/await,迭代器
---

# EventLoop
前端的同学们应该都听说过[EventLoop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)的概念，网上各大平台关于它的文章也是成百上千质量参差不一，其实在笔者刚开始接触js的时候这对这方面一头雾水，也是看了[高程](https://book.douban.com/subject/10546125)、[官方文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)以及大量的文章后才对它有了深刻认识，在这儿就来和大家分享下我对它的的认识和理解，不过要讲明白EventLoop这个东东还是要从头说起。

## 前言
众所周知JS是一个单线程语言，不像诸如Java、Python等多线程语言对并发处理比较友好，而JS只能同时运行一个任务。那为什么JS不像其他语言一样也是个多线程语言呢？其实在最初使用浏览器呈现页面时，基本上都是静态页面和简单的功能，并没有考虑到复杂的交互功能，JS的创作者因此也没必要做更复杂的设计。但近年来随着web技术的突飞猛进，各种页面五花八门的交互以及并发资源请求等都出现了，因此关于JS单线程处理异步任务等等概念也就被关注起来了。

虽然单线程会造成任务执行阻塞，页面长时间等待等缺点，但JS并没有改变它。由于<u>JS通常伴随着它的宿主环境浏览器而出现，若JS变成一个多线程的语言，那么浏览器处理用户的操作将会变得非常复杂</u>。试想在弱网环境下脚本还没有完全加载完时，用户如果点击页面的上某个表单提交任务，会发现没有任何反应，这难免会让用户产生一些想法。而单线程则会阻塞页面的渲染，当然用户也不知道可以做什么，只不过会牺牲点加载时间。

## JS的Engine和Runtime
JS是一个动态解释性语言，需要通过JS的[引擎(JS Engine)](https://zh.wikipedia.org/wiki/JavaScript%E5%BC%95%E6%93%8E)进行解释(翻译)然后才会运行。随着网页复杂性和性能要求的提高，JS引擎也经历了从[SpiderMonkey](https://zh.wikipedia.org/wiki/SpiderMonkey)到[V8(由google开发)](https://v8.dev)的变革，而由谷歌开发的V8引擎最为出色，目前已被大多数现代浏览器等(Chrome、Edge、Safari)采用。同时JS也从以前浏览器单一的运行时(Runtime)演变到可以在服务端运行的NodeJS(基于V8)运行时，为它提供不同平台的运行时环境。
- **Engine**：为JavaScript解析和执行提供环境条件(类似Java虚拟机)，并完成内存分配和垃圾回收等等。
- **Runtime**：由JavaScript的宿主环境提供额外的属性和方法，如浏览器提供了用户交互的功能。

JS的是通过异步回调的方式解决单线程的执行阻塞问题，虽然JS引擎是单线程的，但它的宿主环境一般都是多线程的，可以通过事件循环的机制来协调执行异步回调。所以常说的EventLoop是面向宿主环境的也就是Runtime，如浏览器和NodeJS，而浏览器的EventLoop被频繁讨论的，本篇将会对浏览器和NodeJS的EventLoop逐一展开介绍。

## 了解浏览器

参考文献：
- https://developer.chrome.com/blog/inside-browser-part1/
- https://developer.chrome.com/blog/inside-browser-part2/
- https://developer.chrome.com/blog/inside-browser-part3/
- https://developer.chrome.com/blog/inside-browser-part4/

## 浏览器的EventLoop
JS的内存模型...

## MacroTask和MicroTask
微任务和宏任务...

## Node的EventLoop