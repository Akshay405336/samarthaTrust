"use client";

import * as React from "react";
import { Menu, Bell, Search, PanelLeftClose, PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  sidebarCollapsed?: boolean;
  onSidebarCollapseToggle?: () => void;
}

export function AdminHeader({
  onMenuToggle,
  sidebarCollapsed,
  onSidebarCollapseToggle,
}: AdminHeaderProps) {
  return (
    <header className="admin-header sticky top-0 z-30 w-full border-b border-[#EADDED]/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#EADDED] text-[#35123F] transition-colors hover:bg-[#FAF5FF] lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {onSidebarCollapseToggle ? (
            <button
              type="button"
              onClick={onSidebarCollapseToggle}
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-[#EADDED] text-[#35123F] transition-colors hover:bg-[#FAF5FF] lg:inline-flex"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          ) : null}

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75647B]" />
            <input
              type="search"
              readOnly
              aria-label="Quick navigation search"
              placeholder="Quick search modules (coming soon)"
              className="h-9 w-full rounded-xl border border-[#EADDED] bg-[#FAF5FF]/50 pl-9 pr-3 text-xs text-[#35123F] placeholder:text-[#75647B]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]/40"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-[#EADDED] bg-[#FAF5FF] px-3 py-1 text-[11px] font-medium text-[#35123F] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Live
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-[#75647B] hover:bg-[#FAF5FF] hover:text-[#9200A8]"
            aria-label="Notifications (no new notifications)"
            disabled
            title="Notifications coming soon"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
