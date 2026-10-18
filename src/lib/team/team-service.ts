import { prisma } from "@/lib/db/prisma";
import type { TeamMember, Prisma } from "@prisma/client";
import {
  generateSlug,
  createTeamMemberSchema,
  updateTeamMemberSchema,
  type CreateTeamMemberInput,
  type CreateTeamMemberInputData,
  type UpdateTeamMemberInput,
  type UpdateTeamMemberInputData,
  type TeamQueryParams,
} from "@/lib/validations/team";

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
 * Ensures a unique slug for team members by appending an incrementing counter on collision.
 */
export async function ensureUniqueTeamSlug(
  baseNameOrSlug: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(baseNameOrSlug) || "member";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.teamMember.findFirst({
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
 * Creates a new team member.
 */
export async function createTeamMember(
  rawInput: CreateTeamMemberInput | CreateTeamMemberInputData
): Promise<TeamMember> {
  const input = createTeamMemberSchema.parse(rawInput);
  const slug = input.slug
    ? await ensureUniqueTeamSlug(input.slug)
    : await ensureUniqueTeamSlug(input.name);

  return prisma.teamMember.create({
    data: {
      name: input.name,
      slug,
      designation: input.designation,
      category: input.category || "Trustee",
      profileImage: input.profileImage || null,
      bio: input.bio || null,
      shortBio: input.shortBio || null,
      email: input.email || null,
      phone: input.phone || null,
      linkedinUrl: input.linkedinUrl || null,
      facebookUrl: input.facebookUrl || null,
      instagramUrl: input.instagramUrl || null,
      websiteUrl: input.websiteUrl || null,
      displayOrder: input.displayOrder ?? 0,
      isFeatured: input.isFeatured ?? false,
      isActive: input.isActive ?? true,
    },
  });
}

/**
 * Updates an existing team member.
 */
export async function updateTeamMember(
  id: string,
  rawInput: UpdateTeamMemberInput | UpdateTeamMemberInputData
): Promise<TeamMember> {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Team member with ID "${id}" was not found.`);
  }

  const input = updateTeamMemberSchema.parse(rawInput);

  let slug: string | undefined = undefined;
  if (input.slug && input.slug !== existing.slug) {
    slug = await ensureUniqueTeamSlug(input.slug, id);
  }

  return prisma.teamMember.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(input.designation !== undefined
        ? { designation: input.designation }
        : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.profileImage !== undefined
        ? { profileImage: input.profileImage }
        : {}),
      ...(input.bio !== undefined ? { bio: input.bio } : {}),
      ...(input.shortBio !== undefined ? { shortBio: input.shortBio } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.linkedinUrl !== undefined
        ? { linkedinUrl: input.linkedinUrl }
        : {}),
      ...(input.facebookUrl !== undefined
        ? { facebookUrl: input.facebookUrl }
        : {}),
      ...(input.instagramUrl !== undefined
        ? { instagramUrl: input.instagramUrl }
        : {}),
      ...(input.websiteUrl !== undefined
        ? { websiteUrl: input.websiteUrl }
        : {}),
      ...(input.displayOrder !== undefined
        ? { displayOrder: input.displayOrder }
        : {}),
      ...(input.isFeatured !== undefined
        ? { isFeatured: input.isFeatured }
        : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
  });
}

/**
 * Deletes a team member by ID.
 */
export async function deleteTeamMember(id: string): Promise<TeamMember> {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Team member with ID "${id}" was not found.`);
  }

  return prisma.teamMember.delete({ where: { id } });
}

/**
 * Gets a team member by ID.
 */
export async function getTeamMemberById(
  id: string
): Promise<TeamMember | null> {
  return prisma.teamMember.findUnique({ where: { id } });
}

/**
 * Gets a team member by unique slug.
 */
export async function getTeamMemberBySlug(
  slug: string,
  activeOnly = false
): Promise<TeamMember | null> {
  return prisma.teamMember.findFirst({
    where: {
      slug,
      ...(activeOnly ? { isActive: true } : {}),
    },
  });
}

/**
 * Lists team members for the admin dashboard with search, filtering, sorting, and pagination.
 */
export async function listAdminTeamMembers(
  params: TeamQueryParams
): Promise<PaginatedResult<TeamMember>> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 10));
  const skip = (page - 1) * limit;

  const where: Prisma.TeamMemberWhereInput = {};

  if (params.search?.trim()) {
    const q = params.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { designation: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { bio: { contains: q, mode: "insensitive" } },
    ];
  }

  if (params.category && params.category !== "ALL") {
    where.category = { equals: params.category, mode: "insensitive" };
  }

  if (params.status === "ACTIVE") {
    where.isActive = true;
  } else if (params.status === "INACTIVE") {
    where.isActive = false;
  }

  if (params.featured === "true") {
    where.isFeatured = true;
  } else if (params.featured === "false") {
    where.isFeatured = false;
  }

  let orderBy: Prisma.TeamMemberOrderByWithRelationInput[] = [
    { displayOrder: "asc" },
    { name: "asc" },
  ];

  switch (params.sort) {
    case "order_desc":
      orderBy = [{ displayOrder: "desc" }, { name: "asc" }];
      break;
    case "name_asc":
      orderBy = [{ name: "asc" }];
      break;
    case "name_desc":
      orderBy = [{ name: "desc" }];
      break;
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    case "oldest":
      orderBy = [{ createdAt: "asc" }];
      break;
    case "order_asc":
    default:
      orderBy = [{ displayOrder: "asc" }, { name: "asc" }];
      break;
  }

  const [total, data] = await Promise.all([
    prisma.teamMember.count({ where }),
    prisma.teamMember.findMany({
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
 * Lists active team members for public display.
 */
export async function listPublicTeamMembers(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}): Promise<TeamMember[]> {
  const where: Prisma.TeamMemberWhereInput = {
    isActive: true,
  };

  if (options?.category && options.category !== "ALL") {
    where.category = { equals: options.category, mode: "insensitive" };
  }

  if (typeof options?.featured === "boolean") {
    where.isFeatured = options.featured;
  }

  return prisma.teamMember.findMany({
    where,
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    ...(options?.limit ? { take: options.limit } : {}),
  });
}

/**
 * Toggles or sets active status for a team member.
 */
export async function toggleTeamMemberActive(
  id: string,
  isActive?: boolean
): Promise<TeamMember> {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Team member with ID "${id}" was not found.`);
  }

  const targetState =
    typeof isActive === "boolean" ? isActive : !existing.isActive;

  return prisma.teamMember.update({
    where: { id },
    data: { isActive: targetState },
  });
}

/**
 * Toggles or sets featured status for a team member.
 */
export async function toggleTeamMemberFeatured(
  id: string,
  isFeatured?: boolean
): Promise<TeamMember> {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Team member with ID "${id}" was not found.`);
  }

  const targetState =
    typeof isFeatured === "boolean" ? isFeatured : !existing.isFeatured;

  return prisma.teamMember.update({
    where: { id },
    data: { isFeatured: targetState },
  });
}

/**
 * Updates display order for a team member.
 */
export async function updateTeamMemberOrder(
  id: string,
  displayOrder: number
): Promise<TeamMember> {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Team member with ID "${id}" was not found.`);
  }

  return prisma.teamMember.update({
    where: { id },
    data: { displayOrder },
  });
}

/**
 * Fetches distinct categories used in the team members table.
 */
export async function getDistinctCategories(): Promise<string[]> {
  const records = await prisma.teamMember.findMany({
    distinct: ["category"],
    select: { category: true },
    where: { isActive: true },
    orderBy: { category: "asc" },
  });

  return records.map((r) => r.category).filter(Boolean);
}
