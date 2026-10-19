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
  return <ContactPageContent />;
}
