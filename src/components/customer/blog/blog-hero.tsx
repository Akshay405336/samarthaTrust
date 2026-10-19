import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake } from "lucide-react";

import { Container } from "@/components/shared/container";

export function BlogHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-[#FFD21C]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-52 w-52 rounded-full bg-[#F52232]/[0.04] blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-4xl py-8 text-center sm:py-10 lg:py-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F0E3D6] bg-white px-3.5 py-1.5">
            <BookOpen className="h-3.5 w-3.5 text-[#F4510B]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#78685D] sm:text-[11px]">
              Field Reports & Stories
            </span>
          </div>

          <h1 className="text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#492A22]">
            Stories That{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C] bg-clip-text text-transparent">
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
                    <stop stopColor="#F52232" />
                    <stop offset=".52" stopColor="#FF8A00" />
                    <stop offset="1" stopColor="#FFD21C" />
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

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#78685D] sm:text-[15px] sm:leading-7">
            Discover community stories, field reports, and updates from our
            education, healthcare, and welfare initiatives. Every story reflects
            the people and purpose behind our work.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#blog-stories"
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F52232] via-[#FF6B16] to-[#FF8A00] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              Explore Stories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#EADCCB] bg-white px-5 py-2.5 text-sm font-semibold text-[#492A22] transition-colors hover:border-[#FF8A00]/60 hover:bg-[#FFFCF8]"
            >
              Get Involved
              <HeartHandshake className="h-4 w-4 text-[#F4510B]" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#F0E6DD] pt-4">
            {["Community Stories", "Field Updates", "Impact Reports"].map(
              (item, index) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#80685F]"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === 0
                        ? "bg-[#F52232]"
                        : index === 1
                          ? "bg-[#FF8A00]"
                          : "bg-[#FFD21C]"
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
