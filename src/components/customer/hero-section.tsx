import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAssetUrl } from "@/lib/utils/asset-version";

export function HeroSection() {
  return (
    <section className="relative m-0 w-full overflow-hidden bg-white p-0">
      <div className="grid w-full grid-cols-1 items-stretch gap-0 lg:grid-cols-[47%_53%]">
        {/* Left content */}
        <div className="relative z-10 flex min-w-0 flex-col justify-center gap-5 bg-white px-6 py-5 sm:px-10 sm:py-6 lg:py-5 lg:pl-[max(3rem,calc((100vw-1400px)/2))] lg:pr-7 xl:gap-6">
          {/* Eyebrow */}
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[#78685D] sm:text-xs sm:tracking-[0.15em]">
            People <span className="px-1">·</span> Education
            <span className="px-1">·</span> Opportunities
            <span className="px-1">·</span> A Brighter Tomorrow
          </p>

          {/* Main heading */}
          <h1 className="text-[clamp(2.5rem,3.5vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#492A22]">
            <span className="block">Together for a</span>

            <span className="mt-1 block">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C] bg-clip-text text-transparent">
                  Brighter
                </span>

                <svg
                  className="absolute -bottom-2 left-0 h-2.5 w-full overflow-visible"
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
                      <stop stopColor="#F52232" />
                      <stop offset=".52" stopColor="#FF8A00" />
                      <stop offset="1" stopColor="#FFD21C" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              Tomorrow
            </span>
          </h1>

          {/* Supporting description */}
          <p className="max-w-[580px] text-[15px] leading-7 text-[#78685D] sm:text-base lg:text-[17px]">
            We work towards inclusive communities, quality education and
            sustainable opportunities for a brighter, more equitable future.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full border-0 bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C] px-6 text-base font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-105 active:scale-[0.98] sm:px-8"
            >
              <Link
                href="/programs"
                className="inline-flex items-center gap-2.5"
              >
                <span>Support Our Work</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-[#F52232] bg-white px-6 text-base font-semibold text-[#492A22] shadow-none transition-colors duration-200 hover:bg-[#FFF5E6] hover:text-[#F52232] active:scale-[0.98] sm:px-8"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          {/* Three feature highlights */}
          <div className="mt-2 grid max-w-[600px] grid-cols-3 items-center border-t border-[#EADCCB]/70 pt-4 text-[#492A22]">
            <div className="flex items-center gap-2 pr-2 sm:gap-3 sm:pr-4">
              <BookOpen className="h-5 w-5 shrink-0 text-[#F52232] sm:h-7 sm:w-7" />
              <span className="text-[11px] font-medium leading-5 sm:text-sm">
                Education
                <br />
                for All
              </span>
            </div>

            <div className="flex items-center gap-2 border-l border-[#EADCCB] px-2 sm:gap-3 sm:px-4">
              <Users className="h-5 w-5 shrink-0 text-[#FF8A00] sm:h-7 sm:w-7" />
              <span className="text-[11px] font-medium leading-5 sm:text-sm">
                Stronger
                <br />
                Communities
              </span>
            </div>

            <div className="flex items-center gap-2 border-l border-[#EADCCB] pl-2 sm:gap-3 sm:pl-4">
              <Sprout className="h-5 w-5 shrink-0 text-[#FF8A00] sm:h-7 sm:w-7" />
              <span className="text-[11px] font-medium leading-5 sm:text-sm">
                Sustainable
                <br />
                Change
              </span>
            </div>
          </div>
        </div>

        {/* Right image with soft white fade */}
        <div className="relative m-0 min-w-0 w-full self-stretch overflow-hidden bg-white p-0">
          <div className="relative h-full min-h-[320px] w-full lg:min-h-[460px]">
            <Image
              src={getAssetUrl("/images/samartha-hero.png")}
              alt="A smiling schoolgirl holding books alongside other children and a tree-planting scene"
              width={1920}
              height={768}
              priority
              unoptimized
              sizes="(max-width: 1023px) 100vw, 53vw"
              className="absolute inset-0 block h-full w-full select-none object-cover object-center lg:object-center"
            />

            {/* White fade blends the photograph into the left content */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r from-white via-white/70 to-transparent lg:block xl:w-32"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
