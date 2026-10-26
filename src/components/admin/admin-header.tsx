"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetClientAuthState } from "@/lib/auth/client";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

interface AdminProfile {
  name: string;
  email: string;
  role: string;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const [profile, setProfile] = React.useState<AdminProfile>({
    name: "Super Admin",
    email: "admin@samarthatrust.org",
    role: "SUPER_ADMIN",
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
        // Fallback to default state
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    resetClientAuthState();
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setLoggingOut(false);
      resetClientAuthState();
      router.replace("/admin/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#EADDED] bg-white px-4 sm:px-6 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex items-center justify-center rounded-md p-2 text-[#35123F] hover:bg-[#FAF5FF] lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-[#35123F] hidden sm:inline-block">
          Management Console
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#EADDED] bg-[#FCE7F3]/60 px-3 py-1 text-xs text-[#35123F]">
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-medium">System Active</span>
        </div>

        {/* Notifications placeholder */}
        <Button
          variant="ghost"
          size="icon"
          className="text-[#75647B] hover:text-[#9200A8]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* User profile dropdown and real logout */}
        <div className="flex items-center gap-2.5 border-l border-[#EADDED] pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078] text-white text-xs font-bold shadow-2xs">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:flex flex-col text-left text-xs">
            <span className="font-bold text-[#35123F]">{profile.name}</span>
            <span className="text-[11px] text-[#75647B]">{profile.email}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="ml-1 inline-flex items-center justify-center rounded-md p-1.5 text-[#75647B] hover:bg-red-50 hover:text-[#DC2626] transition-colors cursor-pointer disabled:opacity-50"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
