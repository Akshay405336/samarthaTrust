"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#EADCCB] bg-white px-4 sm:px-6 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex items-center justify-center rounded-md p-2 text-[#492A22] hover:bg-[#FFF5E6] lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-[#492A22] hidden sm:inline-block">
          Management Console
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#EADCCB] bg-[#FFF5E6]/60 px-3 py-1 text-xs text-[#492A22]">
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-medium">System Active</span>
        </div>

        {/* Notifications placeholder */}
        <Button
          variant="ghost"
          size="icon"
          className="text-[#78685D] hover:text-[#F52232]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* User profile dropdown placeholder */}
        <div className="flex items-center gap-2.5 border-l border-[#EADCCB] pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#F52232] to-[#FF8A00] text-white text-xs font-bold shadow-2xs">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:flex flex-col text-left text-xs">
            <span className="font-bold text-[#492A22]">Super Admin</span>
            <span className="text-[11px] text-[#78685D]">
              admin@samarthatrust.org
            </span>
          </div>
          <Link
            href="/admin/login"
            className="ml-1 inline-flex items-center justify-center rounded-md p-1.5 text-[#78685D] hover:bg-red-50 hover:text-[#F52232] transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
