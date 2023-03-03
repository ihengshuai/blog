---
title: 从零配置webpack工程
description: 使用webpack搭建一个完整的工程项目,webpack使用基础指南
head:
  - - meta
    - name: keywords
      content: webpack,工程化,webpack搭建,webpack基础
---

# 从零配置webpack工程

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gk68qmqy13j30e807waan.jpg)

>本篇文章主要针对`webpack4.x`进行配置，如果你的版本有差别，或者配置有出入，请移步[官网](https://webpack.js.org/concepts/)查询更多详细配置，各个版本大同小异，不影响学习

## webpack 是什么？

`webpack` 是一个现代 JavaScript 应用程序的静态模块打包器，当 `webpack` 处理应用程序时，会递归构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个 `bundle。`

## webpack 的核心概念

- entry: 入口
- output: 输出
- loader: 模块转换器，用于把模块原内容按照需求转换成新内容
- 插件(plugins): 扩展插件，在 webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情

## 初始化项目

`webpack4.x`开始增加`mode`为必要字段，用来区分你的运行环境。

如果你还没有项目，可以先创建一个简单的项目，方便后面使用

```sh
mkdir webpack-demo && cd webpack-demo
npm init -y
```

> 创建完成后，就让我们进行简单的配置吧
## 安装基本的依赖

对于目前的`webpack4.x`，你或许需要以下依赖:

- webpack
- webpack-cli

```sh
npm install webpack webpack-cli -D
```

## 基本配置

首先我们在`webpack-demo`文件下创建`webpack.config.js`，`src文件夹`，然后在`src文件夹下`创建`index.js`

```js
// webpack.config.js
const path = require("path");
module.exports = {
  mode: "production", // 代码环境模式 (webpack4.x是必选的字段)
  entry: path.resolve(__dirname, "./src/index/"), // 入口文件
  output: {
    path: path.resolve(__dirname, "./dist"), //  打包的目的路径
    filename: "js/bundle.[hash:8].js" // 打包后的文件名
  }
};
```

然后再`src/index.js`里面简单的写几个语句进行打包处理

```js
// src/index.js
console.log("hello");
console.log("webpack");
```

我们按照上面的简单配置进行打包:

```sh
webpack webpack.config.js
```

为了方便输入打包口令，让我们简单的配置一下`package.json`脚本

```json
// package.json
{
  // ...
  "scripts": {
    "build": "webpack --config webpack.config.js"
  }
}
```

然后使用以下的口令就可以完成打包啦:

```sh
npm run build
```

> 是不是很方便，很 nice~
## html-webpack-plugin

`html-webpack-plugin`可以让我们动态生成 HTML 文件，让我们在浏览器中查看效果

```sh
npm install html-webpack-plugin -D
```

>html-webpacl-plugin 是要配置在`plugins`中的，作为 webpack 的插件使用，plugins 是一个`数组`

`html-webpack-plugin`可以使用模板，也就是我们创建好的 html 模板，所以现在`public文件夹`下创建`index.html`文件

接着以上的`webpack`配置，添加`html-webpack-plugin`

```js
// webpack.config.js
const htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // ...
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      minify: {
        // 压缩
        collapseWhitespace: true, // 折叠空格
        removeAttributeQuotes: true // 去除属性的引号
      },
      filename: "index.html" // 生成的html名称
    })
  ]
};
```

打包代码吧~

```sh
npm run build
```

打包后会多出`index.html`文件

> html-webpack-plugin 在开发中还是非常有用的，其实它还有很多详细的配置，这里不做详解，请移步[html-webpack-plugin 官方文档](https://github.com/jantimon/html-webpack-plugin#configuration)获取更多
## devServer

webpack4.x 为我们提供了`devServer`工具，可以进行热更新，方便我们调试

使用前先下载:

```sh
npm install webpack-dev-server -D
```

然后在上面的基础上添加`devServer`

```js
// webpack.config.js
module.exports = {
  // ...
  devServer: {
    host: "0.0.0.0", // ip地址
    port: 9999, // 端口号
    hot: true, // 是否热更新
    open: true, // 是否自动打开浏览器
    https: false, // 是否
    proxy: {
      // 代理
      "^/api": {
        target: "http://localhost:8080"
        // ...
      }
    }
    // ...更多详看官网
  }
};
```

完成以上配置后，就已经可以使用`devServer`了，但是我们还要对`package.json`进行简单的配置，方便我们启动`devServer`

```json
// package.json
{
  // ...
  "scripts": {
    "dev": "webpack-dev-server --config webpack.config.js", // 开发环境
    "build": "webpack --config webpack.config.js" // 生产环境
  }
}
```

然后我们就可以很方便的启动`devServer`了

```sh
npm run dev
```

## 配置 loader

loader 是什么? 
loader 用于对源代码进行转换，这正是我们现在所需要的。

> 下面我们介绍几个简单的`loader`为大家演示下使用方式，其余的依次类推
### less-loader

`less-loader`主要用来让我们的项目可以识别`less`css 预处理器，他可以将 less 文件转换成浏览器识别的 css 文件。

>针对样式文件，首先要提一下两个重要的 loader: `css-loader`、`style-loader`,为什么它们很重要呢？因为他们项目中使用 css 样式的最根本的 loader，不管你是使用什么`css预处理器`，根本的转化都是离不开他们两个

- css-loader:将不同渠道的样式文件进行 css 编译
- style-loader:将编译后的 css 代码插入到 HTML 文件中

先下载依赖：

```sh
npm install less less-loader css-loader style-loader -D
```

我们在以上的配置中，添加`less-loader`的配置:

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rule: [
      {
        test: /\.less/, // 针对所有的 *.less 文件
        use: [
          // 使用loader来处理
          /**
           *  这里要注意loader的执行顺序，请记住这两点：
           *  1. 自下往上
           *  2. 自右往左
           */
          // less-loader -> css-loader -> style-loader
          "style-loader",
          "css-loader",
          "less-loader"
        ],
        exclude: /node_modules/ // 忽略node-modules文件夹，也就是说不用转义这个文件夹里面的*.less文件
      }
    ]
  }
};
```

然后我们创建一个样式文件`src/style/base.less`，然后随便写一点样式进去:

```less
body {
  font-size: 12px;
  padding: 0;
  background-color: teal;
}
```

然后再进行打包:

```sh
npm run dev
```

如果配置没有错误的话，你先在可以看到背景色为`teal`

### babel-loader

`babel-loader`可以将 JS 代码向低版本转换，我们需要使用 `babel-loader`

首先安装一下`babel-loader`

```sh
npm install babel-loader -D
```

此外，我们还需要配置 babel，为此我们安装一下以下依赖:

```sh
npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
npm install @babel/runtime @babel/runtime-corejs3 -S
```

<!-- 对 babel7 配置不熟悉的小伙伴，可以阅读一下这篇文章: [Babel7 知识你了解多少](/home/front/2019/Babel7知识) -->

我们在以上的配置基础上添加配置:

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 3
                }
              ]
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  }
};
```

