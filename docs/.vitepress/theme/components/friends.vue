<template>
  <CardLink :members="members" />
</template>

<script setup>
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
];
</script>

<style>
.VPTeamMembersItem.small .profile {
  padding: 20px !important;
}
</style>
