<template>
  <Layout>
    <template #doc-after>
      <div class="comments">
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
          :theme="isDark ? 'dark' : 'light'"
          lang="zh-CN"
          loading="lazy"
        />
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { onUpdated, onMounted, watch } from "vue"
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Giscus from '@giscus/vue'
const { isDark } = useData()
const { Layout } = DefaultTheme

onUpdated(() => {
  console.log(2222)
})

onMounted(() => {
  console.log(111111)
})
</script>

<style scoped>
.comments {
  margin-top: 2rem;
}
</style>