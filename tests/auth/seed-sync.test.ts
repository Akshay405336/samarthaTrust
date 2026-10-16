import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@prisma/client";
import { synchronizeSuperAdmin } from "@/lib/auth/seed-service";
import {
  authenticateSuperAdmin,
  refreshSuperAdminSession,
} from "@/lib/auth/session-service";
import { clearRateLimitStore } from "@/lib/auth/rate-limiter";

describe("Super Admin Seed Synchronization & Lifecycle", () => {
  const seedEmailA = "sync-superadmin-a@samarthatrust.org";
  const seedPasswordA = "OriginalSuperAdminPass123!";
  const seedNameA = "Original Super Admin";

  const seedPasswordB = "UpdatedSuperAdminPass456!";

  const seedEmailC = "sync-superadmin-c@samarthatrust.org";
  const seedNameC = "Renamed Super Admin";

  const conflictUserEmail = "conflict-editor@samarthatrust.org";

  beforeAll(async () => {
    clearRateLimitStore();
    // Clean up test data and previous Super Admins so we start fresh
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Restore default Super Admin from environment variables
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    await synchronizeSuperAdmin({
      email: process.env.SUPER_ADMIN_EMAIL || "admin@samarthatrust.org",
      password: process.env.SUPER_ADMIN_PASSWORD || "Admin@Samartha2026!",
      name: process.env.SUPER_ADMIN_NAME || "Samartha Trust Super Admin",
    });
  });

  beforeEach(() => {
    clearRateLimitStore();
  });

  it("1. Rejects missing or invalid environment variables without modifying DB", async () => {
    // Empty email
    await expect(
      synchronizeSuperAdmin({
        email: "",
        password: seedPasswordA,
        name: seedNameA,
      })
    ).rejects.toThrow(
      "SUPER_ADMIN_EMAIL environment variable is missing or empty"
    );

    // Invalid email format
    await expect(
      synchronizeSuperAdmin({
        email: "invalid-email-address",
        password: seedPasswordA,
        name: seedNameA,
      })
    ).rejects.toThrow("not a valid email address");

    // Password shorter than 8 chars
    await expect(
      synchronizeSuperAdmin({
        email: seedEmailA,
        password: "short",
        name: seedNameA,
      })
    ).rejects.toThrow(
      "SUPER_ADMIN_PASSWORD environment variable is missing or shorter than 8 characters"
    );

    // Database should still have 0 users
    const count = await prisma.user.count();
    expect(count).toBe(0);
  });

  it("2. Initial synchronization creates single Super Admin when none exists", async () => {
    const result = await synchronizeSuperAdmin({
      email: seedEmailA,
      password: seedPasswordA,
      name: seedNameA,
    });

    expect(result.action).toBe("created");
    expect(result.email).toBe(seedEmailA);
    expect(result.role).toBe(Role.SUPER_ADMIN);

    // Verify authentication works with initial credentials
    const loginRes = await authenticateSuperAdmin(seedEmailA, seedPasswordA);
    expect(loginRes.success).toBe(true);
    if (loginRes.success) {
      expect(loginRes.user.email).toBe(seedEmailA);
      expect(loginRes.user.role).toBe(Role.SUPER_ADMIN);
    }
  });

  it("3. Changing password updates Super Admin and invalidates old password", async () => {
    // Re-synchronize with new password B
    const result = await synchronizeSuperAdmin({
      email: seedEmailA,
      password: seedPasswordB,
      name: seedNameA,
    });

    expect(result.action).toBe("updated");
    expect(result.email).toBe(seedEmailA);

    // Login with new password must succeed
    const newLogin = await authenticateSuperAdmin(seedEmailA, seedPasswordB);
    expect(newLogin.success).toBe(true);

    // Login with old password must fail
    const oldLogin = await authenticateSuperAdmin(seedEmailA, seedPasswordA);
    expect(oldLogin.success).toBe(false);
  });

  it("4. Password update revokes all prior active sessions", async () => {
    // Create an active session with password B
    const login = await authenticateSuperAdmin(seedEmailA, seedPasswordB);
    expect(login.success).toBe(true);
    if (!login.success) return;

    // Verify session is active and can be refreshed
    const firstRefresh = await refreshSuperAdminSession(login.refreshToken);
    expect(firstRefresh.success).toBe(true);
    if (!firstRefresh.success) return;

    // Now re-seed with a new password
    await synchronizeSuperAdmin({
      email: seedEmailA,
      password: "AnotherNewPassword789!",
      name: seedNameA,
    });

    // Old active session must now be revoked and rejected
    const secondRefresh = await refreshSuperAdminSession(
      firstRefresh.refreshToken
    );
    expect(secondRefresh.success).toBe(false);
    if (!secondRefresh.success) {
      expect(secondRefresh.statusCode).toBe(401);
    }
  });

  it("5. Changing email updates Super Admin and preserves single account", async () => {
    // Synchronize with new email C and name C
    const result = await synchronizeSuperAdmin({
      email: seedEmailC,
      password: seedPasswordB,
      name: seedNameC,
    });

    expect(result.action).toBe("updated");
    expect(result.email).toBe(seedEmailC);

    // Login with new email must succeed
    const newEmailLogin = await authenticateSuperAdmin(
      seedEmailC,
      seedPasswordB
    );
    expect(newEmailLogin.success).toBe(true);

    // Login with old email must fail
    const oldEmailLogin = await authenticateSuperAdmin(
      seedEmailA,
      seedPasswordB
    );
    expect(oldEmailLogin.success).toBe(false);

    // Ensure only 1 Super Admin exists in the database
    const superAdminCount = await prisma.user.count({
      where: { role: Role.SUPER_ADMIN },
    });
    expect(superAdminCount).toBe(1);
  });

  it("6. Repeated seed runs are idempotent and do not duplicate users", async () => {
    const run1 = await synchronizeSuperAdmin({
      email: seedEmailC,
      password: seedPasswordB,
      name: seedNameC,
    });
    expect(run1.action).toBe("updated");

    const run2 = await synchronizeSuperAdmin({
      email: seedEmailC,
      password: seedPasswordB,
      name: seedNameC,
    });
    expect(run2.action).toBe("updated");

    const count = await prisma.user.count({
      where: { role: Role.SUPER_ADMIN },
    });
    expect(count).toBe(1);
  });

  it("7. Fails gracefully if new email conflicts with another user", async () => {
    // Create a non-super-admin user
    await prisma.user.create({
      data: {
        email: conflictUserEmail,
        name: "Conflict Editor",
        passwordHash: "hash123",
        role: Role.EDITOR,
        isActive: true,
      },
    });

    // Attempting to change Super Admin email to conflictUserEmail must throw an error
    await expect(
      synchronizeSuperAdmin({
        email: conflictUserEmail,
        password: seedPasswordB,
        name: seedNameC,
      })
    ).rejects.toThrow("because another user (EDITOR) already uses that email");

    // Super Admin should remain intact with seedEmailC
    const currentAdmin = await prisma.user.findFirst({
      where: { role: Role.SUPER_ADMIN },
    });
    expect(currentAdmin?.email).toBe(seedEmailC);

    // Clean up conflict user
    await prisma.user.delete({ where: { email: conflictUserEmail } });
  });

  it("8a. Fails with clear error when multiple Super Admins exist and cleanupDuplicates is false", async () => {
    // Create an extra Super Admin
    const extraAdmin = await prisma.user.create({
      data: {
        email: "extra-superadmin@samarthatrust.org",
        name: "Extra Admin",
        passwordHash: "hash456",
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });

    try {
      await expect(
        synchronizeSuperAdmin({
          email: seedEmailC,
          password: seedPasswordB,
          name: seedNameC,
          cleanupDuplicates: false,
        })
      ).rejects.toThrow("Multiple Super Admin accounts exist in the database");
    } finally {
      await prisma.user.delete({
        where: { id: extraAdmin.id },
      });
    }
  });

  it("8b. Cleans up safely so only one Super Admin remains when cleanupDuplicates is true (default)", async () => {
    // Create an extra Super Admin
    const extraAdmin = await prisma.user.create({
      data: {
        email: "extra-superadmin@samarthatrust.org",
        name: "Extra Admin",
        passwordHash: "hash456",
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });

    // Run synchronization with default cleanup behavior
    const result = await synchronizeSuperAdmin({
      email: seedEmailC,
      password: seedPasswordB,
      name: seedNameC,
    });

    expect(result.action).toBe("updated");
    expect(result.email).toBe(seedEmailC);

    // Exactly one Super Admin must remain
    const superAdminCount = await prisma.user.count({
      where: { role: Role.SUPER_ADMIN },
    });
    expect(superAdminCount).toBe(1);

    // The extra admin must have been demoted to ADMIN
    const demoted = await prisma.user.findUnique({
      where: { id: extraAdmin.id },
    });
    expect(demoted?.role).toBe(Role.ADMIN);

    // Clean up demoted user
    await prisma.user.delete({ where: { id: extraAdmin.id } });
  });
});
