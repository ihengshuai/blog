---
title: 使用DockerCompose部署服务
description: Docker Compose是一种用于定义和运行多个Docker容器应用程序的工具,通过简单的方式来管理多个Docker容器,使得开发人员可以更加专注于应用程序的开发,而不需要关注底层的容器管理细节
keywords: docker-compose,docker集群,docker服务部署,docker镜像,docker网络
logo: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png
---

# 使用DockerCompose部署服务
以前我们总是用命令管理每个容器的启动、停止等等，若有多个容器时可能还存在启动优先级的问题，那就要等到指定的容器启动后再去启动另一个容器，对于整体的应用服务管理极其不方便，简单的`docker run`命令更适合初学者或者调试使用， docker提供`docker compose`来解决多容器部署。

Docker Compose是Docker官方提供的一个工具，它允许用户通过配置文件定义和运行多个 Docker 容器，以便更轻松地管理 Docker 应用程序的部署和运行。Docker Compose 可以让用户在单个主机上运行多个容器，也可以在多个主机上运行同一组容器，并且可以实现容器之间的相互通信和协作。

## 优势
相比启动单个容器，使用docker compose有以下优势：
- 简化多容器应用部署： Docker Compose 可以将多个容器的部署、启动、停止、删除等操作集成到一起，以便简化多容器应用的部署和管理。
- 统一配置管理： Docker Compose 允许用户使用 YAML 文件定义容器的配置，从而实现容器的统一管理。这使得在多容器应用中对于环境变量、网络设置、端口映射等配置的管理更加方便和统一。
- 容器之间的通信： Docker Compose 允许用户自定义容器之间通信的网络，容器之间可以直接通信，方便了应用程序的开发和部署。
- 可重复性和可移植性： 使用 Docker Compose 可以将应用程序的部署过程进行标准化，降低了部署过程中的错误率。同时，Docker Compose 配置文件可以在不同的环境中使用，从而实现应用程序的可移植性。
- 管理多个环境： Docker Compose 可以对不同的环境进行管理，比如开发环境、测试环境和生产环境，从而方便了应用程序的开发和测试。

## 初识DockerCompose
Docker Compose 配置文件是一个 YAML 格式的文件，用于定义多个 Docker 容器的配置和关系。下面是一个简单的 Docker Compose 配置文件示例：
```yaml{9}
version: '3'
services:
  web:
    build:
    	context: .
    	dockerfile: Dockerfile.web
    ports:
      - "8080:80"
    depends_on:
    	- redis
  redis:
    image: "redis:alpine"
```

在这个示例配置文件中，version 字段指定了 Docker Compose 的版本号，services 字段用于定义多个 Docker 容器。在 services 字段中，每个容器都是一个子字段，其键名是容器的名称，其值是一个包含容器配置的键值对。

在示例配置文件中，定义了两个容器 web 和 redis，其中：
1. web 容器使用本地 `Dockerfile.web` 配置文件构建镜像，将容器的 80 端口映射到主机的 8080 端口，<u>其依赖redis的启动后才会启动自己</u>。
2. redis 容器使用 Redis 官方镜像，并使用 Alpine 版本，没有指定其他特殊的配置。

从以上可以看出docker compose是将整个应用的所有容器全部写在了同一个配置文件中，其也会自动管理容器的启动先后顺序，而对于配置文件的管理也更加方便，接下来看下其常用语法。

## 语法
docker compose的配置是个yaml文件，在配置文件中容器将作为服务部署，docker compose帮我们统一管理这些服务，包括镜像、启动顺序、网络、数据卷、端口、重启策略等等。配置中services、networks、volumes等这些都可以在最顶端定义表示需要创建的全局network、volume等等。

### services
在Docker Compose中，services是定义容器的基本单位

语法：
```yaml
services:
  <service_name>:
    <service_config>
```
其中，`<service_name>`是服务名称，可以任意命名，但建议使用有意义的名称。`<service_config>`是服务的配置信息，包含了运行服务所需的所有信息，如镜像、容器名称、端口映射、环境变量等。

例子：
```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
```

### image
services中的每个容器都是一个服务，其都会包含镜像文件。镜像可以指定第三方的，也可以使用本地Dockerfile进行构建

