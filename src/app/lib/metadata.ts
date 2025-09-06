import type { Metadata } from "next";

export interface BlogPostMeta {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  imageUrl?: string;
}

export function generateBlogPostMetadata(post: BlogPostMeta): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const canonicalUrl = `${siteUrl}/${post.slug}`;
  const imageUrl = post.imageUrl || `${siteUrl}/og-image.jpg`;

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export function generateSiteMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const siteTitle = "Landmark";
  const siteDescription = "A barebones Next.js (SSG) blog showcasing Sevalla's static site hosting.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      type: "website",
      url: siteUrl,
      siteName: siteTitle,
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: [`${siteUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}