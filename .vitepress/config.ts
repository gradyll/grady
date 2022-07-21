import { defineConfigWithTheme } from 'vitepress'

export default defineConfigWithTheme({
  base: '/grady/',
  title: 'Gradyll',
  description: 'This is b vite-ts-blog.',
  // lastUpdated: true,
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
      // { text: '', activeMatch: `^/life/`, link: '/life/eat/index' },

    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/index' },
          ]
        }
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://gradyll.github.io/grady/' },
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
