import { z } from "zod";

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be under 200 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200, "Slug must be under 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  excerpt: z
    .string()
    .max(500, "Excerpt must be under 500 characters")
    .optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional()
    .or(z.literal("")),
  published: z.boolean().default(false),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
