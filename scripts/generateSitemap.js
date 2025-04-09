import { globby } from 'globby';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateSitemap() {
  try {
    const pages = await globby([
      'src/pages/**/*.tsx',
      '!src/pages/**/[*',
      '!src/pages/_*',
    ]);

    const siteUrl = 'https://stream-hub-movies.vercel.app';

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const route = page
            .replace('src/pages', '')
            .replace('.tsx', '')
            .replace('/index', '');

          return `
        <url>
          <loc>${siteUrl}${route}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `;
        })
        .join('')}
    </urlset>`;

    // Ensure public directory exists
    await fs.ensureDir('public');
    
    // Write sitemap
    await fs.writeFile('public/sitemap.xml', sitemap);
    console.log('✅ Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();