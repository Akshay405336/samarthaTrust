import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Sparkles,
  Tag,
  UserRound,
} from "lucide-react";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { calculateReadTime } from "@/lib/validations/blog";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogListProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

function formatDate(date: Date | null) {
  if (!date) return "Recently published";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildBlogUrl(options: {
  category?: string;
  search?: string;
  page?: number;
}) {
  const params = new URLSearchParams();

  if (options.category && options.category !== "ALL") {
    params.set("category", options.category);
  }

  if (options.search) {
    params.set("search", options.search);
  }

  if (options.page && options.page > 1) {
    params.set("page", String(options.page));
  }

  const query = params.toString();

  return query ? `/blog?${query}` : "/blog";
}

export async function BlogList({ searchParams }: BlogListProps) {
  const params = await searchParams;
  const currentCategory = params.category || "ALL";
  const search = params.search?.trim() || "";
  const requestedPage = Number.parseInt(params.page || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
  const limit = 9;

  const where: Prisma.BlogWhereInput = {
    status: "PUBLISHED",
  };

  if (currentCategory !== "ALL") {
    where.category = {
      equals: currentCategory,
      mode: "insensitive",
    };
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
      orderBy: { category: "asc" },
    }),
  ]);

  const distinctCategories = [
    "ALL",
    ...categories.map((category) => category.category).filter(Boolean),
  ];

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const featuredBlog = blogs.find((blog) => blog.isFeatured) || blogs[0];

  return (
    <section id="blog-stories" className="bg-white py-8 sm:py-12 lg:py-14">
      <Container>
        {/* Featured article */}
        {featuredBlog && !search && currentCategory === "ALL" && (
          <article className="group mb-10 overflow-hidden rounded-[24px] border border-[#EDE2D8] bg-white transition-all duration-300 hover:border-[#E9C9B0] hover:shadow-[0_14px_40px_rgba(73,42,34,0.07)] sm:mb-12 sm:rounded-[28px]">
            <div className="h-[3px] bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C]" />

            <div className="grid items-stretch lg:grid-cols-[0.9fr_1.1fr]">
              {featuredBlog.coverImage && (
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  aria-label={`Read ${featuredBlog.title}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-[#FAF3EC] lg:aspect-auto lg:min-h-[360px]"
                >
                  <Image
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1023px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#492A22]/15 to-transparent" />
                </Link>
              )}

              <div className="flex min-w-0 flex-col justify-between p-5 sm:p-7 lg:p-9">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F52232] to-[#FF6B16] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      <Sparkles className="h-3 w-3" />
                      Featured Story
                    </span>

                    <Badge variant="warm">{featuredBlog.category}</Badge>
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#80685F]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#F4510B]" />
                      {formatDate(featuredBlog.publishedAt)}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#F4510B]" />
                      {calculateReadTime(featuredBlog.content)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.035em] text-[#492A22] transition-colors group-hover:text-[#C94B25] sm:text-3xl lg:text-[34px]">
                    <Link href={`/blog/${featuredBlog.slug}`}>
                      {featuredBlog.title}
                    </Link>
                  </h2>

                  {featuredBlog.excerpt && (
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#78685D] sm:text-[15px]">
                      {featuredBlog.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#EFE5DC] pt-5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#F4510B]">
                      <UserRound className="h-4 w-4" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#A18A79]">
                        Written by
                      </p>
                      <p className="mt-0.5 break-words text-xs font-semibold text-[#492A22]">
                        {featuredBlog.authorName}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredBlog.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#F4510B] transition-colors hover:text-[#F52232]"
                  >
                    Read Full Story
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Search and category filters */}
        <div className="mb-7 border-b border-[#EFE5DC] pb-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#492A22]">
                <Tag className="h-3.5 w-3.5 text-[#F4510B]" />
                Topics
              </span>

              {distinctCategories.map((category) => {
                const active = currentCategory === category;

                return (
                  <Link
                    key={category}
                    href={buildBlogUrl({
                      category,
                      search,
                    })}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-[#F52232] to-[#FF6B16] text-white shadow-sm"
                        : "border border-[#EDE2D8] bg-white text-[#78685D] hover:border-[#F2C9AE] hover:bg-[#FFFCF8] hover:text-[#492A22]"
                    }`}
                  >
                    {category === "ALL" ? "All Stories" : category}
                  </Link>
                );
              })}
            </div>

            <form
              method="GET"
              action="/blog"
              role="search"
              className="flex w-full gap-2 lg:max-w-[340px]"
            >
              {currentCategory !== "ALL" && (
                <input type="hidden" name="category" value={currentCategory} />
              )}

              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search blog stories</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A18A79]" />

                <input
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder="Search stories..."
                  className="h-11 w-full rounded-xl border border-[#EDE2D8] bg-white pl-10 pr-3 text-sm text-[#492A22] outline-none transition-colors placeholder:text-[#A18A79] focus:border-[#F4510B] focus:ring-2 focus:ring-[#F4510B]/10"
                />
              </label>

              <Button type="submit" className="h-11 rounded-xl px-4">
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Results information */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#80685F]">
            <BookOpen className="h-4 w-4 text-[#F4510B]" />
            <span>
              Showing <strong className="text-[#492A22]">{blogs.length}</strong>{" "}
              of <strong className="text-[#492A22]">{total}</strong> published{" "}
              {total === 1 ? "story" : "stories"}
              {currentCategory !== "ALL" && ` in ${currentCategory}`}
            </span>
          </div>

          {search && (
            <Link
              href={buildBlogUrl({ category: currentCategory })}
              className="text-xs font-semibold text-[#C94B25] hover:underline"
            >
              Clear search
            </Link>
          )}
        </div>

        {/* Article grid */}
        {blogs.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#E9DCCF] bg-white px-6 py-14 text-center sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3E7] text-[#F4510B]">
              <BookOpen className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#492A22]">
              No stories found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#78685D]">
              We couldn’t find any stories matching your search or selected
              topic. Try another search or browse all published stories.
            </p>

            <div className="mt-6">
              <Button asChild variant="outline">
                <Link href="/blog">View All Stories</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {blogs.map((post) => {
              const date = post.publishedAt || post.createdAt;
              const readTime = calculateReadTime(post.content);

              return (
                <article
                  key={post.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#EDE2D8] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#E9C9B0] hover:shadow-[0_12px_32px_rgba(73,42,34,0.07)]"
                >
                  {/* Cover image */}
                  <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-[#FAF3EC]"
                  >
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        unoptimized
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-[#D9BCA5]" />
                      </div>
                    )}

                    {post.isFeatured && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[#C94B25] shadow-sm backdrop-blur-sm">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </Link>

                  {/* Article information */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="warm">{post.category}</Badge>

                      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#80685F]">
                        <Clock className="h-3.5 w-3.5 text-[#F4510B]" />
                        {readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold leading-snug tracking-[-0.02em] text-[#492A22] transition-colors group-hover:text-[#C94B25]">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 text-sm leading-6 text-[#78685D]">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-5">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0E7DF] pt-4 text-[11px] text-[#80685F]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#F4510B]" />
                          {formatDate(date)}
                        </span>

                        <span className="max-w-[45%] truncate font-medium text-[#725548]">
                          By {post.authorName}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#F4510B] transition-colors hover:text-[#F52232]"
                      >
                        Read Full Article
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Blog pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {safePage > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={buildBlogUrl({
                    category: currentCategory,
                    search,
                    page: safePage - 1,
                  })}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </Link>
              </Button>
            )}

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (number) =>
                  number === 1 ||
                  number === totalPages ||
                  Math.abs(number - safePage) <= 2
              )
              .map((number, index, visiblePages) => {
                const previousNumber = visiblePages[index - 1];
                const hasGap =
                  previousNumber !== undefined && number - previousNumber > 1;

                return (
                  <span key={number} className="contents">
                    {hasGap && (
                      <span className="px-1 text-sm text-[#A18A79]">…</span>
                    )}

                    <Link
                      href={buildBlogUrl({
                        category: currentCategory,
                        search,
                        page: number,
                      })}
                      aria-current={safePage === number ? "page" : undefined}
                      className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-xs font-bold transition-colors ${
                        safePage === number
                          ? "bg-gradient-to-r from-[#F52232] to-[#FF6B16] text-white"
                          : "border border-[#EDE2D8] bg-white text-[#78685D] hover:border-[#E9C9B0] hover:bg-[#FFFCF8]"
                      }`}
                    >
                      {number}
                    </Link>
                  </span>
                );
              })}

            {safePage < totalPages && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={buildBlogUrl({
                    category: currentCategory,
                    search,
                    page: safePage + 1,
                  })}
                  className="gap-1.5"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </nav>
        )}
      </Container>
    </section>
  );
}
