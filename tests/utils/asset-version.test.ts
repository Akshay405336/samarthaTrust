import fs from "fs";
import path from "path";
import * as React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getAssetUrl,
  getAboutBannerBgUrl,
  clearAssetVersionCache,
} from "@/lib/utils/asset-version";

describe("Asset Versioning Utility (getAssetUrl & getAboutBannerBgUrl)", () => {
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

  it("appends deterministic version query in production to ensure reliable CDN cache invalidation on replacement", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    const url = getAssetUrl("/test-assets/sample-image.png");
    expect(url).toMatch(/^\/test-assets\/sample-image\.png\?v=[a-z0-9]+$/);
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

  it("resolves the real About banner background image with version query", () => {
    const bannerUrl = getAboutBannerBgUrl();
    expect(bannerUrl).toMatch(
      /^\/images\/about\/about-banner-bg\.png\?v=[a-z0-9]+$/
    );
  });

  it("automatically picks up a newly placed candidate image when its mtime is newer", () => {
    const testJpg = path.join(
      process.cwd(),
      "public",
      "images",
      "about-banner-bg.jpg"
    );
    try {
      fs.writeFileSync(testJpg, "dummy-banner-content");
      const futureTime = new Date(Date.now() + 60000);
      fs.utimesSync(testJpg, futureTime, futureTime);

      clearAssetVersionCache();
      const resolved = getAboutBannerBgUrl();
      expect(resolved).toContain("/images/about-banner-bg.jpg?v=");
    } finally {
      if (fs.existsSync(testJpg)) {
        fs.unlinkSync(testJpg);
      }
      clearAssetVersionCache();
    }
  });

  it("automatically updates version parameter when banner background image is modified", () => {
    const realBannerPath = path.join(
      process.cwd(),
      "public",
      "images",
      "about",
      "about-banner-bg.png"
    );
    const initialUrl = getAboutBannerBgUrl();

    const stat = fs.statSync(realBannerPath);
    const newTime = new Date(stat.mtimeMs + 5000);
    fs.utimesSync(realBannerPath, newTime, newTime);

    const updatedUrl = getAboutBannerBgUrl();
    expect(updatedUrl).not.toBe(initialUrl);

    // Restore original timestamp
    fs.utimesSync(realBannerPath, stat.atime, stat.mtime);
    clearAssetVersionCache();
  });

  it("verifies AboutBanner component uses getAboutBannerBgUrl with object-cover and object-center", async () => {
    const { AboutBanner } =
      await import("@/components/customer/about-us/about-banner");
    const jsx = AboutBanner();
    expect(jsx).not.toBeNull();
    const children = React.Children.toArray(jsx.props.children);
    const imageChild = children.find(
      (
        child
      ): child is React.ReactElement<{ src: string; className: string }> =>
        React.isValidElement(child) &&
        typeof (child.props as { src?: unknown }).src === "string"
    );

    expect(imageChild).toBeDefined();
    expect(imageChild!.props.src).toMatch(
      /^\/images\/about\/about-banner-bg\.png\?v=[a-z0-9]+$/
    );
    expect(imageChild!.props.className).toContain("object-cover");
    expect(imageChild!.props.className).toContain("object-center");
    expect(imageChild!.props.className).toContain("-z-20");
  });
});
