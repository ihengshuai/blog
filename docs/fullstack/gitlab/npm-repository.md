---
title: Gitlab搭建npm仓库
description: 如何使用Gitlab搭建npm仓库,通过以下这些步骤帮你快速搭建
head:
  - - meta
    - name: keywords
      content: npm私有仓库,搭建npm仓库,gitlab仓库,gitlab搭建npm仓库
  - - meta
    - name: og:description
      content: 如何使用Gitlab搭建npm仓库,通过以下这些步骤帮你快速搭建
  - - meta
    - name: og:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-npm.png
  - - meta
    - name: twitter:description
      content: 如何使用Gitlab搭建npm仓库,通过以下这些步骤帮你快速搭建
  - - meta
    - name: twitter:image
      content: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-npm.png
---

# Gitlab搭建npm仓库

:::warning
使用gitlab的仓库注册表特性需要版本`14.0+`，如果你的版本比较低，请先根据自己的需求合理升级后再使用
:::

npm私有仓库的搭建方式有很多种，比如使用[docker(阅读此篇)](/fullstack/docker/npm-repository.html)，这里讲述如何使用gitlab作为npm仓库方法，gitlab仓库有多种使用方法，这里都会讲解到。接下来就来学习下如何使用gitlab搭建npm仓库。
## 创建组与项目
为了方便演示这里从头讲起，分别创建组、项目

1. 创建组
   ![image-20230321112321027](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321112321027.png)
2. 创建项目
   ![image-20230321112503456](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321112503456.png)
   ![image-20230321112816193](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321112816193.png)

## 初始化项目

本地创建一个简单的项目，推送到gitlab项目中

```sh
# 创建路径
mkdir gitlab-frontend-helper-lib && ccd gitlab-frontend-helper-lib

# 初始化 npm
npm init
```

`package.json`文件内容实例：

```json
{
  "name": "helper",
  "version": "0.0.1",
  "description": "前端通用库",
  "main": "index.js",
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

创建`index.js`文件：

```js
const add = (x, y) => x + y;
const minus = (x, y) => x - y;

module.exports = { add, minus };
```

推送项目到gitlab

```sh
git init

cat > .gitignore << EOF
node_modules
.DS_Store
EOF

git add .
git cm -m '初次提交(#0)'
git remote add origin http://192.168.10.10/frontend-lib/helper.git
git push --set-upstream origin main
```

## 项目作为依赖

你可以在某个项目中把刚刚上传的项目作为依赖安装，为了方便管理可以对上传的库打上`tag`，然后项目中可以下载指定tag

```sh
# gitlab-frontend-helper-lib 打tag
git tag 0.0.1
git push --tags
```

新建一个项目使用当前库：

```sh
mkdir gitlab-npm && cd gitlab-npm 

npm init -y
```

手动在`package.json`文件中添加待安装的依赖项目

```json
{
  "name": "gitlab-npm",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    // 这里指定 helper依赖的地址为 git+http://192.168.10.10/frontend-lib/helper.git，并使用 tag 0.0.1版本
    "helper": "git+http://192.168.10.10/frontend-lib/helper.git#0.0.1"
  },
  "description": ""
}
```

安装当前项目依赖：

```sh
➜ npm i
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN use-gitlab-npm@1.0.0 No description
npm WARN use-gitlab-npm@1.0.0 No repository field.

