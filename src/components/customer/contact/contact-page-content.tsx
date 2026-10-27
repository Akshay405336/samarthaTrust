import * as React from "react";
import { ContactHero } from "./contact-hero";
import { ContactIntro } from "./contact-intro";
import { ContactFormSection } from "./contact-form-section";
import { ContactInformation } from "./contact-information";
import { ContactBranchesSection } from "./contact-branches-section";
import { ContactOfficeSection } from "./contact-office-section";
import { ContactVolunteerCTA } from "./contact-volunteer-cta";
import { ContactFAQ } from "./contact-faq";
import { ContactConnectSection } from "./contact-connect-section";

export function ContactPageContent() {
  return (
    <div className="relative min-h-screen">
      <ContactHero />
      <ContactIntro />

      <ContactConnectSection>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-[#93C5FD]/35 bg-gradient-to-br from-white/95 via-[#EFF6FF]/40 to-[#EDE9FE]/25 p-6 shadow-md backdrop-blur-sm sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0EA5E9] via-[#9200A8] to-[#14B8A6]"
              />
              <ContactFormSection />
            </div>
          </div>

          <div className="lg:col-span-5">
            <ContactInformation />
          </div>
        </div>
      </ContactConnectSection>

      <ContactBranchesSection />
      <ContactOfficeSection />
      <ContactVolunteerCTA />
      <ContactFAQ />
    </div>
  );
}
