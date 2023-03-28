---
title: 使用Dockerfile构建镜像
description: 使用命令行commit的方式构建镜像比较繁琐且定制镜像困难,一起来学习使用Dockerfile一键式构建自己的镜像吧
head:
  - - meta
    - name: keywords
      content: Dockerfile,docker镜像构建,定制docker镜像
  - - meta
    - property: og:description
      content: 使用命令行commit的方式构建镜像比较繁琐且定制镜像困难,一起来学习使用Dockerfile一键式构建自己的镜像吧
  - - meta
    - property: og:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
  - - meta
    - name: twitter:description
      content: 使用命令行commit的方式构建镜像比较繁琐且定制镜像困难,一起来学习使用Dockerfile一键式构建自己的镜像吧
  - - meta
    - name: twitter:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
---

# 使用Dockerfile构建镜像
前面我们学习了可以使用`docker commit`命令式构建新的镜像，而此方式相对来说比较繁琐且对于旁人来说内部都是黑箱操作，无法了解制作的具体细节。很有可能很长时间后制作者也会对其忘却，且制作多镜像时相同阶段也无法共用已构建的产物，Dockerfile便可以完美解决这些问题。

## 概念
Dockerfile是用于定义Docker镜像的文件，是一种纯文本文件，其中包含了一系列的指令和配置信息，以描述如何构建和运行一个Docker容器。Dockerfile的内容可以基于现有的镜像进行扩展和定制化，也可以自己编写底层的操作系统配置和应用程序安装脚本。

镜像是分层构建的，每一层都对应了具体的构建指令，而Dockerfile中每一条指令也代表着每层的构建过程

## 作用
使用Dockerfile为镜像的构建使得更加便利，其优势大致如下：
- 自动化构建：使用Dockerfile可以自动构建Docker镜像，避免了手动操作的繁琐和错误
- 可重复性：通过Dockerfile可以确保每次构建出的镜像都是相同的，避免了因为不同的环境或依赖出现的差异
- 可维护性：使用Dockerfile可以清晰地描述容器的配置和依赖，方便维护和升级
- 灵活性：Dockerfile提供了灵活的自定义选项，可以根据需要对容器进行个性化配置
- 可分享性：Dockerfile可以作为代码一样进行版本控制和分享，方便团队协作和共享

## 初识Dockerfile
和大部分配置文件不同，Dockerfile其实就是个普通的文本文件，内部由一条条具体的构建指令组合而成，可以说Dockerfile是加强版的命令构建版本。以下是一个简单的Dockerfile：
```docker
FROM nginx:alpine
ENV DESC="DOCKERFILE_DEMO"
WORKDIR /var/nginx/html
RUN echo $DESC
COPY . .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
以上配置指定了构建以`nginx:alpine`镜像为基础，定义容器的工作目录为`/var/nginx/html`，并将宿主机当前目录下的文件复制到容器的工作目录下，暴露端口80，并规定容器启动后让nginx以<u>前台</u>的形式运行。除此之外还定义了环境变量`DESC`的值为`DOCKERFILE_DEMO`，并打印其结果

接下来构建生成目标镜像：`nginx:dockerfile`
```sh{7,12}
➜ docker build -t nginx:dockerfile .
[+] Building 15.3s (9/9) FINISHED
 => [internal] load build definition from Dockerfile                                                                      0.0s
 => => transferring dockerfile: 182B                                                                                      0.0s
 => [internal] load .dockerignore                                                                                         0.0s
 => => transferring context: 2B                                                                                           0.0s
 => [internal] load metadata for docker.io/library/nginx:alpine                                                          15.3s
 => [1/4] FROM docker.io/library/nginx:alpine@sha256:eb05700fe7baa6890b74278e39b66b2ed1326831f9ec3ed4bdc6361a4ac2f333     0.0s
 => [internal] load build context                                                                                         0.0s
 => => transferring context: 182B                                                                                         0.0s
 => CACHED [2/4] WORKDIR /var/nginx/html                                                                                  0.0s
 => CACHED [3/4] RUN echo DOCKERFILE_DEMO                                                                                 0.0s
 => [4/4] COPY . .                                                                                                        0.0s
 => exporting to image                                                                                                    0.0s
 => => exporting layers                                                                                                   0.0s
 => => writing image sha256:bcd9c0828a32f7f2816cc128ac1f1f7368066caf401c93057825d0f3b5df4864                              0.0s
 => => naming to docker.io/library/nginx:dockerfile
