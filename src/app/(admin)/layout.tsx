import * as React from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/auth/server";

// Next.js 16 with Cache Components: opt out of instant static prerendering for dynamic auth-protected routes
export const instant = false;

export const metadata: Metadata = {
  title: "Admin Management Console",
  description:
    "Internal administration and content management for Samartha Trust.",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enforce server-side session authentication boundary
  await requireAdminSession();

  return <AdminShell>{children}</AdminShell>;
}
