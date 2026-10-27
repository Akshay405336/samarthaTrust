"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ShieldCheck, Award, Sparkles, Receipt } from "lucide-react";

import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const TAGS = [
  { label: "80G Tax Benefits", gradient: "from-[#F59E0B] to-[#EA580C]" },
  { label: "Secure Razorpay", gradient: "from-[#7100A8] to-[#6366F1]" },
  { label: "Official Receipt", gradient: "from-[#E90078] to-[#C026D3]" },
] as const;

export function DonationHero() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.06,
  });

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const active = mounted || isInView;

  return (
    <section
      ref={ref}
      className="relative z-0 isolate overflow-hidden border-b border-[#EADDED]/80 bg-gradient-to-br from-[#FDF2F8]/55 via-[#FFFBEB]/30 to-[#FAF5FF]"
    >
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-45"
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -right-20 -top-10 -z-10 h-72 w-72 rounded-full bg-[#E90078]/20 blur-3xl"
        style={{ "--help-orb-duration": "18s" } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -bottom-24 -left-16 -z-10 h-64 w-64 rounded-full bg-[#F59E0B]/15 blur-3xl"
        style={
          { "--help-orb-duration": "21s", "--help-orb-delay": "450ms" } as React.CSSProperties
        }
      />

      <Container>
        <div className="customer-page-top relative pb-8 sm:pb-10 lg:pb-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-4 text-center lg:col-span-7 lg:text-left">
              <div
                className={cn(
                  revealVariant("scale-in"),
                  "inline-flex items-center gap-2 rounded-full border border-[#FBCFE8]/70 bg-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
                )}
              >
                <Heart className="h-3.5 w-3.5 fill-[#E90078] text-[#E90078] motion-safe:animate-pulse" />
                <span className="bg-gradient-to-r from-[#E90078] to-[#9200A8] bg-clip-text text-[10px] font-bold uppercase tracking-[0.16em] text-transparent sm:text-[11px]">
                  We Believe in Abilities
                </span>
                <Sparkles className="h-3 w-3 text-[#F59E0B]" />
              </div>

              <h1 className="text-[clamp(2rem,4.2vw,3.25rem)] font-extrabold leading-[1.12] tracking-[-0.04em] text-[#35123F]">
                <span
                  className={cn(
                    "help-heading-drop block",
                    active && "help-heading-drop-active"
                  )}
                  style={{ animationDelay: "80ms" }}
                >
              Your Kindness Can{" "}
            </span>
            <span
              className={cn(
                "help-heading-drop mt-1 block",
                active && "help-heading-drop-active"
              )}
              style={{ animationDelay: "200ms" }}
            >
              <span className="relative inline-block">
                    <span className="works-highlight help-lasting-shimmer bg-gradient-to-r from-[#F59E0B] via-[#E90078] to-[#9200A8] bg-clip-text text-transparent">
                      Change a Life
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 240 10"
                      fill="none"
                      className="absolute -bottom-1 left-0 h-2 w-full"
                    >
                      <defs>
                        <linearGradient
                          id="donate-hero-underline"
                          x1="0"
                          y1="0"
                          x2="240"
                          y2="0"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F59E0B" />
                          <stop offset=".5" stopColor="#E90078" />
                          <stop offset="1" stopColor="#9200A8" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M3 7C60 1 180 1 237 6"
                        stroke="url(#donate-hero-underline)"
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
                  "motion-blur-in mx-auto max-w-2xl text-sm leading-6 text-[#75647B] sm:text-base sm:leading-7 lg:mx-0",
                  active && "motion-active"
                )}
                style={{ animationDelay: "360ms" }}
              >
                Every contribution directly empowers children with special needs,
                funds educational materials, and provides essential healthcare for
                underprivileged families across Bengaluru and surrounding communities.
              </p>

              <div
                className={cn(
                  revealVariant("fade-up"),
                  "flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-[#35123F] sm:gap-6 sm:text-sm lg:justify-start"
                )}
                style={{ animationDelay: "440ms" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0]/70 text-[#047857]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Direct Community Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FCE7F3] to-[#FBCFE8]/70 text-[#BE185D]">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  <span>Official Receipt Provided</span>
                </div>
              </div>

              <div
                className={cn(
                  revealVariant("clip-up"),
                  "flex flex-wrap items-center justify-center gap-2 border-t border-[#EADDED]/80 pt-5 lg:justify-start"
                )}
                style={{ animationDelay: "520ms" }}
              >
                {TAGS.map((tag, index) => (
                  <span
                    key={tag.label}
                    className={cn(
                      "help-color-tile inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm",
                      tag.gradient
                    )}
                    style={
                      { "--help-tile-delay": `${index * 110}ms` } as React.CSSProperties
                    }
                  >
                    <Receipt className="h-3 w-3 opacity-90" />
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={cn(
                revealVariant("slide-right"),
                "flex justify-center lg:col-span-5"
              )}
              style={{ animationDelay: "280ms" }}
            >
              <div className="group relative w-full max-w-sm rounded-2xl border border-[#FBCFE8]/60 bg-gradient-to-br from-white via-[#FDF2F8]/80 to-[#FFFBEB]/50 p-2 shadow-lg sm:max-w-md">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-4 top-0 h-1 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#E90078] to-[#9200A8] opacity-90"
                />
                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-[#FAF5FF] sm:h-64">
                  <Image
                    src="/images/about/Joyful-Inclusive.png"
                    alt="Children smiling at Samartha Trust activity center"
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#FCE7F3]">
                      Together for Children
                    </p>
                    <p className="text-sm font-bold leading-tight">
                      Fostering an inclusive tomorrow where every child thrives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
