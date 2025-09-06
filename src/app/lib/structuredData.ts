export interface BlogPostData {
  title: string;
  excerpt: string;
  date: string;
  modified?: string;
  author: string;
  slug: string;
  imageUrl?: string;
}

export function generateBlogPostingSchema(post: BlogPostData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const postUrl = `${siteUrl}/${post.slug}`;
  const imageUrl = post.imageUrl || `${siteUrl}/og-image.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    url: postUrl,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Next.js Blog",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };
}

export function generateBreadcrumbSchema(slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const postUrl = `${siteUrl}/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: slug,
        item: postUrl,
      },
    ],
  };
}

export function generateOrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Next.js Blog",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.jpg`,
    },
    sameAs: [
      "https://twitter.com/nextjs",
      "https://github.com/vercel/next.js",
    ],
  };
}

export function generateWebsiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Next.js Blog",
    url: siteUrl,
    description: "A barebones Next.js (SSG) blog showcasing Sevalla's static site hosting.",
    publisher: {
      "@type": "Organization",
      name: "Next.js Blog",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}