---
title: 彻底搞懂EventLoop事件循环机制(浏览器和Node EventLoop)
description: 由于JavaScript是个单线程的语言,异步任务都会通过回调来解决单线程问题,JavaScript内部通过EventLoop事件循环机制来调度异步任务,本篇会对比浏览器的EventLoop和Node的EventLoop展开讲解
head:
  - - meta
    - name: keywords
      content: JS EventLoop,JS事件循环机制,浏览器EventLoop,NodeJS EventLoop,JS Engine,JS Runtime,JS异步编程,Promise,回调地狱,async/await,迭代器
---

# EventLoop事件循环机制
前端的同学们应该都听说过[EventLoop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)的概念，网上各大平台关于它的文章也是成百上千质量参差不一，其实在笔者刚开始接触js的时候这对这方面一头雾水，也是看了[高程](https://book.douban.com/subject/10546125)、[官方文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)以及大量的文章后才对它有了深刻认识，在这儿就来和大家分享下我对它的的认识和理解，不过要讲明白EventLoop这个东东还是要从头说起。

本篇内容循序渐进比较长，需要耐心看完:muscle:。

>注：如遇到有一些链接无法访问可能需要科学上网

## 前言
众所周知JS是一个单线程非阻塞语言，不像诸如Java、Python等多线程语言对并发处理比较友好，而JS只能同时执行一个任务。那为什么JS不像其他语言一样也是个多线程语言呢？其实在最初使用浏览器呈现页面时，基本上都是静态页面和简单的功能，并没有考虑到复杂的交互功能，JS的创作者因此也没必要做更复杂的设计。但近年来随着web技术的突飞猛进，各种页面五花八门的交互以及并发资源请求等都出现了，因此关于JS单线程处理异步任务等等概念也就被关注起来了。

虽然单线程会造成任务执行阻塞，页面长时间等待等缺点，但JS并没有改变它。由于<u>JS通常伴随着它的宿主环境浏览器而出现，若JS变成一个多线程的语言，那么浏览器处理用户的操作将会变得非常复杂</u>。试想在弱网环境下脚本还没有完全加载完时，用户如果点击页面的上某个表单提交任务，会发现没有任何反应，这难免会让用户产生一些想法。而JS单线程则会阻塞页面的渲染，当然用户也不知道可以做什么，只不过会牺牲点加载或等待时间。

## JS的Engine和Runtime
JS是一个动态解释性语言，需要通过JS的[引擎(JS Engine)](https://zh.wikipedia.org/wiki/JavaScript%E5%BC%95%E6%93%8E)进行解释(翻译)成对应的字节码、机器码然后才会运行。随着网页复杂性和性能要求的提高，JS引擎也经历了从[SpiderMonkey](https://zh.wikipedia.org/wiki/SpiderMonkey)到[V8(由google开发)](https://v8.dev)的变革，而由谷歌开发的V8引擎最为出色，目前已被大多数现代浏览器等(Chrome、Edge、Safari)采用。同时JS也从以前浏览器单一的运行时(Runtime)演变到可以在服务端运行的NodeJS(基于V8)运行时，为它提供不同平台的运行时环境。
- **Engine**：为JavaScript解析和执行提供环境条件(类似Java虚拟机)，并完成内存分配和垃圾回收等等。
- **Runtime**：由JavaScript的宿主环境提供额外的属性和方法，如浏览器提供了用户交互和一些异步任务的功能。

JS的是通过异步回调的方式解决单线程的执行阻塞问题，虽然JS引擎是单线程的，但它的宿主环境一般都是多线程的，如通过浏览器的定时任务线程、网络线程协调执行异步回调。所以常说的EventLoop是面向宿主环境的也就是Runtime，如浏览器和NodeJS，而浏览器的EventLoop总被频繁讨论，本篇将会对浏览器和NodeJS的EventLoop逐一展开介绍。

## 了解浏览器
:::warning
由于浏览器内部也在不断的升级优化，可能每个版本会存在不同的差异，这里只是针对其中的某段版本内部架构进行说明，其他或未来可能会发生变化，如果发现有不一致的地方可以阅读[google开发者文档](https://developer.chrome.com)。
:::

上述我们知道了EventLoop主要是宿主环境实现的如：浏览器，这里我们需要先了解下浏览器的架构，本文以Chrome浏览器作为介绍，其他浏览器可能存在差异，请自行查阅相关文档，本文不再做相关赘述。

关于浏览器的架构的发展也进行了很长一段时间，由单进程到多进程、单渲染进程到多渲染进程等多种机制的演变，更多关于浏览器的演变可以阅读我的[『现代浏览器架构』](/frontend/browser/index.html)一文。以Chrome为例，它是多进程和多线程的架构，其内部包括：
- Brower进程：提供浏览器URL、后退/前进、调度等全局作用
- 网络进程：进行网络资源请求、安全策略等等
- GPU进程：3D渲染、动画绘制等等
- 渲染进程：负责每个Tab页面加载解析，JS、CSS、DOM等相关页面和用户操作
- 插件进程：浏览器插件

除了以上列出的进程外，还有一些其它的进程。

这里主要来说下**渲染进程**，它是前端开发者最必要的关注点。Chrome为每个tab页面提供一个渲染进程。渲染进程会包括很多线程：
1. 主线程：调度页面的加载解析，执行dom、css、js操作处理等等
2. GUI线程：负责页面的渲染
3. JS引擎线程：进行解析执行JS
4. 定时器线程：处理异步定时任务
5. 异步请求线程：进行网络请求
6. 事件触发线程：监听执行事件callback
7. WebWorker线程：独立的脚本，不影响页面渲染，通常用来执行密集复杂的计算

等等...

以上简单介绍了浏览器每个页面进行渲染时，渲染进程会为页面提供不同的线程来负责不同的任务。这里需要知道当<u>加载页面时会从上到下解析文档，当遇到JS脚本(通常情况下)时会阻塞DOM的解析，也就是JS引擎的执行会阻塞GUI线程渲染的执行</u>，这也符合JS是个单线程语言的特征。不过渲染进程也提供了不同的线程去处理异步任务，可以并行处理多个任务，如：定时器线程、网络请求线程等等，而不会影响页面的渲染推翻JS单线程的理念。

### 事件驱动
其实浏览器多线程执行异步任务的原理背后是基于事件驱动机制的。不同类型的事件触发不同的任务，如：点击事件、滚动事件等等。而事件循环机制(EventLoop)就是基于事件驱动机制的。

<u>当JS执行代码时，如果遇到异步代码如Ajax请求时，会交给别的线程去执行异步任务，然后主线程挂起当前任务，不会阻塞后面代码的执行</u>。这些异步任务会由浏览器不同的线程进行负责，不会影响到主线程和JS引擎线程，当这些异步任务执行完毕后，会被存放到指定的任务队列中，等JS的执行栈中当前同步任务执行完毕后，会从这些任务队列中取出待执行的任务，而具体优先取哪一个这就是要取决于事件循环机制了。

## 浏览器的EventLoop
**<u>通过上面的介绍你应该会了解到浏览器的多线程其实就是让JS拥有多线程并发处理异步任务的能力，主要负责点击等事件、定时任务、网络请求、脚本执行、用户交互和页面渲染之间的的调度。</u>**

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
>本段代码来自MDN，更多详情点[此处](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#stack)查看

### 堆
用来存储对象变量或其他复杂的数据结构变量

### 任务队列
任务队列用来储存带执行的任务如：点击事件、回调函数等等，任务又包括：<u>宏任务(Macro Task)和微任务(Mirco Task)，不同类型的任务优先级以及执行时机会有所不同</u>。

EventLoop就是通过事件循环的机制当执行栈空闲时，主线程判断任务队列中是否有合适的任务，取出最老的一个任务将其压入调用栈中执行，执行完后再次出栈，如此反复不断循环，就是所谓的事件循环机制EventLoop，如下图。

![eventloop.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7z3bthpsfj30bm0a0go1.jpg)

## MacroTask和MicroTask
浏览器EventLoop会有一个或多个Macro任务队列，存放着来自不同任务源(Task Source)的任务，这里有人喜欢将其作为队列结构遵循先进先出的规则，事实上却是个[Set集合](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)，每次循环都会选择不同类型任务队列的第一个可执行任务。

**在HTML标准中定义了[常见的MacroTask Source](https://html.spec.whatwg.org/multipage/webappapis.html#generic-task-sources)**:
- dom manipulation(DOM操作)： 如没有阻塞的插入元素
- user interaction(用户交互)：用户进行输入、键盘等UI交互事件
- network(网络请求)：网络资源请求如Ajax请求
- navigation和history：导航和history操作

MacroTask Source的定义非常广泛，常见的键盘、鼠标、Ajax、setTimeout、setInterval、操作数据库等都属于MacroTask Source，对于宏任务MacroTask、TaskSource和MacroTask Queue有相关约定：
- 来自同一个 TaskSource 的 MacroTask必须放到相同的MacroTask Queue
- 同一个MacroTask Queue中的MacroTask按顺序排列
- 浏览器会根据不同TaskSource的优先级可能会被先调度，以快速响应用户的交互

**Mirco task在HTML标准中并没有明确定义，一般以下几种被视为微任务**：
- Promise
- Object.observe(已弃用)
- MutationObserve
- queueMicrotask

<u>那么为什么任务队列中会有宏任务(Macro Task)和微任务(Mirco Task)呢？其目的就是让不同类型的任务源有不同的执行优先级。</u>

在EventLoop中的每一次循环成一个`tick`，每一次tick都会先执行同步任务，然后查看是否有微任务，将所有的微任务在这个阶段执行完，如果执行微任务阶段再次产生微任务也会把他执行完（<u>每次tick只会有一个微任务队列</u>），接下来会<u>可能</u>会进行视图的渲染，然后再从MacroTask队列中选择一个合适的任务放入执行栈执行，然后重复前面的步骤不断循环，再次拿出经典图：
![eventloop.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7z3bthpsfj30bm0a0go1.jpg)

<u>**需要注意的是所谓的`微任务`并不会交给其他线程处理，而是V8自己内部的实现，微任务V8会将其放入一个专门的队列，待当前同步任务执行完后，便会清空当前队列**</u>，而MacroTask会交给其他线程去处理。

接下来可以套用上面的概念看一段代码的执行结果（先别看答案自己先过一遍写出结果，最后再对比下哪里的想法有问题）：
```js
setTimeout(() => {
  console.log('setTimeout start');
  Promise.resolve()
    .then(() => console.log('promise resolve1'))
    .then(() => console.log('promise resolve2'))
    .then(() => console.log('promise resolve3'))
    .then(() => console.log('promise resolve4'))
  new Promise((resolve) => {
    console.log('promise1 start');
    resolve()
  }).then(() => {
    console.log('promise1 end');
  });
  setTimeout(() => {
    console.log('inner setTimeout')
  })
  console.log('setTimeout end');
}, 0);

function promise2() {
  return new Promise((resolve) => {
    console.log('promise2');
    resolve();
  })
}

async function async1() {
  console.log('async1 start');
  await promise2();
  console.log('async1 end');
}

async1();
console.log('script end');
```
以上代码的打印顺序为：`async1 start` => `promise2` => `script end` => `async1 end` => `setTimeout start` => `promise1 start` => `setTimeout end` => `promise resolve1` => `promise1 end` => `promise resolve2` => `promise resolve3` => `promise resolve4` => `inner setTimeout`，不管和你预期的结果是否一样，接下来我们逐行分析：
1. 首先script整体作为同步任务执行，遇到setTimeout定时宏任务时交给定时线程去执行，其结果会放入宏任务队列，主线程挂起当前异步任务继续执行后面的代码。
2. 执行async1()，async1函数入栈，并为当前函数提供一些变量上下文。首先打印`async1 start`，遇到`await promise2`，会执行`new Promise()`其也是个同步代码，所以会打印`promise2`，接着会执行`resolve()`，它返回的是个promise，然后回到async1函数内部，await其实是个语法糖，后面的代码会作为promise的then代码块执行，而then会当做微任务进入微任务队列（promise不清楚的可以看我[『异步编程』](/frontend/js/async.html)一文），async1执行完后出栈。
3. 执行`console.log(script end)`，打印，然后出栈，第一轮同步任务执行完毕。
4. 同步任务执行完后先看有没有微任务，第2步await后面的语句已经被放入微任务队列了，执行后打印`async1 end`，微任务队列清空。
5. 这里没有涉及到视图更新等等。
6. 主线程接着从任务队列中选取一个最老的宏任务（MacroTask）来执行，这里任务队列中只有一个`setTimeout定时任务`，首先会判断执行它的时机到了没，如果没到由于没有其他宏任务了，主线程什么都不会做。反之执行其会首先打印`setTimeout start`。接着执行`Promise.resolve()`其返回promise是个微任务会放入微任务队列，接着`new Promise()`执行打印`promise1 start`，内部也会resolve返回promise也是个微任务放入微任务队列。接着就是setTimeout放入宏任务队列，最后执行`setTimeout end`。
7. MacroTask执行完毕，清空所有的MircoTask。首先执行`promise resolve1`，而后的then也是个微任务会被放入当前微任务队列。接着执行`promise1 end`，接下来又会执行`promise resolve2`，它也一样返回微任务(和前面重复步骤)直到执行完后面所有的then。
8. MircoTask执行完后MacroTask Queue就剩下一个setTimeout任务了，合适的时机打印`inner setTimeout`。

通过一步一步的分析相信你已经对其执行过程有了初步认识，为了加深大家的印象，这里录制了一个视频来动画展示其运行过程，[点击这里查看](https://www.bilibili.com/video/BV1RW4y147Xv)

![iShot_2022-11-12_10.59.25.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h825tdqysdj31920pg7l9.jpg)

## 定时器误差
我们已经知道异步的MacroTask其实会交给其它线程去处理，当执行栈中的代码执行完后，才会通过EventLoop去获取下一个Task执行。而定时任务(如：setTimeout)当指定了时间后执行，若执行栈的任务还没有执行完，就算定时器时间到了，也永远不会去执行，直到清空当前执行栈后才会执行，来看下面代码：
```js
setTimeout(() => console.log('setTimeout'), 1000);
for(let count = 0;count<10000000000;count++);
```
这段代码很简单定时器在1s后打印`setTimeout`，然后执行for循环，当你执行后会发现打印的时间已经远超1s，对于电脑性能不好的可能要更久。

我们用EventLoop分析下上面的代码，当程序遇到setTimeout后，会交给定时器线程去执行，然后等1s后将其放入MacroTask Queue，等待主线程的调度。主线程遇到setTimeout挂起它，执行后面的for循环，直到执行完for循环才会去MacroTask Queue调度下一个Task也就是setTimeout。而这里for循环执行耗时时间已经远超1s，所以setTimeout回调的调度也会被推迟，这就是为什么setTimeout定义了1s执行却没有执行的本质原因，如果你了解了事件循环机制EventLoop，关于定时器误差也会很容易理解。

## 视图更新时机
前面已经讲了在每一次tick执行完所有的MircoTask Queue后就会进行视图的更新，但一般视图的更新会跟随这系统帧率通常都是`60fps(16.666ms一次)`，如果在每次tick中不断修改dom并不会立即更新：
```html
<div id="title" />
<script>
  const wrapper = document.querySelector("#title");
  let color = "red";
  let count = 0;
  const timer = setInterval(() => {
    count++;
    if (count > 10) clearInterval(timer);
    if (color === "red") {
      wrapper.style.background = "blue";
      color = "blue";
    } else {
      wrapper.style.background = "red";
      color = "red";
    }
  }, 4);
</script>
```
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/2022-11-10-08-25-41.gif)
上面代码每次都是宏任务会经历10次tick，dom也会更新10次，而实际图中也就一两次，这再次说明了更新视图会在合适的点进行更新，一般都是根据系统帧率60fps，若果用setTimeout做动画时间设置成17ms，应该不会掉太多帧，但setTimeout可能会被执行栈延迟调用，所以用setTimeout做动画掉帧的可能性非常大。

## requestAnimationFrame
:::tip 考虑
requestAnimationFrame是微任务还是宏任务？ :dash: 其实都不是
:::
requestAnimation会在每次更新视图前执行，他不会收到主线程的阻塞，也就是说视图更新的帧率为60fps，requestAnimationFrame也会执行60次，并且执行时间间隔非常稳定，所以很适合做动画，也不会卡顿。
```js
function rF() {
  count ++;
  if (count < 60) {
    requestAnimationFrame(() => {
      if (color === "red") {
        wrapper.style.background = "blue";
        color = "blue";
      } else {
        wrapper.style.background = "red";
        color = "red";
      }
      rF();
    })
  }
}
rF();
```
通过requestAnimationFrame将会在每次更新视图时都会正确的更新每次修改的内容。

## 浏览器EventLoop总结
通过以上了解到浏览器是多线程的，其通过事件驱动模型用EventLoop事件循环机制来调度定时任务、用户交互、网络请求等异步任务，其大致过程如下：
- 首先script整体作为宏任务执行，执行同步任务，当遇到异步任务时，如果是宏任务就会交给其它线程处理，并放入对应的任务队列中。微任务放入微任务队列，主线程挂起这些异步任务，接着执行后面的代码。
- 当前执行栈清空会先执行所有的微任务，如果还遇到微任务也会将其放入当前微任务队列后，直到所有执行完。
- 当所有微任务执行完后，浏览器可能会更新视图，与帧率有很大关系。
- 然后主线程根据调度优先级从宏任务队列中适合执行的任务执行，然后不断重复以上操作。

## Node的EventLoop
讲完了浏览器的EventLoop接下来看看Node的EventLoop，Node和浏览器都是基于v8引擎，浏览器中的异步方法node中也会有，除此之外还包括：
- 文件I/O
- process.nextTick
- setImmediate
- 监听关闭事件

Node中的事件循环机制是基于[Libuv(Asynchronous I/O)](https://libuv.org)引擎实现的，v8引擎会分析对应的js代码然后调用node的api，而node又被libuv驱动执行对应的任务，并把任务放入到对应的任务队列等待主线程的调度，因此node的EventLoop是libuv里实现的，看下node原理图：

![node-system.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h817cbtjngj30i5074di0.jpg)

### 执行阶段

node事件循环机制中和浏览器的不太一样，在node中一般不说微任务和宏任务，通常分为不同的执行阶段，而在这些不同的执行阶段都会对应执行任务，node就是这样不断循环这些不同的执行阶段调度任务的执行顺序，其EventLoop包括以下执行阶段：
- **`timers`**：执行定时器任务队列回调：setTimeout、setInterval...
- **`pending callback`**：执行除了定时器、setImmediate以外的大部分回调，如操作系统TCP连接回调、IO回调等等。
- **`idle、prepare`**：内部调度不用关心
- **`poll`**：等待新的请求连接或I/O事件。node一开始进入这个阶段，如果当前阶段的任务队列执行空，先看有没有setImmediate回调，如果有进入check执行setImmediate回调，或等待新的I/O请求连接，同时也会检测timer是否有到期，若有会直接进入timer阶段执行回调，受代码执行环境的影响
- **`check`**：执行setImmediate回调
- **`close`**：执行socket等关闭操作回调

以下是来自官网的一张[事件循环图](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#event-loop-explained):arrow_down:
![node-eventloop.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h815w92ru3j30ka0aw40g.jpg)

以上每个阶段的任务执行完在进入下一个阶段前会先清空当前阶段的微任务队列，而老版本的node则会先把当前阶段的代码回调执行完后才会执行微任务队列，如下代码：
```js
setTimeout(() => {
  console.log("setTimeout1");
  Promise.resolve().then(() => console.log("promise1"));
});
setTimeout(() => {
  console.log("setTimeout2");
  Promise.resolve().then(() => console.log("promise2"));
});
```
- 使用node版本(9.11.2)，打印顺序：`setTimeout1` => `setTimeout2` => `promise1` => `promise2`，node会先将timer阶段的回调执行完后，才会执行当前阶段微任务队列中的所有微任务。
- 浏览器打印顺序：`setTimeout1` => `promise1` => `setTimeout2` => `promise2`。
- 使用高版本浏览器打印顺序和浏览器一致。

### setTimeout和setImmediate
通常情况下我们都会使用setTimeout执行延时任务，在node中也提供了`setImmediate`来执行异步任务表示立即执行，前面讲到它在`check`阶段执行；若将`setTimeout`的时间设置为0是不是和前者有同样的效果：
```js
setTimeout(() => console.log("setTimeout"));
setImmediate(() => console.log("setImmediate"));
```
多次执行以上代码会发现打印顺序并不固定，这是为什么呢？

以上代码就两个异步任务，前面讲了node刚开始会进入`poll`阶段，如果当前阶段没有任何任务要执行时，就会看看有无`setImmediate`回调，如果有的话进入`check`阶段执行回调，但是同时也会监听`setTimeout`的回调，如果到期也会立马进入timer阶段去执行定时器的回调，两者优先级不是固定的，这就是为什么打印顺序并不是一致的原因。

现在将上面的代码稍作修改，让其在IO回调里执行：
```js
const fs = require("fs")
fs.readFile(__dirname + "/inherit.js", 'utf8', (err, data) => {
  setTimeout(() => console.log("setTimout"));
  setImmediate(() => console.log("setImmediate"));
})
```
以上的打印顺序永远是`setImmediate` => `setTimeout`，为什么呢？因为上面代码是在IO回调里执行的。回到事件循环的执行阶段中，I/O回调会在`pending callback`阶段执行，按照事件循环机制`check`阶段会在`timer`阶段前执行，所以为什么打印顺序不会变。

### process.nextTick
`process.nextTick`也是立即执行的意思，但它和`setImmediate`不一样的是，其不是阶段性的任务。`process.nextTick`在每个阶段同步任务执行完后都会执行，并且优先于微任务(promise)执行：
```js
setTimeout(() => {
  Promise.resolve().then(() => console.log("promise"));
  process.nextTick(() => console.log("nextTick"));
});
setImmediate(()=> console.log('setImmediate'));
```
上面执行结果`promise`和`nextTick`打印永远在一起，并且`nextTick`印永远会在`promise`之前打印，而`setImmediate`只会在`check阶段`打印。

按照执行时机，`promise.nextTick`更适合于立即执行某个任务。

## 总结
到这里关于JS的EventLoop就讲完了，你应该也已经明白了什么是EventLoop了。本篇通过对EventLoop的学习可以对JS的执行顺序和浏览器渲染时机等等有更深的理解，这会大大减少程序运行的不确定性，也能更好的通过事件循环机制调度任务执行的优先级，如果没有彻底理解请根据文中例子和概念不断反复练习。

相关参考：
- https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
- [http://latentflip.com/loupe](http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!)
- https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
- https://www.youtube.com/watch?v=8aGhZQkoFbQ

<Reward />
<Gitalk />