import { Heart, GraduationCap, Utensils, Sprout } from "lucide-react";
import { Container } from "@/components/shared/container";

const impactStats = [
  {
    value: "72+",
    label: "Children Supported",
    description: "Helping children build brighter futures.",
    icon: Heart,
  },
  {
    value: "3+",
    label: "Care Centers",
    description: "Providing safe and supportive spaces.",
    icon: GraduationCap,
  },
  {
    value: "1000+",
    label: "Meals Served Monthly",
    description: "Supporting healthy growth every day.",
    icon: Utensils,
  },
  {
    value: "5+",
    label: "Years of Service",
    description: "Creating lasting community impact.",
    icon: Sprout,
  },
];

export function ImpactSection() {
  return (
    <section
      aria-labelledby="impact-heading"
      className="relative isolate overflow-hidden bg-white py-10 sm:py-12 lg:py-14"
    >
      {/* Subtle white and creamy wave background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#FFFCF8]" />

        <div className="absolute -left-[15%] top-[18%] h-[260px] w-[130%] rotate-[-5deg] rounded-[50%] bg-[#FFFDF9]/80 blur-2xl" />

        <div className="absolute -right-[20%] bottom-[-100px] h-[280px] w-[140%] rotate-[4deg] rounded-[50%] bg-[#FFF8EF]/65 blur-3xl" />

        <div className="absolute -left-[25%] bottom-[-170px] h-[280px] w-[120%] rounded-[50%] bg-[#FFFDF9]/90 blur-3xl" />
      </div>

      <Container className="relative z-10">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F0E8DC] bg-white/90 px-4 py-2">
            <Heart
              className="h-4 w-4 fill-[#F4510B] text-[#F4510B]"
              aria-hidden="true"
            />

            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#78685D] sm:text-xs">
              Making a Difference
            </span>
          </div>

          <h2
            id="impact-heading"
            className="text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-[#492A22]"
          >
            Our Impact, <span className="text-[#F4510B]">Our Promise</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#78685D] sm:text-base lg:text-[17px]">
            Every child supported, every meal served, and every safe space
            created brings us closer to a brighter and more inclusive future.
          </p>
        </div>

        {/* Impact cards */}
        <div className="mt-8 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-[#F0E8DC] bg-white/95 p-5 shadow-[0_6px_24px_rgba(73,42,34,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#EADCCB] hover:shadow-[0_12px_30px_rgba(73,42,34,0.07)] sm:p-6"
              >
                {/* Very subtle top accent */}
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C] transition-transform duration-300 group-hover:scale-x-100" />

                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF9F3] text-[#F4510B]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <span className="text-xs font-medium tracking-widest text-[#D5C9BC]">
                    0{index + 1}
                  </span>
                </div>

                <p className="mt-5 text-[clamp(2rem,2.5vw,2.5rem)] font-bold leading-none tracking-[-0.04em] text-[#F4510B]">
                  {stat.value}
                </p>

                <h3 className="mt-3 text-base font-semibold leading-snug text-[#492A22] sm:text-lg">
                  {stat.label}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#78685D]">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Closing message */}
        <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#F0E8DC] bg-white/90 p-5 text-center sm:flex-row sm:px-7 sm:text-left">
          <div>
            <h3 className="text-base font-semibold text-[#492A22] sm:text-lg">
              Together, we can do more.
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#78685D]">
              Be part of a community that cares, supports, and creates change.
            </p>
          </div>

          <a
            href="/programs"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
          >
            Support Our Work
            <Heart
              className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            />
          </a>
        </div>
      </Container>
    </section>
  );
}
