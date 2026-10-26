
import { Heart, GraduationCap, Utensils, Sprout, HandHeart, Users, BookOpen } from "lucide-react";
import { Container } from "@/components/shared/container";

const impactStats = [
  {
    value: "72+",
    label: "Children Supported",
    description: "Helping children access care, education, and a brighter future.",
    icon: Heart,
  },
  {
    value: "3+",
    label: "Care Centers",
    description: "Creating safe, nurturing spaces where every child belongs.",
    icon: GraduationCap,
  },
  {
    value: "1000+",
    label: "Meals Served Monthly",
    description: "Providing nutritious meals to support healthy growth.",
    icon: Utensils,
  },
  {
    value: "5+",
    label: "Years of Community Care",
    description: "Building inclusive communities through compassion and action.",
    icon: Sprout,
  },
];

export function ImpactSection() {
  return (
    <section
      aria-labelledby="impact-heading"
      className="relative isolate overflow-hidden bg-white py-10 sm:py-12 lg:py-14"
    >
      {/* NGO-inspired soft background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFFCFF] to-[#FAF5FF]" />

        {/* Soft color blobs */}
        <div className="absolute -left-20 top-[10%] h-64 w-64 rounded-full bg-[#E9D5FF]/40 blur-3xl" />
        <div className="absolute right-[5%] top-[5%] h-64 w-64 rounded-full bg-[#FBCFE8]/35 blur-3xl" />
        <div className="absolute -right-20 top-[42%] h-72 w-72 rounded-full bg-[#DDD6FE]/40 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[20%] h-72 w-72 rounded-full bg-[#FCE7F3]/50 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[12%] h-64 w-64 rounded-full bg-[#EDE9FE]/50 blur-3xl" />

        {/* Flowing waves */}
        <div className="absolute -left-[15%] top-[24%] h-[220px] w-[130%] rotate-[-5deg] rounded-[50%] bg-white/50 blur-2xl" />
        <div className="absolute -left-[20%] bottom-[-170px] h-[280px] w-[140%] rotate-[3deg] rounded-[50%] bg-[#FDF8FF]/80 blur-3xl" />

        {/* Subtle NGO-themed decorative icons */}
        <Heart className="absolute left-[7%] top-[18%] h-8 w-8 rotate-[-15deg] text-[#E90078]/15" />
        <HandHeart className="absolute right-[9%] top-[22%] h-10 w-10 rotate-[8deg] text-[#9200A8]/15" />
        <GraduationCap className="absolute left-[20%] top-[55%] h-9 w-9 rotate-[-8deg] text-[#7100A8]/10" />
        <BookOpen className="absolute right-[18%] top-[60%] h-8 w-8 rotate-[8deg] text-[#9200A8]/15" />
        <Utensils className="absolute left-[12%] bottom-[16%] h-7 w-7 rotate-[8deg] text-[#E90078]/12" />
        <Users className="absolute right-[35%] bottom-[12%] h-9 w-9 text-[#7100A8]/10" />
        <Sprout className="absolute right-[5%] bottom-[18%] h-8 w-8 rotate-[-10deg] text-[#9200A8]/15" />
      </div>

      <Container className="relative z-10">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-white/90 px-4 py-2">
            <Heart
              className="h-4 w-4 fill-[#E90078] text-[#E90078]"
              aria-hidden="true"
            />

            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#75647B] sm:text-xs">
              Making a Difference
            </span>
          </div>

          <h2
            id="impact-heading"
            className="text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-[#35123F]"
          >
            Our Impact, <span className="text-brand-gradient">Our Promise</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#75647B] sm:text-base lg:text-[17px]">
            Every child supported, every meal served, and every safe space
            created brings us closer to a brighter and more inclusive future.
          </p>
        </div>

        {/* Impact cards */}
        <div className="mt-8 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            const isFeatured = index === 2;

            return (
              <article
                key={stat.label}
                className={`group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6 ${
                  isFeatured
                    ? "border-[#9200A8] bg-gradient-to-br from-[#7100A8] via-[#9200A8] to-[#E90078] shadow-[0_12px_30px_rgba(113,0,168,0.16)] hover:shadow-[0_16px_36px_rgba(113,0,168,0.24)]"
                    : "border-[#EADDED] bg-white/95 shadow-[0_6px_24px_rgba(53,18,63,0.035)] hover:border-[#9200A8]/40 hover:shadow-[0_12px_30px_rgba(53,18,63,0.07)]"
                }`}
              >
                {/* Top accent */}
                <div
                  className={`absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    isFeatured
                      ? "bg-white/80"
                      : "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]"
                  }`}
                />

                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      isFeatured
                        ? "bg-white/15 text-white ring-1 ring-white/20"
                        : "bg-[#FCE7F3]/70 text-[#9200A8]"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <span
                    className={`text-xs font-medium tracking-widest ${
                      isFeatured
                        ? "text-white/60"
                        : "text-[#75647B]/50"
                    }`}
                  >
                    0{index + 1}
                  </span>
                </div>

                <p
                  className={`mt-5 text-[clamp(2rem,2.5vw,2.5rem)] font-bold leading-none tracking-[-0.04em] ${
                    isFeatured ? "text-white" : "text-[#9200A8]"
                  }`}
                >
                  {stat.value}
                </p>

                <h3
                  className={`mt-3 text-base font-semibold leading-snug sm:text-lg ${
                    isFeatured ? "text-white" : "text-[#35123F]"
                  }`}
                >
                  {stat.label}
                </h3>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    isFeatured ? "text-white/80" : "text-[#75647B]"
                  }`}
                >
                  {stat.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Closing message */}
        <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#EADDED] bg-white/90 p-5 text-center sm:flex-row sm:px-7 sm:text-left">
          <div>
            <h3 className="text-base font-semibold text-[#35123F] sm:text-lg">
              Together, we can do more.
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#75647B]">
              Be part of a community that cares, supports, and creates change.
            </p>
          </div>

          <a
            href="/programs"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
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
