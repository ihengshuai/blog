---
title: 前端调试技能指南
description: 从Chrome DevTool Protocol到vscode玩转前端调试技巧
head:
  - - meta
    - name: keywords
      content: 前端调试,frontend debugger,vscode debugger,chrome调试,调试技能,node调试,typescript调试,线上调试
---

# Debug skill

本文会介绍vscode和chrome调试技巧

## 调试node程序
>[查看官方文档](https://nodejs.org/en/docs/guides/debugging-getting-started)

### node debugger模式+chrome调试

```sh
# 启动debugger
node --inspect-brk index.js

# 指定端口
node --inspect-brk=8999 index.js

# 启动debugger模式(这种方式控制台会开启debugger模式，可以在控制台输入命令)
node inspect index.js
```
通过这种方式node会以debugger模式运行，并且会在首行断住，此时，也会启动一个web socket作为debugger server，需要通过client连接这个server，就可以调试了

打开浏览器输入`chrome://inspect`，在`Devices`tab中的`Discover network targets`中配置`localhost:9229`，端口对应node的debugger server的端口就可以了，配置好后，就会发现下面`Remove Target`里会发现node的debugger server，点击`inspect`会打开新的调试窗口，就可以在浏览器中调试了，和在浏览器调试一模一样，关闭调试窗口后，会结束调试

启动：
![1.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70daxjwpfj314c0l07d4.jpg)
![5.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dbimbttj31ak0uanbb.jpg)
上面两种启动都会在首行断住

用Chrome DevTools连接：
![2.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dbrbuk0j31c40vwgud.jpg)
![3.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dbykwl6j31360kudml.jpg)
调试：
![4.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dc72q8yj319613sawp.jpg)

### node debugger模式+vscode调试
同上，用node debugger模式启动，会开启node debugger server，然后通过vscode连接这个server就可以调试了

那怎么用vscode连接node debugger server呢？

需要在项目中`.vscode/launch.js`文件中配置，server client，这个配置文件可以直接在工具bar`运行->添加配置`直接生成配置文件，可以在文件右下角点击`添加配置`会有对应的提示
```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
                        // 以node方式调试
      "type": "node",
                        // 连接方式为 连接 (attach、launch两种选项)
                        // 因为只要开一个client server 连接到刚刚的node debugger server 就可以
      "request": "attach",
      "name": "Attach Debugger", // 随便起个名字
                        // 跳过的文件 (可选)
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```
配置好`client server`后，点击`vscode 左侧 debugger`选项切换成调试面板，做上面like播放键就可以看到刚刚配置的调试名字，如果有多个时，可以选择，和其他IDE调试类似，点击播放键，就开始调试了，这个就直接在vscode中调试了，调试面板中会和Chrome一样有`作用域`、`变量`、`调用堆栈`等信息，如果你熟悉Java的IDE调试这个没啥问题

![7.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dcx1uaoj31cs0kathm.jpg)
![6.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dd2i6dej31wa1bqe81.jpg)

### 仅vscode调试
上面都是要在命令行启动node debugger模式开启debugger server，在启动一个server client去连接server，总体来说有点麻烦，可以用vscode将两者异步完成

和上面一样，在配置文件中再添加一个配置，将request改为`launch`，并添加`program`属性指定调试的文件即可，在js文件中左侧打个断点，这样就可以在vscode中直接调试了
```json
{
  "configurations": [
    {
      "name": "Launch Debugger",
      "program": "${workspaceFolder}/node-debugger/app.js",
      "request": "launch",
                        // 会在文件首行断住
      "stopOnEntry": true,
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    },
  ]
}
```
![8.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dd8w41uj31wa18ke54.jpg)

### 调试需编译的程序

## 调试网页程序
### 网页七大断点技巧

1. 基本断点
通常开发时大家都喜欢`console.log`打印东西来看一些预期结果，你也可以通过在需要console的地方加上`debugger`来断住js，当执行到这里时，不仅可以看到你想要的信息，还可以看到当前作用域、变量、调用栈等一些信息，这样看起来更直观也更方便
```js
// 假如有下面一段代码
button.addEventListener('click', clickCB);

function clickCB(e) {
        debugger;
        console.log(e);
}

```
![22.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70ddh034nj30y00yu1cn.jpg)
![23.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70ddm7lcqj30yc0bwq9i.jpg)

2. 条件断点
同样这里也是先在源码中指定位置debugger，或者如果你的源码并没有采取打包，源码好找的情况下可以直接在浏览器中找到对应的js文件直接打个条件注释断点就行
```js
// 假如有下面一段代码 (当x<=0，断住)
const add = (x, y) => {
  x = 2 * x;
  return x + y;
}
```
![24.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70ddthaabj30qw0e2427.jpg)
![25.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70ddzfrv7j30r40fiq63.jpg)
![26.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70de4pbf9j30xo0ekadq.jpg)
![27.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70de9swgij30r00f0dj2.jpg)
3. DOM断点
![28.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dee3faij30uw0vk17p.jpg)
DOM断点只能在浏览器中调试，有三种：
- subtree modifications
- attribute modifications
- node removal
> 以上三种断点，也可用`MutationObserver`API来代替，方便配置使用灵活，[官方文档](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
```html
// 假如下面一段代码，当点击不同的按钮对ul进行增删改查，修改自身属性
<div class="domDebugger">
        <button>增加节点</button>
        <button>删除节点</button>
        <button>删除自己</button>
        <button>更新子节点</button>
        <button>更新子节点属性</button>
        <button>更新当前元素属性</button>
</div>
<ul class="list">
        <li>1</li>
        <li>2</li>
</ul>

<script>
        const dbtns = document.querySelectorAll('.domDebugger button');
        const list = document.querySelector('.list');
        dbtns[0].addEventListener('click', () => {
                const li = document.createElement('li');
                li.innerText = '新增的节点';
                list.appendChild(li);
        });
        dbtns[1].addEventListener('click', () => {
                list.removeChild(list.lastElementChild);
        });
        dbtns[2].addEventListener('click', () => {
                list.remove();
        });
        dbtns[3].addEventListener('click', () => {
                const li = document.createElement('li');
                li.innerText = '更新的节点';
                list.replaceChild(li, list.lastElementChild);
        });
        dbtns[4].addEventListener('click', () => {
                list.lastElementChild.setAttribute('class', 'li-class');
        });
        dbtns[5].addEventListener('click', () => {
                list.setAttribute('class', 'newclass');
        });
</script>
```
- subtree modifications
节点监听:
![29.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70delr5ftj30xc0iwwni.jpg)
当监听子节点变化时，只有当子节点(node)发生变化时，才会监听的到，如：`子节点替换`、`子节点删除`、`子节点增加`、`子节点的字节点变化(像：文本节点、注释节点、元素节点等等都会监听的到)`，但是节点的属性发生变化不会监听到
![30.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70des5fqlj30po05441h.jpg)
当点击上面的删除节点时就会被监听到，如上图；而当点击更新子节点属性或者当前元素属性时反而监听不到的
- attribute modifications
属性监听:
![31.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dex8uq1j30xs0hetga.jpg)
监听当前元素属性发生变化时，而子节点属性变化监听不到;(想监听子节点的属性变化或者或者节点变化可以用开头提到的`MutatorObserver`API)
当点击更新当前元素属性时如下图所示，点击更新子节点属性不会监听到
![32.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70df1ndgtj30qq07i426.jpg)
- node removal
![34.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70df7nhfuj30g006g3zn.jpg)
这个只监听当前元素被删除，子几点的改变不会监听到，比较单一
当点击删除自己就会监听到
![33.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dfcm963j30qo04k40o.jpg)

> 除了单独监听外，还可以同时监听三种类型，只要勾选上就行；除了这种调试，也可以通过前面提到的`MutatorObserver`API来调试

4. URL断点
添加对XHR的请求url的断点，当浏览器发起http请求时，如果`断点的url包含请求url`，就会打住断点
```js
// 假如下面代码，点击按钮发起请求
const fetchApi = async () => {
        try {
                const rs = await fetch("http://localhost:3001/xxxx")
                const data = await rs.json()
                console.log(data)
        } catch(err) {
                console.log(err)
        }
}
const btn = document.querySelector('#btn');
btn.addEventListener('click', fetchApi)

// ===== 服务代码 =====
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({
    code: 200,
    message: 'Hello World',
  })
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
```
以上请求`http://localhost:3001`服务，现在我们在浏览器中添加对应的断点
![35.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dfizqknj30r60es0y3.jpg)
![36.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dforazej317o0syqil.jpg)

5. 时间监听断点
监听对应的事件当触发时就会打住断点，如：点击、鼠标、键盘事件等等
```js
// 假如给一个元素绑定click、mouseover事件
// <div id="box" />
const target = document.querySelector("#box")
target.addEventListener("click", () => console.log('click...'))
target.addEventListener("mouseover", () => console.log('mouseover...'))
```
在浏览器上打上对应的断点
![37.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dfw3slwj30o00w6wkj.jpg)
![38.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dg1ngtkj317a0pqh1j.jpg)
![39.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dg6kpj1j31760medu8.jpg)

6. 异常断点
异常断点可以在vscode中设置，如果抛出异常就会打住断点
添加vscode调试配置:
```json
{
        "name": "Debugger Exception",
        "request": "launch",
        "type": "chrome",
        "url": "http://localhost:5500",
        "webRoot": "${workspaceFolder}/trandition"
},
```
```js
// 主动抛出错误
throw new Error('This is a test error');
```
![40.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dgcww3tj31920jeqib.jpg)

### 调试React
React项目，用react-create-app启动项目，然后添加.vscode配置，点击debugger，在vscode中打个断点，就可以在vscode中调试代码了
```json
{
        "name": "React",
        "request": "launch",
        "type": "chrome",
        "url": "http://localhost:3000",
        "webRoot": "${workspaceFolder}"
}
```
![20.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dgn6qi9j31xk18s1kx.jpg)

### 调试Vue
目前用vite或者webpack生成的vue项目目前这样的都可以这样调试，以前的wepack要用sourcemap进行映射
```json
{
        "name": "VueCli",
        "request": "launch",
        "type": "chrome",
        "url": "http://localhost:8080",
        "webRoot": "${workspaceFolder}",
        // 映射sourcemap
        "sourceMapPathOverrides": {
                // "webpack://?:*/*": "${workspaceFolder}/*"
        }
}
```
![21.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dguvau8j31xk18s4n6.jpg)

### 线上Override调试
可能有一种调试需要在线上环境下直接调试代码，对于简单的调试直接使用debugger即可，有时候需要改代码啥的，可能直接用debugger可能会变得有点麻烦，要是可以将线上运行的代码代理到本地，就可以在本地调试代码了，`Chrome Override DevTools`就是干这个的
>此方式不能代理XHR请求

首先打开`Source`面板，选择`Overrides`，然后点击`Select Folder for overrides`按钮，会打开本地文件系统让你选择一个文件夹，用来保存后面调试的代码（这里最好新建一个空文件夹）
![41.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dh1g764j30p60aijt5.jpg)
![42.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dh92scaj30rs0i2q63.jpg)
选择完后Chrome会提示访问权限，点击允许，此时`network`面板会出现一个黄色三角形，则证明Override第一步成功了
![43.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dhhcwgdj31n00f4dlc.jpg)
现在比如我们想调试一个`index.js`文件，点击netword面板，右击想要调试的文件，选择`Save for overrides`，此时当前文件就会被保存到目标文件夹里了
![44.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dhmupqzj310m0mwwrd.jpg)
![45.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dhr8sbzj30ww0fejyo.jpg)
现在可以用编辑器打开目标文件夹，进行修改，修改会同步保存到浏览器，而且刷新浏览器也同样会被代理到本地文件夹哦，如下：文件开头添加debugger
![46.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dhyc4xcj31da0rwqjl.jpg)

## 线上调试（异常上报+监控系统+map映射）
假如有一个场景，开发好的项目上线后，发现一个bug报错了，潜意识下会打开控制台看下哪里错了，但不幸的是，一般上线项目都会打包压缩，而且不会有soucemap，这让错误排查变得棘手。

通常情况在发布生产时，同时生成soucemap，将soucemap放到指定位置，用来和生产环境错误做映射，这样就可以在开发环境中查看错误的位置了，这样就可以更快的解决错误了，同时也能将错误记录到系统中

假如发布一个react项目如下：
![9.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70di52hg5j315o0mcn6q.jpg)
代码很简单，点击按钮手动抛出一个错误，现在发布上线，当点击按钮时就会报错
![10.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70diacln6j314u0jqtig.jpg)
![11.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70diegpufj314i0m4449.jpg)
潜意识下打开控制台点击报错信息，带我们去目标文件，发现竟是打包后的，顿时懵逼，一头雾水；不嫌麻烦的同学可能会在本地重启项目排查，但不同环境数据可能不同，导致也很难排查，那为何不直接线上排查呢

通过映射线上环境的sourcemap，不就可以查找到错误位置了吗

### 手动添加

![12.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dioi6gvj312u0igtf1.jpg)
![13.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70ditvxnpj31180kqdny.jpg)
![14.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dizm8ilj30rm05q75g.jpg)
![15.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dj4h06gj313m0kwk20.jpg)
![16.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70dj8tjopj314e0j8ao6.jpg)
![17.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70djd9losj312s0oitoi.jpg)
![18.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70djho8z0j31vo14ue6h.jpg)
Vue项目同理
![19.png](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h70djm2we7j310s0ja7dn.jpg)

### 自动映射

`sourcemap`解密
```json
// sourcemap结构
{
        // sourcemap版本
        version: 3,
        // 转换后的文件名
        file: 'index.min.js',
        // 源文件名路径
        sources: [],
        // 源文件内容字符串（和sources一一对应）sources[0] 文件名对应的内容就是 sourcesContent[0]
        sourcesContent: [],
        // 转换前所有的变量名和属性名
        names: [],
        // 记录位置信息的字符串 Base64 VLQ编码
        // ;AACA,IAAIA,KAAO
        // ;代表空行
        // ,代表一个位置
        // AACA => 0121：转换后代码的第几列；sources中的位置；转换前第几行；转换前第几列
        mappings: ''
}
```
知识点：[https://zhuanlan.zhihu.com/p/104519418](https://zhuanlan.zhihu.com/p/104519418)
1. VLQ编码
2. Base64

// 待更新...

<Reward />
<Gitalk />