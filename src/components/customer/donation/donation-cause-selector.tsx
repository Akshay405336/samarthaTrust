"use client";

import * as React from "react";
import {
  Users,
  Sparkles,
  GraduationCap,
  HeartPulse,
  HandHeart,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DONATION_CAUSES } from "./donation-constants";

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Sparkles,
  GraduationCap,
  HeartPulse,
  HandHeart,
};

interface DonationCauseSelectorProps {
  selectedCauseId: string;
  onSelectCause: (causeId: string) => void;
  error?: string;
}

export function DonationCauseSelector({
  selectedCauseId,
  onSelectCause,
  error,
}: DonationCauseSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[#492A22]">
          Select Cause to Support <span className="text-[#F52232]">*</span>
        </label>
        <span className="text-xs text-[#78685D]">
          Choose where your gift makes a difference
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Causes to support"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {DONATION_CAUSES.map((cause) => {
          const isSelected = selectedCauseId === cause.id;
          const Icon = ICON_MAP[cause.iconName] || Users;

          return (
            <button
              key={cause.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectCause(cause.id)}
              className={cn(
                "group relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F52232]",
                isSelected
                  ? "bg-[#FFF9F2] border-[#F52232] shadow-sm"
                  : "bg-white border-[#EFE8D8] hover:border-[#DFCBB4] hover:bg-[#FFFDF9]"
              )}
            >
              {/* Header inside card */}
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isSelected
                        ? "bg-gradient-to-r from-[#F52232] to-[#FF8A00] text-white"
                        : "bg-[#F8F4EC] text-[#78685D] group-hover:text-[#F52232] group-hover:bg-[#FFF0E2]"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={cn(
                        "text-sm font-bold leading-tight transition-colors",
                        isSelected ? "text-[#492A22]" : "text-[#492A22]"
                      )}
                    >
                      {cause.title}
                    </h4>
                    {cause.badge && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF0E2] text-[#F52232]">
                        {cause.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 mt-0.5">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected
                        ? "border-[#F52232] bg-[#F52232] text-white"
                        : "border-[#D6CBB8] bg-white group-hover:border-[#78685D]"
                    )}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-[#78685D] leading-relaxed">
                {cause.shortDescription}
              </p>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
