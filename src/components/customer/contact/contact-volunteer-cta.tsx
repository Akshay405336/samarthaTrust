"use client";

import * as React from "react";
import Link from "next/link";
import { HeartHandshake, Heart, Building2, ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const CTA_CARDS = [
  {
    icon: HeartHandshake,
    title: "Become a Volunteer",
    description:
      "Contribute your skills during weekend camps, education workshops, and special therapy sessions for children.",
    href: "#contact-form",
    linkLabel: "Sign Up to Volunteer",
    external: false,
    shell: "from-[#FFFBEB]/90 via-white to-[#FEF3C7]/40",
    border: "border-[#FCD34D]/40",
    iconWrap: "from-[#FEF3C7] to-[#FDE68A]/70 text-[#B45309]",
    enter: "help-card-rise",
  },
  {
    icon: Heart,
    title: "Support With a Donation",
    description:
      "Fund assistive kits, nutrition, and specialized schooling. Eligible for 50% tax deduction under Section 80G.",
    href: "/donate",
    linkLabel: "Make a Secure Donation",
    external: false,
    shell: "from-[#FDF2F8]/95 via-white to-[#FCE7F3]/55",
    border: "border-[#E90078]/35",
    iconWrap: "from-[#FCE7F3] to-[#FBCFE8] text-[#BE185D]",
    enter: "help-card-pop",
    featured: true,
  },
  {
    icon: Building2,
    title: "CSR & Institutional Ties",
    description:
      "Co-create audited, high-impact corporate social initiatives with transparent tracking and reporting.",
    href: "#contact-form",
    linkLabel: "Propose Collaboration",
    external: false,
    shell: "from-[#EDE9FE]/85 via-white to-[#FAF5FF]",
    border: "border-[#C4B5FD]/45",
    iconWrap: "from-[#EDE9FE] to-[#DDD6FE]/70 text-[#6D28D9]",
    enter: "help-card-sway",
  },
] as const;

const ENTER_ACTIVE: Record<(typeof CTA_CARDS)[number]["enter"], string> = {
  "help-card-rise": "help-card-rise-active",
  "help-card-sway": "help-card-sway-active",
  "help-card-pop": "help-card-pop-active",
};

export function ContactVolunteerCTA() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.06,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-[#EADDED]/80 py-14 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#FFF7ED]/80 via-[#FDF8FF] to-[#FCE7F3]/45"
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#F59E0B]/12 blur-3xl"
        style={{ "--help-orb-duration": "22s" } as React.CSSProperties}
      />

      <Container className="relative">
        <div
          className={cn(
            revealVariant("clip-up"),
            "mx-auto mb-10 max-w-3xl text-center sm:mb-14"
          )}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
            Join Hands With Us
          </span>
          <h2 className="mt-1.5 text-2xl font-bold text-[#35123F] sm:text-3xl lg:text-4xl">
            Ways You Can Create{" "}
            <span className="bg-gradient-to-r from-[#F59E0B] via-[#9200A8] to-[#0D9488] bg-clip-text text-transparent">
              Real Change
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#75647B]">
            Whether through personal time, financial contributions, or corporate
            alliances, every partnership directly enriches the lives of
            specially-abled children and rural families.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {CTA_CARDS.map((card, index) => {
            const Icon = card.icon;
            const LinkWrap = card.href.startsWith("/") ? Link : "a";
            const linkProps =
              card.href.startsWith("/")
                ? { href: card.href }
                : { href: card.href };

            return (
              <Card
                key={card.title}
                className={cn(
                  "relative flex flex-col justify-between overflow-hidden border bg-gradient-to-br shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                  card.shell,
                  card.border,
                  card.enter,
                  isInView && ENTER_ACTIVE[card.enter],
                  "featured" in card && card.featured && "md:-mt-1 md:shadow-md"
                )}
                style={{ animationDelay: `${index * 100 + 80}ms` }}
              >
                {"featured" in card && card.featured && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]"
                  />
                )}
                <CardContent className="flex h-full flex-col justify-between p-6 sm:p-7">
                  <div>
                    <div
                      className={cn(
                        "mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/60 bg-gradient-to-br shadow-xs",
                        card.iconWrap
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-6 w-6",
                          card.title.includes("Donation") && "fill-current"
                        )}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-[#35123F]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#75647B] sm:text-sm">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#EADDED]/70 pt-4">
                    <LinkWrap
                      {...linkProps}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9200A8] transition-colors hover:text-[#E90078] sm:text-sm"
                    >
                      <span>{card.linkLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </LinkWrap>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
