import * as React from "react";
import Link from "next/link";
import { PlusCircle, ExternalLink, ArrowRight } from "lucide-react";

import { AdminPage, AdminPageHeader, AdminStatGrid } from "@/components/admin/admin-page";
import { AdminDashboardCharts } from "@/components/admin/admin-dashboard-charts";
import { AdminDonationDashboard } from "@/components/admin/admin-donation-dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { connection } from "next/server";

import { getAdminDashboardSnapshot } from "@/lib/admin/dashboard-stats";

export default function AdminDashboardPage() {
  return (
    <AdminPage>
      <AdminPageHeader
        breadcrumbs={[{ label: "Overview" }]}
        title="Dashboard"
        description="Operational overview of Samartha Trust content, gallery, team, works, and donations."
        actions={
          <>
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link href="/" target="_blank" className="gap-1.5">
                View live site
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-lg">
              <Link href="/admin/blogs/new" className="gap-1.5">
                <PlusCircle className="h-4 w-4" />
                New blog post
              </Link>
            </Button>
          </>
        }
      />

      <React.Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboardBody />
      </React.Suspense>
    </AdminPage>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <AdminStatGrid columns={4}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="min-h-[7.25rem] rounded-xl bg-white/80" />
        ))}
      </AdminStatGrid>
      <div className="h-80 rounded-xl bg-white/80" />
      <div className="h-72 rounded-xl bg-white/80" />
    </div>
  );
}

async function AdminDashboardBody() {
  await connection();
  const data = await getAdminDashboardSnapshot();
  const { charts, donations, recent } = data;

  return (
    <>
      <AdminDonationDashboard data={donations} part="stats" />

      <AdminDonationDashboard data={donations} part="charts" />

      <AdminDashboardCharts contentActivity={charts.contentActivity} />

      <Card className="admin-panel border-[#EADDED]/90 bg-white shadow-sm">
        <CardHeader className="border-b border-[#EADDED]/70 pb-3">
          <CardTitle className="text-base font-bold text-[#35123F]">Quick actions</CardTitle>
          <CardDescription className="text-xs text-[#75647B]">
            Jump to common create flows
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-4">
          <Button asChild size="sm" variant="outline" className="rounded-lg">
            <Link href="/admin/gallery/new">Add gallery album</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-lg">
            <Link href="/admin/blogs/new">Create blog post</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-lg">
            <Link href="/admin/works/new">Add our works entry</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-lg">
            <Link href="/admin/team/new">Add team member</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentList
          title="Recent gallery updates"
          description="Latest photo changes"
          href="/admin/gallery"
          rows={recent.galleries.map((g) => ({
            id: g.id,
            title: g.altText,
            href: `/admin/gallery/${g.id}/edit`,
            meta: new Date(g.updatedAt).toLocaleDateString("en-IN"),
          }))}
        />
        <RecentList
          title="Recent blog activity"
          description="Latest posts"
          href="/admin/blogs"
          rows={recent.blogs.map((b) => ({
            id: b.id,
            title: b.title,
            href: `/admin/blogs/${b.id}/edit`,
            meta: new Date(b.updatedAt).toLocaleDateString("en-IN"),
          }))}
        />
        <RecentList
          title="Recent our works"
          description="Latest program entries"
          href="/admin/works"
          rows={recent.works.map((w) => ({
            id: w.id,
            title: w.title,
            href: `/admin/works/${w.id}/edit`,
            meta: new Date(w.updatedAt).toLocaleDateString("en-IN"),
          }))}
        />
      </div>
    </>
  );
}

function RecentList({
  title,
  description,
  href,
  rows,
}: {
  title: string;
  description: string;
  href: string;
  rows: {
    id: string;
    title: string;
    href: string;
    meta: string;
  }[];
}) {
  return (
    <Card className="admin-panel border-[#EADDED]/90 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b border-[#EADDED]/70 pb-3">
        <div>
          <CardTitle className="text-sm font-bold text-[#35123F]">{title}</CardTitle>
          <CardDescription className="text-xs text-[#75647B]">{description}</CardDescription>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#9200A8]"
        >
          Manage
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="divide-y divide-[#EADDED]/60 p-0">
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-[#75647B]">No records yet.</p>
        ) : (
          rows.map((row) => (
            <Link
              key={row.id}
              href={row.href}
              className="block px-4 py-3 text-sm outline-none"
            >
              <p className="truncate font-medium text-[#35123F]">{row.title}</p>
              <p className="text-[11px] text-[#75647B]">{row.meta}</p>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
