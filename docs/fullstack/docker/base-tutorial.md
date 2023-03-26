---
title: Docker基础教程
description: docker架构、镜像、容器、仓库使用指南
head:
  - - meta
    - name: keywords
      content: docker架构,docker命令,docker镜像,docker仓库,docker构建镜像,docker文件传输
  - - meta
    - property: og:description
      content: docker架构、镜像、容器、仓库使用指南
  - - meta
    - property: og:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
  - - meta
    - name: twitter:description
      content: docker架构、镜像、容器、仓库使用指南
  - - meta
    - name: twitter:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
---

# Docker基础教程

Docker 是一个开源的容器化平台，可以帮助开发者和运维人员更快地构建、发布和运行应用程序。Docker 使用容器技术，将应用程序和其依赖项打包到一个可移植的容器中，从而实现跨平台、快速部署和易于管理的目的。

本文主要从docker的基础开始学习，包括基本架构、全局命令、镜像、仓库、容器

## Docker架构
Docker 架构分为**客户端-服务器架构**和**主从架构**，具体如下：

**客户端-服务器架构**：也称为`C/S`架构，Docker 采用客户端-服务器架构，其中客户端是 Docker 命令行工具，用于与 Docker 服务端通信。Docker 服务端是 Docker 引擎，负责管理和运行 Docker 容器。客户端和服务端可以运行在同一台机器上，也可以通过网络连接运行在不同的机器上。

**主从架构**：集群模式，Docker Swarm 是一个用于管理多个 Docker 容器的集群工具，采用主从架构。Docker Swarm 集群由一个管理节点和多个工作节点组成，管理节点负责整个集群的管理和调度，工作节点负责运行 Docker 容器。管理节点和工作节点可以运行在同一台机器上，也可以通过网络连接运行在不同的机器上。

## 全局命令
1. 查看docker版本
	```sh
	docker version
	```
2. 查看docker详细信息
	```sh
	docker info
	```
3. 查看docker磁盘使用情况
	```sh
	➜ docker system df
	TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
	Images          12        5         4.138GB   713.6MB (17%)
	Containers      5         0         2.634MB   2.634MB (100%)
	Local Volumes   24        2         649.6MB   607.7MB (93%)
	Build Cache     0         0         0B        0B
	```
4. 查看docker server的实时信息，我们从架构可以知道docker是基于`C/S`架构的，docker server端负责管理和运行docker容器，我们可以查看其具体的操作步骤，先使用以下命令开始监听server端，然后新开一个终端，启动或停止容器查看输出：
	```sh
	docker system events

	# 示例
	2020-03-26T10:53:23.497642694+08:00 container kill 999511b43ca0ffa61979ccb6561ff20f499b087be99aba95836cee20edb794a3 (image=nginx:1.15.3, maintainer=NGINX Docker Maintainers <docker-maint@nginx.com>, name=nginx, signal=15)
	2020-03-26T10:53:23.936509503+08:00 network disconnect 3d9d929e9d34b4c776d993158c3bd8c6074fea2e1de0ab43c846e571c1191711 (container=999511b43ca0ffa61979ccb6561ff20f499b087be99aba95836cee20edb794a3, name=bridge, type=bridge)
	2020-03-26T10:53:23.953543859+08:00 container stop 999511b43ca0ffa61979ccb6561ff20f499b087be99aba95836cee20edb794a3 (image=nginx:1.15.3, maintainer=NGINX Docker Maintainers <docker-maint@nginx.com>, name=nginx)
	2020-03-26T10:53:23.958016229+08:00 container die 999511b43ca0ffa61979ccb6561ff20f499b087be99aba95836cee20edb794a3 (exitCode=0, image=nginx:1.15.3, maintainer=NGINX Docker Maintainers <docker-maint@nginx.com>, name=nginx)
	```
4. 查看对象的详细信息，可以查看指定镜像、容器等等
	```sh
	docker inspect [name|ID]
	```

## 核心组件
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

