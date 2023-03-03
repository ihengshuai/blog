---
title: nvm切换node版本
description: 使用nvm丝滑切换node版本提高开发效率
head:
  - - meta
    - name: keywords
      content: nvm,切换node版本工具,node版本工具,n,开发效率,nodejs
---

# nvm切换node版本

以前学会了用nvm来管理node版本,后来就专心搞开发了.如今一些所谓的vue,react,koa,Express,egg等框架更新迭代太快,老项目和新项目对node版本依赖不同,老版本的node已经无法友好支持.今天打开控制台竟然忘记nvm的常用命令,前查后查想起来,现在做个笔记,方便以后查阅

## 下载安装NVM
1.github下载地址[https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66bu5vrtj315i0p977t.jpg)

2.下载完毕后,点击安装,目标盘随便更改. 如果是win10,请用管理员方式安装

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66ceyahuj30ip0edjw2.jpg)

3.查看是否安装成功
>这里作者安装了1.1.7版本

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66jdhqybj30m40akdg5.jpg)

## 配置环境变量

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66emw5c8j30lz01cwej.jpg)


## 使用NVM查看信息
1.`nvm list` 查看安装了所有的node版本

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66nl7ldlj30o60aiwf7.jpg)

2.`nvm use 版本号`切换版本

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66qqiya4j30ps0amjsp.jpg)

3.在你还不知道下载Node哪个版本前,你可以 `nvm list available` 查看可以安装的版本号

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66vsv1gpj30sj0i1n0f.jpg)


## 使用NVM下载Node等等

4.`nvm install  版本号`下载指定版本Node
>这里演示下载8.9.4版本

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66ydm8jej30s40emtbc.jpg)

5.`nvm uninstall 版本号`卸载指定Node含npm,以及当前版本全局工具
>这里演示卸载8.9.4版本

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk670p8pdzj30qs0bltam.jpg)

>注意,当你卸载哪个版本的Node时,那个版本的全局环境下的工具也全部删除掉了,包括npm

**比如**
```sh
# current Node.js 8.9.4
npm install nodemon -g 下载了全局nodemon
nvm uninstall 8.9.4  写在了此版本node
nvm use 10.6.0  使用10.6.0Node
npm install nodemon -g  重新安装nodemon
```
## 常见问题
1.下载安装好后使用命令`nvm install [指定版本]`,出现诸如以下错误

```sh
  nodejs An existing connection was forcibly closed by the remote host:连接被强行关闭

 Could not retrieve https://nodejs.org/dist/latest/SHASUMS256.txt:无法获得指定的校验文件
```

2.**解决办法:** `将nvm中node和npm的源设置到国内源(一般使用taobao)上。`

3.在nvm的安装路径下找到settings.txt打开:
```md
# root: C:\nvm
arch: 64
proxy: none
originalpath:
originalversion:
node_mirror:
npm_mirror:
```
4.分别指定node和npm的mirror
```md
node_mirror: npm.taobao.org/mirrors/node/
npm_mirror: npm.taobao.org/mirrors/npm/
```
5.这样就解决好了~,你学废了吗？


<Reward />
<Gitalk />