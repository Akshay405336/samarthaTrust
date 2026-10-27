"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Sparkles } from "lucide-react";

import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Education", gradient: "from-[#7100A8] to-[#6366F1]" },
  { label: "Healthcare", gradient: "from-[#9200A8] to-[#E90078]" },
  { label: "Community Welfare", gradient: "from-[#EC4899] to-[#C026D3]" },
] as const;

export function OurWorksHero() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.08,
  });

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const active = mounted || isInView;

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-gradient-to-br from-[#EDE9FE]/40 via-[#FDF8FF] to-[#FCE7F3]/50"
    >
      <div
        aria-hidden="true"
        className="about-page-grid pointer-events-none absolute inset-0 opacity-45"
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -right-20 -top-16 -z-10 h-72 w-72 rounded-full bg-[#E90078]/20 blur-3xl"
        style={{ "--help-orb-duration": "17s" } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -bottom-20 -left-16 -z-10 h-60 w-60 rounded-full bg-[#6366F1]/15 blur-3xl"
        style={
          { "--help-orb-duration": "19s", "--help-orb-delay": "600ms" } as React.CSSProperties
        }
      />

      <Container>
        <div className="customer-page-top mx-auto max-w-4xl pb-8 text-center sm:pb-10 lg:pb-12">
          <div
            className={cn(
              revealVariant("scale-in"),
              "mb-4 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
            )}
          >
            <HeartHandshake className="h-3.5 w-3.5 text-[#9200A8] motion-safe:animate-pulse" />
            <span className="bg-gradient-to-r from-[#7100A8] to-[#E90078] bg-clip-text text-[10px] font-bold uppercase tracking-[0.16em] text-transparent sm:text-[11px]">
              Grassroots Action
            </span>
            <Sparkles className="h-3 w-3 text-[#E90078]" />
          </div>

          <h1 className="text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#35123F]">
            <span
              className={cn(
                "help-heading-drop block",
                active && "help-heading-drop-active"
              )}
              style={{ animationDelay: "80ms" }}
            >
              Creating Change,
            </span>
            <span
              className={cn(
                "help-heading-drop mt-1 block",
                active && "help-heading-drop-active"
              )}
              style={{ animationDelay: "200ms" }}
            >
              <span className="relative inline-block">
                <span className="works-highlight help-lasting-shimmer bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                  Transforming Lives
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 10"
                  fill="none"
                  className="absolute -bottom-1 left-0 h-2 w-full"
                >
                  <defs>
                    <linearGradient
                      id="our-works-underline"
                      x1="0"
                      y1="0"
                      x2="300"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#7100A8" />
                      <stop offset=".48" stopColor="#9200A8" />
                      <stop offset="1" stopColor="#E90078" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M3 7C75 1 220 1 297 6"
                    stroke="url(#our-works-underline)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={cn(active && "our-works-underline-draw")}
                  />
                </svg>
              </span>
            </span>
          </h1>

          <p
            className={cn(
              "motion-blur-in mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#75647B] sm:text-[15px] sm:leading-7",
              active && "motion-active"
            )}
            style={{ animationDelay: "380ms" }}
          >
            From education and healthcare to women&apos;s empowerment and
            community welfare, every initiative helps create a more inclusive
            future.
          </p>

          <div
            className={cn(
              revealVariant("fade-up"),
              "mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
            )}
            style={{ animationDelay: "480ms" }}
          >
            <Link
              href="#education"
              className="help-btn-gradient group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#9200A8]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Explore Our Initiatives
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#EADDED] bg-white px-5 py-2.5 text-sm font-semibold text-[#35123F] transition-all hover:border-[#9200A8] hover:bg-[#FCE7F3]/40 hover:text-[#9200A8]"
            >
              Get Involved
              <HeartHandshake className="h-4 w-4 text-[#9200A8]" />
            </Link>
          </div>

          <div
            className={cn(
              revealVariant("clip-up"),
              "mt-7 flex flex-wrap items-center justify-center gap-3 border-t border-[#EADDED] pt-5"
            )}
            style={{ animationDelay: "560ms" }}
          >
            {CATEGORIES.map((item, index) => (
              <span
                key={item.label}
                className={cn(
                  "help-color-tile inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm",
                  item.gradient
                )}
                style={
                  { "--help-tile-delay": `${index * 140}ms` } as React.CSSProperties
                }
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
