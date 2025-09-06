import path from "path";
import { promises as fs } from "fs";
import fsSync from "fs";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { formatDate } from "../lib/utils";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { generateBlogPostMetadata } from "../lib/metadata";
import { generateBlogPostingSchema, generateBreadcrumbSchema } from "../lib/structuredData";
import { StructuredData } from "../components/StructuredData";
import { useMDXComponents } from "../components/mdx-components";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);

  if (!fsSync.existsSync(filePath)) {
    notFound();
  }

  const fileContents = await fs.readFile(filePath, "utf8");
  const { data } = matter(fileContents);

  return generateBlogPostMetadata({
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    author: data.author,
    slug,
    imageUrl: data.imageUrl,
  });
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "content/blog");
  const filenames = await fs.readdir(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(/\.mdx$/, ""),
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);

  if (!fsSync.existsSync(filePath)) {
    notFound();
  }

  const fileContents = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const blogPostingSchema = generateBlogPostingSchema({
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    modified: data.modified,
    author: data.author,
    slug,
    imageUrl: data.imageUrl,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(slug);

  return (
    <article>
      <StructuredData data={blogPostingSchema} />
      <StructuredData data={breadcrumbSchema} />
      <div className="mx-auto flex flex-col gap-4 text-center">
        <h1
          className="mt-2 inline-block animate-slide-up-fade bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-title text-4xl font-light tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          style={{
            animationDuration: "700ms",
            animationFillMode: "backwards",
          }}
        >
          {data.title}
        </h1>
        <p
          className="mx-auto max-w-[65ch] animate-slide-up-fade leading-6 text-gray-600 md:leading-7 dark:text-gray-300"
          style={{
            animationDuration: "800ms",
            animationFillMode: "backwards",
          }}
        >
          {data.excerpt}
        </p>
        <div
          className="mx-auto flex animate-slide-up-fade items-center gap-1"
          style={{
            animationDuration: "900ms",
            animationFillMode: "backwards",
          }}
        >
          <time className="text-orange-400" dateTime={formatDate(data.date)}>
            {formatDate(data.date)}
          </time>
          <span className="text-gray-600 dark:text-gray-300">·</span>
          <span className="text-gray-600 dark:text-gray-300">
            by {data.author}
          </span>
        </div>
      </div>
      <div
        className="prose prose-gray mx-auto mt-12 animate-slide-up-fade dark:prose-invert"
        style={{
          animationDuration: "1000ms",
          animationFillMode: "backwards",
        }}
      >
        <MDXRemote
          source={content}
          components={useMDXComponents({})}
        />
      </div>
    </article>
  );
}
