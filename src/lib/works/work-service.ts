import { prisma } from "@/lib/db/prisma";
import { WorkStatus, type Work, type Prisma } from "@prisma/client";

export type { Work };
export { WorkStatus };
import {
  generateSlug,
  createWorkSchema,
  updateWorkSchema,
  type CreateWorkInput,
  type CreateWorkInputData,
  type UpdateWorkInput,
  type UpdateWorkInputData,
  type WorkQueryParams,
} from "@/lib/validations/work";

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
 * Ensures a unique slug for a work by appending an incremental counter if collision occurs.
 */
export async function ensureUniqueWorkSlug(
  baseTitleOrSlug: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(baseTitleOrSlug) || "work";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.work.findFirst({
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
 * Creates a new work in the database.
 */
export async function createWork(
  rawInput: CreateWorkInput | CreateWorkInputData
): Promise<Work> {
  const input = createWorkSchema.parse(rawInput);
  const slug = input.slug
    ? await ensureUniqueWorkSlug(input.slug)
    : await ensureUniqueWorkSlug(input.title);

  const status = input.status || WorkStatus.DRAFT;
  let publishedAt: Date | null = null;

  if (status === WorkStatus.PUBLISHED) {
    publishedAt = input.publishedAt || new Date();
  }

  // If display order is not specified or 0, place at end
  let displayOrder = input.displayOrder ?? 0;
  if (!displayOrder || displayOrder === 0) {
    const maxOrderWork = await prisma.work.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    displayOrder = (maxOrderWork?.displayOrder ?? 0) + 1;
  }

  return prisma.work.create({
    data: {
      title: input.title,
      slug,
      category: input.category || "Community Welfare",
      badge: input.badge,
      shortDescription: input.shortDescription,
      description: input.description,
      beneficiaries: input.beneficiaries,
      features: input.features || [],
      programStatus: input.programStatus || "Active & Ongoing",
      ctaText: input.ctaText || "Support This Work",
      ctaLink: input.ctaLink || "/contact",
      featuredImage: input.featuredImage,
      iconName: input.iconName || "GraduationCap",
      displayOrder,
      status,
      isFeatured: input.isFeatured ?? false,
      publishedAt,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
    },
  });
}

/**
 * Updates an existing work record.
 */
export async function updateWork(
  id: string,
  rawInput: UpdateWorkInput | UpdateWorkInputData
): Promise<Work> {
  const existing = await prisma.work.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Work with ID "${id}" not found.`);
  }

  const input = updateWorkSchema.parse(rawInput);

  let slug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    slug = await ensureUniqueWorkSlug(input.slug, id);
  }

  let status = existing.status;
  if (input.status && input.status !== existing.status) {
    status = input.status as WorkStatus;
  }

  let publishedAt = existing.publishedAt;
  if (status === WorkStatus.PUBLISHED && !existing.publishedAt) {
    publishedAt = input.publishedAt || new Date();
  } else if (input.publishedAt !== undefined) {
    publishedAt = input.publishedAt;
  }

  return prisma.work.update({
    where: { id },
    data: {
      ...(input.title ? { title: input.title } : {}),
      slug,
      ...(input.category ? { category: input.category } : {}),
      ...(input.badge !== undefined ? { badge: input.badge } : {}),
      ...(input.shortDescription !== undefined
        ? { shortDescription: input.shortDescription }
        : {}),
      ...(input.description ? { description: input.description } : {}),
      ...(input.beneficiaries !== undefined
        ? { beneficiaries: input.beneficiaries }
        : {}),
      ...(input.features !== undefined ? { features: input.features } : {}),
      ...(input.programStatus !== undefined
        ? { programStatus: input.programStatus }
        : {}),
      ...(input.ctaText !== undefined ? { ctaText: input.ctaText } : {}),
      ...(input.ctaLink !== undefined ? { ctaLink: input.ctaLink } : {}),
      ...(input.featuredImage !== undefined
        ? { featuredImage: input.featuredImage }
        : {}),
      ...(input.iconName !== undefined ? { iconName: input.iconName } : {}),
      ...(input.displayOrder !== undefined
        ? { displayOrder: input.displayOrder }
        : {}),
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
 * Deletes a work by its ID.
 */
export async function deleteWork(id: string): Promise<Work> {
  const existing = await prisma.work.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Work with ID "${id}" not found.`);
  }

  return prisma.work.delete({
    where: { id },
  });
}

/**
 * Retrieves a work by its unique ID.
 */
export async function getWorkById(id: string): Promise<Work | null> {
  return prisma.work.findUnique({
    where: { id },
  });
}

/**
 * Retrieves a work by its slug.
 */
export async function getWorkBySlug(slug: string): Promise<Work | null> {
  return prisma.work.findUnique({
    where: { slug },
  });
}

/**
 * Lists works with pagination, search, and filtering for the admin management console.
 */
export async function listAdminWorks(
  query: Partial<WorkQueryParams> = {}
): Promise<PaginatedResult<Work>> {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    category,
    featured,
    sort = "order_asc",
  } = query;

  const where: Prisma.WorkWhereInput = {};

  if (search && search.trim() !== "") {
    const s = search.trim();
    where.OR = [
      { title: { contains: s, mode: "insensitive" } },
      { description: { contains: s, mode: "insensitive" } },
      { badge: { contains: s, mode: "insensitive" } },
      { category: { contains: s, mode: "insensitive" } },
      { beneficiaries: { contains: s, mode: "insensitive" } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status as WorkStatus;
  }

  if (category && category !== "ALL") {
    where.category = { equals: category, mode: "insensitive" };
  }

  if (featured !== undefined) {
    where.isFeatured = featured;
  }

  let orderBy: Prisma.WorkOrderByWithRelationInput[] = [
    { displayOrder: "asc" },
  ];
  switch (sort) {
    case "order_asc":
      orderBy = [{ displayOrder: "asc" }, { createdAt: "desc" }];
      break;
    case "order_desc":
      orderBy = [{ displayOrder: "desc" }, { createdAt: "desc" }];
      break;
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    case "oldest":
      orderBy = [{ createdAt: "asc" }];
      break;
    case "title":
      orderBy = [{ title: "asc" }];
      break;
  }

  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

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
 * Lists all published works for customer-facing display.
 */
export async function listPublishedWorks(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Work[]> {
  const where: Prisma.WorkWhereInput = {
    status: WorkStatus.PUBLISHED,
  };

  if (options?.category && options.category !== "ALL") {
    where.category = { equals: options.category, mode: "insensitive" };
  }

  if (options?.featured !== undefined) {
    where.isFeatured = options.featured;
  }

  return prisma.work.findMany({
    where,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    ...(options?.limit ? { take: options.limit } : {}),
  });
}

/**
 * Lists published works with database-level pagination, search, and category filter for customer-facing display.
 */
export async function listPublishedWorksPaginated(options?: {
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResult<Work>> {
  const page = Math.max(1, options?.page || 1);
  const limit = Math.max(1, options?.limit || 9);
  const skip = (page - 1) * limit;

  const where: Prisma.WorkWhereInput = {
    status: WorkStatus.PUBLISHED,
  };

  if (options?.category && options.category !== "ALL") {
    where.category = { equals: options.category, mode: "insensitive" };
  }

  if (options?.featured !== undefined) {
    where.isFeatured = options.featured;
  }

  if (options?.search?.trim()) {
    const q = options.search.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { badge: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, data] = await Promise.all([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
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
 * Publishes a work.
 */
export async function publishWork(id: string): Promise<Work> {
  const existing = await prisma.work.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Work with ID "${id}" not found.`);
  }

  return prisma.work.update({
    where: { id },
    data: {
      status: WorkStatus.PUBLISHED,
      publishedAt: existing.publishedAt || new Date(),
    },
  });
}

/**
 * Unpublishes a work (reverts to DRAFT).
 */
export async function unpublishWork(id: string): Promise<Work> {
  const existing = await prisma.work.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Work with ID "${id}" not found.`);
  }

  return prisma.work.update({
    where: { id },
    data: {
      status: WorkStatus.DRAFT,
    },
  });
}

/**
 * Toggles the featured state of a work.
 */
export async function toggleFeaturedWork(id: string): Promise<Work> {
  const existing = await prisma.work.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Work with ID "${id}" not found.`);
  }

  return prisma.work.update({
    where: { id },
    data: {
      isFeatured: !existing.isFeatured,
    },
  });
}

/**
 * Updates display order for a single work.
 */
export async function updateSingleWorkOrder(
  id: string,
  displayOrder: number
): Promise<Work> {
  const existing = await prisma.work.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Work with ID "${id}" not found.`);
  }

  return prisma.work.update({
    where: { id },
    data: { displayOrder },
  });
}

/**
 * Updates display orders in bulk.
 */
export async function updateWorkOrder(
  items: { id: string; displayOrder: number }[]
): Promise<void> {
  await prisma.$transaction(
    items.map((item) =>
      prisma.work.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    )
  );
}

/**
 * Gets unique categories currently in use.
 */
export async function getWorkCategories(): Promise<string[]> {
  const records = await prisma.work.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  return records
    .map((r) => r.category)
    .filter(Boolean)
    .sort();
}
