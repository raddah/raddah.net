import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog collection — Markdown/MDX files organized by locale folder.
 * src/content/blog/ar/*.md
 * src/content/blog/en/*.md
 * src/content/blog/zh/*.md
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('Raddah'),
      heroImage: z.string().optional(),
      heroImageAlt: z.string().optional(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      /** Map of locale → slug for translations of this post */
      translations: z.record(z.string()).optional(),
    }),
});

export const collections = { blog };
