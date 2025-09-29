import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'React Utils',
  description: 'React utilities for content management',
  base: '/react-utils/',
  
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/client-content' },
      { text: 'Hooks', link: '/hooks/use-window-size' },
      { text: 'Storybook', link: 'https://sarshay.github.io/react-utils/storybook/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'ClientContent', link: '/components/client-content' },
            { text: 'TableOfContents', link: '/components/table-of-contents' },
            { text: 'EndDetect', link: '/components/end-detect' }
          ]
        }
      ],
      '/hooks/': [
        {
          text: 'Hooks',
          items: [
            { text: 'useWindowSize', link: '/hooks/use-window-size' },
            { text: 'useScrollPosition', link: '/hooks/use-scroll-position' },
            { text: 'useLocalStorage', link: '/hooks/use-local-storage' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sarshay/react-utils' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024'
    }
  }
})