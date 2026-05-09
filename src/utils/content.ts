import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n';

/** Get all published posts for a specific locale, sorted newest first */
export async function getPostsByLocale(locale: Locale): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', (entry) => {
    return entry.id.startsWith(`${locale}/`) && !entry.data.draft;
  });

  return posts.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
}

/** Get the featured post (most recent flagged as featured, else most recent) */
export async function getFeaturedPost(locale: Locale): Promise<CollectionEntry<'blog'> | null> {
  const posts = await getPostsByLocale(locale);
  const featured = posts.find((p) => p.data.featured);
  return featured ?? posts[0] ?? null;
}

/** Get N most recent posts excluding a given slug */
export async function getRecentPosts(
  locale: Locale,
  excludeId?: string,
  limit = 6
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getPostsByLocale(locale);
  const filtered = excludeId ? posts.filter((p) => p.id !== excludeId) : posts;
  return filtered.slice(0, limit);
}

/** Strip locale prefix from collection entry ID to get the slug */
export function getSlugFromId(id: string): string {
  return id.replace(/^[a-z]{2}\//, '').replace(/\.(md|mdx)$/, '');
}
