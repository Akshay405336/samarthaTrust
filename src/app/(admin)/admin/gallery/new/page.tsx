import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { GalleryForm } from "@/components/admin/gallery-form";

export const metadata: Metadata = {
  title: "Add Gallery Photo | Samartha Trust Admin",
};

export default function NewGalleryPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Gallery", href: "/admin/gallery" },
          { label: "Add photo" },
        ]}
      />
      <GalleryForm mode="create" />
    </div>
  );
}
