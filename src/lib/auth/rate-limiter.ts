/**
 * In-memory sliding-window rate limiter for brute-force mitigation on authentication endpoints.
 *
 * Architecture note:
 * In multi-instance / serverless production environments with Redis, this interface can be
 * backed by Redis INCR/EXPIRE via REDIS_URL. In standard single-instance Next.js node server
 * or development environments, this built-in high-performance in-memory cache provides
 * immediate defense against brute-force password guessing.
 */

interface RateLimitRecord {
  attempts: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, record] of rateLimitStore.entries()) {
    record.attempts = record.attempts.filter((timestamp) => timestamp > cutoff);
    if (record.attempts.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number; // Unix timestamp in ms
}

/**
 * Checks whether an attempt is allowed under the rate limit without incrementing.
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  cleanupExpired(windowMs);

  const now = Date.now();
  const cutoff = now - windowMs;
  const record = rateLimitStore.get(key);

  if (!record) {
    return {
      allowed: true,
      remaining: maxAttempts,
      resetTime: now + windowMs,
    };
  }

  // Filter timestamps within current sliding window
  const activeAttempts = record.attempts.filter((ts) => ts > cutoff);
  record.attempts = activeAttempts;

  const allowed = activeAttempts.length < maxAttempts;
  const remaining = Math.max(0, maxAttempts - activeAttempts.length);
  const oldest = activeAttempts[0] || now;
  const resetTime = oldest + windowMs;

  return { allowed, remaining, resetTime };
}

/**
 * Records a failed attempt for rate limiting.
 */
export function recordRateLimitAttempt(
  key: string,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { attempts: [] };
    rateLimitStore.set(key, record);
  }

  record.attempts = record.attempts.filter((ts) => ts > cutoff);
  record.attempts.push(now);

  const maxAttempts = 5;
  const allowed = record.attempts.length <= maxAttempts;
  const remaining = Math.max(0, maxAttempts - record.attempts.length);
  const resetTime = record.attempts[0] + windowMs;

  return { allowed, remaining, resetTime };
}

/**
 * Resets rate limit for a key upon successful authentication.
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Clears the entire store (useful in testing).
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}
