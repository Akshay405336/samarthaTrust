import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Share2,
  Heart,
  ChevronRight,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { getBlogBySlug } from "@/lib/blogs/blog-service";
import { calculateReadTime } from "@/lib/validations/blog";
import { ArticleContent } from "@/components/customer/article-content";

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
    if (blogs.length > 0) {
      return blogs.map((b) => ({ slug: b.slug }));
    }
  } catch {
    // In environments where database is unreachable at build time, provide fallback
  }

  // Next.js 16 with Cache Components requires generateStaticParams to return at least one result for build validation
  return [{ slug: "annual-education-drive-2026" }];
}

/**
 * Generates dynamic SEO metadata for the blog post.
 */
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
  const description = (blog.metaDescription || blog.excerpt) ?? undefined;

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
        ? [
            {
              url: blog.coverImage,
              alt: blog.title,
            },
          ]
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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-white py-16">
          <Container className="max-w-4xl text-center">
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F52232] border-t-transparent" />
              <p className="text-xs text-[#78685D]">Loading story...</p>
            </div>
          </Container>
        </div>
      }
    >
      <BlogPostContent params={params} />
    </React.Suspense>
  );
}

async function BlogPostContent({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Fetch strictly published blog. Drafts & archived posts will return null and trigger notFound()
  const blog = await getBlogBySlug(slug, true);

  if (!blog) {
    notFound();
  }

  const readTime = calculateReadTime(blog.content);

  // Fetch related stories (same category first, fallback to other published stories)
  let relatedBlogs = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: blog.id },
      category: blog.category,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  if (relatedBlogs.length < 3) {
    const excludedIds = [blog.id, ...relatedBlogs.map((b) => b.id)];
    const fallbackBlogs = await prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
        id: { notIn: excludedIds },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3 - relatedBlogs.length,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    relatedBlogs = [...relatedBlogs, ...fallbackBlogs];
  }

  const publishedDateFormatted = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Published";

  return (
    <article className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#EADCCB]/60 bg-[#FFFCF5]/50 py-3.5">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center space-x-2 text-xs sm:text-sm text-[#78685D] overflow-x-auto whitespace-nowrap"
          >
            <Link href="/" className="hover:text-[#F52232] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#EADCCB]" />
            <Link
              href="/blog"
              className="hover:text-[#F52232] transition-colors"
            >
              Stories & Updates
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#EADCCB]" />
            <Link
              href={`/blog?category=${encodeURIComponent(blog.category)}`}
              className="hover:text-[#F52232] transition-colors"
            >
              {blog.category}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#EADCCB]" />
            <span
              className="truncate font-medium text-[#492A22] max-w-[220px] sm:max-w-[340px]"
              title={blog.title}
            >
              {blog.title}
            </span>
          </nav>
        </Container>
      </div>

      {/* Article Header & Lead */}
      <header className="pt-10 pb-8 sm:pt-14 sm:pb-10">
        <Container className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <Badge
              variant="outline"
              className="border-[#F52232]/30 bg-[#FFF5E6] text-[#F52232] font-semibold text-xs px-3 py-1 uppercase tracking-wider shadow-2xs"
            >
              {blog.category}
            </Badge>

            {blog.isFeatured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#F52232] px-3 py-0.5 text-xs font-bold text-white shadow-2xs">
                <Sparkles className="h-3 w-3" />
                Featured Story
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#492A22] sm:text-4xl lg:text-5xl leading-[1.2] sm:leading-[1.2]">
            {blog.title}
          </h1>

          {/* Meta Info Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-y-3 gap-x-6 border-y border-[#EADCCB]/70 py-4 text-xs sm:text-sm text-[#78685D]">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF5E6] text-[#F52232] font-bold">
                <User className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-[#78685D]/70 font-semibold">
                  Written by
                </span>
                <span className="font-semibold text-[#492A22]">
                  {blog.authorName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF5E6] text-[#F52232]">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-[#78685D]/70 font-semibold">
                  Published on
                </span>
                <span className="font-medium text-[#492A22]">
                  {publishedDateFormatted}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF5E6] text-[#F52232]">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-[#78685D]/70 font-semibold">
                  Reading time
                </span>
                <span className="font-medium text-[#492A22]">
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Featured Cover Image */}
      {blog.coverImage && (
        <div className="pb-8">
          <Container className="max-w-4xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#EADCCB] bg-[#FFFCF5] shadow-md">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </Container>
        </div>
      )}

      {/* Article Body Container */}
      <section className="pb-16 pt-2">
        <Container className="max-w-4xl">
          {/* Excerpt Lead */}
          {blog.excerpt && (
            <div className="mb-8 rounded-2xl border-l-4 border-[#F52232] bg-[#FFFCF5] p-6 shadow-2xs">
              <p className="text-lg sm:text-xl font-medium leading-relaxed text-[#492A22]/95 italic">
                &ldquo;{blog.excerpt}&rdquo;
              </p>
            </div>
          )}

          {/* Formatted Content */}
          <ArticleContent content={blog.content} />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 border-t border-[#EADCCB] pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-[#F52232]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#492A22]">
                  Related Topics & Focus Areas
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?search=${encodeURIComponent(tag)}`}
                  >
                    <Badge
                      variant="outline"
                      className="border-[#EADCCB] bg-white text-[#78685D] hover:border-[#F52232] hover:text-[#F52232] hover:bg-[#FFF5E6] transition-colors py-1 px-3 text-xs cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Social Share & Navigation Strip */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#EADCCB] bg-[#FFFCF5] p-5">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#492A22] hover:text-[#F52232] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all stories</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78685D] uppercase tracking-wider">
                <Share2 className="h-3.5 w-3.5 text-[#F52232]" />
                Share:
              </span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${blog.title} - Read more on Samartha Trust`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#EADCCB] bg-white text-[#78685D] hover:border-[#F52232] hover:text-[#F52232] transition-colors text-xs font-bold"
                title="Share on WhatsApp"
              >
                WA
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  blog.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#EADCCB] bg-white text-[#78685D] hover:border-[#F52232] hover:text-[#F52232] transition-colors text-xs font-bold"
                title="Share on X / Twitter"
              >
                X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#EADCCB] bg-white text-[#78685D] hover:border-[#F52232] hover:text-[#F52232] transition-colors text-xs font-bold"
                title="Share on LinkedIn"
              >
                IN
              </a>
            </div>
          </div>

          {/* Call to Action Support Card */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#492A22] to-[#341d17] p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#FFD21C]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFD21C]">
                  <Heart className="h-3.5 w-3.5 fill-[#FFD21C]" />
                  Partner with Us
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Inspired by this transformation?
                </h3>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  Every project at Samartha Trust is driven by supporters like
                  you. Help us sustain rural education, community health, and
                  livelihood training programs.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full bg-[#F52232] hover:bg-[#C4111F] text-white font-semibold cursor-pointer shadow-md">
                    Support Our Mission
                  </Button>
                </Link>
                <Link href="/blog" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10 cursor-pointer"
                  >
                    More Stories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Stories Section */}
      {relatedBlogs.length > 0 && (
        <section className="border-t border-[#EADCCB] bg-[#FFFCF5] py-16">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F52232]">
                  Explore Further
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#492A22] mt-1">
                  More Stories & Field Reports
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F52232] hover:text-[#C4111F] transition-colors"
              >
                <span>View all stories</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((item) => (
                <Card
                  key={item.id}
                  className="flex flex-col overflow-hidden border border-[#EADCCB] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FFF5E6]">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#78685D]">
                        <BookOpen className="h-10 w-10 text-[#EADCCB]" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="bg-white/95 text-[#492A22] text-[11px] font-semibold backdrop-blur-xs border border-[#EADCCB] shadow-2xs"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-2 text-xs text-[#78685D]">
                      <Calendar className="h-3.5 w-3.5 text-[#F52232]" />
                      <span>
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "Recently"}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-base font-bold text-[#492A22] group-hover:text-[#F52232] transition-colors">
                      <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                    </h3>

                    {item.excerpt && (
                      <p className="mt-2 line-clamp-2 text-xs text-[#78685D] leading-relaxed">
                        {item.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-[#EADCCB]/60 flex items-center justify-between text-xs font-semibold text-[#F52232]">
                      <Link
                        href={`/blog/${item.slug}`}
                        className="inline-flex items-center gap-1 group-hover:underline"
                      >
                        <span>Read Story</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
