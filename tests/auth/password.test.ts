import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("Password Hashing & Verification (bcrypt)", () => {
  it("hashes password with bcrypt and verifies correctly", async () => {
    const rawPassword = "StrongPassword@2026!";
    const hash = await hashPassword(rawPassword);

    expect(hash).toBeDefined();
    expect(hash.startsWith("$2a$12$") || hash.startsWith("$2b$12$")).toBe(true);
    expect(hash).not.toEqual(rawPassword);

    const isMatch = await verifyPassword(rawPassword, hash);
    expect(isMatch).toBe(true);
  });

  it("rejects incorrect password against hash", async () => {
    const rawPassword = "CorrectPassword123!";
    const hash = await hashPassword(rawPassword);

    const isMatch = await verifyPassword("WrongPassword123!", hash);
    expect(isMatch).toBe(false);
  });

  it("handles empty or invalid inputs safely without throwing", async () => {
    expect(await verifyPassword("", "somehash")).toBe(false);
    expect(await verifyPassword("password", "")).toBe(false);
    expect(await verifyPassword("password", "invalid_hash_string")).toBe(false);
    // @ts-expect-error Testing invalid runtime types
    expect(await verifyPassword(null, null)).toBe(false);
  });

  it("throws when attempting to hash an empty password", async () => {
    await expect(hashPassword("")).rejects.toThrow();
  });
});
