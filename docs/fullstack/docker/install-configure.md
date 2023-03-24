---
title: Docker安装与配置
description: docker基础入门从安装到配置
head:
  - - meta
    - name: keywords
      content: docker基础学习,docker安装配置,docker优缺点,centos安装docker
  - - meta
    - property: og:description
      content: docker基础入门从安装到配置
  - - meta
    - property: og:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
  - - meta
    - name: twitter:description
      content: docker基础入门从安装到配置
  - - meta
    - name: twitter:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
---

# Docker安装与配置

为什么出现Docker？传统的开发和部署存在着许多环境和配置的不兼容的问题，docker就是将环境和代码统一打包的来解决这些兼容问题。Docker是一个统一了运行环境和配置问题的虚拟容器技术，是一个内核级虚拟技术。使用镜像，保证了处处环境的一致性。

我们知道，如果将计算机的层次做一下简单的划分，最底层是硬件，最上层是软件，中间是操作系统。（这是一种极为笼统且不严谨不专业的划分，我只记到这里了……）我们非常熟悉的虚拟机，就是一个物理硬件层抽象，运行在硬件之上：它向下面对一套硬件和硬件接口，对其进行虚拟，然后向上提供一套独立的操作系统，然后就可以在操作系统之上再运行各种软件应用等（如下图右，可以无视那个“管理程序”层因为我也不知道是啥）。这就使得虚拟机这个东西非常庞大沉重（因为包含了一整套操作系统，一般都好几G，还可能有一套单独的存储空间），启动时间长（一般几分钟，有SSD不算），且不容易移植（因为我们知道，在安装操作系统的时候，会根据硬件的不同编译出不同的内核，而每台电脑的硬件配置几乎不会完全一样，因而直接把一台电脑的操作系统文件考到另一台一般是没法启动的）。而容器是一个应用层抽象，运行在操作系统之上的，确切地说是操作系统内核之上（如下图左），面对的是操作系统提供的接口，属于进程级别；容器对我们的代码和依赖进行打包，比如一个docker中只有一个python3，还有TensorFlow以及其他的package（经常会在一个docker中发现连“sudo”命令都没有）；这样体积就很小，启动快（几秒几毫秒），且容易移植（不同硬件上的同一操作系统向上提供相同的接口）。

可以将容器镜像看作是mini版的虚拟机，但两者并不相通，先来看看二者优缺点。

## 优缺点
传统的虚拟技术要在一个机器上安装虚拟机、各种软件，再部署应用，存在一系列的缺点：
- 需要虚拟出一套完整的硬件后，运行一个完整的操作系统，在系统上运行所需的应用程序
- 启动慢
- 资源占用多
- 冗余步骤多
- 迁移困难

而Docker使用容器化技术完美的解决了这些问题，其具备：
- 直接运行与宿主机的内核
- 容器内没有自己内核，没有进行硬件虚拟，更轻量
- 容器相互隔离，互不影响
- 更快交付、部署
- 便捷升级和扩容
- 统一标准、更简单的运维
- 节约成本

有了容器化技术对于应用的部署更加方便，也更好维护，这也促使云原生的发展。

## Docker三大组件
- 镜像（Image）：一个root文件系统的模板，相当于 一个类
- 容器（Container）：docker run 镜像就是容器（最小的linux内核文件和运行的应用程序），镜像和容器的关系，就像是面向对象程序设计中的 `类` 和 `实例`一样，镜像是静态的定义，容器是镜像运行时的实体
- 仓库（Repositry）：保存镜像的仓库，每个仓库可以包含多个Tag，对应不同的镜像

## 架构图
![iShot_2022-09-04_18.05.31](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/iShot_2022-09-04_18.05.31.png)

docker所安装的镜像在本地都是一个个文件，可以通过`docker info`查看存储位置

## 安装
本文基于ARM架构Centos7虚拟机安装的，如果你的环境和我不一致，可以参考[官方文档](https://docs.docker.com/engine/install/)或其他资料

1. 卸载掉机器上可能存在的docker相关依赖，如果你没有安装过，可以忽略此步骤
```sh
sudo yum remove docker \
  docker-client \
  docker-client-latest \
  docker-common \
  docker-latest \
  docker-latest-logrotate \
  docker-logrotate \
  docker-engine
```

2. 配置docker仓库地址
```sh
sudo yum install -y yum-utils

# 设置ali仓库加速地址
sudo yum-config-manager \
    --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

3. 下载docker
这里你可以根据自己的需求安装指定版本的docker，不指定版本默认latest最新版本
```sh
# 查看可安装的版本
yum list docker-ce --showduplicates | sort -r

# 这里安装最新版
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

4. 启动docker并配置开机自启
```sh
systemctl enable docker --now
```

5. 查看docker状态
```sh
# 查看运行状态
systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
   Active: active (running) since 四 2023-03-23 22:22:10 CST; 7h left
     Docs: https://docs.docker.com
 Main PID: 1406 (dockerd)
    Tasks: 9
   Memory: 100.0M
   CGroup: /system.slice/docker.service
           └─1406 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock

# 查看版本
docker version
Client: Docker Engine - Community
 Version:           23.0.1
 API version:       1.42
 Go version:        go1.19.5
 Git commit:        a5ee5b1
 Built:             Thu Feb  9 19:49:05 2023
 OS/Arch:           linux/arm64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          23.0.1
  API version:      1.42 (minimum version 1.12)
  Go version:       go1.19.5
  Git commit:       bc3805a
  Built:            Thu Feb  9 19:47:21 2023
  OS/Arch:          linux/arm64
  Experimental:     false
 containerd:
  Version:          1.6.18
  GitCommit:        2456e983eb9e37e47538f59ea18f2043c9a73640
 runc:
  Version:          1.1.4
  GitCommit:        v1.1.4-0-g5fd4c4d
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

6. 运行`hello-world`镜像
```sh
docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
93288797bd35: Pull complete
Digest: sha256:2498fce14358aa50ead0cc6c19990fc6ff866ce72aeb5546e1d59caac3d0d60f
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```
以上运行`hello-world`镜像时需要先从远程仓库下载镜像到本地，然后才可以运行，由于docker的官方仓库在国外，对于国内用户访问比较慢，因此需要配置一些国内镜像加速地址，才会加快下载速度

## 配置
配置`vim /etc/docker/daemon.json`没有此文件的可以自行创建json文件
```json
{
  "registry-mirrors": [
  	// aliyun
    "https://xxxxxx.mirror.aliyuncs.com",
    // 网易
    "https://hub-mirror.c.163.com",
    // 腾讯
    "https://mirror.ccs.tencentyun.com",
    // 国内docker
    "https://registry.docker-cn.com",
    // 科大
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

重启服务：
```sh
systemctl daemon-reload
systemctl restart docker
```


<Reward />
<Gitalk />







