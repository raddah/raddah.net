// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypePrettyCode from 'rehype-pretty-code';

export default defineConfig({
  site: 'https://raddah.net',

  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en', 'zh'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },

  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'ar',
        locales: { ar: 'ar', en: 'en', zh: 'zh-Hans' },
      },
    }),
  ],

  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            light: 'github-light',
            dark: 'github-dark-dimmed',
          },
          keepBackground: false,
        },
      ],
    ],
    shikiConfig: { wrap: true },
  },

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  build: {
    format: 'directory',
    assets: '_assets',
  },

  vite: {
    build: { cssMinify: true },
    plugins: [
      {
        // Provide an empty stub for pagefind in dev mode (built by postbuild in production)
        name: 'pagefind-dev-stub',
        resolveId(id) {
          if (id.includes('/pagefind/pagefind-ui')) return id;
        },
        load(id) {
          if (id.includes('/pagefind/pagefind-ui.js')) {
            return `export default class PagefindUI {
              constructor() {
                console.info('[Pagefind] Search unavailable in dev — run npm run build first.');
              }
            }`;
          }
          if (id.includes('/pagefind/pagefind-ui.css')) {
            return '';
          }
        },
      },
    ],
  },
});
