<template>
  <span />
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

let gitalkRender = false;

const loadGitalk = () => {
  gitalkRender = true;
  var gitalk = new Gitalk({
    clientID: __ENV_VARIABLES__?.GITALK_ID,
    clientSecret: __ENV_VARIABLES__?.GITALK_SECRET,
    repo: "blog",
    owner: "ihengshuai",
    admin: ["ihengshuai"],
    id: location.pathname,
  });

  gitalk.render("gitalk-container");
};

let gitalkHost;
onMounted(() => {
  if (!__ENV_VARIABLES__?.ENV_PROD) return;
  gitalkHost = document.createElement("div");
  gitalkHost.setAttribute("id", "gitalk-container");
  document.querySelector(".content-container").append(gitalkHost);
  if (
    document.documentElement.scrollHeight -
      document.documentElement.clientHeight <
    400
  ) {
    return setTimeout(loadGitalk, 800);
  }
  window.addEventListener("scroll", () => {
    if (gitalkRender) return;
    if (
      document.documentElement.scrollHeight -
        document.documentElement.scrollTop -
        document.documentElement.clientHeight <
      400
    ) {
      loadGitalk();
    }
  });
});
onUnmounted(() => {
  gitalkHost?.remove();
});
</script>
