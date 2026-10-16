export const AUTH_COOKIES = {
  ACCESS_TOKEN: "samartha_access_token",
  REFRESH_TOKEN: "samartha_refresh_token",
} as const;

// Session lifetimes:
// Access session: 15 minutes (900 seconds)
// Refresh session: 7 days (604,800 seconds)
export const SESSION_LIFETIME = {
  ACCESS_TOKEN_SECONDS: 15 * 60,
  REFRESH_TOKEN_SECONDS: 7 * 24 * 60 * 60,
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  ACCOUNT_INACTIVE: "Invalid email or password.", // generic to avoid status disclosure
  FORBIDDEN_ROLE: "Invalid email or password.", // generic to avoid role disclosure
  UNAUTHORIZED: "Unauthorized access. Please sign in.",
  SESSION_EXPIRED: "Session expired. Please sign in again.",
  RATE_LIMITED: "Too many login attempts. Please try again later.",
  INTERNAL_ERROR: "An unexpected error occurred. Please try again.",
} as const;
