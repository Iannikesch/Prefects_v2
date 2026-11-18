import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static build for Vercel. URLs have no trailing slash (/about), matching
// the live site's URLs.
export default defineConfig({
  site: 'https://profectusagency.com',
  trailingSlash: 'never',
  // Sitemap at /sitemap-index.xml. Draft and reference pages stay out.
  integrations: [sitemap({
    filter: (page) => !/\/(reimagined|_|case-studies)/.test(new URL(page).pathname),
  })],
});
