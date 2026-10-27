"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Handshake, Sparkles } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

export function WorksCollaboration() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.15,
  });

  return (
    <section
      ref={ref}
      className="relative border-t border-[#EADDED] bg-gradient-to-b from-white to-[#FAF5FF]/80 py-14 sm:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#FCE7F3]/50 blur-3xl"
      />
      <Container>
        <div
          className={cn(
            "motion-flip-in help-footer-glow relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#EADDED] bg-white px-6 py-10 text-center shadow-[0_16px_48px_rgba(113,0,168,0.08)] sm:px-12 sm:py-14",
            isInView && "motion-active"
          )}
        >
          <div
            aria-hidden="true"
            className="help-accent-bar absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FAF5FF]/80 via-white to-[#FCE7F3]/40"
          />

          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7100A8] to-[#E90078] text-white shadow-md">
            <Handshake className="h-7 w-7" />
          </div>

          <p className="relative mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C00083]">
            <Sparkles className="h-3.5 w-3.5" />
            Let&apos;s Work Together
          </p>

          <h2
            className={cn(
              revealVariant("scale-in"),
              "relative mx-auto mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-[#35123F] sm:text-3xl lg:text-4xl"
            )}
            style={{ animationDelay: "120ms" }}
          >
            Have a Community{" "}
            <span className="help-lasting-shimmer bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
              Collaboration
            </span>{" "}
            in Mind?
          </h2>

          <p
            className={cn(
              revealVariant("blur-in"),
              "relative mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#75647B] sm:text-base"
            )}
            style={{ animationDelay: "240ms" }}
          >
            We welcome collaborative proposals from fellow non-profits, CSR
            foundations, and passionate civic volunteers to amplify grassroots
            impact.
          </p>

          <div
            className={cn(revealVariant("fade-up"), "relative mt-7 flex justify-center")}
            style={{ animationDelay: "360ms" }}
          >
            <Button asChild size="lg" className="help-btn-gradient shadow-md">
              <Link href="/contact" className="inline-flex items-center gap-2">
                Propose a Collaboration
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
