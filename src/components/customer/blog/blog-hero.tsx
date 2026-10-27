import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake } from "lucide-react";

import { Container } from "@/components/shared/container";

export function BlogHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-[#E90078]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-52 w-52 rounded-full bg-[#7100A8]/[0.05] blur-3xl"
      />

      <Container>
        <div className="customer-page-top mx-auto max-w-4xl pb-8 text-center sm:pb-10 lg:pb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-white px-3.5 py-1.5">
            <BookOpen className="h-3.5 w-3.5 text-[#9200A8]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75647B] sm:text-[11px]">
              Field Reports & Stories
            </span>
          </div>

          <h1 className="text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#35123F]">
            Stories That{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                Inspire Change
              </span>

              <svg
                aria-hidden="true"
                viewBox="0 0 280 10"
                fill="none"
                className="absolute -bottom-1 left-0 h-2 w-full"
              >
                <defs>
                  <linearGradient
                    id="blog-hero-underline"
                    x1="0"
                    y1="0"
                    x2="280"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#7100A8" />
                    <stop offset=".48" stopColor="#9200A8" />
                    <stop offset="1" stopColor="#E90078" />
                  </linearGradient>
                </defs>

                <path
                  d="M3 7C70 1 210 1 277 6"
                  stroke="url(#blog-hero-underline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#75647B] sm:text-[15px] sm:leading-7">
            Discover community stories, field reports, and updates from our
            education, healthcare, and welfare initiatives. Every story reflects
            the people and purpose behind our work.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#blog-stories"
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              Explore Stories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#EADDED] bg-white px-5 py-2.5 text-sm font-semibold text-[#35123F] transition-colors hover:border-[#9200A8]/50 hover:bg-[#FAF5FF]"
            >
              Get Involved
              <HeartHandshake className="h-4 w-4 text-[#9200A8]" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#EADDED] pt-4">
            {["Community Stories", "Field Updates", "Impact Reports"].map(
              (item, index) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#75647B]"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === 0
                        ? "bg-[#7100A8]"
                        : index === 1
                          ? "bg-[#9200A8]"
                          : "bg-[#E90078]"
                    }`}
                  />
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
