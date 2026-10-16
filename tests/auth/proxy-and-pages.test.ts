import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import { createAccessToken } from "@/lib/auth/tokens";
import { Role } from "@prisma/client";

describe("Next.js 16 Proxy & Route Protection", () => {
  it("Case 10: Missing session cannot access /admin (redirects to /admin/login)", async () => {
    const req = new NextRequest("http://localhost:3000/admin");
    const res = await proxy(req);

    expect(res.status).toBe(307); // NextResponse.redirect default is 307
    const location = res.headers.get("location");
    expect(location).toBeDefined();
    expect(location).toContain("/admin/login");
  });

  it("Case 10b: Preserves target path in 'from' redirect parameter", async () => {
    const req = new NextRequest("http://localhost:3000/admin/blogs?tab=drafts");
    const res = await proxy(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/admin/login?from=");
    expect(location).toContain(encodeURIComponent("/admin/blogs?tab=drafts"));
  });

  it("Case 11: Invalid or forged cookies cannot access /admin", async () => {
    const req = new NextRequest("http://localhost:3000/admin", {
      headers: {
        cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=forged.token.here`,
      },
    });
    const res = await proxy(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/admin/login");
  });

  it("Case 19: Customer / public pages remain accessible without authentication", async () => {
    const publicPaths = [
      "http://localhost:3000/",
      "http://localhost:3000/about",
      "http://localhost:3000/our-trustees",
      "http://localhost:3000/our-works",
      "http://localhost:3000/blog",
      "http://localhost:3000/contact",
      "http://localhost:3000/programs",
      "http://localhost:3000/api/health",
    ];

    for (const url of publicPaths) {
      const req = new NextRequest(url);
      const res = await proxy(req);
      // Status 200 or next() (status 200) - not redirected to /admin/login
      expect(res.status).not.toBe(307);
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("allows authenticated Super Admin with valid token to access /admin", async () => {
    const validToken = await createAccessToken({
      userId: "usr_valid_admin",
      email: "admin@samarthatrust.org",
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      sessionId: "sess_valid_123",
    });

    const req = new NextRequest("http://localhost:3000/admin", {
      headers: {
        cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${validToken}`,
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(200); // NextResponse.next()
    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects authenticated user visiting /admin/login to /admin", async () => {
    const validToken = await createAccessToken({
      userId: "usr_valid_admin",
      email: "admin@samarthatrust.org",
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      sessionId: "sess_valid_123",
    });

    const req = new NextRequest("http://localhost:3000/admin/login", {
      headers: {
        cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${validToken}`,
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/admin");
  });

  it("does not redirect /admin/login when only refresh token cookie is present (avoids redirect loop)", async () => {
    const req = new NextRequest("http://localhost:3000/admin/login", {
      headers: {
        cookie: `${AUTH_COOKIES.REFRESH_TOKEN}=stale_or_revoked_token`,
      },
    });

    const res = await proxy(req);
    // Should NOT redirect to /admin, should allow rendering /admin/login
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });
});
