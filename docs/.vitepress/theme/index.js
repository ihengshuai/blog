import DefaultTheme from 'vitepress/theme'
import Gitalk from './components/gitalk.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Gitalk', Gitalk)
  }
}
