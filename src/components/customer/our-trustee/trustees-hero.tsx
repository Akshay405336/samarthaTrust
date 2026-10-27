"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

type TrusteesHeroProps = {
  heroImageSrc: string;
};

export function TrusteesHero({ heroImageSrc }: TrusteesHeroProps) {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.12,
  });

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const active = mounted || isInView;

  return (
    <section
      ref={ref}
      className="customer-page-top relative isolate m-0 w-full overflow-hidden bg-gradient-to-b from-white via-[#FDF8FF] to-[#FAF5FF] pb-8 sm:pb-10 lg:pb-12"
    >
      <div
        aria-hidden="true"
        className="about-page-grid pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -left-20 top-24 -z-10 h-56 w-56 rounded-full bg-[#9200A8]/20 blur-3xl"
        style={{ "--help-orb-duration": "16s" } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -right-16 top-8 -z-10 h-64 w-64 rounded-full bg-[#E90078]/18 blur-3xl"
        style={
          { "--help-orb-duration": "18s", "--help-orb-delay": "500ms" } as React.CSSProperties
        }
      />

      <Container className="relative">
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="relative z-10 flex min-w-0 flex-col gap-5 sm:gap-6">
            <p
              className={cn(
                "help-word-stagger text-[11px] font-semibold tracking-[0.12em] text-[#75647B] sm:text-xs sm:tracking-[0.15em]",
                active && "help-word-stagger-active"
              )}
            >
              <span className="text-[#9200A8]">Leadership</span>{" "}
              <span>·</span> <span>Trust</span> <span>·</span>{" "}
              <span>Community</span> <span>·</span>{" "}
              <span className="bg-gradient-to-r from-[#7100A8] to-[#E90078] bg-clip-text text-transparent">
                Brighter Tomorrow
              </span>
            </p>

            <h1 className="text-[clamp(2.5rem,4vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#35123F]">
              <span
                className={cn(
                  "help-heading-drop block",
                  active && "help-heading-drop-active"
                )}
                style={{ animationDelay: "80ms" }}
              >
                Meet the People
              </span>

              <span
                className={cn(
                  "help-heading-drop mt-1 block",
                  active && "help-heading-drop-active"
                )}
                style={{ animationDelay: "200ms" }}
              >
                <span className="relative inline-block">
                  <span className="help-lasting-shimmer bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                    Behind
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 h-2.5 w-full overflow-visible"
                    viewBox="0 0 140 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="trustees-hero-underline"
                        x1="0"
                        y1="0"
                        x2="140"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#7100A8" />
                        <stop offset=".48" stopColor="#9200A8" />
                        <stop offset="1" stopColor="#E90078" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M2 9C40 2.5 100 2.5 138 8"
                      stroke="url(#trustees-hero-underline)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className={cn(active && "trustees-underline-draw")}
                    />
                  </svg>
                </span>{" "}
                Our Trustees
              </span>
            </h1>

            <p
              className={cn(
                "motion-blur-in max-w-[580px] text-[15px] leading-7 text-[#75647B] sm:text-base lg:text-[17px]",
                active && "motion-active"
              )}
              style={{ animationDelay: "360ms" }}
            >
              Meet the dedicated leaders guiding Samartha Trust with compassion,
              integrity, and a shared commitment to a brighter future for every
              child and community.
            </p>

            <div
              className={cn(
                revealVariant("slide-left"),
                "inline-flex w-fit items-center gap-2 rounded-full border border-[#EADDED] bg-white/90 px-3 py-1.5 shadow-sm"
              )}
              style={{ animationDelay: "480ms" }}
            >
              <ShieldCheck className="h-4 w-4 text-[#9200A8]" />
              <span className="text-xs font-semibold text-[#35123F]">
                Governance you can trust
              </span>
            </div>
          </div>

          <div
            className={cn(
              revealVariant("clip-up"),
              "relative mx-auto w-full max-w-[400px] lg:ml-auto"
            )}
            style={{ animationDelay: "240ms" }}
          >
            <div className="about-float home-card-hover relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-[#EADDED]/80 shadow-[0_20px_50px_rgba(113,0,168,0.12)]">
              <Image
                src={heroImageSrc}
                alt="Children and community members supported by Samartha Trust"
                fill
                priority
                unoptimized
                sizes="(max-width: 1023px) 100vw, 400px"
                className="home-img-zoom object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#7100A8]/25 via-transparent to-[#E90078]/15"
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#F472B6]" />
                Our stewards
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute -bottom-3 -left-3 -z-10 h-20 w-20 rounded-bl-[28px] rounded-tr-[28px] bg-gradient-to-br from-[#7100A8] to-[#E90078] opacity-90 shadow-lg"
            />
            <div
              aria-hidden="true"
              className="help-orb absolute -right-3 -top-3 -z-10 h-16 w-16 rounded-full bg-[#6366F1]/35 blur-xl"
              style={{ "--help-orb-duration": "12s" } as React.CSSProperties}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
