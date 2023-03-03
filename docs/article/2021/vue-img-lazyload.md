---
title: 手写一个vue图片懒加载插件
description: 图片懒加载技术帮助加速页面的加载提高加载效率和网站跑分
head:
  - - meta
    - name: keywords
      content: 图片懒加载,vue插件,vue图片懒加载,性能优化,页面懒加载,页面性能
---

# 手写vue图片懒加载插件

## 前言
性能优化越来越被重视，其中的静态资源加载称为重灾区，如果网页的图片太多，一次加载会出现明显的卡顿，采用懒加载和预加载是解决其的良好手段

本篇就来用Vue和TypeScript来撸一个懒加载插件，在阅读本编之前，请先了解vue插件注册机制和自定义指令，如果你还不了解，可以看看[官方文档](https://cn.vuejs.org/v2/guide/custom-directive.html)

实现效果
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/giphy.webp)

## 功能实现
> 功能分析：在实现此功能前，可以将功能拆分为多个小功能，将不同的功能模块化，抽象出来，提高代码可读性

分析1：

首先在加载目标图片时，会有默认的图片来占位，也就是占位图，并将图片状态置为`LOADING`，当达到某种条件时获取真实的图片，当真实的图片获取成功时，图片加载完毕，图片响应的状态为`LOADED`；当真实图片加载失败时，状态变为`ERROR`。因此，为了便于管理图片的各个状态，可以单独写个类`ImageManager`来管理图片的不同状态，而图片的状态也为懒加载管理器做好了铺垫

分析2：
图片状态管理器有了，应该还需要一个懒加载管理器`Lazy`，将所有需要懒加载的图片推到加载队列中`managerQueue`用来管理所有图片的状态。加载管理器需要对每个图片进行是否是要请求真实资源进行判断，当达到条件时，触发当前的图片管理器请求真实图片，当图片的状态不再是`LOADING`状态时，将其从`managerQueue`队列中剔除，这样就不用再检测当前`ImageManager`了

### 属性定义

懒加载器实例化参数类型和指令绑定值类型如下：

```ts
// types/index.ts
import { DirectiveBinding } from 'vue/types/options'

// 初始化插件时，定义全局的loading和error（图片） 下面会降到 new Lazy({loading, error})
export interface LazyOpts {
  loading?: string
  error?: string
}

// 定义指令绑定值得类型，DirectiveBinding 的 value 为any类型，这里进行改造
// 这里就可以在 v-lazy="{src, loading, error}" | src 使用这种对象值
export interface DirectiveBindingType extends DirectiveBinding {
  value: { src: string, loading?: string, error?: string } | string
}

// bind el type
export type DirectiveBindingElemType = HTMLImageElement | HTMLElement
```
图片管理器实例化参数类型如下：
```ts
// 实例化图片管理器的选项
export type ImageManagerOpts = {
  el: DirectiveBindingElemType // 目标Element
  src: string  // 真实图片
  loading: string  // loading 图片
  error: string  // error图片
}
```

### 图片管理器
正如上述分析，图片有3中状态，即：`加载中`、`加载成功`、`加载失败`，三种状态渲染不同的url，这里先枚举出三种状态：
```ts
// 图片状态
export enum IMAGE_STATUS {
  LOADING, // 加载中
  LOADED,  // 加载成功
  ERROR,  // 加载失败
}
```

图片管理器考虑到自身状态的维护，可以用class进行构造
```ts
import { ImageManagerOpts, DirectiveBindingElemType } from './types'

// 唯一标识符
let uid = 1

// 图片管理器
class ImageManager {
  src: string
  el: DirectiveBindingElemType
  loading: string
  error: string
  status: IMAGE_STATUS
  uid!: number // 图片的唯一标识符

  constructor(opts: ImageManagerOpts) {
    this.src = opts.src
    this.el = opts.el
    this.loading = opts.loading
    this.error = opts.error
    this.uid = uid++

    this.status = IMAGE_STATUS.LOADING
    this.render(this.loading)
  }

  // 渲染dom图片
  render(src: string) {
    this.el.setAttribute('src', src)
  }

  // 加载资源，如果已经不是loading状态 终止
  load(next?: Function) {
    if (this.status > IMAGE_STATUS.LOADING) return
    this.renderSrc(next)
  }

  // 异步加载资源，并改变状态
  renderSrc(next?: Function) {
    loadImage(this.src)
      .then(() => {
        this.status = IMAGE_STATUS.LOADED
        this.render(this.src)
        next && next()
      })
      .catch((e) => {
        this.status = IMAGE_STATUS.ERROR
        this.render(this.error)
        console.warn(`v-lazy:load img ${this.src} failed, ${e.message}.`)
        next && next()
      })
  }
}

// 异步获取图片
function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve(true)
      img.onload = null
    }

    img.onerror = (err) => {
      reject(err)
      img.onerror = null
    }

    img.src = src
  })
}

export { ImageManager }
```
以上基本上已经定义好了`ImageManager`，现在我们可以这样使用它：
```ts
// 实例化时，状态为loading，render loading image
const manager = new ImageManager({el,src,loading,error})

// 当需要加载真实资源时
manager.load()
```

