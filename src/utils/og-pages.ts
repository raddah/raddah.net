import { getCollection } from 'astro:content';
import { locales, localeConfig } from '@/i18n';
import { useTranslations } from '@/i18n/ui';
import { getSlugFromId } from './content';

export interface OGPageEntry {
  title: string;
  description: string;
  dir: 'rtl' | 'ltr';
  theme: 'light' | 'dark';
}

export async function buildOGPages(): Promise<Record<string, OGPageEntry>> {
  const pages: Record<string, OGPageEntry> = {};
  const allPosts = await getCollection('blog', (entry) => !entry.data.draft);

  for (const locale of locales) {
    const dir = localeConfig[locale].dir;
    const t = useTranslations(locale);

    const localePosts = allPosts.filter((p) => p.id.startsWith(`${locale}/`));
    for (const post of localePosts) {
      const slug = getSlugFromId(post.id);
      pages[`${locale}/blog/${slug}`] = {
        title: post.data.title,
        description: post.data.description,
        dir,
        theme: 'light',
      };
    }

    pages[`${locale}/index`] = {
      title: t('home.tagline'),
      description: `raddah.net — ${localeConfig[locale].nativeName}`,
      dir,
      theme: 'dark',
    };

    pages[`${locale}/about`] = {
      title: t('about.title'),
      description: t('about.intro'),
      dir,
      theme: 'dark',
    };

    pages[`${locale}/projects`] = {
      title: t('projects.title'),
      description: t('projects.intro'),
      dir,
      theme: 'dark',
    };

    pages[`${locale}/archives`] = {
      title: t('nav.archives'),
      description: `raddah.net — ${t('nav.archives')}`,
      dir,
      theme: 'dark',
    };

    pages[`${locale}/search`] = {
      title: t('nav.search'),
      description: `raddah.net — ${t('nav.search')}`,
      dir,
      theme: 'dark',
    };

    pages[`${locale}/blog/index`] = {
      title: t('nav.diwan'),
      description: `raddah.net — ${t('home.recent')}`,
      dir,
      theme: 'dark',
    };
  }

  return pages;
}
