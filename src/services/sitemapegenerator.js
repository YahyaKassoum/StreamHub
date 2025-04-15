export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).end(`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- الروابط هنا -->
    <url>
    <loc>https://stream-hub-movies.vercel.app/</loc>
    <lastmod>2025-04-09T03:10:21.700Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://stream-hub-movies.vercel.app/Movies</loc>
    <lastmod>2025-04-09T03:10:21.702Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://stream-hub-movies.vercel.app/Series</loc>
    <lastmod>2025-04-09T03:10:21.702Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://stream-hub-movies.vercel.app/Anime</loc>
    <lastmod>2025-04-09T03:10:21.700Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  </urlset>`);
  }
  