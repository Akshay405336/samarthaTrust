import { prisma } from "@/lib/db/prisma";
import { BlogStatus, type Blog, type Prisma } from "@prisma/client";
import {
  generateSlug,
  createBlogSchema,
  updateBlogSchema,
  type CreateBlogInput,
  type CreateBlogInputData,
  type UpdateBlogInput,
  type UpdateBlogInputData,
  type BlogQueryParams,
} from "@/lib/validations/blog";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Ensures a unique slug by appending an incremental counter if a collision occurs.
 */
export async function ensureUniqueSlug(
  baseTitleOrSlug: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(baseTitleOrSlug) || "story";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blog.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Creates a new blog post in the database.
 */
export async function createBlog(
  rawInput: CreateBlogInput | CreateBlogInputData,
  authorId?: string | null
): Promise<Blog> {
  const input = createBlogSchema.parse(rawInput);
  const slug = input.slug
    ? await ensureUniqueSlug(input.slug)
    : await ensureUniqueSlug(input.title);

  const status = input.status || BlogStatus.DRAFT;
  let publishedAt: Date | null = null;

  if (status === BlogStatus.PUBLISHED) {
    publishedAt = input.publishedAt || new Date();
  }

  return prisma.blog.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage,
      authorName: input.authorName || "Samartha Team",
      authorId: authorId || null,
      category: input.category || "General",
      tags: input.tags || [],
      status,
      isFeatured: input.isFeatured ?? false,
      publishedAt,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
    },
  });
}

/**
 * Updates an existing blog post.
 */
export async function updateBlog(
  id: string,
  rawInput: UpdateBlogInput | UpdateBlogInputData
): Promise<Blog> {
  const existing = await prisma.blog.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Blog with ID "${id}" not found.`);
  }

  const input = updateBlogSchema.parse(rawInput);

  let slug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    slug = await ensureUniqueSlug(input.slug, id);
  } else if (input.title && !input.slug && input.title !== existing.title) {
    // If title changed and slug wasn't explicitly supplied, preserve existing slug
    // to avoid breaking existing links unless administrator manually changed slug.
    slug = existing.slug;
  }

  let status = existing.status;
  if (input.status && input.status !== existing.status) {
    status = input.status as BlogStatus;
  }

  let publishedAt = existing.publishedAt;
  if (status === BlogStatus.PUBLISHED && !existing.publishedAt) {
    publishedAt = input.publishedAt || new Date();
  } else if (input.publishedAt !== undefined) {
    publishedAt = input.publishedAt;
  }

  return prisma.blog.update({
    where: { id },
    data: {
      ...(input.title ? { title: input.title } : {}),
      slug,
      ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
      ...(input.content ? { content: input.content } : {}),
      ...(input.coverImage !== undefined
        ? { coverImage: input.coverImage }
        : {}),
      ...(input.authorName ? { authorName: input.authorName } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      status,
      ...(input.isFeatured !== undefined
        ? { isFeatured: input.isFeatured }
        : {}),
      publishedAt,
      ...(input.metaTitle !== undefined ? { metaTitle: input.metaTitle } : {}),
      ...(input.metaDescription !== undefined
        ? { metaDescription: input.metaDescription }
        : {}),
    },
  });
}

/**
 * Retrieves a blog post by its primary ID.
 */
export async function getBlogById(id: string): Promise<Blog | null> {
  return prisma.blog.findUnique({
    where: { id },
  });
}

/**
 * Retrieves a blog post by its unique slug.
 * If publicOnly is true, only returns if status is PUBLISHED.
 */
export async function getBlogBySlug(
  slug: string,
  publicOnly = false
): Promise<Blog | null> {
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog) return null;
  if (publicOnly && blog.status !== BlogStatus.PUBLISHED) {
    return null;
  }

  return blog;
}

/**
 * Deletes a blog post by ID.
 */
export async function deleteBlog(id: string): Promise<Blog> {
  const existing = await prisma.blog.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Blog with ID "${id}" not found.`);
  }

  return prisma.blog.delete({
    where: { id },
  });
}

/**
 * Publishes a blog post.
 */
export async function publishBlog(id: string): Promise<Blog> {
  return prisma.blog.update({
    where: { id },
    data: {
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });
}

/**
 * Unpublishes a published blog post back to DRAFT.
 */
export async function unpublishBlog(id: string): Promise<Blog> {
  return prisma.blog.update({
    where: { id },
    data: {
      status: BlogStatus.DRAFT,
      publishedAt: null,
    },
  });
}

/**
 * Archives a blog post.
 */
export async function archiveBlog(id: string): Promise<Blog> {
  return prisma.blog.update({
    where: { id },
    data: {
      status: BlogStatus.ARCHIVED,
    },
  });
}

/**
 * Toggles a blog's featured status.
 */
export async function toggleFeatureBlog(
  id: string,
  isFeatured?: boolean
): Promise<Blog> {
  const current = await prisma.blog.findUnique({
    where: { id },
    select: { isFeatured: true },
  });

  if (!current) {
    throw new Error(`Blog with ID "${id}" not found.`);
  }

  const nextFeatured =
    isFeatured !== undefined ? isFeatured : !current.isFeatured;

  return prisma.blog.update({
    where: { id },
    data: {
      isFeatured: nextFeatured,
    },
  });
}

/**
 * Lists blogs with filtering, search, sorting, and pagination.
 * Used by admin management interface.
 */
export async function listBlogs(
  params?: Partial<BlogQueryParams>
): Promise<PaginatedResult<Blog>> {
  const page = Math.max(1, params?.page || 1);
  const limit = Math.max(1, params?.limit || 10);
  const { search, status, category, tag, featured, sort } = params || {};

  const where: Prisma.BlogWhereInput = {};

  if (status && status !== "ALL") {
    where.status = status as BlogStatus;
  }

  if (category && category !== "ALL") {
    where.category = { equals: category, mode: "insensitive" };
  }

  if (tag) {
    where.tags = { has: tag };
  }

  if (featured !== undefined) {
    where.isFeatured = featured;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { authorName: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.BlogOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "title") {
    orderBy = { title: "asc" };
  } else if (sort === "published") {
    orderBy = { publishedAt: "desc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Lists published blogs for public pages.
 * Strictly guarantees that non-published posts are never exposed.
 */
export async function listPublishedBlogs(
  params?: Partial<Omit<BlogQueryParams, "status">>
): Promise<PaginatedResult<Blog>> {
  return listBlogs({
    ...params,
    status: BlogStatus.PUBLISHED,
  });
}

/**
 * Returns distinct categories of all published blogs.
 */
export async function getBlogCategories(): Promise<string[]> {
  const blogs = await prisma.blog.findMany({
    where: { status: BlogStatus.PUBLISHED },
    select: { category: true },
    distinct: ["category"],
  });

  return blogs.map((b) => b.category).filter(Boolean);
}
