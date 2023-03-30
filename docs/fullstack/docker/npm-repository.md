---
title: 使用Docker搭建npm仓库
description: 使用Docker搭建属于自己的npm私有仓库的完整教程
keywords: npm私有仓库,搭建npm仓库,docker搭建npm仓库
logo: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-npm.png
---

# 使用Docker搭建npm仓库

在公司团队内一般都会拥有私有的工具包或者其他依赖，这些东西又是比较敏感的信息，因此如npm私库的搭建在公司内部必不可少。

:::tip
私库搭建方式有很多，本篇通过`docker+nexus3`的进行搭建。
本人使用ARM架构Centos7.9虚拟机环境进行搭建，请你阅前了解
:::

## 安装docker
docker安装步骤可以参考本人的 [docker安装一文](/fullstack/docker/install-configure.html)

```sh
sudo yum remove docker \
  docker-client \
  docker-client-latest \
  docker-common \
  docker-latest \
  docker-latest-logrotate \
  docker-logrotate \
  docker-engine

sudo yum install -y yum-utils
sudo yum-config-manager \
    --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 查看可安装的docker版本
sudo yum list docker-ce --showduplicates | sort -r

sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动docker
sudo systemctl start docker
```

## 安装nexus3

1. 这里采用宿主机卷映射，先创建nexus配置卷

   ```sh
   mkdir -p /srv/nexus
   
   # 授权
   chown -R 200 /srv/nexus
   ```

