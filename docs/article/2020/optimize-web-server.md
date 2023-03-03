---
title: 优化改善网页的加载及性能
description: 如何优化网页的加载速度和性能指标,提高网站的seo
head:
  - - meta
    - name: keywords
      content: 性能优化,nginx,部署应用,deploy,缓存机制,强缓存,协商缓存,http缓存,CDN,服务器
---

# 优化改善网页的加载及性能

> 食用对象：不是土豪但是有点土，或者想了解下网站性能优化问题的同学

我记得那年像大同学一样怀揣着一颗IT梦进军了互联网的大门，开始朝着我不'秃'谁'秃'的幻想一步步照亮前方的道路。
然而前进的道路，坎坷往往不会缺席。学习的过程往往会产生种种疑惑与不解，在互联网高速发展的时代，百度成了解决问题的最大老师，那时对于编程解答最常用的就是CSDN了。随着每次不断在其上寻求解答外，网站也让我感到种种好奇，心想如果自己有个属于自己的技术博客该是多香呢。
故事经过了半年时间，各大云服务厂商各种推广，相爱相杀，对于仅有一个月生活费的大学生来说机会来了，说是白嫖也不为过:joy:，买到手后就开始各种折腾，虽然很累却很开心。
## 起步
小编用的是一台CentOs机器，刚开始就进行一些列的环境配置，如：nginx、node、java、mysql等一些列安装，当然中间也有不少的挫折，遇到不会的就百度搜一搜，一步一个脚印完成配置的，总体来说配置完觉得挺开心的...
本篇主要阐述`网站性能优化`，至于题外话就简单一概而过了
接着就是给*网站搭建应用了*

## 应用搭建
小编的博客主要是基于自己的[webpack-mpa-template](https://github.com/ihengshuai/webpack-mpa-template)项目骨架集成的，采用了前后端分离进行开发，前端使用传统的`webpack`、`Vue`、`React`、`jquery`等技术（项目模板已经集成好了，开箱即用），后端一开始采用`Spring`+`MySQL`开发，后台考虑到，nodejs的轻巧及方便以及对大批前端同学友好的全栈项目而言，就走上了`koa`+`mysql`的主体方案，相对大批前端同学来说更加友好。
本文就不讲述搭建应用的详细内容了，你可以参考我的项目骨架[webpack-mpa-template](https://github.com/ihengshuai/webpack-mpa-template)，开箱即用，支持Vue、React
## 应用部署
小编开发完基本的功能后，就准备部署到服务器上了。当然要提交代码到github了，服务器拉取代码后直接
```yaml
yarn run build

yarn run deploy

pm2 start blog-app
```
前面说了，后端主要是以node作为支撑服务的，node部署采用流行的[pm2](https://pm2.keymetrics.io/)进行部署的，其有很好的负载均衡、热重启、日志收集等等爽到不能再爽的功能，很值得推荐。大家可能还有疑惑那前端打包的页面是如何托管的，其实再执行`yarn run deploy`后，自动会把打包后的前端页面推到后端的 `public` 目录作为静态路由，之所以不单独为前端页面部署服务，是因为作为后端路由后可以很好的路由拦截，进行身份鉴权等问题，你是不是很好奇如何做到的，在[webpack-mpa-template](https://github.com/ihengshuai/webpack-mpa-template)里都进行了简单的说明
### 鉴权拦截器
`鉴权拦截`主要是针对登录信息进行拦截的，整个工程划分了免登录和登录机制模块，其主要针对登录模块进行拦截的
下面是鉴权拦截器的部分:point_down:
```js
/* 借用中间件机制 */

// middleware/index.js
// 鉴权机制
app.use((ctx, next) => verifyAuth(ctx, next))

// 随后路由的鉴权或者其他鉴权可以在这里进行
// middleware/auth/index.js

// 设置黑名单用来鉴权 => 可以采用 正则配置
const apiBlackList = ["^/permission", "^/xxx$"]

// 鉴权(伪代码)
function validateAuth() {
    // 这里可以根据身份信息进行鉴权
    // 你可以使用token、cookie或者其他，自由配置
}
```
>在项目骨架中路由和鉴权有权衡约定，其中有详细说明，在此就详细展开了
你只需要在 `validateAuth` 根据身份信息拦截即可
### nginx代理
前面讲述了我们的应用已经正常运行，接下来就需要进行http配置，使用域名映射到node server。
在`conf.d`路径下我们建立单独的`appName.conf`来配置单独应用(如果你熟悉nginx)，这样以应用配置方便以后管理及维护，屡试不爽
```nginx
server {
  listen 80;
  server_name blog.cn; # 绑定的域名
  
  # 进行反向代理
  location / {
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $http_x_forwarded_for;
    proxy_pass http://127.0.0.1:5695; # 本地node server 地址
  }
}
```
以上就是针对当前应用的nginx配置，其绑定了`blog.cn`域名，配置完后保存退出后执行:point_down:
```yaml
nginx -s reload # nginx 重新加载配置
```
完成后当我们访问`blog.cn`就会打开我们的应用

## 性能优化
以上配置好了应用及域名，然而结果总是出人意料:joy:，当打开网站时发现，我来个去的蜗牛速度，打开需要`10几秒`，简直要吐了，然而当我点击某篇文章时，发现居然要加载15s才能进来，我差点一头撞死:sob:，突然对白嫖的感觉不那么香了。这要是真的是这样，别说别人浏览文章，我自己都嫌弃。
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gvzpknsk8vj30tv0d60z9.jpg)
上图是后来优化后的性能分析一张图（刚开始忘记截图），可以很明显看出`entry.js`加载了10多s，大小972kb(当时加载快20s，大小1.4M)，这对于1M宽带的服务器来说加载很慢是肯定的
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gvzpx69v9gj30ui09owic.jpg)
上图是js加载网络图(这是优化后的，请忽略时间，还有size大小，主要是讲没有命中缓存)

从上面可以分析出:
1. js bundle过大，虽然进行了代码分割但还是比较大，可以采用`cdn`网络资源，可以大大减小bundle体积，也可以减小请求时间
2. 当点击某篇文章时需要等待20s时间，是因为异步加载的js文件过大，因此可以进行预加载，利用浏览器的空闲时间，主动加载，既不影响页面的加载，还能提高加载速度
3. js资源没有合理进行缓存，每次重复请求，因此可以缓存静态资源，减少不必要的请求
3. 懒加载优化网站友好过渡信息

知道了优化的方向，接下来就着手不同问题对症下药

## 设置CDN
在webpack(4.x)中我们进行打包时，有个[`optimization`,`splitChunks`](https://v4.webpack.js.org/configuration/optimization)字段
可以在这里进行代码分割的逻辑，因为要结合CDN，对于一些常用的库文件，可以忽略打包，这样就可以减小打包体积，分割的代码也会变小
```js
// webpack.prod.config.js
module.exports = {
  // ...其他配置
  
  // 忽略打包采用cdn
  externals: {
    "vue": "Vue",
    "vue-router": "VueRouter",
    "vuex": "Vuex",
    "react": "react",
    "jquery": "jQuery",
    "echarts": "echarts",
    "moment": "moment",
  },
  
  // 代码分割
  optimization: {
    splitChunks: {
      // 总的配置
      chunks: "all",
      minSize: 30000,
      minChunks: 2,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        // 当前模块相同的配置会覆盖全局配置
        vender: {
          // 对于当前模块 的配置
        },
        // ... 可以继续根据模块或者第三方库进行划分
      }
    }
  }
}
```
现在需要在页面中主动引入库文件的cdn
```pug
// pages/index.pug (骨架HTML提供了原生和pug)

//- 引入了jquery
script(src="https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js")
```

以上简单概述了使用webpack`代码分割`和`忽略打包采用cdn`引用

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gvzqm3eg86j30t704labr.jpg)
(首次加载)
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gvzqjhu8faj30y106ttbw.jpg)
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gvzqk7lwb6j30u706wtbv.jpg)

