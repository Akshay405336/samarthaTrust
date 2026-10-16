/**
 * Validates and sanitizes redirect destination URLs to prevent open-redirect vulnerabilities.
 * Only allows relative paths within the admin area or public site.
 */
export function getSafeRedirectUrl(
  target: string | null | undefined,
  defaultUrl = "/admin"
): string {
  if (!target || typeof target !== "string") {
    return defaultUrl;
  }

  const trimmed = target.trim();

  // Must begin with a single forward slash
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\")
  ) {
    return defaultUrl;
  }

  // Reject URLs containing backslashes, @, or scheme indicators
  if (
    trimmed.includes("\\") ||
    trimmed.includes("@") ||
    trimmed.includes(":") ||
    trimmed.includes("\0")
  ) {
    return defaultUrl;
  }

  // Only allow internal paths starting with /admin or /
  // For admin post-login redirects, ensure it stays within the admin area or valid internal route
  try {
    const dummyBase = "http://localhost";
    const parsed = new URL(trimmed, dummyBase);

    // Host must remain localhost and protocol must remain http
    if (parsed.origin !== dummyBase) {
      return defaultUrl;
    }

    // Must be a relative path
    const safePath = parsed.pathname + parsed.search + parsed.hash;
    if (!safePath.startsWith("/")) {
      return defaultUrl;
    }

    return safePath;
  } catch {
    return defaultUrl;
  }
}
