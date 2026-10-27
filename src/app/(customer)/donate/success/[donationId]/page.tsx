import * as React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Heart,
  Home,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { getDonationStatus } from "@/lib/donations/donation-service";
import { formatINR } from "@/components/customer/donation/donation-validation";
import { DonationLoading } from "@/components/customer/donation/donation-loading";

interface SuccessPageProps {
  params: Promise<{
    donationId: string;
  }>;
}

export const instant = false;

export const metadata: Metadata = {
  title: "Donation Confirmation | Samartha Trust",
  description:
    "Official donation confirmation and acknowledgement for Samartha Trust.",
};

async function DonationSuccessContent({ params }: SuccessPageProps) {
  const { donationId } = await params;
  const donation = await getDonationStatus(donationId);

  // 1. If donation not found in database
  if (!donation) {
    return (
      <div className="min-h-[70vh] bg-[#FAF5FF] py-16 flex items-center">
        <Container className="max-w-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#35123F]">
            Donation Record Not Found
          </h1>
          <p className="text-sm text-[#75647B] leading-relaxed">
            We could not locate a transaction record matching reference{" "}
            <code className="font-mono font-bold text-[#35123F]">
              {donationId}
            </code>
            . If you recently made a contribution, please wait a moment or
            contact our support team.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="outline" className="border-[#EADDED]">
              <Link href="/">
                <Home className="w-4 h-4 mr-1.5" />
                <span>Return to Home</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/donate?fresh=true">
                <span>Go to Donation Portal</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // 2. If payment is still PENDING or ORDER_CREATED
  if (donation.status === "PENDING" || donation.status === "ORDER_CREATED") {
    return (
      <div className="min-h-[70vh] bg-[#FAF5FF] py-16 flex items-center">
        <Container className="max-w-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#35123F]">
            Payment Confirmation Pending
          </h1>
          <p className="text-sm text-[#75647B] leading-relaxed">
            Your payment for reference{" "}
            <code className="font-mono font-bold text-[#35123F]">
              {donation.referenceId}
            </code>{" "}
            is currently being verified by the payment gateway. If your account
            was debited, your record will update shortly.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="outline" className="border-[#EADDED]">
              <Link href={`/donate/success/${donation.referenceId}`}>
                <RefreshCw className="w-4 h-4 mr-1.5" />
                <span>Refresh Status</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-1.5" />
                <span>Return to Home</span>
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // 3. If payment has FAILED or EXPIRED
  if (donation.status === "FAILED" || donation.status === "EXPIRED") {
    return (
      <div className="min-h-[70vh] bg-[#FAF5FF] py-16 flex items-center">
        <Container className="max-w-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#35123F]">
            Payment Could Not Be Confirmed
          </h1>
          <p className="text-sm text-[#75647B] leading-relaxed">
            The payment for donation reference{" "}
            <code className="font-mono font-bold text-[#35123F]">
              {donation.referenceId}
            </code>{" "}
            could not be successfully captured. No contribution has been
            recorded for this attempt.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="outline" className="border-[#EADDED]">
              <Link href="/donate?fresh=true">
                <RefreshCw className="w-4 h-4 mr-1.5" />
                <span>Try Donating Again</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/contact">
                <span>Contact Support</span>
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // 4. Payment is verified and captured (PAID)
  const formattedDate = donation.capturedAt
    ? new Date(donation.capturedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date(donation.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF5FF] via-white to-[#FAF5FF] py-12 sm:py-20">
      <Container className="max-w-2xl">
        <div className="bg-white rounded-3xl border border-[#EADDED] p-6 sm:p-10 shadow-lg text-center space-y-6 relative overflow-hidden">
          {/* Subtle top decoration */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]"
          />

          {/* Restrained success icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-[#E8F5E9] border-2 border-[#C8E6C9] flex items-center justify-center text-[#2E7D32] shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          {/* Heading & Heartfelt gratitude message */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE7F3] text-[#9200A8] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-[#9200A8]" />
              <span>Payment Verified & Confirmed</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#35123F] tracking-tight">
              Thank You for Your Generosity!
            </h1>

            <p className="text-sm sm:text-base text-[#75647B] leading-relaxed max-w-lg mx-auto">
              Your contribution means a great deal to Samartha Trust. Thank you
              for standing with us and helping create a brighter future for the
              children and communities we serve.
            </p>
          </div>

          {/* Verified Transaction Breakdown */}
          <div className="rounded-2xl border border-[#EADDED] bg-[#FAF5FF] p-5 sm:p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-[#EADDED] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#75647B]">
                Contribution Summary
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>Captured Successfully</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div>
                <span className="text-[#75647B] block text-xs">
                  Donation Amount:
                </span>
                <span className="text-xl font-black text-[#9200A8]">
                  {formatINR(donation.amountInRupees)}
                </span>
              </div>

              <div>
                <span className="text-[#75647B] block text-xs">
                  Donation Reference:
                </span>
                <code className="font-mono font-bold text-[#35123F]">
                  {donation.referenceId}
                </code>
              </div>

              {donation.paymentId && (
                <div>
                  <span className="text-[#75647B] block text-xs">
                    Razorpay Payment ID:
                  </span>
                  <code className="font-mono text-xs text-[#35123F]">
                    {donation.paymentId}
                  </code>
                </div>
              )}

              <div>
                <span className="text-[#75647B] block text-xs">Donor:</span>
                <span className="font-medium text-[#35123F]">
                  {donation.donorName}
                </span>
              </div>

              <div>
                <span className="text-[#75647B] block text-xs">
                  Confirmed Date & Time:
                </span>
                <span className="font-medium text-[#35123F]">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt notice */}
          <p className="text-xs text-[#75647B] leading-relaxed">
            An official acknowledgement receipt has been recorded and will be
            sent to your registered email address.
          </p>

          {/* Two Prominent Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto flex-1 h-11 border-[#EADDED] text-[#35123F]"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-1.5" />
                <span>Back to Home</span>
              </Link>
            </Button>

            <Button
              asChild
              className="w-full sm:w-auto flex-1 h-11 shadow-md hover:shadow-lg font-bold"
            >
              <Link href="/donate?fresh=true">
                <span>Donate Again</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function DonationSuccessPage({ params }: SuccessPageProps) {
  return (
    <Suspense fallback={<DonationLoading />}>
      <DonationSuccessContent params={params} />
    </Suspense>
  );
}
