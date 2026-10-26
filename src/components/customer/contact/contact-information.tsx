import * as React from "react";
import { MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { ContactInfoCard } from "./contact-info-card";
import {
  CONTACT_OFFICE,
  CONTACT_PHONE,
  CONTACT_EMAIL,
} from "./contact-constants";

export function ContactInformation() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9200A8]">
          Official Channels
        </span>
        <h2 className="text-2xl font-bold text-[#35123F] sm:text-3xl mt-1">
          Get in Touch Directly
        </h2>
        <p className="mt-1.5 text-sm text-[#75647B] leading-relaxed">
          Reach our administrative team through any of our verified communication
          channels or visit our registered headquarters.
        </p>
      </div>

      <div className="space-y-4">
        {/* Office Address */}
        <ContactInfoCard
          title="Registered Office"
          value={CONTACT_OFFICE.addressLine1}
          secondaryValue={`${CONTACT_OFFICE.addressLine2}, ${CONTACT_OFFICE.city}, ${CONTACT_OFFICE.state} ${CONTACT_OFFICE.pincode}`}
          href={CONTACT_OFFICE.googleMapsUrl}
          icon={MapPin}
          actionText="Get Directions on Google Maps"
          external
        />

        {/* Telephone */}
        <ContactInfoCard
          title="Direct Telephone"
          value={CONTACT_PHONE.display}
          secondaryValue="Direct Voice & Helpline"
          href={`tel:${CONTACT_PHONE.tel}`}
          icon={Phone}
          actionText="Call Us Directly"
        />

        {/* Email */}
        <ContactInfoCard
          title="Electronic Mail"
          value={CONTACT_EMAIL}
          secondaryValue="Official General & Program Inquiries"
          href={`mailto:${CONTACT_EMAIL}`}
          icon={Mail}
          actionText="Send an Email"
        />

        {/* Commitment note */}
        <div className="rounded-2xl border border-[#EADDED] bg-[#FAF5FF] p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FCE7F3] text-[#9200A8]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-[#35123F]">
              Verified & Direct Coordination
            </h3>
          </div>
          <p className="mt-2 text-xs text-[#75647B] leading-relaxed">
            All messages and phone calls are answered directly by our Bangalore
            headquarters team. We respect your privacy and ensure your details
            are never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
