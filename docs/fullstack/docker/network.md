---
title: Docker网络原理
description: 你知道docker几种网络模式背后的原理吗
keywords: docker网络原理,docker网络桥接,docker网络主机模式,docker网络三种模式
logo: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
---

# Docker网络原理
docker中网络的概念也是非常重要，它对于容器资源的隔离也起着非常重要的作用。

你有没有在启动一个容器后查看它的ip，假如你启动了一个`nignx`容器，你想在主机上访问它，首先得知道他的ip地址，可以通过以下方式获取：
```sh
docker inspect nginx |grep -A 20  Networks
# ...
"Networks": {
    "bridge": {
        # .....
        "Gateway": "172.17.0.1",
        "IPAddress": "172.17.0.2",
        "IPPrefixLen": 16
    }
}
```
可以查看`nginx`容器的网关为`172.17.0.1`，ip地址为`172.17.0.2`，在虚拟机上访问nginx`curl 172.17.0.2`发现是可以访问到nginx页面，但是当你从电脑主机浏览器上访问此ip地址就会访问不通

## 原理
Docker 网络的核心原理是通过创建网络命名空间和虚拟网络设备来实现容器间的网络隔离和通信。每个 Docker 容器都有自己的网络命名空间，其中包含了一个虚拟网络设备和一个 IP 地址。容器的网络命名空间使得容器内部的网络设备和 IP 地址与宿主机和其他容器隔离，从而实现了容器间的网络隔离和通信。

通俗的讲docker会在宿主机上创建一个默认的docker网桥(docker0`172.17.0.1`)，启动容器时会根据docker网桥的网络随机分配一个虚拟ip，同时docker网桥作为每个容器的默认网关，这样虽然每个容器的ip不一致，但是都是处于同一个网关下，所以容器间都可以通过docker0网关进行访问。

因为docker0网关是在主机上虚拟出来的，只能内部进行访问，外部是无感的无法访问到的。通过`ip a` 或 `ifconfig` 查看主机上的docker0虚拟网卡：
```sh
ip a | grep -A 5 docker0
4: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
```
从中看出docker0分配的网络为`172.17.0.1/16`，其前16位是个网络地址，后16位是主机地址，在这个子网中，可以分配的有效 IP 地址范围是从 `172.17.0.1` 到 `172.17.255.254`，共有 `65534` 个可用的 IP 地址。其中，`172.17.0.0` 是子网的网络地址，`172.17.255.255` 是子网的广播地址，不能被分配给主机。

## 访问过程
Docker 容器启动时，Docker 引擎会自动<u>创建一对 veth 设备，一个设备被添加到容器的网络命名空间，另一个设备则被添加到宿主机的网络命名空间中</u>。在容器内部，这个 veth 设备通常被命名为 `eth0`，并被分配一个 IP 地址；而在宿主机上，这个 veth 设备通常被命名为 docker0，并被分配一个与容器在同一子网中的 IP 地址。

**当容器需要与宿主机或其他容器进行通信时，数据包将通过容器内部的 veth 设备发送到宿主机的虚拟网桥，然后再通过宿主机的 veth 设备转发到目标容器或宿主机的网络命名空间中。**

![image-20230326174156350](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230326174156350.png)

## 网络类型
Docker 提供了多种网络类型和网络驱动，以满足不同场景下的网络需求。以下是 Docker 支持的主要网络类型：

- `bridge`：bridge 网络是 Docker 默认的网络类型，它使用 Linux 的虚拟网桥docker0实现容器间或与宿主机之间的通信。在 bridge 网络中，每个容器都会分配一个唯一的 IP 地址，并通过一个虚拟网桥连接到宿主机的网络中
- `host`：host 网络是一种特殊的网络类型，它允许 Docker 容器直接使用宿主机的网络设备和 IP 地址，与宿主机共享网络栈。在 host 网络中，容器不会被分配独立的 IP 地址，而是直接使用宿主机的 IP 地址
- `none`：none网络是一种完全隔离的网络类型，它不为容器分配任何网络资源，容器内部无法访问外部网络，也无法被外部网络访问
- `container`：新建的容器不会创建自己的网卡而是共同使用指定容器的，除了网络外，其他如文件系统等等都是隔离的，关闭目标container，将会变为none
- `自定义网络`：前者在容器内只能通过ip进行通信，不能通过容器名进行通信，而ip又是动态的，可能会随时变化，而docker允许你使用自定义网络，新建的网络默认是桥接bridge，集群里同一个服务里的所有容器使用自定义网络时，可以通过容器名进行访问，这种方式常用

