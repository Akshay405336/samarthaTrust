"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import { DONATION_FAQS } from "./donation-constants";
import { useScrollInView } from "@/hooks/use-scroll-in-view";

const FAQ_THEMES = [
  "border-[#FBCFE8]/50 bg-gradient-to-br from-[#FDF2F8]/95 to-white",
  "border-[#FCD34D]/40 bg-gradient-to-br from-[#FFFBEB]/85 to-white",
  "border-[#C4B5FD]/40 bg-gradient-to-br from-[#FAF5FF]/95 to-white",
  "border-[#99F6E4]/40 bg-gradient-to-br from-[#F0FDFA]/90 to-white",
] as const;

export function DonationFAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.05,
  });

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-[#EADDED]/80 py-12 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#FCE7F3]/25 via-[#FDF8FF] to-[#EDE9FE]/35"
      />
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-25"
      />

      <Container className="relative max-w-4xl">
        <div
          className={cn(
            revealVariant("blur-in"),
            "mx-auto mb-10 max-w-xl text-center sm:mb-12"
          )}
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#FBCFE8]/60 bg-white/85 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#BE185D] shadow-xs">
            <HelpCircle className="h-3.5 w-3.5" />
            Common Inquiries
          </div>
          <h2 className="mt-2 text-2xl font-bold text-[#35123F] sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#75647B] sm:text-sm">
            Everything you need to know about contributing to Samartha Trust.
          </p>
        </div>

        <div className="space-y-3">
          {DONATION_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const contentId = `donation-faq-answer-${index}`;
            const buttonId = `donation-faq-button-${index}`;

            return (
              <div
                key={faq.question}
                className={cn(
                  "motion-fade-up overflow-hidden rounded-2xl border transition-all duration-200",
                  FAQ_THEMES[index % FAQ_THEMES.length],
                  isInView && "motion-active",
                  isOpen
                    ? "border-[#9200A8]/50 shadow-md ring-1 ring-[#9200A8]/10"
                    : "hover:border-[#9200A8]/25 hover:shadow-sm"
                )}
                style={{ animationDelay: `${(index % 4) * 70 + 100}ms` }}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(index)}
                  className="flex w-full cursor-pointer items-center justify-between p-4 text-left text-sm font-bold text-[#35123F] transition-colors hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8] sm:p-5 sm:text-base"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#EADDED]/70 bg-white/80 transition-transform duration-200",
                      isOpen &&
                        "rotate-180 border-[#9200A8] bg-[#9200A8] text-white"
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isOpen ? "text-white" : "text-[#75647B]"
                      )}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="animate-in fade-in-50 border-t border-[#EADDED]/70 px-4 pb-5 pt-3 text-xs leading-relaxed text-[#75647B] duration-200 sm:px-5 sm:pb-6 sm:text-sm"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
