---
title: wireshark使用教程
description: 使用wireshark分析网络数据包、协议、通信
head:
  - - meta
    - name: keywords
      content: wireshark,wireshark抓包工具,网络抓包工具,协议抓包,frontend debugger,chrome调试,调试技能,线上调试
---

# wireshark使用教程

到这里已经讲了两个抓包工具的使用了，大家应该对抓包不是很陌生了。而[wireshark](https://www.wireshark.org)相对于[fiddler](/frontend/debug-skill/fiddler.html)和[charles](/frontend/debug-skill/charles.html)更加偏向于网络层面的抓包或者说是一个网络封包分析工具。使用对象更适合于网络相关人员(网络管理员/相关运维等等)，目的用来截取网络通信，显示详细的封包资料。

wireshark可以用来检测网络环境、入侵侦测系统等网络层面的用处，相对于开发人员，可以用来分析一些基础的网络层面的基础，如HTTP协议、UDP协议、TCP/IP协议、ARP协议等对我们比较友好的网络协议，当然如果你熟练操作网络可以没有任何限制。

## 下载安装

:::tip
由于一些历史原因，wireshark已经是个免费软件，下载简单，功能强大，非常适合网络协议的学习和认识
:::

[wireshark](https://www.wireshark.org)支持windows、macOS、Linux几个版本，基本上常见的操作系统都可以支持的，直接打开官网[下载页面](https://www.wireshark.org/#download)，选择适合自己的操作系统，下载即可，下载完后一路点击确定安装就可。这里作者是macOS，就安装了mac版，如无特殊备注，以下都以mac版本为基础介绍，其他大同小异。

## 菜单栏
![iShot_2022-10-21_08.43.06.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7cm8lmc0jj315o02agnc.jpg)

菜单栏这里只讲下统计，它相对来说更加实用。统计内部有好多不同维度的分组，可以从不同维度去查看统计信息，如：流量、TCP流、UDP多播、HTTP等等。统计需要数据才可以统计出结果，可以先抓取少量的包，点击内部的流量图可以很清晰的看到网络通信

![iShot_2022-10-21_08.41.25.png](https://tva1.sinaimg.cn/large/005HV6Avgy1h7cm6x7c2fj31wc15gb29.jpg)

## 工具栏

## 过滤器

## ARP协议

## TCP协议

## 三次握手

## 四次挥手

## UDP协议

## 统计


<Gitalk />