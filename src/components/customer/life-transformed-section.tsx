import * as React from "react";
import Image from "next/image";
import { Heart, ArrowUpRight, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { getAssetUrl } from "@/lib/utils/asset-version";

export function LifeTransformedSection() {
  return (
    <section
      aria-labelledby="life-transformed-heading"
      className="relative w-full overflow-hidden bg-[#FDF8FF] py-12 sm:py-16 lg:py-20"
    >
      {/* Soft background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-[#FCE7F3]/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#FAF5FF]/60 blur-3xl"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 xl:gap-20">
          {/* Story image */}
          <div className="relative mx-auto w-full max-w-[680px] lg:mx-0">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-[#FAF5FF] shadow-[0_20px_60px_rgba(53,18,63,0.10)] sm:rounded-[32px]">
              <Image
                src={getAssetUrl("/images/about/hand.jpg")}
                alt="Children sharing joyful moments and building confidence"
                fill
                priority={false}
                sizes="(max-width: 1023px) 100vw, 52vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#21140F]/55 via-transparent to-transparent" />

              {/* Image caption */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  Every child deserves a brighter future
                </div>
              </div>
            </div>

            {/* Floating story card */}
            <div className="relative z-10 mx-4 -mt-5 flex items-center gap-3 rounded-2xl border border-[#EADDED] bg-white p-4 shadow-[0_12px_35px_rgba(53,18,63,0.08)] sm:absolute sm:-bottom-5 sm:-right-5 sm:mx-0 sm:mt-0 sm:max-w-[260px] sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FCE7F3] text-[#9200A8]">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#35123F]">
                  Hope changes everything
                </p>
                <p className="mt-1 text-xs leading-5 text-[#75647B]">
                  Care, education and support can open new doors.
                </p>
              </div>
            </div>
          </div>

          {/* Story content */}
          <div className="flex min-w-0 flex-col pt-2 lg:py-4">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="h-px w-8 bg-[#9200A8]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#75647B] sm:text-xs">
                A Story of Hope
              </span>
            </div>

            <h2
              id="life-transformed-heading"
              className="max-w-xl text-[clamp(2.3rem,4vw,3.6rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-[#35123F]"
            >
              A Life{" "}
              <span className="relative inline-block text-brand-gradient">
                Transformed
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[3px] w-2/3 rounded-full bg-[#E90078]"
                />
              </span>
            </h2>

            <p className="mt-5 text-base font-medium leading-7 text-[#C00083] sm:text-lg">
              Real stories of hope, resilience and new beginnings.
            </p>

            <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#75647B] sm:text-base sm:leading-8">
              <p>
                When Ramesh (name changed) came to Samartha Trust, he had no
                access to stable shelter or consistent education. Like many
                children from vulnerable backgrounds, his future seemed
                uncertain.
              </p>

              <p>
                Today, he attends school regularly, participates in activities
                with confidence, and dreams of becoming a teacher. With
                structured care, guidance and emotional support, he now has the
                stability every child deserves.
              </p>
            </div>

            {/* Closing message */}
            <div className="mt-6 flex items-start gap-3 border-l-[3px] border-[#9200A8] pl-4">
              <Heart
                className="mt-1 h-5 w-5 shrink-0 text-[#E90078]"
                aria-hidden="true"
              />
              <p className="text-base font-semibold leading-7 text-[#35123F] sm:text-lg">
                Your support makes stories like his possible.
              </p>
            </div>

            {/* Subtle bottom accent */}
            <div className="mt-7 flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]" />
              <span className="text-xs font-medium tracking-wide text-[#75647B]">
                Small acts. Lasting change.
              </span>
              <ArrowUpRight
                className="h-4 w-4 text-[#9200A8]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