那么接下来就来创建懒加载器来管理所有的图片管理器

### 懒加载管理器

```ts
import {
  DirectiveBindingType,
  LazyOpts,
  DirectiveBindingElemType,
} from './types'
import { ImageManager, IMAGE_STATUS } from './image-manager'

// 可以默认一张图片
import { defaultImage } from './default-data'

const DEFAULT_URL = defaultImage

class Lazy {
  managerQueue: Array<ImageManager> = []
  observer!: IntersectionObserver
  loading!: string
  error!: string

  constructor(options: LazyOpts) {
    this.loading = options.loading || DEFAULT_URL
    this.error = options.error || DEFAULT_URL
    this.initInterSectionObserver()
  }

  // 使用指令时，添加当前元素
  add(el: DirectiveBindingElemType, binding: DirectiveBindingType) {
    let src, error, loading
    if (typeof binding.value === 'object') {
      src = binding.value.src || ''
      error = binding.value.error
      loading = binding.value.loading
    } else {
      src = binding.value || ''
    }
    const manager = new ImageManager({
      el,
      src,
      loading: loading || this.loading,
      error: error || this.error,
    })

    this.managerQueue.push(manager)

    this.observer.observe(el)
  }

  // 使用IntersectionObserver观测managerQueue里的manager
  initInterSectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const manager = this.managerQueue.find((manager) => manager.el === entry.target)
          if (manager) {
            // manager状态不是loading时 则移除对其的观测
            if (manager.status > IMAGE_STATUS.LOADING) {
              this.removeManager(manager)
              return
            }
            manager.load()
          }
        }
      })
    }, { rootMargin: '0px', threshold: 0.7 })
  }

  // 移除目标manager
  removeManager(manager: ImageManager) {
    const findIndex = this.managerQueue.map((m) => m.uid).indexOf(manager.uid)
    if (findIndex > -1) {
      this.managerQueue.splice(findIndex, 1)
    }
    if (this.observer) {
      this.observer.unobserve(manager.el)
    }
  }
}

// 导出插件，需要按照Vue插件注册机制规范
export default {
  install(Vue: any, options: LazyOpts = {}) {
    const lazy = new Lazy(options)
    Vue.directive('lazy', {
      bind: lazy.add.bind(lazy)
    })
  }
}
```
至此，大体上已经完成所有功能了，当注册插件时，会实例化一个`Lazy`对象，并初始化一些初始状态`loading`、`error`、`IntersectionObserver`，有关IntersectionObserver的使用可以详见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)，对于监测两者是否交叉一个友好的API；除了这些还有`managerQueue`队列

当使用`v-lazy`指令时，会执行`lazy的add方法`，将其添加到`managerQueue`中，并对其进行`oberve`，当元素处于交叉状态时，获取对应的manager，并加载其真实图片，当然可以在这里判断如果manager的状态已经不是loading，直接`removeManager`卸载对其的观测

简单使用：
```ts
// 全局注册
import VLazy from './directives/lazy/lazy'
Vue.use(VLazy, {
  error: '/error.gif',  // 初始化默认错误
  loading: '/loading.gif' // 默认loading
})

// HTML
<template>
    // 正常加载
    <img v-lazy="'https://s4.ax1x.com/2021/12/15/TS7e29.gif'" />
    
    // 对当前元素提供指定错误图片
    <img width="200" height="200" v-lazy="{ src: '/adad.png', error: 'https://s4.ax1x.com/2021/12/15/TSbQhD.jpg' }" />
    
    // 错误图片，将会加载错误
    <img v-lazy="'/a1.jpg'" alt="出错了..." />
</template>
```

## 优化
以上基本实现了所需的功能，但可能还有一些优化点需要做，如：`IntersectionObserver`的API虽然很好用，大部分浏览器也支持其特性，可惜的是IE却都不支持，如果想使用在IE里的项目，就得做兼容处理了；

再比如说，所有添加到队列中的manager，每当加载真实或者错误图片时，都会执行`loadImage`函数，创建img，请求图片，如果有多个图片的地址是一样的，就没必要再执行`loadImage`操作了，直接渲染目标图片即可，这种以空间换时间的策略会提升性能

上面仅仅是处理了src图片，也有些场景下还是会用到背景图，因此还需要一些改造，来支持背景图

### 兼容处理
当在IE时，不再使用`IntersectionObserver`，就会用到传统的滚动检测目标对象，进行差值计算，进行图片加载。因为此涉及到判断是否加载真正图片，只许对`Lazy`管理器进行改造即可

