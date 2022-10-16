<template>
  <VPTeamMembers size="small" :members="members" />
</template>

<script setup>
import { VPTeamMembers } from "vitepress/theme";
import svgs from "./svg.js";

const members = [
  {
    avatar:
      "https://tva1.sinaimg.cn/large/005HV6Avgy1h76xsijlrij30u00u0diz.jpg",
    name: "ihengshuai",
    title: "A passionate web developer base on ShenZhen",
    links: [
      { icon: "github", link: "http://github.com/ihengshuai" },
      {
        icon: { svg: svgs.blog },
        link: "https://blog.usword.cn",
      },
      {
        icon: { svg: svgs.juejin },
        link: "https://juejin.cn/user/2999123453679656",
      },
    ],
  },
  {
    avatar: "https://www.ruanyifeng.com/blog/images/person2_s.jpg",
    name: "阮一峰",
    title: "阮一峰的网络日志",
    links: [
      { icon: "github", link: "https://github.com/ruanyf" },
      {
        icon: { svg: svgs.blog },
        link: "http://www.ruanyifeng.com/blog",
      },
    ],
  },
];
</script>

<style>
.VPTeamMembersItem.small .profile {
  padding: 20px !important;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
