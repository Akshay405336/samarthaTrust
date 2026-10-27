import { prisma } from "@/lib/db/prisma";
import { GalleryStatus, type GalleryPhoto, type Prisma } from "@prisma/client";

export type { GalleryPhoto };
export { GalleryStatus };

import {
  createGalleryPhotoSchema,
  updateGalleryPhotoSchema,
  type CreateGalleryPhotoInput,
  type CreateGalleryPhotoInputData,
  type UpdateGalleryPhotoInput,
  type UpdateGalleryPhotoInputData,
  type GalleryQueryParams,
  type GalleryPublicPhoto,
} from "@/lib/validations/gallery";

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

/** Assign displayOrder 1, 2, 3… by current sort (order, then createdAt). */
export async function resequenceGalleryPhotos(): Promise<void> {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, displayOrder: true },
  });

  const updates = photos
    .map((photo, index) => ({
      id: photo.id,
      next: index + 1,
      current: photo.displayOrder,
    }))
    .filter((row) => row.current !== row.next);

  if (updates.length === 0) return;

  await prisma.$transaction(
    updates.map((row) =>
      prisma.galleryPhoto.update({
        where: { id: row.id },
        data: { displayOrder: row.next },
      })
    )
  );
}

/** Fix legacy migration orders (e.g. 3003) when they are not compact 1..n. */
async function ensureCompactDisplayOrders(): Promise<void> {
  const [count, agg] = await Promise.all([
    prisma.galleryPhoto.count(),
    prisma.galleryPhoto.aggregate({ _max: { displayOrder: true } }),
  ]);
  if (count === 0) return;
  const maxOrder = agg._max.displayOrder ?? 0;
  if (maxOrder !== count) {
    await resequenceGalleryPhotos();
  }
}

async function nextDisplayOrder(): Promise<number> {
  await ensureCompactDisplayOrders();
  const count = await prisma.galleryPhoto.count();
  return count + 1;
}

export async function createGalleryPhoto(
  rawInput: CreateGalleryPhotoInput | CreateGalleryPhotoInputData
): Promise<GalleryPhoto> {
  const input = createGalleryPhotoSchema.parse(rawInput);
  const status = input.status || GalleryStatus.DRAFT;
  let publishedAt: Date | null = null;
  if (status === GalleryStatus.PUBLISHED) {
    publishedAt = new Date();
  }

  let displayOrder = input.displayOrder ?? 0;
  if (!displayOrder || displayOrder === 0) {
    displayOrder = await nextDisplayOrder();
  }

  const photo = await prisma.galleryPhoto.create({
    data: {
      url: input.url,
      altText: input.altText.trim(),
      linkUrl: input.linkUrl ?? null,
      displayOrder,
      status,
      publishedAt,
      fileSize: input.fileSize ?? null,
      mimeType: input.mimeType ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
    },
  });

  if (!input.displayOrder || input.displayOrder === 0) {
    await resequenceGalleryPhotos();
    const refreshed = await prisma.galleryPhoto.findUnique({ where: { id: photo.id } });
    return refreshed ?? photo;
  }

  return photo;
}

