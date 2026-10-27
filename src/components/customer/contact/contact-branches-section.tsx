"use client";

import * as React from "react";
import { Building2 } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ContactBranchCard } from "./contact-branch-card";
import { BRANCH_LOCATIONS } from "./contact-constants";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

export function ContactBranchesSection() {
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
        className="absolute inset-0 bg-gradient-to-b from-[#FDF2F8]/70 via-[#FAF5FF] to-[#EDE9FE]/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-[#E90078]/10 blur-3xl"
      />

      <Container className="relative">
        <div
          className={cn(
            revealVariant("scale-in"),
            "mx-auto mb-10 max-w-3xl text-center sm:mb-14"
          )}
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#FBCFE8]/60 bg-white/85 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#BE185D] shadow-xs backdrop-blur-sm">
            <Building2 className="h-3.5 w-3.5" />
            <span>Community Facilities</span>
          </div>

          <h2 className="text-2xl font-bold text-[#35123F] sm:text-3xl lg:text-4xl">
            Our{" "}
            <span className="bg-gradient-to-r from-[#E90078] via-[#9200A8] to-[#6366F1] bg-clip-text text-transparent">
              Branch Locations
            </span>
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#75647B]">
            In addition to our registered administrative headquarters, Samartha
            Trust operates dedicated hostels, rehabilitation homes, and inclusive
            school branches across Bengaluru.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BRANCH_LOCATIONS.map((branch, index) => (
            <ContactBranchCard
              key={branch.id}
              branch={branch}
              index={index}
              animate={isInView}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
