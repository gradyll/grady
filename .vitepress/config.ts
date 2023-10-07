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
      // {
      //   text: 'Rust',
      //   activeMatch: '^/rust/', link: '/rust/questinos'
      // },
      { text: '生活随录', activeMatch: '^/life/', link: '/life/index' },
      { text: 'vitepress', link: 'https://vitepress.vuejs.org/' },

    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          collapsible: true,
          collapsed: false, // 默认展开还是收起
          items: [
            { text: 'Introduction', link: '/guide/index' },
            { text: 'vite-plugin-svg-icons', link: '/guide/vue3_vite' },
            { text: 'reduce 的用法', link: '/guide/reduce' },
            { text: '图片URL转文件对象file', link: '/guide/js2file' },
          ]
        },
        {
          text: '设计模式与开发实践',
          collapsible: true,
          items: [
            { text: '基础部分', link: '/guide/design-pattern' },
            { text: '设计模式', link: '/guide/design-pattern_2' },
          ]
        },
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
          collapsible: true,
          items: [
            { text: 'javascript基础面试题', link: '/javascript/index' },
            { text: 'javascript进阶(手写)', link: '/javascript/advance' },
            { text: 'Promise', link: '/javascript/promise' },
            { text: '精通Git', link: '/javascript/Git' },
            { text: '混合APP与H5的区别', link: '/javascript/h5' },
            { text: 'mockjs拦截原理', link: '/javascript/mockjs拦截原理' },
          ]
        },
      ],
      // '/rust/': [
      //   {
      //     text: 'Rust',
      //     items: [
      //       {
      //         text: 'Rust', link: '/rust/index'
      //       },
      //       {
      //         text: 'Rust 问题集', link: '/rust/questinos'
      //       }
      //     ]
      //   }
      // ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gradyll/grady' },
    ],
    editLink: {
      pattern: 'https://gradyll.github.io/grady/:path',
      text: '点击编辑此页面'
    },
    outline: 'deep',
    outlineTitle: '目录',
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2022-${new Date().getFullYear()} Gradyll`
    },
    algolia: {
      appId: 'ZEA6C6A7H5', // 需要替换
      apiKey: '41cc42c828ad654f92bddf233903b280', // 需要替换
      indexName: 'grady', // 需要替换
      placeholder: '请输入关键词',
      buttonText: '搜索',
      insights: true,
      container: '### REPLACE ME WITH A CONTAINER (e.g. div) ###',
      debug: false,
      translations: {
        button: {
          buttonText: '搜索文档',
        },
      },
    }
  },
  srcDir: 'src',
  scrollOffset: 'header',
})
