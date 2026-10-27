import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { calculateReadTime } from "@/lib/validations/blog";
import {
  BlogListClient,
  type BlogListItem,
} from "@/components/customer/blog/blog-list-client";

interface BlogListProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

function formatDate(date: Date | null) {
  if (!date) return "Recently published";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toListItem(blog: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string;
  authorName: string;
  isFeatured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
}): BlogListItem {
  const date = blog.publishedAt || blog.createdAt;
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    readTime: calculateReadTime(blog.content),
    coverImage: blog.coverImage,
    category: blog.category,
    authorName: blog.authorName,
    isFeatured: blog.isFeatured,
    dateLabel: formatDate(date),
  };
}

export async function BlogList({ searchParams }: BlogListProps) {
  const params = await searchParams;
  const currentCategory = params.category || "ALL";
  const search = params.search?.trim() || "";
  const requestedPage = Number.parseInt(params.page || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
  const limit = 9;

  const where: Prisma.BlogWhereInput = {
    status: "PUBLISHED",
  };

  if (currentCategory !== "ALL") {
    where.category = {
      equals: currentCategory,
      mode: "insensitive",
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, blogs, categories] = await Promise.all([
    prisma.blog.count({ where }),

    prisma.blog.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        category: true,
        authorName: true,
        isFeatured: true,
        publishedAt: true,
        createdAt: true,
      },
    }),

    prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
  ]);

  const distinctCategories = [
    "ALL",
    ...categories.map((category) => category.category).filter(Boolean),
  ];

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const featuredRaw = blogs.find((blog) => blog.isFeatured) || blogs[0];
  const showFeatured = Boolean(
    featuredRaw && !search && currentCategory === "ALL" && safePage === 1
  );

  const listItems = blogs.map(toListItem);
  const featuredBlog = featuredRaw ? toListItem(featuredRaw) : null;

  return (
    <BlogListClient
      blogs={listItems}
      featuredBlog={featuredBlog}
      showFeatured={showFeatured}
      total={total}
      currentCategory={currentCategory}
      search={search}
      distinctCategories={distinctCategories}
      totalPages={totalPages}
      safePage={safePage}
    />
  );
}
