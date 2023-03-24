---
title: 搭建docker私有仓库
description: 使用官方registry或nexus3搭建属于自己的docker私有镜像仓库完整教程
head:
  - - meta
    - name: keywords
      content: docker私有仓库,搭建docker仓库,nexus搭建docker仓库,registry搭建docker仓库
  - - meta
    - property: og:description
      content: 使用官方registry或nexus3搭建属于自己的docker私有镜像仓库完整教程
  - - meta
    - property: og:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
  - - meta
    - name: twitter:description
      content: 使用官方registry或nexus3搭建属于自己的docker私有镜像仓库完整教程
  - - meta
    - name: twitter:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
---

# 搭建docker私有仓库
搭建docker私有仓库也是工作中会遇到的，出于安全策略每个公司都会将自己的镜像存到自己的私有仓库中，本篇将会通过docker官方registry和nexus3两种方式进行私库的搭建。

这两种方式都需要先安装docker，通过docker以容器的形式部署，所以请确保你安装了docker，如果你还没安装或不了解docker，可以先阅读👉🏻[docker章节](/fullstack/docker/install-configure.html)

## 官方registry搭建
官方registry镜像地址[点这里查看](https://hub.docker.com/_/registry)

### 安装registry
1. 创建卷映射文件夹
    ```sh
    mkdir -p /srv/docker-registry
    ```
2. 下载镜像并运行
    ```sh
    # 下载镜像，可以指定具体版本
    docker pull registry:tag

    # 运行
    docker run -d -p 5000:5000 \
      --restart=always \
      -v /srv/docker-registry:/tmp/registry \
      --privileged \
      --name registry registry
    ```
### 使用仓库
1. 推送镜像
    ```sh
    # 找一个镜像，没有可以自己build

    # 更改镜像标签(示例)  localhost为docker仓库的ip，5000 是端口
    docker tag nginx:1.1 localhost:5000/nginx:1.1

    ➜ ~ docker push localhost:5000/nginx:1.15.3
    The push refers to repository [localhost:5000/nginx]
    8707677a5773: Layer already exists
    0aad8cc1e782: Layer already exists
    bb97ae9f0f57: Layer already exists
    1.15.3: digest: sha256:98824065f066d6839af42c512cb672fb0151322fa80fd6dc4019bfa8bd6affae size: 948
    ```
2. 拉取镜像
    ```sh
    docker pull localhost:5000/nginx:1.15.3
    ```
3. 配置仓库ip

   使用宿主机的`ip+port`方式，这里会发现拉取不成功，这是因为docker默认使用`https`的方式进行连接，修改一下配置文件让docker忽略当前地址
    ```sh
    ➜ ~ docker pull 192.168.10.10:7999/nginx:1.15.3
    Error response from daemon: Get "https://192.168.10.10:7999/v2/": dial tcp 192.168.10.10:7999: connect: connection refused
    ```
   编辑`/etc/docker/daemon.json`，没有此文件自行创建：
    ```json
    {
      "registry-mirrors": [
        "https://docker.mirrors.ustc.edu.cn"
      ],
      "insecure-registries": ["192.168.10.10:7999"]
      // ....
    }
    ```
   配置完后要重启后台进程、docker和仓库：
    ```sh
    systemctl daemon-reload
    systemctl restart docker
    docker restart registry
    
    ➜ ~ docker pull 192.168.10.10:5000/nginx:1.15.3
    1.15.3: Pulling from nginx
    Digest: sha256:98824065f066d6839af42c512cb672fb0151322fa80fd6dc4019bfa8bd6affae
    Status: Downloaded newer image for 192.168.10.10:5000/nginx:1.15.3
    192.168.10.10:5000/nginx:1.15.3
    ```
以上便是使用官方registry搭建仓库的步骤，以上并没有使用账户密码，这里没有演示。而我更推荐用其他方式搭建，如接下来的nexus3，有图形化、权限配置更加友好。

## 使用nexus3搭建
使用nexus3你需要先安装，关于docker安装nexus3这里不再做介绍了，如果你看了我的另一篇「[使用docker搭建npm仓库](/fullstack/docker/npm-repository.html#%E5%AE%89%E8%A3%85nexus3)」一文你应该已经安装nexus3了，如果没有安装可以阅读此篇，以下本文都默认安装了nexus3
:::tip
以下对于nexus3的使用不是很详细，如果你发现有些概念不清楚，可以先阅读我的nexus3「[使用docker搭建npm仓库](/fullstack/docker/npm-repository.html#%E5%AE%89%E8%A3%85nexus3)」一文熟悉nexus3的基本使用或者参考其他第三方资料都可以
:::

### 创建存储集
创建存储集来存储我们的docker镜像，使用仓库关联当前存储集
![image-20230322150502893](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322150502893.png)

### 创建仓库
这里会创建hosted、proxy、group三种类型的docker仓库
1. 创建hosted仓库，真正存储我们自己的镜像仓库
![image-20230322150834614](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322150834614.png)
- Repository Connectors：仓库进行连接访问配置，这里配置了http和https两个端口，需要注意的是这两个端口需要处于创建nexus3容器时暴露出一段端口范围内
- Allow anonymous docker pull：允许访客下载镜像，如果你不允许则不用勾选
- 选择存储集docker
- Deployment Policy：根据自己的需求设置发布策略，这里设置允许重新发布相同版本

2. 创建proxy仓库，代理第三方的仓库，这里代理到网易加速地址
![image-20230322151617664](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322151617664.png)

3. 创建group仓库，代理hosted和proxy
![image-20230322151914643](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322151914643.png)

### 配置角色与用户
1. 创建docker角色用来管理docker相关操作，根据自己需求将有关docker的权限移至右侧
![image-20230322152259064](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322152259064.png)

2. 创建用户，有了角色权限后就可以创建对应的用户赋予权限，以后就可以用此用户进行登录私有仓库了
![image-20230322152535767](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322152535767.png)

### 配置Realms
配置realms允许docker相关规则进行授权，如果你允许了游客下载镜像，需要在`Anonymous Access`设置允许访问
![image-20230322152830776](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322152830776.png)

### 登录仓库

1. 登录docker(group)的仓库，注意使用ip和暴露的http端口进行登录，不过docker默认会使用https进行登录，http会视为不安全，需要添加一些配置，编辑`/etc/docker/deamon.json`（没此文件自行创建）：
    ```json
    {
      "registry-mirrors": [
        "https://docker.mirrors.ustc.edu.cn"
      ],
      // 配置这个 不安全的仓库，我这里配置了其他的，按照自己需求进行配置
      "insecure-registries": ["192.168.10.10:8081", "192.168.10.10:8000", "192.168.10.10:8001", "192.168.10.10:7999"],
    }
    ```
2. 重启服务
    ```sh
    systemctl daemon-reload
    systemctl restart docker

    # nexus没启动的需要手动启动
    docker start nexus3
    ```
3. 登录仓库
    ```sh
    ➜ ~ docker login 192.168.10.10:8001
    Username: ihengshuai
    Password:
    WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
    Configure a credential helper to remove this warning. See
    https://docs.docker.com/engine/reference/commandline/login/#credentials-store
    
    Login Succeeded
    ```

### 推送镜像
随便找一个已下载的镜像，并修改成自己仓库的ip和包名：
```sh
# 打tag 写上自己仓库 IP:Port/packageName:version
docker tag nginx:1.15.3 192.168.10.10:8001/myimage:v1

# 发布镜像
➜ ~ docker push 192.168.10.10:8001/myimage:v1
The push refers to repository [192.168.10.10:8001/myimage]
8707677a5773: Layer already exists
0aad8cc1e782: Layer already exists
bb97ae9f0f57: Layer already exists
denied: Deploying to groups is a PRO-licensed feature. See https://links.sonatype.com/product-nexus-repository
```
其实以上可以算是成功步骤，只不过推送镜像到`docker(group)`是付费功能，而`docker(hosted)`是免费的，你可以登录hosted地址推送，使用`docker(group)`进行镜像的下载
```sh
# 登录hosted
docker login 192.168.10.10:8000

# 切换成hosted暴露的http port
docker tag nginx:1.15.3 192.168.10.10:8000/myimage:v1

# 发布镜像
➜ ~ docker push 192.168.10.10:8000/myimage:v1
8707677a5773: Layer already exists
0aad8cc1e782: Layer already exists
bb97ae9f0f57: Layer already exists
v1: digest: sha256:98824065f066d6839af42c512cb672fb0151322fa80fd6dc4019bfa8bd6affae size: 948
```
到这里就发布成功了

### 下载镜像
下载镜像可以使用`docker(group)`的地址，如果下载失败，可能原因是没配置权限，检查一下自己账户的权限
```sh
➜ ~ docker pull 192.168.10.10:8001/myimage:v1
v1: Pulling from myimage
Digest: sha256:98824065f066d6839af42c512cb672fb0151322fa80fd6dc4019bfa8bd6affae
Status: Downloaded newer image for 192.168.10.10:8001/myimage:v1
192.168.10.10:8001/myimage:v1
```

<Reward />
<Gitalk />
