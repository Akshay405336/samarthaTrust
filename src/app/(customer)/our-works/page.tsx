import type { Metadata } from "next";
import * as React from "react";

import { OurWorksHero } from "@/components/customer/our-work/our-works-hero";
import {
  WorksList,
  WorksListSkeleton,
} from "@/components/customer/our-work/works-list";
import { WorksCollaboration } from "@/components/customer/our-work/works-collaboration";
import { listPublishedWorksPaginated } from "@/lib/works/work-service";

export const instant = false;

export const metadata: Metadata = {
  title: "Our Works | Samartha Trust",
  description:
    "Explore the grassroots social works, education programs, and healthcare initiatives conducted by Samartha Trust.",
};

interface OurWorksPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

async function OurWorksDirectory({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
  const category = params.category;
  const search = params.search;

  const result = await listPublishedWorksPaginated({
    page,
    limit: 9,
    category,
    search,
  });

  return (
    <WorksList
      works={result.data}
      pagination={result.pagination}
      currentCategory={category}
      search={search}
    />
  );
}

export default function OurWorksPage({ searchParams }: OurWorksPageProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#FDF8FF] via-[#FAF5FF] to-[#FCE7F3]/35">
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-50"
      />
      <OurWorksHero />
      <React.Suspense fallback={<WorksListSkeleton />}>
        <OurWorksDirectory searchParams={searchParams} />
      </React.Suspense>
      <WorksCollaboration />
    </main>
  );
}
