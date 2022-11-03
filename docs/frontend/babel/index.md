# Babel

## 概览

## 配置
.开头和非点开头

### JSON

### Function
```js
module.exports = (api) => {
  api.cache.forever();
}
```

### presets
- presets和plugins执行顺序

### plugins

## 常见预设

## 常见插件

## 项目和相对文件配置
monorepo

- upward
- file relation
- babel-loader

.babelrc 针对项目中文件的相对位置，当babel编译时文件会在当前路径及向上找.babelrc直到出现package.json停止，.babelrc适合针对某个具体文件进行配置
babel.config.js 是整个项目范围的配置，若项目中引用了根目录以上的文件，那这些文件将会被babel.config.js配置影响到，也就是说项目中所有的文件都会受作用；若项目中的存在.babelrc 将会和babel.config.js合并

## 编译器假设Compiler assumptions
会控制编译的输出
```json
"assumptions": {
  "noDocumentAll": true, // 不输出文档
  "noClassCalls": true // 不要classCallCheck
},
```

## 参考文献
- https://babeljs.io/docs/en
- https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md