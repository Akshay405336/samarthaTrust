
import type { Metadata } from "next";
import * as React from "react";
import { TrusteesHero } from "@/components/customer/our-trustee/trustees-hero";
import { TrusteesDirectory } from "@/components/customer/our-trustee/trustees-directory";
import { TeamSectionSkeleton } from "@/components/customer/about-us/team-section";

export const metadata: Metadata = {
  title: "Our Trustees | Samartha Trust",
  description:
    "Meet the trustees and leaders guiding Samartha Trust's mission and community initiatives.",
};

export default function OurTrusteesPage() {
  return (
    <main className="min-h-screen bg-white">
      <TrusteesHero />

      <React.Suspense fallback={<TeamSectionSkeleton />}>
        <TrusteesDirectory />
      </React.Suspense>
    </main>
  );
}
