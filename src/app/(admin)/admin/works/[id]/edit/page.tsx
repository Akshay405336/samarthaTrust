import * as React from "react";
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { WorkForm } from "@/components/admin/work-form";
import { getWorkById } from "@/lib/works/work-service";

export const instant = false;

interface EditWorkPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getCachedWork = cache(async (id: string) => {
  return getWorkById(id);
});

export async function generateMetadata({
  params,
}: EditWorkPageProps): Promise<Metadata> {
  const { id } = await params;
  const work = await getCachedWork(id);
  return {
    title: work
      ? `Edit "${work.title}" | Our Works Admin`
      : "Edit Work Initiative",
  };
}

export default async function EditWorkPage({ params }: EditWorkPageProps) {
  const { id } = await params;
  const work = await getCachedWork(id);

  if (!work) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Our Works", href: "/admin/works" },
          { label: `Edit: ${work.title}` },
        ]}
      />
      <WorkForm
        mode="edit"
        initialData={{
          id: work.id,
          title: work.title,
          slug: work.slug,
          category: work.category,
          badge: work.badge,
          shortDescription: work.shortDescription,
          description: work.description,
          beneficiaries: work.beneficiaries,
          features: work.features,
          programStatus: work.programStatus,
          ctaText: work.ctaText,
          ctaLink: work.ctaLink,
          featuredImage: work.featuredImage,
          iconName: work.iconName,
          displayOrder: work.displayOrder,
          status: work.status,
          isFeatured: work.isFeatured,
          publishedAt: work.publishedAt,
          metaTitle: work.metaTitle,
          metaDescription: work.metaDescription,
        }}
      />
    </div>
  );
}
