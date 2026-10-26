"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import { CONTACT_FAQS } from "./contact-constants";

export function ContactFAQ() {
  // Support independent multi-expand in grid so both columns can have expanded items
  const [openIndices, setOpenIndices] = React.useState<Set<number>>(
    new Set([0])
  );

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section className="bg-white py-14 sm:py-20 border-t border-[#EADDED]">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EADDED] bg-[#FCE7F3]/60 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9200A8] mb-3 shadow-2xs">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Common Queries</span>
          </div>

          <h2 className="text-2xl font-bold text-[#35123F] sm:text-3xl lg:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-[#75647B] leading-relaxed">
            Quick answers to common questions about reaching out, volunteering,
            and collaborating with Samartha Trust.
          </p>
        </div>

        {/* Two-Column Responsive FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-5xl mx-auto items-start">
          {CONTACT_FAQS.map((faq, index) => {
            const isOpen = openIndices.has(index);
            const contentId = `contact-faq-answer-${index}`;
            const buttonId = `contact-faq-button-${index}`;

            return (
              <div
                key={faq.question}
                className={cn(
                  "rounded-2xl border transition-all duration-200 overflow-hidden bg-white",
                  isOpen
                    ? "border-[#9200A8]/50 shadow-xs"
                    : "border-[#EADDED] hover:border-[#9200A8]/30 hover:bg-[#FAF5FF]"
                )}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#35123F] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8] transition-colors"
                >
                  <span className="pr-3 leading-snug">{faq.question}</span>
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full bg-[#FCE7F3]/60 border border-[#EADDED] flex items-center justify-center shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 bg-[#9200A8] text-white border-[#9200A8]"
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-colors",
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
                    className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#75647B] leading-relaxed border-t border-[#EADDED] pt-3.5 animate-in fade-in-50 duration-200"
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
