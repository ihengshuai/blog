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
    "name": "xxx",
    "short_name": "rrr",
    "description": "Progressive Web App that lists games submitted to the A-Frame category in the js13kGames 2017 competition.",
    "icons": [
        {
            "src": "https://lf9-static.bytednsdoc.com/obj/eden-cn/pipieh7nupabozups/toutiao_web_pc/icon_tt_512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "https://lf9-static.bytednsdoc.com/obj/eden-cn/pipieh7nupabozups/toutiao_web_pc/icon_tt_384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "https://lf9-static.bytednsdoc.com/obj/eden-cn/pipieh7nupabozups/toutiao_web_pc/icon_tt_256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "https://lf9-static.bytednsdoc.com/obj/eden-cn/pipieh7nupabozups/toutiao_web_pc/icon_tt_192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "https://lf9-static.bytednsdoc.com/obj/eden-cn/pipieh7nupabozups/toutiao_web_pc/icon_tt_128.png",
            "sizes": "128x128",
            "type": "image/png"
          }
    ],
    "start_url": "index.html",
    "display": "minimal-ui",
    "theme_color": "#B12A34",
    "background_color": "#B12A34"
}
```