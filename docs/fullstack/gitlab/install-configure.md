---
title: GitLab安装与配置
description: 一篇gitlab完整的安装教程教你玩转gitlab
keywords: gitlab,流水线,CI/CD,自动化构建
logo: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-gitlab.png
---

# GitLab安装与配置

:::tip 提示
本篇以gitlab 14.16.0 版本为教程，其它版本大同小异，官方文档：https://docs.gitlab.com/ee
:::

## docker安装

> 对于gitlab的安装本人都是在arm架构Centos7.9虚拟机上进行的，请悉知本人安装环境，或者与本人的环境保持一致，以便产生不必要的疑惑。

这里使用docker安装，机器上需要先安装docker，此处不再赘述。

https://docs.gitlab.com/ee/install/docker.html

https://docs.gitlab.com/runner/install/docker.html

```sh
# arm架构镜像(如果你也是arm架构，可以使用此镜像)
docker pull yrzr/gitlab-ce-arm64v8

# 最新版amd架构(非arm架构)
docker pull gitlab/gitlab-ee
```

配置并启动

```bash
# 下载好后使用docker engine 运行gitlab
sudo docker run -d \
  --hostname gitlab.ihengshuai.com \
  --publish 443:443 --publish 80:80 --publish 8422:22 \
  --name gitlab \
	--restart always \
  -v /srv/gitlab/config:/etc/gitlab \
  -v /srv/gitlab/logs:/var/log/gitlab \
  -v /srv/gitlab/data:/var/opt/gitlab \
  --shm-size 512m \
  yrzr/gitlab-ce-arm64v8
  
# IP
sudo docker run -d \
  --hostname 192.168.10.10 \
  --publish 443:443 --publish 80:80 --publish 8422:22 \
  --name gitlab \
	--restart always \
  -v /srv/gitlab/config:/etc/gitlab \
  -v /srv/gitlab/logs:/var/log/gitlab \
  -v /srv/gitlab/data:/var/opt/gitlab \
  --shm-size 512m \
  yrzr/gitlab-ce-arm64v8
```

### 命令式

1. 首先创建挂载卷

   ```sh
   mkdir -p /srv/gitlab
   cd /srv/gitlab && mkdir config data logs
   ```

2. 运行gitlab容器

   ```sh
   sudo docker run -d \
     --hostname 192.168.10.10 \
     -p 443:443 --publish 80:80 --publish 8422:22 \
     --name gitlab \
   	--restart always \
     -v /srv/gitlab/config:/etc/gitlab \
     -v /srv/gitlab/logs:/var/log/gitlab \
     -v /srv/gitlab/data:/var/opt/gitlab \
     --shm-size 512m \
     yrzr/gitlab-ce-arm64v8
   ```

相关参数说明：

- `hostname`：指定gitlab的ip地址，用于浏览器的访问（域名访问看后面），这里指定虚拟的ip`192.168.10.10`
- `-p`：暴露gitlab的`http`、`https`、`ssh`端口，这里http使用主机的80端口，需要注意主机是否占用80端口；https使用主机443端口，同样注意端口占用；由于虚拟机占用了ssh端口22，这里使用8422端口作为gitlab的ssh端口
- `-v`：挂载gitlab的相关配置到主机，方便修改配置

当执行上面命令后，根据自己机器的配置等待一段时间，便会启动成功，你可以查看启动日志：

```sh
docker logs -f gitlab
```

通常出现以下情况启动成功：

![image-20230316181606466](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230316181606466.png)

浏览器进行访问：

![image-20230319160426583](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230319160426583.png)

默认账户是`root`，密码可以从下文得知

### 配置文件安装

此方式使用`docker-compose`配置文件安装，你可以根据自己的需求来选择安装方式，相关配置参数此处不做解释。

