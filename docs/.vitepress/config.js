import { getNavMenu } from "./nav"
import { getSidebarMenu } from "./sidebar";
import dotenv from "dotenv"
// import markdown_anchor from "markdown-it-anchor"

dotenv.config({path: './.env'})

const enhanceEnv = `${decodeURIComponent(JSON.stringify({
  ALGOLIA_APP_ID: process.env?.["LO500PQ0WM"],
  ALGOLIA_APP_KEY: process.env?.["ALGOLIA_APP_KEY"],
  ALGOLIA_APP_INDEXNAME: process.env?.["ALGOLIA_APP_INDEXNAME"],
  GITALK_ID: process.env?.["GITALK_ID"],
  GITALK_SECRET: process.env?.["GITALK_SECRET"]
}))}`

export default {
	lang: "zh-CN",
	title: "hengshuai's blog",
	lastUpdated: true,
	head: [
		["link", { rel: "icon", type: "image/x-icon", href: "/logo.png" }],
		["meta", { property: "og:image", content: "https://blog.usword.cn/logo.png" }],
		["meta", { name: "renderer", content: "webkit" }],
		["meta", { "http-equiv": "X-UA-Compatible", content: "IE=edge,chrome=1" }],
		["meta", { name: "theme-color", content: "#646cff" }],
		["meta", { rel: "profile", href: "http://gmpg.org/xfn/11" }],
		["meta", { name: "keywords", content: "前端开发,Vue,React,webpack,vite,rollup,gulp,nestjs,typescript,前端性能优化,低代码,微前端,node bff,node中间件,node性能优化,混合应用,可视化开发,前端可视化,设计模式,小程序,前端调试指南,前端构建工具,nginx,反向代理,http协议,http protocol,docker,k8s,kubenetes,nodejs,css,regexp,正则表达式,CI/CD,DevOps,Java,Redis,Mysql,Spring,SpringBoot,MyBatis,vue原理,babel,eslint,前端项目规范,编译原理,gitlab,jenkins" }],
		["meta", { property: "og:type", content: "website" }],
		["meta", { property: "og:title", content: "hengshuai's blog" }],
		["meta", { property: "og:url", content: "https://blog.usword.cn" }],
		["meta", { property: "og:site_name", content: "hengshuai's blog" }],
		["meta", { property: "og:description", content: "前端开发,Vue,React,webpack,vite,rollup,gulp,nestjs,typescript,前端性能优化,低代码,微前端,node bff,node中间件,node性能优化,混合应用,可视化开发,前端可视化,设计模式,小程序,前端调试指南,前端构建工具,nginx,反向代理,http协议,http protocol,docker,k8s,kubenetes,nodejs,css,regexp,正则表达式,CI/CD,DevOps,Java,Redis,Mysql,Spring,SpringBoot,MyBatis,vue原理,babel,eslint,前端项目规范,编译原理,gitlab,jenkins" }],
		["meta", { property: "og:image", content: "https://blog.usword.cn/logo.png" }],
    ["meta", { property: "twitter:title", content: "hengshuai's blog" }],
		["meta", { property: "twitter:url", content: "https://blog.usword.cn" }],
		["meta", { property: "twitter:domain", content: "https://blog.usword.cn" }],
		["meta", { property: "twitter:card", content: "summary_large_image" }],
		["meta", { property: "twitter:description", content: "前端开发,Vue,React,webpack,vite,rollup,gulp,nestjs,typescript,前端性能优化,低代码,微前端,node bff,node中间件,node性能优化,混合应用,可视化开发,前端可视化,设计模式,小程序,前端调试指南,前端构建工具,nginx,反向代理,http协议,http protocol,docker,k8s,kubenetes,nodejs,css,regexp,正则表达式,CI/CD,DevOps,Java,Redis,Mysql,Spring,SpringBoot,MyBatis,vue原理,babel,eslint,前端项目规范,编译原理,gitlab,jenkins" }],
		["meta", { property: "twitter:image", content: "https://blog.usword.cn/logo.png" }],
		["link", { defer: true, rel: "stylesheet", href: "https://cdn.bootcdn.net/ajax/libs/gitalk/1.8.0/gitalk.min.css" }],
		["script", { defer: true, src: "https://cdn.bootcdn.net/ajax/libs/gitalk/1.8.0/gitalk.min.js" }],
    ["script", {id: "ENV_VARIABLES"}, `;(() => {window.__ENV_VARIABLES__ = ${enhanceEnv};})()`]
	],
	markdown: {
		theme: "material-palenight",
		lineNumbers: true,
		toc: { level: [1, 2, 3] },
		config: (md) => {
			// md.use(markdown_anchor)
		}
	},
	outDir: "../dist",
	description: "a blog for sharing web development experiences...",
	themeConfig: {
		logo: "/logo.png",
		siteTitle: "Hengshuai's blog",
		nav: getNavMenu(),
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/ihengshuai' },
		],
		sidebar: getSidebarMenu(),
		editLink: {
			pattern: "https://github.com/ihengshuai/blog/edit/main/docs/:path",
			text: "Edit this page on GitHub",
		},
		footer: {
			message: "Released under the MIT License.",
			copyright: "Copyright © 2019-present HengShuai",
		},
		algolia: {
			appId: process.env.ALGOLIA_APP_ID,
			apiKey: process.env.ALGOLIA_APP_KEY,
			indexName: process.env.ALGOLIA_APP_INDEXNAME,
		}
	},
};
