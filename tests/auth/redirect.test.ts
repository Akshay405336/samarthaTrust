import { describe, it, expect } from "vitest";
import { getSafeRedirectUrl } from "@/lib/auth/redirect";

describe("Open Redirect Prevention (Case 20)", () => {
  it("allows safe internal admin paths", () => {
    expect(getSafeRedirectUrl("/admin")).toBe("/admin");
    expect(getSafeRedirectUrl("/admin/blogs")).toBe("/admin/blogs");
    expect(getSafeRedirectUrl("/admin/blogs/new?step=1")).toBe(
      "/admin/blogs/new?step=1"
    );
    expect(getSafeRedirectUrl("/admin?view=settings")).toBe(
      "/admin?view=settings"
    );
  });

  it("rejects protocol-relative URLs (e.g. //evil.com)", () => {
    expect(getSafeRedirectUrl("//evil.com")).toBe("/admin");
    expect(getSafeRedirectUrl("/\\evil.com")).toBe("/admin");
    expect(getSafeRedirectUrl("//localhost:3000/evil")).toBe("/admin");
  });

  it("rejects absolute external URLs", () => {
    expect(getSafeRedirectUrl("https://evil.com")).toBe("/admin");
    expect(getSafeRedirectUrl("http://evil.com/admin")).toBe("/admin");
    expect(getSafeRedirectUrl("https://samarthatrust.org.evil.com")).toBe(
      "/admin"
    );
  });

  it("rejects javascript: and other dangerous pseudo-schemes", () => {
    expect(getSafeRedirectUrl("javascript:alert(1)")).toBe("/admin");
    expect(getSafeRedirectUrl("data:text/html;base64,PHNjcmlwdD4=")).toBe(
      "/admin"
    );
    expect(getSafeRedirectUrl("vbscript:msgbox(1)")).toBe("/admin");
  });

  it("rejects paths with backslashes or userinfo bypasses", () => {
    expect(getSafeRedirectUrl("/admin\\evil")).toBe("/admin");
    expect(getSafeRedirectUrl("/admin@evil.com")).toBe("/admin");
  });

  it("falls back to custom default destination when provided", () => {
    expect(getSafeRedirectUrl("https://attacker.com", "/admin/blogs")).toBe(
      "/admin/blogs"
    );
    expect(getSafeRedirectUrl(null, "/admin/blogs")).toBe("/admin/blogs");
    expect(getSafeRedirectUrl("", "/admin/blogs")).toBe("/admin/blogs");
  });
});
