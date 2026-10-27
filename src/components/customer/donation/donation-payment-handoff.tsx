"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  ArrowLeft,
  Home,
  Mail,
  Phone,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "./donation-validation";
import type { PaymentHandoffPayload } from "./donation-types";

interface DonationPaymentHandoffProps {
  payload: PaymentHandoffPayload;
  onModify: () => void;
}

export function DonationPaymentHandoff({
  payload,
  onModify,
}: DonationPaymentHandoffProps) {
  const [copied, setCopied] = React.useState(false);

  const copyReference = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(payload.referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Notice Card */}
      <div className="rounded-2xl border-2 border-[#FFD9B3] bg-[#FFF9F2] p-5 sm:p-7 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-[#FFF0E2] border border-[#FFD9B3] flex items-center justify-center text-[#FF8A00] shadow-xs">
          <Clock className="w-7 h-7 text-[#FF8A00]" />
        </div>

        <div className="space-y-1.5 max-w-lg mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FFE7CC] text-[#35123F] text-xs font-bold uppercase tracking-wider">
            Payment Handoff Ready
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#35123F]">
            Donation Details Prepared
          </h3>
          <p className="text-xs sm:text-sm text-[#75647B] leading-relaxed">
            Your donation details are ready. Online payment will be available
            once our secure payment gateway is connected.
          </p>
        </div>

        {/* Reference ID Pill */}
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#EADDED] shadow-xs">
          <span className="text-xs text-[#75647B] font-medium">Reference:</span>
          <code className="text-xs sm:text-sm font-mono font-bold text-[#35123F]">
            {payload.referenceId}
          </code>
          <button
            type="button"
            onClick={copyReference}
            aria-label="Copy reference ID"
            className="text-stone-500 hover:text-[#9200A8] transition-colors p-1"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Summary of Prepared Details */}
      <div className="rounded-2xl border border-[#EADDED] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#75647B] border-b border-[#EADDED] pb-3">
          Summary of Prepared Contribution
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-[#75647B] block text-xs">Amount:</span>
            <span className="text-lg font-black text-[#9200A8]">
              {formatINR(payload.amount)}
            </span>
          </div>

          <div>
            <span className="text-[#75647B] block text-xs">Donor:</span>
            <span className="font-bold text-[#35123F]">
              {payload.donor.fullName}
              {payload.donor.isAnonymous && " (Anonymous)"}
            </span>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-[#EADDED]">
            <span className="text-[#75647B] block text-xs">
              Receipt Destination:
            </span>
            <span className="font-medium text-[#35123F]">
              {payload.donor.email} · {payload.donor.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Offline Transfer & Direct Inquiry Option */}
      <div className="rounded-2xl border border-[#E0EAE0] bg-[#F9FCF9] p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-[#2E7D32]">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <h4 className="text-sm font-bold">
            Wish to contribute directly right now?
          </h4>
        </div>
        <p className="text-xs text-[#526352] leading-relaxed">
          While the automated online payment gateway integration is being
          finalized, you can make contributions directly via NEFT/RTGS bank
          transfer or visit our office. Our trust administrators will happily
          provide bank coordinates and issue an official receipt.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#35123F]">
          <a
            href="mailto:info@samarthatrust.org?subject=Donation%20Inquiry%20Ref:%20"
            className="inline-flex items-center gap-1.5 text-[#2E7D32] hover:underline"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>info@samarthatrust.org</span>
          </a>
          <a
            href="tel:+918023456789"
            className="inline-flex items-center gap-1.5 text-[#2E7D32] hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91 (0) 80 2345 6789</span>
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onModify}
          className="w-full sm:w-auto flex-1 gap-2 border-[#EADDED]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modify Donation Details</span>
        </Button>

        <Button asChild className="w-full sm:w-auto flex-1 gap-2">
          <Link href="/">
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
