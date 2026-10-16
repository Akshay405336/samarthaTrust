import fs from "fs";
import path from "path";

/**
 * Cache map storing the last known file modification time and computed version tag.
 * Key: clean asset path (e.g. "/images/samartha-hero.png")
 * Value: { mtimeMs: number, version: string }
 */
const assetVersionCache = new Map<
  string,
  { mtimeMs: number; version: string }
>();

/**
 * Returns the asset URL with a stable cache-busting query parameter in development,
 * derived from the file's last modified timestamp (mtimeMs).
 *
 * In production, it returns the original path unchanged to preserve static CDN caching.
 *
 * @param src The relative public asset path (e.g. "/images/samartha-hero.png")
 * @returns The versioned asset path (e.g. "/images/samartha-hero.png?v=l8x4z1") in development,
 *          or the unmodified path in production.
 */
export function getAssetUrl(src: string): string {
  // In production, preserve standard static URLs for CDN efficiency
  if (process.env.NODE_ENV === "production") {
    return src;
  }

  // Only handle local public assets starting with "/" and not external or API URLs
  if (
    !src ||
    !src.startsWith("/") ||
    src.startsWith("//") ||
    src.startsWith("/api/")
  ) {
    return src;
  }

  const [cleanPath, existingQuery] = src.split("?");

  try {
    const publicPath = path.join(process.cwd(), "public", cleanPath);
    if (!fs.existsSync(publicPath)) {
      return src;
    }

    const stat = fs.statSync(publicPath);
    const mtimeMs = Math.floor(stat.mtimeMs);

    const cached = assetVersionCache.get(cleanPath);
    if (cached && cached.mtimeMs === mtimeMs) {
      return existingQuery
        ? `${cleanPath}?${existingQuery}&v=${cached.version}`
        : `${cleanPath}?v=${cached.version}`;
    }

    // Generate a compact base-36 representation of the modification timestamp
    const version = mtimeMs.toString(36);
    assetVersionCache.set(cleanPath, { mtimeMs, version });

    return existingQuery
      ? `${cleanPath}?${existingQuery}&v=${version}`
      : `${cleanPath}?v=${version}`;
  } catch {
    return src;
  }
}

/**
 * Helper to manually clear the version cache (useful for testing).
 */
export function clearAssetVersionCache(): void {
  assetVersionCache.clear();
}
