import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Info,
  Calendar,
  User,
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const articles = [
  {
    id: "1",
    title:
      "Annual Education Drive: Distributing Learning Kits to Rural Students",
    slug: "annual-education-drive-2026",
    category: "Education",
    author: "Samartha Outreach Team",
    published: true,
    publishedAt: "Oct 10, 2026",
  },
  {
    id: "2",
    title: "Community Preventive Health Camp Highlights & Impact",
    slug: "preventive-health-camp-recap",
    category: "Healthcare",
    author: "Medical Advisory Committee",
    published: true,
    publishedAt: "Sep 24, 2026",
  },
  {
    id: "3",
    title: "Empowering Rural Women Through Sustainable Handicraft Training",
    slug: "women-vocational-handicraft-program",
    category: "Skill Development",
    author: "Livelihood Initiative Lead",
    published: true,
    publishedAt: "Aug 18, 2026",
  },
  {
    id: "4",
    title: "Installing Sustainable Potable Water Filters in Rural Hamlets",
    slug: "clean-water-community-initiative",
    category: "Community Welfare",
    author: "Welfare Coordinator",
    published: true,
    publishedAt: "Jul 12, 2026",
  },
  {
    id: "5",
    title: "Monsoon Relief & Safe Drinking Water Distribution Plan",
    slug: "monsoon-relief-plan",
    category: "Community Welfare",
    author: "Disaster Response Volunteer",
    published: false,
    publishedAt: "Not published",
  },
];

export default function AdminBlogsPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Blogs & Articles" }]} />

      {/* Header and CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#492A22] sm:text-3xl">
            Blog & Article Management
          </h1>
          <p className="text-sm text-[#78685D] mt-0.5">
            Manage stories, community reports, and press updates published to
            the public website.
          </p>
        </div>

        <div>
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Article</span>
          </Button>
        </div>
      </div>

      {/* Notice */}
      <div className="rounded-xl border border-[#EADCCB] bg-[#FFF5E6]/80 p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-[#FF8A00] shrink-0 mt-0.5" />
          <div className="text-xs text-[#492A22] leading-relaxed">
            <strong>Foundation View:</strong> This interface displays the layout
            and data-table structure for blog management. Full database CRUD
            endpoints (`/api/admin/blogs`) and WYSIWYG editor integration will
            be connected after the authentication system is finalized.
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <Card className="border border-[#EADCCB] bg-white shadow-2xs">
        <CardHeader className="p-4 sm:p-6 pb-3 border-b border-[#EADCCB]/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#78685D]" />
              <Input
                placeholder="Search articles..."
                className="pl-9 h-9 border-[#EADCCB] focus-visible:ring-[#F52232]"
              />
            </div>
            <div className="text-xs font-medium text-[#78685D]">
              Total {articles.length} posts
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FFFCF5] text-xs uppercase tracking-wider text-[#78685D] border-b border-[#EADCCB]">
                <tr>
                  <th scope="col" className="px-6 py-3.5 font-bold">
                    Article Title
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-bold">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-bold">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-bold">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-bold">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-bold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADCCB]/60">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-[#FFF5E6]/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-[#492A22]">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-[#F52232] shrink-0" />
                        <span className="line-clamp-1">{article.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#78685D]">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-[#FF8A00]" />
                        <span>{article.author}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={article.published ? "warm" : "warning"}>
                        {article.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#78685D]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-[#FF8A00]" />
                        <span>{article.publishedAt}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#78685D] hover:text-[#492A22]"
                          title="Preview public page"
                        >
                          <Link href="/blog" target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#78685D] hover:text-[#492A22]"
                          title="Edit article"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#78685D] hover:text-[#F52232]"
                          title="Delete article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
