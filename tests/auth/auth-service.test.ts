import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";
import {
  authenticateSuperAdmin,
  refreshSuperAdminSession,
  revokeSession,
  normalizeEmail,
} from "@/lib/auth/session-service";
import { clearRateLimitStore } from "@/lib/auth/rate-limiter";

describe("Authentication & Session Service (PostgreSQL Integration)", () => {
  const testSuperAdminEmail = "test-superadmin@samarthatrust.org";
  const testSuperAdminPassword = "CorrectSuperAdminPassword123!";
  const testAdminEmail = "test-admin@samarthatrust.org";
  const testInactiveEmail = "test-inactive@samarthatrust.org";

  beforeAll(async () => {
    clearRateLimitStore();

    // Clean up any test users
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testSuperAdminEmail, testAdminEmail, testInactiveEmail],
        },
      },
    });

    const superAdminHash = await hashPassword(testSuperAdminPassword);

    // Create test active Super Admin
    await prisma.user.create({
      data: {
        email: testSuperAdminEmail,
        name: "Test Super Admin",
        passwordHash: superAdminHash,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });

    // Create test standard Admin (non-Super-Admin)
    await prisma.user.create({
      data: {
        email: testAdminEmail,
        name: "Test Standard Admin",
        passwordHash: superAdminHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });

    // Create test inactive Super Admin
    await prisma.user.create({
      data: {
        email: testInactiveEmail,
        name: "Test Inactive Super Admin",
        passwordHash: superAdminHash,
        role: Role.SUPER_ADMIN,
        isActive: false,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testSuperAdminEmail, testAdminEmail, testInactiveEmail],
        },
      },
    });
    await prisma.$disconnect();
  });

  it("Case 1: Correct seeded Super Admin email and password can log in", async () => {
    const result = await authenticateSuperAdmin(
      testSuperAdminEmail,
      testSuperAdminPassword
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user.email).toBe(normalizeEmail(testSuperAdminEmail));
      expect(result.user.role).toBe(Role.SUPER_ADMIN);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.refreshToken).toHaveLength(64);
    }
  });

  it("Case 2: Wrong password is rejected", async () => {
    const result = await authenticateSuperAdmin(
      testSuperAdminEmail,
      "IncorrectPassword123!"
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid email or password.");
      expect(result.statusCode).toBe(401);
    }
  });

  it("Case 3: Unknown email is rejected", async () => {
    const result = await authenticateSuperAdmin(
      "nonexistent-user@samarthatrust.org",
      testSuperAdminPassword
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid email or password.");
      expect(result.statusCode).toBe(401);
    }
  });

  it("Case 4: Inactive account is rejected", async () => {
    const result = await authenticateSuperAdmin(
      testInactiveEmail,
      testSuperAdminPassword
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid email or password.");
      expect(result.statusCode).toBe(401);
    }
  });

  it("Case 5: Non-Super-Admin account is rejected", async () => {
    const result = await authenticateSuperAdmin(
      testAdminEmail,
      testSuperAdminPassword
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid email or password.");
      expect(result.statusCode).toBe(401);
    }
  });

  it("Case 6: Missing email or password is rejected", async () => {
    const res1 = await authenticateSuperAdmin("", testSuperAdminPassword);
    expect(res1.success).toBe(false);

    const res2 = await authenticateSuperAdmin(testSuperAdminEmail, "");
    expect(res2.success).toBe(false);
  });

  it("Case 8: Password hash is never returned in responses", async () => {
    const result = await authenticateSuperAdmin(
      testSuperAdminEmail,
      testSuperAdminPassword
    );

    expect(result.success).toBe(true);
    if (result.success) {
      // @ts-expect-error verifying passwordHash does not exist on SafeUser
      expect(result.user.passwordHash).toBeUndefined();
      expect(JSON.stringify(result)).not.toContain("$2");
    }
  });

  it("Case 12: Active refresh session can renew an access session", async () => {
    const loginResult = await authenticateSuperAdmin(
      testSuperAdminEmail,
      testSuperAdminPassword
    );
    expect(loginResult.success).toBe(true);
    if (!loginResult.success) return;

    const refreshResult = await refreshSuperAdminSession(
      loginResult.refreshToken
    );
    expect(refreshResult.success).toBe(true);
    if (refreshResult.success) {
      expect(refreshResult.accessToken).toBeDefined();
      expect(refreshResult.refreshToken).toBeDefined();
      // Verifies rotation: new refresh token is issued
      expect(refreshResult.refreshToken).not.toEqual(loginResult.refreshToken);
    }
  });

  it("Case 13: Expired refresh session is rejected", async () => {
    const loginResult = await authenticateSuperAdmin(
      testSuperAdminEmail,
      testSuperAdminPassword
    );
    expect(loginResult.success).toBe(true);
    if (!loginResult.success) return;

    // Manually expire session in DB
    const { hashOpaqueToken } = await import("@/lib/auth/tokens");
    await prisma.session.update({
      where: { tokenHash: hashOpaqueToken(loginResult.refreshToken) },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const refreshResult = await refreshSuperAdminSession(
      loginResult.refreshToken
    );
    expect(refreshResult.success).toBe(false);
    if (!refreshResult.success) {
      expect(refreshResult.statusCode).toBe(401);
    }
  });

  it("Case 14 & 15: Logout revokes session and revokes refresh credentials", async () => {
    const loginResult = await authenticateSuperAdmin(
      testSuperAdminEmail,
      testSuperAdminPassword
    );
    expect(loginResult.success).toBe(true);
    if (!loginResult.success) return;

    // Logout / revoke
    const revoked = await revokeSession(loginResult.refreshToken);
    expect(revoked).toBe(true);

    // Case 16: A logged-out / revoked session cannot refresh
    const refreshResult = await refreshSuperAdminSession(
      loginResult.refreshToken
    );
    expect(refreshResult.success).toBe(false);
    if (!refreshResult.success) {
      expect(refreshResult.statusCode).toBe(401);
    }
  });

  afterAll(async () => {
    await prisma.session.deleteMany({
      where: {
        user: {
          email: {
            in: [testSuperAdminEmail, testAdminEmail, testInactiveEmail],
          },
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testSuperAdminEmail, testAdminEmail, testInactiveEmail],
        },
      },
    });
  });
});
