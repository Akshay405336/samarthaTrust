import * as React from "react";
import { BlogStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import {
  HomeBlogCarousel,
  type FormattedHomeBlogItem,
} from "@/components/customer/home-blog-carousel";

export async function HomeBlogSection() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: BlogStatus.PUBLISHED },
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        category: true,
        authorName: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    if (!blogs || blogs.length === 0) {
      return null;
    }

    const formattedBlogs: FormattedHomeBlogItem[] = blogs.map((blog) => {
      const date = blog.publishedAt
        ? new Date(blog.publishedAt)
        : new Date(blog.createdAt);
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = date.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      });

      return {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        coverImage: blog.coverImage,
        category: blog.category,
        authorName: blog.authorName,
        day,
        month,
      };
    });

    return <HomeBlogCarousel blogs={formattedBlogs} />;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_")
    ) {
      throw error;
    }
    console.error("Failed to load published blogs for home section:", error);
    return null;
  }
}