```
查看并运行：
```sh
# 查看镜像已经存在
➜ docker images | grep dockerfile
nginx    dockerfile     bcd9c0828a32   56 seconds ago   22.1MB

# 运行容器
➜ docker run --rm -p 8088:80 nginx:dockerfile
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
```

以上我们便使用Dockerfile配置文件定制nginx镜像的完整流程，可以体验出它相比命令式更加便捷，操作简单透明，并且同阶段的构建会被缓存起来复用，可以很好的提高构建效率，对于相同镜像的共享也只需拿到配置文件即可制作完全一样的镜像。

相反不使用Dockerfile，需要我们一步一步使用命令进行构建，那样会相对繁琐，整体构建的操作也会是黑箱操作，无法满足简单、易维护、高效的特性。

了解了Dockerfile的便捷之处后，接下来学习详细语法。

## 语法

### FROM
初始化基础的镜像，在Dockerfile中必须的也是最开始就需要的，后面的命令需要基于最初的镜像进行操作。`FROM`一般是最开始执行的，`ARG`命令是唯一可以在`FROM`前执行的命令。

语法：
```sh
FROM [--platform=<platform>] <image>[:tag] [AS <name>]
```
- `AS name`：可选，指定构建阶段的名称，适用于多阶段构建
- `--platform`：指定平台，如arm，amd等等
- `tag`：可选，不指定镜像tag默认为latest

### ARG
ARG 指令用于设置构建时的参数，这些参数可以在构建时传递给 Docker 以影响镜像的构建，使用ARG可以简化镜像的构建过程、将容器的配置信息与容器的代码分离，提高容器的可维护性

语法：
```sh
ARG <name>[=<default value>]
```
可以在构建时使用 `--build-arg <key>=<value>` 参数来传递一个新的值给指定的参数

例子：
```docker
# Dockerfile-ARG
FROM nginx:alpine
ARG VERSION=0.0.1
ENV VERSION=$VERSION
RUN echo $VERSION
```
构建镜像重新赋值：从第9行看到已经被赋新值`0.1.0`
```sh{9}
➜ docker build --build-arg VERSION=0.1.0 -t nginx:ARG --file Dockerfile-ARG .
[+] Building 15.9s (6/6) FINISHED
 => [internal] load .dockerignore                                                                                         0.0s
 => => transferring context: 2B                                                                                           0.0s
 => [internal] load build definition from Dockerfile-ARG                                                                  0.0s
 => => transferring dockerfile: 119B                                                                                      0.0s
 => [internal] load metadata for docker.io/library/nginx:alpine                                                          15.6s
 => CACHED [1/2] FROM docker.io/library/nginx:alpine@sha256:eb05700fe7baa6890b74278e39b66b2ed1326831f9ec3ed4bdc6361a4ac2  0.0s
 => [2/2] RUN echo 0.1.0                                                                                                  0.3s
 => exporting to image                                                                                                    0.0s
 => => exporting layers                                                                                                   0.0s
 => => writing image sha256:c073ffd0029a4a3e64b68f2a9e450a4389d0b81fc7221bfcd727448be48bea36                              0.0s
 => => naming to docker.io/library/nginx:ARG
```
然后可以通过`docker inspect`查看镜像的变量：
```sh{7}
➜ docker inspect nginx:ARG | grep -A 6 Env
  "Env": [
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      "NGINX_VERSION=1.21.5",
      "NJS_VERSION=0.7.1",
      "PKG_RELEASE=1",
      "VERSION=0.1.0"
  ],
