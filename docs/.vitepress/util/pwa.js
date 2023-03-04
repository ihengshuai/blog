export function initPwa() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/pwa-worker.js")
      .then((res) => {
        // console.log("register")
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
