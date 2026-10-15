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

const statCards = [
  {
    title: "Blog & Field Updates",
    value: "4 Articles",
    subtitle: "3 Published, 1 In Draft",
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
    subtitle: "Prisma ORM Models Ready",
    icon: Database,
    href: "#",
    color: "text-[#492A22] bg-[#FFF5E6] border border-[#EADCCB]",
  },
];

const recentBlogPosts = [
  {
    id: "1",
    title:
      "Annual Education Drive: Distributing Learning Kits to Rural Students",
    category: "Education",
    status: "Published",
    date: "Oct 10, 2026",
  },
  {
    id: "2",
    title: "Community Preventive Health Camp Highlights & Impact",
    category: "Healthcare",
    status: "Published",
    date: "Sep 24, 2026",
  },
  {
    id: "3",
    title: "Empowering Rural Women Through Sustainable Handicraft Training",
    category: "Skill Development",
    status: "Published",
    date: "Aug 18, 2026",
  },
  {
    id: "4",
    title: "Monsoon Relief & Safe Drinking Water Distribution Plan",
    category: "Community Welfare",
    status: "Draft",
    date: "Drafting",
  },
];

export default function AdminDashboardPage() {
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
            <Link href="/admin/blogs" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              <span>Manage Blogs</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Technical Notice Banner */}
      <div className="rounded-xl border border-[#EADCCB] bg-[#FFF5E6]/80 p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[#F52232] mt-0.5 shrink-0" />
          <div className="text-xs text-[#492A22] leading-relaxed">
            <span className="font-bold">Technical Foundation Phase:</span> This
            admin layout is structurally separated from public routes. Real
            server-side session authentication with Super Admin database hashing
            and Prisma database migrations will be connected in subsequent
            steps.
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
              <Link href="/admin/blogs">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="divide-y divide-[#EADCCB]/60 text-sm">
              {recentBlogPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-[#492A22] hover:text-[#F52232] transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#78685D]">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <div>
                    <Badge
                      variant={post.status === "Published" ? "warm" : "warning"}
                    >
                      {post.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Foundation Checklist */}
        <Card className="lg:col-span-4 border border-[#EADCCB] bg-white shadow-2xs">
          <CardHeader className="border-b border-[#EADCCB]/70">
            <CardTitle className="text-base font-bold text-[#492A22]">
              System Architecture Status
            </CardTitle>
            <CardDescription className="text-xs text-[#78685D]">
              Project foundation checklist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs pt-4">
            <div className="flex items-center justify-between border-b border-[#EADCCB]/60 pb-2.5">
              <span className="text-[#78685D]">App Router Architecture</span>
              <Badge variant="warm">Configured</Badge>
            </div>
            <div className="flex items-center justify-between border-b border-[#EADCCB]/60 pb-2.5">
              <span className="text-[#78685D]">Tailwind CSS & Brand Theme</span>
              <Badge variant="warm">Active</Badge>
            </div>
            <div className="flex items-center justify-between border-b border-[#EADCCB]/60 pb-2.5">
              <span className="text-[#78685D]">Prisma Client & Schema</span>
              <Badge variant="warm">Generated</Badge>
            </div>
            <div className="flex items-center justify-between border-b border-[#EADCCB]/60 pb-2.5">
              <span className="text-[#78685D]">Seed Foundation</span>
              <Badge variant="warm">Prepared</Badge>
            </div>
            <div className="flex items-center justify-between border-b border-[#EADCCB]/60 pb-2.5">
              <span className="text-[#78685D]">API Health Check</span>
              <Badge variant="warm">GET /api/health</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#78685D]">Auth & Blog CRUD</span>
              <Badge variant="warning">Next Phase</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