```

### ENV
该指令用于设置环境变量，可以在容器运行时使用这些环境变量

语法：
```sh
ENV <key>=<value> ...
```
其中，`<key>` 表示要设置的环境变量的名称，`<value>`表示要设置的环境变量的值。如果要设置多个环境变量，可以在<u>ENV指令中指定多个键值对，每个键值对用空格分隔，双引号将会被移除如果没有使用转义</u>。Dockerfile中ENV定义的变量会持久保存在镜像中，可以使用`docker inspect image`查看内部的环境变量，可以在<u>运行容器时</u>使用`-e <key>=<value>`来覆盖原来的值，或设置新的环境变量

例子：
```docker
# Dockerfile
FROM nginx:alpine
ENV k1=v1
RUN echo $k1
```
构建镜像：
```sh{9}
docker build --file Dockerfile -t nginx:ENV .
[+] Building 15.7s (6/6) FINISHED
 => [internal] load build definition from Dockerfile-ENV                                                                  0.0s
 => => transferring dockerfile: 86B                                                                                       0.0s
 => [internal] load .dockerignore                                                                                         0.0s
 => => transferring context: 2B                                                                                           0.0s
 => [internal] load metadata for docker.io/library/nginx:alpine                                                          15.5s
 => CACHED [1/2] FROM docker.io/library/nginx:alpine@sha256:eb05700fe7baa6890b74278e39b66b2ed1326831f9ec3ed4bdc6361a4ac2  0.0s
 => [2/2] RUN echo v1                                                                                                     0.2s
 => exporting to image                                                                                                    0.0s
 => => exporting layers                                                                                                   0.0s
 => => writing image sha256:c6e1d107c5aa56a9c70fcd377c539e6ae28267e4f1660d9dd8ee5d7a40ac79e6                              0.0s
 => => naming to docker.io/library/nginx:ENV
```
查看镜像内部持久化的变量：第8行看到镜像内部设置的`k1`变量
```sh{8}
docker inspect nginx:ENV | grep -A 5 ENV
# ...
"Env": [
    "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    "NGINX_VERSION=1.21.5",
    "NJS_VERSION=0.7.1",
    "PKG_RELEASE=1",
    "k1=v1"
],
```
运行容器并覆盖镜像中默认的`k1`变量值：
```sh{6}
docker run -d -p 8080:80 -e k1=v2 --name nginx-env nginx:ENV

# 查看容器 nginx-env 内部配置
docker inspect nginx-env | grep -A 6 Env
  "Env": [
      "k1=v2",
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      "NGINX_VERSION=1.21.5",
      "NJS_VERSION=0.7.1",
      "PKG_RELEASE=1"
  ],
```

### WORKDIR
WORKDIR 指令用于设置容器中的工作目录。当我们在容器中运行命令时，它们将在 WORKDIR 指定的目录中运行。如果在 Dockerfile 中没有使用 WORKDIR 指令，则默认的工作目录是根目录（/）。

语法：
```sh
WORKDIR /path/to/workdir
```
例子：
```docker
FROM ubuntu:latest
# 指定容器工作目录为/app
WORKDIR /app
# 将当前目录下的内容复制到容器中的 /app 目录中
COPY . .
RUN apt-get update && apt-get install -y python3
CMD ["python3", "app.py"]
```

### LABEL
给镜像添加标签，label使用键值对的方式定义，有空格的值要用双引号包括，尽量在一行中定义完所有的label，自己使用意义不大了解下即可

语法：
```sh
LABEL <key>=<value> <key>=<value> <key>=<value> ...
```
例子：
```docker
LABEL label1=xxxxx \
      label2=123143 \
      label3="sdfsdfs"
```

例子：
```docker
# 使用 arm架构的 nginx:1.15.3 的镜像作为 build 阶段的基础镜像
FROM --platform=arm nginx:1.15.3 AS build
```

### RUN
在当前镜像上层执行相关命令，并commited一个新的镜像层提供给下一层阶段使用。由于一条RUN指令便会产生新的镜像层，使得构建体积变大，在生产构建时尽量采用 `&&` 把RUN合并成一条指令执行，当然在测试构建时分开写更容易排查构建错误
:::warning 注意
使用RUN执行命令时当前阶段必须包含所执行的命令才可以，否则需要先安装相关命令
:::

语法：
```sh
RUN <command>
RUN ["executable", "param1", "param2"...]
```
RUN支持两种执行形式：<u>shell格式和exec格式</u>。shell格式就是在终端执行命令一样，可以使用管道、重定向、变量的一些特性，而exec格式不会采用shell执行，而是直接在容器中执行，写法就像一个一维数组，将每个参数放在每个位置即可，使用exec可以减少启动新shell进程的开销，且会作为第一进程执行。

例子：
```docker
RUN curl -I http://localhost
RUN ["curl", "-I", "http://localhost"]
```

### COPY
复制本地文件或路径到容器的文件系统，支持通配符匹配，不支持远程url文件地址，不支持压缩包自动解压，相比[ADD指令](/fullstack/docker/dockerfile.html#add)一般使用这个也够用了

语法：
```sh
COPY [--chown=<user>:<group>] [--chmod=<perms>] <src>... <dest>
COPY [--chown=<user>:<group>] [--chmod=<perms>] ["<src>",... "<dest>"]
```
复制文件也支持设置指定的用户和权限组

例子：
```docker
# 绝对路径
COPY *.md /app
COPY hom?.txt /app

