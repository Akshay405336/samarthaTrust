"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Layers,
  HeartHandshake,
  Users,
  MoveUpRight,
} from "lucide-react";

import type { WorkPublicItem } from "@/lib/validations/work";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/shared/pagination";
import { WorkIcon } from "./work-icon";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const CARD_ENTERS = ["help-card-rise", "help-card-sway", "help-card-pop"] as const;

const CARD_THEMES = [
  {
    border: "border-[#9200A8]/25",
    main: "bg-gradient-to-br from-[#FCE7F3]/95 via-[#FAF5FF] to-[#EDE9FE]/40",
    aside: "bg-gradient-to-br from-[#EDE9FE]/70 via-[#FDF8FF] to-[#FCE7F3]/50",
    bar: "from-[#7100A8] via-[#9200A8] to-[#6366F1]",
    chip: "border-[#C4B5FD]/50 bg-gradient-to-r from-[#EDE9FE] to-[#FAF5FF] text-[#6D28D9]",
    check: "bg-gradient-to-br from-[#FCE7F3] to-[#EDE9FE] text-[#9200A8]",
    beneficiary:
      "border-[#C4B5FD]/40 bg-gradient-to-br from-white/90 to-[#EDE9FE]/50",
  },
  {
    border: "border-[#E90078]/25",
    main: "bg-gradient-to-br from-[#FDF2F8]/95 via-[#FAF5FF] to-[#FCE7F3]/45",
    aside: "bg-gradient-to-br from-[#FCE7F3]/65 via-[#FDF2F8]/50 to-[#FAF5FF]",
    bar: "from-[#E90078] via-[#9200A8] to-[#EC4899]",
    chip: "border-[#FBCFE8]/60 bg-gradient-to-r from-[#FDF2F8] to-[#FCE7F3] text-[#BE185D]",
    check: "bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3] text-[#E90078]",
    beneficiary:
      "border-[#FBCFE8]/50 bg-gradient-to-br from-white/90 to-[#FDF2F8]/55",
  },
  {
    border: "border-[#6366F1]/25",
    main: "bg-gradient-to-br from-[#EDE9FE]/90 via-[#FDF8FF] to-[#FCE7F3]/35",
    aside: "bg-gradient-to-br from-[#FAF5FF] via-[#EDE9FE]/55 to-[#FDF2F8]/45",
    bar: "from-[#6366F1] via-[#9200A8] to-[#7100A8]",
    chip: "border-[#A5B4FC]/50 bg-gradient-to-r from-[#EDE9FE] to-[#FAF5FF] text-[#4338CA]",
    check: "bg-gradient-to-br from-[#EDE9FE] to-[#FAF5FF] text-[#6366F1]",
    beneficiary:
      "border-[#A5B4FC]/45 bg-gradient-to-br from-white/90 to-[#EDE9FE]/45",
  },
] as const;

export type { WorkPublicItem };

export interface WorksPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface WorksListProps {
  works: WorkPublicItem[];
  pagination?: WorksPaginationMeta;
  currentCategory?: string;
  search?: string;
}

