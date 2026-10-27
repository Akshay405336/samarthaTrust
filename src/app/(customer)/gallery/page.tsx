import type { Metadata } from "next";
import * as React from "react";
import { GalleryHero } from "@/components/customer/gallery/gallery-hero";
import { GalleryGrid } from "@/components/customer/gallery/gallery-grid";
import { GallerySkeleton } from "@/components/customer/gallery/gallery-skeleton";
import { listPublishedGalleryPhotosPaginated } from "@/lib/gallery/gallery-service";

export const instant = false;

export const metadata: Metadata = {
  title: "Photo Gallery | Samartha Trust",
  description:
    "Photos from Samartha Trust programs — education, healthcare, livelihood, and community outreach.",
  openGraph: {
    title: "Photo Gallery | Samartha Trust",
    description:
      "Photos from Samartha Trust programs — education, healthcare, livelihood, and community outreach.",
    type: "website",
  },
};

interface GalleryPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

async function GalleryDirectory({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
  const search = params.search;

  const result = await listPublishedGalleryPhotosPaginated({
    page,
    limit: 24,
    search,
  });

  return (
    <GalleryGrid
      photos={result.data}
      search={search}
      pagination={result.pagination}
    />
  );
}

export default function GalleryPage({ searchParams }: GalleryPageProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#FDF8FF] via-[#FAF5FF] to-[#FCE7F3]/35">
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-45"
      />
      <GalleryHero />
      <React.Suspense fallback={<GallerySkeleton />}>
        <GalleryDirectory searchParams={searchParams} />
      </React.Suspense>
    </main>
  );
}
