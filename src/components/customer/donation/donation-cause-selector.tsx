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
        <label className="block text-sm font-bold text-[#35123F]">
          Select Cause to Support <span className="text-[#9200A8]">*</span>
        </label>
        <span className="text-xs text-[#75647B]">
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
                "group relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]",
                isSelected
                  ? "bg-[#FCE7F3]/40 border-[#9200A8] shadow-sm"
                  : "bg-white border-[#EADDED] hover:border-[#9200A8]/40 hover:bg-[#FAF5FF]"
              )}
            >
              {/* Header inside card */}
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isSelected
                        ? "bg-gradient-to-r from-[#7100A8] to-[#9200A8] text-white"
                        : "bg-[#FAF5FF] text-[#75647B] group-hover:text-[#9200A8] group-hover:bg-[#FCE7F3]"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={cn(
                        "text-sm font-bold leading-tight transition-colors",
                        isSelected ? "text-[#35123F]" : "text-[#35123F]"
                      )}
                    >
                      {cause.title}
                    </h4>
                    {cause.badge && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FCE7F3] text-[#9200A8]">
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
                        ? "border-[#9200A8] bg-[#9200A8] text-white"
                        : "border-[#EADDED] bg-white group-hover:border-[#75647B]"
                    )}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-[#75647B] leading-relaxed">
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
