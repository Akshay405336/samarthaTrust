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
 * Canonical default path for the About banner background image.
 */
export const DEFAULT_ABOUT_BANNER_BG = "/images/about/about-banner-bg.png";

/**
 * Supported candidate paths for the About page banner background.
 * Scanned in order to detect available formats and locations.
 */
export const ABOUT_BANNER_CANDIDATE_PATHS = [
  "/images/about/about-banner-bg.png",
  "/images/about/about-banner-bg.jpg",
  "/images/about/about-banner-bg.jpeg",
  "/images/about/about-banner-bg.webp",
  "/images/about-banner-bg.jpg",
  "/images/about-banner-bg.jpeg",
  "/images/about-banner-bg.png",
  "/images/about-banner-bg.webp",
] as const;

/**
 * Returns the asset URL with a deterministic, stable cache-busting query parameter
 * derived from the file's last modified timestamp (mtimeMs).
 *
 * In both development and production, this ensures:
 * 1. An unchanged file produces an identical, stable URL for maximum CDN cache efficiency.
 * 2. Replacing the file on disk automatically updates the version query (?v=...),
 *    bypassing immutable browser and CDN caches without manual code edits.
 *
 * @param src The relative public asset path (e.g. "/images/about/about-banner-bg.png")
 * @returns The versioned asset path (e.g. "/images/about/about-banner-bg.png?v=l8x4z1")
 */
export function getAssetUrl(src: string): string {
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
 * Resolves the active About banner background image URL.
 * Automatically scans supported candidate formats (.png, .jpg, .jpeg, .webp)
 * in /images/about/ and /images/, picks the latest existing file by modification time,
 * and returns its versioned URL.
 */
export function getAboutBannerBgUrl(): string {
  try {
    let latestPath: string | null = null;
    let latestMtime = -1;

    for (const candidate of ABOUT_BANNER_CANDIDATE_PATHS) {
      const fullPath = path.join(process.cwd(), "public", candidate);
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath);
        if (stat.mtimeMs > latestMtime) {
          latestMtime = stat.mtimeMs;
          latestPath = candidate;
        }
      }
    }

    if (latestPath) {
      return getAssetUrl(latestPath);
    }
  } catch {
    // Fall back to default if filesystem access encounters an issue
  }

  return getAssetUrl(DEFAULT_ABOUT_BANNER_BG);
}

/**
 * Helper to manually clear the version cache (useful for testing).
 */
export function clearAssetVersionCache(): void {
  assetVersionCache.clear();
}
