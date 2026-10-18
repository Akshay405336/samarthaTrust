import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  Tag,
  Search,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { calculateReadTime } from "@/lib/validations/blog";

export const metadata: Metadata = {
  title: "Blog & Field Reports | Samartha Trust",
  description:
    "Read the latest field reports, community impact stories, and news from Samartha Trust's education, healthcare, and welfare initiatives.",
};

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <div className="bg-white">
      <PageHeader
        badge="Field Reports & Stories"
        title="Blog & Community"
        highlight="Updates"
        description="Transparent updates, field observations, and stories of hope directly from our community programs."
      />

      <React.Suspense
        fallback={
          <section className="py-16 sm:py-24 bg-white">
            <Container className="text-center text-[#78685D]">
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F52232] border-t-transparent" />
                <p className="text-xs">Loading stories & field reports...</p>
              </div>
            </Container>
          </section>
        }
      >
        <BlogListContent searchParams={searchParams} />
      </React.Suspense>
    </div>
  );
}

async function BlogListContent({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "ALL";
  const search = params.search?.trim() || "";
  const page = parseInt(params.page || "1", 10) || 1;
  const limit = 9;

  // Build Prisma where clause (strictly published posts only)
  const where: import("@prisma/client").Prisma.BlogWhereInput = {
    status: "PUBLISHED",
  };

  if (currentCategory !== "ALL") {
    where.category = { equals: currentCategory, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, blogs, categories] = await Promise.all([
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        category: true,
        authorName: true,
        isFeatured: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const distinctCategories = [
    "ALL",
    ...categories.map((c) => c.category).filter(Boolean),
  ];

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const featuredBlog = blogs.find((b) => b.isFeatured) || blogs[0];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <Container>
        {/* Featured Post Card (if available and not filtered out by search) */}
        {featuredBlog && !search && currentCategory === "ALL" && (
          <div className="mb-14 sm:mb-16">
            <Card className="overflow-hidden border border-[#EADCCB] bg-white shadow-xs group">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {featuredBlog.coverImage && (
                  <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-5 overflow-hidden bg-[#FFF5E6]">
                    <Image
                      src={featuredBlog.coverImage}
                      alt={featuredBlog.title}
                      fill
                      unoptimized
                      priority
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>
                )}

                <div
                  className={`p-8 sm:p-12 flex flex-col justify-between space-y-4 ${
                    featuredBlog.coverImage ? "lg:col-span-7" : "lg:col-span-12"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F52232] px-3 py-1 text-xs font-bold text-white shadow-xs">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Featured Story</span>
                      </span>
                      <Badge
                        variant="secondary"
                        className="font-semibold text-xs"
                      >
                        {featuredBlog.category}
                      </Badge>
                      <span className="text-xs text-[#78685D] flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#FF8A00]" />
                        <span>
                          {featuredBlog.publishedAt
                            ? new Date(
                                featuredBlog.publishedAt
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </span>
                      <span className="text-xs text-[#78685D] flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#FF8A00]" />
                        <span>{calculateReadTime(featuredBlog.content)}</span>
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-[#492A22] sm:text-3xl lg:text-4xl group-hover:text-[#F52232] transition-colors leading-tight">
                      <Link href={`/blog/${featuredBlog.slug}`}>
                        {featuredBlog.title}
                      </Link>
                    </h2>

                    {featuredBlog.excerpt && (
                      <p className="text-base text-[#78685D] leading-relaxed sm:text-lg max-w-2xl">
                        {featuredBlog.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#EADCCB]/70">
                    <div className="flex items-center gap-2.5 text-xs text-[#78685D]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB]">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">
                        Written by {featuredBlog.authorName}
                      </span>
                    </div>

                    <Button asChild size="sm">
                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        className="gap-1.5"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filter & Category Navigation */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#EADCCB] pb-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#492A22] mr-1 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-[#F52232]" />
                <span>Topic:</span>
              </span>
              {distinctCategories.map((cat) => {
                const isActive = currentCategory === cat;
                const href =
                  cat === "ALL"
                    ? search
                      ? `/blog?search=${encodeURIComponent(search)}`
                      : "/blog"
                    : search
                      ? `/blog?category=${encodeURIComponent(cat)}&search=${encodeURIComponent(search)}`
                      : `/blog?category=${encodeURIComponent(cat)}`;

                return (
                  <Link
                    key={cat}
                    href={href}
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#F52232] text-white shadow-xs"
                        : "border border-[#EADCCB] bg-white text-[#78685D] hover:bg-[#FFF5E6] hover:text-[#492A22]"
                    }`}
                  >
                    {cat === "ALL" ? "All Stories" : cat}
                  </Link>
                );
              })}
            </div>

            {/* Live search form */}
            <form
              method="GET"
              action="/blog"
              className="relative w-full md:w-64"
            >
              {currentCategory !== "ALL" && (
                <input type="hidden" name="category" value={currentCategory} />
              )}
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#78685D]" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search stories..."
                className="w-full rounded-md border border-[#EADCCB] bg-white pl-9 pr-3 py-1.5 text-xs text-[#492A22] placeholder:text-[#78685D]/70 focus:outline-none focus:ring-1 focus:ring-[#F52232]"
              />
            </form>
          </div>

          {/* Total counter info */}
          <div className="flex items-center justify-between text-xs text-[#78685D]">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="h-4 w-4 text-[#F52232]" />
              <span>
                Showing {blogs.length} of {total} published stories
                {currentCategory !== "ALL" ? ` in ${currentCategory}` : ""}
              </span>
            </span>
            {search && (
              <Link
                href="/blog"
                className="text-xs text-[#F52232] hover:underline font-semibold"
              >
                Clear search &quot;{search}&quot;
              </Link>
            )}
          </div>

          {/* Blog Grid */}
          {blogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#EADCCB] bg-[#FFFCF5] p-12 text-center space-y-3">
              <BookOpen className="mx-auto h-8 w-8 text-[#78685D]" />
              <h3 className="text-base font-bold text-[#492A22]">
                No stories found
              </h3>
              <p className="text-xs text-[#78685D] max-w-sm mx-auto">
                We could not find any stories matching your current filter.
                Please try adjusting your search or select &quot;All
                Stories&quot;.
              </p>
              <div className="pt-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/blog">View All Stories</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => {
                const dateStr = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                const readTime = calculateReadTime(post.content);

                return (
                  <Card
                    key={post.id}
                    className="flex flex-col justify-between overflow-hidden border border-[#EADCCB] bg-white transition-all hover:border-[#FF8A00]/50 hover:shadow-md group"
                  >
                    <div>
                      {post.coverImage && (
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FFF5E6]">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-300 group-hover:scale-103"
                          />
                          {post.isFeatured && (
                            <div className="absolute top-2.5 left-2.5">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#F52232] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                                <Sparkles className="h-3 w-3" />
                                <span>Featured</span>
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-[#78685D]">
                          <Badge
                            variant="secondary"
                            className="font-semibold text-xs"
                          >
                            {post.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[#FF8A00]" />
                            <span>{readTime}</span>
                          </span>
                        </div>

                        <h4 className="text-lg font-bold leading-snug text-[#492A22] group-hover:text-[#F52232] transition-colors line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h4>

                        {post.excerpt && (
                          <p className="text-sm text-[#78685D] leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="pt-2 text-xs text-[#78685D] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#F52232]" />
                            <span>{dateStr}</span>
                          </span>
                          <span className="text-[11px] font-medium text-[#78685D]">
                            By {post.authorName}
                          </span>
                        </div>
                      </CardContent>
                    </div>

                    <div className="border-t border-[#EADCCB]/70 p-4 px-6 bg-[#FFFCF5]">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-xs font-semibold text-[#F52232] hover:text-[#FF8A00] gap-1 transition-colors"
                      >
                        <span>Read full article</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {page > 1 && (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/blog?page=${page - 1}${
                      currentCategory !== "ALL"
                        ? `&category=${currentCategory}`
                        : ""
                    }${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  >
                    Previous
                  </Link>
                </Button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}${
                    currentCategory !== "ALL"
                      ? `&category=${currentCategory}`
                      : ""
                  }${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                    page === p
                      ? "bg-[#F52232] text-white shadow-2xs"
                      : "border border-[#EADCCB] bg-white text-[#78685D] hover:bg-[#FFF5E6]"
                  }`}
                >
                  {p}
                </Link>
              ))}

              {page < totalPages && (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/blog?page=${page + 1}${
                      currentCategory !== "ALL"
                        ? `&category=${currentCategory}`
                        : ""
                    }${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
