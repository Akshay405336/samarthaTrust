"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Images,
  HeartHandshake,
  Calendar,
  Layers,
  Settings,
  Globe,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { resetClientAuthState } from "@/lib/auth/client";

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
    name: "Team Management",
    href: "/admin/team",
    icon: Users,
  },
  {
    name: "Our Works",
    href: "/admin/works",
    icon: Briefcase,
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    name: "Donations",
    href: "/admin/donations",
    icon: HeartHandshake,
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

interface AdminProfile {
  name: string;
  email: string;
  role: string;
}

interface AdminSidebarProps {
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  className,
  mobileOpen = false,
  onMobileClose,
  collapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = React.useState<AdminProfile>({
    name: "Administrator",
    email: "admin@samarthatrust.org",
    role: "ADMIN",
  });
  const [loggingOut, setLoggingOut] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user && isMounted) {
            setProfile({
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
            });
          }
        }
      } catch {
        // keep defaults
      }
    }
    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    resetClientAuthState();
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setLoggingOut(false);
      resetClientAuthState();
      router.replace("/admin/login");
      router.refresh();
    }
  };

  const isCollapsedDesktop = collapsed;

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-[#35123F]/40 backdrop-blur-[2px] lg:hidden"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        className={cn(
          "admin-sidebar fixed inset-y-0 left-0 z-50 flex flex-col text-white shadow-[4px_0_24px_rgba(53,18,63,0.18)] transition-[width,transform] duration-200 lg:fixed",
          isCollapsedDesktop ? "w-[5.25rem]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex h-full flex-col rounded-r-2xl border-r border-white/10 bg-gradient-to-b from-[#4A0075] via-[#7100A8] to-[#9200A8]">
          {/* Brand */}
          <div
            className={cn(
              "flex items-center gap-3 border-b border-white/10 px-4 py-4",
              isCollapsedDesktop && "justify-center px-2"
            )}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1.5">
              <Image
                src="/logo.png"
                alt="Samartha Trust"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            {!isCollapsedDesktop ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold leading-tight">Samartha Trust</p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-pink-100/90">
                  <Shield className="h-3 w-3 shrink-0" aria-hidden="true" />
                  Admin Console
                </p>
              </div>
            ) : null}
            {onToggleCollapse ? (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 lg:inline-flex"
                aria-label={isCollapsedDesktop ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsedDesktop ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            ) : null}
          </div>

          {/* Nav */}
          <div className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {!isCollapsedDesktop ? (
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                Administration
              </p>
            ) : null}
            <nav className="space-y-1" aria-label="Admin navigation">
              {navigationItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onMobileClose}
                    title={isCollapsedDesktop ? item.name : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                      isCollapsedDesktop && "justify-center px-2",
                      isActive
                        ? "bg-white/15 text-white shadow-sm ring-1 ring-white/20"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#E90078]"
                      />
                    ) : null}
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {!isCollapsedDesktop ? (
                      <>
                        <span className="flex-1 truncate">{item.name}</span>
                        {item.badge ? (
                          <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold text-pink-100">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer: profile + public link */}
          <div className="space-y-2 border-t border-white/10 p-3">
            <div
              className={cn(
                "rounded-xl border border-white/10 bg-white/10 p-2.5",
                isCollapsedDesktop && "flex justify-center p-2"
              )}
            >
              {!isCollapsedDesktop ? (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E90078] to-[#FAF5FF] text-[#35123F]">
                    <User className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">{profile.name}</p>
                    <p className="truncate text-[10px] text-white/70">{profile.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-50"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/15"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>

            <Link
              href="/"
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white",
                isCollapsedDesktop && "justify-center px-2"
              )}
              title={isCollapsedDesktop ? "Public website" : undefined}
            >
              <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!isCollapsedDesktop ? <span>Public Website</span> : null}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
