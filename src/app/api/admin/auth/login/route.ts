import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { authenticateSuperAdmin } from "@/lib/auth/session-service";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from "@/lib/auth/tokens";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON payload." },
        { status: 400 }
      );
    }

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid email or password format.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await authenticateSuperAdmin(
      email,
      password,
      userAgent,
      ipAddress
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
      },
      { status: 200 }
    );

    // Set secure HttpOnly cookies
    const accessCookie = getAccessTokenCookieOptions();
    const refreshCookie = getRefreshTokenCookieOptions();

    response.cookies.set(accessCookie.name, result.accessToken, accessCookie);
    response.cookies.set(
      refreshCookie.name,
      result.refreshToken,
      refreshCookie
    );

    return response;
  } catch (error) {
    console.error("Login route unhandled error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
