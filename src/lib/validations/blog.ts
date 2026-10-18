import { z } from "zod";

export const BlogStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export type BlogStatusType = z.infer<typeof BlogStatusEnum>;

/**
 * Normalizes a text string into a clean, URL-friendly slug.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

/**
 * Calculates estimated reading time in minutes based on ~200 words per minute.
 */
export function calculateReadTime(content: string): string {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
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
  excerpt: z
    .string()
    .max(600, "Excerpt must be under 600 characters")
    .optional()
    .nullable()
    .transform((val) => val || null),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z
    .string()
    .max(1000, "Image URL must be under 1000 characters")
    .optional()
    .nullable()
    .transform((val) => val || null),
  authorName: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(100, "Author name must be under 100 characters")
    .default("Samartha Team"),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(100, "Category must be under 100 characters")
    .default("Community Welfare"),
  tags: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (Array.isArray(val)) {
        return val.map((t) => t.trim()).filter(Boolean);
      }
      if (typeof val === "string") {
        return val
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      return [];
    }),
  status: BlogStatusEnum.default("DRAFT"),
  isFeatured: z.boolean().default(false),
  publishedAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val ? new Date(val) : null)),
  metaTitle: z
    .string()
    .max(160, "Meta title must be under 160 characters")
    .optional()
    .nullable()
    .transform((val) => val || null),
  metaDescription: z
    .string()
    .max(300, "Meta description must be under 300 characters")
    .optional()
    .nullable()
    .transform((val) => val || null),
});

export const updateBlogSchema = createBlogSchema.partial().extend({
  id: z.string().optional(),
});

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z.union([BlogStatusEnum, z.literal("ALL")]).optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  featured: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
  sort: z.enum(["newest", "oldest", "title", "published"]).default("newest"),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type CreateBlogInputData = z.input<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type UpdateBlogInputData = z.input<typeof updateBlogSchema>;
export type BlogQueryParams = z.infer<typeof blogQuerySchema>;

// Backward compatibility alias
export const blogPostSchema = createBlogSchema;
export type BlogPostInput = CreateBlogInput;
