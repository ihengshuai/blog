import { getNavMenu } from "./menu/nav";
import { getSidebarMenu } from "./menu/sidebar";
import { getHeaders } from "./head";
import dotenv from "dotenv";
// import markdown_anchor from "markdown-it-anchor"

dotenv.config({ path: "./.env" });

const isProd = process.env.NODE_ENV === "production";

export default {
  lang: "zh-CN",
  title: "hengshuai's blog",
  lastUpdated: true,
  head: getHeaders(),
  markdown: {
    theme: "material-palenight",
    lineNumbers: true,
    toc: { level: [1, 2, 3] },
    config: (md) => {
      // md.use(markdown_anchor)
    },
  },
  outDir: "../dist",
  description: "a blog for sharing web development experiences...",
  themeConfig: {
    logo: "https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/logo.png",
    siteTitle: "Hengshuai's blog",
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
    },
  },
};
