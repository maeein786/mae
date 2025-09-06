const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function generateSitemap() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  const fileNames = fs.readdirSync(postsDirectory);
  
  const blogPosts = fileNames.map(fileName => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      slug: fileName.replace(/\.mdx$/, ''),
      date: data.date,
      modified: data.modified,
      title: data.title,
    };
  });

  const sitemapPaths = [
    {
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    },
    ...blogPosts.map(post => ({
      loc: `/${post.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: post.modified || post.date,
    })),
  ];

  // Write the paths to a temporary file for next-sitemap to use
  fs.writeFileSync(
    path.join(process.cwd(), 'sitemap-paths.json'),
    JSON.stringify(sitemapPaths, null, 2)
  );

  console.log('Sitemap paths generated successfully');
}

generateSitemap().catch(console.error);