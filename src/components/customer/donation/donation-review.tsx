"use client";

import * as React from "react";
import {
  Edit2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DONATION_CAUSES } from "./donation-constants";
import { formatINR } from "./donation-validation";
import type { DonationState } from "./donation-types";

interface DonationReviewProps {
  state: DonationState;
  onEditStep: (step: 1 | 2) => void;
  onConfirm: () => void;
  onAgreeChange: (agreed: boolean) => void;
  error?: string;
  isSubmitting?: boolean;
  submittingText?: string;
}

export function DonationReview({
  state,
  onEditStep,
  onConfirm,
  onAgreeChange,
  error,
  isSubmitting = false,
  submittingText = "Opening Secure Checkout...",
}: DonationReviewProps) {
  const cause =
    DONATION_CAUSES.find((c) => c.id === state.causeId) || DONATION_CAUSES[0];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-[#EADDED] pb-4">
        <h3 className="text-lg font-bold text-[#35123F]">
          Review Your Donation Details
        </h3>
        <p className="text-xs sm:text-sm text-[#75647B] mt-1">
          Please review the details below before proceeding to the payment
          handoff.
        </p>
      </div>

      {/* Review Box 1: Donation Details */}
      <div className="rounded-xl border border-[#EADDED] bg-[#FAF5FF] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#EADDED] pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#75647B]">
            Contribution Details
          </span>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#9200A8] hover:underline cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-[#75647B] block text-xs">
              Selected Cause:
            </span>
            <p className="font-bold text-[#35123F] mt-0.5">{cause.title}</p>
          </div>
          <div>
            <span className="text-[#75647B] block text-xs">Donation Type:</span>
            <p className="font-bold text-[#35123F] mt-0.5">One-Time Gift</p>
          </div>
          <div className="sm:col-span-2 pt-2 border-t border-[#EADDED] flex items-baseline justify-between">
            <span className="text-[#75647B] font-medium">Total Amount:</span>
            <span className="text-xl font-extrabold text-[#9200A8]">
              {formatINR(state.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Review Box 2: Donor Details */}
      <div className="rounded-xl border border-[#EADDED] bg-[#FAF5FF] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#EADDED] pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#75647B]">
            Donor Information
          </span>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#9200A8] hover:underline cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#75647B] shrink-0" />
            <div>
              <span className="text-[11px] text-[#75647B] block">
                Donor Name:
              </span>
              <span className="font-bold text-[#35123F]">
                {state.donor.fullName}
              </span>
              {state.donor.isAnonymous && (
                <span className="ml-2 text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
                  Anonymous
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#75647B] shrink-0" />
            <div>
              <span className="text-[11px] text-[#75647B] block">
                Email Address:
              </span>
              <span className="font-bold text-[#35123F]">
                {state.donor.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#75647B] shrink-0" />
            <div>
              <span className="text-[11px] text-[#75647B] block">Phone:</span>
              <span className="font-bold text-[#35123F]">
                {state.donor.phone}
              </span>
            </div>
          </div>

          {state.donor.panNumber && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#75647B] shrink-0" />
              <div>
                <span className="text-[11px] text-[#75647B] block">PAN:</span>
                <span className="font-bold text-[#35123F]">
                  {state.donor.panNumber}
                </span>
              </div>
            </div>
          )}

          {(state.donor.addressLine1 || state.donor.city) && (
            <div className="sm:col-span-2 flex items-start gap-2 pt-1 border-t border-[#EADDED]">
              <MapPin className="w-4 h-4 text-[#75647B] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-[#75647B] block">
                  Address:
                </span>
                <span className="text-xs text-[#35123F]">
                  {[
                    state.donor.addressLine1,
                    state.donor.addressLine2,
                    state.donor.city,
                    state.donor.state,
                    state.donor.pincode,
                    state.donor.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            </div>
          )}

          {state.donor.message && (
            <div className="sm:col-span-2 pt-1 border-t border-[#EADDED]">
              <span className="text-[11px] text-[#75647B] block">
                Personal Message:
              </span>
              <p className="text-xs text-[#35123F] italic mt-0.5 bg-white p-2.5 rounded-lg border border-[#EADDED]">
                &ldquo;{state.donor.message}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation & Agreement */}
      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl border border-[#EADDED] bg-white hover:bg-[#FAF5FF]">
          <input
            type="checkbox"
            checked={state.donor.agreedToTerms}
            onChange={(e) => onAgreeChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#EADDED] text-[#9200A8] focus:ring-[#9200A8] cursor-pointer"
          />
          <div className="text-xs text-[#35123F] leading-relaxed">
            <span className="font-bold">
              I confirm my voluntary contribution to Samartha Trust
            </span>
            <p className="text-[#75647B] text-[11px] mt-0.5">
              I agree that the details provided are true and accurate, and
              acknowledge that this contribution directly aids Samartha
              Trust&apos;s charitable initiatives.
            </p>
          </div>
        </label>

        {error && (
          <p className="text-xs font-semibold text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting || !state.donor.agreedToTerms}
          className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{submittingText}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span>Continue to Payment · {formatINR(state.amount)}</span>
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
