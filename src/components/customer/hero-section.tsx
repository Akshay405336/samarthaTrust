
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/shared/animated-gradient-text";

export function HeroSection() {
  return (
    <section className="relative isolate m-0 min-h-[620px] w-full overflow-hidden bg-[#17121b] p-0 sm:min-h-[660px] lg:min-h-[min(740px,100svh)]">
      {/* Static background image */}
      <Image
        src="/images/Golden-Hour.png"
        alt="Schoolchildren in a rural landscape at golden hour"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-[58%_42%] sm:object-[60%_40%] lg:object-[62%_38%]"
      />

      {/* Static dark fade overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/50 via-[38%] to-transparent"
      />

      {/* Additional subtle shading behind the text only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[75%] bg-gradient-to-r from-black/25 via-black/10 to-transparent"
      />

      {/* Hero content */}
      <div className="customer-page-top relative z-10 mx-auto flex min-h-[620px] w-full max-w-[1720px] items-center px-5 pb-8 sm:min-h-[660px] sm:px-8 sm:pb-9 lg:min-h-[min(740px,100svh)] lg:px-14 lg:pb-8 xl:px-20">
        <div className="w-full max-w-[740px]">
          {/* Animated tagline */}
          <p className="hero-fade-up hero-delay-1 mb-4 text-[10px] font-semibold tracking-[0.1em] text-white sm:mb-5 sm:text-[11px] sm:tracking-[0.14em] lg:text-xs">
            People <span className="px-1">·</span> Education
            <span className="px-1">·</span> Opportunities
            <span className="px-1">·</span> A Brighter Tomorrow
          </p>

          {/* Animated heading */}
          <h1 className="text-[clamp(2rem,3.8vw,4.2rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-white">
            <span className="hero-fade-up hero-delay-2 block">Together for a</span>

            <span className="mt-1 block">
              <span className="relative inline-block">
                <AnimatedGradientText text="Brighter" startDelayMs={980} />

                <svg
                  className="absolute -bottom-2 left-0 h-2 w-full overflow-visible"
                  viewBox="0 0 140 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9C40 2.5 100 2.5 138 8"
                    stroke="url(#samartha-hero-underline)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="samartha-hero-underline"
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
                </svg>
              </span>{" "}
              <span className="hero-fade-up hero-delay-tomorrow">Tomorrow</span>
            </span>
          </h1>

          {/* Animated description */}
          <p className="hero-fade-up hero-delay-3 mt-5 max-w-[620px] text-[13px] leading-5 text-white sm:text-sm sm:leading-6 lg:mt-6 lg:text-base lg:leading-7">
            We work towards inclusive communities, quality education and
            sustainable opportunities for a brighter, more equitable future.
          </p>

          {/* Animated buttons */}
          <div className="hero-fade-up hero-delay-4 mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-3.5">
            <Button
              asChild
              size="lg"
              className="group h-11 rounded-full border-0 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] px-5 text-xs font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98] sm:h-12 sm:px-6 sm:text-sm lg:h-13 lg:px-7"
            >
              <Link href="/programs" className="inline-flex items-center gap-2">
                <span>Support Our Work</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 rounded-full border-white/80 bg-transparent px-5 text-xs font-semibold text-white shadow-none hover:bg-white/10 hover:text-white sm:h-12 sm:px-6 sm:text-sm lg:h-13 lg:px-7"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          {/* Animated impact points */}
          <div className="hero-fade-up hero-delay-5 mt-5 grid max-w-[600px] grid-cols-3 items-center border-t border-white/40 pt-3 text-white sm:mt-6 sm:pt-4">
            <div className="flex items-center gap-2 pr-2 sm:gap-2.5 sm:pr-3">
              <BookOpen className="h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span className="text-[9px] font-medium leading-4 sm:text-[11px] lg:text-xs lg:leading-5">
                Education
                <br />
                for All
              </span>
            </div>

            <div className="flex items-center gap-2 border-l border-white/40 px-2 sm:gap-2.5 sm:px-3">
              <Users className="h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span className="text-[9px] font-medium leading-4 sm:text-[11px] lg:text-xs lg:leading-5">
                Stronger
                <br />
                Communities
              </span>
            </div>

            <div className="flex items-center gap-2 border-l border-white/40 pl-2 sm:gap-2.5 sm:pl-3">
              <Sprout className="h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span className="text-[9px] font-medium leading-4 sm:text-[11px] lg:text-xs lg:leading-5">
                Sustainable
                <br />
                Change
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
