---
title: Charles抓包工具使用指南
description: charles一个简洁适配多系统的强大的抓包工具,方便抓取web和移动端数据包,设置代理等等
head:
  - - meta
    - name: keywords
      content: charles,charles抓包工具,手机抓包,ios抓包,android抓包,客户端抓包,抓包工具,Mac抓包,前端调试,frontend debugger,chrome调试,调试技能,node调试,线上调试
---

# Charles抓包工具

上一篇介绍了[fiddler](/frontend/debug-skill/fiddler.html)抓包工具，这篇就来看看[charles](https://www.charlesproxy.com)的使用

[charles](https://www.charlesproxy.com)抓包工具和[fiddler](/frontend/debug-skill/fiddler.html)原理类似也是基于HTTP请求中间人代理，通过和服务端、客户端建立通信将客户端的请求数据发送服务器，并将响应数据传输给客户端，实现抓包记录。

![iShot_2022-10-18_07.58.05.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7943v0e35j31520hsdu3.jpg)

虽然原理相同，由于是不同工具，一些功能还是有细微差距的，charles相比[fiddler](/frontend/debug-skill/fiddler.html)更加简洁，但并不是更弱一些。其界面简单宜人，比较清爽，这点可能已经吸了一大半的用户了吧。再者charles把一些常用的功能选项直接封装好了(如：模拟不同的网络俗)，而[fiddler](/frontend/debug-skill/fiddler.html)可能有时需要修改代码，这对一些基础薄弱的小伙伴是非常不友好的，那么你可以试试charles，让我们开始吧！

:::tip
[charles](https://www.charlesproxy.com)同样有些功能也是需要收费的，但是相比[fiddler](/frontend/debug-skill/fiddler.html)可以免费试用基础功能，而且市面上[破解](https://www.zzzmode.com/mytools/charles)的很多(自行搜索即可)，对macOS用户也比较友好，可以尝试用用感觉一下
:::

## 下载安装
charles支持windows、macOS、linux等多个版本

进入charles的官网[https://www.charlesproxy.com](https://www.charlesproxy.com)，进入`Download`Tab页，可以看到下面有多个系统版本可供下载，选择适合自己系统的点击，即可下载。

最下面还展示了下载firefox插件，看描述的意思是firefox旧版本可能会需要下载charles的插件来支持抓包，新版本就不需要下载了，大家可以根据自己的环境进行配置。这里作者是macOS，就安装了mac版，以下内容都以mac版charles作为基础，windows基本一样。

![iShot_2022-10-18_08.09.53.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h794f49qczj31800uy4dg.jpg)

## 面板介绍
![iShot_2022-10-18_08.59.50.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h795v729hmj310u0og4d0.jpg)

可以将charles的分为以下几个模块：
- **菜单栏**：一些全局相关的配置，如：偏好设置、记录显示与编辑、记录展示方式、代理配置、常用的工具、帮助等等
- **工具栏**：快捷设置菜单，如：清除记录、开关记录、开启弱网、断点设置、执行请求、重新请求等等
- **抓包记录**：显示抓包的记录，可以以域名归类记录也可以按请求顺序展示记录，单击会显示右侧的详情面板，右击有一些菜单功能
- **请求详情**：请求详情来显示当前请求的具体信息，如：请求头、响应主体、请求主体、TLS、Timing(一些请求连接时间)、size、状态码等等信息，还可以用不同类型格式查看请求或响应内容

接下来分别具体讲讲每个模块的使用

## 菜单栏
菜单栏相对来说比较重要，它来控制charles全局，可以导入导出记录、设置记录查看方式、设置代理(重要)、常用工具、证书安装等等

- **File**：可以导入导出记录，文件会以`.chls`后缀保存，这种功能可以将记录发给别人查看比较方便
- **Edit**：复制粘贴记录，查找记录(可以根据正则，查找范围多个维度进行查找，比较好用)，当然这些功能都有对应的快捷键，当熟悉以后就不需要这么麻烦了
- **View**：一些和查看记录的配置有关
  - 设置以`Structure(用域名归纳请求，类似于嵌套文件夹，个人喜欢这种风格的)`和`Sequence(请求顺序)`来显示记录，推荐使用Structure，这个设置可以直接在记录面板点击即可
  - 高亮或者聚焦(会将其他请求折叠进一个文件夹)某个具体的请求，方便调试
  - 自定义请求的请求或响应的查看方式(不怎么用)
- **Proxy**(重要)：用来设置代理、网速、HTTPS、断点、DNS等等功能
  - Start Throttling & Throttle Setting：用来模拟网速，弱网测试比较方便
    ![iShot_2022-10-18_09.59.42.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h797ldqxzjj30vc0z4gtg.jpg)
  - Enable Breakpoints & Breakpoints Settings：用来设置断点请求，可以根据不同的域名、路径、请求方法等多个维度来设置，比较实用
    ![iShot_2022-10-18_10.08.21.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h797ur6yttj31lo0kqahr.jpg)
  - Proxy Setting：用来设置HTTP、Socket代理，也可以设置系统代理。默认HTTP Proxy代理监听端口为8888，可以修改如7777。macOS可以设置启动设置为系统代理(目前高版本window都会默认设置为系统代理)，默认这些都是开启的。
    ![iShot_2022-10-18_10.10.47.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7980ya73aj30ya0ug79c.jpg)
    ![iShot_2022-10-18_10.11.08.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79812y8dwj30xg0ecwgh.jpg)
  - Reverse Proxy：反向代理，可以将本地的请求反向代理到其他请求
  - DNS Setting：配置DNS
  - Access Control Setting：用来配置局域网中的其他机器代理规则，可以配置哪些ip允许代理，默认会允许所有ip代理的
- **Tools**：一些请求相关配置工具，如：阻塞cookie、请求拦截代理、请求rewrite、执行请求等等功能
  - Block Cookie：阻塞请求的cookie，可以自定义匹配地址来阻塞，下图模拟了当请求`http://192.168.3.58:9999/cookie`cookie会被拦截，而`http://192.168.3.58:9999`则不会
    ![iShot_2022-10-18_14.36.29.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79fnv26ioj30ve0m8juo.jpg)
    ![iShot_2022-10-18_14.38.38.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79fo7viq0j315m0fyjw0.jpg)
    ![iShot_2022-10-18_14.38.51.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79fodzs7yj312u0fc42v.jpg)
  - Map Remote & Map Local & Rewrite：用来拦截请求可以代理到其他地址也可以返回本地的文件等等，自己可以试试
  - Block List & Allow List：阻塞和允许指定的请求
  - Compose & Repeat：可以手动用charles来执行某个请求，可以指定并发数
- **help**：用来安装证书，配置https的
    ![iShot_2022-10-18_14.48.23.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79fyedjnwj31a40hs7m0.jpg)

## 工具栏
工具栏主要是一些快捷设置菜单栏，如：清除记录、开关抓包、ssl开关、网速配置、断点设置、手动请求、重新请求、一些配置等等，基本上在菜单栏已经介绍的差不多了，这里自己手动操作一遍就可以了
![工具栏](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h77z66zbt6j31460gumzr.jpg)

## 抓包记录
抓包记录是用来记录抓包的记录的，可以根据域名来归纳记录也可以使用请求顺序的方式展示记录，推荐使用域名归纳方式方便调试，一目了然；底部的`Filter`可以简单的过滤抓包记录，其他的高亮、聚焦展示前面已经讲过了。
![iShot_2022-10-18_14.57.07.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79g6w1qwej30q80nctgf.jpg)

## 抓包详情
抓包详情通常就是我们用来分析返回来的内容和一些请求信息等，前端可以根据请求相关时间做一些优化
![iShot_2022-10-18_15.10.19.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79gm4bechj314o0yiahy.jpg)
![iShot_2022-10-18_15.11.47.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79gma4ixjj31500y6ne7.jpg)

## 请求代理与篡改
请求代理与篡改可以参考菜单栏`Tools`中的`Map Remote & Map Local & Rewrite`等几个来调试，非常简单，这里就不介绍了，你也可以查看上一篇[fiddler](/frontend/debug-skill/fiddler.html)这块，基本都一样

## 断点调试
开启断点调试的条件：1.要勾选`Enable Breakpoint` 2.需要在`Breakpoint Setting`中勾选启用并且需要填写需要断点的域名，设置前面已经介绍了，忘记的可以前面查看。那么打了断点一般用来做什么，可以模拟请求时长、修改请求体和响应体等等。

这里设置断点`http://192.168.3.58`，当请求是这个域名时，就是命中断点，刷新浏览器发现已经命中断点
1. 当前请求断点，查看请求体，也可以编辑请求内容
![iShot_2022-10-18_15.22.46.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79h40gw64j31ju0xe10i.jpg)
2. GET请求手动添加两个字段，点击`Execute`执行下一步
![iShot_2022-10-18_15.23.54.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79h47z9vvj31b80xugqz.jpg)
3. 当前为响应断点，可以看到刚刚添加的两个字段已经带上了，现在也可以编辑响应内容了
![iShot_2022-10-18_15.25.42.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79h4elr6nj31fq0xugv2.jpg)
4. 编辑响应内容，删除了原来的返回数据，自定义一条数据
![iShot_2022-10-18_15.27.46.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79h4mh80nj31dc0x6gsh.jpg)
5. 查看浏览器内容已经经结果修改了
![iShot_2022-10-18_15.28.26.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79h4swgb3j31680wcaly.jpg)

以上就是断点调试的基本使用，其他的可以根据自己的需求进行配置即可

## 弱网测试
charles可以模拟不同的网络环境，很方便进行网速相关的测试如：超时、断网等等。这一点相比fiddler，charles内部已经内置了集中网络环境，而fiddler则需要改代码，不是很友好。

同样关于网络配置其前面已经讲述了，可以往上翻阅。需要注意的是，要开启`Start Throttle`和配置`Throttle Setting`。

这里没有用内置的网络环境，自定义下载速率为`5kb`，已经相当慢了
![iShot_2022-10-18_15.48.05.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79hnzga3wj30vc0z4agt.jpg)
查看本地请求4s才完成，通过修改不同的网速可以模拟不同的网络环境
![iShot_2022-10-18_15.48.35.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79hof3ko8j315003cjsb.jpg)

## 配置HTTPS
在没有配置HTTPS下，对于HTTPS请求的请求和响应数据无法解码都是乱码，需要配置了HTTPS后才能查看解码后的内容，下图是在没有配置HTTPS的情况下，抓取`https://www.baidu.com`地址的请求，全是乱码
![iShot_2022-10-18_15.53.58.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79hu3emtyj31kw1507sk.jpg)

**配置HTTPS步骤**：
1. `Help > SSL Proxying > Install Charles Root Certificate`，系统安装charles证书并信任
  ![iShot_2022-10-18_15.58.48.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79hz6566rj314m0e679n.jpg)
2. `Proxy > SSL Proxying Settings > Enable SSL Proxying`开启SSL Proxy，添加抓取的`IP为*`，`端口为443`
  ![iShot_2022-10-18_16.03.50.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79i4tyqqpj30y80rwq7z.jpg)

再次查看抓取的HTTPS请求，已经完美解码了
![iShot_2022-10-18_16.05.24.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79i627esuj31jm0y84qp.jpg)

## 客户端抓包
配置客户端抓包首先需要和主机在同一局域网下，并且基于HTTPS步骤，主要步骤如下：（这里以ios为例）
1. 打开Safari输入charles地址`192.168.3.58:7777`，fiddler会弹出是否允许抓包当前ip(手机ip)，点击允许，你也可以在`Proxy > Access Control Setting`中直接配置允许的ip，就不会有当前弹窗提示了
  ![iShot_2022-10-18_16.17.39.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jcz33ohj318m0amwi6.jpg)
2. 配置手机代理到charles
  ![IMG_0587.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jf076enj30n00p0wel.jpg)
3. 当前其实已经可以抓取手机包了，但是https请求还是有一些问题，因为没有在手机上安装charles证书。安装charles证书，点击`Help > SSL Proxying > Install Charles Root Certificate On a Mobile Device...`点击，会弹出手机的步骤，共两步，1.手机网络代理到charles和2.手机浏览器访问`chls.pro/ssl`来安装证书，上一步已经讲了配置手机代理，这里我们访问地址`chls.pro/ssl`来安装证书即可

  ![iShot_2022-10-18_16.36.11.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jg4n7u4j31aa0ow4ps.jpg)
  ![iShot_2022-10-18_16.37.09.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jhcded2j318m0begqm.jpg)
  ![IMG_0585.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jehmj65j30n00ti768.jpg)
4. 安装证书到系统，需要信任证书，输入手机密码等等，一直下一步即可

  ![IMG_0586.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jfaysdfj30n00p40uj.jpg)
5. 在`关于手机 > 证书 > 信任证书`信任刚刚添加的证书

  ![IMG_0588.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jfk5uckj30n00g5765.jpg)
6. 打开Safari访问`https://blog.usword.cn`查看charles的抓包，发现已经抓包成功

  ![iShot_2022-10-18_16.35.21.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jgr3mmaj31js0zqkbl.jpg)

以上便是ios的配置抓包流程，其他手机系统大同小异

## 汉化补丁
我觉得英文版也很好优化，没必要汉化，如果你更喜欢中文，这里是互联网提供的补丁连接，可以按自己的需要下载
https://www.52pojie.cn/thread-1350618-1-1.html

## 常见问题
这里列举一些常见的问题，也是作者刚开始使用时面临的问题，也有互联网上其他人的一些问题，如果你正因此困扰，希望这些可以帮到你

### 本地地址无法抓取
这个问题大概对于所有charles新手来说都会遇到，也就是在自己本地启动一个服务器，用`localhost:port`去访问服务，charles却抓取不到，很纳闷。这是由于一些系统硬编码的问题，charles抓取不到localhost的流量，因此charles做了一个代理，让我们用`localhost.charlesproxy.com`来代替`localhost`域名，其实将域名`localhost.charlesproxy.com`映射到了`127.0.0.1`所以可以抓到包了，点击这里官方做了[解释](https://www.charlesproxy.com/documentation/faqs/)

![iShot_2022-10-18_17.02.57.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jtshwmrj317q0leqgo.jpg)

现在访问`http://localhost.charlesproxy.com:9999`确实抓取到了
![iShot_2022-10-18_17.04.41.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jvlaiamj31le1ccb29.jpg)

除了上面的方法，你可以使用本地局域网ip也可以抓取到
![iShot_2022-10-18_17.07.11.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h79jy6k0jjj31kq18s4qp.jpg)

## 总结
以上就是charles的使用方法，相信到这里已经可以满足你的常用需求了，一定要自己动手实践才能熟能生巧；当然本篇也是挑了一些必懂的使用方法，其他使用可以自行摸索，都很简单的。和[fiddler](/frontend/debug-skill/fiddler.html)一样，charles也是基于客户端和服务端中间的代理，所以可以抓取记录，原理图可以看[fiddler](/frontend/debug-skill/fiddler.html)这篇。

>相关文档：

[https://www.charlesproxy.com/documentation](https://www.charlesproxy.com/documentation/getting-started)

<Reward />
<Gitalk />