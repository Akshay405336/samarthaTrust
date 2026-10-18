"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  User,
  Sparkles,
  CheckCircle2,
  Clock,
  Archive,
  ArrowUpDown,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Tag,
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  authorName: string;
  category: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = React.useState<BlogItem[]>([]);
  const [pagination, setPagination] = React.useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL");
  const [sortOrder, setSortOrder] = React.useState<string>("newest");

  // Delete modal state
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deletingTitle, setDeletingTitle] = React.useState<string>("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Notification message
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [reloadKey, setReloadKey] = React.useState(0);
  const reloadBlogs = React.useCallback(() => {
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          sort: sortOrder,
        });

        if (search.trim()) params.set("search", search.trim());
        if (statusFilter !== "ALL") params.set("status", statusFilter);
        if (categoryFilter !== "ALL") params.set("category", categoryFilter);

        const res = await fetch(`/api/admin/blogs?${params.toString()}`);
        const data = await res.json();

        if (active && res.ok && data.success) {
          setBlogs(data.data);
          setPagination(data.pagination);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to fetch blogs:", err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [
    pagination.page,
    pagination.limit,
    search,
    statusFilter,
    categoryFilter,
    sortOrder,
    reloadKey,
  ]);

  // Status counters computed from total items or current view
  const publishedCount = blogs.filter((b) => b.status === "PUBLISHED").length;
  const draftCount = blogs.filter((b) => b.status === "DRAFT").length;
  const archivedCount = blogs.filter((b) => b.status === "ARCHIVED").length;

  // Toggle publish/unpublish
  const handleTogglePublish = async (blog: BlogItem) => {
    const endpoint =
      blog.status === "PUBLISHED"
        ? `/api/admin/blogs/${blog.id}/unpublish`
        : `/api/admin/blogs/${blog.id}/publish`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        showToast(
          blog.status === "PUBLISHED"
            ? "Story unpublished back to draft."
            : "Story published live to public site!"
        );
        reloadBlogs();
      } else {
        alert(data.error || "Action failed.");
      }
    } catch {
      alert("Network error updating publication status.");
    }
  };

  // Toggle featured
  const handleToggleFeature = async (blog: BlogItem) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !blog.isFeatured }),
      });
      if (res.ok) {
        showToast(
          !blog.isFeatured
            ? `"${blog.title}" is now featured on the homepage.`
            : "Removed from featured stories."
        );
        reloadBlogs();
      }
    } catch {
      alert("Network error updating featured state.");
    }
  };

  // Archive story
  const handleArchive = async (blog: BlogItem) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}/archive`, {
        method: "POST",
      });
      if (res.ok) {
        showToast(`"${blog.title}" has been moved to archive.`);
        reloadBlogs();
      }
    } catch {
      alert("Network error archiving story.");
    }
  };

  // Confirm delete
  const executeDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${deletingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Article deleted successfully.");
        setDeletingId(null);
        reloadBlogs();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete article.");
      }
    } catch {
      alert("Network error deleting article.");
    } finally {
      setIsDeleting(false);
    }
  };

  const categories = Array.from(
    new Set([
      "ALL",
      "Education",
      "Healthcare",
      "Skill Development",
      "Community Welfare",
      ...blogs.map((b) => b.category),
    ])
  );

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
            Create, edit, organize, and publish stories and community outreach
            reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="gap-1.5 shadow-sm">
            <Link href="/admin/blogs/new">
              <Plus className="h-4 w-4" />
              <span>Create New Article</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 shadow-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Status Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`cursor-pointer rounded-xl border p-4 transition-all ${
            statusFilter === "ALL"
              ? "border-[#F52232] bg-[#FFF5E6]/60 shadow-xs"
              : "border-[#EADCCB] bg-white hover:border-[#FF8A00]/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78685D]">
              Total Posts
            </span>
            <FileText className="h-4 w-4 text-[#78685D]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#492A22]">
            {pagination.total}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("PUBLISHED")}
          className={`cursor-pointer rounded-xl border p-4 transition-all ${
            statusFilter === "PUBLISHED"
              ? "border-emerald-500 bg-emerald-50/70 shadow-xs"
              : "border-[#EADCCB] bg-white hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Published
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#492A22]">
            {publishedCount}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("DRAFT")}
          className={`cursor-pointer rounded-xl border p-4 transition-all ${
            statusFilter === "DRAFT"
              ? "border-amber-400 bg-amber-50/70 shadow-xs"
              : "border-[#EADCCB] bg-white hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Drafts
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#492A22]">
            {draftCount}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("ARCHIVED")}
          className={`cursor-pointer rounded-xl border p-4 transition-all ${
            statusFilter === "ARCHIVED"
              ? "border-stone-400 bg-stone-100/70 shadow-xs"
              : "border-[#EADCCB] bg-white hover:border-stone-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Archived
            </span>
            <Archive className="h-4 w-4 text-stone-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#492A22]">
            {archivedCount}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-[#EADCCB] bg-white shadow-2xs">
        <CardHeader className="p-4 sm:p-6 pb-3 border-b border-[#EADCCB]/70">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#78685D]" />
              <Input
                placeholder="Search by title, excerpt, content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 border-[#EADCCB] text-xs focus-visible:ring-[#F52232]"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#78685D]">
                <Tag className="h-3.5 w-3.5 text-[#F52232]" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-md border border-[#EADCCB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#492A22] focus:ring-1 focus:ring-[#F52232]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "ALL" ? "All Categories" : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-1.5 text-xs text-[#78685D]">
                <ArrowUpDown className="h-3.5 w-3.5 text-[#FF8A00]" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="rounded-md border border-[#EADCCB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#492A22] focus:ring-1 focus:ring-[#F52232]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Alphabetical (A-Z)</option>
                  <option value="published">Publication Date</option>
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={reloadBlogs}
                className="h-8 gap-1 text-xs"
                title="Refresh list"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#F52232]" />
              <p className="text-xs text-[#78685D]">
                Loading blog posts from database...
              </p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB]">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#492A22]">
                No blog posts found
              </h3>
              <p className="text-xs text-[#78685D] max-w-sm">
                No articles match your current search and filter criteria. You
                can create a new story or clear the active filters.
              </p>
              <Button asChild size="sm" className="mt-2">
                <Link href="/admin/blogs/new" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span>Create First Post</span>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FFFCF5] text-xs uppercase tracking-wider text-[#78685D] border-b border-[#EADCCB]">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-bold">
                      Article & Slug
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-bold">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-bold">
                      Author
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-bold">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 font-bold text-center"
                    >
                      Featured
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-bold">
                      Published Date
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 font-bold text-right"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADCCB]/60">
                  {blogs.map((blog) => {
                    const isPublished = blog.status === "PUBLISHED";
                    const isDraft = blog.status === "DRAFT";

                    return (
                      <tr
                        key={blog.id}
                        className="hover:bg-[#FFF5E6]/30 transition-colors group"
                      >
                        {/* Article with Thumbnail */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-[#EADCCB] bg-[#FFF5E6]">
                              {blog.coverImage ? (
                                <Image
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#78685D]">
                                  <FileText className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs sm:max-w-sm">
                              <Link
                                href={`/admin/blogs/${blog.id}/edit`}
                                className="font-bold text-[#492A22] hover:text-[#F52232] transition-colors line-clamp-1 block text-sm"
                              >
                                {blog.title}
                              </Link>
                              <span className="text-[11px] text-[#78685D] font-mono block truncate">
                                /blog/{blog.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5">
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold"
                          >
                            {blog.category}
                          </Badge>
                        </td>

                        {/* Author */}
                        <td className="px-4 py-3.5 text-xs text-[#78685D]">
                          <span className="flex items-center gap-1.5 font-medium">
                            <User className="h-3 w-3 text-[#FF8A00]" />
                            <span className="truncate max-w-[120px]">
                              {blog.authorName}
                            </span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          {isPublished && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                              <span>Published</span>
                            </span>
                          )}
                          {isDraft && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                              <span>Draft</span>
                            </span>
                          )}
                          {blog.status === "ARCHIVED" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-700 border border-stone-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-stone-500" />
                              <span>Archived</span>
                            </span>
                          )}
                        </td>

                        {/* Featured Toggle */}
                        <td className="px-3 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeature(blog)}
                            className="cursor-pointer p-1 rounded hover:bg-[#FFF5E6] transition-colors"
                            title={
                              blog.isFeatured ? "Unfeature" : "Mark as featured"
                            }
                          >
                            <Sparkles
                              className={`h-4 w-4 mx-auto ${
                                blog.isFeatured
                                  ? "text-[#FF8A00] fill-[#FF8A00]"
                                  : "text-[#EADCCB] hover:text-[#FF8A00]"
                              }`}
                            />
                          </button>
                        </td>

                        {/* Published Date */}
                        <td className="px-4 py-3.5 text-xs text-[#78685D]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-[#F52232]" />
                            <span>
                              {blog.publishedAt
                                ? new Date(blog.publishedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : "Not published"}
                            </span>
                          </span>
                        </td>

                        {/* Row Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Public Link */}
                            {isPublished && (
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#78685D] hover:text-[#492A22]"
                                title="View public page"
                              >
                                <Link
                                  href={`/blog/${blog.slug}`}
                                  target="_blank"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            )}

                            {/* Edit */}
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#78685D] hover:text-[#F52232]"
                              title="Edit article"
                            >
                              <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Edit className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            {/* Toggle Publish / Draft */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleTogglePublish(blog)}
                              className="h-8 w-8 text-[#78685D] hover:text-[#10B981]"
                              title={
                                isPublished
                                  ? "Unpublish to draft"
                                  : "Publish article"
                              }
                            >
                              <CheckCircle2
                                className={`h-3.5 w-3.5 ${isPublished ? "text-emerald-600" : ""}`}
                              />
                            </Button>

                            {/* Archive */}
                            {blog.status !== "ARCHIVED" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleArchive(blog)}
                                className="h-8 w-8 text-[#78685D] hover:text-[#78685D]"
                                title="Move to archive"
                              >
                                <Archive className="h-3.5 w-3.5" />
                              </Button>
                            )}

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeletingId(blog.id);
                                setDeletingTitle(blog.title);
                              }}
                              className="h-8 w-8 text-[#78685D] hover:text-red-600"
                              title="Delete permanently"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && blogs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#EADCCB]/70 px-6 py-4 text-xs text-[#78685D] gap-3">
              <div>
                Showing Page{" "}
                <span className="font-bold text-[#492A22]">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#492A22]">
                  {pagination.totalPages}
                </span>{" "}
                ({pagination.total} total articles)
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  className="h-8 text-xs"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: p }))
                      }
                      className={`h-8 w-8 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                        pagination.page === p
                          ? "bg-[#F52232] text-white shadow-2xs"
                          : "text-[#78685D] hover:bg-[#FFF5E6] hover:text-[#492A22]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  className="h-8 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#EADCCB] bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#492A22]">
                  Delete Article Permanently?
                </h3>
                <p className="text-xs text-[#78685D] leading-relaxed">
                  Are you sure you want to permanently delete:
                  <br />
                  <strong className="text-[#492A22]">{deletingTitle}</strong>?
                  <br />
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EADCCB]">
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => {
                  setDeletingId(null);
                  setDeletingTitle("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={executeDelete}
                className="gap-1.5"
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                <span>Delete Permanently</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
