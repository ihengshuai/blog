<template>
  <div>
    <ul class="card-link">
      <li
        :class="`card-link-item ${idx > 1 && 'top'}`"
        v-for="(item, idx) in blogs"
        :key="item"
      >
        <a :href="`${item.link}?referrer=blog.usword.cn`" target="_blank">
          <figure>
            <img class="logo" :src="item.avatar" :alt="item.title" />
          </figure>
          <div class="card-link-content">
            <div class="card-link-content-title">{{ item.title }}</div>
            <div class="card-link-content-desc">{{ item.desc }}</div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const blogs = [
  {
    avatar:
      "https://img.alicdn.com/tps/TB1Nv_wKXXXXXbmXVXXXXXXXXXX-295-195.png",
    title: "淘系前端团队（FED）",
    desc: "用技术为体验提供无限可能",
    link: "https://fed.taobao.org/blogs",
  },
  {
    avatar:
      "http://www.alloyteam.com/wp-content/uploads/2015/01/AlloyTeam_avatar.png",
    title: "腾讯AlloyTeam团队",
    desc: "腾讯全端 AlloyTeam 团队 Blog",
    link: "http://www.alloyteam.com/page/0/",
  },
  {
    avatar: "http://fex.baidu.com/public/images/logo.svg",
    title: "百度前端团队",
    desc: "百度前端团队Blog",
    link: "http://fex.baidu.com/",
  },
  {
    avatar:
      "https://img12.360buyimg.com/ling/s420x420_jfs/t25921/163/228025270/29121/126c575d/5b69b0d4N7ae8c0f0.png.webp",
    title: "凹凸实验室中台设计部",
    desc: "O2 Lab 来自京东零售集团，创建于2015年10月，是一个专注于用户体验及产品价值提升的产品研发团队",
    link: "https://jelly.jd.com/teamhome/5b0ff3a0629834a34b663617/",
  },
  {
    avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/logo.png",
    title: "有赞技术团队",
    desc: "有赞的介绍 有赞，是一个商家服务公司。我们通过产品和服务，帮助互联网时代的生意人私有化顾客资产、拓展互联网客群、提高经营效率，全面助力商家成功。 ",
    link: "https://tech.youzan.com/tag/front-end/",
  },
  {
    avatar: "https://static.zaozao.run/website/prod/1.0.24/icons/logo-72.png",
    title: "前端早早聊",
    desc: "前端早早聊大会网站",
    link: "https://www.zaozao.run",
  },
  {
    avatar:
      "https://p3-passport.byteimg.com/img/user-avatar/8235463c80ecb19922c8ee10c40a1ca6~180x180.awebp",
    title: "奇舞周刊",
    desc: "领略前端技术 阅读奇舞周刊",
    link: "https://weekly.75.team/",
  },
  {
    avatar:
      "https://p3-passport.byteimg.com/img/user-avatar/2fcea6a9c80b959f2f0e11c9d8667dc3~180x180.awebp",
    title: "Elab团队",
    desc: "字节跳动大力教育前端团队，负责教育全线产品前端开发工作。",
    link: "https://juejin.cn/user/4169764695465239",
  },
];
</script>

<style>
.card-link {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 0 !important;
}
.card-link-item {
  padding: 16px;
  border-radius: 12px;
  list-style: none;
  width: 48%;
  display: inline-block;
  background-color: var(--vp-c-bg-soft);
  transition: all 400ms ease;
}
.card-link-item:hover {
  box-shadow: 0 0 16px 0 var(--vp-c-text-4);
}
.card-link-item a {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
}
.card-link-item figure {
  width: 64px;
  height: 64px;
}
.card-link-item figure img {
  border-radius: 50% !important;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.card-link-content {
  padding-left: 12px;
  flex: 1;
  min-width: 0;
  color: var(--vp-c-text-1);
}
.card-link-content-title,
.card-link-content-desc {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-link-content-desc {
  color: var(--vp-c-text-2);
}
.card-link li + li {
  margin-top: 0 !important;
}
.card-link-item.top {
  margin-top: 12px !important;
}

@media screen and (max-width: 600px) {
  .card-link-item {
    width: 100%;
  }
  .card-link li + li {
    margin-top: 12px !important;
  }
}
</style>
