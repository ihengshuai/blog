import{_ as l,c as p,J as s,V as o,o as r,G as a}from"./chunks/framework.SV1ROkXV.js";const C=JSON.parse('{"title":"搭建docker私有仓库","description":"使用官方registry或nexus3搭建属于自己的docker私有镜像仓库完整教程","frontmatter":{"title":"搭建docker私有仓库","description":"使用官方registry或nexus3搭建属于自己的docker私有镜像仓库完整教程","keywords":"docker私有仓库,搭建docker仓库,nexus搭建docker仓库,registry搭建docker仓库","logo":"https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-docker.png"},"headers":[],"relativePath":"fullstack/docker/docker-repository.md","filePath":"fullstack/docker/docker-repository.md","lastUpdated":1709440279000}'),c={name:"fullstack/docker/docker-repository.md"},t=o(`<h1 id="搭建docker私有仓库" tabindex="-1">搭建docker私有仓库 <a class="header-anchor" href="#搭建docker私有仓库" aria-label="Permalink to &quot;搭建docker私有仓库&quot;">​</a></h1><p>搭建docker私有仓库也是工作中会遇到的，出于安全策略每个公司都会将自己的镜像存到自己的私有仓库中，本篇将会通过docker官方registry和nexus3两种方式进行私库的搭建。</p><p>这两种方式都需要先安装docker，通过docker以容器的形式部署，所以请确保你安装了docker，如果你还没安装或不了解docker，可以先阅读👉🏻<a href="/fullstack/docker/install-configure.html">docker章节</a></p><h2 id="官方registry搭建" tabindex="-1">官方registry搭建 <a class="header-anchor" href="#官方registry搭建" aria-label="Permalink to &quot;官方registry搭建&quot;">​</a></h2><p>官方registry镜像地址<a href="https://hub.docker.com/_/registry" target="_blank" rel="noreferrer">点这里查看</a></p><h3 id="安装registry" tabindex="-1">安装registry <a class="header-anchor" href="#安装registry" aria-label="Permalink to &quot;安装registry&quot;">​</a></h3><ol><li>创建卷映射文件夹<div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">mkdir</span><span style="color:#C3E88D;"> -p</span><span style="color:#C3E88D;"> /srv/docker-registry</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></li><li>下载镜像并运行<div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#676E95;font-style:italic;"># 下载镜像，可以指定具体版本</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> pull registry:tag</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 运行</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> run -d -p </span><span style="color:#F78C6C;">5000</span><span style="color:#C3E88D;">:5000 </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  --restart=always</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  -v</span><span style="color:#C3E88D;"> /srv/docker-registry:/tmp/registry </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  --privileged</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --name</span><span style="color:#C3E88D;"> registry registry</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div></li></ol><h3 id="使用仓库" tabindex="-1">使用仓库 <a class="header-anchor" href="#使用仓库" aria-label="Permalink to &quot;使用仓库&quot;">​</a></h3><ol><li><p>推送镜像</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#676E95;font-style:italic;"># 找一个镜像，没有可以自己build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 更改镜像标签(示例)  localhost为docker仓库的ip，5000 是端口</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> tag nginx:1.1 localhost:5000/nginx:1.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">➜</span><span style="color:#C3E88D;"> ~ docker push localhost:5000/nginx:1.15.3</span></span>
<span class="line"><span style="color:#FFCB6B;">The</span><span style="color:#C3E88D;"> push refers to repository [localhost:5000/nginx]</span></span>
<span class="line"><span style="color:#FFCB6B;">8707677a5773:</span><span style="color:#C3E88D;"> Layer already exists</span></span>
<span class="line"><span style="color:#FFCB6B;">0aad8cc1e782:</span><span style="color:#C3E88D;"> Layer already exists</span></span>
<span class="line"><span style="color:#FFCB6B;">bb97ae9f0f57:</span><span style="color:#C3E88D;"> Layer already exists</span></span>
<span class="line"><span style="color:#FFCB6B;">1.15.3:</span><span style="color:#C3E88D;"> digest: sha256:98824065f066d6839af42c512cb672fb0151322fa80fd6dc4019bfa8bd6affae size: </span><span style="color:#F78C6C;">948</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div></li><li><p>拉取镜像</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> pull localhost:5000/nginx:1.15.3</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></li><li><p>配置仓库ip</p><p>使用宿主机的<code>ip+port</code>方式，这里会发现拉取不成功，这是因为docker默认使用<code>https</code>的方式进行连接，修改一下配置文件让docker忽略当前地址</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">➜</span><span style="color:#C3E88D;"> ~ docker pull </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:7999/nginx:1.15.3</span></span>
<span class="line"><span style="color:#FFCB6B;">Error</span><span style="color:#C3E88D;"> response from daemon: Get </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">https://192.168.10.10:7999/v2/</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">: dial tcp </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:7999: connect: connection refused</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>编辑<code>/etc/docker/daemon.json</code>，没有此文件自行创建：</p><div class="language-json line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  &quot;</span><span style="color:#C792EA;">registry-mirrors</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#89DDFF;"> [</span></span>
<span class="line"><span style="color:#89DDFF;">    &quot;</span><span style="color:#C3E88D;">https://docker.mirrors.ustc.edu.cn</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">  ],</span></span>
<span class="line"><span style="color:#89DDFF;">  &quot;</span><span style="color:#C792EA;">insecure-registries</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#89DDFF;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">192.168.10.10:7999</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  // ....</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>配置完后要重启后台进程、docker和仓库：</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">systemctl</span><span style="color:#C3E88D;"> daemon-reload</span></span>
<span class="line"><span style="color:#FFCB6B;">systemctl</span><span style="color:#C3E88D;"> restart docker</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> restart registry</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">➜</span><span style="color:#C3E88D;"> ~ docker pull </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:5000/nginx:1.15.3</span></span>
<span class="line"><span style="color:#FFCB6B;">1.15.3:</span><span style="color:#C3E88D;"> Pulling from nginx</span></span>
<span class="line"><span style="color:#FFCB6B;">Digest:</span><span style="color:#C3E88D;"> sha256:98824065f066d6839af42c512cb672fb0151322fa80fd6dc4019bfa8bd6affae</span></span>
<span class="line"><span style="color:#FFCB6B;">Status:</span><span style="color:#C3E88D;"> Downloaded newer image for </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:5000/nginx:1.15.3</span></span>
<span class="line"><span style="color:#FFCB6B;">192.168.10.10:5000/nginx:1.15.3</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div></li></ol><p>以上便是使用官方registry搭建仓库的步骤，以上并没有使用账户密码，这里没有演示。而我更推荐用其他方式搭建，如接下来的nexus3，有图形化、权限配置更加友好。</p><h2 id="使用nexus3搭建" tabindex="-1">使用nexus3搭建 <a class="header-anchor" href="#使用nexus3搭建" aria-label="Permalink to &quot;使用nexus3搭建&quot;">​</a></h2><p>使用nexus3你需要先安装，关于docker安装nexus3这里不再做介绍了，如果你看了我的另一篇「<a href="/fullstack/docker/npm-repository.html#安装nexus3">使用docker搭建npm仓库</a>」一文你应该已经安装nexus3了，如果没有安装可以阅读此篇，以下本文都默认安装了nexus3</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>以下对于nexus3的使用不是很详细，如果你发现有些概念不清楚，可以先阅读我的nexus3「<a href="/fullstack/docker/npm-repository.html#安装nexus3">使用docker搭建npm仓库</a>」一文熟悉nexus3的基本使用或者参考其他第三方资料都可以</p></div><h3 id="创建存储集" tabindex="-1">创建存储集 <a class="header-anchor" href="#创建存储集" aria-label="Permalink to &quot;创建存储集&quot;">​</a></h3><p>创建存储集来存储我们的docker镜像，使用仓库关联当前存储集 <img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322150502893.png" alt="image-20230322150502893"></p><h3 id="创建仓库" tabindex="-1">创建仓库 <a class="header-anchor" href="#创建仓库" aria-label="Permalink to &quot;创建仓库&quot;">​</a></h3><p>这里会创建hosted、proxy、group三种类型的docker仓库</p><ol><li>创建hosted仓库，真正存储我们自己的镜像仓库 <img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322150834614.png" alt="image-20230322150834614"></li></ol><ul><li>Repository Connectors：仓库进行连接访问配置，这里配置了http和https两个端口，需要注意的是这两个端口需要处于创建nexus3容器时暴露出一段端口范围内</li><li>Allow anonymous docker pull：允许访客下载镜像，如果你不允许则不用勾选</li><li>选择存储集docker</li><li>Deployment Policy：根据自己的需求设置发布策略，这里设置允许重新发布相同版本</li></ul><ol start="2"><li><p>创建proxy仓库，代理第三方的仓库，这里代理到网易加速地址 <img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322151617664.png" alt="image-20230322151617664"></p></li><li><p>创建group仓库，代理hosted和proxy <img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322151914643.png" alt="image-20230322151914643"></p></li></ol><h3 id="配置角色与用户" tabindex="-1">配置角色与用户 <a class="header-anchor" href="#配置角色与用户" aria-label="Permalink to &quot;配置角色与用户&quot;">​</a></h3><ol><li><p>创建docker角色用来管理docker相关操作，根据自己需求将有关docker的权限移至右侧 <img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322152259064.png" alt="image-20230322152259064"></p></li><li><p>创建用户，有了角色权限后就可以创建对应的用户赋予权限，以后就可以用此用户进行登录私有仓库了 <img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322152535767.png" alt="image-20230322152535767"></p></li></ol><h3 id="配置realms" tabindex="-1">配置Realms <a class="header-anchor" href="#配置realms" aria-label="Permalink to &quot;配置Realms&quot;">​</a></h3><p>配置realms允许docker相关规则进行授权，如果你允许了游客下载镜像，需要在<code>Anonymous Access</code>设置允许访问 <img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230322152830776.png" alt="image-20230322152830776"></p><h3 id="登录仓库" tabindex="-1">登录仓库 <a class="header-anchor" href="#登录仓库" aria-label="Permalink to &quot;登录仓库&quot;">​</a></h3><ol><li>登录docker(group)的仓库，注意使用ip和暴露的http端口进行登录，不过docker默认会使用https进行登录，http会视为不安全，需要添加一些配置，编辑<code>/etc/docker/deamon.json</code>（没此文件自行创建）：<div class="language-json line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  &quot;</span><span style="color:#C792EA;">registry-mirrors</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#89DDFF;"> [</span></span>
<span class="line"><span style="color:#89DDFF;">    &quot;</span><span style="color:#C3E88D;">https://docker.mirrors.ustc.edu.cn</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">  ],</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  // 配置这个 不安全的仓库，我这里配置了其他的，按照自己需求进行配置</span></span>
<span class="line"><span style="color:#89DDFF;">  &quot;</span><span style="color:#C792EA;">insecure-registries</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#89DDFF;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">192.168.10.10:8081</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">192.168.10.10:8000</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">192.168.10.10:8001</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">192.168.10.10:7999</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">],</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div></li><li>重启服务<div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">systemctl</span><span style="color:#C3E88D;"> daemon-reload</span></span>
<span class="line"><span style="color:#FFCB6B;">systemctl</span><span style="color:#C3E88D;"> restart docker</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># nexus没启动的需要手动启动</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> start nexus3</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div></li><li>登录仓库<div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">➜</span><span style="color:#C3E88D;"> ~ docker login </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:8001</span></span>
<span class="line"><span style="color:#FFCB6B;">Username:</span><span style="color:#C3E88D;"> ihengshuai</span></span>
<span class="line"><span style="color:#FFCB6B;">Password:</span></span>
<span class="line"><span style="color:#FFCB6B;">WARNING!</span><span style="color:#C3E88D;"> Your password will be stored unencrypted in /root/.docker/config.json.</span></span>
<span class="line"><span style="color:#FFCB6B;">Configure</span><span style="color:#C3E88D;"> a credential helper to remove this warning. See</span></span>
<span class="line"><span style="color:#FFCB6B;">https://docs.docker.com/engine/reference/commandline/login/#credentials-store</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">Login</span><span style="color:#C3E88D;"> Succeeded</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div></li></ol><h3 id="推送镜像" tabindex="-1">推送镜像 <a class="header-anchor" href="#推送镜像" aria-label="Permalink to &quot;推送镜像&quot;">​</a></h3><p>随便找一个已下载的镜像，并修改成自己仓库的ip和包名：</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#676E95;font-style:italic;"># 打tag 写上自己仓库 IP:Port/packageName:version</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> tag nginx:1.15.3 </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:8001/myimage:v1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 发布镜像</span></span>
<span class="line"><span style="color:#FFCB6B;">➜</span><span style="color:#C3E88D;"> ~ docker push </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:8001/myimage:v1</span></span>
<span class="line"><span style="color:#FFCB6B;">The</span><span style="color:#C3E88D;"> push refers to repository [</span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:8001/myimage]</span></span>
<span class="line"><span style="color:#FFCB6B;">8707677a5773:</span><span style="color:#C3E88D;"> Layer already exists</span></span>
<span class="line"><span style="color:#FFCB6B;">0aad8cc1e782:</span><span style="color:#C3E88D;"> Layer already exists</span></span>
<span class="line"><span style="color:#FFCB6B;">bb97ae9f0f57:</span><span style="color:#C3E88D;"> Layer already exists</span></span>
<span class="line"><span style="color:#FFCB6B;">denied:</span><span style="color:#C3E88D;"> Deploying to groups is a PRO-licensed feature. See https://links.sonatype.com/product-nexus-repository</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>其实以上可以算是成功步骤，只不过推送镜像到<code>docker(group)</code>是付费功能，而<code>docker(hosted)</code>是免费的，你可以登录hosted地址推送，使用<code>docker(group)</code>进行镜像的下载</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#676E95;font-style:italic;"># 登录hosted</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> login </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:8000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 切换成hosted暴露的http port</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> tag nginx:1.15.3 </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:8000/myimage:v1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 发布镜像</span></span>
<span class="line"><span style="color:#FFCB6B;">➜</span><span style="color:#C3E88D;"> ~ docker push </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:8000/myimage:v1</span></span>
<span class="line"><span style="color:#FFCB6B;">8707677a5773:</span><span style="color:#C3E88D;"> Layer already exists</span></span>
<span class="line"><span style="color:#FFCB6B;">0aad8cc1e782:</span><span style="color:#C3E88D;"> Layer already exists</span></span>
<span class="line"><span style="color:#FFCB6B;">bb97ae9f0f57:</span><span style="color:#C3E88D;"> Layer already exists</span></span>
<span class="line"><span style="color:#FFCB6B;">v1:</span><span style="color:#C3E88D;"> digest: sha256:98824065f066d6839af42c512cb672fb0151322fa80fd6dc4019bfa8bd6affae size: </span><span style="color:#F78C6C;">948</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>到这里就发布成功了</p><h3 id="下载镜像" tabindex="-1">下载镜像 <a class="header-anchor" href="#下载镜像" aria-label="Permalink to &quot;下载镜像&quot;">​</a></h3><p>下载镜像可以使用<code>docker(group)</code>的地址，如果下载失败，可能原因是没配置权限，检查一下自己账户的权限</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">➜</span><span style="color:#C3E88D;"> ~ docker pull </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:8001/myimage:v1</span></span>
<span class="line"><span style="color:#FFCB6B;">v1:</span><span style="color:#C3E88D;"> Pulling from myimage</span></span>
<span class="line"><span style="color:#FFCB6B;">Digest:</span><span style="color:#C3E88D;"> sha256:98824065f066d6839af42c512cb672fb0151322fa80fd6dc4019bfa8bd6affae</span></span>
<span class="line"><span style="color:#FFCB6B;">Status:</span><span style="color:#C3E88D;"> Downloaded newer image for </span><span style="color:#F78C6C;">192.168</span><span style="color:#C3E88D;">.10.10:8001/myimage:v1</span></span>
<span class="line"><span style="color:#FFCB6B;">192.168.10.10:8001/myimage:v1</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`,35);function i(d,y,u,b,m,h){const n=a("Reward"),e=a("Gitalk");return r(),p("div",null,[t,s(n),s(e)])}const g=l(c,[["render",i]]);export{C as __pageData,g as default};