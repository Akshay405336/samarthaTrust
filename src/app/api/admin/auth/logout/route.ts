import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import { revokeSession, revokeSessionById } from "@/lib/auth/session-service";
import { getClearCookieOptions, verifyAccessToken } from "@/lib/auth/tokens";

export async function POST(request: NextRequest) {
  try {
    const rawRefreshToken = request.cookies.get(
      AUTH_COOKIES.REFRESH_TOKEN
    )?.value;

    if (rawRefreshToken) {
      await revokeSession(rawRefreshToken);
    }

    const rawAccessToken = request.cookies.get(
      AUTH_COOKIES.ACCESS_TOKEN
    )?.value;

    if (rawAccessToken) {
      const payload = await verifyAccessToken(rawAccessToken);
      if (payload?.sessionId) {
        await revokeSessionById(payload.sessionId);
      }
    }

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully." },
      { status: 200 }
    );

    // Clear all auth cookies
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
    console.error("Logout route unhandled error:", error);
    // Still clear cookies on error to ensure client is logged out locally
    const response = NextResponse.json(
      { success: true, message: "Logged out." },
      { status: 200 }
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
}
