import Link from "next/link";
import { Camera, Sparkles, HeartHandshake, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export function GalleryHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Subtle background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-[#E90078]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-52 w-52 rounded-full bg-[#9200A8]/[0.05] blur-3xl"
      />

      <Container>
        <div className="customer-page-top mx-auto max-w-4xl pb-8 text-center sm:pb-10 lg:pb-12">
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-white px-3.5 py-1.5 shadow-2xs">
            <Camera className="h-3.5 w-3.5 text-[#9200A8]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75647B] sm:text-[11px]">
              Moments & Milestones
            </span>
            <Sparkles className="h-3 w-3 text-[#E90078]" />
          </div>

          {/* Heading with brand gradient & underline */}
          <h1 className="text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#35123F]">
            Capturing Hope,{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                Inspiring Change
              </span>

              <svg
                aria-hidden="true"
                viewBox="0 0 300 10"
                fill="none"
                className="absolute -bottom-1 left-0 h-2 w-full"
              >
                <defs>
                  <linearGradient
                    id="gallery-underline"
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
                  stroke="url(#gallery-underline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#75647B] sm:text-[15px] sm:leading-7">
            A visual chronicle of our grassroots initiatives, community celebrations,
            educational drives, and medical outreach across Karnataka and beyond.
          </p>

          {/* Quick CTA */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] font-semibold text-white shadow-md hover:brightness-110"
            >
              <Link href="/our-works" className="flex items-center gap-2">
                <span>Explore Our Works</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-[#EADDED] text-[#35123F] hover:bg-[#FAF5FF]"
            >
              <Link href="/donate" className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-[#C00083]" />
                <span>Support Our Causes</span>
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
