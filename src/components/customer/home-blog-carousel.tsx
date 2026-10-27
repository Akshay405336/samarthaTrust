"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Heart, UserRound, Tag } from "lucide-react";

import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

export interface FormattedHomeBlogItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  category: string;
  authorName: string;
  day: string;
  month: string;
}

export interface HomeBlogCarouselProps {
  blogs: FormattedHomeBlogItem[];
}

export function HomeBlogCarousel({ blogs }: HomeBlogCarouselProps) {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isInView, revealVariant } =
    useScrollInView<HTMLElement>({
      threshold: 0.12,
    });

  const scrollCarousel = (direction: -1 | 1) => {
    const container = carouselRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("article");
    const distance = card ? card.getBoundingClientRect().width + 24 : 380;

    container.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  };

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-blog-heading"
      className="overflow-hidden bg-white py-14 sm:py-16 lg:py-20"
    >
      {/* Brand theme tokens: text-[#35123F] text-[#9200A8] border-[#EADDED] (legacy: text-[#492A22] text-[#F4510B] border-[#EADCCB]) */}
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.28fr)] lg:gap-12 xl:gap-16">
          {/* Left heading and desktop navigation */}
          <div className="flex flex-col items-start pt-1">
            <div
              className={cn(
                "mb-4 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-white px-4 py-2 shadow-xs",
                revealVariant("slide-left")
              )}
            >
              <Heart
                className="h-4 w-4 fill-[#E90078] text-[#E90078]"
                aria-hidden="true"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#75647B] sm:text-xs">
                Latest News & Stories
              </span>
            </div>

            <h2
              id="home-blog-heading"
              className={cn(
                "text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-[#35123F]",
                revealVariant("clip-up")
              )}
              style={{ animationDelay: "100ms" }}
            >
              Read Our <span className="text-brand-gradient">Latest News</span>
            </h2>

            <p
              className={cn(
                "motion-blur-in mt-4 max-w-md text-[15px] leading-7 text-[#75647B] sm:text-base lg:text-[17px]",
                isInView && "motion-active"
              )}
              style={{ animationDelay: "220ms" }}
            >
              Stories of hope, transparent updates, and community impact
              directly from our field initiatives.
            </p>

            {/* Desktop navigation controls */}
            <div
              className={cn(
                "mt-8 hidden items-center gap-3 lg:flex",
                revealVariant("fade-up")
              )}
              style={{ animationDelay: "280ms" }}
            >
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous blogs"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#EADDED] bg-white text-[#35123F] shadow-sm transition-all hover:border-[#9200A8] hover:bg-[#FCE7F3]/40 hover:text-[#9200A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                aria-label="Next blogs"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#EADDED] bg-white text-[#35123F] shadow-sm transition-all hover:border-[#9200A8] hover:bg-[#FCE7F3]/40 hover:text-[#9200A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Right horizontal carousel */}
          <div
            ref={carouselRef}
            className="flex min-w-0 snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Latest blog articles"
            tabIndex={0}
          >
            {blogs.map((blog, index) => (
              <article
                key={blog.id}
                className={cn(
                  "help-blog-card-enter home-card-hover group flex h-full w-[min(100%,360px)] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-[#EADDED] bg-white hover:border-[#9200A8]/50 hover:shadow-lg sm:w-[380px]",
                  isInView && "help-blog-card-enter-active"
                )}
                style={{ animationDelay: `${320 + index * 90}ms` }}
              >
                {/* Cover image and date badge */}
                <Link
                  href={`/blog/${blog.slug}`}
                  className="relative block h-[210px] shrink-0 overflow-hidden bg-[#FAF5FF] sm:h-[230px]"
                  aria-label={`Read ${blog.title}`}
                >
                  {blog.coverImage ? (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 90vw, 380px"
                      className="home-img-zoom object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FAF5FF] via-[#FCE7F3] to-[#F3E8FF]">
                      <div className="flex flex-col items-center gap-2">
                        <Heart className="h-8 w-8 text-[#9200A8]/50" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#75647B]">
                          Samartha Trust
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex h-[62px] w-[60px] flex-col items-center justify-center rounded-[12px] bg-gradient-to-br from-[#7100A8] to-[#9200A8] text-white shadow-md">
                    <span className="text-[22px] font-bold leading-none">
                      {blog.day}
                    </span>
                    <span className="mt-1 text-xs font-medium uppercase leading-none tracking-wide text-white/90">
                      {blog.month}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col px-5 py-2 sm:px-6">
                  {/* Author and category bar */}
                  <div className="grid min-h-[50px] grid-cols-2 border-b border-[#EADDED]">
                    <div className="flex min-w-0 items-center gap-2 border-r border-[#EADDED] pr-2 text-xs text-[#75647B] sm:text-[13px]">
                      <UserRound className="h-4 w-4 shrink-0 text-[#9200A8]" />
                      <span className="truncate">By {blog.authorName}</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2 pl-3 text-xs text-[#75647B] sm:text-[13px]">
                      <Tag className="h-4 w-4 shrink-0 text-[#9200A8]" />
                      <span className="truncate">{blog.category}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex min-h-[85px] flex-1 items-center border-b border-[#EADDED] py-4">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="line-clamp-2 text-lg font-semibold leading-[1.35] tracking-[-0.02em] text-[#35123F] transition-colors hover:text-[#9200A8] sm:text-xl"
                    >
                      {blog.title}
                    </Link>
                  </div>

                  {/* Read story footer link */}
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="flex min-h-[56px] items-center justify-between gap-3 text-sm font-semibold text-[#9200A8] transition-colors hover:text-[#E90078]"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile navigation controls */}
        <div className="mt-6 flex justify-center gap-4 lg:hidden">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            aria-label="Previous blogs"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EADDED] bg-white text-[#35123F] shadow-sm transition-all hover:border-[#9200A8] hover:bg-[#FCE7F3]/40 hover:text-[#9200A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            aria-label="Next blogs"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EADDED] bg-white text-[#35123F] shadow-sm transition-all hover:border-[#9200A8] hover:bg-[#FCE7F3]/40 hover:text-[#9200A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* View All Stories link */}
        <div className="mt-8 flex justify-center lg:justify-end">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#9200A8] transition-colors hover:text-[#E90078]"
          >
            <span>View All Stories</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
