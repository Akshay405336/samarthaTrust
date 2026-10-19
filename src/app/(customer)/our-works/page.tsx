import type { Metadata } from "next";
import * as React from "react";

import { OurWorksHero } from "@/components/customer/our-work/our-works-hero";
import {
  WorksList,
  WorksListSkeleton,
} from "@/components/customer/our-work/works-list";
import { WorksCollaboration } from "@/components/customer/our-work/works-collaboration";
import { listPublishedWorks } from "@/lib/works/work-service";

export const instant = false;

export const metadata: Metadata = {
  title: "Our Works | Samartha Trust",
  description:
    "Explore the grassroots social works, education programs, and healthcare initiatives conducted by Samartha Trust.",
};

async function OurWorksDirectory() {
  const works = await listPublishedWorks();
  return <WorksList works={works} />;
}

export default function OurWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <OurWorksHero />
      <React.Suspense fallback={<WorksListSkeleton />}>
        <OurWorksDirectory />
      </React.Suspense>
      <WorksCollaboration />
    </main>
  );
}
