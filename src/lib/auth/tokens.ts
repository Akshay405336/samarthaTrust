import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { AUTH_COOKIES, SESSION_LIFETIME } from "./constants";

export interface AccessTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  sessionId: string;
}

const DEFAULT_DEV_SECRET =
  "f5537535d35230ce7c997771a905791d60c81a1ded6ab187e8c166f87a6f67be";

function getAuthSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY CONFIGURATION ERROR: AUTH_SECRET environment variable is missing in production!"
      );
    }
    return new TextEncoder().encode(DEFAULT_DEV_SECRET);
  }
  if (secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be at least 32 characters long for secure cryptographic signing."
    );
  }
  return new TextEncoder().encode(secret);
}

const JWT_ISSUER = "samartha-trust";
const JWT_AUDIENCE = "samartha-trust-admin";

/**
 * Creates a signed JWT access token valid for 15 minutes.
 */
export async function createAccessToken(
  payload: AccessTokenPayload
): Promise<string> {
  const secretKey = getAuthSecretKey();

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_LIFETIME.ACCESS_TOKEN_SECONDS}s`)
    .sign(secretKey);
}

/**
 * Verifies a signed JWT access token and extracts its payload.
 * Returns null if invalid or expired.
 */
export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload | null> {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const secretKey = getAuthSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    if (
      !payload.sub ||
      !payload.userId ||
      !payload.email ||
      !payload.role ||
      !payload.sessionId
    ) {
      return null;
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: (payload.name as string) || "",
      role: payload.role as string,
      sessionId: payload.sessionId as string,
    };
  } catch {
    return null;
  }
}

/**
 * Generates a cryptographically secure random opaque token (64 hex characters).
 */
export function generateOpaqueToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generates a SHA-256 hash of an opaque token for database storage.
 */
export function hashOpaqueToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Secure cookie options for the 15-minute access token.
 */
export function getAccessTokenCookieOptions(
  isProduction = process.env.NODE_ENV === "production"
) {
  return {
    name: AUTH_COOKIES.ACCESS_TOKEN,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_LIFETIME.ACCESS_TOKEN_SECONDS,
  };
}

/**
 * Secure cookie options for the 7-day refresh token.
 */
export function getRefreshTokenCookieOptions(
  isProduction = process.env.NODE_ENV === "production"
) {
  return {
    name: AUTH_COOKIES.REFRESH_TOKEN,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_LIFETIME.REFRESH_TOKEN_SECONDS,
  };
}

/**
 * Cookie options to clear authentication cookies on logout or expiration.
 */
export function getClearCookieOptions(
  name: string,
  isProduction = process.env.NODE_ENV === "production"
) {
  return {
    name,
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}
