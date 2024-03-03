// worker.js
self.addEventListener("install", (event) => {
  // console.log("install")
  event.waitUnit(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  // console.log("activate")
  event.waitUnit(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // console.log("fetch..")
});
