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
    lastUpdatedText: '上次更新时间',
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
      {
        text: 'Rust',
        activeMatch: '^/rust/', link: '/rust/questinos'
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
            { text: '图片URL转文件对象file', link: '/guide/js2file' },
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
            { text: 'Promise', link: '/javascript/promise' },
          ]
        }
      ],
      '/rust/': [
        {
          text: 'Rust',
          items: [
            // {
            //   text: 'Rust', link: '/rust/index'
            // },
            {
              text: 'Rust 问题集', link: '/rust/questinos'
            }
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