# 相对路径 work相对于 WORKDIR
COPY *.sh work

# 修改文件权限
COPY --chown=1 files* /somedir/
```

### ADD
复制本地文件、路径或<u>远程文件</u>到容器文件系统，相比[COPY](/fullstack/docker/dockerfile.html#copy)可以远程文件，并自动下载复制到目标位置。如果是压缩文件，也会自动解压。

语法：
```sh
ADD [--chown=<user>:<group>] [--chmod=<perms>] [--checksum=<checksum>] <src>... <dest>
ADD [--chown=<user>:<group>] [--chmod=<perms>] ["<src>",... "<dest>"]
```
例子：
```docker
ADD ubuntu-xenial-core-cloudimg-amd64-root.tar.gz /
ADD *.md /app
```

### VOLUME
定义容器数据挂载点，在运行容器时使用`-v`或`--mount`参数指定宿主机目录或文件挂载到容器的挂载点，实现容器与主机之间的数据共享，将容器的数据和应用程序分离开来，保持容器的数据独立性，也便于在主机上修改相应的配置文件。

语法：
```sh
VOLUME /dir1 /dir2 /dir3 ...
VOLUME ["dir1", ...., "dir9999"]
```
VOLUME支持多个挂载点，在运行容器时通过`-v`进行挂载

例子：
```docker
# ...
# 创建文件夹 static
mkdir /static
# 将容器外部的html文件复制到 static中
COPY /html /static
# 创建挂载点
VOLUME /static
```
在运行时通过`-v /somedir:/static`可以覆盖容器中的文件

### EXPOSE
EXPOSE 指令用于声明容器运行时要监听的网络端口号。该指令并不会在容器运行时自动将端口号映射到主机上，而是作为一种文档形式的标记，用于告诉用户哪些端口可以被容器访问。
:::warning 注意
EXPOSE指令并不会自动将容器的端口映射到主机上，如果需要将容器的端口映射到主机上，需要在运行容器时使用 -p 或 --publish 参数指定端口映射规则。同时，也需要确保容器运行的应用程序实际上监听了指定的端口号，否则端口号将无法被访问。
:::

语法：
```sh
EXPOSE <port> [<port>/<protocol>...]
```
其中，`<port>`表示要监听的端口号，可以是1到65535之间的任意整数。如果要监听多个端口号，可以在 EXPOSE 指令中指定多个端口号，每个端口号用空格分隔。如果要监听的端口号是使用 TCP 或 UDP 协议，则可以在端口号后面添加 /tcp 或 /udp 表示协议类型。例如，`EXPOSE 80/tcp` 表示要监听 TCP 协议的 80 端口。

例子：
```docker
FROM nginx
EXPOSE 80/tcp
```
指明该容器运行是会监听容器中的80端口，然后在运行时可以通过`-p`和主机进行端口之间的映射：
```sh
# 将主机的 8088 端口映射到 容器的 80端口，就可以使用 宿主机的 IP:port 方式访问到nginx
docker run -p 8088:80 nginx
```

### CMD
CMD 指令用于指定容器启动时默认要执行的命令。当我们使用`docker run`命令启动容器时，如果没有指定要执行的命令，那么将会执行 CMD 中指定的命令。
:::warning 注意
Dockerfile 中只能使用一条 CMD 指令。如果在 Dockerfile 中使用了多个 CMD 指令，只有最后一个 CMD 指令会生效
:::
语法：
```sh
# exec执行
CMD ["executable","param1","param2"]

# 作为 ENTRYPOINT参数
CMD ["param1","param2"]

# shell 执行
CMD command param1 param2
```
CMD支持exec和shell两种写法，使用exec方式可以和[ENTRYPOINT](/fullstack/docker/dockerfile.html#entrypoint)结合并作为其参数使用，强烈建议使用exec方式使用。

例子：
```docker
FROM busybox

# 使用ping localhost 3次后停止
CMD ["ping", "-c", "3", "localhost"]
```
构建镜像：
```sh
docker build -t nginx:CMD --file Dockerfile-CMD .
```
运行容器：容器启动会执行Dockerfile中指定的CMD命令，这里执行`ping localhost`3次后停止
```sh
➜ docker run --rm  nginx:CMD
PING localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.064 ms
64 bytes from 127.0.0.1: seq=1 ttl=64 time=0.198 ms
64 bytes from 127.0.0.1: seq=2 ttl=64 time=0.196 ms

