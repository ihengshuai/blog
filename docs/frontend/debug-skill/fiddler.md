---
title: Fiddler抓包使用技巧
description: fiddler抓包工具的使用,fiddler调试web应用程序和移动端的利器
head:
  - - meta
    - name: keywords
      content: fiddler,fiddler抓包工具,手机抓包,ios抓包,android抓包,抓包工具,前端调试,frontend debugger,chrome调试,调试技能,node调试,线上调试
---

# Fiddler抓包
[Fiddler](https://www.telerik.com/fiddler) 是位于客户端和服务器端的HTTP代理，是一个强大的抓包工具；可以作为系统的代理也可以代理具体的进程(如：chrome、firefox)，针对代理对象fiddler会记录其所有的会话记录，分析请求数据、调试请求、刷新请求、设置断点、模拟或覆盖服务器返回的数据，还可以调试https请求，总之功能强大，是web调试的利器

:::tip
fiddler有[fiddler everywhere](https://www.telerik.com/download/fiddler-everywhere)、[fiddler classic](https://www.telerik.com/download/fiddler)等其他版本，其中fiddler everywhere功能最为强大同时支持多个系统，但是需要收费，当然你可以上网搜索破解版，这里就不赘述了：
本人在工作中使用[fiddler classic](https://www.telerik.com/download/fiddler)版本，其功能也不逊色够开发和测试用了，推荐使用（不支持mac）。
:::

>注: 本文以fiddler classic版本进行介绍，以下fiddler文案全部代表的是fiddler classic

## 面板介绍
![QQ截图20221010191428.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70eoatasoj31440ncqdb.jpg)
当你下载安装完fiddler双击打开后，大概如上图这样；fiddler由不同的面板模块组成，主要包括：

- 菜单栏
- 工具栏
- 代理监控面板
- execquick、状态栏
- 详情面板

接下来会对不同的面板进行介绍，再做一些详情案列说明

## 菜单栏

菜单栏对fiddler一般做一些全局的配置或功能，如：导入导出记录、保存、配置https、视图修改等等

![menubar.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72crpxwf1j30ee01saae.jpg)

1. <u>**File**</u>：选项主要是加载最近、导入或保存存档，导入导出捕获记录，开关fiddler捕获抓包等功能；对于需要将测试抓包的一些数据分享给别人排查场景，导入导出功能便会发挥友好作用
2. <u>**Edit**</u>：主要用来编辑抓包监控记录，如复制、粘贴、选择、查找等等，比较简单
3. <u>**Rules**</u>`：相对于前两者作用比较实用，可以自定义规则过滤对应的抓包记录，也可以限制不同的网速模拟网络环境，请求响应打断点，压缩等等
4. <u>**Tools**</u>：里面的`options`功能最重要，可以管理代理、配置https、远程代理等等，除了`options`，还可以进行解码编码，清理缓存等功能
5. <u>**View**</u>：用来控制面板显示
6. <u>**help**</u>：帮助信息，不用太关心

## 工具栏

工具栏基本是对抓包做一些具体配置和操作，如断点、目标、查找、重放等功能，下面对常用的做简单介绍(简单的就不赘述了)
![QQ截图20221012120535.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72diodhl0j314b01jmzd.jpg)

1. **WinConfig**：针对windows做的一些配置
2. **replay**：重放功能，重新发起请求
3. **:x:**：根据不同的选项删除抓包记录，Ctrl+x全部删除(最常用)
4. **go**：当断点卡主时，点击执行下一步
5. **Decode**：会对所有的请求进行解码操作
6. **Keep: All Session**：用来显示抓包记录条数的
7. **Any Process**：抓取指定进程的数据，点击不放手拖动到指定的应用程序，fiddler会自动识别到应用程序进程
8. **TextWizard**：用来解码和编码
9. **Online**：可以查看当前主机的ip、mac地址等等

## 代理监控面板

该面板主要来记录抓包的数据记录，可以大概看出每个记录的简单信息如：协议、状态码、请求来源、Host、URL等等，聚焦到此面板Ctrl+x会清除全部的记录，双击某条记录可以在右侧面板查看详细信息

## execquick和状态栏

这两块位于fiddler面板底部和左下角

### execquick

execquick是个快速执行命令的工具，如：查询、断点等等，可以查看[官方文档](https://docs.telerik.com/fiddler/knowledge-base/quickexec)，你也可以输入`help`回车就会打开文档，下面列举一些常用的：

```sh
# 搜索
?xxx #?baidu，则会查出url中包含baidu的记录

# bpu 创建请求断点
bpu xxx  #当请求url地址中包含xxx时命中断点
bpu  #不带参数时会取消断点

# bpafter 创建响应断点
bpafter xxx #请求地址中包含xxx时，响应会命中断点
bpafter #不带参数取消断点

# cls 清除记录
cls

# =status 搜索目标状态码
=status  #=301

# =method 搜索请求方式
=method #=POST
```

### 状态栏

状态栏可以看一些简单信息如：是否正在抓包，断点信息，抓包范围等等
1. 左下角第一个点击切换可以快速开关抓包，当抓包是会显示`Capturing`
2. 第二个会显示抓包范围，可以点击选择指定范围
3. 第三个小块点击可以快速打断点，单击请求断点，点两次响应断点，点三次取消断点
4. 后面会显示一些quickexec操作的信息

## 详情面板

![QQ截图20221012163749.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72ldz8drnj316y060aeo.jpg)

1. **FiddlerScript**：用来修改脚本，fiddler是由C#写的所以要懂一些C#知识，其实和JS差不多
2. **Filters(重要)**：用来配置相应规则来抓包，相对来说更加自由一些，使用时需要把`use filters`打开
  ![QQ截图20221012164715.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72loco6gtj30l70jl453.jpg)
  如上图，可以从多个维度去配置规则去抓包
    - host: 主机
      - 可以选择本地或互联网抓包
      - 可以选择对应的host
    - client progress: 选择不同的进程来抓包
    - requset header:
      - 显示请求地址包含xxx的请求
      - 隐藏相关地址
      - 设置请求头
      - 删除请求头等等
    - 断点：
      - 不同请求方式断点
      - 指定header头断点等等
    - 响应状态码：根据不同状态码显示记录
    - 响应类型、传输大小等等

    当选择好对应的配置后，要勾选`Use Filters`选项，点击面板右上角`Actions`的`Run filterset now`

3. **Inspectors**：当点击具体的抓包信息后，点击`Inspectors`可以查看请求的具体信息
  ![QQ截图20221012184349.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72p0y94rvj30lb0kugvj.jpg)

    主要分为请求报文和响应报文，可以按照不同的格式去查看内容，当打了断点时，还可以修改请求内容
4. **AutoResponder**：自动响应请求内容，可以添加多个规则针对不同的请求做不同的响应
  ![QQ截图20221012184905.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72p6hwsf4j30l308an0q.jpg)
    如上图，在请求`http://localhost:10000`时，返回本地图片，达到篡改目的

    除了返回本地资源文件外，还可以模拟其他操作，如：返回不同状态码、重定向、请求代理等等
    ![QQ截图20221012185428.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72pdecqsdj30l00i7q96.jpg)
    

    >注：需要勾选`Enble Rules`才会工作，如果不影响其他的请求，需勾选`Unmatched request passthrough`选项，不然其他的也会被阻塞；当不用的时候记得关掉面板规则，防止影响其他操作

5. **Composer**：用fiddler发送请求，可以自定义请求，修改请求内容，点击`Execute`发送请求；也可以将左侧的抓包记录鼠标按住拖到当前面板
  ![QQ截图20221012190550.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72pnu76xyj30l40azdn1.jpg)
    如上图，在请求头部添加自定义的字段`name:小明`，点击右上角执行，请求便会发送出去，执行结果如下图：会看到请求头中会携带刚刚添加的字段
  ![QQ截图20221012190740.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72ppqcuw9j30l30j2gug.jpg)

### 面板小结

以上便是fiddler各个模块的介绍，相信你已经对fiddler已经有了基本认识，当然还有一些功能需要自己去查看；工具毕竟是工具比较简单，如果你想要很短时间内熟悉它的使用，可以自己动手尝试，很快就会玩转它

接下来来介绍远程抓包，常见的就是app抓包，手机端抓包等等

## 客户端抓包
:::tip
远程调试需要将远程应用和fiddler保持在局域网下
:::

这里以IPhone为例，其他大同小异
1. 首先在菜单栏中一次点击`Tools > Options`弹出options面板，选择`Connections`Tab，可以看到fiddler监听的端口为`8088`(不同版本可能不同)，你也可以修改它；下面有一个选项为`Allow remote computers to connect`勾选上☑️，允许远程连接；右侧有一个`Act as system proxy`让fiddler作为系统代理(默认)，点击保存后最好重启下fiddler，如果后续配置后正常话不重启也行，如下图：
 ![QQ截图20221012191525.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72pyn1uyzj30fp0c779p.jpg)

2. 为了不让其他本地请求影响到我们分析抓包，这里把抓包改为只抓远程的包。打开`rules > custom rules`，搜索`static function OnBeforeRequest`，将以下代码粘贴进去，保存配置后最好重启一下
  ```c#
  static function OnBeforeRequest(oSession: Session) {
    // 抓取远程的
                if (!String.IsNullOrEmpty(oSession["x-ProcessInfo"])) { 
                        oSession["ui-hide"] = "localprocess"; 
                }
  }
  ```

3. 远程连接fiddler所在的计算机，这里以IPhone为例；首先查询计算机ip，可以通过fiddler右上角计算机图标提示，也可以在终端输入`ipconfig`查询或其他方法，如下图：
 ![QQ截图20221012191720.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72q0phv0oj30c9070dhm.jpg)

  ![QQ截图20221012191812.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72q0w6n1sj30ie06rjs6.jpg)
 手机在同一局域网下，配置wifi代理，找到和电脑连接相同的wifi，点击wifi，配置代理选择手动，输入刚刚查询的ip和fiddler监听的端口，点击保存
 ![IMG_0556.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72u78gr62j30n00qt3zr.jpg)

  打开Safari输入网址`http://192.168.11.224:10000`回车后，查看fiddler抓包记录

   ![1525E81FFFF883D1CAE399097D7DDF52.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73pfw5tn6j30n00cdjrj.jpg)

  ![QQ截图20221013154539.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73pi66t4kj30z30900xz.jpg)

  重新输入输入`https://blog.usword.cn`
  ![C8A68661E2.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73pm8kyoaj30n00gxdge.jpg)

  再看看抓包记录，会发现啥记录都没有

  ![QQ截图20221013155018.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73pmrzkj4j30h808375m.jpg)

  `https://blog.usword.cn`是https协议地址，fiddler默认不会抓取https的，需要手动打开配置选项，而且需要安装fiddler证书为根证书，接下来一起配置https

## 配置HTTPS

![QQ截图20221013164038.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73r35d3enj30sf0cywff.jpg)

首先打开`Tools > Options > HTTPS`，将下图中的选项全部勾选，为方便测试`Descript HTTPS traffic`选择`from remote clients only`，如下图：

![QQ截图20221013155947.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73pwn5dmzj30g90c1gpu.jpg)

在Safari中访问远程fiddler地址`192.168.11.224:8088`，点击允许下载证书
![5DD9EE10FD.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73q8hmbq5j30n00megne.jpg)

![B4D670F449.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73q9nfd59j30n00urtan.jpg)

打开手机设置，找到描述文件，点击信任安装证书iphone要输入手机密码(不同手机型号操作有差异)，最后会看到已验证

![FB1F83102D9AF2773325155581A75FE7.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73qacxc4xj30n00madgh.jpg)

![A7D37E643BF4136954A5AABF8F78C20E.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73qao8qylj30n00piwfe.jpg)

![2F6F6322E2EC59919FD479FAA5D5E20D.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73qatqbquj30n00lgaaq.jpg)

现在打开Safari重新访问`https://blog.usword.cn`查看抓包记录，会发现已经抓到了

![20221013161635.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h73qe4pb57j30gs066adb.jpg)

当打开抖音App发现抓取不到信息，这是因为现在有的app已经有了反抓包手段

至此，关于fiddler的常用的抓包功能已经介绍的差不多了，到这里你应该对fiddler有一定的认识了，自己一定要动手实践一遍玩一玩才不会忘记

## 总结
fiddler是个很强大的抓包工具，主要原理是作为中间代理，代理客户端和服务器之间的通信，这样请求对于fiddler就是透明的；至于https，fiddler不但扮演了客户端和服务器进行TLS加密通信，还扮演了服务器和客户端进行TLS加密通信，之所以服务器信任fiddler，是因为fiddler证书已经被系统根证书信任了，所以可以进行通信，接下来来介绍[charles](/frontend/debug-skill/charles.html)的使用。

<Reward />
<Gitalk />