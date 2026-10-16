import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { POST as loginHandler } from "@/app/api/admin/auth/login/route";
import { GET as meHandler } from "@/app/api/admin/auth/me/route";
import { POST as logoutHandler } from "@/app/api/admin/auth/logout/route";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import { clearRateLimitStore } from "@/lib/auth/rate-limiter";

describe("Authentication API Route Handlers", () => {
  const apiTestEmail = "api-test-admin@samarthatrust.org";
  const apiTestPassword = "ApiTestPassword2026!";

  beforeAll(async () => {
    clearRateLimitStore();
    await prisma.user.deleteMany({ where: { email: apiTestEmail } });

    const hash = await hashPassword(apiTestPassword);
    await prisma.user.create({
      data: {
        email: apiTestEmail,
        name: "API Test Admin",
        passwordHash: hash,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: apiTestEmail } });
    await prisma.$disconnect();
  });

  it("Case 7: Invalid request payload is rejected with 400", async () => {
    // Malformed JSON / missing fields
    const req1 = new NextRequest("http://localhost:3000/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email", password: "123" }),
      headers: { "Content-Type": "application/json" },
    });
    const res1 = await loginHandler(req1);
    expect(res1.status).toBe(400);

    const req2 = new NextRequest("http://localhost:3000/api/admin/auth/login", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res2 = await loginHandler(req2);
    expect(res2.status).toBe(400);
  });

  it("Case 9: Successful login sets the expected secure HttpOnly cookies", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: apiTestEmail, password: apiTestPassword }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await loginHandler(req);
    expect(res.status).toBe(200);

    const accessCookie = res.cookies.get(AUTH_COOKIES.ACCESS_TOKEN);
    const refreshCookie = res.cookies.get(AUTH_COOKIES.REFRESH_TOKEN);

    expect(accessCookie).toBeDefined();
    expect(refreshCookie).toBeDefined();
    expect(accessCookie?.httpOnly).toBe(true);
    expect(refreshCookie?.httpOnly).toBe(true);
    expect(accessCookie?.value).toBeTruthy();
    expect(refreshCookie?.value).toBeTruthy();

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.email).toBe(apiTestEmail);
    expect(data.user.role).toBe(Role.SUPER_ADMIN);
    // Verifies no secrets leaked in body
    expect(data.accessToken).toBeUndefined();
    expect(data.refreshToken).toBeUndefined();
  });

  it("Case 17: /api/admin/auth/me returns the correct safe profile for a valid session", async () => {
    // First login to obtain valid cookies
    const loginReq = new NextRequest(
      "http://localhost:3000/api/admin/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: apiTestEmail,
          password: apiTestPassword,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const loginRes = await loginHandler(loginReq);
    const accessCookie = loginRes.cookies.get(AUTH_COOKIES.ACCESS_TOKEN);
    const refreshCookie = loginRes.cookies.get(AUTH_COOKIES.REFRESH_TOKEN);

    // Call /api/admin/auth/me with cookies
    const meReq = new NextRequest("http://localhost:3000/api/admin/auth/me", {
      method: "GET",
      headers: {
        cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessCookie?.value}; ${AUTH_COOKIES.REFRESH_TOKEN}=${refreshCookie?.value}`,
      },
    });

    const meRes = await meHandler(meReq);
    expect(meRes.status).toBe(200);

    const meData = await meRes.json();
    expect(meData.user).toBeDefined();
    expect(meData.user.email).toBe(apiTestEmail);
    expect(meData.user.role).toBe(Role.SUPER_ADMIN);
    expect(meData.user.passwordHash).toBeUndefined();
  });

  it("Case 18: /api/admin/auth/me returns 401 for an invalid session", async () => {
    const meReq = new NextRequest("http://localhost:3000/api/admin/auth/me", {
      method: "GET",
      headers: {
        cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=forged.token.value; ${AUTH_COOKIES.REFRESH_TOKEN}=forged_refresh_token`,
      },
    });

    const meRes = await meHandler(meReq);
    expect(meRes.status).toBe(401);

    const data = await meRes.json();
    expect(data.error).toBeDefined();
  });

  it("Case 15: Logout clears cookies and revokes session", async () => {
    // Login
    const loginReq = new NextRequest(
      "http://localhost:3000/api/admin/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: apiTestEmail,
          password: apiTestPassword,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const loginRes = await loginHandler(loginReq);
    const refreshCookie = loginRes.cookies.get(AUTH_COOKIES.REFRESH_TOKEN);

    // Logout
    const logoutReq = new NextRequest(
      "http://localhost:3000/api/admin/auth/logout",
      {
        method: "POST",
        headers: {
          cookie: `${AUTH_COOKIES.REFRESH_TOKEN}=${refreshCookie?.value}`,
        },
      }
    );

    const logoutRes = await logoutHandler(logoutReq);
    expect(logoutRes.status).toBe(200);

    // Check cookies are cleared (maxAge: 0 or empty)
    const clearedAccess = logoutRes.cookies.get(AUTH_COOKIES.ACCESS_TOKEN);
    const clearedRefresh = logoutRes.cookies.get(AUTH_COOKIES.REFRESH_TOKEN);
    expect(clearedAccess?.value).toBe("");
    expect(clearedRefresh?.value).toBe("");
  });
});
