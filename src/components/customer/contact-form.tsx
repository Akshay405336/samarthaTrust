"use client";

import * as React from "react";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = React.useState<ContactFormInput>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = contactFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    // Validation succeeded
    setErrors({});
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-[#EADCCB] bg-[#FFF5E6]/60 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB]">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-[#492A22]">
          Thank you for reaching out!
        </h3>
        <p className="mt-2 text-sm text-[#78685D] max-w-md mx-auto">
          We have received your message. A coordinator from Samartha Trust will
          get in touch with you shortly.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              fullName: "",
              email: "",
              phone: "",
              subject: "",
              message: "",
            });
          }}
          variant="outline"
          className="mt-6"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <Label
          htmlFor="fullName"
          className="text-[#492A22] font-semibold text-xs uppercase tracking-wider"
        >
          Full Name <span className="text-[#F52232]">*</span>
        </Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. Ramesh Kumar"
          className="mt-1.5 border-[#EADCCB] focus-visible:ring-[#F52232]"
          aria-invalid={!!errors.fullName}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-[#F52232] flex items-center gap-1 font-medium">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.fullName}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="email"
            className="text-[#492A22] font-semibold text-xs uppercase tracking-wider"
          >
            Email Address <span className="text-[#F52232]">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ramesh@example.com"
            className="mt-1.5 border-[#EADCCB] focus-visible:ring-[#F52232]"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#F52232] flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="phone"
            className="text-[#492A22] font-semibold text-xs uppercase tracking-wider"
          >
            Phone Number (Optional)
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="mt-1.5 border-[#EADCCB] focus-visible:ring-[#F52232]"
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="subject"
          className="text-[#492A22] font-semibold text-xs uppercase tracking-wider"
        >
          Subject / Inquiry Area <span className="text-[#F52232]">*</span>
        </Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g. Volunteering with disability empowerment camps"
          className="mt-1.5 border-[#EADCCB] focus-visible:ring-[#F52232]"
          aria-invalid={!!errors.subject}
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-[#F52232] flex items-center gap-1 font-medium">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.subject}</span>
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="message"
          className="text-[#492A22] font-semibold text-xs uppercase tracking-wider"
        >
          Message <span className="text-[#F52232]">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe how you would like to collaborate, volunteer, or inquire..."
          className="mt-1.5 border-[#EADCCB] focus-visible:ring-[#F52232]"
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-[#F52232] flex items-center gap-1 font-medium">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.message}</span>
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        <span className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          <span>{loading ? "Validating..." : "Submit Inquiry"}</span>
        </span>
      </Button>
    </form>
  );
}
