"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const DOT_COLORS = [
  "#E90078",
  "#9200A8",
  "#7100A8",
  "#F472B6",
  "#6366F1",
  "#C026D3",
  "#EC4899",
  "#A855F7",
];

export function AboutHeroSection() {
  const { ref, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.15,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#FDF8FF]/80 to-white py-10 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-56 w-56 rounded-full bg-[#FCE7F3]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#EDE9FE]/70 blur-3xl"
        style={{ "--help-orb-duration": "17s" } as React.CSSProperties}
      />

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h1
              className={cn(
                revealVariant("slide-right"),
                "text-3xl font-bold leading-tight tracking-tight text-[#35123F] sm:text-4xl lg:text-5xl"
              )}
            >
              We Believe Every Life Deserves{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                  Hope &amp; Opportunity.
                </span>
                <span
                  className={cn(
                    "about-title-underline absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078]"
                  )}
                  aria-hidden="true"
                />
              </span>
            </h1>

            <div className="mt-5 max-w-xl space-y-4 text-base leading-7 text-[#75647B] sm:text-lg sm:leading-8">
              <p
                className={cn(revealVariant("blur-in"))}
                style={{ animationDelay: "100ms" }}
              >
                <span className="font-bold text-[#35123F]">Samartha Trust </span>
                is a non-profit organization dedicated to supporting orphaned
                and specially-abled children by providing safe residential care,
                education, healthcare, and holistic development.
              </p>

              <p
                className={cn(revealVariant("blur-in"))}
                style={{ animationDelay: "220ms" }}
              >
                Founded in 2019 in Bengaluru, the trust works to create a
                nurturing and inclusive environment where children can grow with
                dignity, confidence, and opportunity. Through structured care
                programs, community support, and education initiatives, Samartha
                Trust aims to empower vulnerable children and help them build
                independent and meaningful futures.
              </p>

              <p
                className={cn(revealVariant("blur-in"))}
                style={{ animationDelay: "340ms" }}
              >
                Today, the organization supports{" "}
                <span className="rounded-md bg-gradient-to-r from-[#FCE7F3] to-[#FAF5FF] px-1.5 py-0.5 font-bold text-[#9200A8]">
                  72 children across three residential care centers
                </span>
                , ensuring they receive the care, stability, and opportunities
                every child deserves.
              </p>
            </div>
          </div>

          <div
            className={cn(
              revealVariant("clip-up"),
              "relative mx-auto w-full max-w-[590px] pb-8 pt-3 sm:pb-10"
            )}
            style={{ animationDelay: "180ms" }}
          >
            <div className="absolute -left-1 top-7 z-0 grid grid-cols-4 gap-3">
              {Array.from({ length: 16 }).map((_, index) => (
                <span
                  key={index}
                  className="about-dot h-2 w-2 rounded-full"
                  style={
                    {
                      backgroundColor: DOT_COLORS[index % DOT_COLORS.length],
                      "--about-dot-i": index,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            <div className="home-card-hover about-float relative z-10 ml-auto mr-1 h-[190px] w-[45%] overflow-hidden rounded-[36px] border-4 border-white bg-gradient-to-br from-[#FAF5FF] to-[#FCE7F3] shadow-lg sm:h-[255px]">
              <Image
                src="/images/about/Tender-Mother-Child.png"
                alt="Mother caring for her child"
                fill
                sizes="(max-width: 640px) 45vw, 260px"
                className="home-img-zoom object-cover"
              />
            </div>

            <div className="home-card-hover relative z-0 -mt-[85px] mr-[13%] h-[300px] overflow-hidden rounded-bl-[38%] rounded-tl-xl rounded-br-xl border border-[#EADDED]/80 bg-[#FAF5FF] shadow-xl sm:-mt-[125px] sm:h-[420px]">
              <Image
                src="/images/about/Joyful-Inclusive.png"
                alt="Children in the community"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 550px"
                className="home-img-zoom object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#7100A8]/20 via-transparent to-[#E90078]/10"
                aria-hidden="true"
              />
            </div>

            <div className="about-ring-pulse absolute left-[7%] top-[32%] z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#9200A8] bg-white/95">
              <span className="h-3 w-3 rounded-full bg-gradient-to-br from-[#9200A8] to-[#E90078]" />
            </div>

            <svg
              aria-hidden="true"
              viewBox="0 0 120 110"
              fill="none"
              className="about-heart-frame absolute -bottom-1 left-[7%] z-20 h-24 w-28 -rotate-12 text-[#E90078] sm:h-32 sm:w-36"
            >
              <path
                d="M60 100 C48 84 8 60 8 34 C8 10 37 3 59 29 C81 3 112 10 112 34 C112 60 72 84 60 100Z"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Sparkles className="absolute bottom-16 right-1 h-6 w-6 text-[#9200A8] motion-safe:animate-pulse" />
          </div>
        </div>
      </Container>
    </section>
  );
}
