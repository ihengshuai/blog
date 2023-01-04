import DefaultTheme from 'vitepress/theme'
import Gitalk from './components/gitalk.vue'
import NavExtends from './components/nav-extends.vue'
import Friends from './components/friends.vue'
import Reward from './components/reward.vue'
import { onMounted } from "vue"
import { initPwa } from "../util/pwa.js"
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Reward', Reward)
    app.component('Gitalk', Gitalk)
    app.component('NavExtends', NavExtends)
    app.component('Friends', Friends)
  },
  setup() {
    onMounted(() => {
      initPwa();
    })
  }
}
