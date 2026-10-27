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
  Power,
  PowerOff,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Tag,
} from "lucide-react";
import {
  AdminPage,
  AdminPageHeader,
  AdminTableCard,
  AdminToolbar,
} from "@/components/admin/admin-page";
import { CardContent, CardHeader } from "@/components/ui/card";
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

interface ToastState {
  message: string;
  type: "success" | "error";
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

  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [actionLoadingIds, setActionLoadingIds] = React.useState<
    Record<string, string>
  >({});

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL");
  const [sortOrder, setSortOrder] = React.useState<string>("newest");

  // Delete modal state
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deletingTitle, setDeletingTitle] = React.useState<string>("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Notification message
  const [toast, setToast] = React.useState<ToastState | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch blogs when filter, search, sort, or page changes
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
          showToast("Failed to load blog posts.", "error");
        }
      } finally {
        if (active) {
          setInitialLoading(false);
          setIsRefreshing(false);
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
  ]);

  // Manual refresh without disruptive full-table reload or loss of filter settings
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

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

      if (res.ok && data.success) {
        setBlogs(data.data);
        setPagination(data.pagination);
        showToast("Blog records refreshed from database.", "success");
      } else {
        showToast(data.error || "Failed to refresh blogs.", "error");
      }
    } catch {
      showToast("Network error refreshing blogs.", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle publish / unpublish with targeted row update and authoritative database persistence
  const handleTogglePublish = async (blog: BlogItem) => {
    if (actionLoadingIds[blog.id]) return;

    setActionLoadingIds((prev) => ({ ...prev, [blog.id]: "publish" }));
    const isPublished = blog.status === "PUBLISHED";
    const endpoint = isPublished
      ? `/api/admin/blogs/${blog.id}/unpublish`
      : `/api/admin/blogs/${blog.id}/publish`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (res.ok && data.success && data.blog) {
        const updatedBlog: BlogItem = {
          ...blog,
          ...data.blog,
        };

        // If the updated blog no longer matches the current status filter, remove it smoothly
        if (statusFilter !== "ALL" && statusFilter !== updatedBlog.status) {
          setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
          setPagination((prev) => {
            const newTotal = Math.max(0, prev.total - 1);
            return {
              ...prev,
              total: newTotal,
              totalPages: Math.max(1, Math.ceil(newTotal / prev.limit)),
            };
          });
        } else {
          // Otherwise update row state in-place with authoritative data returned by the server
          setBlogs((prev) =>
            prev.map((b) => (b.id === blog.id ? updatedBlog : b))
          );
        }

        showToast(
          updatedBlog.status === "PUBLISHED"
            ? "Article activated (published)."
            : "Article deactivated (unpublished).",
          "success"
        );
      } else {
        showToast(data.error || "Action failed.", "error");
      }
    } catch {
      showToast("Network error updating publication status.", "error");
    } finally {
      setActionLoadingIds((prev) => {
        const next = { ...prev };
        delete next[blog.id];
        return next;
      });
    }
  };

  // Confirm and execute delete without full-page reload
  const executeDelete = async () => {
    if (!deletingId || isDeleting) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/blogs/${deletingId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Article deleted successfully.", "success");
        setBlogs((prev) => prev.filter((b) => b.id !== deletingId));
        setPagination((prev) => {
          const newTotal = Math.max(0, prev.total - 1);
          return {
            ...prev,
            total: newTotal,
            totalPages: Math.max(1, Math.ceil(newTotal / prev.limit)),
          };
        });
        setDeletingId(null);
        setDeletingTitle("");
      } else {
        showToast(data.error || "Failed to delete article.", "error");
      }
    } catch {
      showToast("Network error deleting article.", "error");
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
    <AdminPage>
      <AdminPageHeader
        breadcrumbs={[{ label: "Blogs & Articles" }]}
        title="Blog & Article Management"
        description="Create, edit, organize, and publish stories and community outreach reports."
        actions={
          <Button asChild size="sm" className="gap-1.5 rounded-lg">
            <Link href="/admin/blogs/new">
              <Plus className="h-4 w-4" />
              Create new article
            </Link>
          </Button>
        }
      />

      {/* Feedback Toast */}
      {toast && (
        <div
          role="alert"
          className={`rounded-lg border p-3.5 text-xs font-semibold shadow-sm flex items-center justify-between gap-2 animate-in fade-in duration-200 ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="cursor-pointer text-xs font-bold hover:opacity-70 px-1"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      <AdminToolbar>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75647B]" />
            <Input
              placeholder="Search by title, excerpt, content..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="border-[#EADDED] pl-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="h-9 rounded-lg border border-[#EADDED] bg-white px-3 text-xs font-semibold text-[#35123F] focus:border-[#9200A8] focus:outline-hidden"
              aria-label="Filter by status"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[#9200A8]" aria-hidden="true" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="h-9 rounded-lg border border-[#EADDED] bg-white px-3 text-xs font-semibold text-[#35123F] focus:border-[#9200A8] focus:outline-hidden"
                aria-label="Filter by category"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "ALL" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown
                className="h-3.5 w-3.5 text-[#C00083]"
                aria-hidden="true"
              />
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="h-9 rounded-lg border border-[#EADDED] bg-white px-3 text-xs font-semibold text-[#35123F] focus:border-[#9200A8] focus:outline-hidden"
                aria-label="Sort order"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical (A-Z)</option>
                <option value="published">Publication Date</option>
              </select>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="h-9 w-9 border-[#EADDED] text-[#75647B] hover:bg-[#FAF5FF] hover:text-[#35123F]"
              title="Refresh list"
              aria-label="Refresh list"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#9200A8]" : ""}`}
              />
            </Button>
          </div>
        </div>
      </AdminToolbar>

      <AdminTableCard>
        {isRefreshing && (
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#9200A8] to-transparent animate-pulse" />
        )}

        <CardHeader className="border-b border-[#EADDED]/70 bg-[#FDF8FF] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#9200A8]" />
              <span className="text-sm font-semibold text-[#35123F]">
                Blog Posts ({pagination.total})
              </span>
            </div>
            {pagination.total > 0 && (
              <span className="text-xs text-[#75647B]">
                Page {pagination.page} of {pagination.totalPages}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#9200A8]" />
              <p className="text-xs text-[#75647B]">
                Loading blog posts from database...
              </p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF5FF] text-[#9200A8] border border-[#EADDED]">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#35123F]">
                No blog posts found
              </h3>
              <p className="text-xs text-[#75647B] max-w-sm">
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
              <table className="admin-table w-full text-left text-sm">
                <thead className="bg-[#FDF8FF] text-xs uppercase tracking-wider text-[#75647B] border-b border-[#EADDED]">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-bold">
                      Article & Slug
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-bold">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-bold">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 font-bold text-right"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADDED]/60">
                  {blogs.map((blog) => {
                    const isPublished = blog.status === "PUBLISHED";
                    const isDraft = blog.status === "DRAFT";
                    const isRowBusy = !!actionLoadingIds[blog.id];
                    const currentAction = actionLoadingIds[blog.id];

                    return (
                      <tr
                        key={blog.id}
                        className={`hover:bg-[#FAF5FF] transition-colors group ${
                          isRowBusy ? "opacity-75" : ""
                        }`}
                      >
                        {/* Article with Thumbnail */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-[#EADDED] bg-[#FAF5FF]">
                              {blog.coverImage ? (
                                <Image
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#75647B]">
                                  <FileText className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs sm:max-w-sm">
                              <Link
                                href={`/admin/blogs/${blog.id}/edit`}
                                className="font-bold text-[#35123F] hover:text-[#9200A8] transition-colors line-clamp-1 block text-sm"
                              >
                                {blog.title}
                              </Link>
                              <span className="text-[11px] text-[#75647B] font-mono block truncate">
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

                        {/* Row Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#75647B] hover:text-[#9200A8]"
                              title="Edit article"
                            >
                              <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={isRowBusy}
                              onClick={() => handleTogglePublish(blog)}
                              className="h-8 w-8 text-[#75647B] hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                              title={
                                isPublished
                                  ? "Deactivate (unpublish)"
                                  : "Activate (publish)"
                              }
                              aria-label={
                                isPublished
                                  ? "Deactivate article"
                                  : "Activate article"
                              }
                            >
                              {currentAction === "publish" ? (
                                <Loader2 className="h-4 w-4 animate-spin text-[#9200A8]" />
                              ) : isPublished ? (
                                <PowerOff className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={isRowBusy}
                              onClick={() => {
                                setDeletingId(blog.id);
                                setDeletingTitle(blog.title);
                              }}
                              className="h-8 w-8 text-[#75647B] hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                              title="Delete permanently"
                              aria-label="Delete permanently"
                            >
                              <Trash2 className="h-4 w-4" />
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
          {!initialLoading && blogs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#EADDED]/70 px-6 py-4 text-xs text-[#75647B] gap-3">
              <div>
                Showing Page{" "}
                <span className="font-bold text-[#35123F]">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#35123F]">
                  {pagination.totalPages}
                </span>{" "}
                ({pagination.total} total articles)
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevPage || isRefreshing}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  className="h-8 text-xs cursor-pointer"
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
                      disabled={isRefreshing}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: p }))
                      }
                      className={`h-8 w-8 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                        pagination.page === p
                          ? "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-2xs"
                          : "text-[#75647B] hover:bg-[#FCE7F3]/60 hover:text-[#35123F]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage || isRefreshing}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  className="h-8 text-xs cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </AdminTableCard>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#EADDED] bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#35123F]">
                  Delete Article Permanently?
                </h3>
                <p className="text-xs text-[#75647B] leading-relaxed">
                  Are you sure you want to permanently delete:
                  <br />
                  <strong className="text-[#35123F]">{deletingTitle}</strong>?
                  <br />
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EADDED]">
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
    </AdminPage>
  );
}
