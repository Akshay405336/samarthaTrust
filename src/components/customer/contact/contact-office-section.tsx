"use client";

import * as React from "react";
import { MapPinned } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ContactMap } from "./contact-map";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

export function ContactOfficeSection() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.08,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-[#EADDED]/80 py-12 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#E0F2FE]/55 via-white to-[#F0F9FF]/40"
      />
      <div
        aria-hidden="true"
        className="about-page-grid pointer-events-none absolute inset-0 opacity-35"
      />

      <Container className="relative">
        <div
          className={cn(
            revealVariant("fade-up"),
            "mx-auto mb-8 max-w-3xl text-center sm:mb-10"
          )}
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#BAE6FD]/70 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0369A1] shadow-xs">
            <MapPinned className="h-3 w-3" />
            Physical Presence
          </div>
          <h2 className="mt-1 text-2xl font-bold text-[#35123F] sm:text-3xl">
            Visit Our Registered Office
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#75647B]">
            Located in Yeshwanthpur, Bengaluru, our central office coordinates
            grassroots health, disability empowerment, and education programs across
            Karnataka.
          </p>
        </div>

        <div
          className={cn(
            revealVariant("scale-in"),
            "mx-auto max-w-5xl",
            isInView && "motion-active"
          )}
          style={{ animationDelay: "160ms" }}
        >
          <ContactMap />
        </div>
      </Container>
    </section>
  );
}
