---
title: Fiddler使用技巧
description: fiddler抓包工具的使用,fiddler调试web应用程序的利器
head:
  - - meta
    - name: keywords
      content: fiddler,fiddler抓包工具,抓包工具,前端调试,frontend debugger,chrome调试,调试技能,node调试,线上调试
---

# Fiddler
[Fiddler](https://www.telerik.com/fiddler) 是位于客户端和服务器端的HTTP代理，是一个强大的抓包工具；可以作为系统的代理也可以代理具体的进程(如：chrome、firefox)，针对代理对象fiddler会记录其所有的会话记录，分析请求数据、调试请求、刷新请求、设置断点、模拟或覆盖服务器返回的数据，还可以调试https请求，总之功能强大，是web调试的利器

:::tip
fiddler有[fiddler everywhere](https://www.telerik.com/download/fiddler-everywhere)、[fiddler classic](https://www.telerik.com/download/fiddler)等其他版本，其中fiddler everywhere功能最为强大同时支持多个系统，但是需要收费，当然你可以上网搜索破解版，这里就不赘述了：
本人在工作中使用[fiddler classic](https://www.telerik.com/download/fiddler)版本，其功能也不逊色够开发和测试用了，推荐使用（不支持mac）。
:::

>注: 本文以fiddler classic版本进行介绍，以下fiddler文案全部代表的是fiddler classic

## 面板介绍
![QQ截图20221010191428.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h70eoatasoj31440ncqdb.jpg)
当你下载安装完fiddler双击打开后，大概如上图这样；fiddler由不同的面板模块组成，主要包括：

- 菜单栏
- 工具栏
- 代理监控面板
- execquick、状态栏
- 详情面板