```yaml
version: '3.6'
services:
  web:
    image: 'yrzr/gitlab-ce-arm64v8'
    restart: always
    hostname: '192.168.10.10'
    ports:
      - '80:80'
      - '443:443'
      - '8422:22'
    volumes:
      - '/srv/gitlab/config:/etc/gitlab'
      - '/srv/gitlab/logs:/var/log/gitlab'
      - '/srv/gitlab/data:/var/opt/gitlab'
    shm_size: '256m'
```

然后运行此配置文件

```sh
docker compose -d up .
```

后续内容同上

### 密码

在gitlab搭建好后，需要查看root账户的初始密码，当一些密码忘记后，也可以重置密码

1. 查看root初始

   ```sh
   # 查看root初始密码
   sudo docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
   ```

​		其实gitlab的初始密码就存储在`/etc/gitlab/initial_root_password`这个文件里，由于我们挂载了卷，你也可以在宿主机上查看。

2. 重置密码，这里以root账户为例，修改数据库重置（实际情况对于root账户没忘的话，可以用root账户重置其它账户的密码）

   ```sh
   # https://docs.gitlab.cn/jh/security/reset_user_password.html
   # 进入gitlab容器中
   docker exec -it gitlab bash
   
   # 使用gitlab-rails
   gitlab-rails console -e production
   
   # id为1的是root
   user = User.where(id: 1).first
   user.password = 'xxxxx'
   user.password_confirmation = 'xxxx'
   user.save
   
   # 保存退出后，如果登不上，则需要重载配置
   ```

### 域名与证书

gitlab除了可以使用ip地址外，也可以自定义域名，也可以使用https，并认证自签证书，整个过程主要分为以下步骤：

- 添加域名：可以使用本机DNS映射域名
- 使用https：可选，如果你需要https
- 配置证书：可选，如果你启用了https，需要提供证书，你可以使用自签证书并信任
- 重载配置

以上相关配置都是在gitlab.rb配置文件中修改的，你可以在宿主机的` /srv/gitlab/config/gitlab.rb`文件中进行修改，或进入容器中修改`/etc/gitlab/config/gitlab.rb`，二者是等价的。

#### 配置域名

```ruby
# vim /srv/gitlab/config/gitlab.rb

# 使用域名 https://gitlab.ihengshuai.com （这里使用了https），域名自行修改
external_url 'https://gitlab.ihengshuai.com'
```

在你的主机上添加HOST记录，进行映射

```sh
# vim /etc/hosts

192.168.10.10 gitlab.ihengshuai.com
```

#### 开启https

```toml
# vim /srv/gitlab/config/gitlab.rb

nginx['client_max_body_size'] = '250m'
# 强制HTTPS
nginx['redirect_http_to_https'] = true
nginx['redirect_http_to_https_port'] = 80
```

#### ssl证书配置

当你开启了https需要配置ssl证书（如果没有可以跳过），你可以使用相关云厂商（阿里云、腾讯云...）提供的免费证书，也可以自签证书。

