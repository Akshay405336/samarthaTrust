"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

type AboutBannerProps = {
  bgImageSrc: string;
  foregroundImageSrc: string;
};

export function AboutBanner({ bgImageSrc, foregroundImageSrc }: AboutBannerProps) {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    setActive(true);
  }, []);

  const reveal = (delay: number) =>
    cn("hero-fade-up opacity-0", active && `hero-delay-${delay}`);

  return (
    <section className="relative isolate overflow-hidden bg-[#151817] text-white">
      <Image
        src={bgImageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-ken-burns -z-30 object-cover object-center"
      />

      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#7100A8]/40 via-black/70 to-[#E90078]/25" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-black/85 via-black/60 to-[#10251f]/70" />

      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -left-20 top-20 -z-10 h-64 w-64 rounded-full bg-[#9200A8]/25 blur-3xl"
        style={
          { "--help-orb-duration": "16s" } as React.CSSProperties
        }
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -right-16 bottom-10 -z-10 h-56 w-56 rounded-full bg-[#E90078]/20 blur-3xl"
        style={
          { "--help-orb-duration": "18s", "--help-orb-delay": "600ms" } as React.CSSProperties
        }
      />

      <Container className="customer-page-top relative z-10">
        <div className="grid min-h-[400px] items-center gap-8 pb-10 sm:min-h-[440px] sm:pb-12 lg:min-h-[480px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:pb-12">
          <div className="about-float relative mx-auto flex w-full max-w-[320px] items-center justify-center sm:max-w-[350px] lg:mx-0">
            <div className="relative aspect-square w-full">
              <svg
                viewBox="0 0 500 470"
                className="about-heart-frame absolute inset-0 z-10 h-full w-full overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M250 425 C210 390 38 275 38 157 C38 77 132 35 198 91 C225 113 244 139 250 147 C256 139 275 113 302 91 C368 35 462 77 462 157 C462 275 290 390 250 425Z"
                  stroke="#E90078"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  className="about-heart-dash"
                  d="M250 425 C210 390 38 275 38 157 C38 77 132 35 198 91 C225 113 244 139 250 147 C256 139 275 113 302 91 C368 35 462 77 462 157 C462 275 290 390 250 425Z"
                  stroke="#9200A8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="3 10"
                />
              </svg>

              <svg
                viewBox="0 0 500 470"
                className="absolute inset-[5%] z-0 h-[90%] w-[90%]"
                aria-hidden="true"
              >
                <defs>
                  <clipPath id="about-banner-heart">
                    <path d="M250 425 C210 390 38 275 38 157 C38 77 132 35 198 91 C225 113 244 139 250 147 C256 139 275 113 302 91 C368 35 462 77 462 157 C462 275 290 390 250 425Z" />
                  </clipPath>
                </defs>

                <image
                  href={foregroundImageSrc}
                  width="500"
                  height="470"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#about-banner-heart)"
                />
              </svg>

              <div className="absolute -bottom-1 left-1/2 h-8 w-2/3 -translate-x-1/2 rounded-full bg-[#9200A8]/30 blur-2xl" />
            </div>
          </div>

          <div className="mx-auto max-w-[620px] lg:mx-0">
            <div
              className={cn(
                active && "hero-fade-up hero-delay-1",
                "mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm",
                !active && "opacity-0"
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#F472B6] motion-safe:animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
                About Samartha Trust
              </span>
            </div>

            <h1
              className={cn(
                "text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]",
                reveal(2)
              )}
            >
              Every People
              <br className="hidden sm:block" /> This Get Some{" "}
              <span className="about-word-pop inline-block bg-gradient-to-r from-[#F472B6] via-[#E90078] to-[#9200A8] bg-clip-text text-transparent">
                Food.
              </span>
            </h1>

            <p
              className={cn(
                "mt-5 max-w-[560px] text-sm leading-6 text-white/85 sm:text-base sm:leading-7 lg:text-lg",
                reveal(3)
              )}
            >
              Every child deserves care, dignity, and an opportunity to grow.
              Samartha Trust works to support vulnerable children through
              education, healthcare, and compassionate care.
            </p>

            <div className={cn("mt-6 sm:mt-7", reveal(4))}>
              <Link
                href="/contact"
                className="help-btn-gradient group inline-flex min-h-11 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#9200A8]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
              >
                Support Our Mission
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