### url-loader

`url-loader`帮助我们处理静态文件，如：css，image，js 等等

先下载:

```sh
npm install url-loader -D
```

添加配置：

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 200 * 1024, // 最大200kb
            outputPath: "image", // 打包路径  dist/image
            name: "[name].[hash:8].[ext]" // 文件名
          }
        }
      }
    ]
  }
};
```

现在试着打包吧~

```sh
npm run build
```

现在我们可以看出多了`image文件夹`，里面有我们打包的图片等其他静态资源（前提：你要在 js 文件中使用图片哦~）

> 到这里我们已经介绍了中 loader 了，就不再往下讲了，目前 npm 上有很多 loader 提供我们使用，使用哪个 loader 你可以当场查看文档就行了，配置都是千篇一律。可以查看[官网上推荐的 loader](https://webpack.docschina.org/loaders/)
## mode

`mode`是在`webpack4.x`才发布的，用来设置代码的环境，有`development`和`production`两种模式

众所周知，灵活改变 mode 需要配置环境变量，方便操作，因此为了兼容各个操作系统环境，我们需要用到`cross-env`

先下载`cross-env`:

```sh
npm install cross-env -D
```

接着，在`package.json`里修改脚本:

```json
// package.json
{
  // ...
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js",
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.js"
  }
}
```

当然我们还要在我们的配置文件中接收`NODE_ENV`变量来控制`mode`:

```js
// webpack.config.js
const isDev = process.env.NODE_ENV == "development" ? true : false;
const config = {
  mode: isDev ? "development" : "production"
};
if (isDev) {
  // 如果是开发环境就加上 devServer
  config.devServer = {
    host: "0.0.0.0", // ip地址
    port: 9999, // 端口号
    hot: true, // 是否热更新
    open: true, // 是否自动打开浏览器
    https: false, // 是否
    proxy: {
      // 代理
      "^/api": {
        target: "http://localhost:8080"
        // ...
      }
    }
  };
}
module.exports = config;
```

现在我们就可以进行不同的打包啦~

```sh
// 开发环境
npm run dev
// 生产环境打包
npm run build
```

## devtool

`devtool` 中的一些设置，可以帮助我们将编译后的代码映射回原始源代码。不同的值会明显影响到构建和重新构建的速度。

对我而言，能够定位到源码的行即可，因此，综合构建速度，在开发模式下，我设置的 `devtool` 的值是 `cheap-module-eval-source-map`。

```js
//webpack.config.js
module.exports = {
  // ...
  //开发环境下使用
  devtool: "cheap-module-eval-source-map"
};
```

生产环境可以使用 `none` 或者是 `source-map`，使用 `source-map` 最终会单独打包出一个 `.map` 文件，我们可以根据报错信息和此 `map` 文件，进行错误解析，定位到源代码。

`source-map` 和 `hidden-source-map` 都会打包生成单独的 `.map` 文件，区别在于，`source-map` 会在打包出的 js 文件中增加一个引用注释，以便开发工具知道在哪里可以找到它。hidden-source-map 则不会在打包的 js 中增加引用注释。

但是我们一般不会直接将 `.map` 文件部署到 CDN，因为会直接映射到源码，更希望将`.map` 文件传到错误解析系统，然后根据上报的错误信息，直接解析到出错的源码位置。

还可以设置其他的`devtool`值，你可以使用不同的值，构建对比差异。

## 每次打包前清空 dist 目录

反正我是懒得手动去清理的，只要你足够懒，你总是会找到好办法的，懒人推动科技进步。这里，我们需要插件: `clean-webpack-plugin`

安装依赖：

```sh
npm install clean-webpack-plugin
```

以前，`clean-webpack-plugin` 是默认导出的，现在不是，所以引用的时候，需要注意一下。另外，现在构造函数接受的参数是一个对象，可缺省。

```js
//webpack.config.js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  //...
  plugins: [
    //不需要传参数喔，它可以找到 outputPath
    new CleanWebpackPlugin()
  ]
};
```

现在你再修改文件，重现构建，生成的`hash`值和之前`dist`中的不一样，但是因为每次 `clean-webpack-plugin` 都会帮我们先清空一波 `dist` 目录，所以不会出现太多文件，傻傻分不清楚究竟哪个是新生成文件的情况。

不过呢，有些时候，我们并不希望`整个 dist` 目录都被清空，比如，我们不希望，每次打包的时候，都删除 `dll 目录`，以及 `dll 目录下的文件或子目录`，该怎么办呢？

`clean-webpack-plugin` 为我们提供了参数 `cleanOnceBeforeBuildPatterns`

```js
//webpack.config.js
module.exports = {
  //...
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!dll", "!dll/**"] //不删除dll目录下的文件
    })
  ]
};
```

此外，`clean-webpack-plugin` 还有一些其它的配置，不过我使用的不多，大家可以查看[clean-webpack-plugin 文档](https://github.com/johnagan/clean-webpack-plugin)

## externals
`externals`是webpack自带的选项，告诉webpack打包时排除哪些模块，也就是这些模块是外部的，或者CDN方式引入，不需要打包

```js
// webpack.config.js
module.exports = {
  externals: {
    jquery: 'jQuery'  // 排除jQuery
  }
}
```

可以试试吧~

## resolve
`resolve`也是webpack自带的选项，告诉webpack如何解析一些模块

```js
// webpack.config.js
module.exports = {
  resolve: {
    modules: [path.resolve('node_modules')],  // 从node_modules中解析
    mainFields: ['style', 'main'],  // 先找style 再找main
    // mainFile: [], // 入口文件的名字  index.js
    extensions: ['.js', '.css', '.styl', '.json'],   // 扩展名,依次解析
    alias: {  // 别名
      'bootstrap': 'bootstrap/dist/css/bootstrap.css',
      '@': path.resolve(__dirname, './src')
    }
  }
}
```

是不是很高大上~

## optimization

`optimization`是webpack自带的选项，用来优化项目，他主要用在生产环境下，比如：压缩代码，抽离公共代码等等~
```js
// webpack.config.js
module.exports = {
  mode: 'production',
  // 优化项
  optimization: {
    // 对没有使用的依赖，删除导入导出，减小打包体积
    usedExports: true,  // 此选项已经内置，生产环境下默认是true
    // 抽离公共代码块
    splitChunks: {
      cacheGroups: {  // 缓存组
        common: {  // 公共模块
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        vender: {   // 第三方模块
          priority: 1,
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      }
    },  
    // 压缩
    minimizer: [
      new UglifyJSWebpackPlugin({  // 压缩js
        cache: true, // 缓存
        parallel: true, // 并发打包
        sourceMap: true // 源码映射
      }),
      new OptimizeCSSAssetsPlugin()  // 压缩css
    ]
  },
}
```

## watch
`watch`是webpack自带的属性，他可以让自动监视代码有没有修改，进行监控打包，开启后你就不用再手动进行打包了

```js
// webpack.config.js
module.exports = {
  watch: true,
  watchOptions: {
    poll: 1000, // ms  每秒检查一次
    aggregateTimeout: 500, // 防抖  500ms
    ignored: /node_modules/
  }
}
```

## noParse
`noParse`属于module中的属性，可以告诉webpack不解析哪些模块，比如：jQuery就没有依赖第三方模块，不需要解析jQuery

使用：
```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    noParse: /jQuery|lodash/
  }
}
```

## webpack-merge
`webpack-merge`用来帮助我们合并webpack配置，我们可以根据不同的环境设置特定的webpack配置，将公共的webpack配置抽离出来使用，根据不同环境，合并公共配置完成配置，话不多说，上手吧~

下载依赖`webpack-merge`
```sh
npm install webpack-merge -D
```

现在我们稍微改造下我们的配置代码，删除原来的`webpack.config.js`，新建`webpack.dev.conf.js`、`webpack.prod.conf.js`、`webpack.base.conf.js`，简单解释:
- webpack.base.conf.js：公共的webpack配置
- webpack.dev.conf.js：开发环境下的配置
- webpack.prod.conf.js：生产环境下的配置

使用：

webpack公共配置：
```js
// webpack.base.conf.js
// 抽离公共配置
module.exports = {
  entry: path.resolve(__dirname, './src/index'),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/[name].[hash:8].js"
  },
  externals: {   // 外部的
    jquery: "jQuery"
  },
  resolve: {  // 解析第三方模块
    modules: [path.resolve('node_modules')],
    mainFields: ['style', 'main'],  // 先找style 再找main
    // mainFile: [], // 入口文件的名字  index.js
    extensions: ['.js', '.css', '.styl', '.json'],   // 扩展名,依次解析
    alias: {  // 别名
      'bootstrap': 'bootstrap/dist/css/bootstrap.css',
      '@': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader?cacheDirectory=true",  // babel编译文件缓存
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                "@babel/plugin-transform-runtime"
              ]
            }
          }
        ],
        exclude: /node_modules/,
        include: path.resolve(__dirname, "./src")
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader
          },
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.styl(us)?/,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader
          },
          "css-loader",
          "postcss-loader",
          "stylus-loader"
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            // esModule: false
            limit: 200 * 1024,
            outputPath: "image",
            // publicPath: '',
            name: "[name].[hash:8].[ext]" // 文件名
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style/[name].[hash:8].css"
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      filename: 'index.html',
      // hash: true,   // js加上hash,
      chunks: ['index']
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      filename: 'app.html',
      chunks: ['index', 'app']
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      // 全局提供插件
      $: "jquery"
    })
  ]
}
```
webpack开发环境配置：
```js
const baseConfig = require('./webpack.base.conf')
const Merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const devConfig = Merge(baseConfig, {
  mode: 'development',
  devServer: {
    port: 2222,
    hot: true,
    open: true,
    contentBase: path.resolve(__dirname, './dist'),
    progress: true,
    compress: true,
    inline: true,
    // 跨域请求
    proxy: {
      '/api': {
        target: 'http://localhost:3000/juejin',  // 指定要跨域请求的url
        pathRewrite: {  // 重写路径
          '^/api': ''
        }
      }
    },
    // node方式进行跨域
    before: app => {}
  },
  plugins: [
    // 打印更新了文件的路径
    new webpack.NamedModulesPlugin(),
    // webpack支持热更新插件
    new webpack.HotModuleReplacementPlugin()
  ]
})
module.exports = devConfig
```

webpack生产环境配置：
```js
const baseConfig = require("./webpack.base.conf");
const webpack = require("webpack");
const Merge = require("webpack-merge");
const UglifyJSWebpackPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const Moment = require("moment");
const Date = new Moment().format("YYYY-MM-DD HH:mm:ss");
const purgecssWebpackPlugin = require('purgecss-webpack-plugin')
const glob = require('glob')
const prodConfig = Merge(baseConfig, {
  mode: "production",
  // 优化项
  optimization: {
    // 对没有使用的依赖，删除导入导出，减小打包体积
    usedExports: true,  // 此选项已经内置，生产环境下默认是true
    // 抽离公共代码块
    splitChunks: {
      cacheGroups: {  // 缓存组
        common: {  // 公共模块
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        vender: {   // 第三方模块
          priority: 1,
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      }
    },  
    // 压缩
    minimizer: [
      new UglifyJSWebpackPlugin({
        cache: true, // 缓存
        parallel: true, // 并发打包
        sourceMap: true // 源码映射
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  devtool: "cheap-module-eval-source-map",
  watch: false,
  watchOptions: {
    poll: 1000, // ms  每秒检查一次
    aggregateTimeout: 500, // 防抖  500ms
    ignored: /node_modules/
  },
  module: {
    // 忽略不需要解析的包   因为jQuery,lodash不需要第三方依赖
    noParse: /jquery|lodash/, 
  },
  plugins: [
    new webpack.BannerPlugin(`
      @Author: Mr_Wei
      @Date: ${Date}
      @Description: 简单的webpack配置学习
      @Other: xxx   
    `),
    // 忽略掉第三方的某些不需要的包
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    // 去除没用的css样式代码
    new purgecssWebpackPlugin({
      paths: glob.sync('./src/**/*', {nodir: true})
    })
  ]
});
module.exports = prodConfig;
```

完成以上的配置分离，还没有结束，接下来我们修改`package.json`的脚本，方便我们打包

```json
// package.json
{
  // ...
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.dev.conf.js",
    "build": "cross-env NODE_ENV=production webpack --config webpack.prod.conf.js"
  }
}
```

大功告成，这样写配置是不是更加友好，更加便于后期的维护。

```sh
// 开发环境
npm run dev
// 生产环境
npm run build
```

## 最后
到这里，其实webpack的基本配置已经讲了不少了，其实还有很多详细的配置，和重要的配置，比如：`dll静态库`、`全局插件`、`抽离css`、`第三方包的忽略`、`去除无用的css样式`等等。

<Reward />
<Gitalk />