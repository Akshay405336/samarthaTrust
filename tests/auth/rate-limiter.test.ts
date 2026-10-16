import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  recordRateLimitAttempt,
  resetRateLimit,
  clearRateLimitStore,
} from "@/lib/auth/rate-limiter";

describe("Login Rate Limiting", () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  it("permits initial attempts up to the threshold", () => {
    const key = "test:user@example.com";
    expect(checkRateLimit(key, 5).allowed).toBe(true);

    for (let i = 1; i <= 5; i++) {
      const res = recordRateLimitAttempt(key);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(5 - i);
    }

    // 6th attempt exceeds the limit
    const exceeded = recordRateLimitAttempt(key);
    expect(exceeded.allowed).toBe(false);
    expect(exceeded.remaining).toBe(0);

    // checkRateLimit now also reports not allowed
    expect(checkRateLimit(key, 5).allowed).toBe(false);
  });

  it("resets rate limit on successful authentication", () => {
    const key = "test:reset@example.com";
    recordRateLimitAttempt(key);
    recordRateLimitAttempt(key);

    expect(checkRateLimit(key, 5).remaining).toBe(3);

    resetRateLimit(key);
    expect(checkRateLimit(key, 5).remaining).toBe(5);
  });
});
