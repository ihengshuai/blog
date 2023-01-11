---
title: PWA渐进式应用
description: PWA渐进式应用
head:
  - - meta
    - name: keywords
      content: 渐进式应用,离线app
---

# PWA渐进式应用

需要`manifest`和`serviceWorker`

出现条件：
- 性能问题
- 用户留存

安装条件：
- 未安装 Web 应用程序
- 符合用户参与启发式
- 通过 HTTPS 提供服务
- 具有一个 Web 应用清单，其中包括：
    + short_name 或 name
    + icons - 必须包含一个 192 像素和一个 512 像素的图标
    + start_url
    + display - 必须是 fullscreen、standalone 或 minimal-ui
    + 不能有 prefer_related_applications，或值为 false
- 使用 fetch 处理程序注册服务工作进程

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>xxx</title>
    <meta name="description" content="A list of A-Frame entries submitted to the js13kGames 2017 competition, used as an example for the MDN articles about Progressive Web Apps.">
    <meta name="author" content="end3r">
    <meta name="theme-color" content="#B12A34">
    <meta name="description" content="A list of A-Frame entries submitted to the js13kGames 2017 competition, used as an example for the MDN articles about Progressive Web Apps.">
    <meta name="author" content="end3r">
    <meta property="og:image" content="icons/icon.png">
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="manifest" href="manifest.json">
</head>
<body>

    <h2>hello...</h2>
    
    <script>
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("worker.js").then(res => {
                    console.log("register")
                }).catch(err => {
                    console.log(err)
                })
            })
        }
    </script>
</body>
</html>
```

```js
// worker.js
self.addEventListener("install", (event) => {
    console.log("install")
    event.waitUnit(self.skipWaiting())
})

self.addEventListener("activate", (event) => {
    console.log("activate")
    event.waitUnit(self.clients.claim())
})


self.addEventListener("fetch", (event) => {
    console.log("fetch")
})
```

```json
// manifest.json
{
    "name": "hengshuai's blog",
    "short_name": "hengshuai's blog",
    "description": "a progress blog app for sharing web development experiences...",
    "icons": [
          {
            "src": "/384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "/256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "/192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/128.png",
            "sizes": "128x128",
            "type": "image/png"
          }
    ],
    "start_url": "https://blog.usword.cn",
    "display": "minimal-ui",
    "theme_color": "#747bff",
    "background_color": "#747bff"
}
```