2. 下载镜像并运行

   这里本人是在arm架构的Centos上安装的，需要支持arm架构的nexus镜像，由于官方镜像没有提供支持arm架构的镜像，这里选择了别人编译好的支持[arm架构的镜像](https://hub.docker.com/r/klo2k/nexus3)，你可以选择非arm架构的[官方镜像](https://hub.docker.com/search?q=nexus3)

   ```sh
   # 启动nexus3容器，会从远程拉取镜像
   docker pull klo2k/nexus3 # arm架构
   
   # 运行容器
   docker run -d --name nexus3 --restart=always \
       -p 8081:8081 \
       -p 8000-8010:8000-8010 \
       -v /srv/nexus:/nexus-data \
       klo2k/nexus3
   ```

   nexus内部默认会使用`8001`作为http访问的端口，把它映射到主机上，然后再暴露一个端口范围供后续其他使用

3. 运行后根据机器配置一般需要等待一段时间，你可以查看其运行日志：

   ```sh
   docker logs -f nexus3
   ```


## 初始密码

nexus的默认账户为`admin`，初始密码在容器内`/nexus-data/admin.password`文件中，如果你进行了卷挂载也可以在宿主机卷中查看

```sh
# 进入容器查看admin密码
docker exec nexus3 cat /nexus-data/admin.password
b75981d3-affe-45f1-ba6f-10046b8bc4b9

# 挂载了数据卷可以进行本地查看
cat /srv/nexus/admin.password
```

## 访问nexus3

访问地址为`YourIP:PORT`如localhost:8081，用初始账号密码进行登录，*admin/xxxxx* ，初次进入后可以修改密码

![nexus1](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/nexus1.png)

基本面板左侧可以查找对应的仓库包文件，Brower菜单进入可以看到对应的仓库

![image-20230320162008106](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320162008106.png)

![image-20230320162051975](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320162051975.png)

上面的设置按钮需要有权限才可以看到，当前admin用户，可以看到，你也可以创建其他用户并分配适当的权限，所有的仓库储存、角色权限等操作都在设置面板里配置。

通常我们只需要关注下图红框中的配置即可

![image-20230320162812212](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320162812212.png)

## 创建存储集

创建数据存储单元集用来存放数据，你可以将Blob store理解为存储文件的地方，repository相当于数据库用来映射文件路径。

为什么要创建Blob Store呢？当你创建了某个blobstore就会某个关联的repository的内容存储到这里，你可以创建多个blobstore关联多个repository，这样就防止了数据的污染。

点击左侧菜单Blob Stores ，然后点击右侧 Create Blob Store 按钮

![image-20230320163655564](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320163655564.png)

然后创建页面先选择数据类型，这里选择 File 类型，然后给数据存储单元命名，最好语义明确如：npm，方便以后查看，都填写后点击保存按钮即可，列表中就会看到刚刚创建的存储单元集合

![image-20230320163718336](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320163718336.png)

## 创建仓库

创建仓库关联存储集，点击左侧菜单Repositories ，然后点击右侧 Create Repository 按钮

![image-20230320163852830](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320163852830.png)

然后选择`npm(hosted)`，这里你会看到有hosted、proxy、group三类npm仓库，三者区别后面会讲。

进入创建仓库配置页面，如下，需要填写仓库名称、存储集、发布策略

![image-20230320164334735](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320164334735.png)

注意以下几点：

- 同一类型的仓库名需要唯一，防止和旧的仓库重名
- 储存集选择你前面创建的存储集，如npm
- 发布策略中包含集中策略：根据你的需求设置，这里选择允许重发
  - 允许重发
  - 禁止重发
  - 只读
  - 通过复制发布（不推荐）
    > 来自官方的解释：If you are using [replication](https://help.sonatype.com/repomanager3/nexus-repository-administration/repository-management/repository-replication-(legacy)), this policy is automatically set to *Deploy by Replication Only.* This will block all deployment to the hosted repository except by the internal replication mechanism. You should not manually set this policy to *Deploy by Replication Only*. If you disable replication, Nexus Repository automatically restores your previous deployment policy.

最后点击创建仓库按钮，就可以在仓库列表中找到刚刚创建的仓库了

![image-20230320165149705](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320165149705.png)

点击`copy按钮`查看仓库地址

![image-20230320165406279](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320165406279.png)

## 创建角色

前面npm-hosted创建好后，其实就可以上传自己的npm包到这个仓库了，一般不会使用系统账户进行登录发包，所以需要创建新的用户并授权npm相关权限，因此需要创建对应的角色和权限

点击左侧`Roles`菜单栏，在右侧面板点击创建角色，填写对应的角色名、id、描述等（仍然推荐语义明确）

![image-20230320165944937](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320165944937.png)

然后选择对应的权限，搜索npm，点击`Transfer All`将所有加入右侧列表

![image-20230320170145483](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320170145483.png)

如果你有还需要其他权限可以自行添加，这里讲下除了可以选择权限外，也可以选择已经存在的角色，这样也会拥有其权限，效果一样

![image-20230320170353059](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320170353059.png)

最后点击保存

## 创建用户

有了角色就可以创建用户关联此角色了，点击左侧Users菜单，在右侧面板中点击创建用户

![image-20230320170654757](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320170654757.png)

- 用户ID：用来登录npm的用户名
- Firstname：显示名字，随意填
- Lastname：随意填
- Email：可以随意填
- password：你的密码
- status：用户状态，选择active

:::warning
以上红框中需要重视其他可以随意填
:::

接着关联角色，将刚刚创建的角色移入右侧，点击创建

![image-20230320171019351](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320171019351.png)

## 权限认证

有了相关的角色后，需要对一些权限添加认证，也就是需要登录认证，才可以进行操作

点击左侧`Realms`菜单，将你需要认证的权限移入右侧，点击保存

![image-20230320171459435](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320171459435.png)

## 发布npm包

1. 本地使用npm初始化创建一个项目

   ```sh
   npm init -y
   ```

   这里package.json文件内容如下，主文件为`index.js`

   ```json
   {
     "name": "test-deploy",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "scripts": {
     },
     "keywords": [],
     "author": "",
     "license": "ISC"
   }
   ```

2. 简单创建一个`index.js`文件：

   ```js
   const add = (x, y) => x + y;
   
   module.exports = {
     add
   }
   ```

3. 设置npm仓库，你可以使用`npm config set registry xxxx` 创建，这里推荐在项目创建`.npmrc`文件

   ```sh
   # 地址改为自己 npm-hosted 仓库地址
   registry=http://192.168.10.10:8081/repository/npm-hosted/
   ```

   或者在`package.json`中添加：

   ```json
   "publishConfig": {
       "registry": "http://192.168.10.10:8081/repository/npm-hosted/"
    }
   ```

   ![image-20230320172745102](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320172745102.png)

4. 登录并发布

   ```sh
   # 使用创建的用户登录
   npm login
   ```

   ![image-20230320173208309](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320173208309.png)

   ```sh
   # 发布
   npm publish
   ```

   ![image-20230320173258611](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320173258611.png)

5. 在仓库中查看

   ![image-20230320173512796](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320173512796.png)

   ![image-20230320173424057](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320173424057.png)

## 验证npm包

在一个新项目中安装上传的npm包，注意如果你没有设置npm全局仓库配置，需要创建`.npmrc`添加npm仓库

![image-20230320174205932](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320174205932.png)

可以看到安装成功，接着创建`index.js`文件并引用里面的`add`方法

```js
// index.js
const { add } = require('test-deploy');
console.log(add(1,2));
```

![image-20230320174525384](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320174525384.png)

可以看到运行成功

这里有一个坑，之所以安装成功，是因为我们的库中没有依赖其他的npm包，如果有依赖私有仓库没有的npm包，这里安装时就会报错，我们复现下：

重新在我们的npm包里安装一个私有仓库没有的依赖，这里安装`day`，注意需要先把`.npmrc`中的仓库注释掉，这样可以从官方的`npm`仓库中下载

```sh
# test-deploy 中安装 day
➜ devops test-deploy npm install day
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN test-deploy@1.0.0 No description
npm WARN test-deploy@1.0.0 No repository field.

+ day@0.0.2
added 1 package from 1 contributor and audited 1 package in 1.57s
found 0 vulnerabilities
```

修改版本号：

```json
{
  "name": "test-deploy",
  "version": "1.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {},
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "day": "0.0.2"
  }
}
```

重新发布：注意`.npmrc`添加仓库地址

```sh
➜ devops test-deploy npm publish
npm notice
npm notice 📦  test-deploy@1.0.1
npm notice === Tarball Contents ===
npm notice 56B  index.js
npm notice 208B package.json
npm notice === Tarball Details ===
npm notice name:          test-deploy
npm notice version:       1.0.1
npm notice package size:  305 B
npm notice unpacked size: 264 B
npm notice shasum:        47437424c9652266929c74a9870e54c0fb0db253
npm notice integrity:     sha512-zU8+K0q2vJWgD[...]NSzuMA5PKURmw==
npm notice total files:   2
npm notice
+ test-deploy@1.0.1
```

在另一个项目中重新安装我们的包：

```sh
➜ devops use-npm-package rm -rf node_modules package-lock.json
➜ devops use-npm-package npm i
npm ERR! code E404
npm ERR! 404 Not Found - GET http://192.168.10.10:8081/repository/npm-hosted/day - Package 'day' not found
npm ERR! 404
npm ERR! 404  'day@0.0.2' is not in the npm registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404 It was specified as a dependency of 'test-deploy'
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
```

发现安装失败，说`npm ERR! 404 Not Found - GET http://192.168.10.10:8081/repository/npm-hosted/day - Package 'day' not found`，也就是在我们的私有仓库中找不到`day`npm包，其实npm下载时，也会下载包的依赖，所以会造成这种现象。接下来介绍`proxy、group`两种类型的仓库

## proxy和group仓库

nexus3准备了3种仓库类型：

- hosted：本地存储仓库，说白了就是用nexus托管存储包的仓库
- proxy：代理仓库，可以代理到其他仓库，如npm官方仓库、淘宝仓库
- group：组合多个仓库为一个地址

了解了这几种仓库类型，就可以解决上面的问题了，通过proxy代理其他的仓库，然后使用group关联hosted和proxy，这样在安装包文件时对于私库不存在的包就会代理到其他仓库下载

### 创建proxy

![image-20230320182138263](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320182138263.png)

选择存储集为npm，点击创建

![image-20230320182220009](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320182220009.png)

### 创建group

创建仓库选择`npm(group)`，选择存储集，将`npm(hosted)`和`npm(proxy)`选中移入右侧后创建

![image-20230320182346688](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230320182346688.png)

这样就可以使用`npm(group)`的地址作为npm私库地址了

:::warning
需要注意的是，右侧的顺序有优先级，当多个仓库都有同一个包时，优先下载第一个仓库的包
:::

### 验证私库

需要注意的是发布包到`npm-group`是个付费功能😂，你可以发布包的时候用`npm-hosted`地址，安装包时用`npm-group`

修改`.npmrc`为你的group地址

```sh
# .npmrc
registry=http://192.168.10.10:8081/repository/npm-group/

# hosted也行，重新拉取
registry=http://192.168.10.10:8081/repository/npm-hosted/
```

重新安装，查看day也被成功安装了

```sh
➜ devops use-npm-package npm i
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN use-npm-package@1.0.0 No description
npm WARN use-npm-package@1.0.0 No repository field.

added 2 packages from 1 contributor in 0.108s
➜ devops use-npm-package tree -a
.
├── index.js
├── node_modules
│   ├── day
│   │   ├── day.js
│   │   ├── package.json
│   │   └── readme.md
│   └── test-deploy
│       ├── index.js
│       └── package.json
├── .npmrc
├── package.json
└── package-lock.json

3 directories, 9 files
➜ devops use-npm-package node index.js
3
```

## 打标签

```sh
npm version 1.0.1

# 没有指定标签，默认为latest
npm publish --tag beta

# 查看包信息
npm info packageName

# 示例
➜ devops test-deploy npm info test-deploy

test-deploy@1.0.3 | ISC | deps: 1 | versions: 6

dist
.tarball: http://192.168.10.10:8081/repository/npm-hosted/test-deploy/-/test-deploy-1.0.3.tgz
.shasum: e2dde05711a25e6c9df33567ae205f603eeeaead
.integrity: sha512-3pNZUUkDsupK7F0gzGWQXh4rFpZVvfHs+6brPKmA9oxnSyYbmb0L9NDH5+BW2iBRGYgS91UXwOQWiJJHgfo9cg==

dependencies:
day: 0.0.2

dist-tags:
beta: 1.0.3    latest: 1.0.3

published 5 minutes ago
```

不断更新中...

<Reward />
<Gitalk />
