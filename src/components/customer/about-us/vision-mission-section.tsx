"use client";

import * as React from "react";
import { Eye, HeartHandshake, Sparkles, Target } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const items = [
  {
    label: "OUR VISION",
    title: "A world where every child belongs.",
    description:
      "To build an inclusive and compassionate society where every child, regardless of ability or background, has equal opportunities to grow, learn, and live with dignity.",
    icon: Eye,
    accent: "from-[#7100A8] via-[#9200A8] to-[#6366F1]",
    soft: "from-[#EDE9FE]/80 to-[#FCE7F3]/60",
  },
  {
    label: "OUR MISSION",
    title: "Care that creates possibilities.",
    description:
      "To provide safe residential care, quality education, healthcare, and rehabilitation support, empowering children to become confident, independent individuals.",
    icon: HeartHandshake,
    accent: "from-[#E90078] via-[#9200A8] to-[#F472B6]",
    soft: "from-[#FDF2F8]/80 to-[#FAF5FF]",
  },
] as const;

export function VisionMissionSection() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.12,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#FAF5FF] via-[#FDF8FF] to-[#FCE7F3]/40 py-8 sm:py-10 lg:py-12"
    >
      <div
        aria-hidden="true"
        className="help-section-grid-bg pointer-events-none absolute inset-0 opacity-50"
      />

      <Container className="relative">
        <div
          className={cn(
            revealVariant("clip-up"),
            "mx-auto mb-7 max-w-2xl text-center sm:mb-9"
          )}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#E90078] motion-safe:animate-pulse" />
            <span className="bg-gradient-to-r from-[#7100A8] to-[#E90078] bg-clip-text text-transparent">
              What Guides Us
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-[#35123F] sm:text-3xl lg:text-4xl">
            Our Vision{" "}
            <span className="relative inline-block text-brand-gradient">
              &amp; Mission
              <span
                className="about-title-underline absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-[#9200A8] to-[#E90078]"
                aria-hidden="true"
              />
            </span>
          </h2>

          <p
            className={cn(
              revealVariant("blur-in"),
              "mx-auto mt-2 max-w-xl text-sm leading-6 text-[#75647B]"
            )}
            style={{ animationDelay: "200ms" }}
          >
            Guided by dignity, inclusion, and a brighter future for every child.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {items.map((item, index) => {
            const Icon = item.icon;
            const delay = 160 + index * 140;

            return (
              <article
                key={item.label}
                className={cn(
                  "motion-flip-in home-card-hover group relative overflow-hidden rounded-2xl border border-[#EADDED] bg-white p-5 shadow-sm sm:p-6",
                  isInView && "motion-active"
                )}
                style={{ animationDelay: `${delay}ms` }}
              >
                <div
                  className={cn(
                    "help-accent-bar absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r",
                    item.accent
                  )}
                  aria-hidden="true"
                />

                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
                    item.soft
                  )}
                  aria-hidden="true"
                />

                <div className="relative flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "bg-gradient-to-r bg-clip-text text-[10px] font-extrabold tracking-[0.18em] text-transparent",
                      item.accent
                    )}
                  >
                    {item.label}
                  </span>

                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110",
                      item.accent
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </div>

                <div className="relative mt-4">
                  <h3 className="text-xl font-bold leading-snug text-[#35123F] sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#75647B] sm:text-base sm:leading-7">
                    {item.description}
                  </p>
                </div>

                <div className="relative mt-4 flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-8 rounded-full bg-gradient-to-r transition-all duration-500 group-hover:w-16",
                      item.accent
                    )}
                  />
                  <span className="text-[11px] font-semibold text-[#75647B]">
                    Samartha Trust
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <div
          className={cn(
            revealVariant("scale-in"),
            "mt-5 flex items-center justify-center gap-2 rounded-full border border-[#EADDED]/80 bg-white/70 px-4 py-2"
          )}
          style={{ animationDelay: "450ms" }}
        >
          <span className="h-px w-7 bg-gradient-to-r from-transparent to-[#9200A8]/40" />
          <Target className="h-4 w-4 text-[#9200A8]" />
          <span className="text-xs font-medium text-[#75647B]">
            One purpose. A brighter future.
          </span>
          <span className="h-px w-7 bg-gradient-to-l from-transparent to-[#E90078]/40" />
        </div>
      </Container>
    </section>
  );
}
