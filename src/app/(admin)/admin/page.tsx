import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Layers,
  MessageSquare,
  Database,
  ArrowUpRight,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db/prisma";

export default async function AdminDashboardPage() {
  const [totalBlogs, publishedBlogs, draftBlogs, recentBlogPosts] =
    await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: "PUBLISHED" } }),
      prisma.blog.count({ where: { status: "DRAFT" } }),
      prisma.blog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          status: true,
          createdAt: true,
          publishedAt: true,
        },
      }),
    ]);

  const statCards = [
    {
      title: "Blog & Field Updates",
      value: `${totalBlogs} Articles`,
      subtitle: `${publishedBlogs} Published, ${draftBlogs} In Draft`,
      icon: FileText,
      href: "/admin/blogs",
      color: "text-[#F52232] bg-[#FFF5E6] border border-[#EADCCB]",
    },
    {
      title: "Core Programs",
      value: "4 Initiatives",
      subtitle: "Education, Health, Skills, Welfare",
      icon: Layers,
      href: "/programs",
      color: "text-[#FF8A00] bg-[#FFF5E6] border border-[#EADCCB]",
    },
    {
      title: "Contact Inquiries",
      value: "Active",
      subtitle: "Zod Schema Validated",
      icon: MessageSquare,
      href: "/contact",
      color: "text-[#E68A00] bg-[#FFF5E6] border border-[#EADCCB]",
    },
    {
      title: "Database Engine",
      value: "PostgreSQL",
      subtitle: "Prisma ORM Models Live",
      icon: Database,
      href: "#",
      color: "text-[#492A22] bg-[#FFF5E6] border border-[#EADCCB]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Overview" }]} />

      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#492A22] sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#78685D] mt-0.5">
            Operational and content management overview for Samartha Trust.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/" target="_blank" className="gap-1.5">
              <span>View Live Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/blogs/new" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              <span>New Article</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Operational Notice Banner */}
      <div className="rounded-xl border border-[#EADCCB] bg-[#FFF5E6]/80 p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[#F52232] mt-0.5 shrink-0" />
          <div className="text-xs text-[#492A22] leading-relaxed">
            <span className="font-bold">
              Production Management System Active:
            </span>{" "}
            Real-time PostgreSQL database connection with Super Admin session
            protection, dynamic blog content publishing, and media management is
            running.
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border border-[#EADCCB] bg-white shadow-2xs"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <Link
                    href={stat.href}
                    className="text-[#78685D] hover:text-[#F52232] transition-colors"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-[#492A22]">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-bold text-[#492A22] mt-0.5">
                    {stat.title}
                  </p>
                  <p className="text-xs text-[#78685D] mt-1">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8 border border-[#EADCCB] bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#EADCCB]/70">
            <div>
              <CardTitle className="text-base font-bold text-[#492A22]">
                Recent Blog & Article Status
              </CardTitle>
              <CardDescription className="text-xs text-[#78685D]">
                Overview of published and drafting articles in CMS
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/blogs">Manage All</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {recentBlogPosts.length === 0 ? (
              <p className="text-xs text-[#78685D] py-4 text-center">
                No articles yet. Click &quot;New Article&quot; to create one.
              </p>
            ) : (
              <div className="divide-y divide-[#EADCCB]/60 text-sm">
                {recentBlogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between py-3.5"
                  >
                    <div className="space-y-1">
                      <Link
                        href={`/admin/blogs/${post.id}/edit`}
                        className="font-semibold text-[#492A22] hover:text-[#F52232] transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-[#78685D]">
                        <span className="font-medium">{post.category}</span>
                        <span>•</span>
                        <span>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : new Date(post.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Badge
                        variant={
                          post.status === "PUBLISHED"
                            ? "warm"
                            : post.status === "DRAFT"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Foundation Checklist */}
        <Card className="lg:col-span-4 border border-[#EADCCB] bg-white shadow-2xs">
          <CardHeader className="border-b border-[#EADCCB]/70">
            <CardTitle className="text-base font-bold text-[#492A22]">
              System Architecture Status
            </CardTitle>
            <CardDescription className="text-xs text-[#78685D]">
              Platform capability checklist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs pt-4">
            <div className="flex items-center justify-between border-b border-[#EADCCB]/60 pb-2.5">
              <span className="text-[#78685D]">Super Admin Auth</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Active</span>
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#EADCCB]/60 pb-2.5">
              <span className="text-[#78685D]">Prisma Blog Model</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Migrated</span>
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#EADCCB]/60 pb-2.5">
              <span className="text-[#78685D]">Dynamic Blog CRUD</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Ready</span>
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#EADCCB]/60 pb-2.5">
              <span className="text-[#78685D]">Media Uploads</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Enabled</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#78685D]">Public Integration</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Connected</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