--- localhost ping statistics ---
3 packets transmitted, 3 packets received, 0% packet loss
round-trip min/avg/max = 0.064/0.152/0.198 ms
```
运行容器时提供默认运行的命令来覆盖默认的命令：这里使用`date`命令代替了Dockerfile中CMD的命令
```sh
➜ docker run --rm  nginx:CMD date
Tue Mar 28 07:23:07 UTC 2020
```
:::warning 注意
容器的运行必须提供默认的运行命令，可以运行时提供(CMD/ENTRYPOINT)或者构建时提供，没有默认运行命令则会自动退出，低版本可能会报错
:::
我们去掉以上的`CMD`命令重新构建镜像：
```sh
docker build -t nginx:CMD --file Dockerfile-CMD .
```
然后运行容器：
```sh
➜ docker run --rm  nginx:CMD
```

### ENTRYPOINT
和[CMD](/fullstack/docker/dockerfile.html#cmd)一样ENTRYPOINT命令也是用于指定容器启动时默认要执行的命令，也是只能最后一个生效。若Dockerfile中CMD和ENTRYPOINT都存在，则ENTRYPOINT作为容器的运行命令，CMD将作为ENTRYPOINT的参数；若运行容器时再次指定了CMD的参数，将会覆盖默认的CMD参数，但参数也会追加到ENTRYPOINT作为参数使用。

语法：
```sh
ENTRYPOINT ["executable", "param1", "param2"]
ENTRYPOINT command param1 param2
```
尽管ENTRYPOINT支持两种形式的写法，但是也是强烈建议使用exec形式，避免和CMD参数追加的问题。

若想覆盖Dockerfile中的ENTRYPOINT时，可以在运行容器时通过`--entrypoint`来指定要运行的程序

例子：
```docker
FROM busybox
ENTRYPOINT ["ping"]
CMD ["localhost", "-c", "3"]
```
以上指定容器运行程序为`ping`，CMD作为ENTRYPOINT的参数，整体命令为`ping localhost -c 3`，ping完localhost 3次就会停止

运行容器：
```sh
➜ docker run --rm  nginx:ENTRYPOINT
PING localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.069 ms
64 bytes from 127.0.0.1: seq=1 ttl=64 time=0.256 ms
64 bytes from 127.0.0.1: seq=2 ttl=64 time=0.248 ms

--- localhost ping statistics ---
3 packets transmitted, 3 packets received, 0% packet loss
round-trip min/avg/max = 0.069/0.191/0.256 ms
```
运行时通过传参覆盖掉默认的 CMD，并且会将动态添加的参数追加到 ENTRYPOINT：这里改为ping qq.com 1次就停止
```sh
➜ docker run --rm  nginx:ENTRYPOINT qq.com -c 1
PING qq.com (183.3.226.35): 56 data bytes
64 bytes from 183.3.226.35: seq=0 ttl=127 time=34.314 ms