上图即在使用cdn后的网络加载图，而且cdn自带缓存，可以看出首次加载还是很快的，基本上200ms，并且完全不会消耗自己服务器的性能，当再次刷新时cdn全部命中缓存，time全部为0，这也太香了...

介绍完代码分割及CDN，接着来说说`预加载`

## 预加载
> 预加载顾名思义就是提前加载资源，也就是说在下次需要使用该资源或该资源可能会被使用时，提前加载，减小下载请求，或命中缓存，这样就会提高响应速度

提前加载涉及到 `preload` 及 `prefetch`，二者都是为提前加载资源而生的，那两者有啥不同呢？
- preload
    `preload`一般是提前加载当前页面需要使用的资源，但其不会阻塞主线程进行渲染
- prefetch
    `prefetch`一般是用来其他页面可能会用到的资源，比如 `A页面` 访问 `B页面` 需要用到的 `xx.js`资源，浏览器会在cpu空闲时主动加载，其不会阻塞主线程进行渲染

在上面综合分析后，需要的是`prefetch`。因为首页并没有什么太大的资源需要加载，库文件已经采用CDN的方式引用，则无需担心加载问题。问题主要在于查看文章时，其他页面需要的js文件过大，加载时间过长，因此，在加载首页时对其进行prefetch，则在进行查看文章时实现秒开的感觉

`preload`和`prefetch`都可以在webpack中进行配置，[更多详细配置戳这里](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)

因为网站使用的是 `bytemarkdown` ，好像是刚发布不久，碰巧看到了就试试水，可惜现在并无CDN引用的链接来使用，只能采用模块打包，文件还是比较大的，这里主要是对其进行预加载

上代码:

