import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { getBlogBySlug } from "@/lib/blogs/blog-service";
import { BlogPostContent } from "@/components/customer/blog/blog-post-content";
import { BlogPostSkeleton } from "@/components/customer/blog/blog-post-skeleton";

export const instant = false;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });

    return blogs.length > 0
      ? blogs.map((blog) => ({ slug: blog.slug }))
      : [{ slug: "annual-education-drive-2026" }];
  } catch {
    return [{ slug: "annual-education-drive-2026" }];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug, true);

  if (!blog) {
    return {
      title: "Story Not Found | Samartha Trust",
      description: "The requested story or article could not be located.",
    };
  }

  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt || undefined;

  return {
    title: `${title} | Samartha Trust`,
    description,
    openGraph: {
      title: `${title} | Samartha Trust`,
      description,
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
      authors: [blog.authorName],
      images: blog.coverImage
        ? [{ url: blog.coverImage, alt: blog.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Samartha Trust`,
      description,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

async function BlogPostContentWrapper({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContentWrapper params={params} />
    </Suspense>
  );
}
