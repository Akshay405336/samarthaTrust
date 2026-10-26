import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Heart,
  Share2,
  Sparkles,
  Tag,
  UserRound,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleContent } from "@/components/customer/article-content";
import { getBlogBySlug } from "@/lib/blogs/blog-service";
import { calculateReadTime } from "@/lib/validations/blog";
import { prisma } from "@/lib/db/prisma";

interface BlogPostContentProps {
  slug: string;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "Recently published";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function BlogPostContent({ slug }: BlogPostContentProps) {
  const blog = await getBlogBySlug(slug, true);

  if (!blog) notFound();

  const readTime = calculateReadTime(blog.content);

  const relatedWhere = {
    status: "PUBLISHED" as const,
    id: { not: blog.id },
  };

  const [sameCategoryBlogs, otherBlogs] = await Promise.all([
    prisma.blog.findMany({
      where: {
        ...relatedWhere,
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
    }),
    prisma.blog.findMany({
      where: relatedWhere,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 6,
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
    }),
  ]);

  const relatedBlogs = [
    ...sameCategoryBlogs,
    ...otherBlogs.filter(
      (item) => !sameCategoryBlogs.some((related) => related.id === item.id)
    ),
  ].slice(0, 3);

  return (
    <article className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-[#EADDED] bg-white">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-3.5 text-xs text-[#75647B] sm:text-sm"
          >
            <Link href="/" className="transition-colors hover:text-[#9200A8]">
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#EADDED]" />

            <Link
              href="/blog"
              className="transition-colors hover:text-[#9200A8]"
            >
              Blog & Stories
            </Link>

            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#EADDED]" />

            <Link
              href={`/blog?category=${encodeURIComponent(blog.category)}`}
              className="transition-colors hover:text-[#9200A8]"
            >
              {blog.category}
            </Link>

            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#EADDED]" />

            <span
              title={blog.title}
              className="max-w-[180px] truncate font-semibold text-[#35123F] sm:max-w-[300px]"
            >
              {blog.title}
            </span>
          </nav>
        </Container>
      </div>

      {/* Article heading */}
      <header className="bg-white py-8 sm:py-12 lg:py-14">
        <Container className="max-w-4xl">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <Badge variant="warm">{blog.category}</Badge>

            {blog.isFeatured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078] px-3 py-1.5 text-[10px] font-bold text-white">
                <Sparkles className="h-3 w-3" />
                Featured Story
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold leading-[1.14] tracking-[-0.04em] text-[#35123F] sm:text-4xl lg:text-[48px]">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#75647B] sm:text-lg sm:leading-8">
              {blog.excerpt}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-[#EADDED] py-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCE7F3] text-[#9200A8]">
                <UserRound className="h-4 w-4" />
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#75647B]">
                  Written by
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#35123F]">
                  {blog.authorName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCE7F3] text-[#9200A8]">
                <Calendar className="h-4 w-4" />
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#75647B]">
                  Published
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#35123F]">
                  {formatDate(blog.publishedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCE7F3] text-[#9200A8]">
                <Clock className="h-4 w-4" />
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#75647B]">
                  Reading time
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#35123F]">
                  {readTime}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Cover image */}
      {blog.coverImage && (
        <div className="pb-8 sm:pb-10">
          <Container className="max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#EADDED] bg-white sm:rounded-3xl">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                unoptimized={blog.coverImage.startsWith("http")}
                className="object-cover"
              />
            </div>
          </Container>
        </div>
      )}

      {/* Article body */}
      <section className="bg-white pb-14 pt-2 sm:pb-16">
        <Container className="max-w-4xl">
          {blog.excerpt && (
            <div className="mb-8 rounded-r-2xl border-l-[3px] border-[#9200A8] bg-white py-2 pl-5 sm:pl-7">
              <p className="text-base font-medium leading-7 text-[#75647B] sm:text-lg sm:leading-8">
                {blog.excerpt}
              </p>
            </div>
          )}

          <ArticleContent content={blog.content} />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 border-t border-[#EADDED] pt-6">
              <div className="mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#9200A8]" />
                <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#35123F]">
                  Related Topics
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?search=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-[#EADDED] bg-white px-3 py-1.5 text-xs font-medium text-[#75647B] transition-colors hover:border-[#9200A8] hover:text-[#9200A8]"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sharing and navigation */}
          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[#EADDED] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#35123F] transition-colors hover:text-[#9200A8]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all stories
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#75647B]">
                <Share2 className="h-3.5 w-3.5 text-[#9200A8]" />
                Share story
              </span>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${blog.title} - Read more on Samartha Trust`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="flex h-9 items-center justify-center rounded-xl border border-[#EADDED] bg-white px-3 text-xs font-bold text-[#35123F] transition-colors hover:border-[#25D366] hover:text-[#168A43]"
              >
                WhatsApp
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EADDED] bg-white text-xs font-bold text-[#35123F] transition-colors hover:border-[#35123F]"
              >
                X
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/blog/${blog.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="flex h-9 items-center justify-center rounded-xl border border-[#EADDED] bg-white px-3 text-xs font-bold text-[#35123F] transition-colors hover:border-[#0A66C2] hover:text-[#0A66C2]"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Support callout */}
          <div className="relative mt-9 overflow-hidden rounded-[24px] bg-[#35123F] p-6 text-white sm:p-8 lg:p-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[#E90078]/20 blur-3xl"
            />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#FCE7F3]">
                  <Heart className="h-3.5 w-3.5 fill-[#E90078] text-[#E90078]" />
                  Partner with Us
                </span>

                <h2 className="mt-3 text-xl font-extrabold leading-tight sm:text-2xl">
                  Inspired by this story?
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/75">
                  Help us continue our work in education, healthcare, and
                  community welfare. Your time, support, and partnership can
                  help create lasting change.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/contact">Support Our Mission</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/blog">More Stories</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related stories */}
      {relatedBlogs.length > 0 && (
        <section className="border-t border-[#EADDED] bg-white py-12 sm:py-16">
          <Container>
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9200A8]">
                  Continue Exploring
                </p>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#35123F] sm:text-3xl">
                  More Stories & Updates
                </h2>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#9200A8] transition-colors hover:text-[#E90078]"
              >
                View all stories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((item) => (
                <Card
                  key={item.id}
                  className="group flex h-full flex-col overflow-hidden border border-[#EADDED] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#C00083]/40 hover:shadow-[0_12px_32px_rgba(113,0,168,0.08)]"
                >
                  <Link
                    href={`/blog/${item.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-white"
                    aria-label={`Read ${item.title}`}
                  >
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1023px) 100vw, 33vw"
                        unoptimized={item.coverImage.startsWith("http")}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-9 w-9 text-[#9200A8]/40" />
                      </div>
                    )}
                  </Link>

                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="warm">{item.category}</Badge>

                      <span className="text-[10px] text-[#75647B]">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold leading-snug text-[#35123F] transition-colors group-hover:text-[#9200A8]">
                      <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                    </h3>

                    {item.excerpt && (
                      <p className="mt-2 text-sm leading-6 text-[#75647B]">
                        {item.excerpt}
                      </p>
                    )}

                    <Link
                      href={`/blog/${item.slug}`}
                      className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold text-[#9200A8]"
                    >
                      Read Story
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
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
