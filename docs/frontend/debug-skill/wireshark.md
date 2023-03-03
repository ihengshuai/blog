---
title: wireshark网络抓包工具使用教程
description: 使用wireshark网络抓包工具分析网络数据包、协议、通信
head:
  - - meta
    - name: keywords
      content: wireshark,wireshark抓包工具,网络抓包工具,协议抓包,frontend debugger,chrome调试,调试技能,线上调试
---

# wireshark网络抓包

到这里已经讲了两个抓包工具的使用了，大家应该对抓包不是很陌生了。而[wireshark](https://www.wireshark.org)相对于[fiddler](/frontend/debug-skill/fiddler.html)和[charles](/frontend/debug-skill/charles.html)更加偏向于网络层面的抓包或者说是一个网络封包分析工具。使用对象更适合于网络相关人员(网络管理员/相关运维等等)，目的用来截取网络通信，显示详细的封包资料。

wireshark可以用来检测网络环境、入侵侦测系统等网络层面的用处，相对于开发人员，可以用来分析一些基础的网络层面的基础，如HTTP协议、UDP协议、TCP/IP协议、ARP协议等对我们比较友好的网络协议，当然如果你熟练操作网络可以没有任何限制。

## 下载安装

:::tip
由于一些历史原因，wireshark已经是个免费软件，下载简单，功能强大，非常适合网络协议的学习和认识
:::

[wireshark](https://www.wireshark.org)支持windows、macOS、Linux几个版本，基本上常见的操作系统都可以支持的，直接打开官网[下载页面](https://www.wireshark.org/#download)，选择适合自己的操作系统，下载即可，下载完后一路点击确定安装就可。这里作者是macOS，就安装了mac版，如无特殊备注，以下都以mac版本为基础介绍，其他大同小异。

下载后打开大概长这个样子

![iShot_2022-10-22_15.44.16.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7e4163efwj31k413cths.jpg)

## 菜单栏
![iShot_2022-10-21_08.43.06.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7cm8lmc0jj315o02agnc.jpg)

菜单栏这里只讲下统计，它相对来说更加实用。统计内部有好多不同维度的分组，可以从不同维度去查看统计信息，如：流量、TCP流、UDP多播、HTTP等等。统计需要数据才可以统计出结果，可以先抓取少量的包，点击内部的流量图可以很清晰的看到网络通信

![iShot_2022-10-21_08.41.25.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7cm6x7c2fj31wc15gb29.jpg)

## 工具栏
当进来时会进入欢迎页面，可以选择指定的网络接口(本地、wifi)或直接点击左上角的鲨鱼图标开始抓包。

![iShot_2022-10-22_15.49.40.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7e46ruoeyj31k60nk1kx.jpg)

以上看到已经抓取了大量的网络数据包，下面开看看工具栏的作用

![iShot_2022-10-22_15.09.52.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7e3neadwzj31bu04mtal.jpg)

工具栏主要使用来控制抓包的，以上的图标按顺序依次是开始抓包、停止抓包、重新捕获、捕获选项(网卡、过滤器)、打开本地捕获文件、保存捕获文件、关闭捕获、重新加载捕获文件、搜索(过滤器)，基本上的图标控制按钮就这么简单，后面的都是对界面的一些控制，没什么说的，自己动手试试即可。

## 过滤器
当使用wireshark抓包时难免会有大量的抓包记录，而我们往往会针对某个网络包进行分析，而在这种大量数据下会严重影响到分析进度。为了避免其它数据造成的干扰，wireshark提供了过滤器来帮助过滤掉不必要的数据或只显示我们想要的数据。

过滤器分为<u>**捕获过滤器**</u>和<u>**显示过滤器**</u>，而捕获过滤器又可以对<u>网络接口</u>和<u>协议相关</u>的两个维度的过滤。显示过滤器主要是对抓取到的网络数据包进行过滤显示，其针对的显示方面的的过滤，而捕获过滤器则是从源头进行过滤。网络接口主要告诉wireshark要抓取哪个接口的网络数据包如：wifi、本地回环、以太网、虚拟网、蓝牙等等，协议方面的选项通常告诉其抓取什么协议、什么端口、ip等等，如：TCP协议、HTTP协议、广播、ip等等。

在进入wireshark时的欢迎页面就可以对进行不同的接口进行选择，双击接口就可以抓取了，不需要选择时，默认会抓取所有接口的数据，可以直接点击左上角的鲨鱼按钮开始抓取。

![iShot_2022-10-22_16.09.43.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7e4rn2cgqj31k413cdq0.jpg)

除了在欢迎页选择不同的网络接口外，也可以在抓包页面上方的类似设置的按钮中，也可以选择不同的接口和详细的抓包选项，如下图：

![iShot_2022-10-22_16.38.32.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7e5lo5e3vj31f00zak92.jpg)
更详细过滤一些选项
![iShot_2022-10-22_16.02.54.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7e56c27ssj31hu0wk4c0.jpg)

上面的过滤器我选择了<u>抓取本地接口和端口为9999</u>的数据包，这里我用`Nodejs`监听`9999`端口号开启了一个web服务，接着用curl请求这个地址：
```sh
➜ curl -I 192.168.3.2:9999 # 请求成功
HTTP/1.1 200 OK
X-Powered-By: Express
Set-Cookie: __ut=123456; Path=/
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-IdYGYravFqZ+6sBfe27/eQDuPDo"
Date: Sat, 22 Oct 2022 08:46:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

![iShot_2022-10-22_16.49.58.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7e5xien0lj31jq0kye3e.jpg)

现在看看当前的抓包情况，可以看到已经抓取到了，原地址和目标地址都是`192.168.3.2`本机局域网地址，还看到TCP协议、HTTP协议，如果现在只想分析HTTP协议的数据包呢，就可以用上显示过滤器了。设置它很简单，在记录上方的输入框即可过滤。如下图：显示`http`协议的请求。

![iShot_2022-10-22_16.57.26.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7e65qwx1fj31dq0awjxz.jpg)

以上还可以再细分，可以结合多个过滤选项使用`and`/`or`进行连接过滤，如http请求的携带了query
```
http and http and http.request.uri.query.parameter
```

这里过滤选项不需要记下来，点击输入框前面的小图标，可以列出不同的选项，点击后可以在输入框中添加`.`进行属性的进一步过滤。除了这个内置的显示过滤外，可以点击菜单栏的放大镜按钮，也会显示出过滤的输入框。这里相对来说有了更广的过滤条件，可以使用显示过滤、正则搜索、十六进制、字符串等等，点击搜索即可，搜索后并不会将不在范围的记录隐藏掉，而知识将目标高亮而已。

![iShot_2022-10-22_17.03.18.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7e6bdfsdzj31iy0a245k.jpg)

## ARP协议
通过前面的学习你应该对wireshark这款软件的抓包基本功能有了了解，现在就来使用它来抓取数据包分析吧，本文会分别介绍ARP协议、TCP协议等网络协议，让我们以ARP协议开始吧。

在抓包开始前首先要明白什么是[ARP协议](https://baike.baidu.com/item/ARP)，了解协议本身有助于我们抓取的准备和方向，这里简单的概述下。

ARP是地址解析协议，从协议层次角度是个网络层协议，功能角度是链路层协议，用来查询ip所对应的mac地址。在互联网通信中，主机与主机之间通信，都是通过OSI模型从上到下的协议将数据封装最终发送到目的主机，通常情况下我们常见的是对应主机的ip，然后就可以知道目标主机的位置了，但这只是表面上的，通信双方还需要知道双方的mac地址才能通信，没有mac地址就像快递只写了收件人姓名，却没有收件地址一样。

上层应用程序只关心ip地址而不关系mac地址，<u>mac地址需要通过ARP协议获取目标主机地址</u>，完成数据的封装。那么ARP协议是如何获取目标主机的mac地址的，假如这里有两台机器：p1的ip地址`192.168.3.1`，p2的ip地址`192.168.3.2`，当p1想和p2通信时，从OSI协议封装顺序发送方自顶向下封装数据，ARP从上层知道了p2的目标ip地址，然后封装ARP数据包，将自己的ip地址和mac地址和对方的ip和mac占位地址封装，然后通过以太网的<u>**广播**</u>形式发送出去，交换机、网关或路由器等设备接收到广播包后，会将数据发给同一局域网的其他主机，当不同的主机接受到广播包后，会判断自己是不是这个发送者寻找的ip，如果不是则会将包丢弃掉不做任何应答；而如果当前主机和目的ip一致的话，将会接受此包并将自己的mac地址封装进去，并以单播的形式回应发送主机方，发送主机方就会知道目标ip所对应的mac地址了；如果在局域网中没找到响应的主机，交换机等会继续向上发送数据包直到找到位置。

![iShot_2022-10-23_08.28.31.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7exa6rqjlj31qo0xcjvw.jpg)

上图简单的画了请求的过程：
1. 发送方ARP广播发送数据包请求到交换机
2. 交换机转发给局域网内的主机
3. 不是目标ip的主机丢弃掉数据包，目标ip主机接收数据包
4. 目标主机以单播的形式回应发送方

:::tip 小提示
在ARP请求广播过程中，途径的网关和其他接收到广播的主机虽然不是目标主机，但也会在自己的ARP缓存表中记住发送方的ip和mac地址，这是方便以后其他主机向目标主机通信。

当目标主机找到后，也会记住发送方的ip和mac地址，然后将自己的mac地址和ip地址封装数据后以单播的形式回应发送给发送方。
:::

接下来就用wireshark抓包看看实际的网络请求情况，这里一台机器的ip为`192.168.3.8`，现在让它请求网关`192.168.3.1`，这里使用linux的[nmap](https://www.kali.org/tools/amap)扫描工具扫描网关。

首先先打开wireshark监听抓包，这里直接抓取所有的接口，在显示过滤器中输入`ARP`协议来过滤显示ARP协议的数据包。
```sh
nmap 192.168.3.1 # 然后会找到以下信息
# Starting Nmap 7.70 ( https://nmap.org ) at 2022-10-22 22:02 CST
# Nmap scan report for 192.168.3.1
# Host is up (0.0070s latency).
# Not shown: 972 closed ports
# PORT      STATE    SERVICE
# 3/tcp     filtered compressnet
# 53/tcp    open     domain
# 80/tcp    open     http
# ....

arp -a # 查看ARP缓存表信息
# ➜ arp -a            
# _gateway (192.168.3.1) at dc:33:xx:xx:xx:07 [ether] on enp0s5  # 这里就是网关被找到了
# ? (192.168.3.2) at 38:f9:xx:xx:05:db [ether] on enp0s5
```
上面通过扫描工具扫描网关，再查看ARP缓存表中已经缓存了网关信息，接下来看看抓包情况：

![iShot_2022-10-22_22.05.39.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7exxpipkwj31k60c2agi.jpg)

ARP请求：
![iShot_2022-10-22_22.09.38.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7exyt2n3ej31js0i07dz.jpg)

ARP应答：
![iShot_2022-10-22_22.13.09.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7exz8j210j31k00jq13r.jpg)

从抓包数据可以看到，首先`Apple`(192.168.3.8)主机以广播的形式发送数据包，ARP请求数据包中有自己的Send MAC address、ip address还有目标主机的ip`192.168.3.1`和mac地址`00:00:00:00:00:00`(这里0表示坑位待目标填写)，携带信息`Who has 192.168.3.1? tell 192.168.3.8`。当`Huawei`(网关192.168.3.1)接受到`Apple`发送来的数据包后，将自己的mac地址封装仅需其他的保持不变，再以单播的形式发送ARP Reply数据包，携带信息`192.168.3.1 at xx:xx:xx:xxx`，这样在`Apple`接收到数据包后就知道了目标的Mac地址了，就可以进行数据发送了。

这里简单说下ARP数据包中一些字段：
- Hardware type：硬件类型(标识链路层协议)
- Protocol type：协议类型(标识网络层协议)
- Hardware size：硬件地址大小(标识mac地址长度)，这里是6字节，48bit
- Protocol size：协议地址大小(表示ip地址长度)，这里是4字节，32bit
- Opcode：操作码(表示ARP请求类型)，1表示请求，2表示应答
- Sender Mac address：发送者mac地址
- Sender IP address：发送者ip地址
- Target MAC address：目标mac地址
- Target IP address：目标ip地址

以上便是ARP协议的基本原理，通过[nmap](https://www.kali.org/tools/amap)扫描工具，再用wireshark进行抓包分析后应该已经对ARP协议不陌生了，基本就是<u>一问一答</u>简单形式。当然这里主要还是讲wireshark怎么抓取ARP数据包，来理解ARP的简单概念，至于ARP的更详细的概念可以看看其他文章，如果没有后面也会更新相关文章。

## TCP协议
TCP协议是基于字节流面向连接、可靠的、全双工的单播协议，在通信前必须建立连接，也就是常说的三次握手，然后会断开进行四次挥手。我们来先了解下TCP头部。
![g0ywreqte9.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7f8ebxzb4j30g905u40a.jpg)
- 源端口、目标端口：TCP里没有源IP和目的IP，这是IP层协议的事情，源IP、源端口、目标IP、目标端口构成了TCP`四元组`，一个四元组可以标识一个连接。
- 序列号：用于确认包的的顺序，序列号加上报文长度，用于确定传输的是哪一段数据。
- 确认号：TCP使用确认号来告知对方下一个期望接受的序列号
- 标志位：用来发起连接同步初始序列号，有些用来确认数据包，还有用来结束连接的
  - SYN：用于发起连接数据包同步初始序列号
  - ACK：确认数据，只有当ACK=1时有效
  - RST：强制断开连接
  - FIN：告知对方数据发送完毕，准备断开连接
  - PSH：告知对方数据包收到后马上交给应用层，不能缓存
- 窗口大小：用来控制对方发送的数据量

上面简单的介绍了TCP头部部分信息，TCP的连接由发送SYN开始，结束时通过FIN断开连接。下面我们就通过wireshark进行抓包分析。因为HTTP请求也是基于TCP协议的，这里以HTTP请求为例展开三次握手和四次挥手的细节。

这里开启一个node服务作为web服务器：
```js
const express = require("express")
const app = express()
const port = process.env.PORT || 9999

app.use(async (req, res, next) => {
  res.setHeader("connection", "close")
  res.json({
    url: req.url,
    ...req.headers,
    ...req.query
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
```

wireshark我们选择本地回环地址网卡接口，端口选择`9999`
![iShot_2022-10-23_15.32.54.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7f9dh3pluj31fm0p6476.jpg)

### 三次握手
这里使用`curl`发起服务请求
```sh
➜  curl http://localhost:9999
{"url":"/","host":"localhost:9999","user-agent":"curl/7.64.1","accept":"*/*"}%  
```

看下抓包情况：
![iShot_2022-10-23_15.45.40.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7f9ovwy7kj31k60dwdur.jpg)
从上图抓包记录可以将记录分为三部分：①TCP三次握手连接，②HTTP请求相关，③TCP四次挥手

下面这张图概况了三次握手的摘要
![iShot_2022-10-23_16.19.57.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7faoku3dyj31380lcdrx.jpg)
抓包记录：
![iShot_2022-10-23_15.48.12.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7f9rj9jobj30ss03qtb1.jpg)

1. 这里看出两端通信的端口为`54987`(终端)和`9999`(服务器)，终端发送`SYN`类型请求，指明客户端的初始化序号为0，这里的0位相对值，其真实性值为`3059428279`，并告诉下次的序列号为1，如下图：
![iShot_2022-10-23_15.52.26.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7f9zshnzlj311s0go102.jpg)

2. 服务端接收到客户端的SYN数据包后，发送自己的应答SYN包，并指定自己的序列号0(真实值3338838224)，并将`客户端的序列号+1发送ACK=1确认包(acknumber=3059428280)`，并告诉下次序列号为1，如下图：
![iShot_2022-10-23_16.01.16.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fa53pnh8j312a0jywnv.jpg)

3. 客户端接收到了服务端的SYN数据包和ACK包后，也将服务端的SYN+1(acknumber = 3338838225)作为ACK数据包发送给服务端，就完成了三次握手
![iShot_2022-10-23_16.11.54.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fagk4km2j31280kewn3.jpg)

至于ACK值不断加1是为了标识数据包保证接收方的顺序性，因为发送时数据可能乱序，在收到数据后，TCP不会直接把数据交给上层，而会做一个缓存，直到传输完毕将包按顺序组装在上交给应用层。

三次握手的简单理解：
第一次：客户端发送数据到服务端，服务端接收到后知道客户端的发送能力没问题
第二次：服务端发送数据到客户端，客户端接接收后知道服务端的接收能力正常，发送能力也没问题
第三次：客户端再发送数据到服务端，服务端接收后知道客户端的接收能力没问题

通过三次握手两端都知道了对方发送和接收没有问题，之后就可以正常通信了。

### 四次挥手
当客户端请求毕后就会断开连接，由于为了提高传输效率http使用`keep-alive`会在一定时间内保持TCP的连接，这里设置HTTP头部`connection=close`表示请求完毕后立即断开连接。

来看回收抓包记录：
![iShot_2022-10-23_16.36.34.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fb5u12owj30yg04on1o.jpg)

1. 在客户端请求完毕后会发送FIN报文给服务端，包含自己的序列号seq=79和ack=125来确认对方最近一次发送的数据，然后表示我没有其他请求了，这时客户端进入`FIN_WAIT1`状态
![iShot_2022-10-23_16.44.22.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fbdyp9zzj31200hyjyp.jpg)
2. 服务端接收到数据包后，发送包含自己的seq=125和ack=80的ACK报文给客户端，表示我知道了，并通知上层应用另一端发起了关闭操作，此时服务端并不会立马发起关闭操作，也就是发送服务端的FIN报文，此时服务端进入`CLOSE_WAIT`状态，客户端进入`FIN_WAIT2`状态
![iShot_2022-10-23_16.47.36.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fbhbhh94j31240hwn4s.jpg)
3. 等一会时间服务端再发送包含seq=125，ack=80的FIN报文和ACK报文并期待下一次的ACK序列号为126，表示可以断开连接了，服务端进入`LAST_ACK`状态
![iShot_2022-10-23_16.50.48.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fbkn6yf5j311g0g2wlf.jpg)
4. 客户端接收到后会在发送ack=126的ACK报文，最后断开连接，此时客户端进入`TIMED_WAIT`状态，服务端将会进入`CLOSED`状态，最后再等`2MSL`(Maximum Segment Lifetime)客户端也进入`CLOSED`状态
![iShot_2022-10-23_16.52.15.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fbm614fxj311k0gatem.jpg)

通过上面的分析已经对四次挥手有了更深理解了，下面再画个图总结下
![iShot_2022-10-23_17.17.26.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fccd75wkj31gi0qutn3.jpg)

以上就是TCP挥手的基本原理了。这里解释一下两个问题：
1. 为什么挥手要四次，而握手是3次？
   因为握手时服务端直接确认连接不需要等待，所以发送`SYN+ACK数据包`。而挥手时服务端接受到了客户端的`FIN`包后，知道客户端没有请求了但还可以继续接受数据包，服务端也并不能立马关闭连接，因为服务端此时可能数据并没有发送完毕，需要等待发送完毕后才会主动发送`FIN`包请求断开。
2. 为什么客户端挥手后发送了`ACK`包还要等`2MSL`段时间才会进入`CLOSED`状态？
   这是因为当客户端发送了`ACK`报文后，有可能有丢失的包的可能，这导致服务端还没有收到客户端的`ACK`报文，会认为自己发的`FIN`报文可能客户端没有收到，于是会再发一个给客户端，客户端会再发送`ACK`报文，重新计时`2MSL`，等服务端接收到`ACK`报文后，则不会再发送`FIN`报文，`2MSL`时间段后客户端正式进入`CLOSED`状态。

### HTTP协议
由于HTTP协议是基于TCP协议的，所以上面我们用`curl`发起的是HTTP请求，那我们看下http请求过程。
![iShot_2022-10-23_17.35.00.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fcums2gkj30vq04edig.jpg)
- 首先客户端发送GET请求给服务端
- 服务端发送TCP的ACK的数据包确认已经收到请求了
- 服务端发送http响应，状态码200
- 客户端接收到后，发送TCP的ACK数据包表示已经接收到了数据

我们通过跟踪HTTP数据流看下细节：
![iShot_2022-10-23_17.37.10.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h7fcww5re2j311m0f2afi.jpg)

到这里已经了解了如何用wireshark分析ARP协议、TCP协议和HTTP协议了，当然这只是简单的讲解，其他协议都大同小异，更多功能自己可以动手试试。

## 统计
统计可以对网络数据进行不同维度的统计，如：HTTP、TCP、UDP、DNS等相关的统计，这些统计比较简单，自己动手试试就会明白。

## 小结
本篇介绍了wireshark的基本使用，并通过对ARP协议、TCP协议和HTTP协议的分析，已经掌握了分析数据包的基本能力，并加强了相关协议的理解，其他相关的协议都大同小异。到本篇已经讲了3款抓包软件了，相信大家对抓包已经不陌生了，希望通过这些抓包工具可以提高你的分析能力和对原理的认识。

<Reward />
<Gitalk />