语法：
```yaml
# 省略其他...
<service_config>
  # 使用第三方
  image: nginx:alpine

  # 本地构建
  build:
  	context: .
  	dockerfile: Dockerfile
```
你可以在容器中通过`image`指定第三方的镜像文件，也可以使用`build`来进行本地镜像的构建，`build`可以简写成`build: your dir`不需要指定上下文等等，其默认会使用当前目录下的`Dockerfile`文件进行构建

### ports、networks、volumes
除了容器中的镜像外，其他如：端口、数据卷、网络其实都是类似，并且和直接用`docker run`启动容器时使用差不多

语法：
```yaml
# 省略其他...
<service_config>
  image: nginx:alpine

  # 端口
  ports:
  	- "<host_port>:<container_port>/<protocol>"
  	- "1000"
  	- "8080:80"
  	- "443:443/tcp"

  # 数据卷
  volumes:
  	- myvolume:/etc/data
  	- /root/html:/etc/nginx/html

  # 网络
  networks:
  	- mynetwork

# 定义数据卷
volumes:
	myvolume:

# 定义网络
networks:
	mynetwork:
```
上面展示了端口、数据卷、网络的基本配置：
- 端口：在容器中使用`ports`来定义端口的的映射，语法如上，当仅指定一个端口是`<container_port>`，这种就是告诉外面容器内使用了1000端口，你可以进行映射，实际上并没有和宿主机进行映射而是一种定义，可dockerfile中的expose类似；使用`<host_port>:<container_port>`时前面表示宿主机端口，后者表示容器端口，二者进行映射；除此还支持协议，直接在最后加上`/<protocol>`即可
- 数据卷：容器中使用`volumes`列表进行卷的映射，你可以直接使用宿主机的目录进行映射，也可以使用docker创建的卷，并且你还可以使用没有创建的数据卷，但同时你必须在顶级定义指定的数据卷，这样docker会帮你自动创建数据卷
- 网络：使用网络和数据卷类似，当使用不存在的自定义的网络时，也需要在顶级进行定义

### depends_on
使用depends_on字段来定义容器之间的依赖关系，以确保在启动容器时，必须先启动其所依赖的容器

语法：
```yaml
depends_on:
  - <service_name>
  - <service_name2>
  ...
```
其中，`<service_name>`是所依赖的服务名称，可以是单个服务或多个服务

例子：
```yaml
version: '3'
services:
  db:
    image: mysql
  web:
    image: my-web-app
    depends_on:
      - db
```
在这个示例中，我们定义了两个服务：一个名为db的服务，使用了mysql镜像；一个名为web的服务，使用了自定义的web应用镜像，并在depends_on字段中指定了db服务，表示web服务依赖于db服务。

在启动这个Docker Compose文件时，Docker会先启动db服务，然后再启动web服务，以确保web服务可以连接到db服务并正常运行。

### environment
可以使用environment字段来设置容器中的环境变量，其与`docker run -e`、Dockerfile中定义的`ENV`类似

语法：
```yaml
environment:
  - <key>=<value>
  - <key2>=<value2>
  ...
```
其中，`<key>`是环境变量的名称，`<value>`是环境变量的值。可以设置多个环境变量，每个环境变量之间用-分隔

例子：
```yaml
version: '3'
services:
  web:
    image: my-web-app
    environment:
      MYSQL_HOST: db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
```
在这个示例中，我们定义了一个名为web的服务，使用了自定义的web应用镜像，并设置了三个环境变量：MYSQL_HOST、MYSQL_USER和MYSQL_PASSWORD。这些环境变量可以在容器内部使用，例如在web应用的配置文件中。

需要注意的是，如果在Docker Compose文件中定义了环境变量，而在Dockerfile中也定义了同名的环境变量，那么Docker Compose文件中的环境变量会覆盖Dockerfile中的环境变量。

除此之外还可以使用`.env`文件或命令行参数来设置环境变量。这样可以避免将敏感信息硬编码到Docker Compose文件中
:::warning 注意
Docker Compose文件中定义的环境变量会覆盖.env文件中的同名环境变量
:::

`.env`配置文件示例：
```
MYSQL_HOST=db
MYSQL_USER=user
MYSQL_PASSWORD=password
```
compose文件配置：
```yaml
version: '3'
services:
  web:
    image: my-web-app
    environment:
      MYSQL_HOST: ${MYSQL_HOST}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
```

