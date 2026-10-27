import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { GalleryForm } from "@/components/admin/gallery-form";
import { getGalleryPhotoById } from "@/lib/gallery/gallery-service";

export const instant = false;

interface EditGalleryPageProps {
  params: Promise<{ id: string }>;
}

const getCachedPhoto = cache(async (id: string) => getGalleryPhotoById(id));

export async function generateMetadata({
  params,
}: EditGalleryPageProps): Promise<Metadata> {
  const { id } = await params;
  const photo = await getCachedPhoto(id);
  return {
    title: photo
      ? `Edit "${photo.altText}" | Gallery Admin`
      : "Edit gallery photo",
  };
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
  const { id } = await params;
  const photo = await getCachedPhoto(id);

  if (!photo) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Gallery", href: "/admin/gallery" },
          { label: photo.altText },
        ]}
      />
      <GalleryForm
        mode="edit"
        initialData={{
          id: photo.id,
          url: photo.url,
          altText: photo.altText,
          linkUrl: photo.linkUrl,
          displayOrder: photo.displayOrder,
          status: photo.status,
          fileSize: photo.fileSize,
          mimeType: photo.mimeType,
          width: photo.width,
          height: photo.height,
        }}
      />
    </div>
  );
}
