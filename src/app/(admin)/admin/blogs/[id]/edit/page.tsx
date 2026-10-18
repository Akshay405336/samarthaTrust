import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { BlogForm } from "@/components/admin/blog-form";
import { getBlogById } from "@/lib/blogs/blog-service";

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditBlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(id);
  return {
    title: blog ? `Edit "${blog.title}" | Admin` : "Edit Blog Article",
  };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Blogs & Articles", href: "/admin/blogs" },
          { label: `Edit: ${blog.title}` },
        ]}
      />
      <BlogForm
        mode="edit"
        initialData={{
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImage: blog.coverImage,
          authorName: blog.authorName,
          category: blog.category,
          tags: blog.tags,
          status: blog.status,
          isFeatured: blog.isFeatured,
          publishedAt: blog.publishedAt,
          metaTitle: blog.metaTitle,
          metaDescription: blog.metaDescription,
        }}
      />
    </div>
  );
}
