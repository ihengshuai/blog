<template>
  <div id="gitalk-container">
  </div>
</template>

<script setup>
import { onMounted } from "vue"

let gitalkRender = false;

const loadGitalk = () => {
  var gitalk = new Gitalk({
      clientID: __ENV_VARIABLES__?.GITALK_ID,
      clientSecret: __ENV_VARIABLES__?.GITALK_SECRET,
      repo: 'blog',
      owner: 'ihengshuai',
      admin: ['ihengshuai'],
      id: location.pathname,
    })

    gitalk.render('gitalk-container');
}

onMounted(() => {
  window.addEventListener("scroll", () => {
    if (gitalkRender) return;
    if (document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.clientHeight < 400) {
      gitalkRender = true;
      loadGitalk();
    }
  });
})
</script>