added 1 package in 0.577s
```

验证`helper`包，创建js文件

```js
// index.js
const helper = require("helper");
console.log(helper.add(1, 2));
```

执行打印

```sh
node index.js // 3
```

这种方式的使用比较简单，不过不够灵活，接下来使用gitlab官方的仓库注册表

## Gitlab软件库

[Gitlab支持包仓库注册了](https://docs.gitlab.com/ee/user/packages/npm_registry/)，也及时可以当做包仓库使用，需要版本`14.0+`，这里演示[npm仓库注册表](https://docs.gitlab.com/ee/user/packages/npm_registry/)来管理npm包

### 注册表类型

gitlab支持两种的仓库注册表[项目级别和示例级别(组级别)](https://docs.gitlab.com/ee/user/packages/npm_registry/#naming-convention)，两者对于包的上传没有什么影响，只是作用于包的安装，包的注册表名字是scope形式，也就是说包名是`@scope/packageName`这种形式

- 实例级别：你可以理解为group级别，必须提供一个范围的scope名字，当你需要在不同的组创建包时，可以使用@scope/packageName 引入，你可以为不同的组设置权限，公开使用
- 项目级别：注册表 URL仅针对该范围更新。在项目级别注册包时，您可以使用/附加您自己的唯一范围到您的包名称

### 发布准备

这里修改前面的仓库

```json
// package.json
{
  // 包名
  "name": "@frontend-lib/helper",
  // 包版本
  "version": "0.0.1",
  "description": "前端通用库",
  "main": "index.js",
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

创建`.npmrc`文件：

```sh
#@scope:registry=https://your_domain_name/api/v4/projects/your_project_id/packages/npm/
#//your_domain_name/api/v4/projects/your_project_id/packages/npm/:_authToken="${NPM_TOKEN}"
# 格式:
#  - scope：你的scopename
#  - your_domain_name：你的gitlab域名或ip
#  - your_project_id：你的仓库id
#  - NPM_TOKEN：用户发布的用户token

# 示例
@frontend-lib:registry=http://192.168.10.10/api/v4/projects/4/packages/npm/
# 你可以直接将token写在这里
//192.168.10.10/api/v4/projects/4/packages/npm/:_authToken=HUzUdsos4WfnsgfUBi6j
```

记得忽略掉`.npmrc`追踪：

```sh
# .gitignore
.npmrc
```

## 发布npm包
发布npm包可以手动发布也可以自动构建发布，两种方式都演示下。本次演示项目上传至github了
- https://github.com/ihengshuai/gitlab-practice/tree/main/gitlab-frontend-helper-lib
- https://github.com/ihengshuai/gitlab-practice/tree/main/gitlab-npm

### 手动发布

创建token

![image-20230321124138019](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321124138019.png)

拿到token后将其写入`.npmrc`文件中

```sh
# 如果没有将token写入npmrc，可以用命令行传入
NPM_TOKEN=HUzUdsos4WfnsgfUBi6j npm publish

# 这里写入了npmrc，然后发布
➜ npm publish
npm notice 
npm notice 📦  @frontend-lib/helper@0.0.1
npm notice === Tarball Contents === 
npm notice 94B  index.js    
npm notice 171B package.json
npm notice 15B  README.md   
npm notice === Tarball Details === 
npm notice name:          @frontend-lib/helper                    
npm notice version:       0.0.1                                   
npm notice package size:  369 B                                   
npm notice unpacked size: 280 B                                   
npm notice shasum:        25bcde10511ed5f253bdf2761f86a92d62959847
npm notice integrity:     sha512-0spZZ3DBZZhpM[...]yDmfOTOUq0rqQ==
npm notice total files:   3                                       
npm notice 
+ @frontend-lib/helper@0.0.1
```

可以看到发布成功，并标记是手动发布

![image-20230321124452671](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321124452671.png)

### CI/CD自动构建npm包

以上便是手动发布npm包的整个流程，不过有很多不方便：

- 存储发包token不能忘记
- 手动执行

为了解决这些问题可以使用gitlab ci自动构建发布：

1. 创建ci文件，指定发布到main指定分支时进行发包

   ```yaml
   # .gitlab-ci.yml
   image: node:16-alpine
   
   stages:
    - deploy
   
   deploy_npm:
    stage: deploy
    only:
     - main
    tags:
    - testing
    script:
    - npm config set registry https://registry.npm.taobao.org
    - npm install
    - npm run build
    - echo "@frontend-lib:registry=http://192.168.10.10/api/v4/projects/${CI_PROJECT_ID}/packages/npm/" > .npmrc
    - echo "//192.168.10.10/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${NPM_TOKEN}" >> .npmrc
    - npm publish
   ```

2. 创建换将CI变量`NPM_TOKEN`，将值设置为发包的token

   ![image-20230321134742476](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321134742476.png)

3. 为了防止后续开发可以删除本地`.npmrc`文件

4. 修改版本号提交代码

   ```sh
   # package.json
   # version: 0.0.3
   
   git add .
   git cm -m 'add ci(#0)'
   git push
   ```

5. 查看流水线执行情况
   ![image-20230321135048568](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321135048568.png)

    ![image-20230321135116085](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321135116085.png)

6. 查看仓库，这里我发了两次
   ![image-20230321135219054](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321135219054.png)


## 使用npm包

使用npm包你可以用根端点或项目端点

1. 新建一个项目初始化，创建`.npmrc`文件，根据提示写入仓库地址：
   ![image-20230321140703921](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230321140703921.png)

    ```sh
   @frontend-lib:registry=http://192.168.10.10/api/v4/packages/npm/
   
   # 如果你的项目或组需要权限才能访问就需要添加token
   # //192.168.10.10/api/v4/projects/4/packages/npm/:_authToken=jev-72gFiNtp1JGTLZFn
    ```

    > 这里你可以选择根配置或者项目级别的配置都可以

2. 下载npm包

   ```sh
   npm i @frontend-lib/helper
   
   # 示例
   ➜ npm i @frontend-lib/helper
   npm notice created a lockfile as package-lock.json. You should commit this file.
   npm WARN use-gitlab-npm@1.0.0 No description
   npm WARN use-gitlab-npm@1.0.0 No repository field.
   
   + @frontend-lib/helper@0.0.3
   added 1 package in 0.537s
   
   # 测试代码
   ➜  gitlab-npm node index.js             
   5
   ```
 > 如果你下载失败了如404、401，很大原因是没有权限，通过将项目或组的权限设置public解决，或者提供用户token就可以了

## 参考文档
- https://docs.gitlab.com/ee/user/packages/package_registry/
- https://docs.gitlab.com/ee/user/packages/npm_registry/
- https://docs.gitlab.com/ee/user/packages/yarn_repository/

<Reward />
<Gitalk />