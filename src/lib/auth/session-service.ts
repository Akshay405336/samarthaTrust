import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AUTH_ERRORS, SESSION_LIFETIME } from "./constants";
import { verifyPassword } from "./password";
import {
  createAccessToken,
  generateOpaqueToken,
  hashOpaqueToken,
} from "./tokens";
import {
  checkRateLimit,
  recordRateLimitAttempt,
  resetRateLimit,
} from "./rate-limiter";

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthSuccessResult {
  success: true;
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthFailureResult {
  success: false;
  error: string;
  statusCode: number;
}

export type AuthResult = AuthSuccessResult | AuthFailureResult;

/**
 * Normalizes email address consistently (trims whitespace and lowercases).
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Authenticates a Super Admin using credentials, records rate limits,
 * verifies password hash, and creates an authenticated database session.
 */
export async function authenticateSuperAdmin(
  rawEmail: string,
  password: string,
  userAgent?: string,
  ipAddress?: string
): Promise<AuthResult> {
  if (
    !rawEmail ||
    !password ||
    typeof rawEmail !== "string" ||
    typeof password !== "string"
  ) {
    return {
      success: false,
      error: AUTH_ERRORS.INVALID_CREDENTIALS,
      statusCode: 400,
    };
  }

  const normalizedEmail = normalizeEmail(rawEmail);
  const rateLimitKey = `login:${normalizedEmail}:${ipAddress || "unknown"}`;

  // Check rate limit
  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: AUTH_ERRORS.RATE_LIMITED,
      statusCode: 429,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      recordRateLimitAttempt(rateLimitKey);
      return {
        success: false,
        error: AUTH_ERRORS.INVALID_CREDENTIALS,
        statusCode: 401,
      };
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      recordRateLimitAttempt(rateLimitKey);
      return {
        success: false,
        error: AUTH_ERRORS.INVALID_CREDENTIALS,
        statusCode: 401,
      };
    }

    // Only active Super Admin accounts can sign in
    if (!user.isActive || user.role !== Role.SUPER_ADMIN) {
      recordRateLimitAttempt(rateLimitKey);
      return {
        success: false,
        error: AUTH_ERRORS.INVALID_CREDENTIALS,
        statusCode: 401,
      };
    }

    // Clear rate limit on successful authentication
    resetRateLimit(rateLimitKey);

    // Create opaque refresh token and store its hash in PostgreSQL
    const rawRefreshToken = generateOpaqueToken();
    const tokenHash = hashOpaqueToken(rawRefreshToken);
    const expiresAt = new Date(
      Date.now() + SESSION_LIFETIME.REFRESH_TOKEN_SECONDS * 1000
    );

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
      },
    });

    // Generate signed 15-minute access token
    const accessToken = await createAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      sessionId: session.id,
    });

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      success: true,
      user: safeUser,
      accessToken,
      refreshToken: rawRefreshToken,
    };
  } catch (err) {
    console.error("Authentication internal error:", err);
    return {
      success: false,
      error: AUTH_ERRORS.INTERNAL_ERROR,
      statusCode: 500,
    };
  }
}

/**
 * Validates a refresh token against PostgreSQL, rotates the refresh token,
 * enforces user status/role, and issues a fresh 15-minute access token.
 */
export async function refreshSuperAdminSession(
  rawRefreshToken: string,
  userAgent?: string,
  ipAddress?: string
): Promise<AuthResult> {
  if (!rawRefreshToken || typeof rawRefreshToken !== "string") {
    return {
      success: false,
      error: AUTH_ERRORS.SESSION_EXPIRED,
      statusCode: 401,
    };
  }

  const tokenHash = hashOpaqueToken(rawRefreshToken);

  try {
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    // Session missing, revoked, or expired
    if (
      !session ||
      session.revokedAt !== null ||
      session.expiresAt <= new Date()
    ) {
      return {
        success: false,
        error: AUTH_ERRORS.SESSION_EXPIRED,
        statusCode: 401,
      };
    }

    // User must be active and have SUPER_ADMIN role
    if (!session.user.isActive || session.user.role !== Role.SUPER_ADMIN) {
      // Immediately revoke session
      await prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      return {
        success: false,
        error: AUTH_ERRORS.SESSION_EXPIRED,
        statusCode: 401,
      };
    }

    // Refresh Token Rotation: issue a new opaque token, update tokenHash
    // Notice: we preserve the original absolute session expiresAt (7 days maximum)
    const newRefreshToken = generateOpaqueToken();
    const newTokenHash = hashOpaqueToken(newRefreshToken);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        tokenHash: newTokenHash,
        userAgent: userAgent || session.userAgent,
        ipAddress: ipAddress || session.ipAddress,
      },
    });

    // Issue new 15-minute access token
    const accessToken = await createAccessToken({
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      sessionId: session.id,
    });

    const safeUser: SafeUser = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };

    return {
      success: true,
      user: safeUser,
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    console.error("Session refresh error:", err);
    return {
      success: false,
      error: AUTH_ERRORS.INTERNAL_ERROR,
      statusCode: 500,
    };
  }
}

/**
 * Revokes the server-side session associated with a refresh token.
 */
export async function revokeSession(
  rawRefreshToken?: string | null
): Promise<boolean> {
  if (!rawRefreshToken || typeof rawRefreshToken !== "string") {
    return false;
  }

  const tokenHash = hashOpaqueToken(rawRefreshToken);
  try {
    const result = await prisma.session.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return result.count > 0;
  } catch (err) {
    console.error("Revoke session error:", err);
    return false;
  }
}

/**
 * Revokes the server-side session associated with a session ID.
 */
export async function revokeSessionById(
  sessionId?: string | null
): Promise<boolean> {
  if (!sessionId || typeof sessionId !== "string") {
    return false;
  }

  try {
    const result = await prisma.session.updateMany({
      where: {
        id: sessionId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return result.count > 0;
  } catch (err) {
    console.error("Revoke session by ID error:", err);
    return false;
  }
}

/**
 * Revokes all active sessions for a given user.
 */
export async function revokeAllUserSessions(userId: string): Promise<number> {
  try {
    const result = await prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return result.count;
  } catch {
    return 0;
  }
}

/**
 * Validates whether an active session and user exist and remain authorized.
 */
export async function validateActiveSession(
  sessionId: string
): Promise<SafeUser | null> {
  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (
      !session ||
      session.revokedAt !== null ||
      session.expiresAt <= new Date() ||
      !session.user.isActive ||
      session.user.role !== Role.SUPER_ADMIN
    ) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };
  } catch {
    return null;
  }
}
