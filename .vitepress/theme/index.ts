import './styles/index.css'
import Layout from './components/Layout.vue'
import ArticleList from './components/articleList.vue'
import DefaultTheme from 'vitepress/theme'
import { h, App } from 'vue'
export default {
  // root component to wrap each page
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'sidebar-top': () => h('div', 'hello top'),
      // 'sidebar-bottom': () => h('div', 'hello bottom'),
      // 'content-top': () => h('h1', 'Announcement!'),
      // 'content-bottom': () => h('div', 'Some ads'),
      // 'aside-top': () => h('div', 'this could be huge'),
      // 'aside-mid': () => h('div', { style: { height: '300px' }}, 'Sponsors'),
      // 'aside-bottom': () => h('div', { style: { height: '300px' }}, 'Sponsors'),
      // 'aside-bottom': () => h(VueJobs)
    })
  },
  // this is a Vue 3 functional component
  NotFound: () => 'custom 404',

  enhanceApp({ app }: { app: App }) {
    app.component('article-list', ArticleList)
    // app is the Vue 3 app instance from `createApp()`.
    // router is VitePress' custom router. `siteData` is
    // a `ref` of current site-level metadata.
    // app.component('VueSchoolLink', VueSchoolLink)
  }
}