```ts
class Lazy {
  // ...省略部分代码
  // 定义属性来判断是否支持
  supportObserver: boolean = ('IntersectionObserver' in window)
  
  constructor(options: LazyOpts) {
    this.loading = options.loading || DEFAULT_URL
    this.error = options.error || DEFAULT_URL
    
    // 这里不再直接初始化IntersectionObserver
    this.init()
  }
  
  init() {
    // 不支持IntersectionObserver时直接初始化 scroll
    if (this.supportObserver) {
      this.initInterSectionObserver()
    } else {
      this.initScrollListener()
    }
  }
  
  // 检测window滚动
  initScrollListener() {
    const screenHeight: number = document.documentElement.clientHeight
    window.addEventListener('scroll', () => {
      this.doScrollCallback(screenHeight)
    })
  }

  // 滚动时执行判断每个manager是否已经达到条件加载图片
  doScrollCallback(screenHeight: number) {
    this.managerQueue.forEach((manager) => {
      const rest = manager.el.getBoundingClientRect()
      if (manager.status > IMAGE_STATUS.LOADING) {
        this.removeManager(manager)
        return
      }
      
      if (rest.top >= 0 && rest.top <= screenHeight - 100) {
        manager.load()
      }
    })
  }
  
  add(el: HTMLImageElement, binding: DirectiveBindingType) {
    //.. 省略部分代码

    // 这里也需要判断
    // 当不支持IntersectionObserver时，不再observe目标
    // 而初次执行doScrollCallback（可能初次目标已经达到加载条件）
    if (this.supportObserver) {
      this.observer.observe(el)
    } else {
      const screenHeight: number = document.documentElement.clientHeight
      setTimeout(() => this.doScrollCallback(screenHeight))
    }
  }
}
```

这样就解决了IE兼容的问题，现在可以打开IE浏览器，发现也是好使的，证明兼容性是没有问题的

### 图片缓存
针对缓存可以创建一个`Set`，对所有图片进行收集，当后面的图片进行请求时，先判断有没有对应的缓存，如有的话直接进行渲染即可；那么知道缓存的内容了，又在哪里创建缓存器呢？缓存器应该不会改变，从而可以在`Lazy`中创建缓存器，将其传入`ImageManager`

定义先加上对应的字段：
```ts
export type ImageManagerOpts = {
  //...
  cache: Set<string>
}
```

接着先创建缓存器：
```ts
class Lazy {
  // ...
  cache: Set<string> = new Set()

  // ...
  
  add(el: HTMLImageElement, binding: DirectiveBindingType) {
    // 创建manager时将cache传入
    const manager = new ImageManager({
      el,
      src,
      cache: this.cache,
      //...
    })
  }
}
```

在`ImageManager`里需要在加载时，判断时是否可以命中缓存，如有直接加载即可；没有命中缓存时，当家在完毕或失败时，对对应的URL进行缓存，提供后面缓存使用
```ts
class ImageManager {
  //...
  cache!: Set<string>

  constructor(opts: ImageManagerOpts) {
    // ...
    this.cache = opts.cache
  }

  load(next?: Function) {
    //...
    // 判断是否命中缓存，如有直接渲染
    if (this.cache.has(this.src)) {
      this.render(this.src)
      this.status = IMAGE_STATUS.LOADED
      return
    }
    //...
  }

  // 加载失败或成功对其缓存
  renderSrc(next?: Function) {
    loadImage(this.src)
      .then(() => {
        //...
        // 缓存
        this.cache.add(this.src)
      })
      .catch((e) => {
        //缓存
        this.cache.add(this.error)
      })
  }
}
```
缓存大致就这样，可以试试

### 背景图
支持背景图需要用到`指令参数`，处理起来也比较简单，判断指令是否具有`backgroundImage`（自定义）参数，有的话进行背景图渲染

类型定义：
```ts
export type ImageManagerOpts = {
  // ...
  isBackGround?: boolean
}
```

管理器改：
```ts
class Lazy {
  // ...
  add(el: HTMLImageElement, binding: DirectiveBindingType) {
    let src, error, loading
    // 判断是不是背景参数
    const isBackGround = (binding.arg && binding.arg.toLocaleUpperCase() === 'BACKGROUNDIMAGE') as boolean
    
    const manager = new ImageManager({
      //...
      // 传入
      isBackGround
    })
  }
}


class ImageManager {
  //...
  isBackGround: boolean

  constructor(opts: ImageManagerOpts) {
    //...
    this.isBackGround = opts.isBackGround || false
  }

  render(src: string) {
    // 背景图渲染
    if (this.isBackGround) {
      this.el.style.backgroundImage = `url(${src})`
      return
    }
    this.el.setAttribute('src', src)
  }
}
```

现在就可以使用背景图片渲染了：
```html
<!--背景图渲染，也可以指定loading、error等等-->
<div
    v-lazy:backgroundImage="{src: 'https://s4.ax1x.com/2021/12/15/TScWbd.jpg', loading: '/default-loading.gif'}"
    class="back-img"
/>
```

## 总结
本篇主要通过一个图片管理器`ImageManager`和一个懒加载管理器`Lazy`，分别实现了对图片状态的管理，和对图片请求真实资源的管理。通过使用交叉观测器`IntersectionObserver`来观测图片的临界值来加载真实资源，后又使用`scroll`监测window滚动来兼容IE对`IntersectionObserver`的不支持，最后进行各种优化完成插件功能

以上源码可以在[GitHub下载](https://github.com/ihengshuai/vue-lazy-plugin)，感谢点赞、感谢支持:smile:

<Reward />
<Gitalk />