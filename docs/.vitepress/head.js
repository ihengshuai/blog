import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const isProd = process.env.NODE_ENV === "production";

const enhanceEnv = `${decodeURIComponent(
  JSON.stringify({
    ALGOLIA_APP_ID: process.env?.["LO500PQ0WM"],
    ALGOLIA_APP_KEY: process.env?.["ALGOLIA_APP_KEY"],
    ALGOLIA_APP_INDEXNAME: process.env?.["ALGOLIA_APP_INDEXNAME"],
    GITALK_ID: process.env?.["GITALK_ID"],
    GITALK_SECRET: process.env?.["GITALK_SECRET"],
    ENV_PROD: isProd,
  })
)}`;

/**
 *  twitter share link card docs
 *  https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards 
 */

export const getHeaders = () => [
  ["meta", { name: "renderer", content: "webkit" }],
  ["meta", { name: "author", content: "ihengshuai@foxmail.com" }],
  ["meta", { rel: "profile", href: "http://gmpg.org/xfn/11" }],
  ["meta", { name: "referrer", content: "same-origin" }],
  ["link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  ["meta", { "http-equiv": "X-UA-Compatible", content: "IE=edge,chrome=1" }],
  ["meta", { name: "theme-color", content: "#646cff" }],
  // ["meta", { name: "google-site-verification", content: "jBlH9An6BtR0uqLLmwdh31rWxnR9JAn26b" }],
  [
    "meta",
    {
      name: "google-site-verification",
      content: "T4xYOJVbUxeU5aZRUROdmEf_NWCjnRDwfXnzKYUVcFM",
    },
  ],
  ["meta", { name: "baidu-site-verification", content: "code-IpD4H7zKv4" }],
  [
    "meta",
    {
      name: "keywords",
      content:
        "hengshuai blog,恒帅的博客,前端开发,Vue,React,webpack,vite,rollup,gulp,nestjs,typescript,前端性能优化,低代码,微前端,node bff,node中间件,node性能优化,混合应用,可视化开发,前端可视化,设计模式,小程序,前端调试指南,前端构建工具,nginx,反向代理,http协议,http protocol,docker,k8s,kubenetes,nodejs,css,regexp,正则表达式,CI/CD,DevOps,Java,Redis,Mysql,Spring,SpringBoot,MyBatis,vue原理,babel,eslint,前端项目规范,编译原理,gitlab,jenkins",
    },
  ],
  ["meta", { property: "og:type", content: "website" }],
  ["meta", { property: "og:title", content: "hengshuai's blog" }],
  ["meta", { property: "og:url", content: "https://blog.usword.cn" }],
  ["meta", { property: "og:site_name", content: "hengshuai's blog" }],
  [
    "meta",
    {
      property: "og:description",
      content:
        "前端开发,Vue,React,webpack,vite,rollup,gulp,nestjs,typescript,前端性能优化,低代码,微前端,node bff,node中间件,node性能优化,混合应用,可视化开发,前端可视化,设计模式,小程序,前端调试指南,前端构建工具,nginx,反向代理,http协议,http protocol,docker,k8s,kubenetes,nodejs,css,regexp,正则表达式,CI/CD,DevOps,Java,Redis,Mysql,Spring,SpringBoot,MyBatis,vue原理,babel,eslint,前端项目规范,编译原理,gitlab,jenkins",
    },
  ],
  [
    "meta",
    {
      property: "og:image",
      content: "https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/logo.png",
    },
  ],
  ["meta", { name: "twitter:url", value: "https://blog.usword.cn" }],
  ["meta", { name: "twitter:title", value: "hengshuai's blog" }],
  ["meta", { name: "twitter:domain", value: "https://blog.usword.cn" }],
  ["meta", { name: "twitter:card", content: "summary" }],
  [
    "meta",
    {
      name: "twitter:description",
      value:
        "前端开发,Vue,React,webpack,vite,rollup,gulp,nestjs,typescript,前端性能优化,低代码,微前端,node bff,node中间件,node性能优化,混合应用,可视化开发,前端可视化,设计模式,小程序,前端调试指南,前端构建工具,nginx,反向代理,http协议,http protocol,docker,k8s,kubenetes,nodejs,css,regexp,正则表达式,CI/CD,DevOps,Java,Redis,Mysql,Spring,SpringBoot,MyBatis,vue原理,babel,eslint,前端项目规范,编译原理,gitlab,jenkins",
    },
  ],
  [
    "meta",
    {
      name: "twitter:image",
      content: "https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/logo.png",
    },
  ],
  // ["meta", { name:"twitter:image:width", content:"400" }],
  // ["meta", { name:"twitter:image:height", content:"400" }],
  ["link", { rel: "apple-touch-icon", href: "https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/192.png" }],
  ["meta", { name: "apple-mobile-web-app-title", content: "hengshuai's blog" }],
  ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
  [
    "meta",
    { name: "apple-mobile-web-app-status-bar-style", content: "#747bff" },
  ],
  ["meta", { rel: "apple-touch-startup-image", href: "https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/192.png" }],
  ["link", { rel: "manifest", href: "/manifest.json" }],
  [
    "link",
    {
      defer: true,
      rel: "stylesheet",
      href: "https://cdn.bootcdn.net/ajax/libs/gitalk/1.8.0/gitalk.min.css",
    },
  ],
  [
    "script",
    {
      defer: true,
      src: "https://cdn.bootcdn.net/ajax/libs/gitalk/1.8.0/gitalk.min.js",
    },
  ],
  [
    "script",
    { id: "ENV_VARIABLES" },
    `;(() => {window.__ENV_VARIABLES__ = ${enhanceEnv};})()`,
  ],
];
