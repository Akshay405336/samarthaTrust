"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "./donation-constants";
import type { DonationStep } from "./donation-types";

interface DonationProgressProps {
  currentStep: DonationStep;
  onStepClick?: (step: DonationStep) => void;
  maxAccessibleStep?: number;
}

export function DonationProgress({
  currentStep,
  onStepClick,
  maxAccessibleStep = 1,
}: DonationProgressProps) {
  return (
    <nav
      aria-label="Donation progress"
      className="w-full bg-white rounded-2xl p-4 sm:p-6 border border-[#EADDED] shadow-sm mb-8"
    >
      <ol className="flex items-center justify-between w-full relative">
        {/* Background track line */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-[#EADDED] z-0 hidden sm:block"
        />

        {WIZARD_STEPS.map((stepItem) => {
          const stepNum = stepItem.step as DonationStep;
          const isCurrent = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          const isClickable =
            Boolean(onStepClick) &&
            stepNum < currentStep &&
            stepNum <= maxAccessibleStep &&
            currentStep !== 4;

          return (
            <li
              key={stepItem.step}
              className="relative z-10 flex flex-col items-center flex-1 text-center"
              aria-current={isCurrent ? "step" : undefined}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(stepNum)}
                className={cn(
                  "group flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8] rounded-xl p-1 transition-all",
                  isClickable
                    ? "cursor-pointer hover:opacity-80"
                    : "cursor-default"
                )}
                aria-label={`${stepItem.label}: ${stepItem.shortTitle}${
                  isCompleted ? " (Completed)" : isCurrent ? " (Current)" : ""
                }`}
              >
                {/* Step indicator circle */}
                <div
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 border-2",
                    isCompleted
                      ? "bg-[#2E7D32] border-[#2E7D32] text-white shadow-xs"
                      : isCurrent
                        ? "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] border-transparent text-white shadow-md scale-105"
                        : "bg-white border-[#EADDED] text-[#75647B]"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>

                {/* Step Labels */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-bold leading-tight transition-colors",
                      isCurrent
                        ? "text-[#9200A8]"
                        : isCompleted
                          ? "text-[#35123F]"
                          : "text-[#75647B]"
                    )}
                  >
                    {stepItem.shortTitle}
                  </p>
                  <p className="hidden md:block text-[11px] text-[#75647B] mt-0.5 font-medium">
                    {stepItem.description}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