使用docker-compose命令的`--env-file`参数来指定环境变量文件。

### restart
使用restart字段来定义容器的重启策略，在容器异常退出或停止时，自动重新启动容器

语法：
```yaml
restart: <restart_policy>
```
其中，`<restart_policy>`是重启策略，可以是以下几种之一：
- `no`：不重启容器，默认值
- `always`：总是重启容器，除非手动停止容器
- `on-failure`：在容器异常退出时重启容器，可以使用-t选项指定重启次数
- `unless-stopped`：除非手动停止容器，否则总是重启容器

例子：
```yaml
version: '3'
services:
  web:
    image: my-web-app
    restart: always
```
在这个示例中，我们定义了一个名为web的服务，使用了自定义的web应用镜像，并设置了重启策略为always，表示总是重启容器。需要注意的是，restart字段只会在容器异常退出或停止时才会生效，而不会影响容器的启动顺序或依赖关系。

### 更多

关于docker compose配置的讲解就到这里，其配置和`docker run`很相似，关于更多配置可以查看:point_right:[官方文档](https://docs.docker.com/compose/compose-file/05-services/)

## 命令
有了配置文件后可以通过命令行对整个服务进行发布、构建、删除等等
```sh
docker compose [-f <arg>...] [--profile <name>...] [options] [COMMAND] [ARGS...]
```

### build
```sh
docker compose build [OPTIONS]
```
用于构建Docker镜像，可以通过一些参数来自定义构建过程：
- `--no-cache`：禁止使用缓存进行构建。如果使用了缓存，Docker会在构建镜像时尽可能地复用之前构建过的镜像层，以提高构建速度。使用--no-cache选项可以强制Docker从头开始构建镜像
- `--pull`：在构建镜像之前，拉取最新的基础镜像。如果基础镜像版本已经过时，使用--pull选项可以确保构建的镜像使用最新的基础镜像
- `--parallel`：并行构建多个Docker镜像。如果同时构建多个镜像，可以使用--parallel选项加快构建速度

### up
```sh
docker compose up [OPTIONS]
```
用于启动Docker Compose定义的所有服务，可以通过一些参数来自定义启动过程：
- `-d`：在后台模式下启动服务。如果不使用-d选项，则docker-compose up命令会在前台模式下启动服务，并输出日志信息
- `--build`：在启动服务之前，自动构建镜像。如果服务的镜像已经存在，使用--build选项可以强制重新构建镜像
- `--scale`：扩展指定服务的容器数量。使用--scale选项可以根据实际需要动态地扩展服务的容器数量。

### stop
```sh
docker compose stop [OPTIONS] [SERVICE...]
```
用于停止由Docker Compose定义的服务的容器，不会删除容器、网络和卷：
- `-t`：停止服务的超时时间。使用-t选项可以指定停止服务的超时时间，单位为秒
- `SERVICE`：指定要停止的服务，如果只需要停止一个或几个服务的容器，可以在stop命令后面指定要停止的服务名

### rm
```sh
docker compose rm [OPTIONS]
```
用于停止并删除由Docker Compose定义的服务的容器、网络和卷：
- `-f`：强制停止并删除服务的容器、网络和卷。如果服务的容器正在运行或者网络和卷正在被使用，使用-f选项可以强制停止并删除它们
- `--stop`：停止服务的容器，但不删除它们。如果只想停止服务的容器而不删除它们，可以使用--stop选项

### kill
```sh
docker compose kill [OPTIONS] [SERVICE...]
```
用于强制停止由Docker Compose定义的服务的容器：
- `-s`：指定信号量。使用-s选项可以指定要发送的信号量

### 更多
更多关于docker compose命令使用方法参考:point_right:[官方文档](https://docs.docker.com/compose/reference/)

## 实战
本次将部署两个容器服务：前端和后端，其中前端使用nginx进行部署，后端使用nodejs作为api服务，将nginx端口映射到宿主机，然后通过宿主机`IP:Port`形式访问前端页面，页面中请求后端服务，点击这里:point_right:[下载示例源码](https://github.com/ihengshuai/blog/blob/main/__example__/docker/compose)。

1. 创建前端页面静态文件index.html：页面包括一个输入框和一个按钮，点击发送请求到`/api`，这里会请求nginx，nginx做反向代理到nodejs
	```html
	<input type="text">
	<button>发送</button>
	<script>
	  const btn = document.querySelector("button")
	  const input = document.querySelector("input")
	  btn.addEventListener("click", () => {
	  	fetch(`/api?q=${input.value}`, {
	      mode: "cors",
	      method: "get"
	    })
	     .then(res => res.json())
	     .then(res => console.log(res))
	  })
	</script>
	```
2. 创建`default.conf`进行nginx的配置与转发：当访问`/`是返回前端页面，页面中的请求`/api`会被代理到`compose-nodejs:10010`，这里的`compose-nodejs`是nodejs的服务名，只有当compose中的容器使用同一个网络时才可以使用服务名的形式访问
	```nginx
	upstream backend {
	  server compose-nodejs:10010;
	}
	server {
	  listen 80;
	  server_name localhost;
	  # 首页静态页面
	  location / {
	    root /usr/share/nginx/html;
	    index index.html index.htm;
	  }

	  # 反向代理到 nodejs
	  location /api {
	  	# 允许跨域
	    add_header Access-Control-Allow-Origin $http_origin always;
	    add_header Access-Control-Allow-Credentials true always;
	    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
	    add_header Access-Control-Allow-Headers 'content-type';
	    if ($request_method = "OPTIONS") {
	        return 204;
	    }

	    proxy_set_header X-Real-IP $remote_addr;
	    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
	    proxy_set_header Host $http_host;
	    proxy_set_header X-Nginx-Proxy true;
	    proxy_pass http://backend;
	  }
	}
	```
3. 创建nodejs作为后端服务：nodejs使用express作为http服务，并监听10010端口，当访问时返回code和时间戳
	```js
	const express = require("express");
	const app = express();
	app.use((req, res) => {
	  console.log(req.url);
	  res.json({
	    code: 200,
	    date: +new Date(),
	  });
	});
	app.listen(10010, () => console.log("server is runnning on port 10010"));
	```
4. 创建docker-compose.yml配置文件：里面包含了nginx和nodejs容器，两者都是用本地的Dockerfile进行构建镜像，nginx映射宿主机`10010`端口到容器的80端口，并且两者的启动顺序为`compose-nodejs`、`compose-nginx`，使用相同的网络`compose`
```yaml
version: "3"
services:
  compose-nginx:
    build:
      context: .
      dockerfile: Dockerfile.nginx
    container_name: compose-nginx
    ports:
      - "10010:80"
    depends_on:
      - compose-nodejs
    networks:
      - compose

  compose-nodejs:
    build:
      context: .
      dockerfile: Dockerfile.nodejs
    container_name: compose-nodejs
    networks:
      - compose


networks:
  - compose:
```

5. 创建镜像构建文件：分别使用`Dockerfile.nginx`和`Dockerfile.nodejs`来构建nginx和nodejs镜像，具体配置文件如下

	Dockerfile.nginx
	```docker
	FROM nginx:alpine
	COPY index.html /usr/share/nginx/html
	COPY default.conf /etc/nginx/conf.d
	EXPOSE 80
	ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
	```
	Dockerfile.nodejs
	```docker
	FROM node:alpine
	WORKDIR /app
	COPY package.json .
	RUN npm install
	COPY server.js .
	EXPOSE 10010
	ENTRYPOINT [ "npm", "run", "server.js" ]
	```
6. 启动整体服务：
	```sh
	docker compose up -d
	```

## 参考文档
- [Compose file build reference](https://docs.docker.com/compose/compose-file/build/)
- [The Compose file](https://docs.docker.com/compose/compose-file/03-compose-file/)
- [Version and name top-level element](https://docs.docker.com/compose/compose-file/04-version-and-name/)
- [Services top-level element](https://docs.docker.com/compose/compose-file/05-services/)
- [Networks top-level element](https://docs.docker.com/compose/compose-file/06-networks/)
- [Volumes top-level element](https://docs.docker.com/compose/compose-file/07-volumes/)
- [Configs top-level element](https://docs.docker.com/compose/compose-file/08-configs/)
- [Secrets top-level element](https://docs.docker.com/compose/compose-file/09-secrets/)
- [Command line Guides](https://docs.docker.com/compose/reference/)
- [NodeJS Guides](https://docs.docker.com/language/nodejs/develop/)


<Reward />
<Gitalk />

