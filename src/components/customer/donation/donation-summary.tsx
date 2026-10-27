"use client";

import * as React from "react";
import { Heart, ShieldCheck, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatINR } from "./donation-validation";
import type { DonationState } from "./donation-types";

interface DonationSummaryProps {
  state: DonationState;
  onEditStep?: (step: 1 | 2) => void;
  className?: string;
}

export function DonationSummary({
  state,
  onEditStep,
  className,
}: DonationSummaryProps) {
  const donorLabel =
    state.step >= 2 && state.donor.fullName.trim()
      ? state.donor.isAnonymous
        ? "Anonymous donor"
        : state.donor.fullName.trim()
      : null;

  return (
    <aside
      aria-label="Donation summary"
      className={cn(
        "relative w-full min-w-0 overflow-hidden rounded-2xl border border-[#FBCFE8]/55 bg-gradient-to-br from-white via-[#FDF8FF]/95 to-[#FCE7F3]/35 p-5 shadow-md sm:p-6",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F59E0B] via-[#E90078] to-[#9200A8]"
      />

      <div className="flex items-start justify-between gap-3 border-b border-[#EADDED]/80 pb-4">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-[#35123F]">Donation Summary</h3>
          <p className="mt-0.5 text-xs text-[#75647B]">Your generous contribution</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FCE7F3] to-[#FBCFE8]/70 text-[#9200A8]">
          <Heart className="h-4 w-4 fill-[#9200A8]" />
        </div>
      </div>

      <div className="space-y-3.5 py-4 text-xs sm:text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="shrink-0 text-xs text-[#75647B]">Donation Amount</span>
          <div className="flex items-center gap-2">
            <span className="shrink-0 whitespace-nowrap font-bold tabular-nums text-[#35123F]">
              {formatINR(state.amount)}
            </span>
            {onEditStep && state.step > 1 && state.step < 4 && (
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="shrink-0 cursor-pointer text-xs font-semibold text-[#9200A8] hover:text-[#E90078] hover:underline"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {donorLabel && (
          <div className="flex items-start justify-between gap-3 border-t border-dashed border-[#EADDED]/80 pt-3">
            <span className="text-xs text-[#75647B]">Donor</span>
            <span className="min-w-0 break-words text-right font-semibold text-[#35123F]">
              {donorLabel}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 text-xs text-[#2E7D32]">
          <span className="flex min-w-0 items-center gap-1 font-medium">
            <Check className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate sm:whitespace-normal">
              Platform &amp; Processing Fee
            </span>
          </span>
          <span className="shrink-0 whitespace-nowrap font-bold">₹0 Free</span>
        </div>
      </div>

      <div className="border-t border-[#EADDED]/80 pt-4">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <span className="text-sm font-bold text-[#35123F]">Total Contribution</span>
          <p
            className="m-0 shrink-0 text-right text-[clamp(1.35rem,4vw,1.75rem)] font-black leading-none tabular-nums text-[#9200A8]"
            aria-label={`Total contribution ${formatINR(state.amount)}`}
          >
            {formatINR(state.amount)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-[#EADDED]/80 pt-4">
        <div className="flex items-start gap-2 text-xs text-[#75647B]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2E7D32]" />
          <span>Audited &amp; verified public charitable trust</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-[#75647B]">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2E7D32]" />
          <span>Official acknowledgement receipt via email</span>
        </div>
      </div>
    </aside>
  );
}
