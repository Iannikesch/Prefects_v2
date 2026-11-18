// Content collections. Insights posts are generated from the Word docs by
// scripts/convert-insights.mjs; a post with bad frontmatter fails the build.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { INSIGHT_CATEGORIES } from './data/insights.js';

const insights = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/insights' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(10),
      description: z.string().min(50).max(200),
      category: z.enum(Object.keys(INSIGHT_CATEGORIES) as [string, ...string[]]),
      number: z.number().int().min(1).max(100),
      image: image(),
      author: z.literal('The Profectus Team'),
      pubDate: z.coerce.date(),
    }),
});

export const collections = { insights };
