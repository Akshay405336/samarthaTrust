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
      {/* Soft white and cream background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-white to-[#FFFCF7]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-80 w-80 rounded-full bg-[#FFF4E8]/60 blur-3xl"
      />

      <Container>
        {/* Section introduction */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-[#F4510B]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#78685D] sm:text-xs">
                Be Part of the Change
              </span>
            </div>

            <h2
              id="help-heading"
              className="text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-[#492A22]"
            >
              Small Actions.
              <span className="block text-[#F4510B]">Lasting Impact.</span>
            </h2>
          </div>

          <p className="max-w-md text-[15px] leading-7 text-[#78685D] sm:text-base lg:pb-1">
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
                    ? "border-[#F4510B]/20 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFFDF9] shadow-[0_12px_36px_rgba(73,42,34,0.06)]"
                    : "border-[#F0E8DC] bg-white/90 hover:-translate-y-1 hover:border-[#EADCCB] hover:shadow-[0_12px_32px_rgba(73,42,34,0.06)]"
                }`}
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      option.featured
                        ? "bg-gradient-to-br from-[#F52232] via-[#FF8A00] to-[#FFD21C] text-white shadow-sm"
                        : "bg-[#FFF7EF] text-[#F4510B]"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <span className="text-sm font-medium tracking-widest text-[#C9B9A9]">
                    {option.number}
                  </span>
                </div>

                {/* Card content */}
                <div className="mt-7">
                  <h3 className="text-xl font-semibold tracking-tight text-[#492A22] sm:text-2xl">
                    {option.title}
                  </h3>

                  <p className="mt-3 max-w-sm text-[15px] leading-7 text-[#78685D]">
                    {option.description}
                  </p>
                </div>

                {/* Card action */}
                <div className="mt-auto pt-7">
                  <Link
                    href={option.href}
                    className={`group/link inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                      option.featured
                        ? "bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                        : "border border-[#EADCCB] bg-white text-[#492A22] hover:border-[#F4510B] hover:text-[#F4510B]"
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
                    className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rotate-12 text-[#F4510B]/[0.04]"
                  />
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom invitation */}
        <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#F0E8DC] bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF3E8] text-[#F4510B]">
              <Heart className="h-5 w-5" aria-hidden="true" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#492A22]">
                Every act of kindness counts.
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#78685D]">
                Have another way to help? We&apos;d love to hear from you.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-[#F4510B] transition-colors hover:bg-[#FFF5EC]"
          >
            Talk to Our Team
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
