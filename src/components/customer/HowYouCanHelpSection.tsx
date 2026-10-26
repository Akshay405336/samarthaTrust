import Link from "next/link";
import { ArrowUpRight, Heart, Handshake, Users, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";

const helpOptions = [
  {
    number: "01",
    title: "Sponsor a Child",
    description:
      "Support a child's education, daily care, and wellbeing to help build a brighter future.",
    action: "Sponsor a Child",
    href: "/programs",
    icon: Heart,
    featured: true,
  },
  {
    number: "02",
    title: "Partner With Us",
    description:
      "Collaborate with Samartha Trust to create meaningful community impact through CSR and partnerships.",
    action: "Become a Partner",
    href: "/contact",
    icon: Handshake,
    featured: false,
  },
  {
    number: "03",
    title: "Volunteer With Us",
    description:
      "Share your time, skills, and experience to support children through learning and mentorship.",
    action: "Join Our Team",
    href: "/contact",
    icon: Users,
    featured: false,
  },
];

export function HowYouCanHelpSection() {
  return (
    <section
      aria-labelledby="help-heading"
      className="relative isolate overflow-hidden bg-white py-14 sm:py-16 lg:py-20"
    >
      {/* Soft white and purple-tinted background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-white to-[#FAF5FF]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-80 w-80 rounded-full bg-[#FCE7F3]/40 blur-3xl"
      />

      <Container>
        {/* Section introduction */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-[#9200A8]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#75647B] sm:text-xs">
                Be Part of the Change
              </span>
            </div>

            <h2
              id="help-heading"
              className="text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-[#35123F]"
            >
              Small Actions.
              <span className="block text-brand-gradient">Lasting Impact.</span>
            </h2>
          </div>

          <p className="max-w-md text-[15px] leading-7 text-[#75647B] sm:text-base lg:pb-1">
            Every helping hand can open a new door. Find the way you can make a
            difference in a child&apos;s life.
          </p>
        </div>

        {/* Three distinct help options */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {helpOptions.map((option) => {
            const Icon = option.icon;

            return (
              <article
                key={option.number}
                className={`group relative flex min-h-[310px] flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 sm:p-7 ${
                  option.featured
                    ? "border-[#9200A8]/20 bg-gradient-to-br from-[#FAF5FF] via-white to-[#FDF8FF] shadow-[0_12px_36px_rgba(53,18,63,0.06)]"
                    : "border-[#EADDED] bg-white/90 hover:-translate-y-1 hover:border-[#9200A8]/40 hover:shadow-[0_12px_32px_rgba(53,18,63,0.06)]"
                }`}
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      option.featured
                        ? "bg-gradient-to-br from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-sm"
                        : "bg-[#FCE7F3]/70 text-[#9200A8]"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <span className="text-sm font-medium tracking-widest text-[#75647B]/60">
                    {option.number}
                  </span>
                </div>

                {/* Card content */}
                <div className="mt-7">
                  <h3 className="text-xl font-semibold tracking-tight text-[#35123F] sm:text-2xl">
                    {option.title}
                  </h3>

                  <p className="mt-3 max-w-sm text-[15px] leading-7 text-[#75647B]">
                    {option.description}
                  </p>
                </div>

                {/* Card action */}
                <div className="mt-auto pt-7">
                  <Link
                    href={option.href}
                    className={`group/link inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                      option.featured
                        ? "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                        : "border border-[#EADDED] bg-white text-[#35123F] hover:border-[#9200A8] hover:text-[#9200A8]"
                    }`}
                  >
                    {option.action}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                {/* Featured decorative accent */}
                {option.featured && (
                  <Sparkles
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rotate-12 text-[#9200A8]/[0.05]"
                  />
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom invitation */}
        <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#EADDED] bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCE7F3] text-[#9200A8]">
              <Heart className="h-5 w-5" aria-hidden="true" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#35123F]">
                Every act of kindness counts.
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#75647B]">
                Have another way to help? We&apos;d love to hear from you.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-[#9200A8] transition-colors hover:bg-[#FCE7F3]/50"
          >
            Talk to Our Team
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
