---
title: 前端性能测试工具
description: 前端性能测试工具推荐,性能测试工具有哪些
head:
  - - meta
    - name: keywords
      content: 性能优化,性能测试工具,PageSpeed Insights,Lighthouse,SiteSpeed,Speedcurve,webpagetest
---

# 前端性能测试工具

## PageSpeed Insights
谷歌开发的一个免费的[网页分析工具](https://developers.google.cn/speed/pagespeed/insights/?utm_source=testingpai.com)，在地址栏中输入被分析的网站 url 地址，点击分析，在地址栏中输入被分析的网站 url 地址，点击分析
![webtest01-3a4e5a96.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o6twt7ycj30ql0g5gqx.jpg)
可模拟移动设备访问页面结果分析
![webtest02-170250e0.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o6ulk0flj30q80q6tg5.jpg)
桌面设备访问页面结果分析
![webtest03-3570086b.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o6v5n8s5j30q40qtdl5.jpg)
前端开发工程师，可以根据这个报告进行页面优化

## Lighthouse
Lighthouse 是谷歌开源的一款 Web 前端性能测试工具，用于改进网络应用的质量，适用于网页版和移动端。能生成一个包括页面性能、PWA（Progressive Web apps，渐进式 Web 应用）、可访问性（无障碍）、最佳实践、SEO 的报告清单提供参考，看看可以采取哪些措施来改进您的应用。

### 使用方法
- 浏览器 F12 功能
    在最新的谷歌浏览器 或 Edge 浏览器 访问一个被测试网站，按 F12 ，打开开发者工具，看到最后一个项就是 Lighthouse
- 下载安装到电脑
  ```sh
  npm install -g lighthouse
  ```
### 测试某网站
1. 访问被测网站，打开浏览器的开发者工具
![sitespeed01-06288c1d.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o6zw6z1oj30ok09s75t.jpg)

2. 点击【生成报告】 就会自动分析你访问的网站，得出性能分析报告
![sitespeed02-f43bb52a.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o70bnj2yj30on0lwjw4.jpg)

>这款工具，大家在用浏览器访问任意一个页面（包括需要登录，才能访问的页面），想要对这个页面进行性能分析都非常简单。
## SiteSpeed
[SiteSpeed](https://www.sitespeed.io/?utm_source=testingpai.com) 也是一款开源的，可以用于监控和检查网站性能的工具。可以通过 docker 镜像或 npm 方式来使用。这个工具，并不是单一的，而是一组工具集合，可以根据自己需要，选择适合自己的工具。

### 安装
- docker安装
```bash
sudo docker run --rm -v "$(pwd):/sitespeed.io"
sitespeedio/sitespeed.io:14.4.0 https://www.taobao.com/
```

- npm安装
```bash
$ npm install -g sitespeed.io   # 安装
$ sitespeed.io https://www.taobao.com/  # 测试淘宝网站
```
### 测试
测试结束后，会把测试结果写到 HTML 文件
![Snipaste20200901sitespeed01-2c335bdc.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o758tbqwj30q40obtja.jpg)
## Speedcurve
[Speedcurve](https://www.speedcurve.com/?utm_source=testingpai.com) 是一个前端性能综合监控网站，可以在网站输入被测网站的 url 地址，进行测试
![iShot2022-03-27 09.46.41.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o76uoqy3j320o12u4qp.jpg)

选择要默认访问网站的设备，进行模拟访问
![iShot2022-03-27 09.49.27.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o7b3rjpkj31z811uaj4.jpg)

你也可以将js脚本添加到网站中
![iShot2022-03-27 09.50.19.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o7bvjla7j31zo0z8guv.jpg)

访问后，网站会给出一份性能测试监控报告
![Snipaste20200901speedcurve04-40399a17.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o7capna4j30q20qx43v.jpg)

## webpagetest
[webpagetest](https://www.webpagetest.org/?utm_source=testingpai.com) 和上面的 speedcurve 相似，也是在一个网站中，输入被测试的网站 ip 地址，就可以对被测网站页面进行分析。但是，这个网站在国内，被友好的和谐了，会出现无法正常进行测试的情况。
![Snipaste20200901webpagetest01-06e3b767.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h0o7e7de2xj31530minb1.jpg)

好了，这些是现在比较方便的前端性能测试工具，你都了解吗？可能有同学会说为什么没有 yslow，嗯，这个也是前端性能测工具，但是，你可以去搜索下，看下你现在的电脑上能非常方便的使用这个工具吗？yslow，不可否认，是一款经典的 Web 端性能测试工具，但是现在使用起来非常的不方便，所以现在你想去学习这款工具，可能事被功半，收不到预期的效果，所以，个人不推荐大家学习这款工具了。

<Reward />
<Gitalk />