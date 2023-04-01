import { getNavMenu } from "./menu/nav";
import { getSidebarMenu } from "./menu/sidebar";
import { getHeaders, genSpecificHeads } from "./util/head";
import dotenv from "dotenv";
// import markdown_anchor from "markdown-it-anchor"

dotenv.config({ path: "./.env" });

const isProd = process.env.NODE_ENV === "production";

export default {
  lang: "zh-CN",
  title: "hengshuai's blog",
  lastUpdated: true,
  head: getHeaders(),
  cleanUrls: true,
  transformHead(ctx) {
    return genSpecificHeads(
      ctx.title,
      ctx.description,
      ctx.pageData?.frontmatter?.logo,
      ctx.pageData?.frontmatter?.keywords,
      "https://blog.usword.cn/" +
        ctx.pageData.relativePath.replace(/md$/i, "html")
    );
  },
  markdown: {
    theme: "material-palenight",
    lineNumbers: true,
    toc: { level: [1, 2, 3, 4] },
    config: (md) => {
      // md.use(markdown_anchor)
    },
  },
  outDir: "../dist",
  description:
    "大家好我是卫恒帅，这是我的个人博客，在这里我会分享web开发相关技能经验，也有自己的一些生活所思所悟，希望对你有所帮助，如你感觉不错可以将本站收藏！",
  themeConfig: {
    logo: "https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/logo.png",
    siteTitle: "Hengshuai's blog",
    outline: [2, 4],
    outlineTitle: "目录",
    nav: getNavMenu(),
    socialLinks: [{ icon: "github", link: "https://github.com/ihengshuai" }],
    sidebar: getSidebarMenu(),
    editLink: {
      pattern: "https://github.com/ihengshuai/blog/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: `Copyright © 2018-${new Date().getFullYear()} HengShuai`,
    },
    algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_APP_KEY,
      indexName: process.env.ALGOLIA_APP_INDEXNAME,
      placeholder: "搜索文档...",
      translations: {
        button: {
          buttonText: "Search"
        }
      }
    },
  },
};
