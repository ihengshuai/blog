<template>
  <div class="reward-divider" />
  <figure>
    <figcaption>
      若您在阅读过程中发现一些错误：如语句不通、文字、逻辑等错误，可以在评论区指出，我会及时调整修改，感谢您的阅读。同时您觉得这篇文章对您有帮助的话，可以打赏作者一笔作为鼓励，金额不限，感谢支持🤝。
    </figcaption>
    <div style="text-align: center;margin-top: 2em;">
      <img
        style="display: inline"
        src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72anu40usj30dw0dw40j.jpg"
        width="200"
        alt="支付宝捐赠"
      />
      <img
        style="display: inline"
        src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h72ap99ym1j30b40b4abq.jpg"
        width="200"
        alt="微信支付捐赠"
      />
    </div>
  </figure>
  <div class="reward-divider" />
  <div class="share_wrap">
    <a :href="weiboLink" target="_blank">
      <img
        src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-weibo.png"
        alt="share to weibo"
        title="分享到微博"
      />
    </a>
    <a :href="twitterLink" target="_blank">
      <img
        src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-twitter.png"
        alt="share to twitter"
        title="分享到twitter"
      />
    </a>
    <a :href="facebookLink" target="_blank">
      <img
        src="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-facebook.png"
        alt="share to facebook"
        title="分享到facebook"
      />
    </a>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"

const weiboLink = ref('#');
const twitterLink = ref('#');
const facebookLink = ref('#');

onMounted(() => {
  const title = document.title;
  const description = document.head.querySelector("meta[name='description']").content;
  const pageLink = location.href;

  weiboLink.value = `https://service.weibo.com/share/share.php?url=${pageLink}&platform=weibo&title=${title}`;
  twitterLink.value = `https://twitter.com/intent/tweet?text=${description}&url=${pageLink}?platform=twitter`;
  facebookLink.value = `https://www.facebook.com/sharer/sharer.php?u=${pageLink}&platform=facebook`;
})
</script>

<style>
.reward-divider {
  height: 1px;
  border-top: 1px dashed rgb(181, 180, 180);
  margin: 16px 0;
}
.share_wrap {
  text-align: center;
}
.share_wrap a{
  display: inline-block;
  margin: 0 4px;
}
.share_wrap img {
  width: 40px;
  height: 40px;
  border-radius:  50%;
}

@media screen and (max-width: 700px) {
  .share_wrap img {
    width: 28px;
    height: 28px;
  }
}
</style>
