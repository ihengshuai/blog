---
title: Gitlab Runner安装与配置
description: 一篇gitlab runner完整的安装与注册配置教程
head:
  - - meta
    - name: keywords
      content: gitlab-runner,runner注册,流水线,CI/CD,自动化构建
  - - meta
    - property: og:description
      content: 一篇gitlab runner完整的安装与注册配置教程
  - - meta
    - property: og:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-gitlab.png
  - - meta
    - name: twitter:description
      content: 一篇gitlab runner完整的安装与注册配置教程
  - - meta
    - name: twitter:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-gitlab.png
---

# Gitlab Runner安装与配置

本篇使用[docker(点击查看安装文档)](https://docs.gitlab.com/runner/install/docker.html)进行runner的安装和注册，其他方式请[浏览相关文档](https://docs.gitlab.com/runner/install/)

> 请确保runner版本和gitlab版本兼容以及docker相关版本兼容问题

## 下载镜像

```sh
docker pull gitlab/gitlab-runner:v14.6.0
```
## 创建挂载卷

```sh
mkdir -p /srv/gitlab-runner
cd /srv/gitlab-runner && mkdir config certs

# 将gitlab的域名正式复制到 certs 中
```

## 运行runner

```sh
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /srv/gitlab-runner/certs:/etc/gitlab-runner/certs \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc/hosts:/etc/hosts \
  gitlab/gitlab-runner:v14.6.0
```

如果你的gitlab使用的了本地域名和自签证书，这里进行域名和hosts进行挂载

## 注册runner

runner注册文档地址 https://docs.gitlab.com/runner/register/index.html#docker，可以通过交互式和非交互式注册。注册runner需要runner的token，token用来连接gitlab和runner

### 注册token

Gitlab runner的注册token需要从gitlab中获取，token可以从具体项目中获取也可以从gitlab全局获取

如这里是web1项目的runner token

![image-20230319175134576](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230319175134576.png)

你可以联系root账户创建group的runner或admin全局的runner

![image-20230319175359461](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230319175359461.png)

### 交互式注册

```sh
# 方式1
docker run --rm -it -v /srv/gitlab-runner/config:/etc/gitlab-runner gitlab/gitlab-runner:v14.6.0 register

# 方式2
# 进入 gitlab-runner
docker exec -it gitlab-runner bash
> gitlab-runner -h
# 注册runner
> gitlab-runner register # 交互式注册看下方图
```

执行以上命令会进入runner镜像内部交互式进行注册

### 非交互式

```sh
# 如果你的gitlab使用http + ip形式
docker run --rm \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /etc/hosts:/etc/hosts \
  gitlab/gitlab-runner:v14.6.0 register \
  --non-interactive \
  --executor "docker" \
  --docker-image alpine:latest \
  --url "http://192.168.10.10" \
  --registration-token "-_d2uxhfknTiFxm9oKs1" \
  --description "admin register runner" \
  --tag-list "admin" \
  --run-untagged="true" \
  --locked="false" 
  
# 如果你的gitlab使用https，需要进行证书认证
docker run --rm \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /etc/hosts:/etc/hosts \
  gitlab/gitlab-runner:v14.6.0 register \
  --non-interactive \
  --executor "docker" \
  --docker-image alpine:latest \
  --url "https://gitlab.ihengshuai.com" \
  --registration-token "Gitlab Runner Token" \
  --description "testing docker-runner" \
  --tls-ca-file /etc/gitlab-runner/certs/gitlab.ihengshuai.com.crt \
  --tag-list "testing" \
  --run-untagged="true" \
  --locked="false"  
```

这里执行非交互命令：注册成功

```sh
➜ devops ~ docker run --rm \
>   -v /srv/gitlab-runner/config:/etc/gitlab-runner \
>   -v /etc/hosts:/etc/hosts \
>   gitlab/gitlab-runner:v14.6.0 register \
>   --non-interactive \
>   --executor "docker" \
>   --docker-image alpine:latest \
>   --url "http://192.168.10.10" \
>   --registration-token "-_d2uxhfknTiFxm9oKs1" \
>   --description "admin register runner" \
>   --tag-list "admin" \
>   --run-untagged="true" \
>   --locked="false"
Runtime platform                                    arch=arm64 os=linux pid=7 revision=5316d4ac version=14.6.0
Running in system-mode.

Registering runner... succeeded                     runner=-_d2uxhf
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```

### 参数说明

- `non-interactive`：不需要交互
- `executor`：runner执行器，有很多，这里选择docker
- `docker-image`：runner基础镜像
- `url`：指定gitlab的地址，根据gitlab的配置地址填写
- `registration-token`：runner注册token，项目、admin、group的token都可以
- `description`：runner相关描述
- `tag-list`：runner的标签，可以指定多个，流水线运行时可以通过runner标签指定runner运行，如果你忘记填写，可以在注册后修改
- `tls-ca-file`：如果你使用了https且使用了自签证书，需要指定证书使runner信任此证书（ https://docs.gitlab.com/runner/install/docker.html#installing-trusted-ssl-server-certificates）
- `run-untagged`：如果流水线的作业没指定tag也可以用此runner运行
- `locked`：关闭锁定，默认情况下runner注册后都是锁定状态，不可以执行，需要在后台打开，这里直接注册时打开

## 配置文件

gitlab runner在注册后会生成对应的配置文件`/srv/gitlab-runner/config/config.toml`（挂载目录），容器位置在`/etc/gitlab-runner/config.toml`

```toml
# 同时可以运行几个runner
concurrent = 2

# 检查间隔，3s内检查代码变动就会执行runner
check_interval = 3

[session_server]
  session_timeout = 1800

# 注册的runner，每注册一个，就会多一份 [[runners]] 配置
[[runners]]
  # runner 描述
  name = "testing docker-runner"
  # gitlab 地址
  url = "http://192.168.10.10"
  # 注册token
  token = "iz1PoRca5ZD5gV1uydX4"
  # ssl证书位置
  tls-ca-file = "/srv/gitlab-runner/config/ssl/gitlab.ihengshuai.com.crt"
  # runner执行器
  executor = "docker"
  [runners.custom_build_dir]
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
    [runners.cache.azure]
  [runners.docker]
    tls_verify = false
    # docker执行器的基础镜像
    image = "alpine:latest"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    # 镜像拉取策略，流水线过程中如果某个已经在本地了，就不会再拉取了，直接使用本地镜像
    pull_policy = "if-not-present"
    # runner缓存，在docker中使用docker执行器，需要映射宿主机的docker.socket
    volumes = ["/cache", "/var/run/docker.sock:/var/run/docker.sock"]
    shm_size = 0
    
# [[runners]]
# ....
```

## 配置重载

当你更改了runner的配置文件后，你需要重新加载配置文件，你可以使用一下方式：

```sh
docker restart gitlab-runner

# 或进入容器
docker exec -it gitlab-runner bash
gitlab-runner restart
```

## runner类型

根据runner的使用范围可以将其分为以下几类：

- shared：共享runner，gitlab中的所有项目都可以使用
- group：只有当前组才可以使用
- specific：只有当前项目才可以使用

## runner执行器

gitlab runner由很多可以在不同场景下运行构建的[执行器](https://docs.gitlab.com/runner/executors)

![gitlab-runner-compare](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/gitlab-runner-compare.png)

### Shell 执行器

**Shell** 是最简单的执行器。您的构建所需的所有必须依赖项都需要手动安装在极狐GitLab Runner 所安装的机器上。

### 虚拟机执行器（VirtualBox / Parallels）

这种类型的执行器允许您使用已经创建的虚拟机，它被克隆且用于运行构建。我们提供两个完整的系统虚拟化选项：**VirtualBox** 和 **Parallels**。如果您想在不同操作系统上运行构建，它们很有用，因为它允许在 Windows、Linux、macOS 或 FreeBSD 上创建虚拟机，然后极狐GitLab Runner 连接虚拟机并在上面运行构建。它可以降低基础设施的成本。

### Docker 执行器

https://docs.gitlab.com/runner/executors/docker.html

使用 **Docker** 是个很好的选择，因为它允许使用简单的依赖项管理（所有构建项目所需的依赖项都可以放到 Docker 镜像里）生成干净的构建环境。 Docker 执行器允许您很容易地使用依赖的[服务](https://docs.gitlab.cn/jh/ci/services/index.html)， 例如 MySQL，创建构建环境。

### Docker Machine 执行器

**Docker Machine** 是特殊版本的支持弹性伸缩的 **Docker** 执行器。 它类似正常的 **Docker** 执行器， 但由 *Docker Machine* 按需创建构建主机。

### Kubernetes 执行器

**Kubernetes** 执行器允许您使用您构建现存的 Kubernetes 集群。 执行器会调用 Kubernetes 集群 API 并为每个极狐GitLab CI 作业创建新的 Pod（带有构建容器和服务容器）。

### SSH 执行器

**SSH** 执行器是为执行器介绍完整性而添加进来的，它是所有执行器中最不受支持的一个。 它使极狐GitLab Runner 连接到外部服务器并运行构建。机构有一些使用 SSH 执行器的成功案例，但是通常我们推荐您使用其他类型的执行器。

### 自定义执行器

**自定义**执行器允许您指定您自己的执行环境。当极狐GitLab Runner 不提供执行器（例如，LXC 容器），您可以向极狐GitLab Runner 提供您自己的可执行文件，用以部署和清理任何您想使用的环境。



<Reward />
<Gitalk />