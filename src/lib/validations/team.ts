import { z } from "zod";
import { generateSlug } from "@/lib/validations/blog";

export { generateSlug };

const optionalUrl = z
  .string()
  .max(1000, "URL must be under 1000 characters")
  .optional()
  .nullable()
  .or(z.literal(""))
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL starting with http:// or https://" }
  )
  .transform((val) => (val && val.trim() !== "" ? val.trim() : null));

const optionalEmail = z
  .string()
  .max(254, "Email must be under 254 characters")
  .optional()
  .nullable()
  .or(z.literal(""))
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },
    { message: "Must be a valid email address" }
  )
  .transform((val) => (val && val.trim() !== "" ? val.trim() : null));

const optionalPhone = z
  .string()
  .max(30, "Phone number must be under 30 characters")
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((val) => (val && val.trim() !== "" ? val.trim() : null));

/**
 * Validates whether a string is a valid absolute HTTP or HTTPS URL.
 * Rejects local paths such as /uploads/team/... or relative paths.
 */
export function isAbsoluteHttpUrl(val: string): boolean {
  if (!val || typeof val !== "string" || val.trim() === "") return false;
  try {
    const parsed = new URL(val.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const optionalProfileImage = z
  .string()
  .max(1000, "Profile image URL must be under 1000 characters")
  .optional()
  .nullable()
  .or(z.literal(""))
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      const trimmed = val.trim();
      // Allow local paths starting with /
      if (trimmed.startsWith("/")) {
        return true;
      }
      // If external, must be valid http or https URL
      return isAbsoluteHttpUrl(trimmed);
    },
    {
      message:
        "Profile image must be a local path (/images/profiles/...) or a valid absolute HTTP/HTTPS URL",
    }
  )
  .transform((val) => (val && val.trim() !== "" ? val.trim() : null));

export const createTeamMemberSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be under 120 characters"),
  slug: z
    .string()
    .max(150, "Slug must be under 150 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase alphanumeric characters separated by single hyphens"
    )
    .optional()
    .or(z.literal("")),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(120, "Designation must be under 120 characters"),
  profileImage: optionalProfileImage,
  bio: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  shortBio: z
    .string()
    .max(500, "Short bio must be under 500 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  email: optionalEmail,
  phone: optionalPhone,
  linkedinUrl: optionalUrl,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  websiteUrl: optionalUrl,
  displayOrder: z.coerce.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateTeamMemberSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be under 120 characters")
    .optional(),
  slug: z
    .string()
    .max(150, "Slug must be under 150 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase alphanumeric characters separated by single hyphens"
    )
    .optional()
    .or(z.literal("")),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(120, "Designation must be under 120 characters")
    .optional(),
  profileImage: optionalProfileImage,
  bio: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  shortBio: z
    .string()
    .max(500, "Short bio must be under 500 characters")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  email: optionalEmail,
  phone: optionalPhone,
  linkedinUrl: optionalUrl,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  websiteUrl: optionalUrl,
  displayOrder: z.coerce.number().int().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const teamQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["ALL", "ACTIVE", "INACTIVE"]).default("ALL"),
  featured: z.enum(["ALL", "true", "false"]).default("ALL"),
  sort: z
    .enum([
      "order_asc",
      "order_desc",
      "name_asc",
      "name_desc",
      "newest",
      "oldest",
    ])
    .default("order_asc"),
});

export const publicTeamQuerySchema = z.object({
  featured: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type CreateTeamMemberInput = z.input<typeof createTeamMemberSchema>;
export type CreateTeamMemberInputData = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.input<typeof updateTeamMemberSchema>;
export type UpdateTeamMemberInputData = z.infer<typeof updateTeamMemberSchema>;
export type TeamQueryParams = z.infer<typeof teamQuerySchema>;
export type PublicTeamQueryParams = z.infer<typeof publicTeamQuerySchema>;
