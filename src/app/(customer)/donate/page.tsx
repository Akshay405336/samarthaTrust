import * as React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { DonationPageContent } from "@/components/customer/donation/donation-page-content";
import { DonationLoading } from "@/components/customer/donation/donation-loading";

export const instant = false;

export const metadata: Metadata = {
  title: "Donate & Support Our Programs",
  description:
    "Make a secure contribution to Samartha Trust. Your generous donation empowers specially-abled children, funds education, and provides vital healthcare and nutrition.",
  openGraph: {
    title: "Support Samartha Trust | We Believe in Abilities",
    description:
      "Join us in transforming lives with a secure one-time contribution to our community welfare initiatives.",
    url: "/donate",
    siteName: "Samartha Trust",
    locale: "en_IN",
    type: "website",
  },
};

interface DonatePageProps {
  searchParams?: Promise<{ fresh?: string; [key: string]: string | string[] | undefined }>;
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const fresh = resolvedParams?.fresh;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#FFFBEB]/35 via-[#FDF8FF] to-[#FCE7F3]/40">
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-30"
      />
      <Suspense fallback={<DonationLoading />}>
        <DonationPageContent key={fresh ? `fresh-${fresh}` : "donate-root"} />
      </Suspense>
    </main>
  );
}