--- qq.com ping statistics ---
1 packets transmitted, 1 packets received, 0% packet loss
round-trip min/avg/max = 34.314/34.314/34.314 ms
```
通过运行容器时使用`--entrypoint`替换默认的ENTRYPOINT命令：
```sh
➜ docker run --rm --entrypoint "ls" nginx:ENTRYPOINT -ll
total 16
drwxr-xr-x    2 root     root         12288 Dec 29  2021 bin
drwxr-xr-x    5 root     root           340 Mar 28 10:07 dev
drwxr-xr-x    1 root     root            66 Mar 28 10:07 etc
drwxr-xr-x    2 nobody   nobody           6 Dec 29  2021 home
dr-xr-xr-x  294 root     root             0 Mar 28 10:07 proc
drwx------    2 root     root             6 Dec 29  2021 root
dr-xr-xr-x   12 root     root             0 Mar 28 10:07 sys
drwxrwxrwt    2 root     root             6 Dec 29  2021 tmp
drwxr-xr-x    3 root     root            18 Dec 29  2021 usr
drwxr-xr-x    4 root     root            30 Dec 29  2021 var
```

### ONBUILD
当使用包含 ONBUILD 指令的镜像作为下一个 Dockerfile 的基础镜像时，ONBUILD 指令中的命令将自动执行，并将其结果添加到子镜像中。这样可以在构建镜像时预先处理一些操作，以便在基于该镜像构建更高级别的应用程序时，执行这些操作不必重复编写代码。

语法：
```sh
ONBUILD <INSTRUCTION>
```
例子：
```docker
FROM ubuntu:latest
RUN apt-get update && apt-get install -y python3
WORKDIR /app
ONBUILD COPY . .
ONBUILD RUN pip3 install -r requirements.txt
ONBUILD CMD ["python3", "app.py"]
```
当使用这个镜像作为基础镜像创建一个新的 Dockerfile 时，Docker 将自动复制当前 Dockerfile 目录中的所有文件到新的镜像中，并安装 requirements.txt 中指定的 Python 库。然后，在新的镜像中，CMD 指令将自动运行 Python 应用程序。
假如以上的镜像名为`myimage`，使用其作为基础镜像再次构建新的镜像：
```docker
FROM myimage
EXPOSE 5000
CMD ["python3", "run.py"]
```
在这个 Dockerfile 中，我们使用 myimage 镜像作为基础镜像，并指定了一些额外的操作，例如暴露端口和运行`run.py`文件。由于 myimage 镜像中包含 ONBUILD 指令，因此 Docker 将自动执行 COPY 和 RUN 命令，并安装 requirements.txt 中指定的 Python 库。然后，在新的镜像中，CMD 指令将自动运行 Python 应用程序。

### HEALTHCHECK
指定容器健康检查的方式和频率，以及容器健康检查失败时的行为，Docker 支持多种检查方式，例如 HTTP 接口、TCP 端口、命令行输出等。可以根据应用程序的特点和需求选择适合的健康检查方式。

语法：
```sh
HEALTHCHECK [OPTIONS] CMD command

# 禁止健康检查
HEALTHCHECK NONE
```
例子：
```docker
FROM nginx
HEALTHCHECK --interval=10s --timeout=10s \
  CMD curl -I http://localhost || exit 1
CMD ["nginx", "g", "daemon off;"]
```
在这个 Dockerfile 中，我们使用HEALTHCHECK指令设置了容器健康检查的方式。具体来说，我们使用 curl 命令检查容器中是否能够访问 `http://localhost`，并将检查间隔设置为`10s`，检查超时时间设置为`10s`。如果健康检查失败，则容器将退出。

在运行容器时，可以使用 --health-cmd、--health-interval、--health-timeout 等参数覆盖 Dockerfile 中设置的健康检查参数

⭐️⭐️⭐️⭐️⭐️

到这里关于Dockerfile的语法知识已经讲的差不多了，如果你还需要更多有关Dockerfile语法请阅读[官方文档](https://docs.docker.com/engine/reference/builder/)


## 注意事项
1. 保留字指令必须大写，后面要跟随至少一个参数
2. 指令从上到下执行
3. 每条指令都会创建一个新的镜像层并对镜像进行提交
4. docker会对前面相同的步骤进行构建缓存

## 构建上下文
Dockerfile 的构建上下文（Build Context）是指在构建 Docker 镜像时，Docker 引擎需要读取的文件和目录的集合。

构建上下文通过`docker build`命令的`-f`和 `.` 参数指定。其中，`-f` 参数用于指定 Dockerfile 文件的路径，`.` 参数用于指定构建上下文的路径。例如，下面是一个使用 docker build 命令构建 Docker 镜像的示例：
```sh
docker build -f Dockerfile -t myimage .
```
在这个命令中，我们使用 `-f` 参数指定 Dockerfile 文件的路径为当前目录下的 Dockerfile 文件，使用 `.` 参数指定构建上下文的路径为当前目录。Docker引擎将读取当前目录下的所有文件和目录，并根据 Dockerfile 文件中的指令构建 Docker 镜像。

需要注意的是，构建上下文中包含的所有文件和目录都会被上传到 Docker 引擎中进行构建。因此，构建上下文的大小会直接影响构建时间和构建过程中网络传输的数据量。建议使用`.dockerignore`将构建上下文限制在必要的文件和目录范围内，避免上传无用文件和目录，以提高构建效率。

## 镜像构建
:::warning 注意
规定在Dockerfile中第一条指令必须是`FROM`，作为制作镜像的最基础的镜像层，基础镜像可以是空镜像如：scratch 镜像
:::
上下文、错误细节

## 多阶段构建

## dockerignore

## 构建NodeJS

## 构建优化

## 参考文档

## 总结









