"use client";

import * as React from "react";
import { Heart, ShieldCheck, Check } from "lucide-react";
import { DONATION_CAUSES } from "./donation-constants";
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
  className = "",
}: DonationSummaryProps) {
  const cause =
    DONATION_CAUSES.find((c) => c.id === state.causeId) || DONATION_CAUSES[0];

  return (
    <aside
      aria-label="Donation summary"
      className={`bg-white rounded-2xl border border-[#EADDED] p-5 sm:p-6 shadow-sm space-y-5 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#EADDED] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#35123F]">
            Donation Summary
          </h3>
          <p className="text-xs text-[#75647B] mt-0.5">
            Your generous contribution
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FCE7F3] flex items-center justify-center text-[#9200A8]">
          <Heart className="w-4 h-4 fill-[#9200A8]" />
        </div>
      </div>

      {/* Selected Items Breakdown */}
      <div className="space-y-3.5 text-xs sm:text-sm">
        {/* Cause */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[#75647B] text-xs">Designated Cause</span>
            <p className="font-bold text-[#35123F] leading-snug">
              {cause.title}
            </p>
          </div>
          {onEditStep && state.step > 1 && (
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs font-semibold text-[#9200A8] hover:underline cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {/* Frequency */}
        <div className="flex items-center justify-between">
          <span className="text-[#75647B] text-xs">Donation Type</span>
          <span className="font-semibold text-[#35123F]">One-Time Gift</span>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between">
          <span className="text-[#75647B] text-xs">Donation Amount</span>
          <span className="font-bold text-[#35123F]">
            {formatINR(state.amount)}
          </span>
        </div>

        {/* Hidden / Platform fees */}
        <div className="flex items-center justify-between text-xs text-[#2E7D32]">
          <span className="flex items-center gap-1 font-medium">
            <Check className="w-3.5 h-3.5" /> Platform & Processing Fee
          </span>
          <span className="font-bold">₹0 Free</span>
        </div>
      </div>

      {/* Total Section */}
      <div className="border-t border-[#EADDED] pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-[#35123F]">
            Total Contribution
          </span>
          <div className="text-right">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]">
              {formatINR(state.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Trust reassurance pills */}
      <div className="pt-2 border-t border-[#EADDED] space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#75647B]">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
          <span>Audited & verified public charitable trust</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#75647B]">
          <Check className="w-4 h-4 text-[#2E7D32] shrink-0" />
          <span>Official acknowledgement receipt via email</span>
        </div>
      </div>
    </aside>
  );
}
