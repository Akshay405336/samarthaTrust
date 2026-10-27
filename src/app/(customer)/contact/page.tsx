import * as React from "react";
import type { Metadata } from "next";
import { ContactPageContent } from "@/components/customer/contact";

export const metadata: Metadata = {
  title: "Contact Samartha Trust",
  description:
    "Contact Samartha Trust in Bengaluru for general inquiries, volunteering, donations, partnerships and community initiatives.",
  openGraph: {
    title: "Contact Samartha Trust | We Believe in Abilities",
    description:
      "Contact Samartha Trust in Bengaluru for general inquiries, volunteering, donations, partnerships and community initiatives.",
    url: "/contact",
    siteName: "Samartha Trust",
    locale: "en_IN",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0FDFA] via-[#FDF8FF] to-[#FFF7ED]/45">
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-35"
      />
      <ContactPageContent />
    </main>
  );
}
