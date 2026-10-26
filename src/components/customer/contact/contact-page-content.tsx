import * as React from "react";
import { Container } from "@/components/shared/container";
import { ContactHero } from "./contact-hero";
import { ContactIntro } from "./contact-intro";
import { ContactFormSection } from "./contact-form-section";
import { ContactInformation } from "./contact-information";
import { ContactBranchesSection } from "./contact-branches-section";
import { ContactOfficeSection } from "./contact-office-section";
import { ContactVolunteerCTA } from "./contact-volunteer-cta";
import { ContactFAQ } from "./contact-faq";

export function ContactPageContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <ContactHero />

      {/* 2. Intro / Engagement Overview */}
      <ContactIntro />

      {/* 3. Main Form & Official Channels Section */}
      <section className="py-14 sm:py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#EADDED] bg-white p-6 sm:p-8 shadow-xs">
                <ContactFormSection />
              </div>
            </div>

            {/* Information Column (5 cols) */}
            <div className="lg:col-span-5">
              <ContactInformation />
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Three Branch Locations */}
      <ContactBranchesSection />

      {/* 5. Headquarters Office Location & Interactive Map */}
      <ContactOfficeSection />

      {/* 6. Volunteer & Collaboration Call to Action */}
      <ContactVolunteerCTA />

      {/* 7. Frequently Asked Questions (2-Column Grid) */}
      <ContactFAQ />
    </div>
  );
}
