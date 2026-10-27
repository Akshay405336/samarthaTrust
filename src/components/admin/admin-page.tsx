import * as React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/admin/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AdminPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1600px] space-y-5 pb-8", className)}>
      {children}
    </div>
  );
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  badge,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-3">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-[#35123F] sm:text-2xl lg:text-[1.65rem]">
              {title}
            </h1>
            {badge}
          </div>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#75647B]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}

interface AdminStatCardProps {
  label: string;
  value: string | number;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  href?: string;
  tone?: "default" | "success" | "warning" | "brand";
}

const toneStyles = {
  default: "text-[#35123F]",
  success: "text-emerald-600",
  warning: "text-amber-600",
  brand: "text-[#9200A8]",
} as const;

export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "default",
}: AdminStatCardProps) {
  const body = (
    <Card className="admin-stat-card admin-panel h-full min-h-[7.25rem] border-[#EADDED]/90 bg-white shadow-sm">
      <CardContent className="flex h-full flex-col p-4 sm:p-5">
        <div className="flex flex-1 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#75647B]">
              {label}
            </p>
            <p
              className={cn(
                "mt-1.5 text-xl font-bold tabular-nums leading-tight tracking-tight sm:text-2xl",
                toneStyles[tone]
              )}
            >
              {value}
            </p>
            {hint ? (
              <div className="mt-1 min-h-[1rem] text-xs text-[#75647B]">{hint}</div>
            ) : (
              <div className="mt-1 min-h-[1rem]" aria-hidden="true" />
            )}
          </div>
          {Icon ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EADDED] bg-[#FAF5FF] text-[#9200A8]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9200A8]/40"
      >
        {body}
      </Link>
    );
  }

  return body;
}

export function AdminStatGrid({
  children,
  columns = 4,
}: {
  children: React.ReactNode;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "admin-stat-grid grid grid-cols-2 gap-3 auto-rows-fr lg:gap-4 [&>*]:h-full",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
}

export function AdminToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("admin-panel border-[#EADDED]/90 bg-white p-3 shadow-sm sm:p-4", className)}>
      {children}
    </Card>
  );
}

export function AdminTableCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "admin-panel overflow-hidden border-[#EADDED]/90 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </Card>
  );
}
