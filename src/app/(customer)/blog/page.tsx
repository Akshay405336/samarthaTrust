import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogHero } from "@/components/customer/blog/blog-hero";
import { BlogList } from "@/components/customer/blog/blog-list";
import { BlogListSkeleton } from "@/components/customer/blog/blog-list-skeleton";

export const metadata: Metadata = {
  title: "Blog & Field Reports | Samartha Trust",
  description:
    "Read community impact stories, field reports, and updates from Samartha Trust's education, healthcare, and welfare initiatives.",
};

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#FDF8FF] via-[#FAF5FF] to-[#FCE7F3]/35">
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-45"
      />
      <BlogHero />

      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
