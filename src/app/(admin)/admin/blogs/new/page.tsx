import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata: Metadata = {
  title: "New Blog Article | Samartha Trust Admin",
};

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Blogs & Articles", href: "/admin/blogs" },
          { label: "New Article" },
        ]}
      />
      <BlogForm mode="create" />
    </div>
  );
}
