---
title: Docker数据卷与持久化
description: docker数据卷挂载使用与数据持久化原理
keywords: docker数据卷,docker volume,docker持久化
logo: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
---

# Docker数据卷与持久化

本篇来讲docker数据卷(volume)的使用，那为什么要使用数据卷呢？通过前面文章的学习，大家都了解了如何去运行一个容器。假如你在本地测试运行一个`mysql`的容器，为你的本地应用程序做持久化服务，但当你删除这个容器后重新启动一模一样的容器，再次查看会发现数据都不见了，当然了你可能不会自己删除，但如果是团队使用呢，那就会有数据丢失的风险。因此docker中引入了数据卷的概念，用来做数据持久化的。

## 概念与作用
Docker 数据卷是 Docker 容器持久化存储的重要组成部分。它允许用户将容器中的数据与容器实例分离，使数据持久化，方便数据的管理和迁移。Docker 数据卷（Docker Volumes）是一种特殊的目录，可以在容器之间共享和重用。数据卷可以在容器之间传递数据，而不需要使用联合文件系统。数据卷在 Docker 主机上独立于容器生命周期而存在，即使容器被删除，数据卷也不会受到影响。这使得数据卷成为容器中数据持久化的理想选择。

使用Docker 数据卷相比使用容器储存来讲的好处有：
- 持久化存储数据：Docker 容器中的数据是存储在容器存储层中的，容器被删除或重建时数据也会被删除。使用数据卷可以将数据存储在宿主机上，即使容器被删除或重建，数据仍然可以保留。
- 方便数据共享：多个容器可以通过挂载同一个数据卷来共享数据，方便了数据的共享和备份。
- 更好的移植性：使用数据卷可以将容器与数据分离，使得容器更易于移植和部署。
- 更好的性能：使用数据卷可以将容器中的数据存储在宿主机上，可以减少容器存储层的使用，提高容器的性能。

:::tip
容器使用卷的本质其实就是文件或路径的挂载，类似与linux或[dfs](https://zh.wikipedia.org/zh-cn/%E5%88%86%E6%95%A3%E5%BC%8F%E6%AA%94%E6%A1%88%E7%B3%BB%E7%B5%B1)这种文件系统的挂载。
:::

## 卷的类型
Docker 数据卷（volume）可以分为三种类型：主机挂载（host-mounted）、命名卷（named volume）和临时卷（tmpfs volume）。

1. 主机挂载
主机挂载是最基本的数据卷类型，它将宿主机上的目录或文件夹直接挂载到容器中。主机挂载的优点是简单易用，但缺点是不够灵活，容器与宿主机的路径绑定较为紧密。

2. 命名卷
命名卷是 Docker 引擎管理的卷，可以在多个容器之间共享和重用。命名卷的优点是灵活性大，容器与宿主机的路径解耦，可以在多个容器之间共享数据卷，但缺点是需要手动创建和管理。

3. 临时卷
临时卷是一种轻量级的数据卷类型，仅存在于容器的生命周期中。临时卷的优点是方便快捷，不需要手动创建和管理，但缺点是数据不会持久化，容器停止后数据会丢失。

## 卷的使用
docker卷也是其一种对象资源，和其他如镜像、容器资源类似都有创建、查看、删除等相关的命令

### 创建
卷的创建指的是命名卷的创建，`docker volume create` 是 Docker 命令行工具提供的创建数据卷的命令。它用于创建一个新的 Docker 数据卷（Docker volume），以便将宿主机上的目录或文件夹挂载到 Docker 容器中。
```sh
docker volume create name
```
> 使用docker创建的volume，其文件路径会被存放到`/var/lib/docker/volumes`文件路径下

### 查看
查看已经创建的数据卷，这里只能查看使用docker创建管理的卷，如果直接使用宿主机的文件或路径，没有经过docker管理，就不会包含在卷的列表中
```sh
docker volume ls

➜ docker volume ls
DRIVER    VOLUME NAME
local     1e1b4617ad8377a9b60029362215f35cc298c2d8d1c7fa5d1691d164795872c9
local     5cda6686c50d24138ea5285d035afb639e275b6cac3f0671dd8b3cf895eb3c3a
local     5e58646a0a1d133084a671b03b4878b730cba730818e062edbecc539a6e6a80a
```

### 删除
删除卷会删除宿主机`/var/lib/docker/volumes`路径下指定的文件夹
```sh
docker volume rm name

# 删除名为 demo 卷
docker volume rm demo
```

### 挂载
在运行 Docker 容器时使用 `-v` 或 `--mount` 参数来指定数据卷的挂载方式
```sh
# 使用数据卷
docker run -v someVolume:/path/on/container

# 使用宿主机路径
docker run -v /path/on/host:/path/on/container myimage
```
可以使用`--mount`参数时指定数据卷的类型、权限等等
```sh
# 使用宿主机路径
docker run --mount type=bind,source=/host/somedir,target=/path/on/container

# 使用命名卷，并添加 rw 读写权限，不写默认是读写
docker run --mount type=volume,source=myvolume:rw

# 使用临时卷
docker run --mount type=tmpfs,destination=/path/on/containter:rw
```

## 总结
本篇讲了docker数据卷的使用，它是一种持久化存储数据的机制，可以将容器内的数据持久化到宿主机上，或者在多个容器之间共享数据。使用 Docker 数据卷可以实现高效的数据管理和迁移，同时也可以提高容器的可移植性和灵活性。



<Reward />
<Gitalk />
