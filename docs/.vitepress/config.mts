import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Mr. Meeseeks',
  description: 'Helper functions library — standardized by AGENTS.md',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Helpers', link: '/helpers/' },
    ],
    sidebar: [
      {
        text: 'Helpers',
        items: [
          { text: 'Overview', link: '/helpers/' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jeanfs-tt/mr-meeseeks' },
    ],
  },
});
