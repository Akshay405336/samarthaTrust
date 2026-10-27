import { z } from "zod";

export const GalleryStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export type GalleryStatusType = z.infer<typeof GalleryStatusEnum>;

const optionalUrl = z
  .string()
  .max(2000, "Link URL is too long")
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((val) => {
    if (!val || typeof val !== "string" || val.trim() === "") return null;
    const trimmed = val.trim();
    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) return null;
      return trimmed;
    } catch {
      return null;
    }
  });

export const galleryPhotoBaseSchema = z.object({
  url: z.string().min(1, "Image URL is required").max(1000),
  altText: z
    .string()
    .min(1, "Alt text / name is required")
    .max(200, "Alt text must be under 200 characters"),
  linkUrl: optionalUrl,
  displayOrder: z.coerce.number().int().default(0),
  status: GalleryStatusEnum,
  fileSize: z.coerce.number().int().positive().optional().nullable(),
  mimeType: z.string().max(100).optional().nullable(),
  width: z.coerce.number().int().positive().optional().nullable(),
  height: z.coerce.number().int().positive().optional().nullable(),
});

export const createGalleryPhotoSchema = galleryPhotoBaseSchema.extend({
  status: GalleryStatusEnum.default("DRAFT"),
  displayOrder: z.coerce.number().int().default(0),
});

export type CreateGalleryPhotoInput = z.infer<typeof createGalleryPhotoSchema>;
export type CreateGalleryPhotoInputData = z.input<typeof createGalleryPhotoSchema>;

export const updateGalleryPhotoSchema = galleryPhotoBaseSchema.partial().extend({
  id: z.string().optional(),
});

export type UpdateGalleryPhotoInput = z.infer<typeof updateGalleryPhotoSchema>;
export type UpdateGalleryPhotoInputData = z.input<typeof updateGalleryPhotoSchema>;

export const galleryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["ALL", "DRAFT", "PUBLISHED", "ARCHIVED"]).default("ALL"),
  sort: z
    .enum(["order_asc", "order_desc", "newest", "oldest"])
    .default("order_asc"),
});

export type GalleryQueryParams = z.infer<typeof galleryQuerySchema>;

export interface GalleryPublicPhoto {
  id: string;
  url: string;
  altText: string;
  linkUrl: string | null;
  displayOrder: number;
  width?: number | null;
  height?: number | null;
}
