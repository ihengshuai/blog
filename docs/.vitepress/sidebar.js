export const getSidebarMenu = () => ({
	"/frontend/": [
		{
			text: "Frontend literacy",
			collapsible: true,
			items: [
				{ text: "Javascript", link: "/frontend/js/index.html" },
				{ text: "CSS", link: "/frontend/css/index.html" },
				{ text: "Vue", link: "/frontend/vue/index.html" },
				{ text: "React", link: "/frontend/vue/index.html" },
				{ text: "Regexp", link: "/frontend/regexp/index.html" },
				{ text: "Webpack", link: "/frontend/webpack/index.html" },
				{ text: "Building Tool", link: "/frontend/building-tool/index.html" },
				{ text: "Debug Skill", link: "/frontend/debug-skill/index.html" },
				{ text: "NodeJS", link: "/frontend/node/index.html" },
				{ text: "Typescript", link: "/frontend/ts/index.html" },
				{ text: "NestJS", link: "/frontend/nestjs/index.html" },
				{ text: "Render Mode", link: "/frontend/render-mode/index.html" },
				{ text: "Project Specification", link: "/frontend/project-specification/index.html" },
				{ text: "HTTP Protocol", link: "/frontend/http-protocol/index.html" },
				{ text: "Nginx", link: "/frontend/nginx/index.html" },
			],
		},
		{
			text: "Frontend advance",
			collapsible: true,
			items: [
				{ text: "Compiler", link: "/frontend/compiler/index.html" },
				{ text: "Optimize", link: "/frontend/optimize/index.html" },
				{ text: "Monitor", link: "/frontend/monitor/index.html" },
				{ text: "Pattern", link: "/frontend/pattern/index.html" },
				{ text: "Npm Package", link: "/frontend/npm/index.html" },
				{ text: "Design Cli", link: "/frontend/cli/index.html" },
				{ text: "LowerCoding", link: "/frontend/lowcoding/index.html" },
				{ text: "Micro Frontend", link: "/frontend/micro-frontend/index.html" },
				{ text: "Node BFF", link: "/frontend/node-bff/index.html" },
				{ text: "Node Optimize", link: "/frontend/node-optimize/index.html" },
				{ text: "Sandbox", link: "/frontend/sandbox/index.html" },
			],
		},
		{
			text: "Frontend extension",
			collapsible: true,
			items: [
				{ text: "Micro Program", link: "/frontend/micro-program/index.html" },
				{ text: "Hybrid App", link: "/frontend/hybrid-app/index.html" },
				{ text: "Desktop App", link: "/frontend/desktop-app/index.html" },
				{ text: "Visual", link: "/frontend/visual/index.html" },
				{ text: "Webassembly", link: "/frontend/wasm/index.html" },
			],
		},
	],
	"/fullstack/": [
		{
			text: "Development of cloud",
			collapsible: true,
			items: [
				{ text: "Docker", link: "/fullstack/docker/index.html" },
				{ text: "k8s", link: "/fullstack/k8s/index.html" },
			],
		},
	],
	"/article/": [],
});
