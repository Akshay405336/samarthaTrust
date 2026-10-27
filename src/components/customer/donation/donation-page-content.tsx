"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonationHero } from "./donation-hero";
import { DonationProgress } from "./donation-progress";
import { DonationAmountSelector } from "./donation-amount-selector";
import { DonationDonorForm } from "./donation-donor-form";
import { DonationSummary } from "./donation-summary";
import { DonationReview } from "./donation-review";
import { DonationPaymentHandoff } from "./donation-payment-handoff";
import { DonationTrustSection } from "./donation-trust-section";
import { DonationFAQ } from "./donation-faq";
import {
  DEFAULT_AMOUNT,
  DEFAULT_DONATION_CAUSE_ID,
  getDonationCauseTitle,
} from "./donation-constants";
import {
  validateStep1,
  validateStep2,
  validateStep3,
  formatINR,
} from "./donation-validation";
import type {
  DonationState,
  DonationStep,
  DonorDetails,
  PaymentHandoffPayload,
  RazorpayOrderResponse,
  RazorpayPaymentSuccessPayload,
  RazorpayCheckoutOptions,
} from "./donation-types";

const INITIAL_DONOR: DonorDetails = {
  fullName: "",
  email: "",
  phone: "",
  panNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "Karnataka",
  pincode: "",
  country: "India",
  message: "",
  isAnonymous: false,
  consentUpdates: true,
  agreedToTerms: false,
};

/**
 * Dynamically loads the official Razorpay Checkout SDK script if not already present on window
 */
function loadRazorpayCheckoutScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    interface WindowWithRazorpay extends Window {
      Razorpay?: new (options: RazorpayCheckoutOptions) => {
        open: () => void;
        close?: () => void;
        on?: (event: string, callback: (res: unknown) => void) => void;
      };
    }

    if ((window as WindowWithRazorpay).Razorpay) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function DonationPageContent() {
  const router = useRouter();
  const wizardContainerRef = React.useRef<HTMLDivElement>(null);

  const [state, setState] = React.useState<DonationState>({
    step: 1,
    frequency: "one-time",
    causeId: DEFAULT_DONATION_CAUSE_ID,
    amount: DEFAULT_AMOUNT,
    customAmountInput: "",
    isCustomAmount: false,
    donor: INITIAL_DONOR,
    validationErrors: {},
    isSubmitting: false,
  });

  const [submittingText, setSubmittingText] = React.useState<string>(
    "Initiating Secure Checkout..."
  );
  const [generalError, setGeneralError] = React.useState<string | null>(null);

  const [preparedPayload, setPreparedPayload] =
    React.useState<PaymentHandoffPayload | null>(null);

  const scrollToWizard = () => {
    if (wizardContainerRef.current) {
      const topOffset =
        wizardContainerRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        90;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  // Step 1 Handlers
  const handlePresetSelect = (preset: number) => {
    setState((prev) => ({
      ...prev,
      amount: preset,
      customAmountInput: "",
      isCustomAmount: false,
      validationErrors: { ...prev.validationErrors, amount: "" },
    }));
  };

  const handleCustomAmountChange = (raw: string) => {
    const numericStr = raw.replace(/[^\d]/g, "");
    const parsed = parseInt(numericStr, 10);
    setState((prev) => ({
      ...prev,
      customAmountInput: numericStr,
      isCustomAmount: true,
      amount: isNaN(parsed) ? 0 : parsed,
      validationErrors: { ...prev.validationErrors, amount: "" },
    }));
  };

  // Step 2 Handlers
  const handleDonorFieldChange = (
    field: keyof DonorDetails,
    value: string | boolean
  ) => {
    setState((prev) => ({
      ...prev,
      donor: {
        ...prev.donor,
        [field]: value,
      },
      validationErrors: {
        ...prev.validationErrors,
        [field]: "",
      },
    }));
  };

  // Navigation Logic
  const goToStep = (targetStep: DonationStep) => {
    setGeneralError(null);
    setState((prev) => ({
      ...prev,
      step: targetStep,
      validationErrors: {},
    }));
    setTimeout(scrollToWizard, 60);
  };

  const handleNextFromStep1 = () => {
    setGeneralError(null);
    const errors = validateStep1(state.amount, state.frequency);
    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, validationErrors: errors }));
      return;
    }
    setState((prev) => ({
      ...prev,
      step: 2,
      validationErrors: {},
    }));
    setTimeout(scrollToWizard, 60);
  };

  const handleNextFromStep2 = () => {
    setGeneralError(null);
    const errors = validateStep2(state.donor);
    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, validationErrors: errors }));
      return;
    }
    setState((prev) => ({
      ...prev,
      step: 3,
      validationErrors: {},
    }));
    setTimeout(scrollToWizard, 60);
  };

  /**
   * Complete Razorpay Payment Flow:
   * 1. Creates order via server
   * 2. Launches Razorpay Standard Checkout
   * 3. Verifies signature and payment status with server
   * 4. Redirects to verified gratitude screen
   */
  const handleConfirmAndPay = async () => {
    setGeneralError(null);
    const errors = validateStep3(state.donor);
    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, validationErrors: errors }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));
    setSubmittingText("Creating Secure Payment Order...");

    const causeTitle = getDonationCauseTitle(state.causeId);

    try {
      // 1. Call server to create donation record and Razorpay order
      const createOrderRes = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: state.amount,
          frequency: "one-time",
          causeId: state.causeId,
          donor: {
            fullName: state.donor.fullName,
            email: state.donor.email,
            phone: state.donor.phone,
            panNumber: state.donor.panNumber || undefined,
            addressLine1: state.donor.addressLine1 || undefined,
            addressLine2: state.donor.addressLine2 || undefined,
            city: state.donor.city || undefined,
            state: state.donor.state || undefined,
            pincode: state.donor.pincode || undefined,
            country: state.donor.country || "India",
            message: state.donor.message || undefined,
            isAnonymous: state.donor.isAnonymous,
            consentUpdates: state.donor.consentUpdates,
          },
        }),
      });

      const orderData: RazorpayOrderResponse = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.success) {
        throw new Error(
          (orderData as unknown as { error?: string }).error ||
            "Failed to initiate donation order. Please try again."
        );
      }

      // Store fallback payload in case user wishes to review
      const handoffPayload: PaymentHandoffPayload = {
        preparedAt: new Date().toISOString(),
        referenceId: orderData.donationReference,
        amount: state.amount,
        formattedAmount: formatINR(state.amount),
        currency: "INR",
        frequency: "one-time",
        causeId: state.causeId,
        causeTitle,
        donor: {
          fullName: state.donor.fullName,
          email: state.donor.email,
          phone: state.donor.phone,
          panNumber: state.donor.panNumber || undefined,
          address: {
            line1: state.donor.addressLine1 || undefined,
            line2: state.donor.addressLine2 || undefined,
            city: state.donor.city || undefined,
            state: state.donor.state || undefined,
            pincode: state.donor.pincode || undefined,
            country: state.donor.country || "India",
          },
          isAnonymous: state.donor.isAnonymous,
          consentUpdates: state.donor.consentUpdates,
          message: state.donor.message || undefined,
        },
      };
      setPreparedPayload(handoffPayload);

      // 2. Load Razorpay Checkout SDK
      setSubmittingText("Launching Payment Gateway...");
      const isLoaded = await loadRazorpayCheckoutScript();

      if (!isLoaded) {
        throw new Error(
          "Unable to load Razorpay payment gateway. Please check your internet connection or ad-blocker settings."
        );
      }

      interface RazorpayFailureResponse {
        error?: {
          description?: string;
          code?: string;
          reason?: string;
        };
      }

      interface RazorpayInstance {
        open: () => void;
        close?: () => void;
        on?: (event: string, callback: (res: RazorpayFailureResponse) => void) => void;
      }

      interface RazorpayConstructor {
        new (options: RazorpayCheckoutOptions): RazorpayInstance;
      }

      const RazorpaySDK = (
        window as unknown as { Razorpay: RazorpayConstructor }
      ).Razorpay;

      if (!RazorpaySDK) {
        throw new Error("Razorpay Checkout SDK is not available.");
      }

      // 3. Open Razorpay Standard Checkout
      const razorpayInstance = new RazorpaySDK({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Samartha Trust",
        description: `Donation: ${causeTitle}`,
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: orderData.donor.name,
          email: orderData.donor.email,
          contact: orderData.donor.contact,
        },
        notes: {
          donationReference: orderData.donationReference,
          causeId: DEFAULT_DONATION_CAUSE_ID,
        },
        theme: {
          color: "#9200A8",
        },
        modal: {
          ondismiss: () => {
            setState((prev) => ({ ...prev, isSubmitting: false }));
            setGeneralError(
              "Checkout was cancelled. Your details are saved—you can proceed whenever you are ready."
            );
          },
        },
        handler: async (response: RazorpayPaymentSuccessPayload) => {
          // 4. Server-Side Verification with bounded timeout
          setState((prev) => ({ ...prev, isSubmitting: true }));
          setSubmittingText("Verifying Payment with Server...");

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          try {
            const verifyRes = await fetch("/api/donations/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: controller.signal,
              body: JSON.stringify({
                donationReference: orderData.donationReference,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            clearTimeout(timeoutId);

            let verifyData: { success?: boolean; error?: string; status?: string } = {};
            try {
              verifyData = await verifyRes.json();
            } catch {
              throw new Error("Unable to read verification response from server.");
            }

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error ||
                  "Payment verification could not be confirmed. If your account was debited, please contact us with reference " +
                    orderData.donationReference
              );
            }

            // 5. Navigate to Gratitude Success Page on Verified Capture or Confirmed Pending
            // Clear submitting state so returning to /donate won't get stuck
            setState((prev) => ({ ...prev, isSubmitting: false }));
            router.push(`/donate/success/${orderData.donationReference}`);
          } catch (verifyErr) {
            clearTimeout(timeoutId);
            console.error("Verification error:", verifyErr);
            setState((prev) => ({ ...prev, isSubmitting: false }));

            const isTimeout =
              verifyErr instanceof Error &&
              (verifyErr.name === "AbortError" ||
                verifyErr.message.toLowerCase().includes("timeout") ||
                verifyErr.message.toLowerCase().includes("aborted"));

            if (isTimeout) {
              setGeneralError(
                `Payment verification timed out. If your account was debited, your donation will be verified shortly via payment reconciliation. Reference: ${orderData.donationReference}`
              );
            } else {
              setGeneralError(
                verifyErr instanceof Error
                  ? verifyErr.message
                  : "Payment verification error. Please contact Samartha Trust with your transaction details."
              );
            }
          } finally {
            clearTimeout(timeoutId);
            setState((prev) => ({ ...prev, isSubmitting: false }));
          }
        },
      });

      // Register Razorpay payment failure event handler
      if (typeof razorpayInstance.on === "function") {
        razorpayInstance.on(
          "payment.failed",
          (failureResponse: {
            error?: {
              description?: string;
              code?: string;
              reason?: string;
            };
          }) => {
            console.error("Razorpay payment.failed event:", failureResponse);
            setState((prev) => ({ ...prev, isSubmitting: false }));
            setGeneralError(
              failureResponse.error?.description ||
                "Payment was declined or failed at the payment gateway. Please verify your payment details and try again."
            );
          }
        );
      }

      razorpayInstance.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setState((prev) => ({ ...prev, isSubmitting: false }));
      setGeneralError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while initiating payment. Please try again."
      );
    }
  };

  return (
    <div className="relative min-h-screen">
      <DonationHero />

      <main
        ref={wizardContainerRef}
        id="donation-experience"
        className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-4 top-0 bottom-0 -z-10 rounded-3xl bg-gradient-to-br from-[#EDE9FE]/35 via-white/50 to-[#FCE7F3]/40 sm:-inset-x-8"
        />
        {/* Step Stepper */}
        <DonationProgress
          currentStep={state.step}
          onStepClick={goToStep}
          maxAccessibleStep={state.step}
        />

        {/* Global Error Banner */}
        {generalError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-800 animate-in fade-in-50"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Payment Notification</p>
              <p className="text-xs leading-relaxed">{generalError}</p>
            </div>
          </div>
        )}

        {/* Form Body and Sidebar */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Main Step Content */}
          <div className="min-w-0 lg:col-span-8 lg:col-start-1 rounded-2xl border border-[#EADDED]/80 bg-gradient-to-br from-white via-[#FDF8FF]/90 to-[#FCE7F3]/25 p-5 shadow-md sm:p-8">
            {/* Step 1: Amount */}
            {state.step === 1 && (
              <div className="space-y-7">
                <DonationAmountSelector
                  amount={state.amount}
                  customAmountInput={state.customAmountInput}
                  isCustomAmount={state.isCustomAmount}
                  onSelectPreset={handlePresetSelect}
                  onCustomAmountChange={handleCustomAmountChange}
                  error={state.validationErrors.amount}
                />

                <div className="pt-4 border-t border-[#EADDED] flex items-center justify-end">
                  <Button
                    type="button"
                    onClick={handleNextFromStep1}
                    className="w-full sm:w-auto h-11 px-7 text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Continue to Donor Details</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Donor Details */}
            {state.step === 2 && (
              <div className="space-y-6">
                <DonationDonorForm
                  donor={state.donor}
                  onChange={handleDonorFieldChange}
                  errors={state.validationErrors}
                />

                <div className="pt-4 border-t border-[#EADDED] flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goToStep(1)}
                    className="w-full sm:w-auto border-[#EADDED]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    <span>Back to Amount</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNextFromStep2}
                    className="w-full sm:w-auto h-11 px-7 text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Review Donation</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {state.step === 3 && (
              <div className="space-y-6">
                <DonationReview
                  state={state}
                  onEditStep={(step) => goToStep(step)}
                  onConfirm={handleConfirmAndPay}
                  onAgreeChange={(agreed) =>
                    handleDonorFieldChange("agreedToTerms", agreed)
                  }
                  error={state.validationErrors.agreedToTerms}
                  isSubmitting={state.isSubmitting}
                  submittingText={submittingText}
                />

                <div className="pt-2 border-t border-[#EADDED]">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => goToStep(2)}
                    disabled={state.isSubmitting}
                    className="text-xs font-semibold text-[#75647B]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>Back to Donor Details</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Fallback Review / Details Ready */}
            {state.step === 4 && preparedPayload && (
              <DonationPaymentHandoff
                payload={preparedPayload}
                onModify={() => goToStep(1)}
              />
            )}
          </div>

          {/* Sticky Summary Sidebar on Desktop */}
          <div className="min-w-0 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-start">
            <div className="lg:sticky lg:top-[calc(var(--customer-header-height)+1.25rem)] lg:max-h-[calc(100svh-var(--customer-header-height)-2rem)] lg:overflow-y-auto lg:overscroll-contain">
              <DonationSummary
                state={state}
                onEditStep={(step) => goToStep(step)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Trust & Transparency Pillars */}
      <DonationTrustSection />

      {/* FAQ Accordion */}
      <DonationFAQ />
    </div>
  );
}
