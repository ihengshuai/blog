---
title: Docker基础教程
description: docker从入门到精通的完整教程
head:
  - - meta
    - name: keywords
      content: docker命令,docker镜像,docker仓库,docker构建镜像,docker文件传输
  - - meta
    - property: og:description
      content: docker从入门到精通的完整教程
  - - meta
    - property: og:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
  - - meta
    - name: twitter:description
      content: docker从入门到精通的完整教程
  - - meta
    - name: twitter:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
---

# Docker基础教程

本文主要从docker的基础开始学习，包括基本命令、镜像、仓库、容器

## Docker三大组件
- 镜像（Image）：一个root文件系统的模板，相当于 一个类
- 容器（Container）：docker run 镜像就是容器（最小的linux内核文件和运行的应用程序），镜像和容器的关系，就像是面向对象程序设计中的 `类` 和 `实例`一样，镜像是静态的定义，容器是镜像运行时的实体
- 仓库（Repositry）：保存镜像的仓库，每个仓库可以包含多个Tag，对应不同的镜像

## 镜像
Docker 镜像 是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像 不包含 任何动态数据，其内容在构建之后也不会被改变。

>对于linux而言，内核启动后会挂载root文件系统为用户提供空间支持，如一个基本的centos镜像就包含了一套完整的centos的root文件系统。

镜像最重要的概念就是镜像层，以及它的存储原理。

### 镜像层
![docker-layer](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/docker-layer.png)

Docker 使用[UnionFS（联合文件系统)](https://en.wikipedia.org/wiki/UnionFS)来实现镜像层之间的共享和复用，从而节省存储空间和加速构建过程。UnionFS 是一种基于文件系统的技术，它能够将多个不同的文件系统合并成为一个虚拟的文件系统。

在 Docker 中，UnionFS 主要由以下三个部分组成：
- 基础文件系统：Docker镜像中的每个层都有一个基础文件系统，它是一个只读的文件系统，包含了镜像的构建信息和运行时所需要的依赖项。
- 容器文件系统：Docker容器层有一个可读写的容器文件系统，它是由基础文件系统和其他层共同组成的。当容器启动时，Docker 会将容器文件系统挂载到主机上，使其在主机上可以被访问和修改。
- UnionFS：UnionFS将多个文件系统合并成为一个虚拟的文件系统，使得用户可以看到一个统一的文件系统结构。Docker使用UnionFS来管理镜像层之间的依赖关系和共享信息，从而实现镜像的复用和节省存储空间的目的。

BootFS 文件系统是一个只读的文件系统，它位于 Docker 镜像的最底层。当 Docker 启动容器时，它会将 BootFS 文件系统加载到内存中，并在其上启动操作系统。操作系统启动后，Docker 会将其他文件系统（如容器层和其他镜像层）挂载到操作系统上，使得容器中的应用程序可以访问这些文件系统中的文件和数据。

在使用 UnionFS 时，Docker 会将各个镜像层以只读的方式合并到一个虚拟的文件系统中，然后再将容器层以可读写的方式挂载到虚拟文件系统上。这样，容器就能够访问和修改虚拟文件系统中的内容，而对于只读的镜像层，则不会被修改，从而实现了镜像的共享和复用。

总的来说，Docker 使用 UnionFS 技术来实现镜像层之间的共享和复用，从而节省存储空间和加速构建过程。UnionFS 技术能够将多个文件系统合并成为一个虚拟的文件系统，并且支持只读和可读写两种模式，使得用户可以看到一个统一的文件系统结构。

### 查看本地镜像
```sh
# 命令
docker images [options] [REPOSITORY[:TAG]]

# 列出所有镜像
➜ docker images
REPOSITORY       TAG         IMAGE ID       CREATED         SIZE
alpine           latest      8e1d7573f448   16 months ago   5.33MB
nginx            1.15.3      c5e5a72af32f   4 years ago     103MB

➜ docker images --filter reference=nginx
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        1.15.3    c5e5a72af32f   4 years ago   103MB
```
以上会以表格的方式列表镜像，其中包含了镜像仓库、标签、镜像ID、创建时间、大小等等，上面列出了`alpine`和`nginx`两个镜像

常用的参数：
- `-a`：显示所有镜像中间层镜像
- `-q`：只输出镜像ID
- `--filter`：筛选镜像
	+ `dangling=true|false`：显示有无使用的镜像
	+ `reference=<镜像名>`：根据名字或标签进行筛选镜像
- `--format`：以哪种格式输出，`table、json、TEMPLATE`，默认`table`

### 镜像拉取与推送
1. 搜索镜像
	```sh
	docker search imageName [options]
	
	➜ docker search nginx --limit 2
	NAME            DESCRIPTION                  STARS     OFFICIAL   AUTOMATED
	nginx           Official build of Nginx.     18278     [OK]
	bitnami/nginx   Bitnami nginx Docker Image   155                  [OK]
	```
	搜索镜像会默认从官方的[docker registry](https://hub.docker.com/search)进行搜索，你可以使用`--limit`参数限制搜索数

2. 下载、删除
	```sh
	# 下载，没有tag时默认 latest
	docker pull imageName:tag
	# 下载nginx
	docker pull nginx
	
	
	# 删除
	docker image rm image ... / docker rmi image ...
	# 删除latest版本nginx
	docker rmi nginx
	
	# 删除虚悬镜像（虚悬镜像看以下部分）
	docker image prune
	```

### 虚悬镜像
Docker 虚悬镜像（dangling image）指的是没有被任何容器使用的镜像。在 Docker 中，每个新构建的镜像都会创建一个新的镜像 ID，并且旧的镜像 ID 会被保留在本地。当使用 docker images 命令查看本地镜像列表时，可能会看到一些虚悬镜像，它们的 REPOSITORY 和 TAG 字段显示为 `<none>`

虚悬镜像可能是由于以下原因导致的：
- 构建新版本的镜像时，旧的镜像 ID 会被保留在本地，而新的镜像 ID 会覆盖旧的镜像 ID。
- 删除容器时，容器所依赖的镜像不会被自动删除，因此可能会留下一些虚悬镜像。
- 在使用`docker rmi`命令删除镜像时，如果没有指定正确的镜像ID或名称，也可能会删除不正确的镜像，从而产生虚悬镜像。

举一个重复构建同名同tag的nginx镜像：
```sh
➜ docker images --filter reference=nginx
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        1.15.3    c5e5a72af32f   4 years ago   103MB

# 启动容器
➜ docker run -d --name nginx nginx:1.15.3
1453e55d41100b57f5f76ed036f65276e311db36c4f3e9afd3fce49a25c4f8b8

# 打一个新镜像
➜ docker commit nginx nginx:1.15.3
sha256:db2d3fa0bcb45bdc528960d1b06eb68496f044896d901e23d79bb1e54af56b9e

# 重新查看
➜ docker images --filter reference=nginx
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
nginx        1.15.3    db2d3fa0bcb4   52 seconds ago   103MB
nginx        <none>    c5e5a72af32f   4 years ago      103MB
```

## 容器

## 仓库