1. 生成证书，下面以[OpenSSL](https://docs.azure.cn/zh-cn/articles/azure-operations-guide/application-gateway/aog-application-gateway-howto-create-self-signed-cert-via-openssl)自签证书为例：

   ```sh
   # 使用OpenSSL签发证书
   # 1. 生成服务器私钥 (domain.com.key)  domain.com 随便起的名字
   openssl genrsa -out domain.key 4096
   
   # 2.生成证书签名请求(CSR) domain.com.csr
   # 生成 CSR 的过程中，会提示输入一些信息，其中一个提示是 Common Name (e.g. YOUR name)，
   # 这个非常重要，这一项应填入 FQDN(Fully Qualified Domain Name)完全合格域名/全称域名，
   # 如果您使用 SSL 加密保护网络服务器和客户端之间的数据流，
   # 举例被保护的网站是 https://test.chinacloudsites.cn，
   # 那么此处 Common Name 应输入 test.chinacloudsites.cn
   openssl req -new -key domain.key -out domain.csr
   
   # 3.使用上一步的证书签名请求签发证书
   openssl x509 -req -days 365 -in domain.csr -signkey domain.key -out domain.crt
   ```

   将以上的domain替换成你想都要的域名如：gitlab.example.com

   这里我写成了一个脚本：

   ```sh
   # auto-cetificate.sh
   #!/bin/bash
   echo "请使用sudo运行以获取系统权限!"
   echo "请输入域名："
   
   read userdomain
   
   # 啥都不输退出
   if [ ! "$userdomain" ]; then
       exit
   fi
   
   openssl genrsa -out $userdomain.key 4096
   
   openssl req -new -key $userdomain.key -out $userdomain.csr
   
   openssl x509 -req -days 365 -in $userdomain.csr -signkey $userdomain.key -out $userdomain.crt
   
   echo
   echo "Generate success!"
   echo
   
   # 将本地域名写入host
   echo 需要将域名写入host吗[yes/no]?
   read confirm_read_host
   if [ "$confirm_read_host" != "yes" ]; then
       exit
   fi
   
   echo 需要保持和证书域名相同不[yes/no]?
   read confirm_write_host
   if [ "$confirm_write_host" == "no" ]; then
       echo 请填写待写入host的域名
       read custom_host_domain
       cp /etc/hosts /etc/hosts.old
       echo "127.0.0.1 $custom_host_domain" >>/etc/hosts
       exit
   fi
   
   cp /etc/hosts /etc/hosts.old
   echo "127.0.0.1 $userdomain" >>/etc/hosts
   echo "Write success!"
   sleep 1
   ```

   当创建完以上文件后，需要将其加权限，然后执行脚本即可：

   ```sh
   chmod +x ./auto-cetificate.sh
   
   # 执行
   ./auto-cetificate.sh
   ```

   执行后根据提示一步一步填写相关内容

2. 配置证书

   ```sh
   # vim /srv/gitlab/config/gitlab.rb
   
   # https证书
   nginx['ssl_certificate'] = "/etc/gitlab/ssl/domain.crt"
   nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/domain.key"
   # 用默认
   nginx['ssl_ciphers'] = xxx
   
   # 需要关闭这个
   letsencrypt['enable'] = false
   ```

   这里的`domain`改为你自己生成的域名，以上需要使用`.key和.crt`两个文件，你可以把相关文件移至`/srv/gitlab/ssl`，这里容器中gitlab的位置为`/etc/gitlab/ssl`

当以上工作都做好了，**需要重启加载配置并重新启动便会配置成功**（这里可以看下一小节）

最后使用https和域名访问，由于自签证书不安全，你需要忽略安全提示即可

![image-20230319165605394](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230319165605394.png)

![image-20230319165636779](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230319165636779.png)

至此https配置成功了

### 配置重载

重载配置有两种：在外部直接docker restart和进入容器中使用gitlab-ctl进行重新启动

1. 外部重启

   ```sh
   docker restart gitlab
   ```

2. 进入容器中

   ```sh
   # 进入容器
   docker exec -it gitlab bash
   
   # 1.使用gitlab-ctl重启加载配置
   gitlab-ctl reconfigure
   #日志...
   		(up to date)
   Recipe: gitlab::gitlab-rails
     * execute[clear the gitlab-rails cache] action run
       - execute /opt/gitlab/bin/gitlab-rake cache:clear
   Recipe: nginx::enable
     * runit_service[nginx] action restart (up to date)
   Recipe: monitoring::grafana
     * runit_service[grafana] action restart (up to date)
   
   Running handlers:
   Running handlers complete
   Chef Infra Client finished, 9/735 resources updated in 20 seconds
   gitlab Reconfigured!
   
   # 2.重新启动
   gitlab-ctl restart
   ```

这里推荐使用第二种方式

## Centos安装
这里我的虚拟机为Centos7.9 arm架构系列

后续更新...


<Reward />
<Gitalk />

