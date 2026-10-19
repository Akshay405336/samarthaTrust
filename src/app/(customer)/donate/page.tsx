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
      "Join us in transforming lives. Choose a cause to support or contribute to our general community welfare initiatives.",
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
    <Suspense fallback={<DonationLoading />}>
      <DonationPageContent key={fresh ? `fresh-${fresh}` : "donate-root"} />
    </Suspense>
  );
}
