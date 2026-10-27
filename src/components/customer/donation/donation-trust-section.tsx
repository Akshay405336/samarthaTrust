"use client";

import * as React from "react";
import {
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { TRUST_PILLARS } from "./donation-constants";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
};

const PILLAR_THEMES = [
  {
    shell: "from-[#FFFBEB]/90 via-white to-[#FEF3C7]/35",
    border: "border-[#FCD34D]/45",
    icon: "from-[#FEF3C7] to-[#FDE68A]/70 text-[#B45309]",
    enter: "help-card-rise",
  },
  {
    shell: "from-[#FDF2F8]/95 via-white to-[#FCE7F3]/40",
    border: "border-[#FBCFE8]/50",
    icon: "from-[#FCE7F3] to-[#FBCFE8]/65 text-[#BE185D]",
    enter: "help-card-sway",
  },
  {
    shell: "from-[#EDE9FE]/85 via-white to-[#FAF5FF]",
    border: "border-[#C4B5FD]/45",
    icon: "from-[#EDE9FE] to-[#DDD6FE]/70 text-[#6D28D9]",
    enter: "help-card-pop",
  },
] as const;

const ENTER_ACTIVE: Record<(typeof PILLAR_THEMES)[number]["enter"], string> = {
  "help-card-rise": "help-card-rise-active",
  "help-card-sway": "help-card-sway-active",
  "help-card-pop": "help-card-pop-active",
};

export function DonationTrustSection() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.06,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-[#EADDED]/80 py-12 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#FAF5FF] via-[#FDF2F8]/40 to-[#FFFBEB]/50"
      />
      <div
        aria-hidden="true"
        className="about-page-grid pointer-events-none absolute inset-0 opacity-30"
      />

      <Container className="relative">
        <div
          className={cn(
            revealVariant("scale-in"),
            "mx-auto mb-10 max-w-2xl text-center sm:mb-12"
          )}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#E90078]">
            Our Commitment to Donors
          </span>
          <h2 className="mt-2 text-2xl font-bold text-[#35123F] sm:text-3xl">
            Giving with{" "}
            <span className="bg-gradient-to-r from-[#F59E0B] via-[#9200A8] to-[#6366F1] bg-clip-text text-transparent">
              Confidence &amp; Trust
            </span>
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#75647B] sm:text-sm">
            At Samartha Trust, we treat every donor contribution with the utmost
            respect, integrity, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {TRUST_PILLARS.map((pillar, index) => {
            const Icon = ICON_MAP[pillar.iconName] || ShieldCheck;
            const theme = PILLAR_THEMES[index % PILLAR_THEMES.length];
            return (
              <div
                key={pillar.title}
                className={cn(
                  "flex flex-col items-center space-y-3 rounded-2xl border bg-gradient-to-br p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                  theme.shell,
                  theme.border,
                  theme.enter,
                  isInView && ENTER_ACTIVE[theme.enter]
                )}
                style={{ animationDelay: `${index * 100 + 60}ms` }}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl border border-white/60 bg-gradient-to-br shadow-xs",
                    theme.icon
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-[#35123F]">
                  {pillar.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#75647B]">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
