import type { Metadata } from "next";
import * as React from "react";
import { TrusteesHero } from "@/components/customer/our-trustee/trustees-hero";
import { TrusteesDirectory } from "@/components/customer/our-trustee/trustees-directory";
import { TeamSectionSkeleton } from "@/components/customer/about-us/team-section";
import { getAssetUrl } from "@/lib/utils/asset-version";

export const metadata: Metadata = {
  title: "Our Trustees | Samartha Trust",
  description:
    "Meet the trustees and leaders guiding Samartha Trust's mission and community initiatives.",
};

export default function OurTrusteesPage() {
  const heroImageSrc = getAssetUrl("/images/about/Joyful-Inclusive.png");

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-[#FDF8FF]/60 to-white">
      <div
        aria-hidden="true"
        className="about-page-grid pointer-events-none absolute inset-0 opacity-25"
      />
      <TrusteesHero heroImageSrc={heroImageSrc} />

      <React.Suspense fallback={<TeamSectionSkeleton />}>
        <TrusteesDirectory />
      </React.Suspense>
    </main>
  );
}
