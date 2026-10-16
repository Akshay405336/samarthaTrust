import { PrismaClient, Role } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db/prisma";
import { hashPassword } from "./password";

export interface SeedAdminConfig {
  email?: string | null;
  password?: string | null;
  name?: string | null;
  cleanupDuplicates?: boolean;
}

export interface SeedAdminResult {
  action: "created" | "updated";
  userId: string;
  email: string;
  role: string;
  message: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validates and synchronizes the single Super Admin account using configuration
 * from environment variables. Updates existing credentials, ensures idempotency,
 * revokes outdated sessions, and enforces data integrity inside a Prisma transaction.
 */
export async function synchronizeSuperAdmin(
  config: SeedAdminConfig,
  prismaClient: PrismaClient = defaultPrisma
): Promise<SeedAdminResult> {
  const rawEmail = config.email;
  const rawPassword = config.password;
  const rawName = config.name;

  // 1. Validate required email
  if (!rawEmail || typeof rawEmail !== "string" || !rawEmail.trim()) {
    throw new Error(
      "SEED ERROR: SUPER_ADMIN_EMAIL environment variable is missing or empty."
    );
  }

  const normalizedEmail = normalizeEmail(rawEmail);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error(
      `SEED ERROR: SUPER_ADMIN_EMAIL "${normalizedEmail}" is not a valid email address.`
    );
  }

  // 2. Validate required password (minimum 8 characters)
  if (
    !rawPassword ||
    typeof rawPassword !== "string" ||
    rawPassword.trim().length < 8
  ) {
    throw new Error(
      "SEED ERROR: SUPER_ADMIN_PASSWORD environment variable is missing or shorter than 8 characters."
    );
  }

  // 3. Fallback name if missing
  const name =
    rawName && typeof rawName === "string" && rawName.trim()
      ? rawName.trim()
      : "Samartha Trust Super Admin";

  // 4. Hash password with project's established bcrypt work factor 12
  const passwordHash = await hashPassword(rawPassword.trim());

  // 5. Execute synchronization in an atomic Prisma transaction
  return await prismaClient.$transaction(async (tx) => {
    // Locate existing Super Admin account(s)
    const existingSuperAdmins = await tx.user.findMany({
      where: { role: Role.SUPER_ADMIN },
      orderBy: { createdAt: "asc" },
    });

    if (existingSuperAdmins.length > 1) {
      if (config.cleanupDuplicates === false) {
        const emailList = existingSuperAdmins.map((u) => u.email).join(", ");
        throw new Error(
          `SEED ERROR: Multiple Super Admin accounts exist in the database (${emailList}). Explicit cleanup is required to maintain exactly one Super Admin account.`
        );
      }

      // Safe cleanup approach:
      // 1. Identify which Super Admin matches normalizedEmail (if any)
      const matchingAdmin = existingSuperAdmins.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      // If one matches normalizedEmail, keep that one as primary Super Admin.
      // Otherwise, select the earliest created Super Admin.
      const primaryAdmin = matchingAdmin || existingSuperAdmins[0];
      const secondaryAdmins = existingSuperAdmins.filter(
        (u) => u.id !== primaryAdmin.id
      );

      // 2. Demote secondary Super Admins to Role.ADMIN and revoke their active sessions
      const secondaryIds = secondaryAdmins.map((u) => u.id);
      if (secondaryIds.length > 0) {
        await tx.user.updateMany({
          where: { id: { in: secondaryIds } },
          data: { role: Role.ADMIN },
        });

        await tx.session.updateMany({
          where: { userId: { in: secondaryIds }, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }

      // 3. Check for email conflicts if primaryAdmin is changing email
      if (primaryAdmin.email.toLowerCase() !== normalizedEmail) {
        const conflict = await tx.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (conflict && conflict.id !== primaryAdmin.id) {
          throw new Error(
            `SEED ERROR: Cannot update Super Admin email to "${normalizedEmail}" because another user (${conflict.role}) already uses that email address.`
          );
        }
      }

      // 4. Update primaryAdmin to latest credentials
      const updated = await tx.user.update({
        where: { id: primaryAdmin.id },
        data: {
          email: normalizedEmail,
          name,
          passwordHash,
          role: Role.SUPER_ADMIN,
          isActive: true,
        },
      });

      // 5. Revoke sessions for primaryAdmin
      await tx.session.updateMany({
        where: { userId: primaryAdmin.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      return {
        action: "updated",
        userId: updated.id,
        email: updated.email,
        role: updated.role,
        message:
          "Super Admin credentials synchronized successfully (secondary Super Admin accounts safely demoted to ADMIN).",
      };
    }

    if (existingSuperAdmins.length === 1) {
      const targetAdmin = existingSuperAdmins[0];
      const isEmailChanging =
        targetAdmin.email.toLowerCase() !== normalizedEmail;

      // If email is changing, check for uniqueness conflicts with other users
      if (isEmailChanging) {
        const conflict = await tx.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (conflict && conflict.id !== targetAdmin.id) {
          throw new Error(
            `SEED ERROR: Cannot update Super Admin email to "${normalizedEmail}" because another user (${conflict.role}) already uses that email address.`
          );
        }
      }

      // Update existing Super Admin with latest credentials
      const updated = await tx.user.update({
        where: { id: targetAdmin.id },
        data: {
          email: normalizedEmail,
          name,
          passwordHash,
          role: Role.SUPER_ADMIN,
          isActive: true,
        },
      });

      // Revoke all existing sessions so old credentials cannot be used
      await tx.session.updateMany({
        where: { userId: targetAdmin.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      const message = isEmailChanging
        ? "Super Admin email and password updated from environment configuration."
        : "Super Admin credentials synchronized successfully.";

      return {
        action: "updated",
        userId: updated.id,
        email: updated.email,
        role: updated.role,
        message,
      };
    }

    // If no Super Admin exists, check if user with normalizedEmail exists
    const existingByEmail = await tx.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingByEmail) {
      const updated = await tx.user.update({
        where: { id: existingByEmail.id },
        data: {
          name,
          passwordHash,
          role: Role.SUPER_ADMIN,
          isActive: true,
        },
      });

      await tx.session.updateMany({
        where: { userId: existingByEmail.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      return {
        action: "updated",
        userId: updated.id,
        email: updated.email,
        role: updated.role,
        message: "Super Admin credentials synchronized successfully.",
      };
    }

    // Create new Super Admin account
    const created = await tx.user.create({
      data: {
        email: normalizedEmail,
        name,
        passwordHash,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });

    return {
      action: "created",
      userId: created.id,
      email: created.email,
      role: created.role,
      message: "Super Admin created successfully.",
    };
  });
}
