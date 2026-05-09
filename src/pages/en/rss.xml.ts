import rss from '@astrojs/rss';
import { getPostsByLocale, getSlugFromId } from '@/utils/content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getPostsByLocale('en');
  return rss({
    title: "raddah.net — Raddah's Diwan",
    description: 'A personal blog on technology, open-source software, and reflection.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/en/blog/${getSlugFromId(post.id)}/`,
    })),
    customData: `<language>en</language>`,
  });
};
