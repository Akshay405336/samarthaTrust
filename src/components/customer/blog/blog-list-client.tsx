"use client";

import * as React from "react";
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

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  readTime: string;
  coverImage: string | null;
  category: string;
  authorName: string;
  isFeatured: boolean;
  dateLabel: string;
};

export type BlogListClientProps = {
  blogs: BlogListItem[];
  featuredBlog: BlogListItem | null;
  showFeatured: boolean;
  total: number;
  currentCategory: string;
  search: string;
  distinctCategories: string[];
  totalPages: number;
  safePage: number;
};

const CARD_THEMES = [
  {
    border: "border-[#9200A8]/25",
    body: "bg-gradient-to-br from-[#FCE7F3]/90 via-white to-[#EDE9FE]/35",
    bar: "from-[#7100A8] via-[#9200A8] to-[#6366F1]",
  },
  {
    border: "border-[#E90078]/25",
    body: "bg-gradient-to-br from-[#FDF2F8]/90 via-white to-[#FCE7F3]/40",
    bar: "from-[#E90078] via-[#9200A8] to-[#EC4899]",
  },
  {
    border: "border-[#6366F1]/25",
    body: "bg-gradient-to-br from-[#EDE9FE]/85 via-white to-[#FAF5FF]",
    bar: "from-[#6366F1] via-[#9200A8] to-[#7100A8]",
  },
] as const;

const CARD_ENTERS = ["help-card-rise", "help-card-sway", "help-card-pop"] as const;

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

