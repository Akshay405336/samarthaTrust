"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Phone,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const TAGS = [
  { label: "General Inquiries", gradient: "from-[#0D9488] to-[#6366F1]" },
  { label: "Volunteer With Us", gradient: "from-[#9200A8] to-[#E90078]" },
  { label: "CSR Partnerships", gradient: "from-[#F59E0B] to-[#EA580C]" },
] as const;

export function ContactHero() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.08,
  });

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const active = mounted || isInView;

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-b border-[#EADDED]/80 bg-gradient-to-br from-[#CCFBF1]/45 via-[#FDF8FF] to-[#FEF3C7]/35"
    >
      <div
        aria-hidden="true"
        className="about-page-grid pointer-events-none absolute inset-0 opacity-50"
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -right-24 -top-20 -z-10 h-80 w-80 rounded-full bg-[#14B8A6]/25 blur-3xl"
        style={{ "--help-orb-duration": "16s" } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -bottom-24 -left-20 -z-10 h-64 w-64 rounded-full bg-[#F59E0B]/15 blur-3xl"
        style={
          { "--help-orb-duration": "20s", "--help-orb-delay": "400ms" } as React.CSSProperties
        }
      />

      <Container>
        <div className="customer-page-top relative mx-auto max-w-4xl pb-8 text-center sm:pb-10 lg:pb-12">
          <div
            className={cn(
              revealVariant("scale-in"),
              "mb-4 inline-flex items-center gap-2 rounded-full border border-[#99F6E4]/60 bg-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
            )}
          >
            <span className="flex h-2 w-2 rounded-full bg-[#0D9488] motion-safe:animate-pulse" />
            <span className="bg-gradient-to-r from-[#0D9488] to-[#9200A8] bg-clip-text text-[10px] font-bold uppercase tracking-[0.16em] text-transparent sm:text-[11px]">
              Get In Touch
            </span>
            <Sparkles className="h-3 w-3 text-[#E90078]" />
          </div>

          <h1 className="text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#35123F]">
            <span
              className={cn(
                "help-heading-drop block",
                active && "help-heading-drop-active"
              )}
              style={{ animationDelay: "80ms" }}
            >
              We&apos;re Here
            </span>
            <span
              className={cn(
                "help-heading-drop mt-1 block",
                active && "help-heading-drop-active"
              )}
              style={{ animationDelay: "200ms" }}
            >
              <span className="relative inline-block">
                <span className="works-highlight help-lasting-shimmer bg-gradient-to-r from-[#0D9488] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                  To Listen &amp; Help
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 280 10"
                  fill="none"
                  className="absolute -bottom-1 left-0 h-2 w-full"
                >
                  <defs>
                    <linearGradient
                      id="contact-hero-underline"
                      x1="0"
                      y1="0"
                      x2="280"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#0D9488" />
                      <stop offset=".48" stopColor="#9200A8" />
                      <stop offset="1" stopColor="#E90078" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M3 7C70 1 210 1 277 6"
                    stroke="url(#contact-hero-underline)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={cn(active && "trustees-underline-draw")}
                  />
                </svg>
              </span>
            </span>
          </h1>

          <p
            className={cn(
              "motion-blur-in mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#75647B] sm:text-[15px] sm:leading-7",
              active && "motion-active"
            )}
            style={{ animationDelay: "360ms" }}
          >
            Whether you have a general inquiry, wish to volunteer in our community
            welfare programs, or represent an organization seeking an impactful CSR
            partnership, we are eager to hear from you.
          </p>

          <div
            className={cn(
              revealVariant("fade-up"),
              "mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
            )}
            style={{ animationDelay: "460ms" }}
          >
            <a
              href="#contact-form"
              className="help-btn-gradient group inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0D9488] via-[#9200A8] to-[#E90078] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
            >
              <MessageSquare className="h-4 w-4" />
              Send Us a Message
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>

            <Link
              href="/our-works"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#EADDED] bg-white/90 px-5 py-2.5 text-sm font-semibold text-[#35123F] transition-all hover:border-[#0D9488]/50 hover:bg-[#F0FDFA] hover:text-[#0F766E] sm:w-auto"
            >
              Explore Our Works
              <ArrowRight className="h-4 w-4 text-[#75647B]" />
            </Link>
          </div>

          <div
            className={cn(
              revealVariant("clip-up"),
              "mt-7 flex flex-wrap items-center justify-center gap-3 border-t border-[#EADDED]/80 pt-5"
            )}
            style={{ animationDelay: "540ms" }}
          >
            {TAGS.map((tag, index) => (
              <span
                key={tag.label}
                className={cn(
                  "help-color-tile inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm",
                  tag.gradient
                )}
                style={
                  { "--help-tile-delay": `${index * 120}ms` } as React.CSSProperties
                }
              >
                <Phone className="h-3 w-3 opacity-90" />
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
