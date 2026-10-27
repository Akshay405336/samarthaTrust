"use client";

import * as React from "react";
import { MapPin, Phone, Mail, ShieldCheck } from "lucide-react";

import { ContactInfoCard } from "./contact-info-card";
import {
  CONTACT_OFFICE,
  CONTACT_PHONE,
  CONTACT_EMAIL,
} from "./contact-constants";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const CARD_VARIANTS = ["slide-right", "fade-up", "scale-in"] as const;

export function ContactInformation() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLDivElement>({
    threshold: 0.08,
  });

  return (
    <div ref={ref} className="space-y-6">
      <div className={cn(revealVariant("slide-right"))}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9200A8]">
          Official Channels
        </span>
        <h2 className="mt-1 text-2xl font-bold text-[#35123F] sm:text-3xl">
          Get in Touch Directly
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#75647B]">
          Reach our administrative team through any of our verified communication
          channels or visit our registered headquarters.
        </p>
      </div>

      <div className="space-y-4">
        <div
          className={revealVariant(CARD_VARIANTS[0])}
          style={{ animationDelay: "100ms" }}
        >
          <ContactInfoCard
            title="Registered Office"
            value={CONTACT_OFFICE.addressLine1}
            secondaryValue={`${CONTACT_OFFICE.addressLine2}, ${CONTACT_OFFICE.city}, ${CONTACT_OFFICE.state} ${CONTACT_OFFICE.pincode}`}
            href={CONTACT_OFFICE.googleMapsUrl}
            icon={MapPin}
            actionText="Get Directions on Google Maps"
            external
            accent="teal"
          />
        </div>

        <div
          className={revealVariant(CARD_VARIANTS[1])}
          style={{ animationDelay: "180ms" }}
        >
          <ContactInfoCard
            title="Direct Telephone"
            value={CONTACT_PHONE.display}
            secondaryValue="Direct Voice & Helpline"
            href={`tel:${CONTACT_PHONE.tel}`}
            icon={Phone}
            actionText="Call Us Directly"
            accent="violet"
          />
        </div>

        <div
          className={revealVariant(CARD_VARIANTS[2])}
          style={{ animationDelay: "260ms" }}
        >
          <ContactInfoCard
            title="Electronic Mail"
            value={CONTACT_EMAIL}
            secondaryValue="Official General & Program Inquiries"
            href={`mailto:${CONTACT_EMAIL}`}
            icon={Mail}
            actionText="Send an Email"
            accent="rose"
          />
        </div>

        <div
          className={cn(
            revealVariant("blur-in"),
            "rounded-2xl border border-[#C4B5FD]/40 bg-gradient-to-br from-[#EDE9FE]/70 via-white to-[#FCE7F3]/40 p-5 shadow-sm sm:p-6",
            isInView && "motion-active"
          )}
          style={{ animationDelay: "340ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#9200A8] to-[#E90078] text-white shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-[#35123F]">
              Verified & Direct Coordination
            </h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#75647B]">
            All messages and phone calls are answered directly by our Bangalore
            headquarters team. We respect your privacy and ensure your details are
            never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
