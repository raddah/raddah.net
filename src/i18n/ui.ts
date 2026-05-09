import type { Locale } from './index';

/**
 * UI strings used throughout the site.
 * Keys are dot-namespaced. Add new keys to ALL three locales.
 */
export const ui = {
  ar: {
    'nav.diwan': 'الديوان',
    'nav.projects': 'مشاريع',
    'nav.about': 'عن',
    'nav.search': 'بحث',
    'nav.archives': 'الأرشيف',
    'nav.rss': 'RSS',

    'home.tagline': 'اطلب العلم ولا تكسل، فما أبعد الخير على أهل الكسل',
    'home.featured': 'المقالة الرئيسية',
    'home.recent': 'من الديوان',
    'home.viewAll': 'جميع المقالات',
    'home.volume': 'المجلد الأول',
    'home.posts': 'مقالة منشورة',

    'post.readingTime': 'دقائق قراءة',
    'post.minutes': 'دقيقة',
    'post.publishedOn': 'نُشر في',
    'post.updatedOn': 'حُدِّث في',
    'post.author': 'بقلم',
    'post.tableOfContents': 'المحتويات',
    'post.share': 'مشاركة',
    'post.shareCopy': 'نسخ الرابط',
    'post.shareTwitter': 'X / Twitter',
    'post.shareLinkedin': 'LinkedIn',
    'post.related': 'مقالات ذات صلة',
    'post.previous': 'السابقة',
    'post.next': 'التالية',
    'post.translations': 'متاح بـ',

    'search.placeholder': 'ابحث في المقالات...',
    'search.results': 'نتائج',
    'search.empty': 'لا توجد نتائج',
    'search.navigate': 'تنقّل',
    'search.open': 'فتح',
    'search.close': 'إغلاق',
    'search.loading': 'جاري التحميل...',

    'theme.toggle': 'تبديل النمط',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',

    'about.title': 'عن رَدّه',
    'about.intro': 'مهندس برمجيات، مؤسس ومساهم في مشاريع مفتوحة المصدر.',

    'projects.title': 'المشاريع',
    'projects.intro': 'مشاريع مفتوحة المصدر وأدوات بنيتها على مرّ السنين.',
    'projects.viewRepo': 'المستودع',
    'projects.visit': 'زيارة',

    'footer.brand': 'ديوان رَدّه',
    'footer.tagline': 'مدوّنة شخصيّة في التقنية، البرمجيات، والتأمل.',
    'footer.content': 'المحتوى',
    'footer.links': 'روابط',
    'footer.languages': 'اللغات',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.builtWith': 'مبني بـ Astro و Cloudflare',

    'meta.skip': 'تخطّى إلى المحتوى',
    'meta.menu': 'القائمة',
  },
  en: {
    'nav.diwan': 'Diwan',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.search': 'Search',
    'nav.archives': 'Archives',
    'nav.rss': 'RSS',

    'home.tagline': 'Seek knowledge — and never grow weary; how distant fortune is from the lazy.',
    'home.featured': 'Featured',
    'home.recent': 'From the Diwan',
    'home.viewAll': 'All articles',
    'home.volume': 'Volume One',
    'home.posts': 'articles published',

    'post.readingTime': 'min read',
    'post.minutes': 'minutes',
    'post.publishedOn': 'Published',
    'post.updatedOn': 'Updated',
    'post.author': 'by',
    'post.tableOfContents': 'Contents',
    'post.share': 'Share',
    'post.shareCopy': 'Copy link',
    'post.shareTwitter': 'X / Twitter',
    'post.shareLinkedin': 'LinkedIn',
    'post.related': 'Related articles',
    'post.previous': 'Previous',
    'post.next': 'Next',
    'post.translations': 'Available in',

    'search.placeholder': 'Search articles...',
    'search.results': 'results',
    'search.empty': 'No results found',
    'search.navigate': 'Navigate',
    'search.open': 'Open',
    'search.close': 'Close',
    'search.loading': 'Loading...',

    'theme.toggle': 'Toggle theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    'about.title': 'About Raddah',
    'about.intro': 'Software engineer. Founder and contributor to open-source projects.',

    'projects.title': 'Projects',
    'projects.intro': 'Open-source projects and tools I have built over the years.',
    'projects.viewRepo': 'Repository',
    'projects.visit': 'Visit',

    'footer.brand': 'Raddah Diwan',
    'footer.tagline': 'A personal journal on technology, software, and reflection.',
    'footer.content': 'Content',
    'footer.links': 'Links',
    'footer.languages': 'Languages',
    'footer.rights': 'All rights reserved',
    'footer.builtWith': 'Built with Astro on Cloudflare',

    'meta.skip': 'Skip to content',
    'meta.menu': 'Menu',
  },
  zh: {
    'nav.diwan': '诗集',
    'nav.projects': '项目',
    'nav.about': '关于',
    'nav.search': '搜索',
    'nav.archives': '归档',
    'nav.rss': 'RSS',

    'home.tagline': '求知不倦，懒惰者远离福祉。',
    'home.featured': '精选文章',
    'home.recent': '来自诗集',
    'home.viewAll': '所有文章',
    'home.volume': '第一卷',
    'home.posts': '篇文章',

    'post.readingTime': '分钟阅读',
    'post.minutes': '分钟',
    'post.publishedOn': '发布于',
    'post.updatedOn': '更新于',
    'post.author': '作者',
    'post.tableOfContents': '目录',
    'post.share': '分享',
    'post.shareCopy': '复制链接',
    'post.shareTwitter': 'X / Twitter',
    'post.shareLinkedin': 'LinkedIn',
    'post.related': '相关文章',
    'post.previous': '上一篇',
    'post.next': '下一篇',
    'post.translations': '其他语言',

    'search.placeholder': '搜索文章...',
    'search.results': '个结果',
    'search.empty': '未找到结果',
    'search.navigate': '导航',
    'search.open': '打开',
    'search.close': '关闭',
    'search.loading': '加载中...',

    'theme.toggle': '切换主题',
    'theme.light': '浅色',
    'theme.dark': '深色',

    'about.title': '关于 Raddah',
    'about.intro': '软件工程师，开源项目的创始人和贡献者。',

    'projects.title': '项目',
    'projects.intro': '多年来构建的开源项目和工具。',
    'projects.viewRepo': '代码仓库',
    'projects.visit': '访问',

    'footer.brand': 'Raddah 诗集',
    'footer.tagline': '关于技术、软件与思考的个人日志。',
    'footer.content': '内容',
    'footer.links': '链接',
    'footer.languages': '语言',
    'footer.rights': '版权所有',
    'footer.builtWith': '基于 Astro 与 Cloudflare 构建',

    'meta.skip': '跳到正文',
    'meta.menu': '菜单',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof typeof ui.ar;

/**
 * Translation helper. Returns the translated string for the given key
 * in the given locale, falling back to Arabic if the key is missing.
 */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui.ar[key] ?? key;
  };
}