### 搜索、下载、推送
1. 搜索镜像
	```sh
	docker search imageName [options]
	
	➜ docker search nginx --limit 2
	NAME            DESCRIPTION                  STARS     OFFICIAL   AUTOMATED
	nginx           Official build of Nginx.     18278     [OK]
	bitnami/nginx   Bitnami nginx Docker Image   155                  [OK]
	```
	搜索镜像会默认从官方的[docker registry](https://hub.docker.com/search)进行搜索，你可以使用`--limit`参数限制搜索数

2. 下载
	```sh
	# 下载，没有tag时默认 latest
	docker pull imageName:tag
	# 下载nginx
	docker pull nginx
	```

3. 推送

	镜像推送指将本地的镜像推送到远程仓库，如将项目代码提交到远程的git仓库，推送首先要登录
	```sh
	# 登录
	docker login
	# 推送
	docker push imageName:tag
	```

### 创建、删除

1. 创建

	创建新镜像的方式有很多，可以通过打新的标签、commit、Dockerfile来创建新镜像
	```sh
	# 通过打新标签
	docker tag nginx:1.1 nginx-me:v1
	# 通过commit
	docker commit container imageName:tag
	# 通过Dockerfile
	docker build -t imageName:tag .
	```
	>有关Dockerfile的使用可以查看我的「[使用Dockerfile构建镜像]()」一文

1. 删除
	```sh
	# 删除
	docker image rm image ... / docker rmi image ...
	# 删除latest版本nginx
	docker rmi nginx
	# 删除所有镜像
	docker rmi $(docker images -qa)
	# 删除虚悬镜像（虚悬镜像看以下部分）
	docker image prune
	```

### 其他命令
```sh
# 将镜像导出为 tar文件
docker save imageName > file.tar
# 解压镜像
docker load -i file.tar
# 查看镜像构建历史
docker history imageName
# 查看镜像详细信息
docker inspect imageName
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
容器是镜像的运行实例。Docker 容器是一个动态的环境，通过在镜像之上创建一个运行实例，可以启动和运行应用程序。容器是一个具有生命周期的实体，可以被创建、启动、停止、删除和迁移等操作。

容器可以通过镜像来创建。在 Docker 中，通过 Dockerfile 或者其他方式创建一个镜像，然后通过这个镜像来创建一个或多个容器实例。这些容器实例都是基于同一个镜像创建的，但它们之间是相互独立的，拥有自己的文件系统、网络和进程空间。

容器可以通过修改来生成新的镜像。在容器运行时，可以对容器内部的文件系统进行修改，如添加、删除、修改文件等。这些修改可以通过 Docker commit 命令来保存为一个新的镜像，以便后续使用。

### 启动
启动 Docker 容器需要使用 `docker run` 命令，该命令用于创建和启动一个新的 Docker 容器实例。下面是 `docker run` 命令的一些常用选项和参数：
```sh
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```
其中，`OPTIONS` 是一些可选的命令选项，`IMAGE` 是要创建容器的镜像名称或 `ID`，`COMMAND` 是容器启动后要运行的命令，`ARG` 是命令的参数。一些常用的选项包括：
- `-d`：后台运行容器
- `-it`：交互运行，并分配一个容器伪终端
- `-p`：指定容器的端口映射
- `-v`：指定容器与主机之间的文件共享
- `--name`：为容器指定一个名称
- `-e`：设置容器的环境变量
- `--rm`：退出后删除容器

这里是`docker run`的几个小例子：
```sh
# 后台运行nginx，容器命名nginx，映射宿主机端口 8080到nginx容器的80端口
docker run -d --name nginx -p 8080:80 nginx

# 使用交互式运行centos容器，exit退出后 自动删除容器
docker run -it --rm centos /bin/bash

# 启动nginx 并将 nginx容器内部的 nginx静态文件路径挂载到宿主机上指定位置
docker run -v /somedir/data:/etc/share/nginx/html nginx
```

以上便是`docker run`启动一个新容器的基本玩法，除了新启动一个容器外，还可以使用`docker start`启动一个已经停止的容器或`docker restart`重启一个容器
```sh
docker start nginx
docker restart nginx
```

### 进入容器
`docker exec`命令用于在运行中的Docker容器中执行命令。该命令可以让用户在运行中的容器中打开一个新的终端，以执行任意的命令或者进入容器内部进行交互式操作。以下是`docker exec`命令的基本语法：
```sh
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```
其中，`OPTIONS`是可选参数，`CONTAINER` 是要执行命令的容器名称或 `ID`，`COMMAND` 是要在容器中执行的命令，`ARG`是命令的参数。

除了使用`docker exec`外，docker还支持`docker attach`用于连接到正在运行中的Docker容器的标准输入、输出和错误流（即 STDIN、STDOUT 和 STDERR）。这个命令可以让用户实时地查看容器中的输出信息
```sh
➜ docker attach nginx
192.168.10.1 - - [26/Mar/2020:02:15:38 +0000] "GET / HTTP/1.1" 304 0 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36" "-"
```
当使用`Ctrl + C`时会退出容器并停止容器的运行，官方建议使用`docker exec`进入容器做一些高级的操作


### 容器列表
当容器运行后可以在容器列表中看到，要查看当前系统中正在运行的 Docker 容器列表，可以使用 `docker ps` 命令。该命令显示了所有正在运行的容器的相关信息，如容器 ID、镜像名称、容器名称、启动时间、状态等。以下是一些常用的 `docker ps` 命令选项：
- `-a`：显示所有容器，包括已经停止的容器
- `-q`：只显示容器的 ID
- `--no-trunc`：显示完整的容器 ID
- `-s`：显示容器的磁盘使用情况
- `--filter`：基于条件过滤输出
```sh
# docker ps -as
CONTAINER ID   IMAGE           COMMAND               CREATED         STATUS        PORTS     NAMES    SIZE
ff21fc7bdfbe   nginx:1.15.3  "nginx -g 'daemon of…"  54 seconds ago  Up 53 seconds 80/tcp    nginx    2B (virtual 103MB)

# 只显示nginx
docker ps --filter name=nginx
```
可以通过查看容器列表容器的状态查看启动的容器有没有正常运行，除了这种方式还可以通过容器的日志，查看内部运行的细节

### 容器日志
`docker logs`命令用于查看Docker容器的日志信息。该命令可以查看容器的标准输出和标准错误输出，以及容器内部运行的进程的日志信息。以下是 docker logs 命令的语法：
```sh
docker logs [OPTIONS] CONTAINER
```
其中，`OPTIONS` 是一些可选的命令选项，`CONTAINER` 是要查看日志的容器名称或 `ID`。一些常用的选项包括：
- `-f`：实时跟踪容器的日志输出
- `--tail`：指定显示最后几行日志，默认为所有日志
- `--since`：指定显示从某个时间戳开始的日志
- `--until`：指定显示到某个时间戳结束的日志
```sh
# 实时查看nginx的日志
➜ docker logs -f nginx
192.168.10.1 - - [26/Mar/2020:01:06:35 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36" "-"
2020/03/26 01:06:35 [error] 7#7: *1 open() "/usr/share/nginx/html/favicon.ico" failed (2: No such file or directory), client: 192.168.10.1, server: localhost, request: "GET /favicon.ico HTTP/1.1", host: "192.168.10.10:8088", referrer: "http://192.168.10.10:8088/"
```
通过`docker logs`可以很看到内部运行的详细日志，对于自己的容器需要做好日志的输出方便查看日志和错误追溯

### 停止
容器起来后不想运行了怎么办，可以使用停止命令停止正在运行的容器，使用该命令会发送一个 `SIGTERM` 信号给容器中运行的主进程，请求其停止运行，并等待一定时间（默认为10秒）让容器中的进程进行清理和保存工作。如果在指定的时间内容器中的进程仍未停止，则会发送一个 `SIGKILL` 信号，强制终止容器中的进程
```sh
docker stop [OPTIONS] CONTAINER [CONTAINER...]
```
`OPTIONS` 是一些可选的命令选项，`CONTAINER` 是要停止的一个或多个容器名称或 `ID`。一些常用的选项包括：
- `-t`：指定等待容器停止的时间，单位为秒，默认10s
- `--signal`：发送给容器的信号

除了`docker stop`命令，以前还可以使用`docker kill`命令，不过已经被废弃掉

### 删除
`docker rm` 命令用于删除已经停止的 Docker 容器。该命令只能删除已经停止的容器，如果要删除正在运行的容器，需要先使用`docker stop`命令停止容器。以下是 docker rm 命令的语法：
```sh
docker rm [OPTIONS] CONTAINER [CONTAINER...]
```
其中，`OPTIONS` 是一些可选的命令选项，`CONTAINER` 是要删除的一个或多个容器名称或 `ID`。一些常用的选项包括：
- `-f`：强制删除容器，即使容器正在运行
- `-v`：同时删除与容器关联的卷（volume）
```sh
# 强制删除正在运行的nginx容器
docker rm -f nginx
```
除了`docker rm`命令外，还可以使用`docker ps prune`命令来删除所有已经停止的容器并释放容器占用的资源，不过一般不常用，毕竟已经停止的容器一般倒不是不需要的：
```sh
# 强制删除所有容器
docker ps prune -f
```

### 导入导出
Docker 容器的导入导出可以用于将一个容器的文件系统打包成一个 tar 文件，并在另一台机器上重新导入为一个新的 Docker 镜像。这种方式可以方便地将一个容器迁移到另一台机器上，或者分享容器镜像给其他人使用。

:::warning
1. 导出的 tar 文件只包含容器的文件系统，并不包含容器的元数据（如容器的名称、ID、端口等信息）

2. 导入的镜像只包含容器的文件系统，不包含容器的元数据和启动命令等信息

3. 导出的 tar 文件和导入的镜像都是针对单个容器的，不包含容器依赖的镜像和容器的运行环境等信息。如果要迁移一个应用程序，需要将所有相关的容器和镜像一起导出导入
:::

1. 导出容器的文件系统为一个 tar 文件，使用 `docker export` 命令导出容器的文件系统为一个 `tar` 文件。例如，要将名为 `mycontainer` 的容器的文件系统导出为一个 `mycontainer.tar` 文件，可以使用以下命令：
```sh
docker export mycontainer > mycontainer.tar
```
2. 导入容器的文件系统为一个镜像，使用 `docker import` 命令将 `tar` 文件导入为一个新的 Docker 镜像。例如，要将名为 `mycontainer.tar `的 tar 文件导入为一个名为 myimage 的 Docker 镜像，可以使用以下命令：
```sh
docker import mycontainer.tar myimage
```

## 仓库

Docker Registry 是 Docker 平台的一个核心组件，它是一个用于存储、分发和管理 Docker 镜像的服务器端应用程序。Docker Registry 允许用户将本地创建的镜像上传到 Registry 中，并可以从 Registry 中下载和使用其他用户共享的镜像。它可以简化 Docker 镜像的管理和分发，提高应用的部署效率和可靠性。同时，Docker Registry 还提供了一系列的管理工具和服务，如 Docker Trusted Registry（DTR）、Harbor 等，可以帮助用户更好地管理和保护 Docker 镜像，确保安全和可靠性。

Docker Registry 可以分为两种类型：`公共Registry` 和 `私有Registry`

每个registry中包含多个仓库，我们本地的registry其实也是这样，每个仓库有多个tag来表示不同版本的仓库镜像，你可以将registry看做是一个gitlab，gitlab中的每个仓库代表着每个镜像，仓库的tag表示镜像的版本

### 公有仓库
公共 Registry 是由 Docker 公司维护的一组公共镜像仓库，其中最著名的是 Docker Hub。[Docker Hub](https://hub.docker.com/) 是一个公共的 Docker Registry，包含了大量的 Docker 镜像，开发者可以通过 Docker Hub 来获取和分享 Docker 镜像。

Docker 公开仓库的镜像完整地址由三个部分组成：仓库地址、镜像名称和镜像标签。

其中，仓库地址指的是 Docker 镜像仓库的地址，Docker 官方的公开仓库地址为 docker.io，也可以使用其他的镜像仓库地址。镜像名称是指 Docker 镜像的名称，通常由两部分组成，即镜像的命名空间和镜像的名称，中间使用斜杠 / 隔开。例如，library/nginx 表示 Docker 官方的 nginx 镜像。镜像标签是指镜像的版本号或标识符，用冒号 : 隔开。例如，library/nginx:latest 表示最新版本的 Docker 官方的 nginx 镜像。

```sh
# 本地已经存在了 nginx:1.15.3
➜ docker images | grep nginx
nginx  1.15.3  c5e5a72af32f  4 years ago  103MB

# 重新用完整的地址下载nginx:1.15.3，再次查看还是那个nginx
docker pull docker.io/library/nginx:1.15.3
```

### 私有仓库
私有 Registry 是指由用户自己搭建的 Docker 镜像仓库，用于存储和管理自己创建的 Docker 镜像。私有 Registry 可以在内部部署，也可以在公有云上部署，如 Amazon Web Services、Microsoft Azure 和 Google Cloud Platform 等。

博客中也介绍了关于私有仓库的搭建，你可以去阅读我的「[搭建docker私有仓库](/fullstack/docker/docker-repository.html)」一文去了解完整的私库搭建过程。

### 认证
Docker 仓库认证是一种基于用户名和密码的身份验证机制，用于保护Docker镜像仓库中的镜像资源，防止未经授权的用户访问和下载镜像

1. 可以使用命令行登录：
	```sh
	docker login [OPTIONS] [SERVER]
	```
	其中`OPTIONS` 和 `SERVER`是可选部分，`OPTIONS` 的参数包括：
	- `-u`：登录的用户名
	- `-p`：登录密码
	`SERVER` 则是仓库的地址，默认是docker官方的仓库地址
	你可以这样使用：
	```sh
	# 一键式登录  ====>   官方不推荐，密码会暴露😂
	docker login -u root -p password [url]

	# 交互式
	docker login [url]
	Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
	Username: root
	Password:
	```
2. 直接在docker的`$HOME/.docker/config.json`中配置仓库地址和登录凭证，通过命令行登录后，会在你的`$HOME/.docker/config.json`文件中添加仓库和登录凭证，你可以直接在此文件中添加你想要登录的地址和密码，如果没有此文件自行创建即可，配置文件如下：
	```json
	{
  	"auths": {
  		// 仓库地址，这里是官方地址
    	"https://index.docker.io/v1/": {
    		// 凭证
    		"auth": "aWhlbmdzaHVhaToxMjM0NTYK"
    	},
    	// 其他仓库
    	"192.168.10.10:8000": {
    		"auth": "aWhlbmdzaHVhaToxMjM0NTYK"
    	},
  	}
	}
	```
	上面的配置文件中存在两个仓库地址，当使用`docker login`时如果不指明地址默认会登录官方仓库，在登录时docker会检查本地的`$HOME/.docker/config.json`中是否存在已经登录的凭证，如果存在会直接登录，否则会和第一步一样重新输入账号、密码。

	以上的`auth`值其实就是`账户:密码`的base64结果，其加密结果并不安全，可以通过base64反解码出来，我们试下：
	```sh
	➜ echo 'aWhlbmdzaHVhaToxMjM0NTYK' | base64 --decode
	ihengshuai:123456
	```
	>所以不要轻易将加密后的密码泄露掉
3. 退出登录
	```sh
	docker logout [SERVER]
	```
	退出后同样会删除`$HOME/.docker/config.json`中对应的仓库地址和密码

## 总结
本文从docker的架构、全局命令、镜像、容器和仓库入门，简单的介绍了docker的基本使用，这些命令基本上囊括了docker常见的命令行使用方式，需要大家多多使用才能熟练，虽然docker的命令在生产环境的使用几率不是很多，但是对于我们快速启动一个想要的环境或验证一些想法都是非常友好的，总之熟能生巧。

<Reward />
<Gitalk />