function buildWorksUrl(options: {
  page?: number;
  category?: string;
  search?: string;
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
  const q = params.toString();
  return q ? `/our-works?${q}` : "/our-works";
}

export function WorksListSkeleton() {
  return (
    <section className="bg-gradient-to-br from-[#EDE9FE]/30 to-[#FCE7F3]/40 py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="space-y-7">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-[26px] border border-[#EADDED] bg-white"
            >
              <div className="h-1 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]" />

              <div className="grid animate-pulse lg:grid-cols-[1fr_320px]">
                <div className="space-y-5 p-5 sm:p-8 lg:p-9">
                  <div className="h-6 w-36 rounded-full bg-[#FCE7F3]/60" />
                  <div className="h-8 w-4/5 rounded-lg bg-[#FCE7F3]/60" />
                  <div className="h-4 w-full rounded bg-[#FAF5FF]" />
                  <div className="h-4 w-3/4 rounded bg-[#FAF5FF]" />
                  <div className="grid gap-4 pt-5 sm:grid-cols-2">
                    <div className="h-5 rounded bg-[#FAF5FF]" />
                    <div className="h-5 rounded bg-[#FAF5FF]" />
                    <div className="h-5 rounded bg-[#FAF5FF]" />
                    <div className="h-5 rounded bg-[#FAF5FF]" />
                  </div>
                </div>

                <div className="space-y-5 border-t border-[#EADDED] p-5 sm:p-7 lg:border-l lg:border-t-0">
                  <div className="aspect-[16/9] rounded-2xl bg-[#FAF5FF]" />
                  <div className="h-24 rounded-2xl bg-[#FAF5FF]" />
                  <div className="h-11 rounded-xl bg-[#FCE7F3]/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function WorksList({
  works,
  pagination,
  currentCategory,
  search,
}: WorksListProps) {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.06,
  });
  const totalCount = pagination ? pagination.total : works.length;

  if (works.length === 0) {
    return (
      <section className="bg-white px-4 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-xl rounded-[28px] border border-[#EADDED] bg-white px-6 py-12 text-center sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#EADDED] bg-[#FCE7F3]/60 text-[#9200A8]">
              <Layers className="h-7 w-7" />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C00083]">
              Our Community Initiatives
            </p>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#35123F] sm:text-3xl">
              New Stories of Impact Are on Their Way
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#75647B]">
              We are updating our community initiatives. Connect with our team
              to learn more about our work and ways to get involved.
            </p>

            <div className="mt-7 flex justify-center">
              <Button asChild>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2"
                >
                  Contact Our Team
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#EDE9FE]/35 via-[#FDF8FF] to-[#FCE7F3]/45 py-10 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#9200A8]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-[#E90078]/12 blur-3xl"
      />
      <Container className="relative">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#EADDED] pb-6 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <div
              className={cn(
                revealVariant("slide-left"),
                "mb-3 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-white px-3 py-1.5 shadow-sm"
              )}
            >
              <span className="h-1.5 w-7 animate-pulse rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#75647B] sm:text-[11px]">
                Where Our Efforts Make a Difference
              </span>
            </div>

            <h2
              className={cn(
                revealVariant("scale-in"),
                "text-2xl font-extrabold tracking-[-0.035em] text-[#35123F] sm:text-3xl"
              )}
              style={{ animationDelay: "100ms" }}
            >
              Our Areas of{" "}
              <span className="relative inline-block">
                <span className="help-team-wave bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                  Impact
                </span>
                <span
                  className="about-title-underline absolute -bottom-0.5 left-0 h-1 w-full rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078]"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p
              className={cn(
                revealVariant("blur-in"),
                "mt-2 max-w-xl text-sm leading-6 text-[#75647B]"
              )}
              style={{ animationDelay: "200ms" }}
            >
              Explore the initiatives supporting children, families, and
              communities.
            </p>
          </div>

          <div
            className={cn(
              revealVariant("clip-up"),
              "about-ring-pulse flex w-fit items-center gap-3 rounded-xl border border-[#EADDED] bg-white px-4 py-3 shadow-sm"
            )}
            style={{ animationDelay: "280ms" }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#7100A8] to-[#E90078] text-white shadow-sm">
              <HeartHandshake className="h-[18px] w-[18px]" />
            </div>
            <div>
              <p className="text-xl font-extrabold leading-none text-[#35123F]">
                {String(totalCount).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#75647B]">
                Initiatives
              </p>
            </div>
          </div>
        </div>

        {/* Work cards */}
        <div className="space-y-7 sm:space-y-9">
          {works.map((work, index) => {
            const hasImage = Boolean(work.featuredImage);
            const enterClass = CARD_ENTERS[index % CARD_ENTERS.length];
            const enterActive = `${enterClass}-active`;
            const cardDelay = 100 + index * 90;
            const theme = CARD_THEMES[index % CARD_THEMES.length];

            return (
              <article
                key={work.id}
                id={work.slug}
                className={cn(
                  enterClass,
                  isInView && enterActive,
                  "motion-card-tilt home-card-hover group relative scroll-mt-24 overflow-hidden rounded-[24px] border shadow-[0_10px_36px_rgba(113,0,168,0.08)] hover:shadow-[0_18px_50px_rgba(113,0,168,0.14)] sm:rounded-[28px]",
                  theme.border
                )}
                style={{ animationDelay: `${cardDelay}ms` }}
              >
                <div
                  className={cn(
                    "help-accent-bar h-2 w-full bg-gradient-to-r",
                    theme.bar
                  )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
                  <div
                    className={cn("relative min-w-0 p-5 sm:p-7 lg:p-9", theme.main)}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-[#9200A8]/10 blur-3xl"
                    />
                    {/* Category and status */}
                    <div className="mb-6 flex flex-wrap items-center gap-2.5">
                      {work.badge && <Badge variant="warm">{work.badge}</Badge>}

                      {work.category && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.09em]",
                            theme.chip
                          )}
                        >
                          {work.category}
                        </span>
                      )}

                      {work.programStatus && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F8F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#347348]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#48A568]" />
                          {work.programStatus}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="flex items-start gap-4">
                      <div className="help-icon-pop flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#EADDED] bg-gradient-to-br from-[#FCE7F3] to-[#FAF5FF] text-[#9200A8] transition-all duration-300 group-hover:border-[#C00083]/30 group-hover:from-[#9200A8] group-hover:to-[#7100A8] group-hover:text-white sm:h-[54px] sm:w-[54px]">
                        <WorkIcon
                          name={work.iconName}
                          className="h-[22px] w-[22px] sm:h-6 sm:w-6"
                        />
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9200A8]">
                          Initiative {String(index + 1).padStart(2, "0")}
                        </p>

                        <h3 className="text-xl font-extrabold leading-snug tracking-[-0.035em] text-[#35123F] sm:text-2xl lg:text-[27px]">
                          {work.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-5 text-sm leading-7 text-[#75647B] sm:text-[15px] sm:leading-[1.9]">
                      {work.description}
                    </p>

                    {/* Deliverables */}
                    {work.features && work.features.length > 0 && (
                      <div className="mt-8 border-t border-[#9200A8]/15 pt-6">
                        <div className="mb-4 flex items-center gap-2.5">
                          <div className="h-5 w-1 rounded-full bg-gradient-to-b from-[#7100A8] to-[#E90078]" />

                          <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#35123F]">
                            What We Do
                          </h4>

                          <span className="text-[10px] font-medium text-[#75647B]">
                            ({work.features.length} activities)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
                          {work.features.map((feature, featureIndex) => (
                            <div
                              key={`${work.id}-feature-${featureIndex}`}
                              className="flex items-start gap-3"
                            >
                              <span
                                className={cn(
                                  "mt-0.5 flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full shadow-sm",
                                  theme.check
                                )}
                              >
                                <Check className="h-3 w-3" strokeWidth={2.5} />
                              </span>

                              <span className="text-sm leading-6 text-[#75647B]">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Supporting panel */}
                  <aside
                    className={cn(
                      "relative flex min-w-0 flex-col border-t border-[#9200A8]/15 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-6 xl:p-7",
                      theme.aside
                    )}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(233,0,120,0.12),transparent_55%)]"
                    />
                    {hasImage && work.featuredImage ? (
                      <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#FAF5FF]">
                        <Image
                          src={work.featuredImage}
                          alt={work.title}
                          fill
                          className="home-img-zoom object-cover"
                          sizes="(max-width: 1023px) 100vw, 350px"
                          unoptimized={work.featuredImage.startsWith("http")}
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#35123F]/30 via-transparent to-transparent" />

                        <span className="absolute bottom-3 left-3 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#35123F]">
                          Our Work
                        </span>
                      </div>
                    ) : (
                      <div className="relative mb-5 flex aspect-[16/7] items-center justify-center overflow-hidden rounded-2xl border border-[#EADDED] bg-white lg:aspect-[16/8]">
                        <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-[#E90078]/10 blur-2xl" />

                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#EADDED] bg-[#FCE7F3]/60 text-[#9200A8]">
                          <WorkIcon name={work.iconName} className="h-7 w-7" />
                        </div>
                      </div>
                    )}

                    {/* Beneficiaries */}
                    {work.beneficiaries && (
                      <div
                        className={cn(
                          "relative rounded-2xl border p-4 shadow-sm sm:p-5",
                          theme.beneficiary
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FCE7F3] text-[#9200A8]">
                            <Users className="h-4 w-4" />
                          </div>

                          <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#75647B]">
                            Who We Support
                          </p>
                        </div>

                        <p className="mt-3 text-sm font-semibold leading-6 text-[#35123F]">
                          {work.beneficiaries}
                        </p>
                      </div>
                    )}

                    {/* Support CTA */}
                    <div className="mt-auto pt-6">
                      <div className="mb-4">
                        <h4 className="text-base font-extrabold tracking-tight text-[#35123F]">
                          Be Part of the Change
                        </h4>

                        <p className="mt-1.5 text-sm leading-6 text-[#75647B]">
                          Your time, support, or partnership can help this
                          initiative reach more people.
                        </p>
                      </div>

                      <Button asChild className="w-full">
                        <Link
                          href={work.ctaLink || "/contact"}
                          className="inline-flex items-center justify-center gap-2"
                        >
                          {work.ctaText || "Support This Work"}
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>

                      <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-medium text-[#75647B]">
                        Every contribution matters
                        <MoveUpRight className="h-3 w-3" />
                      </p>
                    </div>
                  </aside>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10 border-t border-[#EADDED] pt-2">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              limit={pagination.limit}
              recordLabel="initiatives"
              getPageUrl={(page) =>
                buildWorksUrl({
                  page,
                  category: currentCategory,
                  search,
                })
              }
            />
          </div>
        )}
      </Container>
    </section>
  );
}
