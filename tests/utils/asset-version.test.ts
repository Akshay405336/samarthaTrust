import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getAssetUrl, clearAssetVersionCache } from "@/lib/utils/asset-version";

describe("Asset Versioning Utility (getAssetUrl)", () => {
  const originalEnv = process.env.NODE_ENV;
  const testDir = path.join(process.cwd(), "public", "test-assets");
  const testFile = path.join(testDir, "sample-image.png");

  beforeEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV =
      "development";
    clearAssetVersionCache();

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    fs.writeFileSync(testFile, "dummy image binary content");
  });

  afterEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
    clearAssetVersionCache();

    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
  });

  it("appends a version query parameter in development based on file mtime", () => {
    const url = getAssetUrl("/test-assets/sample-image.png");
    expect(url).toMatch(/^\/test-assets\/sample-image\.png\?v=[a-z0-9]+$/);
  });

  it("produces stable URLs across multiple calls for an unchanged file", () => {
    const url1 = getAssetUrl("/test-assets/sample-image.png");
    const url2 = getAssetUrl("/test-assets/sample-image.png");
    const url3 = getAssetUrl("/test-assets/sample-image.png");

    expect(url1).toBe(url2);
    expect(url2).toBe(url3);
  });

  it("automatically updates version parameter when file modification time changes", () => {
    const initialUrl = getAssetUrl("/test-assets/sample-image.png");
    const initialVersion = initialUrl.split("?v=")[1];

    // Artificially advance the modification time by 5 seconds
    const stat = fs.statSync(testFile);
    const newTime = new Date(stat.mtimeMs + 5000);
    fs.utimesSync(testFile, newTime, newTime);

    const updatedUrl = getAssetUrl("/test-assets/sample-image.png");
    const updatedVersion = updatedUrl.split("?v=")[1];

    expect(updatedUrl).not.toBe(initialUrl);
    expect(updatedVersion).not.toBe(initialVersion);
  });

  it("preserves existing query parameters when appending version", () => {
    const url = getAssetUrl("/test-assets/sample-image.png?w=800&q=75");
    expect(url).toMatch(
      /^\/test-assets\/sample-image\.png\?w=800&q=75&v=[a-z0-9]+$/
    );
  });

  it("returns original path unchanged if file does not exist in public directory", () => {
    const nonExistent = "/images/non-existent-image-123.png";
    const url = getAssetUrl(nonExistent);
    expect(url).toBe(nonExistent);
  });

  it("leaves external and non-asset URLs untouched", () => {
    expect(getAssetUrl("https://example.com/banner.png")).toBe(
      "https://example.com/banner.png"
    );
    expect(getAssetUrl("//cdn.example.com/image.png")).toBe(
      "//cdn.example.com/image.png"
    );
    expect(getAssetUrl("/api/placeholder")).toBe("/api/placeholder");
    expect(getAssetUrl("relative/path.png")).toBe("relative/path.png");
  });

  it("returns original path unchanged without query parameter in production", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    const url = getAssetUrl("/test-assets/sample-image.png");
    expect(url).toBe("/test-assets/sample-image.png");
    expect(url).not.toContain("?v=");
  });

  it("works reliably with the real hero image asset in public/images/samartha-hero.png", () => {
    const heroUrl = getAssetUrl("/images/samartha-hero.png");
    expect(heroUrl).toMatch(/^\/images\/samartha-hero\.png\?v=[a-z0-9]+$/);
  });

  it("works reliably with the real about heart asset in public/images/about/about-heart.png", () => {
    const aboutUrl = getAssetUrl("/images/about/about-heart.png");
    expect(aboutUrl).toMatch(
      /^\/images\/about\/about-heart\.png\?v=[a-z0-9]+$/
    );
  });

  it("resolves through next/image default loader without localPatterns error", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const imageLoader = require("next/dist/shared/lib/image-loader");
    const defaultLoader = imageLoader.default || imageLoader;
    const { default: nextConfig } = await import("../../next.config");

    const aboutUrl = getAssetUrl("/images/about/about-heart.png");
    const result = defaultLoader({
      config: {
        path: "/_next/image",
        localPatterns: nextConfig.images?.localPatterns,
      },
      src: aboutUrl,
      width: 1080,
      quality: 75,
    });

    expect(result).toContain(
      "/_next/image?url=%2Fimages%2Fabout%2Fabout-heart.png"
    );
    expect(result).toContain("&w=1080&q=75");
  });
});
