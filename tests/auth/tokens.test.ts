import { describe, it, expect } from "vitest";
import {
  createAccessToken,
  verifyAccessToken,
  generateOpaqueToken,
  hashOpaqueToken,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from "@/lib/auth/tokens";
import { SESSION_LIFETIME } from "@/lib/auth/constants";

describe("Token and Cookie Utilities", () => {
  const dummyPayload = {
    userId: "usr_12345",
    email: "admin@samarthatrust.org",
    name: "Super Admin",
    role: "SUPER_ADMIN",
    sessionId: "sess_abcde",
  };

  it("creates a signed JWT access token and verifies its claims", async () => {
    const token = await createAccessToken(dummyPayload);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const decoded = await verifyAccessToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(dummyPayload.userId);
    expect(decoded?.email).toBe(dummyPayload.email);
    expect(decoded?.role).toBe(dummyPayload.role);
    expect(decoded?.sessionId).toBe(dummyPayload.sessionId);
  });

  it("rejects tampered or forged JWT tokens", async () => {
    const validToken = await createAccessToken(dummyPayload);
    const parts = validToken.split(".");
    // Tamper with payload
    const tamperedToken = `${parts[0]}.${parts[1]}xyz.${parts[2]}`;

    const decoded = await verifyAccessToken(tamperedToken);
    expect(decoded).toBeNull();
  });

  it("rejects arbitrary non-token strings", async () => {
    expect(await verifyAccessToken("arbitrary.invalid.token")).toBeNull();
    expect(await verifyAccessToken("")).toBeNull();
  });

  it("generates unique opaque tokens and creates deterministic SHA-256 hashes", () => {
    const token1 = generateOpaqueToken();
    const token2 = generateOpaqueToken();

    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
    expect(token1).not.toEqual(token2);

    const hash1 = hashOpaqueToken(token1);
    const hash1Again = hashOpaqueToken(token1);
    const hash2 = hashOpaqueToken(token2);

    expect(hash1).toHaveLength(64);
    expect(hash1).toEqual(hash1Again);
    expect(hash1).not.toEqual(hash2);
  });

  it("provides correct cookie options with HttpOnly and explicit lifetimes", () => {
    const accessCookie = getAccessTokenCookieOptions(false);
    expect(accessCookie.httpOnly).toBe(true);
    expect(accessCookie.sameSite).toBe("lax");
    expect(accessCookie.path).toBe("/");
    expect(accessCookie.maxAge).toBe(SESSION_LIFETIME.ACCESS_TOKEN_SECONDS);

    const refreshCookie = getRefreshTokenCookieOptions(false);
    expect(refreshCookie.httpOnly).toBe(true);
    expect(refreshCookie.sameSite).toBe("lax");
    expect(refreshCookie.path).toBe("/");
    expect(refreshCookie.maxAge).toBe(SESSION_LIFETIME.REFRESH_TOKEN_SECONDS);
  });
});
