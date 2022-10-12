// 1.Jan 2.Feb 3.Mar 4.Apr 5.May 6.Jun 7.Jul 8.Aug 9.Sep 10.Oct 11.Nov 12.Dec

export const getSidebarMenu = () => ({
  "/frontend/": [
    {
      text: "Frontend literacy",
      collapsible: true,
      items: [
        { text: "Javascript", link: "/frontend/js/index.html" },
        { text: "CSS", link: "/frontend/css/index.html" },
        { text: "Vue", link: "/frontend/vue/index.html" },
        { text: "React", link: "/frontend/react/index.html" },
        { text: "Regexp", link: "/frontend/regexp/index.html" },
        { text: "Webpack", link: "/frontend/webpack/index.html" },
        { text: "Building Tool", link: "/frontend/building-tool/index.html" },
        {
          text: "Debug Skill",
          link: "/frontend/debug-skill/index.html",
          items: [{ text: "Fiddler", link: "/frontend/debug-skill/fiddler.html" }],
        },
        { text: "NodeJS", link: "/frontend/node/index.html" },
        { text: "Typescript", link: "/frontend/ts/index.html" },
        { text: "NestJS", link: "/frontend/nestjs/index.html" },
        { text: "Render Mode", link: "/frontend/render-mode/index.html" },
        {
          text: "Project Specification",
          link: "/frontend/project-specification/index.html",
        },
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
  "/article/": [
    {
      text: "2022",
      items: [
        {
          text: "Oct",
          items: [
            { text: "1. emoji markup", link: "/article/2022/emoji-markup.html" },
          ],
        },
      ],
    },
    {
      text: "2021",
      items: [
        {
          text: "Mar",
          items: [
            { text: "1. 手写vue图片懒加载插件", link: "/article/2021/vue-img-lazyload.html" },
          ],
        },
        {
          text: "Feb",
          items: [
            { text: "1. 谈谈vue内部运行机制", link: "/article/2021/vue-core-process.html" },
            { text: "2. 从JavaScript中看设计模式", link: "/article/2021/js-pattern.html" },
          ],
        },
      ],
    },
    {
      text: "2020",
      items: [
        {
          text: "May",
          items: [
            { text: "1. 优化改善网页的加载及性能", link: "/article/2020/optimize-web-server.html" },
          ],
        },
        {
          text: "Apr",
          items: [
            { text: "1. 深入浅出RegExp", link: "/article/2020/regexp-guide.html" },
          ],
        },
        {
          text: "Mar",
          items: [
            { text: "1. 从零配置webpack工程", link: "/article/2020/webpack-guide.html" },
            { text: "2. web缓存策略", link: "/article/2020/web-cache.html" },
          ],
        },
      ],
    },
    {
      text: "2019",
      items: [
        {
          text: "Dec",
          items: [
            { text: "1. nvm使用技巧", link: "/article/2019/nvm-guide.html" },
            { text: "2. MySQL从入门到放弃", link: "/article/2019/mysql-guide.html" },
          ],
        },
        {
          text: "Oct",
          items: [
            { text: "1. 7天撸完ktv点歌系统", link: "/article/2019/ktv-system.html" },
            { text: "2. css的10中居中方式", link: "/article/2019/css-center.html" },
            { text: "3. Promise使用与原理", link: "/article/2019/promise.html" },
            { text: "3. JS隐式转换", link: "/article/2019/js-type-transfer.html" },
          ],
        },
        {
          text: "Jun",
          items: [
            { text: "1. 什么是BFC", link: "/article/2019/what-bfc.html" },
            { text: "2. JS深浅拷贝", link: "/article/2019/js-copy.html" },
            { text: "3. bind、call、apply使用技巧", link: "/article/2019/bind-call-apply.html" },
          ],
        },
      ],
    },
  ],
});
