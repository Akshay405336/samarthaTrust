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
    // If the request has ?from=..., it indicates the client was directed here due to an unauthenticated
    // or revoked session. Never redirect back to /admin in this case to prevent infinite redirect loops.
    // Also clear any stale auth cookies from the browser response.
    const fromParam = request.nextUrl.searchParams.get("from");
    if (fromParam) {
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIES.ACCESS_TOKEN);
      response.cookies.delete(AUTH_COOKIES.REFRESH_TOKEN);
      return response;
    }

    // If the admin is already authenticated with a valid access token and not arriving from a redirect,
    // take them to the dashboard.
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
      redirectUrl.searchParams.set("from", targetDestination);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete(AUTH_COOKIES.ACCESS_TOKEN);
      response.cookies.delete(AUTH_COOKIES.REFRESH_TOKEN);
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
