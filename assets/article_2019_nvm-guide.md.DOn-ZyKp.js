import{_ as o,c as p,J as n,V as l,o as i,G as s}from"./chunks/framework.SV1ROkXV.js";const y=JSON.parse('{"title":"nvm切换node版本","description":"使用nvm丝滑切换node版本提高开发效率","frontmatter":{"title":"nvm切换node版本","description":"使用nvm丝滑切换node版本提高开发效率","keywords":"nvm,切换node版本工具,node版本工具,n,开发效率,nodejs","logo":"https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-nodejs.png"},"headers":[],"relativePath":"article/2019/nvm-guide.md","filePath":"article/2019/nvm-guide.md","lastUpdated":1709440279000}'),t={name:"article/2019/nvm-guide.md"},r=l(`<h1 id="nvm切换node版本" tabindex="-1">nvm切换node版本 <a class="header-anchor" href="#nvm切换node版本" aria-label="Permalink to &quot;nvm切换node版本&quot;">​</a></h1><p>以前学会了用nvm来管理node版本,后来就专心搞开发了.如今一些所谓的vue,react,koa,Express,egg等框架更新迭代太快,老项目和新项目对node版本依赖不同,老版本的node已经无法友好支持.今天打开控制台竟然忘记nvm的常用命令,前查后查想起来,现在做个笔记,方便以后查阅</p><h2 id="下载安装nvm" tabindex="-1">下载安装NVM <a class="header-anchor" href="#下载安装nvm" aria-label="Permalink to &quot;下载安装NVM&quot;">​</a></h2><p>1.github下载地址<a href="https://github.com/coreybutler/nvm-windows/releases" target="_blank" rel="noreferrer">https://github.com/coreybutler/nvm-windows/releases</a></p><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66bu5vrtj315i0p977t.jpg" alt=""></p><p>2.下载完毕后,点击安装,目标盘随便更改. 如果是win10,请用管理员方式安装</p><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66ceyahuj30ip0edjw2.jpg" alt=""></p><p>3.查看是否安装成功</p><blockquote><p>这里作者安装了1.1.7版本</p></blockquote><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66jdhqybj30m40akdg5.jpg" alt=""></p><h2 id="配置环境变量" tabindex="-1">配置环境变量 <a class="header-anchor" href="#配置环境变量" aria-label="Permalink to &quot;配置环境变量&quot;">​</a></h2><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66emw5c8j30lz01cwej.jpg" alt=""></p><h2 id="使用nvm查看信息" tabindex="-1">使用NVM查看信息 <a class="header-anchor" href="#使用nvm查看信息" aria-label="Permalink to &quot;使用NVM查看信息&quot;">​</a></h2><p>1.<code>nvm list</code> 查看安装了所有的node版本</p><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66nl7ldlj30o60aiwf7.jpg" alt=""></p><p>2.<code>nvm use 版本号</code>切换版本</p><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66qqiya4j30ps0amjsp.jpg" alt=""></p><p>3.在你还不知道下载Node哪个版本前,你可以 <code>nvm list available</code> 查看可以安装的版本号</p><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66vsv1gpj30sj0i1n0f.jpg" alt=""></p><h2 id="使用nvm下载node等等" tabindex="-1">使用NVM下载Node等等 <a class="header-anchor" href="#使用nvm下载node等等" aria-label="Permalink to &quot;使用NVM下载Node等等&quot;">​</a></h2><p>4.<code>nvm install 版本号</code>下载指定版本Node</p><blockquote><p>这里演示下载8.9.4版本</p></blockquote><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk66ydm8jej30s40emtbc.jpg" alt=""></p><p>5.<code>nvm uninstall 版本号</code>卸载指定Node含npm,以及当前版本全局工具</p><blockquote><p>这里演示卸载8.9.4版本</p></blockquote><p><img src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk670p8pdzj30qs0bltam.jpg" alt=""></p><blockquote><p>注意,当你卸载哪个版本的Node时,那个版本的全局环境下的工具也全部删除掉了,包括npm</p></blockquote><p><strong>比如</strong></p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#676E95;font-style:italic;"># current Node.js 8.9.4</span></span>
<span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#C3E88D;"> install nodemon -g 下载了全局nodemon</span></span>
<span class="line"><span style="color:#FFCB6B;">nvm</span><span style="color:#C3E88D;"> uninstall </span><span style="color:#F78C6C;">8.9</span><span style="color:#C3E88D;">.4  写在了此版本node</span></span>
<span class="line"><span style="color:#FFCB6B;">nvm</span><span style="color:#C3E88D;"> use </span><span style="color:#F78C6C;">10.6</span><span style="color:#C3E88D;">.0  使用10.6.0Node</span></span>
<span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#C3E88D;"> install nodemon -g  重新安装nodemon</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="常见问题" tabindex="-1">常见问题 <a class="header-anchor" href="#常见问题" aria-label="Permalink to &quot;常见问题&quot;">​</a></h2><p>1.下载安装好后使用命令<code>nvm install [指定版本]</code>,出现诸如以下错误</p><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#FFCB6B;">  nodejs</span><span style="color:#C3E88D;"> An existing connection was forcibly closed by the remote host:连接被强行关闭</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;"> Could</span><span style="color:#C3E88D;"> not retrieve https://nodejs.org/dist/latest/SHASUMS256.txt:无法获得指定的校验文件</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>2.<strong>解决办法:</strong> <code>将nvm中node和npm的源设置到国内源(一般使用taobao)上。</code></p><p>3.在nvm的安装路径下找到settings.txt打开:</p><div class="language-md line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#89DDFF;"># </span><span style="color:#FFCB6B;">root: C:\\nvm</span></span>
<span class="line"><span style="color:#BABED8;">arch: 64</span></span>
<span class="line"><span style="color:#BABED8;">proxy: none</span></span>
<span class="line"><span style="color:#BABED8;">originalpath:</span></span>
<span class="line"><span style="color:#BABED8;">originalversion:</span></span>
<span class="line"><span style="color:#BABED8;">node_mirror:</span></span>
<span class="line"><span style="color:#BABED8;">npm_mirror:</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>4.分别指定node和npm的mirror</p><div class="language-md line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki material-theme-palenight vp-code"><code><span class="line"><span style="color:#BABED8;">node_mirror: npm.taobao.org/mirrors/node/</span></span>
<span class="line"><span style="color:#BABED8;">npm_mirror: npm.taobao.org/mirrors/npm/</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>5.这样就解决好了~,你学废了吗？</p>`,38);function c(d,m,u,g,h,b){const a=s("Reward"),e=s("Gitalk");return i(),p("div",null,[r,n(a),n(e)])}const j=o(t,[["render",c]]);export{y as __pageData,j as default};
