import { z } from "zod";
import { generateSlug } from "@/lib/validations/blog";

export { generateSlug };

export const WorkStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export type WorkStatusType = z.infer<typeof WorkStatusEnum>;

export const createWorkSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be under 200 characters"),
  slug: z
    .string()
    .max(200, "Slug must be under 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase alphanumeric characters separated by single hyphens"
    )
    .optional()
    .or(z.literal("")),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(100, "Category must be under 100 characters")
    .default("Community Welfare"),
  badge: z
    .string()
    .max(100, "Badge must be under 100 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  shortDescription: z
    .string()
    .max(500, "Short description must be under 500 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  description: z.string().min(10, "Description must be at least 10 characters"),
  beneficiaries: z
    .string()
    .max(250, "Target beneficiaries must be under 250 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  features: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (Array.isArray(val)) {
        return val.map((item) => item.trim()).filter(Boolean);
      }
      if (typeof val === "string") {
        return val
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return [];
    }),
  programStatus: z
    .string()
    .max(100, "Program status must be under 100 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) =>
      val && val.trim() !== "" ? val.trim() : "Active & Ongoing"
    ),
  ctaText: z
    .string()
    .max(100, "CTA button text must be under 100 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) =>
      val && val.trim() !== "" ? val.trim() : "Support This Work"
    ),
  ctaLink: z
    .string()
    .max(300, "CTA destination URL must be under 300 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : "/contact")),
  featuredImage: z
    .string()
    .max(1000, "Image path or URL must be under 1000 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  iconName: z
    .string()
    .max(100, "Icon name must be under 100 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) =>
      val && val.trim() !== "" ? val.trim() : "GraduationCap"
    ),
  displayOrder: z.coerce
    .number()
    .int("Display order must be an integer")
    .min(0, "Display order must be at least 0")
    .default(0),
  status: WorkStatusEnum.default("DRAFT"),
  isFeatured: z.boolean().default(false),
  publishedAt: z
    .union([z.string(), z.date()])
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      if (val instanceof Date) return val;
      if (typeof val === "string" && val.trim() !== "") {
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
    }),
  metaTitle: z
    .string()
    .max(160, "Meta title must be under 160 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  metaDescription: z
    .string()
    .max(300, "Meta description must be under 300 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
});

export const updateWorkSchema = createWorkSchema.partial().extend({
  id: z.string().optional(),
});

export const workQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z.union([WorkStatusEnum, z.literal("ALL")]).optional(),
  category: z.string().optional(),
  featured: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
  sort: z
    .enum(["newest", "oldest", "title", "order_asc", "order_desc"])
    .default("order_asc"),
});

export const publicWorkQuerySchema = z.object({
  category: z.string().optional(),
  featured: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export type CreateWorkInput = z.infer<typeof createWorkSchema>;
export type CreateWorkInputData = z.input<typeof createWorkSchema>;
export type UpdateWorkInput = z.infer<typeof updateWorkSchema>;
export type UpdateWorkInputData = z.input<typeof updateWorkSchema>;
export type WorkQueryParams = z.infer<typeof workQuerySchema>;
export type PublicWorkQueryParams = z.infer<typeof publicWorkQuerySchema>;

export interface WorkPublicItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  badge?: string | null;
  shortDescription?: string | null;
  description: string;
  beneficiaries?: string | null;
  features: string[];
  programStatus?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  featuredImage?: string | null;
  iconName?: string | null;
  displayOrder: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | string;
  isFeatured: boolean;
  publishedAt?: Date | string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type Work = WorkPublicItem;
