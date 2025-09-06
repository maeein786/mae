/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'],
  // Default transformation function
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  // Additional paths to include in the sitemap
  additionalPaths: async (config) => {
    const fs = require('fs');
    const path = require('path');
    
    // Check if sitemap-paths.json exists
    const sitemapPathsFile = path.join(process.cwd(), 'sitemap-paths.json');
    if (fs.existsSync(sitemapPathsFile)) {
      const sitemapPaths = JSON.parse(fs.readFileSync(sitemapPathsFile, 'utf8'));
      return sitemapPaths;
    }
    
    // Fallback to just homepage
    return [{
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    }];
  },
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/server-sitemap.xml`,
    ],
  },
};