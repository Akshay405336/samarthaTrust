"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Layers,
  Settings,
  Globe,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Blog Management",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    name: "Programs (Upcoming)",
    href: "/admin?view=programs",
    icon: Layers,
    badge: "Soon",
  },
  {
    name: "Events & Drives",
    href: "/admin?view=events",
    icon: Calendar,
    badge: "Soon",
  },
  {
    name: "Settings",
    href: "/admin?view=settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({
  className,
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-[#EADCCB] bg-white text-[#492A22] transition-transform duration-200 lg:static lg:translate-x-0 shadow-xl lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center gap-3 border-b border-[#EADCCB] px-6">
          <div className="relative h-9 w-9 rounded-lg bg-[#FFF5E6] p-1 shrink-0 border border-[#EADCCB] shadow-2xs">
            <Image
              src="/logo.png"
              alt="Samartha Trust Logo"
              width={36}
              height={36}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <span className="font-bold text-[#492A22] text-sm tracking-tight leading-none block">
              Samartha Trust
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#F52232] mt-0.5">
              <Shield className="h-3 w-3" />
              <span>Admin Console</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-[#78685D]">
            Administration
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-[#F52232] to-[#FF8A00] text-white shadow-xs font-semibold"
                      : "text-[#78685D] hover:bg-[#FFF5E6] hover:text-[#F52232]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-[#FFF5E6] px-2 py-0.5 text-[10px] font-semibold text-[#F52232] border border-[#EADCCB]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Public site link and footer */}
        <div className="border-t border-[#EADCCB] p-4 bg-white">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#78685D] transition-colors hover:bg-[#FFF5E6] hover:text-[#F52232]"
          >
            <Globe className="h-4 w-4 text-[#F52232]" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
