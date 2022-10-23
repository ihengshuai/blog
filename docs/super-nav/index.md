---
title: 导航指南
description: ihengshuai blog的友链、导航指南、技术博客、个人博客
head:
  - - meta
    - name: keywords
      content: ihengshuai's blog,ihengshuai blog,恒帅的博客,恒帅blog,友链,导航指南,技术博客,团队技术
---

# 导航指南

本篇收纳了一些技术博客和好用的工具网站，个人博客可以自主按照以下提示申请即可，你也可以补充一些比较好的网站，我会及时添加的

## 个人技术博客
:::tip
以下为友链申请格式，评论写下你的信息(不能为空壳及涉及法律等相关反社会的内容)，可以根据评论里的yaml格式书写
:::
```typescript
interface IFriend {
  avatar: string;
  title: string;
  description: string;
  links: Array<{
    icon: 'github' | 'blog' | 'juejin' | 'weibo' | 'twitter' | 'facebook';
    link: string;
  }>
}
```

博客顺序不分前后

<Friends />

## 团队技术博客
<NavExtends />

欢迎补充，不断更新中...

<Gitalk />