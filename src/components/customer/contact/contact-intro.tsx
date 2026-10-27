"use client";

import * as React from "react";
import { HeartHandshake, Building2, Heart, Users } from "lucide-react";

import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const ENGAGEMENT_AREAS = [
  {
    icon: HeartHandshake,
    title: "Grassroots Volunteering",
    description:
      "Join our weekend health checkups, vocational workshops, and education sessions for specially-abled youth.",
    shell: "from-[#FEF3C7]/90 via-white to-[#FFFBEB]/80",
    border: "border-[#FCD34D]/40",
    iconBg: "bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]/60 text-[#B45309]",
    enter: "help-card-rise",
  },
  {
    icon: Building2,
    title: "CSR & Partnerships",
    description:
      "Collaborate with us on audited, high-impact institutional initiatives with full transparency.",
    shell: "from-[#EDE9FE]/85 via-white to-[#FAF5FF]",
    border: "border-[#C4B5FD]/45",
    iconBg: "bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE]/70 text-[#6D28D9]",
    enter: "help-card-sway",
  },
  {
    icon: Heart,
    title: "Donations & Aid",
    description:
      "Support our ongoing initiatives with one-time contributions, nutrition drives, and learning kits.",
    shell: "from-[#FCE7F3]/90 via-white to-[#FDF2F8]/75",
    border: "border-[#FBCFE8]/50",
    iconBg: "bg-gradient-to-br from-[#FCE7F3] to-[#FBCFE8]/60 text-[#BE185D]",
    enter: "help-card-pop",
  },
  {
    icon: Users,
    title: "Community Outreach",
    description:
      "Refer families, children, or rural clusters in need of education, assistive aid, or medical care.",
    shell: "from-[#CCFBF1]/80 via-white to-[#F0FDFA]/70",
    border: "border-[#99F6E4]/50",
    iconBg: "bg-gradient-to-br from-[#CCFBF1] to-[#99F6E4]/50 text-[#0F766E]",
    enter: "help-card-rise",
  },
] as const;

const ENTER_ACTIVE: Record<(typeof ENGAGEMENT_AREAS)[number]["enter"], string> = {
  "help-card-rise": "help-card-rise-active",
  "help-card-sway": "help-card-sway-active",
  "help-card-pop": "help-card-pop-active",
};

export function ContactIntro() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.06,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-[#EADDED]/80 bg-gradient-to-r from-[#FFFBEB]/70 via-[#FAF5FF] to-[#ECFDF5]/55 py-10 sm:py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#FEF3C7]/30 to-transparent"
      />

      <Container>
        <div
          className={cn(
            revealVariant("slide-left"),
            "mb-8 max-w-2xl"
          )}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488]">
            How We Connect
          </span>
          <h2 className="mt-1 text-xl font-bold text-[#35123F] sm:text-2xl">
            Many paths to{" "}
            <span className="bg-gradient-to-r from-[#0D9488] to-[#9200A8] bg-clip-text text-transparent">
              meaningful impact
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENGAGEMENT_AREAS.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className={cn(
                  "group flex flex-col rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                  area.shell,
                  area.border,
                  area.enter,
                  isInView && ENTER_ACTIVE[area.enter]
                )}
                style={{ animationDelay: `${index * 90 + 80}ms` }}
              >
                <div
                  className={cn(
                    "mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 shadow-xs transition-transform duration-300 group-hover:scale-110",
                    area.iconBg
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-[#35123F]">{area.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#75647B]">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
