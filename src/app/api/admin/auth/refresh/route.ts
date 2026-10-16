import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import { refreshSuperAdminSession } from "@/lib/auth/session-service";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  getClearCookieOptions,
} from "@/lib/auth/tokens";

export async function POST(request: NextRequest) {
  try {
    const rawRefreshToken = request.cookies.get(
      AUTH_COOKIES.REFRESH_TOKEN
    )?.value;

    if (!rawRefreshToken) {
      const response = NextResponse.json(
        { error: "No refresh token provided." },
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
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await refreshSuperAdminSession(
      rawRefreshToken,
      userAgent,
      ipAddress
    );

    if (!result.success) {
      // Clear cookies if refresh token is invalid or expired
      const response = NextResponse.json(
        { error: result.error },
        { status: result.statusCode }
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
    }

    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
      },
      { status: 200 }
    );

    // Set rotated refresh token and new access token
    const accessCookie = getAccessTokenCookieOptions();
    const refreshCookie = getRefreshTokenCookieOptions();

    response.cookies.set(accessCookie.name, result.accessToken, accessCookie);
    response.cookies.set(
      refreshCookie.name,
      result.refreshToken,
      refreshCookie
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
    console.error("Refresh route unhandled error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
