## 个人技术博客
:::tip
以下为友链格式，评论写下你的信息(不能为空壳及涉及法律等相关反社会的内容)
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

<Friends />

## 团队技术博客

<Gitalk />