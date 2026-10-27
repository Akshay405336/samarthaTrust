"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  Handshake,
  Users,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

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
    accent: "from-[#7100A8] via-[#9200A8] to-[#E90078]",
    glow: "linear-gradient(120deg, #7100A8, #E90078, #F472B6)",
    wash: "from-[#FCE7F3]/80 via-white to-[#FAF5FF]",
    enter: "help-card-rise",
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
    accent: "from-[#6366F1] via-[#9200A8] to-[#C026D3]",
    glow: "linear-gradient(120deg, #6366F1, #9200A8, #E90078)",
    wash: "from-[#EDE9FE]/70 via-white to-[#FAF5FF]",
    enter: "help-card-sway",
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
    accent: "from-[#EC4899] via-[#9200A8] to-[#7100A8]",
    glow: "linear-gradient(120deg, #EC4899, #9200A8, #7100A8)",
    wash: "from-[#FDF2F8]/70 via-white to-[#FAF5FF]",
    enter: "help-card-pop",
  },
] as const;

const CARD_BASE_DELAY_MS = 520;
const CARD_STAGGER_MS = 120;

export function HowYouCanHelpSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [entranceActive, setEntranceActive] = React.useState(false);

  React.useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting && entry.intersectionRatio >= 0.2;
        setEntranceActive(visible);
      },
      { threshold: [0, 0.2, 0.4] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="help-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#FDF8FF] to-[#FAF5FF] py-12 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="help-section-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-70"
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -left-16 top-6 -z-10 h-48 w-48 rounded-full bg-[#E90078]/20 blur-3xl"
        style={{ "--help-orb-duration": "15s" } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -right-12 bottom-4 -z-10 h-44 w-44 rounded-full bg-[#6366F1]/18 blur-3xl"
        style={
          { "--help-orb-duration": "17s", "--help-orb-delay": "400ms" } as React.CSSProperties
        }
      />

      <Container className="relative">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-9 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <div
              className={cn(
                "help-heading-drop mb-3 inline-flex items-center gap-2 rounded-full border border-[#EADDED]/90 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm",
                entranceActive && "help-heading-drop-active"
              )}
              style={{ animationDelay: "0ms" }}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#E90078] motion-safe:animate-pulse" />
              <span className="bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-[11px] font-semibold uppercase tracking-[0.16em] text-transparent sm:text-xs">
                Be Part of the Change
              </span>
            </div>

            <h2
              id="help-heading"
              className="text-[clamp(1.85rem,2.8vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-[#35123F]"
            >
              <span
                className={cn(
                  "help-heading-drop block",
                  entranceActive && "help-heading-drop-active"
                )}
                style={{ animationDelay: "120ms" }}
              >
                Small Actions.
              </span>
              <span
                className={cn(
                  "help-heading-drop block",
                  entranceActive && "help-heading-drop-active"
                )}
                style={{ animationDelay: "240ms" }}
              >
                <span className="help-lasting-shimmer block text-brand-gradient">
                  Lasting Impact.
                </span>
              </span>
              <span
                className={cn(
                  "mt-2 block h-1 w-24 origin-left rounded-full bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]",
                  entranceActive ? "help-line-grow" : "scale-x-0"
                )}
                aria-hidden="true"
              />
            </h2>
          </div>

          <p
            className={cn(
              "help-word-stagger max-w-md text-[15px] leading-6 text-[#75647B] sm:text-base lg:pb-0.5",
              entranceActive && "help-word-stagger-active"
            )}
          >
            <span>Every</span> <span>helping</span> <span>hand</span> <span>can</span>{" "}
            <span>open</span> <span>a</span> <span>new</span> <span>door.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          {helpOptions.map((option, index) => {
            const Icon = option.icon;
            const cardDelay = CARD_BASE_DELAY_MS + index * CARD_STAGGER_MS;
            const enterActive = `${option.enter}-active`;

            return (
              <article
                key={option.number}
                className={cn(
                  option.enter,
                  entranceActive && enterActive,
                  option.featured
                    ? "help-card-glow help-card-border-glow home-card-hover group relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#9200A8]/30 p-5 shadow-[0_12px_36px_rgba(113,0,168,0.12)] sm:p-6"
                    : cn(
                        "home-card-hover group relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#EADDED] p-5 sm:p-6",
                        index === 1 && "motion-card-tilt",
                        index === 2 && "hover:scale-[1.02]"
                      )
                )}
                style={
                  {
                    animationDelay: `${cardDelay}ms`,
                    "--help-card-glow": option.glow,
                  } as React.CSSProperties
                }
              >
                <div
                  className={cn(
                    "help-accent-bar absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r",
                    option.accent
                  )}
                  aria-hidden="true"
                />

                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
                    option.wash
                  )}
                  aria-hidden="true"
                />

                <div className="relative z-[1] flex items-center justify-between pt-2">
                  <span
                    className={cn(
                      "help-icon-pop flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                      option.accent
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold tracking-widest text-[#9200A8] ring-1 ring-[#EADDED]">
                    {option.number}
                  </span>
                </div>

                <div className="relative z-[1] mt-5 flex flex-1 flex-col">
                  <h3 className="text-lg font-semibold tracking-tight text-[#35123F] sm:text-xl">
                    {option.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#75647B] sm:text-[15px] sm:leading-7">
                    {option.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <Link
                      href={option.href}
                      className={cn(
                        "group/link inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-300 active:scale-[0.98]",
                        option.featured
                          ? "help-btn-gradient bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-md hover:shadow-lg"
                          : "border border-[#EADDED] bg-white/90 text-[#35123F] backdrop-blur-sm hover:border-[#9200A8] hover:bg-[#FAF5FF] hover:text-[#9200A8]"
                      )}
                    >
                      {option.action}
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>

                {option.featured && (
                  <Sparkles
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 top-6 z-0 h-24 w-24 rotate-12 text-[#9200A8]/10"
                  />
                )}
              </article>
            );
          })}
        </div>

        <div
          className={cn(
            "help-footer-slide relative mt-6 overflow-hidden rounded-xl border border-[#EADDED]/80 p-4 sm:flex sm:items-center sm:justify-between sm:px-6 sm:py-4",
            entranceActive && "help-footer-slide-active"
          )}
          style={{ animationDelay: "900ms" }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#7100A8]/10 via-[#FCE7F3]/50 to-[#E90078]/10"
            aria-hidden="true"
          />
          <div className="relative flex items-start gap-3 sm:items-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7100A8] to-[#E90078] text-white shadow-sm">
              <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#35123F] sm:text-base">
                Every act of kindness counts.
              </h3>
              <p className="mt-0.5 text-xs leading-5 text-[#75647B] sm:text-sm">
                Have another way to help? We&apos;d love to hear from you.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="relative mt-3 inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white/95 px-4 text-sm font-semibold text-[#9200A8] shadow-sm ring-1 ring-[#EADDED] transition-all hover:-translate-y-0.5 hover:ring-[#9200A8]/35 sm:mt-0"
          >
            Talk to Our Team
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
