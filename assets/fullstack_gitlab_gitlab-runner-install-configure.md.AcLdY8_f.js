import{_ as e,c as p,J as s,V as r,o,G as n}from"./chunks/framework.SV1ROkXV.js";const B=JSON.parse('{"title":"Gitlab Runner安装与配置","description":"一篇gitlab runner完整的安装与注册配置教程","frontmatter":{"title":"Gitlab Runner安装与配置","description":"一篇gitlab runner完整的安装与注册配置教程","keywords":"gitlab-runner,runner注册,流水线,CI/CD,自动化构建","logo":"https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-gitlab.png"},"headers":[],"relativePath":"fullstack/gitlab/gitlab-runner-install-configure.md","filePath":"fullstack/gitlab/gitlab-runner-install-configure.md","lastUpdated":1709440279000}'),t={name:"fullstack/gitlab/gitlab-runner-install-configure.md"},c=r(`<h1 id="gitlab-runner安装与配置" tabindex="-1">Gitlab Runner安装与配置 <a class="header-anchor" href="#gitlab-runner安装与配置" aria-label="Permalink to &quot;Gitlab Runner安装与配置&quot;">​</a></h1><p>本篇使用<a href="https://docs.gitlab.com/runner/install/docker.html" target="_blank" rel="noreferrer">docker(点击查看安装文档)</a>进行runner的安装和注册，其他方式请<a href="https://docs.gitlab.com/runner/install/" target="_blank" rel="noreferrer">浏览相关文档</a></p><blockquote><p>请确保runner版本和gitlab版本兼容以及docker相关版本兼容问题</p></blockquote><h2 id="下载镜像" tabindex="-1">下载镜像 <a class="header-anchor" href="#下载镜像" aria-label="Permalink to &quot;下载镜像&quot;">​</a></h2><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> pull gitlab/gitlab-runner:v14.6.0</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="创建挂载卷" tabindex="-1">创建挂载卷 <a class="header-anchor" href="#创建挂载卷" aria-label="Permalink to &quot;创建挂载卷&quot;">​</a></h2><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">mkdir</span><span style="color:#C3E88D;"> -p</span><span style="color:#C3E88D;"> /srv/gitlab-runner</span></span>
<span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#C3E88D;"> /srv/gitlab-runner </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#FFCB6B;"> mkdir</span><span style="color:#C3E88D;"> config certs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 将gitlab的域名正式复制到 certs 中</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="运行runner" tabindex="-1">运行runner <a class="header-anchor" href="#运行runner" aria-label="Permalink to &quot;运行runner&quot;">​</a></h2><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> run -d --name gitlab-runner --restart always </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  -v</span><span style="color:#C3E88D;"> /srv/gitlab-runner/config:/etc/gitlab-runner </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  -v</span><span style="color:#C3E88D;"> /srv/gitlab-runner/certs:/etc/gitlab-runner/certs </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  -v</span><span style="color:#C3E88D;"> /var/run/docker.sock:/var/run/docker.sock </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  -v</span><span style="color:#C3E88D;"> /etc/hosts:/etc/hosts </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  gitlab/gitlab-runner:v14.6.0</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>如果你的gitlab使用的了本地域名和自签证书，这里进行域名和hosts进行挂载</p><h2 id="注册runner" tabindex="-1">注册runner <a class="header-anchor" href="#注册runner" aria-label="Permalink to &quot;注册runner&quot;">​</a></h2><p>runner注册文档地址 <a href="https://docs.gitlab.com/runner/register/index.html#docker%EF%BC%8C%E5%8F%AF%E4%BB%A5%E9%80%9A%E8%BF%87%E4%BA%A4%E4%BA%92%E5%BC%8F%E5%92%8C%E9%9D%9E%E4%BA%A4%E4%BA%92%E5%BC%8F%E6%B3%A8%E5%86%8C%E3%80%82%E6%B3%A8%E5%86%8Crunner%E9%9C%80%E8%A6%81runner%E7%9A%84token%EF%BC%8Ctoken%E7%94%A8%E6%9D%A5%E8%BF%9E%E6%8E%A5gitlab%E5%92%8Crunner" target="_blank" rel="noreferrer">https://docs.gitlab.com/runner/register/index.html#docker，可以通过交互式和非交互式注册。注册runner需要runner的token，token用来连接gitlab和runner</a></p><h3 id="注册token" tabindex="-1">注册token <a class="header-anchor" href="#注册token" aria-label="Permalink to &quot;注册token&quot;">​</a></h3><p>Gitlab runner的注册token需要从gitlab中获取，token可以从具体项目中获取也可以从gitlab全局获取</p><p>如这里是web1项目的runner token</p><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230319175134576.png" alt="image-20230319175134576"></p><p>你可以联系root账户创建group的runner或admin全局的runner</p><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230319175359461.png" alt="image-20230319175359461"></p><h3 id="交互式注册" tabindex="-1">交互式注册 <a class="header-anchor" href="#交互式注册" aria-label="Permalink to &quot;交互式注册&quot;">​</a></h3><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#676E95;font-style:italic;"># 方式1</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> run --rm -it -v /srv/gitlab-runner/config:/etc/gitlab-runner gitlab/gitlab-runner:v14.6.0 register</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 方式2</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 进入 gitlab-runner</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> exec -it gitlab-runner bash</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;</span><span style="color:#BABED8;"> gitlab-runner -h</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 注册runner</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;</span><span style="color:#BABED8;"> gitlab-runner register </span><span style="color:#676E95;font-style:italic;"># 交互式注册看下方图</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>执行以上命令会进入runner镜像内部交互式进行注册</p><h3 id="非交互式" tabindex="-1">非交互式 <a class="header-anchor" href="#非交互式" aria-label="Permalink to &quot;非交互式&quot;">​</a></h3><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#676E95;font-style:italic;"># 如果你的gitlab使用http + ip形式</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> run --rm </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  -v</span><span style="color:#C3E88D;"> /srv/gitlab-runner/config:/etc/gitlab-runner </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  -v</span><span style="color:#C3E88D;"> /etc/hosts:/etc/hosts </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  gitlab/gitlab-runner:v14.6.0 register </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  --non-interactive</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --executor</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">docker</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --docker-image</span><span style="color:#C3E88D;"> alpine:latest </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  --url</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">http://192.168.10.10</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --registration-token</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">-_d2uxhfknTiFxm9oKs1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --description</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">admin register runner</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --tag-list</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">admin</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --run-untagged=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">true</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --locked=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">false</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> </span></span>
<span class="line"><span style="color:#BABED8;">  </span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 如果你的gitlab使用https，需要进行证书认证</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> run --rm </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  -v</span><span style="color:#C3E88D;"> /srv/gitlab-runner/config:/etc/gitlab-runner </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  -v</span><span style="color:#C3E88D;"> /etc/hosts:/etc/hosts </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  gitlab/gitlab-runner:v14.6.0 register </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  --non-interactive</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --executor</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">docker</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --docker-image</span><span style="color:#C3E88D;"> alpine:latest </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  --url</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">https://gitlab.ihengshuai.com</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --registration-token</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">Gitlab Runner Token</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --description</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">testing docker-runner</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --tls-ca-file</span><span style="color:#C3E88D;"> /etc/gitlab-runner/certs/gitlab.ihengshuai.com.crt </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  --tag-list</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">testing</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --run-untagged=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">true</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#C3E88D;">  --locked=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">false</span><span style="color:#89DDFF;">&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><p>这里执行非交互命令：注册成功</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">➜</span><span style="color:#C3E88D;"> devops ~ docker run --rm </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">-v</span><span style="color:#C3E88D;"> /srv/gitlab-runner/config:/etc/gitlab-runner </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">-v</span><span style="color:#C3E88D;"> /etc/hosts:/etc/hosts </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">gitlab/gitlab-runner:v14.6.0 register </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">--non-interactive</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">--executor</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">docker</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">--docker-image</span><span style="color:#C3E88D;"> alpine:latest </span><span style="color:#BABED8;">\\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">--url</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">http://192.168.10.10</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">--registration-token</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">-_d2uxhfknTiFxm9oKs1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">--description</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">admin register runner</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">--tag-list</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">admin</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">--run-untagged=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">true</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> \\</span></span>
<span class="line"><span style="color:#BABED8;">&gt;   </span><span style="color:#C3E88D;">--locked=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">false</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#FFCB6B;">Runtime</span><span style="color:#C3E88D;"> platform                                    arch=arm64 os=linux pid=</span><span style="color:#F78C6C;">7</span><span style="color:#C3E88D;"> revision=</span><span style="color:#F78C6C;">5316</span><span style="color:#C3E88D;">d4ac version=</span><span style="color:#F78C6C;">14.6</span><span style="color:#C3E88D;">.0</span></span>
<span class="line"><span style="color:#FFCB6B;">Running</span><span style="color:#C3E88D;"> in system-mode.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">Registering</span><span style="color:#C3E88D;"> runner... succeeded                     runner=-_d2uxhf</span></span>
<span class="line"><span style="color:#FFCB6B;">Runner</span><span style="color:#C3E88D;"> registered successfully. Feel free to start it, but if it</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">s running already the config should be automatically reloaded!</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h3 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h3><ul><li><code>non-interactive</code>：不需要交互</li><li><code>executor</code>：runner执行器，有很多，这里选择docker</li><li><code>docker-image</code>：runner基础镜像</li><li><code>url</code>：指定gitlab的地址，根据gitlab的配置地址填写</li><li><code>registration-token</code>：runner注册token，项目、admin、group的token都可以</li><li><code>description</code>：runner相关描述</li><li><code>tag-list</code>：runner的标签，可以指定多个，流水线运行时可以通过runner标签指定runner运行，如果你忘记填写，可以在注册后修改</li><li><code>tls-ca-file</code>：如果你使用了https且使用了自签证书，需要指定证书使runner信任此证书（ <a href="https://docs.gitlab.com/runner/install/docker.html#installing-trusted-ssl-server-certificates%EF%BC%89" target="_blank" rel="noreferrer">https://docs.gitlab.com/runner/install/docker.html#installing-trusted-ssl-server-certificates）</a></li><li><code>run-untagged</code>：如果流水线的作业没指定tag也可以用此runner运行</li><li><code>locked</code>：关闭锁定，默认情况下runner注册后都是锁定状态，不可以执行，需要在后台打开，这里直接注册时打开</li></ul><h2 id="配置文件" tabindex="-1">配置文件 <a class="header-anchor" href="#配置文件" aria-label="Permalink to &quot;配置文件&quot;">​</a></h2><p>gitlab runner在注册后会生成对应的配置文件<code>/srv/gitlab-runner/config/config.toml</code>（挂载目录），容器位置在<code>/etc/gitlab-runner/config.toml</code></p><div class="language-toml line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#676E95;font-style:italic;"># 同时可以运行几个runner</span></span>
<span class="line"><span style="color:#BABED8;">concurrent </span><span style="color:#89DDFF;">=</span><span style="color:#F78C6C;"> 2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 检查间隔，3s内检查代码变动就会执行runner</span></span>
<span class="line"><span style="color:#BABED8;">check_interval </span><span style="color:#89DDFF;">=</span><span style="color:#F78C6C;"> 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">[</span><span style="color:#FFCB6B;">session_server</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#BABED8;">  session_timeout </span><span style="color:#89DDFF;">=</span><span style="color:#F78C6C;"> 1800</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 注册的runner，每注册一个，就会多一份 [[runners]] 配置</span></span>
<span class="line"><span style="color:#89DDFF;">[[</span><span style="color:#FFCB6B;">runners</span><span style="color:#89DDFF;">]]</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  # runner 描述</span></span>
<span class="line"><span style="color:#BABED8;">  name </span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">testing docker-runner</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  # gitlab 地址</span></span>
<span class="line"><span style="color:#BABED8;">  url </span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">http://192.168.10.10</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  # 注册token</span></span>
<span class="line"><span style="color:#BABED8;">  token </span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">iz1PoRca5ZD5gV1uydX4</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  # ssl证书位置</span></span>
<span class="line"><span style="color:#BABED8;">  tls-ca-file </span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">/srv/gitlab-runner/config/ssl/gitlab.ihengshuai.com.crt</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  # runner执行器</span></span>
<span class="line"><span style="color:#BABED8;">  executor </span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">docker</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">  [</span><span style="color:#FFCB6B;">runners</span><span style="color:#BABED8;">.</span><span style="color:#FFCB6B;">custom_build_dir</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#89DDFF;">  [</span><span style="color:#FFCB6B;">runners</span><span style="color:#BABED8;">.</span><span style="color:#FFCB6B;">cache</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#89DDFF;">    [</span><span style="color:#FFCB6B;">runners</span><span style="color:#BABED8;">.</span><span style="color:#FFCB6B;">cache</span><span style="color:#BABED8;">.</span><span style="color:#FFCB6B;">s3</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#89DDFF;">    [</span><span style="color:#FFCB6B;">runners</span><span style="color:#BABED8;">.</span><span style="color:#FFCB6B;">cache</span><span style="color:#BABED8;">.</span><span style="color:#FFCB6B;">gcs</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#89DDFF;">    [</span><span style="color:#FFCB6B;">runners</span><span style="color:#BABED8;">.</span><span style="color:#FFCB6B;">cache</span><span style="color:#BABED8;">.</span><span style="color:#FFCB6B;">azure</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#89DDFF;">  [</span><span style="color:#FFCB6B;">runners</span><span style="color:#BABED8;">.</span><span style="color:#FFCB6B;">docker</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#BABED8;">    tls_verify </span><span style="color:#89DDFF;">=</span><span style="color:#FF9CAC;"> false</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    # docker执行器的基础镜像</span></span>
<span class="line"><span style="color:#BABED8;">    image </span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">alpine:latest</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#BABED8;">    privileged </span><span style="color:#89DDFF;">=</span><span style="color:#FF9CAC;"> false</span></span>
<span class="line"><span style="color:#BABED8;">    disable_entrypoint_overwrite </span><span style="color:#89DDFF;">=</span><span style="color:#FF9CAC;"> false</span></span>
<span class="line"><span style="color:#BABED8;">    oom_kill_disable </span><span style="color:#89DDFF;">=</span><span style="color:#FF9CAC;"> false</span></span>
<span class="line"><span style="color:#BABED8;">    disable_cache </span><span style="color:#89DDFF;">=</span><span style="color:#FF9CAC;"> false</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    # 镜像拉取策略，流水线过程中如果某个已经在本地了，就不会再拉取了，直接使用本地镜像</span></span>
<span class="line"><span style="color:#BABED8;">    pull_policy </span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">if-not-present</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    # runner缓存，在docker中使用docker执行器，需要映射宿主机的docker.socket</span></span>
<span class="line"><span style="color:#BABED8;">    volumes </span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">/cache</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#C3E88D;">/var/run/docker.sock:/var/run/docker.sock</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#BABED8;">    shm_size </span><span style="color:#89DDFF;">=</span><span style="color:#F78C6C;"> 0</span></span>
<span class="line"><span style="color:#BABED8;">    </span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># [[runners]]</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># ....</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br></div></div><h2 id="配置重载" tabindex="-1">配置重载 <a class="header-anchor" href="#配置重载" aria-label="Permalink to &quot;配置重载&quot;">​</a></h2><p>当你更改了runner的配置文件后，你需要重新加载配置文件，你可以使用一下方式：</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> restart gitlab-runner</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 或进入容器</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#C3E88D;"> exec -it gitlab-runner bash</span></span>
<span class="line"><span style="color:#FFCB6B;">gitlab-runner</span><span style="color:#C3E88D;"> restart</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="runner类型" tabindex="-1">runner类型 <a class="header-anchor" href="#runner类型" aria-label="Permalink to &quot;runner类型&quot;">​</a></h2><p>根据runner的使用范围可以将其分为以下几类：</p><ul><li>shared：共享runner，gitlab中的所有项目都可以使用</li><li>group：只有当前组才可以使用</li><li>specific：只有当前项目才可以使用</li></ul><h2 id="runner执行器" tabindex="-1">runner执行器 <a class="header-anchor" href="#runner执行器" aria-label="Permalink to &quot;runner执行器&quot;">​</a></h2><p>gitlab runner由很多可以在不同场景下运行构建的<a href="https://docs.gitlab.com/runner/executors" target="_blank" rel="noreferrer">执行器</a></p><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/gitlab-runner-compare.png" alt="gitlab-runner-compare"></p><h3 id="shell-执行器" tabindex="-1">Shell 执行器 <a class="header-anchor" href="#shell-执行器" aria-label="Permalink to &quot;Shell 执行器&quot;">​</a></h3><p><strong>Shell</strong> 是最简单的执行器。您的构建所需的所有必须依赖项都需要手动安装在极狐GitLab Runner 所安装的机器上。</p><h3 id="虚拟机执行器-virtualbox-parallels" tabindex="-1">虚拟机执行器（VirtualBox / Parallels） <a class="header-anchor" href="#虚拟机执行器-virtualbox-parallels" aria-label="Permalink to &quot;虚拟机执行器（VirtualBox / Parallels）&quot;">​</a></h3><p>这种类型的执行器允许您使用已经创建的虚拟机，它被克隆且用于运行构建。我们提供两个完整的系统虚拟化选项：<strong>VirtualBox</strong> 和 <strong>Parallels</strong>。如果您想在不同操作系统上运行构建，它们很有用，因为它允许在 Windows、Linux、macOS 或 FreeBSD 上创建虚拟机，然后极狐GitLab Runner 连接虚拟机并在上面运行构建。它可以降低基础设施的成本。</p><h3 id="docker-执行器" tabindex="-1">Docker 执行器 <a class="header-anchor" href="#docker-执行器" aria-label="Permalink to &quot;Docker 执行器&quot;">​</a></h3><p><a href="https://docs.gitlab.com/runner/executors/docker.html" target="_blank" rel="noreferrer">https://docs.gitlab.com/runner/executors/docker.html</a></p><p>使用 <strong>Docker</strong> 是个很好的选择，因为它允许使用简单的依赖项管理（所有构建项目所需的依赖项都可以放到 Docker 镜像里）生成干净的构建环境。 Docker 执行器允许您很容易地使用依赖的<a href="https://docs.gitlab.cn/jh/ci/services/index.html" target="_blank" rel="noreferrer">服务</a>， 例如 MySQL，创建构建环境。</p><h3 id="docker-machine-执行器" tabindex="-1">Docker Machine 执行器 <a class="header-anchor" href="#docker-machine-执行器" aria-label="Permalink to &quot;Docker Machine 执行器&quot;">​</a></h3><p><strong>Docker Machine</strong> 是特殊版本的支持弹性伸缩的 <strong>Docker</strong> 执行器。 它类似正常的 <strong>Docker</strong> 执行器， 但由 <em>Docker Machine</em> 按需创建构建主机。</p><h3 id="kubernetes-执行器" tabindex="-1">Kubernetes 执行器 <a class="header-anchor" href="#kubernetes-执行器" aria-label="Permalink to &quot;Kubernetes 执行器&quot;">​</a></h3><p><strong>Kubernetes</strong> 执行器允许您使用您构建现存的 Kubernetes 集群。 执行器会调用 Kubernetes 集群 API 并为每个极狐GitLab CI 作业创建新的 Pod（带有构建容器和服务容器）。</p><h3 id="ssh-执行器" tabindex="-1">SSH 执行器 <a class="header-anchor" href="#ssh-执行器" aria-label="Permalink to &quot;SSH 执行器&quot;">​</a></h3><p><strong>SSH</strong> 执行器是为执行器介绍完整性而添加进来的，它是所有执行器中最不受支持的一个。 它使极狐GitLab Runner 连接到外部服务器并运行构建。机构有一些使用 SSH 执行器的成功案例，但是通常我们推荐您使用其他类型的执行器。</p><h3 id="自定义执行器" tabindex="-1">自定义执行器 <a class="header-anchor" href="#自定义执行器" aria-label="Permalink to &quot;自定义执行器&quot;">​</a></h3><p><strong>自定义</strong>执行器允许您指定您自己的执行环境。当极狐GitLab Runner 不提供执行器（例如，LXC 容器），您可以向极狐GitLab Runner 提供您自己的可执行文件，用以部署和清理任何您想使用的环境。</p>`,54);function i(u,b,y,D,d,F){const a=n("Reward"),l=n("Gitalk");return o(),p("div",null,[c,s(a),s(l)])}const E=e(t,[["render",i]]);export{B as __pageData,E as default};
