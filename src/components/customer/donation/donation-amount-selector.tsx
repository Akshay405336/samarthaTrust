"use client";

import * as React from "react";
import { IndianRupee, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRESET_AMOUNTS, MIN_AMOUNT, MAX_AMOUNT } from "./donation-constants";
import { formatINR } from "./donation-validation";

interface DonationAmountSelectorProps {
  amount: number;
  customAmountInput: string;
  isCustomAmount: boolean;
  onSelectPreset: (preset: number) => void;
  onCustomAmountChange: (value: string) => void;
  error?: string;
}

export function DonationAmountSelector({
  amount,
  customAmountInput,
  isCustomAmount,
  onSelectPreset,
  onCustomAmountChange,
  error,
}: DonationAmountSelectorProps) {
  const getImpactNote = (val: number) => {
    if (val >= 10000) {
      return "Sponsors comprehensive rehabilitative care, assistive equipment, and specialized educator support.";
    }
    if (val >= 5000) {
      return "Funds educational tuition, assistive learning kits, and nutrition for multiple children.";
    }
    if (val >= 2000) {
      return "Supports essential therapy materials, developmental aids, and learning resources.";
    }
    if (val >= 1000) {
      return "Provides school essentials, notebook sets, and nutritional supplements.";
    }
    return "Contributes directly to daily educational and recreational supplies for children.";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[#35123F]">
          Contribution Amount <span className="text-[#9200A8]">*</span>
        </label>
        <span className="text-xs text-[#75647B]">
          Min {formatINR(MIN_AMOUNT)} · Max {formatINR(MAX_AMOUNT)}
        </span>
      </div>

      {/* Preset Amount Grid */}
      <div
        role="radiogroup"
        aria-label="Preset donation amounts"
        className="grid grid-cols-2 sm:grid-cols-5 gap-2.5"
      >
        {PRESET_AMOUNTS.map((preset) => {
          const isSelected = !isCustomAmount && amount === preset;
          return (
            <button
              key={preset}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectPreset(preset)}
              className={cn(
                "py-3 px-3 rounded-xl font-bold text-sm sm:text-base border-2 transition-all duration-200 cursor-pointer text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]",
                isSelected
                  ? "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white border-transparent shadow-sm scale-102"
                  : "bg-white text-[#35123F] border-[#EADDED] hover:border-[#9200A8]/40 hover:bg-[#FAF5FF]"
              )}
            >
              {formatINR(preset)}
            </button>
          );
        })}
      </div>

      {/* Custom Amount Field */}
      <div className="pt-2">
        <label
          htmlFor="custom-amount-input"
          className="block text-xs font-semibold text-[#75647B] mb-1.5"
        >
          Or enter a custom amount (INR):
        </label>
        <div className="relative rounded-xl shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#75647B]">
            <IndianRupee className="h-5 w-5" />
          </div>
          <input
            id="custom-amount-input"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 3500"
            value={customAmountInput}
            onChange={(e) => onCustomAmountChange(e.target.value)}
            className={cn(
              "block w-full rounded-xl border-2 py-3 pl-11 pr-4 text-base font-bold text-[#35123F] placeholder:text-stone-400 placeholder:font-normal focus:outline-none transition-colors",
              isCustomAmount
                ? "border-[#9200A8] bg-white ring-1 ring-[#9200A8]"
                : "border-[#EADDED] bg-white hover:border-[#9200A8]/40"
            )}
            aria-invalid={Boolean(error)}
          />
        </div>
      </div>

      {/* Dynamic Impact Note */}
      {amount >= MIN_AMOUNT && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FCE7F3]/40 border border-[#EADDED] text-xs text-[#35123F]">
          <HeartHandshake className="w-4 h-4 text-[#9200A8] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-[#9200A8]">
              {formatINR(amount)}:
            </span>{" "}
            {getImpactNote(amount)}
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
