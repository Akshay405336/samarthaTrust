"use client";

import * as React from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INQUIRY_TYPES } from "./contact-constants";

export function ContactFormSection() {
  const [formData, setFormData] = React.useState<ContactFormInput>({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "General Inquiry",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
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

  const handleInquiryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      inquiryType: newType,
      // If subject is empty or matching a previous default, set a helpful subject
      subject:
        !prev.subject || prev.subject.startsWith("Inquiry regarding ")
          ? `Inquiry regarding ${newType}`
          : prev.subject,
    }));

    if (errors.inquiryType || errors.subject) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.inquiryType;
        delete next.subject;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Ensure subject has a fallback if user left it blank
    const submissionPayload = {
      ...formData,
      subject:
        formData.subject.trim() ||
        `Inquiry regarding ${formData.inquiryType || "General Inquiry"}`,
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

      // Focus first error field
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        const el = document.getElementById(firstErrorField);
        el?.focus();
      }
      return;
    }

    setErrors({});
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        throw new Error(
          data.error ||
            "Unable to submit your inquiry at this moment. Please try again or reach us directly at info@samarthatrust.org."
        );
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Contact form submission error:", err);
      setServerError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again or call +91 97409 19104."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setServerError(null);
    setErrors({});
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      inquiryType: "General Inquiry",
      subject: "",
      message: "",
    });
  };

  if (isSuccess) {
    return (
      <div
        id="contact-form"
        className="rounded-2xl border border-[#EADDED] bg-[#FCE7F3]/40 p-8 sm:p-10 text-center animate-in fade-in-50"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCE7F3] text-[#9200A8] border border-[#EADDED] shadow-2xs">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <h3 className="mt-4 text-2xl font-bold text-[#35123F]">
          Message Sent Successfully!
        </h3>

        <p className="mt-2 text-sm text-[#75647B] max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to Samartha Trust. Your message has been
          received by our Bangalore headquarters team. A coordinator will
          contact you shortly.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="w-full sm:w-auto border-[#EADDED] text-[#35123F] hover:bg-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Send Another Message</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id="contact-form" className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9200A8]">
          Write to Us
        </span>
        <h2 className="text-2xl font-bold text-[#35123F] sm:text-3xl mt-1">
          Send Us a Message
        </h2>
        <p className="mt-1.5 text-sm text-[#75647B] leading-relaxed">
          Fill in your details below and our coordinator will respond to your
          inquiry as soon as possible.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-2.5 animate-in fade-in-50"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Submission Notice</p>
            <p className="leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Full Name */}
        <div>
          <Label
            htmlFor="fullName"
            className="text-[#35123F] font-semibold text-xs uppercase tracking-wider"
          >
            Full Name <span className="text-[#9200A8]">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Ramesh Kumar"
            disabled={isSubmitting}
            className="mt-1.5 border-[#EADDED] bg-white focus-visible:ring-[#9200A8]"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="text-[#35123F] font-semibold text-xs uppercase tracking-wider"
            >
              Email Address <span className="text-[#9200A8]">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ramesh@example.com"
              disabled={isSubmitting}
              className="mt-1.5 border-[#EADDED] bg-white focus-visible:ring-[#9200A8]"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
              >
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label
              htmlFor="phone"
              className="text-[#35123F] font-semibold text-xs uppercase tracking-wider"
            >
              Mobile Number (Optional)
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 97409 19104"
              disabled={isSubmitting}
              className="mt-1.5 border-[#EADDED] bg-white focus-visible:ring-[#9200A8]"
            />
          </div>
        </div>

        {/* Inquiry Type & Subject */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Inquiry Type */}
          <div>
            <Label
              htmlFor="inquiryType"
              className="text-[#35123F] font-semibold text-xs uppercase tracking-wider"
            >
              Inquiry Type <span className="text-[#9200A8]">*</span>
            </Label>
            <div className="relative mt-1.5">
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInquiryTypeChange}
                disabled={isSubmitting}
                className="w-full h-10 rounded-md border border-[#EADDED] bg-white px-3 text-sm text-[#35123F] focus:border-[#9200A8] focus:outline-hidden focus:ring-2 focus:ring-[#9200A8]/20"
              >
                {INQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label
              htmlFor="subject"
              className="text-[#35123F] font-semibold text-xs uppercase tracking-wider"
            >
              Subject / Topic <span className="text-[#9200A8]">*</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Volunteering for weekend health camp"
              disabled={isSubmitting}
              className="mt-1.5 border-[#EADDED] bg-white focus-visible:ring-[#9200A8]"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <p
                id="subject-error"
                className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
              >
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.subject}</span>
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <Label
            htmlFor="message"
            className="text-[#35123F] font-semibold text-xs uppercase tracking-wider"
          >
            Message <span className="text-[#9200A8]">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Please describe how you would like to collaborate, volunteer, or what information you need..."
            disabled={isSubmitting}
            className="mt-1.5 border-[#EADDED] bg-white focus-visible:ring-[#9200A8]"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p
              id="message-error"
              className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-11 px-7 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Message...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span>Submit Message</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
