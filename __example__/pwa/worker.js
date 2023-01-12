self.addEventListener("install", (event) => {
    // 跳过等待
    self.skipWaiting();
    event.waitUnit(new Promise((resolve) => {
        resolve("install success");
        console.log("install success...")
    }))
})

self.addEventListener("activate", (event) => {
    console.log("activate")
    event.waitUnit(self.clients.claim())
})


self.addEventListener("fetch", async (event) => {
    if (event.request.url === "http://127.0.0.1:5500/ssr.jpg") {
        const cache = await caches.open("v2");
        let response = await cache.match(event.request)
        if (!response) {
            response = await fetch(event.request)
            cache.put(event.request, response)
        }
        return response
    }
})

const registration = self.registration;

self.addEventListener('notificationclick', function (e) {
    // 关闭通知
    e.notification.close()

    if (e.action === 'like') {
        // 点击了“点赞”按钮
        console.log('点击了点赞按钮')
    } else {
        // 点击了对话框的其他部分
        console.log('点击了对话框')
    }
})