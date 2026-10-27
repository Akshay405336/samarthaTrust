"use client";

import * as React from "react";
import { Mail } from "lucide-react";

import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

interface ContactConnectSectionProps {
  children: React.ReactNode;
}

export function ContactConnectSection({ children }: ContactConnectSectionProps) {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.05,
  });

  return (
    <section
      ref={ref}
      id="contact-form"
      className="relative overflow-hidden py-14 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#DBEAFE]/40 via-[#FDF8FF] to-[#D1FAE5]/35"
      />
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="help-orb pointer-events-none absolute -left-16 top-1/4 h-56 w-56 rounded-full bg-[#6366F1]/10 blur-3xl"
        style={{ "--help-orb-duration": "18s" } as React.CSSProperties}
      />

      <Container>
        <div
          className={cn(
            revealVariant("fade-up"),
            "relative mb-10 max-w-2xl"
          )}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#BFDBFE]/70 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] shadow-xs backdrop-blur-sm">
            <Mail className="h-3 w-3" />
            Message &amp; Channels
          </div>
          <h2 className="text-2xl font-bold text-[#35123F] sm:text-3xl">
            Start a{" "}
            <span className="relative inline-block">
              <span className="works-highlight bg-gradient-to-r from-[#2563EB] via-[#9200A8] to-[#0D9488] bg-clip-text text-transparent">
                Conversation
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 200 8"
                fill="none"
                className="absolute -bottom-0.5 left-0 h-1.5 w-full"
              >
                <path
                  d="M2 5C50 1 150 1 198 4"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={cn(isInView && "our-works-underline-draw")}
                />
              </svg>
            </span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#75647B]">
            Share your inquiry through the form or reach us directly using our
            verified office channels below.
          </p>
        </div>

        <div className="relative">{children}</div>
      </Container>
    </section>
  );
}
