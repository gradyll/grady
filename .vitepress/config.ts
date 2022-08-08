import { defineConfigWithTheme } from 'vitepress'

export default defineConfigWithTheme({
  base: '/grady/',
  title: 'Gradyll',
  description: 'This is b vite-ts-blog.',
  lastUpdated: true,
  lang: 'en-US',
  head: [
    ["link", { rel: "icon", href: "/grady/logo.png" }]
  ],
  themeConfig: {
    // outlineTitle: 'In hac pagina',
    siteTitle: 'Gradyll',
    logo: '/logo.png',
    nav: [
      { text: 'Guide', activeMatch: `^/guide/`, link: '/guide/index', },
      {
        text: '源码分析',
        activeMatch: '^/(vueAnalysis|vueNextAnalysis)/',
        items: [
          // { text: 'Vue2源码分析', link: '/vueAnalysis/index' },
          { text: 'Vue3源码分析', link: '/vueNextAnalysis/index' },
        ]
      },
      {
        text: '面试之道',
        activeMatch: '^/javascript/',
        items: [
          { text: 'javascript', link: '/javascript/index' }
        ]
      },
      { text: 'vitepress', link: 'https://vitepress.vuejs.org/' },

    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/index' },
            { text: 'vite-plugin-svg-icons', link: '/guide/vue3_vite' },
            { text: 'reduce 的用法', link: '/guide/reduce' },
          ]
        }
      ],
      // '/vueAnalysis/': [
      //   {
      //     text: 'Vue',
      //     items: [
      //       { text: 'Vue2', link: '/vueAnalysis/index' },
      //     ]
      //   }
      // ],
      '/vueNextAnalysis/': [
        {
          text: 'Vue',
          items: [
            { text: 'Vue3', link: '/vueNextAnalysis/index' },
          ]
        }
      ],
      '/javascript/': [
        {
          text: '面试之道',
          items: [
            { text: 'javascript基础面试题', link: '/javascript/index' },
            { text: 'javascript进阶', link: '/javascript/advance' },
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gradyll/grady' },
    ],
    editLink: {
      pattern: 'https://gradyll.github.io/grady/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2022-${new Date().getFullYear()} Gradyll`
    }
  },
  srcDir: 'src',
  scrollOffset: 'header',
})
