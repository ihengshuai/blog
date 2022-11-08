---
title: 彻底搞懂EventLoop事件循环机制
description: 由于JavaScript是个单线程的语言,异步任务都会通过回调来解决单线程问题,JavaScript内部通过EventLoop事件循环机制来调度异步任务,本篇会对比浏览器的EventLoop和Node的EventLoop展开讲解
head:
  - - meta
    - name: keywords
      content: JS EventLoop,JS事件循环机制,浏览器EventLoop,NodeJS EventLoop,JS Engine,JS Runtime,JS异步编程,Promise,回调地狱,async/await,迭代器
---

# EventLoop事件循环机制
前端的同学们应该都听说过[EventLoop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)的概念，网上各大平台关于它的文章也是成百上千质量参差不一，其实在笔者刚开始接触js的时候这对这方面一头雾水，也是看了[高程](https://book.douban.com/subject/10546125)、[官方文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)以及大量的文章后才对它有了深刻认识，在这儿就来和大家分享下我对它的的认识和理解，不过要讲明白EventLoop这个东东还是要从头说起。

## 前言
众所周知JS是一个单线程语言，不像诸如Java、Python等多线程语言对并发处理比较友好，而JS只能同时运行一个任务。那为什么JS不像其他语言一样也是个多线程语言呢？其实在最初使用浏览器呈现页面时，基本上都是静态页面和简单的功能，并没有考虑到复杂的交互功能，JS的创作者因此也没必要做更复杂的设计。但近年来随着web技术的突飞猛进，各种页面五花八门的交互以及并发资源请求等都出现了，因此关于JS单线程处理异步任务等等概念也就被关注起来了。

虽然单线程会造成任务执行阻塞，页面长时间等待等缺点，但JS并没有改变它。由于<u>JS通常伴随着它的宿主环境浏览器而出现，若JS变成一个多线程的语言，那么浏览器处理用户的操作将会变得非常复杂</u>。试想在弱网环境下脚本还没有完全加载完时，用户如果点击页面的上某个表单提交任务，会发现没有任何反应，这难免会让用户产生一些想法。而单线程则会阻塞页面的渲染，当然用户也不知道可以做什么，只不过会牺牲点加载时间。

## JS的Engine和Runtime
JS是一个动态解释性语言，需要通过JS的[引擎(JS Engine)](https://zh.wikipedia.org/wiki/JavaScript%E5%BC%95%E6%93%8E)进行解释(翻译)成对应的字节码、机器码然后才会运行。随着网页复杂性和性能要求的提高，JS引擎也经历了从[SpiderMonkey](https://zh.wikipedia.org/wiki/SpiderMonkey)到[V8(由google开发)](https://v8.dev)的变革，而由谷歌开发的V8引擎最为出色，目前已被大多数现代浏览器等(Chrome、Edge、Safari)采用。同时JS也从以前浏览器单一的运行时(Runtime)演变到可以在服务端运行的NodeJS(基于V8)运行时，为它提供不同平台的运行时环境。
- **Engine**：为JavaScript解析和执行提供环境条件(类似Java虚拟机)，并完成内存分配和垃圾回收等等。
- **Runtime**：由JavaScript的宿主环境提供额外的属性和方法，如浏览器提供了用户交互的功能。

JS的是通过异步回调的方式解决单线程的执行阻塞问题，虽然JS引擎是单线程的，但它的宿主环境一般都是多线程的，可以通过事件循环的机制来协调执行异步回调。所以常说的EventLoop是面向宿主环境的也就是Runtime，如浏览器和NodeJS，而浏览器的EventLoop被频繁讨论的，本篇将会对浏览器和NodeJS的EventLoop逐一展开介绍。

## 了解浏览器
:::warning
由于浏览器内部也在不断的升级优化，可能每个版本会存在不同的差异，这里只是针对其中的某段版本内部架构进行说明，其他或未来可能会发生变化，详情请阅读[google开发者文档](https://developer.chrome.com)。
:::

上述我们知道了EventLoop主要是宿主环境实现的如：浏览器，这里我们需要先了解下浏览器的架构，本文以Chrome浏览器作为介绍，其他浏览器可能存在差异，请自行查阅相关文档，本文不再做相关赘述。

关于浏览器的架构的发展也进行了很长一段时间，由单进程到多进程、单渲染进程到多渲染进程等多种机制的演变，更多关于浏览器的演变可以阅读我的[『现代浏览器架构』](/frontend/browser/index.html)一文。以Chrome为例，它是多进程和多线程的架构，其内部包括：
- Brower进程：提供浏览器URL、后退/前进、调度等全局作用
- 网络进程：进行网络资源请求、安全策略等等
- GPU进程：3D渲染、动画绘制等等
- 渲染进程：负责每个Tab页面加载解析，JS、CSS、DOM等相关页面和用户操作
- 插件进程：浏览器插件

除了以上列出的进程外，还有一些其它的进程。

这里主要来说下渲染进程，Chrome为每个tab页面提供一个渲染进程。渲染进程会包括很多线程：
1. 主线程：调度页面的加载解析，执行dom、css、js操作处理等等
2. GUI线程：负责页面的渲染
3. JS引擎线程：进行解析执行JS
4. 定时器线程：处理异步定时任务
5. 异步请求线程：进行网络请求
6. 事件触发线程：监听执行事件callback
7. WebWorker线程：独立的脚本，不影响页面渲染，通常用来执行密集复杂的计算

等等...

以上简单介绍了浏览器每个页面进行渲染时，渲染进程会为页面提供不同的线程来负责不同的任务。这里需要知道当<u>加载页面时会从上到下解析文档，当遇到JS脚本(通常情况下)时会阻塞DOM的解析，也就是JS引擎的执行会阻塞GUI线程渲染的执行</u>，这也符合JS是个单线程语言的特征。不过渲染进程也提供了不同的线程去处理异步回调，可以并行处理多个任务，如：定时异步任务(SetTimeout)、网络请求(XMLHttpRequest)等等，而不会影响页面的渲染推翻JS单线程的理念。

当在代码中使用这些异步任务时，这些任务会由浏览器不同的线程进行负责，不会影响到主线程和JS引擎线程，然后通过浏览器的和JS引擎的通信调度异步任务的过程。

## 浏览器的EventLoop
**<u>通过上面的介绍你应该会了解到浏览器的EventLoop其实就是让JS拥有多线程并发处理异步任务的能力，主要负责点击等事件、定时任务、网络请求、脚本执行、用户交互和页面渲染之间的的调度。</u>**

先来看看JS内存结构概念，这里借用MDN的图，如下图：

![JS内存结构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop/the_javascript_runtime_environment_example.svg)

从JS的内存模型图可以将JS内存大致的分为：调用栈、堆和任务队列。

### 调用栈
调用栈就是来执行JS代码的，它会记录函数调用的整个过程，并将函数的变量等信息以栈帧的形式压入，当执行完函数式，将栈顶的帧弹出。如下代码：

```js
function foo(b) {
  let a = 10;
  return a + b + 11;
}

function bar(x) {
  let y = 3;
  return foo(x * y);
}

console.log(bar(7)); // 返回 42
```
当调用 bar 时，第一个帧被创建并压入栈中，帧中包含了 bar 的参数和局部变量。当 bar 调用 foo 时，第二个帧被创建并被压入栈中，放在第一个帧之上，帧中包含 foo 的参数和局部变量。当 foo 执行完毕然后返回时，第二个帧就被弹出栈（剩下 bar 函数的调用帧）。当 bar 也执行完毕然后返回时，第一个帧也被弹出，栈就被清空了。

### 堆
用来存储对象变量或其他复杂的数据结构变量

### 任务队列
任务队列用来储存带执行的任务如：点击事件、回调函数等等，任务又包括：宏任务(Macro Task)和微任务(Mirco Task)，不同类型的任务优先级以及执行时机会有所不同。

EventLoop就是不断的判断调用栈中的任务是否执行完，调度任务队列中的任务，将其再次放入调用栈中执行，执行完后再次出栈，不断循环。

## MacroTask和MicroTask
EventLoop会有一个或多个Macro任务队列，存放着来自不同任务源(Task Source)的任务，这里有人喜欢将其作为队列结构遵循先进先出的规则，事实上却是个[Set集合](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)，每次循环都会选择不同类型任务队列的第一个可执行任务。

在HTML标准中定义了[常见的MacroTask Source](https://html.spec.whatwg.org/multipage/webappapis.html#generic-task-sources):
- DOM manipulation(DOM操作)： 如没有阻塞的插入元素
- user interaction(用户交互)：用户进行输入、键盘等UI交互事件
- network(网络请求)：网络资源请求如Ajax请求
- navigation和history：导航和history操作

从以上可以看到MacroTask Source的定义非常广泛，诸如键盘、鼠标、Ajax、setTimeout、setInterval、操作数据库等都属于MacroTask Source，所有来自这些MacroTask source的MacroTask都会被分配到对应的Task Queue中。

Mirco task
- Promise
- Object.observe(已弃用)
- MutationObserve
- queueMicrotask

## Node的EventLoop

// 待更新

相关参考：
- https://zhuanlan.zhihu.com/p/33058983
- https://juejin.cn/post/6844904165462769678
- https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
- [动画演示](http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!)
- https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
- https://www.youtube.com/watch?v=8aGhZQkoFbQ