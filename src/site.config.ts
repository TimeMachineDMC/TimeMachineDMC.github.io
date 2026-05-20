import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

import site from '../content-site/site.json'

const currentYear = String(new Date().getFullYear())

export const theme: ThemeUserConfig = {
  // [Basic]
  /** Title for your website. Will be used in metadata and as browser tab title. */
  title: site.title,
  /** Will be used in index page & copyright declaration */
  author: site.author,
  /** Description metadata for your website. Can be used in page metadata. */
  description: site.description,
  /** The default favicon for your site which should be a path to an image in the `public/` directory. */
  favicon: site.favicon,
  /** The default social card image for your site which should be a path to an image in the `public/` directory. */
  socialCard: site.socialCard,
  /** Specify the default language for this site. */
  locale: site.locale as ThemeUserConfig['locale'],
  /** Set a logo image to show in the homepage. */
  logo: site.logo,

  titleDelimiter: '•',
  prerender: true, // pagefind search is not supported with prerendering disabled
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // Still in test
  head: [],
  customCss: [],

  /** Configure the header of your site. */
  header: {
    menu: site.header.menu
  },

  /** Configure the footer of your site. */
  footer: {
    // Year format
    year: site.footer.year.replace('{year}', currentYear),
    // year: `© 2019 - ${new Date().getFullYear()}`,
    links: site.footer.links,
    /** Enable displaying a “Astro & Pure theme powered” link in your site’s footer. */
    credits: site.footer.credits,
    /** Optional details about the social media accounts for this site. */
    social: site.footer.social as ThemeUserConfig['footer']['social']
  },

  // [Content]
  content: {
    /** External links configuration */
    externalLinks: {
      content: site.content.externalLinks.content,
      /** Properties for the external links element */
      properties: site.content.externalLinks.properties
    },
    /** Blog page size for pagination (optional) */
    blogPageSize: site.content.blogPageSize,
    /** Share buttons to show */
    // Currently support weibo, x, bluesky
    share: site.content.share as ThemeUserConfig['content']['share']
    /** Enable image captions (default false) */
    // imageCaption: true
  }
}

export const integ: IntegrationUserConfig = {
  // [Links]
  links: {
    logbook: [],
    applyTip: [],
    cacheAvatar: false
  },
  // [Search]
  pagefind: false,
  // [Quote] - 这里的 target 现已改为显示你的个人格言，不再请求外部 API
  quote: {
    server: '',
    target: `() => '${site.quote}'`
  },
  // [Typography]
  typography: {
    class: 'prose text-base',
    blockquoteStyle: 'italic',
    inlineCodeBlockStyle: 'modern'
  },
  // [Lightbox]
  mediumZoom: {
    enable: true,
    selector: '.prose .zoomable',
    options: { className: 'zoomable' }
  },
  // [Comment] - 已关闭
  waline: {
    enable: false,
    server: '',
    additionalConfigs: { pageview: true, comment: false }
  }
}

// Terms 模块已精简为仅保留版权说明
export const terms: CardListData = {
  title: 'Site Policy',
  list: [{ title: 'Copyright', link: '/terms/copyright/' }]
}

const config = { ...theme, integ } as Config
export default config
