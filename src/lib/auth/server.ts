import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIES } from "./constants";
import { verifyAccessToken, hashOpaqueToken } from "./tokens";
import { validateActiveSession, type SafeUser } from "./session-service";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@prisma/client";

/**
 * Retrieves the current authenticated Super Admin session in Server Components or Route Handlers.
 * Verifies access token signature and checks database session revocation state.
 */
export async function getAdminSession(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload && payload.role === Role.SUPER_ADMIN) {
      // Validate session revocation in DB
      const user = await validateActiveSession(payload.sessionId);
      if (user) {
        return user;
      }
    }
  }

  // If access token is expired or missing, check refresh token
  const refreshToken = cookieStore.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;
  if (refreshToken) {
    try {
      const tokenHash = hashOpaqueToken(refreshToken);
      const session = await prisma.session.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (
        session &&
        session.revokedAt === null &&
        session.expiresAt > new Date() &&
        session.user.isActive &&
        session.user.role === Role.SUPER_ADMIN
      ) {
        return {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Server-side guard for protected Server Components and layouts.
 * Redirects unauthenticated requests to the admin login page.
 */
export async function requireAdminSession(
  redirectPath = "/admin/login"
): Promise<SafeUser> {
  const user = await getAdminSession();
  if (!user) {
    redirect(redirectPath);
  }
  return user;
}
