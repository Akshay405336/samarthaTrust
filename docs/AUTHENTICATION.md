# Samartha Trust - Production-Grade Admin Authentication Guide

This document provides complete instructions for configuring, operating, and maintaining the Super Admin authentication system in the Samartha Trust application.

---

## 1. Architecture Overview

The authentication system employs a secure cookie-based session strategy:

- **Public Customer Website**: Completely open, no authentication required.
- **Admin Portal (`/admin/*`)**: Strictly restricted to accounts with the `SUPER_ADMIN` role.
- **Short-Lived Access Session**: 15 minutes (`samartha_access_token`), signed with HMAC SHA-256 (`jose`) and transmitted as an `HttpOnly`, `SameSite=Lax`, `Path=/` cookie.
- **Rotating Refresh Session**: 7 days (`samartha_refresh_token`), 64-character cryptographically secure opaque token hashed via SHA-256 in the PostgreSQL `sessions` table.
- **Automatic Session Renewal**: When the 15-minute access token expires, the client and server seamlessly refresh the session using the 7-day refresh token without disrupting active admins.
- **Strict Revocation**: Explicit logout immediately marks the session as revoked in PostgreSQL and destroys all authentication cookies.

---

## 2. Environment Variables & PostgreSQL Setup

Configure the following variables in `.env` (refer to `.env.example` for templates):

```env
# PostgreSQL Database Connection URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/samartha_trust?schema=public"

# Next.js Application Environment
NEXT_PUBLIC_APP_NAME="Samartha Trust"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Super Admin Initial Seed Credentials
SUPER_ADMIN_EMAIL="admin@samarthatrust.org"
SUPER_ADMIN_NAME="Samartha Trust Super Admin"
SUPER_ADMIN_PASSWORD="YourStrongInitialPassword_Min8Chars!"

# Authentication & Session Secrets (Must be at least 32 characters)
AUTH_SECRET="your-cryptographically-secure-random-secret-at-least-32-chars-long"
```

To generate a secure 64-character random `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 3. Applying Database Migrations

Run the Prisma migration command to ensure PostgreSQL is synchronized with the schema:

```bash
pnpm db:migrate
```

Or generate the client directly if migrations are already applied:

```bash
pnpm db:generate
```

---

## 4. Seeding the Initial Super Admin

To create the first Super Admin account:

1. Ensure `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_NAME`, and `SUPER_ADMIN_PASSWORD` are configured in `.env`.
2. Run the idempotent seed command:
   ```bash
   pnpm db:seed
   ```
3. The seed script:
   - Validates that all credentials meet security standards (password $\ge$ 8 characters).
   - Hashes the password using `bcrypt` with work factor 12.
   - Normalizes the email to lowercase and trimmed format.
   - Creates the account with `role: Role.SUPER_ADMIN` and `isActive: true`.
   - **Idempotency**: Repeated runs detect existing accounts and **never** overwrite or reset passwords.

---

## 5. How to Sign In

1. Open the browser to `/admin/login`.
2. Enter the Super Admin email address (`admin@samarthatrust.org`).
3. Enter the configured password.
   - Use the accessible **eye icon** to toggle password visibility.
4. Click **Enter Admin Dashboard**.
5. Upon successful verification, secure cookies are set and you will be redirected to `/admin`.

---

## 6. How to Safely Change the Admin Password

To change a user's password in production without resetting the database:

Create or execute a safe maintenance script:

```ts
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./src/lib/auth/password";
import { revokeAllUserSessions } from "./src/lib/auth/session-service";

const prisma = new PrismaClient();

async function updatePassword(email: string, newPlaintextPassword: string) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) throw new Error("User not found");

  const newHash = await hashPassword(newPlaintextPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  // Revoke all existing sessions to enforce re-login with the new password
  await revokeAllUserSessions(user.id);
  console.log("Password updated and existing sessions revoked.");
}
```

---

## 7. Session Lifecycle & Expiration Rules

1. **Access Token (15 minutes)**:
   - Checked first on every protected route.
   - Self-contained and fast.
2. **Refresh Token (7 days)**:
   - Evaluated when the access token expires.
   - Verified against the PostgreSQL `sessions` table.
   - Rotated with every refresh call to protect against token reuse/replay.
   - The absolute 7-day expiration from initial login is strictly enforced.
3. **Logout**:
   - Calling `POST /api/admin/auth/logout` sets `revokedAt = NOW()` in PostgreSQL.
   - Clears both cookies (`maxAge = 0`).
   - Any further attempt to use the old refresh token will fail with HTTP 401.

---

## 8. Route Protection Boundaries

- **Next.js 16 Proxy (`src/proxy.ts`)**:
  - Intercepts requests matching `/admin/:path*` and `/api/admin/:path*`.
  - Redirects unauthenticated visitors to `/admin/login?from=...`.
  - Prevents open redirects by sanitizing and validating internal destination paths.
  - Public pages (`/`, `/about`, `/contact`, `/programs`, `/blog`, `/our-trustees`, `/our-works`) are never intercepted.
- **Server Component Layout Guard (`src/app/(admin)/layout.tsx`)**:
  - Defense-in-depth: invokes `requireAdminSession()` on the server before rendering the admin layout shell.

---

## 9. Rate Limiting & Production Scaling

- **Built-in Rate Limiter (`src/lib/auth/rate-limiter.ts`)**:
  - Implements an in-memory sliding window that permits 5 attempts per 15-minute window per IP/email.
  - Exceeded attempts return HTTP 429 (`Too many login attempts`).
  - Cleared upon successful login.
- **Multi-Instance / Distributed Deployments**:
  - The rate-limiting abstraction supports Redis integration if `REDIS_URL` is set in multi-container setups.

---

## 10. Running Automated Authentication Tests

The comprehensive test suite covers all 22 required authentication, security, and edge-case scenarios:

```bash
pnpm test
```

Test coverage includes:

- Super Admin login verification.
- Password mismatch rejection.
- Unknown user rejection.
- Inactive user and non-Super-Admin role blocking.
- Password hash omission (zero credential leakage).
- 15-minute access token renewal via active refresh sessions.
- 7-day session expiration and revocation enforcement.
- Cookie configuration (`HttpOnly`, `SameSite=Lax`, `Path=/`).
- Open-redirect mitigation and URL sanitization.
- Route protection in Next.js 16 Proxy.
- Password toggle state machine.