```js
// 预加载 bytemarkdown

import(/*webpackPrefetch: true*/ "@/components/ByteMd/ByteMd")
```
采用合适的时机进行资源 `prefetch`

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gvzrbxnufqj30ru0bswjd.jpg)
上图便是进行了`prefetch`配置后的网络加载图，可以看出，在空闲时间浏览器主动加载了 `0.3373.js`资源，并且用 `prefetch` 标记了 此次请求，可以很清楚当前是 预加载
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gvzrfz6eflj30my084whc.jpg)
当点击文章跳转到详情页时，只是加载了`16.32..js`文件，只花了`424ms`，其依赖的`0.3373.js`文件已经预加载好了，实现了秒开:scream:，实在是太香了，此时心里突然对 白嫖 好感十足:joy:

接着 资源缓存 :point_down:

## 缓存
>缓存：初次访问时对静态资源进行缓存或储存，在下载访问时根据不同的缓存策略命中缓存返还资源，减少请求

在讲缓存前，先大概了解下 缓存又分为 `浏览器缓存` 和 `http缓存`，二者相辅相成，你中有我我中有你，如果你对缓存还不太了解，可以阅读我的另一篇文章 [web缓存策略](/article/2020/web-cache.html)，此处就不在详细展开

对于js、css文件，可以在webpack进行打包时，给文件添加hash值，在迭代项目时，会根据hash不同主动进行资源获取，这里推荐使用`contenthash`及文件内容不变，hash不变。

```js
// webpack.config.js

module.exports = {
  output: {
    path: resolve("../client/dist"),
    filename: USE_HASH ? "js/[name].[chunkhash:4].js" : "js/[name].js",
    publicPath: "/",
    chunkFilename: USE_HASH ? "js/[name].[chunkhash:4].js" : "js/[name].js",
    // ... 其他配置
  },
}
```
这样就解决了更新问题

接着需要在nginx中进行静态资源的缓存(本文假设你对nginx有基本了解)
```nginx
 # 缓存图片，音频等资源
 location ~ .*\.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|gz|mp3|mp4|ogg|webm)$ {
    # 资源防盗链
    valid_referers *.usword.cn ~\.google\. ~\.baidu\. *.qq.com;            
    if ($invalid_referer) {                                                
      rewrite ^/ http://tva1.sinaimg.cn/large/005HV6Avgy1gvn4e450oxj602.jpg;                                                                         
      return 403;                                                    
    }                                                                      
    proxy_pass http://127.0.0.1:8882; # node server
    proxy_redirect off;                        
    proxy_set_header Host $host;
    proxy_cache my_cache; # nginx指定缓存项
    proxy_cache_valid 200 304 24h;
    proxy_cache_valid any 10m; # 代理过期时间
    expires 7d;  # 资源过期时间
    add_header Is-Cache true; # 天机自定义头部                                             
 }                                                                              

 # 缓存js，css 同上
 location ~ .*\.(?:js|css)$ {                                                   
    proxy_pass http://127.0.0.1:9901;                                      
    proxy_set_header Host $host;                                           
    proxy_cache my_cache;                                                  
    proxy_cache_valid 200 304 24h;                                         
    proxy_cache_valid any 10m;                                             
    expires 7d;                                                            
    add_header Is-Cache true;                                              
 }                                                                              
```
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gvzs1comyfj30th0a50x6.jpg)
上图即添加nginx缓存后，非首次访问，浏览器会命中缓存，实现秒开功能

### 懒加载
预加载相对的就是预加载，为了提高网页的响应速度，减少不必要的资源请求是很提倡的做法
1. 针对图片资源
    可以采用图片懒加载，用其他展位图进行展示，然后一步一步加载图片，在效果上也会比较舒服，很直观的能让用户感受到：哦，资源加载中

2. 针对接口请求
    减少请求量，采用分页加载。每个用户面对的都是有固定尺寸的显示器，其可展示的内容就只占一屏，其后面的数据就算加载了用户也看不到
    可以对浏览器进行滚动监听，当到快到底部时，再进行下一部门内容的加载
    
## 资源压缩gzip
nginx示例配置，更多配置戳这里查看[官方文档](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)。
```nginx
server {
  gzip on;
  gzip_types text/html text/css application/javascript;
  gzip_static: on;
  gzip_proxied: expired no-cache auth;
  gzip_buffers: 16 8k;
  gzip_min_length: 2k;
  gzip_comp_level: 4;
  gzip_http_version: 1.0;
  gzip_vary: on;
  gzip_disable: "MSIE [1-6]\.";
}
```
//待更新...

## 总结
本文主要从cdn、代码分割、资源缓存、预加载和懒加载等方面，不断优化了网站的加载速度，可能还需要不断的优化，但至少现在比刚开始已经快的很多了。
结尾容我感叹一句：`白嫖不容易，别放弃白嫖`


<Reward />
<Gitalk />