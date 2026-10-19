"use client";

import * as React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import type { DonationFrequency } from "./donation-types";

interface DonationFrequencySelectorProps {
  frequency?: DonationFrequency;
  onChange?: (freq: DonationFrequency) => void;
  error?: string;
}

export function DonationFrequencySelector({
  error,
}: DonationFrequencySelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[#492A22]">
          Donation Type
        </label>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
          <ShieldCheck className="w-3 h-3" />
          <span>Direct Impact</span>
        </span>
      </div>

      {/* Intentional, polished One-Time Gift Card */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white border-2 border-[#EADCCB] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#F52232] to-[#FF8A00] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#492A22] block">
              One-Time Contribution
            </span>
            <p className="text-xs text-[#78685D] mt-0.5">
              Your gift is immediately allocated to your chosen cause.
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-xs font-semibold text-[#78685D]">
            Official Receipt Provided
          </span>
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
