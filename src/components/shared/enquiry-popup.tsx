"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Heart,
  Loader2,
  Send,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/validations/contact";

const OPEN_DELAY_MS = 3000;
const CLOSE_ANIMATION_MS = 280;

const ENQUIRY_TYPES = [
  "General Enquiry",
  "Volunteering",
  "Donations",
  "Partnerships",
  "Education Support",
  "Other",
] as const;

const INITIAL_FORM: ContactFormInput = {
  fullName: "",
  email: "",
  phone: "",
  inquiryType: "General Enquiry",
  subject: "",
  message: "",
};

function isPublicRoute(pathname: string) {
  return !pathname.startsWith("/admin");
}

export function EnquiryPopup() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [isRendered, setIsRendered] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const sessionDismissedRef = React.useRef(false);
  const hasScheduledOpenRef = React.useRef(false);

  const [formData, setFormData] =
    React.useState<ContactFormInput>(INITIAL_FORM);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !isPublicRoute(pathname)) return;
    if (sessionDismissedRef.current || hasScheduledOpenRef.current) return;

    hasScheduledOpenRef.current = true;

    const timer = window.setTimeout(() => {
      if (!sessionDismissedRef.current) {
        setIsRendered(true);
      }
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [mounted, pathname]);

  React.useEffect(() => {
    if (!isRendered) {
      setIsVisible(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isRendered]);

  React.useEffect(() => {
    if (!isRendered || !mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isRendered, mounted]);

  const handleClose = React.useCallback(() => {
    sessionDismissedRef.current = true;
    setIsVisible(false);
    window.setTimeout(() => {
      setIsRendered(false);
    }, CLOSE_ANIMATION_MS);
  }, []);

  React.useEffect(() => {
    if (!isRendered) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isRendered, handleClose]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    const submissionPayload: ContactFormInput = {
      ...formData,
      subject:
        formData.subject.trim() ||
        `Enquiry regarding ${formData.inquiryType || "General Enquiry"}`,
    };

    const validation = contactFormSchema.safeParse(submissionPayload);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);

      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        document.getElementById(`enquiry-${firstErrorField}`)?.focus();
      }
      return;
    }

    setErrors({});
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        throw new Error(
          data.error ||
            "Unable to submit your enquiry at this moment. Please try again or reach us at info@samarthatrust.org."
        );
      }

      setIsSuccess(true);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again or call +91 97409 19104."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isPublicRoute(pathname) || !isRendered) {
    return null;
  }

  return createPortal(
    <div
      className="enquiry-popup-root fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close enquiry popup"
        className={`enquiry-popup-backdrop absolute inset-0 bg-black/55 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-popup-title"
        aria-describedby="enquiry-popup-description"
        className={`enquiry-popup-panel relative flex max-h-[min(92vh,880px)] w-full max-w-[980px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out motion-reduce:transition-none md:max-h-[min(88vh,820px)] md:flex-row ${
          isVisible
            ? "scale-100 opacity-100"
            : "scale-[0.96] opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-4 md:top-4"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left panel */}
        <div className="relative min-h-[180px] shrink-0 overflow-hidden md:min-h-0 md:w-[42%] lg:w-[44%]">
          <Image
            src="/images/about/Joyful-Inclusive.png"
            alt="Children learning together in an inclusive classroom"
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#7100A8]/88 via-[#9200A8]/82 to-[#E90078]/86"
          />
          <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6 md:p-7 lg:p-8">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur-sm">
              <Heart className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
              Samartha Trust
            </p>
            <h2 className="mt-2 text-xl font-extrabold leading-tight text-white sm:text-2xl lg:text-[1.65rem]">
              Together, We Can Create a Brighter Tomorrow
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90">
              Join us in nurturing education, child welfare, and inclusive
              communities where every child can learn, grow, and thrive.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex min-h-0 flex-1 flex-col bg-[#FAF5FF] md:bg-white">
          <div className="enquiry-popup-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-5 sm:p-6 md:p-7 lg:p-8">
            {isSuccess ? (
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#EADDED] bg-[#FCE7F3] text-[#9200A8]">
                  <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[#35123F]">
                  Thank You for Reaching Out
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#75647B]">
                  Your enquiry has been received. Our team will contact you
                  shortly.
                </p>
                <Button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 h-11 rounded-full bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] px-6 font-semibold text-white hover:brightness-110"
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <h3
                    id="enquiry-popup-title"
                    className="text-2xl font-bold text-[#35123F] sm:text-[1.65rem]"
                  >
                    Let&apos;s Start a Conversation
                  </h3>
                  <p
                    id="enquiry-popup-description"
                    className="mt-1.5 text-sm leading-relaxed text-[#75647B]"
                  >
                    Tell us how we can help you make a difference.
                  </p>
                </div>

                {serverError && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="leading-relaxed">{serverError}</p>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="mt-5 space-y-4"
                  noValidate
                >
                  <div>
                    <Label
                      htmlFor="enquiry-fullName"
                      className="text-xs font-semibold uppercase tracking-wider text-[#35123F]"
                    >
                      Full Name <span className="text-[#9200A8]">*</span>
                    </Label>
                    <Input
                      id="enquiry-fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                      disabled={isSubmitting}
                      className="mt-1.5 border-[#EADDED] bg-white focus-visible:ring-[#9200A8]"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={
                        errors.fullName ? "enquiry-fullName-error" : undefined
                      }
                    />
                    {errors.fullName && (
                      <p
                        id="enquiry-fullName-error"
                        className="mt-1 flex items-center gap-1 text-xs font-medium text-[#DC2626]"
                      >
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="enquiry-email"
                        className="text-xs font-semibold uppercase tracking-wider text-[#35123F]"
                      >
                        Email Address <span className="text-[#9200A8]">*</span>
                      </Label>
                      <Input
                        id="enquiry-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        disabled={isSubmitting}
                        className="mt-1.5 border-[#EADDED] bg-white focus-visible:ring-[#9200A8]"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "enquiry-email-error" : undefined
                        }
                      />
                      {errors.email && (
                        <p
                          id="enquiry-email-error"
                          className="mt-1 flex items-center gap-1 text-xs font-medium text-[#DC2626]"
                        >
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="enquiry-phone"
                        className="text-xs font-semibold uppercase tracking-wider text-[#35123F]"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="enquiry-phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        disabled={isSubmitting}
                        placeholder="+91 97409 19104"
                        className="mt-1.5 border-[#EADDED] bg-white focus-visible:ring-[#9200A8]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="enquiry-inquiryType"
                      className="text-xs font-semibold uppercase tracking-wider text-[#35123F]"
                    >
                      Enquiry Type <span className="text-[#9200A8]">*</span>
                    </Label>
                    <select
                      id="enquiry-inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="mt-1.5 h-10 w-full rounded-md border border-[#EADDED] bg-white px-3 text-sm text-[#35123F] focus:border-[#9200A8] focus:outline-hidden focus:ring-2 focus:ring-[#9200A8]/20"
                    >
                      {ENQUIRY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="enquiry-message"
                      className="text-xs font-semibold uppercase tracking-wider text-[#35123F]"
                    >
                      Message <span className="text-[#9200A8]">*</span>
                    </Label>
                    <Textarea
                      id="enquiry-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Share how you would like to support, volunteer, partner, or learn more..."
                      className="mt-1.5 border-[#EADDED] bg-white focus-visible:ring-[#9200A8]"
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "enquiry-message-error" : undefined
                      }
                    />
                    {errors.message && (
                      <p
                        id="enquiry-message-error"
                        className="mt-1 flex items-center gap-1 text-xs font-medium text-[#DC2626]"
                      >
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-full bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] font-semibold text-white shadow-md hover:brightness-110 sm:w-auto sm:px-8"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Enquiry
                      </span>
                    )}
                  </Button>

                  <p className="text-[11px] leading-relaxed text-[#75647B]">
                    By submitting this form, you agree that Samartha Trust may
                    contact you about your enquiry. We respect your privacy and
                    handle your details responsibly.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
