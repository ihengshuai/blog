import path from "path";
import { getNavMenu } from "./nav"
import { getSidebarMenu } from "./sidebar";

const resolve = (p) => path.resolve(__dirname, p);

export default {
	lang: "zh-CN",
	title: "hengshuai's blog",
	lastUpdated: true,
	head: [["link", { rel: "icon", type: "image/x-icon", href: "/logo.png" }]],
	markdown: {
		theme: "material-palenight",
		lineNumbers: true,
	},
	outDir: "../dist",
	description: "Vite & Vue powered static site generator.",
	themeConfig: {
		logo: "/logo.png",
		siteTitle: "Hengshuai's blog",
		nav: getNavMenu(),
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/ihengshuai' },
		],
		sidebar: getSidebarMenu(),
		editLink: {
			pattern: "https://github.com/ihengshuai/blog/edit/dev/docs/:path",
			text: "Edit this page on GitHub",
		},
		footer: {
			message: "Released under the MIT License.",
			copyright: "Copyright © 2019-present HengShuai",
		},
	},
};
