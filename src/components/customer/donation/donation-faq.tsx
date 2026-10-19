"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DONATION_FAQS } from "./donation-constants";

export function DonationFAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FFFCF5] border-t border-[#EFE8D8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F52232]">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#492A22] mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#78685D] mt-2 leading-relaxed">
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
                className="rounded-2xl border border-[#EFE8D8] bg-white overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#492A22] hover:bg-[#FFFDF9] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F52232]"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full bg-[#F8F4EC] flex items-center justify-center shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 bg-[#FFF0E2] text-[#F52232]"
                    )}
                  >
                    <ChevronDown className="w-4 h-4 text-[#78685D]" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#78685D] leading-relaxed border-t border-[#F5EFE6] pt-3 animate-in fade-in-50 duration-200"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