export async function updateGalleryPhoto(
  id: string,
  rawInput: UpdateGalleryPhotoInput | UpdateGalleryPhotoInputData
): Promise<GalleryPhoto> {
  const existing = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Gallery photo with id "${id}" not found`);
  }

  const input = updateGalleryPhotoSchema.parse(rawInput);
  const status = input.status !== undefined ? input.status : existing.status;

  let publishedAt = existing.publishedAt;
  if (status === GalleryStatus.PUBLISHED && !existing.publishedAt) {
    publishedAt = new Date();
  } else if (status === GalleryStatus.DRAFT) {
    publishedAt = null;
  }

  let displayOrder =
    input.displayOrder !== undefined
      ? input.displayOrder
      : existing.displayOrder;
  if (displayOrder === 0) {
    displayOrder = await nextDisplayOrder();
  }

  const updated = await prisma.galleryPhoto.update({
    where: { id },
    data: {
      url: input.url !== undefined ? input.url : existing.url,
      altText:
        input.altText !== undefined ? input.altText.trim() : existing.altText,
      linkUrl: input.linkUrl !== undefined ? input.linkUrl : existing.linkUrl,
      displayOrder,
      status,
      publishedAt,
      fileSize: input.fileSize !== undefined ? input.fileSize : existing.fileSize,
      mimeType: input.mimeType !== undefined ? input.mimeType : existing.mimeType,
      width: input.width !== undefined ? input.width : existing.width,
      height: input.height !== undefined ? input.height : existing.height,
    },
  });

  if (
    input.displayOrder !== undefined &&
    input.displayOrder !== existing.displayOrder
  ) {
    await resequenceGalleryPhotos();
    const refreshed = await prisma.galleryPhoto.findUnique({ where: { id } });
    return refreshed ?? updated;
  }

  return updated;
}

export async function deleteGalleryPhoto(id: string): Promise<GalleryPhoto> {
  const deleted = await prisma.galleryPhoto.delete({ where: { id } });
  await resequenceGalleryPhotos();
  return deleted;
}

export async function getGalleryPhotoById(
  id: string
): Promise<GalleryPhoto | null> {
  return prisma.galleryPhoto.findUnique({ where: { id } });
}

export async function listAdminGalleryPhotos(
  params: GalleryQueryParams
): Promise<PaginatedResult<GalleryPhoto>> {
  await ensureCompactDisplayOrders();

  const { page, limit, search, status, sort } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.GalleryPhotoWhereInput = {};

  if (status && status !== "ALL") {
    where.status = status as GalleryStatus;
  }

  if (search && search.trim() !== "") {
    const query = search.trim();
    where.OR = [
      { altText: { contains: query, mode: "insensitive" } },
      { linkUrl: { contains: query, mode: "insensitive" } },
      { url: { contains: query, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.GalleryPhotoOrderByWithRelationInput = {
    displayOrder: "asc",
  };
  switch (sort) {
    case "order_desc":
      orderBy = { displayOrder: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { displayOrder: "asc" };
  }

  const [total, data] = await Promise.all([
    prisma.galleryPhoto.count({ where }),
    prisma.galleryPhoto.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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

export async function listPublishedGalleryPhotosPaginated(options: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResult<GalleryPublicPhoto>> {
  await ensureCompactDisplayOrders();

  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 24));
  const skip = (page - 1) * limit;

  const where: Prisma.GalleryPhotoWhereInput = {
    status: GalleryStatus.PUBLISHED,
  };

  if (options.search && options.search.trim() !== "") {
    const q = options.search.trim();
    where.OR = [
      { altText: { contains: q, mode: "insensitive" } },
      { linkUrl: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.galleryPhoto.count({ where }),
    prisma.galleryPhoto.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const data: GalleryPublicPhoto[] = items.map((item) => ({
    id: item.id,
    url: item.url,
    altText: item.altText,
    linkUrl: item.linkUrl,
    displayOrder: item.displayOrder,
    width: item.width,
    height: item.height,
  }));

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

export async function publishGalleryPhoto(id: string): Promise<GalleryPhoto> {
  return prisma.galleryPhoto.update({
    where: { id },
    data: {
      status: GalleryStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });
}

export async function unpublishGalleryPhoto(id: string): Promise<GalleryPhoto> {
  return prisma.galleryPhoto.update({
    where: { id },
    data: {
      status: GalleryStatus.DRAFT,
      publishedAt: null,
    },
  });
}

export async function updateGalleryPhotoOrder(
  id: string,
  displayOrder: number
): Promise<GalleryPhoto> {
  const updated = await prisma.galleryPhoto.update({
    where: { id },
    data: { displayOrder },
  });
  await resequenceGalleryPhotos();
  const refreshed = await prisma.galleryPhoto.findUnique({ where: { id } });
  return refreshed ?? updated;
}

export async function getGalleryAdminStats() {
  const [total, published, draft] = await Promise.all([
    prisma.galleryPhoto.count(),
    prisma.galleryPhoto.count({ where: { status: GalleryStatus.PUBLISHED } }),
    prisma.galleryPhoto.count({ where: { status: GalleryStatus.DRAFT } }),
  ]);

  return { total, published, draft };
}