除了上述网络类型外，Docker 还支持使用第三方网络驱动来实现自定义的网络类型和网络功能。例如，可以使用 Calico 网络驱动实现高级的网络功能，如策略路由、安全组、网络隔离等。

## 网络列表
在没有创建自定义网络的条件下，docker默认会存在三种网络：桥接(brige)、宿主机(host)、none
```sh
➜ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
3d9d929e9d34   bridge    bridge    local
73acd36f196e   host      host      local
f71a4582a6c0   none      null      local
```

## 创建网络
创建自定义网络`mynetwork`：
```sh
➜ docker network create mynetwork
c1f9f873cb89c803a905f3a8c61aed4bc8ab3f9184d00fa0327a9a6dfc6d70b7
➜ docker network ls
NETWORK ID     NAME        DRIVER    SCOPE
3d9d929e9d34   bridge      bridge    local
73acd36f196e   host        host      local
c1f9f873cb89   mynetwork   bridge    local
f71a4582a6c0   none        null      local
```

## 使用网络
在创建和管理容器时，可以指定容器使用的网络类型和网络配置，这里演示多个容器使用同一个网络，并采用容器名的方式方式进行访问
1. 创建一个busybox并使用自定义网络，查看其ip为`172.18.0.2`
```sh
➜ docker run -it --network mynetwork --rm --name busybox busybox /bin/sh
/ # ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
22: eth0@if23: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue
    link/ether 02:42:ac:12:00:02 brd ff:ff:ff:ff:ff:ff
    inet 172.18.0.2/16 brd 172.18.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```
2. 创建一个alpine使用自定义网络，查看其ip为`172.18.0.3`
```sh
➜ docker run -it --network mynetwork --rm --name alpine alpine /bin/sh
/ # ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
24: eth0@if25: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP
    link/ether 02:42:ac:12:00:03 brd ff:ff:ff:ff:ff:ff
    inet 172.18.0.3/16 brd 172.18.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

两个容器创建好后，尝试分别使用ip和容器名的方式ping对方，看是否能ping通：

- 使用ip方式：
  ```sh
  # busybox
  / # ping 172.18.0.3
  PING 172.18.0.3 (172.18.0.3): 56 data bytes
  64 bytes from 172.18.0.3: seq=0 ttl=64 time=1.588 ms
  64 bytes from 172.18.0.3: seq=1 ttl=64 time=0.475 ms
  
  # alpine
  / # ping 172.18.0.2
  PING 172.18.0.2 (172.18.0.2): 56 data bytes
  64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.163 ms
  64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.410 ms
  ```
- 使用容器名：
  ```sh
  # busybox 
  / # ping alpine
  PING alpine (172.18.0.3): 56 data bytes
  64 bytes from 172.18.0.3: seq=0 ttl=64 time=0.246 ms

  # alpine 
  / # ping busybox
  PING busybox (172.18.0.2): 56 data bytes
  64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.246 ms
  ```

采用服务名的方式在集群系统里是常见的，他解决ip动态改变，而不需要频繁改ip地址的问题，其内部本质还是将名字和ip进行的动态绑定，添加了对应的DNS记录，这样就可以知道服务的ip了

## 总结
Docker一个重要概念是容器间的DNS服务。Docker默认提供了一个DNS服务，使得容器可以通过容器名称或服务名称来互相访问。Docker DNS 服务基于 Docker 内置的 DNS 服务器实现，每个容器都可以通过 docker.internal 域名来访问其他容器。

总的来说，Docker 网络的核心原理是通过创建网络命名空间和虚拟网络设备来实现容器间的网络隔离和通信，同时提供了多种网络模式和网络驱动，以满足不同场景下的网络需求。


<Reward />
<Gitalk />
