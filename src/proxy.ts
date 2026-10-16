import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import { verifyAccessToken } from "@/lib/auth/tokens";

// Explicitly public auth API endpoints that do not require an active session
const PUBLIC_AUTH_APIS = [
  "/api/admin/auth/login",
  "/api/admin/auth/refresh",
  "/api/admin/auth/logout",
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Allow public authentication API routes
  if (PUBLIC_AUTH_APIS.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

  let hasValidAccessToken = false;
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload && payload.role === "SUPER_ADMIN") {
      hasValidAccessToken = true;
    }
  }

  // 2. Handle /admin/login page
  if (pathname === "/admin/login") {
    // If the admin is already authenticated with a valid access token, redirect them to dashboard.
    // Do not redirect based solely on refresh cookie to avoid redirect loops if the session is revoked.
    if (hasValidAccessToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // 3. Handle protected admin API routes (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    if (!hasValidAccessToken && !refreshToken) {
      return NextResponse.json(
        { error: "Unauthorized access. Authentication is required." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 4. Handle protected admin UI pages (/admin, /admin/*)
  if (pathname.startsWith("/admin")) {
    // If neither access token nor refresh token is present, redirect to login
    if (!hasValidAccessToken && !refreshToken) {
      const targetDestination = pathname + search;
      const redirectUrl = new URL("/admin/login", request.url);
      if (targetDestination !== "/admin") {
        redirectUrl.searchParams.set("from", targetDestination);
      }
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