export function BlogListClient({
  blogs,
  featuredBlog,
  showFeatured,
  total,
  currentCategory,
  search,
  distinctCategories,
  totalPages,
  safePage,
}: BlogListClientProps) {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.06,
  });

  return (
    <section
      ref={ref}
      id="blog-stories"
      className="relative overflow-hidden bg-gradient-to-br from-[#EDE9FE]/35 via-[#FDF8FF] to-[#FCE7F3]/45 py-8 sm:py-12 lg:py-14"
    >
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-85"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-[#FCE7F3]/55 blur-3xl"
      />

      <Container className="relative">
        {showFeatured && featuredBlog && (
          <article
            className={cn(
              revealVariant("scale-in"),
              "motion-card-tilt home-card-hover group mb-10 overflow-hidden rounded-[24px] border border-[#9200A8]/30 bg-gradient-to-br from-[#FAF5FF] via-white to-[#FCE7F3]/50 shadow-[0_14px_44px_rgba(113,0,168,0.1)] sm:mb-12 sm:rounded-[28px]"
            )}
          >
            <div className="help-accent-bar h-2 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]" />

            <div className="grid items-stretch lg:grid-cols-[0.9fr_1.1fr]">
              {featuredBlog.coverImage && (
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  aria-label={`Read ${featuredBlog.title}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-[#FAF5FF] lg:aspect-auto lg:min-h-[360px]"
                >
                  <Image
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1023px) 100vw, 45vw"
                    className="home-img-zoom object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#35123F]/35 via-[#9200A8]/10 to-transparent" />
                </Link>
              )}

              <div className="flex min-w-0 flex-col justify-between bg-gradient-to-br from-white/80 to-[#EDE9FE]/30 p-5 sm:p-7 lg:p-9">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      Featured Story
                    </span>
                    <Badge variant="warm">{featuredBlog.category}</Badge>
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#75647B]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#9200A8]" />
                      {featuredBlog.dateLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#9200A8]" />
                      {featuredBlog.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.035em] text-[#35123F] transition-colors group-hover:text-[#9200A8] sm:text-3xl lg:text-[34px]">
                    <Link href={`/blog/${featuredBlog.slug}`}>
                      {featuredBlog.title}
                    </Link>
                  </h2>

                  {featuredBlog.excerpt && (
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#75647B] sm:text-[15px]">
                      {featuredBlog.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#9200A8]/15 pt-5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FCE7F3] to-[#EDE9FE] text-[#9200A8]">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#75647B]">
                        Written by
                      </p>
                      <p className="mt-0.5 break-words text-xs font-semibold text-[#35123F]">
                        {featuredBlog.authorName}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredBlog.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#9200A8] transition-colors hover:text-[#E90078]"
                  >
                    Read Full Story
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        <div
          className={cn(
            revealVariant("fade-up"),
            "mb-7 rounded-2xl border border-[#EADDED]/80 bg-white/85 p-4 shadow-sm backdrop-blur-sm sm:p-5"
          )}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#35123F]">
                <Tag className="h-3.5 w-3.5 text-[#9200A8]" />
                Topics
              </span>

              {distinctCategories.map((category) => {
                const active = currentCategory === category;
                return (
                  <Link
                    key={category}
                    href={buildBlogUrl({ category, search })}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-sm"
                        : "border border-[#EADDED] bg-white text-[#75647B] hover:border-[#9200A8]/40 hover:bg-[#FAF5FF] hover:text-[#35123F]"
                    )}
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
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75647B]" />
                <input
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder="Search stories..."
                  className="h-11 w-full rounded-xl border border-[#EADDED] bg-white pl-10 pr-3 text-sm text-[#35123F] outline-none transition-colors placeholder:text-[#75647B] focus:border-[#9200A8] focus:ring-2 focus:ring-[#9200A8]/15"
                />
              </label>
              <Button type="submit" className="help-btn-gradient h-11 rounded-xl px-4">
                Search
              </Button>
            </form>
          </div>
        </div>

        <div
          className={cn(
            revealVariant("slide-left"),
            "mb-5 flex flex-wrap items-center justify-between gap-3"
          )}
        >
          <div className="about-ring-pulse flex items-center gap-3 rounded-xl border border-[#EADDED] bg-white/90 px-4 py-2.5 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7100A8] to-[#E90078] text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-xs text-[#75647B]">
              Showing <strong className="text-[#35123F]">{blogs.length}</strong> of{" "}
              <strong className="text-[#35123F]">{total}</strong>{" "}
              {total === 1 ? "story" : "stories"}
              {currentCategory !== "ALL" && ` in ${currentCategory}`}
            </span>
          </div>

          {search && (
            <Link
              href={buildBlogUrl({ category: currentCategory })}
              className="text-xs font-semibold text-[#9200A8] hover:underline"
            >
              Clear search
            </Link>
          )}
        </div>

        {blogs.length === 0 ? (
          <div
            className={cn(
              revealVariant("scale-in"),
              "rounded-[24px] border border-dashed border-[#9200A8]/30 bg-gradient-to-br from-white to-[#FAF5FF] px-6 py-14 text-center sm:py-16"
            )}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#FCE7F3] text-[#9200A8]">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-extrabold text-[#35123F]">
              No stories found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75647B]">
              We couldn&apos;t find any stories matching your search or selected
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
            {blogs.map((post, index) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              const enterClass = CARD_ENTERS[index % CARD_ENTERS.length];
              const enterActive = `${enterClass}-active`;
              const delay = 90 + index * 70;

              return (
                <article
                  key={post.id}
                  className={cn(
                    enterClass,
                    isInView && enterActive,
                    "home-card-hover motion-card-tilt group flex min-w-0 flex-col overflow-hidden rounded-[20px] border shadow-[0_10px_32px_rgba(113,0,168,0.08)] hover:shadow-[0_16px_40px_rgba(113,0,168,0.12)]",
                    theme.border,
                    theme.body
                  )}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  <div
                    className={cn(
                      "help-accent-bar h-1.5 bg-gradient-to-r",
                      theme.bar
                    )}
                  />

                  <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-[#FAF5FF]"
                  >
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        unoptimized
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="home-img-zoom object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#EDE9FE]/50 to-[#FCE7F3]/50">
                        <BookOpen className="h-10 w-10 text-[#9200A8]/40" />
                      </div>
                    )}

                    {post.isFeatured && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="warm">{post.category}</Badge>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#75647B]">
                        <Clock className="h-3.5 w-3.5 text-[#9200A8]" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold leading-snug tracking-[-0.02em] text-[#35123F] transition-colors group-hover:text-[#9200A8]">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 text-sm leading-6 text-[#75647B]">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-5">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#9200A8]/10 pt-4 text-[11px] text-[#75647B]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#9200A8]" />
                          {post.dateLabel}
                        </span>
                        <span className="max-w-[45%] truncate font-medium">
                          By {post.authorName}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#9200A8] transition-colors hover:text-[#E90078]"
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
                      <span className="px-1 text-sm text-[#75647B]">…</span>
                    )}
                    <Link
                      href={buildBlogUrl({
                        category: currentCategory,
                        search,
                        page: number,
                      })}
                      aria-current={safePage === number ? "page" : undefined}
                      className={cn(
                        "flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-xs font-bold transition-colors",
                        safePage === number
                          ? "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-sm"
                          : "border border-[#EADDED] bg-white text-[#75647B] hover:border-[#9200A8]/40 hover:bg-[#FAF5FF]"
                      )}
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
