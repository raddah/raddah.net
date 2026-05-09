import rss from '@astrojs/rss';
import { getPostsByLocale, getSlugFromId } from '@/utils/content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getPostsByLocale('ar');
  return rss({
    title: 'raddah.net — ديوان رَدّه',
    description: 'مدوّنة شخصية في التقنية والبرمجيات المفتوحة المصدر',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/ar/blog/${getSlugFromId(post.id)}/`,
    })),
    customData: `<language>ar</language>`,
  });
};
