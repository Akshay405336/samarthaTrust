import Link from "next/link";
import { ArrowRight, HeartHandshake, Sparkles } from "lucide-react";

import { Container } from "@/components/shared/container";

export function OurWorksHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Subtle background accents */}
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
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F0E3D6] bg-white px-3.5 py-1.5">
            <HeartHandshake className="h-3.5 w-3.5 text-[#F4510B]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#78685D] sm:text-[11px]">
              Grassroots Action
            </span>

            <Sparkles className="h-3 w-3 text-[#FF8A00]" />
          </div>

          {/* Compact heading */}
          <h1 className="text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#492A22]">
            Creating Change,{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C] bg-clip-text text-transparent">
                Transforming Lives
              </span>

              <svg
                aria-hidden="true"
                viewBox="0 0 300 10"
                fill="none"
                className="absolute -bottom-1 left-0 h-2 w-full"
              >
                <defs>
                  <linearGradient
                    id="our-works-underline"
                    x1="0"
                    y1="0"
                    x2="300"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F52232" />
                    <stop offset=".52" stopColor="#FF8A00" />
                    <stop offset="1" stopColor="#FFD21C" />
                  </linearGradient>
                </defs>

                <path
                  d="M3 7C75 1 220 1 297 6"
                  stroke="url(#our-works-underline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#78685D] sm:text-[15px] sm:leading-7">
            From education and healthcare to women’s empowerment and community
            welfare, every initiative helps create a more inclusive future.
          </p>

          {/* Compact actions */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#education"
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F52232] via-[#FF6B16] to-[#FF8A00] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              Explore Our Initiatives
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

          {/* Minimal category strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#F0E6DD] pt-4">
            {[
              { label: "Education", color: "bg-[#F52232]" },
              { label: "Healthcare", color: "bg-[#FF8A00]" },
              { label: "Community Welfare", color: "bg-[#FFD21C]" },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#80685F]"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
