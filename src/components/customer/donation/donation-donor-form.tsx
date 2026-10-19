"use client";

import * as React from "react";
import { User, Mail, Phone, FileText, MapPin, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DonorDetails } from "./donation-types";

interface DonationDonorFormProps {
  donor: DonorDetails;
  onChange: (field: keyof DonorDetails, value: string | boolean) => void;
  errors: Record<string, string>;
}

export function DonationDonorForm({
  donor,
  onChange,
  errors,
}: DonationDonorFormProps) {
  const [showAddressFields, setShowAddressFields] = React.useState(
    Boolean(donor.addressLine1 || donor.city || donor.pincode)
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="border-b border-[#EFE8D8] pb-4">
        <h3 className="text-lg font-bold text-[#492A22]">Donor Information</h3>
        <p className="text-xs sm:text-sm text-[#78685D] mt-1">
          Please provide your details for official receipting and communication.
        </p>
      </div>

      {/* Primary Contact Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Full Name */}
        <div className="sm:col-span-2 space-y-1.5">
          <label
            htmlFor="donor-full-name"
            className="block text-xs font-bold uppercase tracking-wider text-[#492A22]"
          >
            Full Name <span className="text-[#F52232]">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#78685D]">
              <User className="h-4 w-4" />
            </div>
            <input
              id="donor-full-name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Ramesh Kumar"
              value={donor.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              className={cn(
                "block w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-[#492A22] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#F52232] transition-colors",
                errors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#E8DFC9] hover:border-[#D6CBB8]"
              )}
              aria-invalid={Boolean(errors.fullName)}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="donor-email"
            className="block text-xs font-bold uppercase tracking-wider text-[#492A22]"
          >
            Email Address <span className="text-[#F52232]">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#78685D]">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="donor-email"
              type="email"
              autoComplete="email"
              placeholder="e.g. ramesh@example.com"
              value={donor.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={cn(
                "block w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-[#492A22] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#F52232] transition-colors",
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#E8DFC9] hover:border-[#D6CBB8]"
              )}
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          {errors.email ? (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {errors.email}
            </p>
          ) : (
            <p className="text-[11px] text-[#78685D]">
              Your donation acknowledgement will be sent here.
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="donor-phone"
            className="block text-xs font-bold uppercase tracking-wider text-[#492A22]"
          >
            Phone Number <span className="text-[#F52232]">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#78685D]">
              <Phone className="h-4 w-4" />
            </div>
            <input
              id="donor-phone"
              type="tel"
              autoComplete="tel"
              placeholder="e.g. +91 98765 43210"
              value={donor.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className={cn(
                "block w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-[#492A22] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#F52232] transition-colors",
                errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#E8DFC9] hover:border-[#D6CBB8]"
              )}
              aria-invalid={Boolean(errors.phone)}
            />
          </div>
          {errors.phone ? (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {errors.phone}
            </p>
          ) : (
            <p className="text-[11px] text-[#78685D]">
              For transaction verification and queries.
            </p>
          )}
        </div>

        {/* PAN Number (Optional) */}
        <div className="sm:col-span-2 space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="donor-pan"
              className="block text-xs font-bold uppercase tracking-wider text-[#492A22]"
            >
              PAN (Permanent Account Number)
            </label>
            <span className="text-[11px] font-medium text-stone-500">
              Optional
            </span>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#78685D]">
              <FileText className="h-4 w-4" />
            </div>
            <input
              id="donor-pan"
              type="text"
              maxLength={10}
              placeholder="ABCDE1234F"
              value={donor.panNumber}
              onChange={(e) =>
                onChange("panNumber", e.target.value.toUpperCase())
              }
              className={cn(
                "block w-full uppercase rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm font-semibold tracking-wider text-[#492A22] placeholder:text-stone-400 placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#F52232] transition-colors",
                errors.panNumber
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#E8DFC9] hover:border-[#D6CBB8]"
              )}
              aria-invalid={Boolean(errors.panNumber)}
            />
          </div>
          {errors.panNumber ? (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {errors.panNumber}
            </p>
          ) : (
            <p className="text-[11px] text-[#78685D]">
              Applicable for Indian tax compliance records.
            </p>
          )}
        </div>
      </div>

      {/* Address Toggle */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAddressFields(!showAddressFields)}
          className="text-xs font-bold text-[#F52232] hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>
            {showAddressFields
              ? "− Hide Postal Address details"
              : "+ Add Postal Address for Receipt Records (Optional)"}
          </span>
        </button>

        {showAddressFields && (
          <div className="mt-3 p-4 rounded-xl bg-[#FFFDF9] border border-[#EFE8D8] grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in-50 duration-200">
            <div className="sm:col-span-2 space-y-1">
              <label
                htmlFor="donor-address1"
                className="block text-xs font-semibold text-[#492A22]"
              >
                Address Line 1
              </label>
              <input
                id="donor-address1"
                type="text"
                placeholder="House / Flat / Street"
                value={donor.addressLine1}
                onChange={(e) => onChange("addressLine1", e.target.value)}
                className="w-full rounded-lg border border-[#E8DFC9] px-3 py-2 text-sm text-[#492A22] focus:outline-none focus:ring-2 focus:ring-[#F52232]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="donor-city"
                className="block text-xs font-semibold text-[#492A22]"
              >
                City
              </label>
              <input
                id="donor-city"
                type="text"
                placeholder="e.g. Bengaluru"
                value={donor.city}
                onChange={(e) => onChange("city", e.target.value)}
                className="w-full rounded-lg border border-[#E8DFC9] px-3 py-2 text-sm text-[#492A22] focus:outline-none focus:ring-2 focus:ring-[#F52232]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="donor-state"
                className="block text-xs font-semibold text-[#492A22]"
              >
                State
              </label>
              <input
                id="donor-state"
                type="text"
                placeholder="e.g. Karnataka"
                value={donor.state}
                onChange={(e) => onChange("state", e.target.value)}
                className="w-full rounded-lg border border-[#E8DFC9] px-3 py-2 text-sm text-[#492A22] focus:outline-none focus:ring-2 focus:ring-[#F52232]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="donor-pincode"
                className="block text-xs font-semibold text-[#492A22]"
              >
                PIN Code
              </label>
              <input
                id="donor-pincode"
                type="text"
                maxLength={6}
                placeholder="e.g. 560001"
                value={donor.pincode}
                onChange={(e) => onChange("pincode", e.target.value)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm text-[#492A22] focus:outline-none focus:ring-2 focus:ring-[#F52232]",
                  errors.pincode ? "border-red-500" : "border-[#E8DFC9]"
                )}
              />
              {errors.pincode && (
                <p className="text-xs text-red-600 mt-0.5">{errors.pincode}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="donor-country"
                className="block text-xs font-semibold text-[#492A22]"
              >
                Country
              </label>
              <input
                id="donor-country"
                type="text"
                placeholder="India"
                value={donor.country}
                onChange={(e) => onChange("country", e.target.value)}
                className="w-full rounded-lg border border-[#E8DFC9] px-3 py-2 text-sm text-[#492A22] focus:outline-none focus:ring-2 focus:ring-[#F52232]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Message / Dedication */}
      <div className="space-y-1.5 pt-1">
        <label
          htmlFor="donor-message"
          className="block text-xs font-bold uppercase tracking-wider text-[#492A22]"
        >
          Personal Message or Dedication (Optional)
        </label>
        <textarea
          id="donor-message"
          rows={3}
          placeholder="Share why you are supporting Samartha Trust, or dedicate this gift in honor of a loved one..."
          value={donor.message}
          onChange={(e) => onChange("message", e.target.value)}
          className="block w-full rounded-xl border border-[#E8DFC9] bg-white p-3 text-sm text-[#492A22] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#F52232] transition-colors"
        />
      </div>

      {/* Preferences & Privacy Checkboxes */}
      <div className="space-y-3 pt-2 border-t border-[#EFE8D8]">
        {/* Anonymous Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={donor.isAnonymous}
            onChange={(e) => onChange("isAnonymous", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#D6CBB8] text-[#F52232] focus:ring-[#F52232] cursor-pointer"
          />
          <div className="text-xs text-[#492A22] leading-relaxed">
            <span className="font-semibold group-hover:text-[#F52232] transition-colors">
              Make this donation anonymously
            </span>
            <p className="text-[11px] text-[#78685D]">
              Your name will remain private and will not appear in public donor
              acknowledgements.
            </p>
          </div>
        </label>

        {/* Consent Updates Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={donor.consentUpdates}
            onChange={(e) => onChange("consentUpdates", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#D6CBB8] text-[#F52232] focus:ring-[#F52232] cursor-pointer"
          />
          <div className="text-xs text-[#492A22] leading-relaxed">
            <span className="font-semibold group-hover:text-[#F52232] transition-colors">
              Keep me updated on Samartha Trust&apos;s impact
            </span>
            <p className="text-[11px] text-[#78685D]">
              Receive occasional stories and reports showing how community
              support is transforming lives.
            </p>
          </div>
        </label>
      </div>

      {/* Trust reassurance */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F6F8F6] border border-[#E0EAE0] text-xs text-[#2E7D32]">
        <Shield className="w-4 h-4 shrink-0 text-[#2E7D32]" />
        <span>
          Your data is strictly confidential and protected under standard
          privacy practices.
        </span>
      </div>
    </div>
  );
}
