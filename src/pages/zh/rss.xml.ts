import rss from '@astrojs/rss';
import { getPostsByLocale, getSlugFromId } from '@/utils/content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getPostsByLocale('zh');
  return rss({
    title: 'raddah.net — Raddah 的笔记',
    description: '关于技术、开源软件与思考的个人博客。',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/zh/blog/${getSlugFromId(post.id)}/`,
    })),
    customData: `<language>zh-Hans</language>`,
  });
};
