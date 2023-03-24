<template>
  <Giscus
    id="comments"
    repo="ihengshuai/blog"
    repoId="R_kgDOILaFbQ"
    category="Announcements"
    categoryId="DIC_kwDOILaFbc4CSXG3"
    mapping="title"
    strict="0"
    term="Welcome to @giscus/vue component!"
    reactionsEnabled="1"
    emitMetadata="1"
    inputPosition="top"
    :theme="theme"
    lang="zh-CN"
    loading="lazy"
  />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Giscus from '@giscus/vue'

const theme = ref('light');
const ob = ref();

onMounted(() => {
  setCommentTheme();
  watchHTMLAttr();
})

const setCommentTheme = () => {
  if (document.documentElement.classList.contains("dark")) {
    theme.value = "dark_dimmed";
  } else {
    theme.value = "light";
  }
}
const watchHTMLAttr = () => {
  ob.value = new MutationObserver(setCommentTheme);
  ob.value.observe(document.documentElement, { attributes: true, childList: false, attributeFilter: ["class"] });
}
onUnmounted(() => {
  ob?.value?.disconnect?.();
})

// 注释掉gittalk，使用giscus
// let gitalkRender = false;

// const loadGitalk = () => {
//   gitalkRender = true;
//   var gitalk = new Gitalk({
//     clientID: __ENV_VARIABLES__?.GITALK_ID,
//     clientSecret: __ENV_VARIABLES__?.GITALK_SECRET,
//     repo: "blog",
//     owner: "ihengshuai",
//     admin: ["ihengshuai"],
//     id: location.pathname,
//   });

//   gitalk.render("gitalk-container");
// };

// let gitalkHost;
// onMounted(() => {
//   if (!__ENV_VARIABLES__?.ENV_PROD) return;
//   gitalkHost = document.createElement("div");
//   gitalkHost.setAttribute("id", "gitalk-container");
//   document.querySelector(".content-container").append(gitalkHost);
//   if (
//     document.documentElement.scrollHeight -
//       document.documentElement.clientHeight <
//     400
//   ) {
//     return setTimeout(loadGitalk, 800);
//   }
//   window.addEventListener("scroll", () => {
//     if (gitalkRender) return;
//     if (
//       document.documentElement.scrollHeight -
//         document.documentElement.scrollTop -
//         document.documentElement.clientHeight <
//       400
//     ) {
//       loadGitalk();
//     }
//   });
// });
// onUnmounted(() => {
//   gitalkHost?.remove();
// });
</script>
