import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import {
  verifyAccessToken,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  getClearCookieOptions,
} from "@/lib/auth/tokens";
import {
  validateActiveSession,
  refreshSuperAdminSession,
} from "@/lib/auth/session-service";
import { Role } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

    // 1. Try validating the 15-minute access token first
    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      if (payload && payload.role === Role.SUPER_ADMIN) {
        // Validate active session in database to respect immediate revocation
        const activeUser = await validateActiveSession(payload.sessionId);
        if (activeUser) {
          return NextResponse.json({ user: activeUser }, { status: 200 });
        }
      }
    }

    // 2. If access token is invalid/expired, attempt automatic renewal via refresh token
    const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;
    if (refreshToken) {
      const userAgent = request.headers.get("user-agent") || undefined;
      const ipAddress =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        undefined;

      const refreshResult = await refreshSuperAdminSession(
        refreshToken,
        userAgent,
        ipAddress
      );

      if (refreshResult.success) {
        const response = NextResponse.json(
          { user: refreshResult.user },
          { status: 200 }
        );

        // Set renewed access and rotated refresh cookies
        const accessCookie = getAccessTokenCookieOptions();
        const refreshCookie = getRefreshTokenCookieOptions();

        response.cookies.set(
          accessCookie.name,
          refreshResult.accessToken,
          accessCookie
        );
        response.cookies.set(
          refreshCookie.name,
          refreshResult.refreshToken,
          refreshCookie
        );

        return response;
      }
    }

    // 3. Unauthenticated: clear cookies and return 401
    const response = NextResponse.json(
      { error: "Unauthorized. Session is missing, invalid, or expired." },
      { status: 401 }
    );
    response.cookies.set(
      AUTH_COOKIES.ACCESS_TOKEN,
      "",
      getClearCookieOptions(AUTH_COOKIES.ACCESS_TOKEN)
    );
    response.cookies.set(
      AUTH_COOKIES.REFRESH_TOKEN,
      "",
      getClearCookieOptions(AUTH_COOKIES.REFRESH_TOKEN)
    );

    return response;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      (error as { digest: string }).digest === "NEXT_PRERENDER_INTERRUPTED"
    ) {
      throw error;
    }
    console.error("/api/admin/auth/me unhandled error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
