import { defineConfig } from 'astro/config';

// Static build for Vercel. URLs have no trailing slash (/about), matching
// the live site's URLs.
export default defineConfig({
  site: 'https://profectusagency.com',
  trailingSlash: 'never',
});
