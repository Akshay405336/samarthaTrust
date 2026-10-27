"use client";

import * as React from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { AdminFooter } from "./admin-footer";
import { AdminSessionMonitor } from "./admin-session-monitor";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="admin-shell flex min-h-screen bg-[#F4F0F8]">
      <AdminSessionMonitor />
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-200",
          sidebarCollapsed ? "lg:pl-[5.25rem]" : "lg:pl-64"
        )}
      >
        <AdminHeader
          onMenuToggle={() => setSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarCollapseToggle={() => setSidebarCollapsed((c) => !c)}
        />
        <main className="admin-main flex-1 scroll-mt-16 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
