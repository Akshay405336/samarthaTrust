"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ExternalLink,
  ArrowUpDown,
  Check,
  X,
  Layers,
  GraduationCap,
  HeartPulse,
  Users,
  Sprout,
  BookOpen,
  HandHeart,
  TreePine,
  Building,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  HeartPulse,
  Users,
  Sprout,
  BookOpen,
  HandHeart,
  TreePine,
  Building,
  Briefcase,
  ShieldCheck,
  Award,
  Sparkles,
};

interface WorkItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  badge?: string | null;
  shortDescription?: string | null;
  description: string;
  beneficiaries?: string | null;
  features: string[];
  programStatus?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  featuredImage?: string | null;
  iconName?: string | null;
  displayOrder: number;
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

export default function AdminWorksPage() {
  const [works, setWorks] = React.useState<WorkItem[]>([]);
  const [pagination, setPagination] = React.useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter States
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL");
  const [availableCategories, setAvailableCategories] = React.useState<
    string[]
  >([]);
  const [sortOption, setSortOption] = React.useState<string>("order_asc");

  // Loading & Action states
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [actionInProgress, setActionInProgress] = React.useState<string | null>(
    null
  );

  // Delete modal state
  const [workToDelete, setWorkToDelete] = React.useState<WorkItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Inline order editing
  const [editingOrderId, setEditingOrderId] = React.useState<string | null>(
    null
  );
  const [editingOrderVal, setEditingOrderVal] = React.useState<number>(0);

  // Toast feedback
  const [toast, setToast] = React.useState<ToastState | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch categories on mount
  React.useEffect(() => {
    fetch("/api/works?view=categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories)) {
          setAvailableCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Works
  const fetchWorks = React.useCallback(
    async (isBackground = false) => {
      if (!isBackground) setIsRefreshing(true);

      try {
        const query = new URLSearchParams();
        query.set("page", pagination.page.toString());
        query.set("limit", pagination.limit.toString());
        if (debouncedSearch) query.set("search", debouncedSearch);
        if (statusFilter !== "ALL") query.set("status", statusFilter);
        if (categoryFilter !== "ALL") query.set("category", categoryFilter);
        query.set("sort", sortOption);

        const res = await fetch(`/api/admin/works?${query.toString()}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch works data");
        }

        const json = await res.json();
        if (json.success) {
          setWorks(json.data);
          setPagination(json.pagination);
        }
      } catch (err) {
        console.error(err);
        showToast("Error loading works data", "error");
      } finally {
        setInitialLoading(false);
        setIsRefreshing(false);
      }
    },
    [
      pagination.page,
      pagination.limit,
      debouncedSearch,
      statusFilter,
      categoryFilter,
      sortOption,
    ]
  );

  React.useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  // Quick refresh
  const handleRefresh = () => {
    fetchWorks(false);
  };

  // Toggle publish / unpublish
  const handleTogglePublish = async (work: WorkItem) => {
    const isCurrentlyPublished = work.status === "PUBLISHED";
    const endpoint = isCurrentlyPublished
      ? `/api/admin/works/${work.id}/unpublish`
      : `/api/admin/works/${work.id}/publish`;

    setActionInProgress(work.id);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Action failed");
      }

      showToast(
        isCurrentlyPublished
          ? `"${work.title}" unpublished to Draft`
          : `"${work.title}" published to Live site!`
      );
      fetchWorks(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to toggle status";
      showToast(msg, "error");
    } finally {
      setActionInProgress(null);
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (work: WorkItem) => {
    setActionInProgress(work.id);
    try {
      const res = await fetch(`/api/admin/works/${work.id}/feature`, {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to toggle featured status");
      }

      showToast(
        work.isFeatured
          ? `Removed "${work.title}" from featured`
          : `"${work.title}" marked as featured!`
      );
      fetchWorks(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error updating featured status";
      showToast(msg, "error");
    } finally {
      setActionInProgress(null);
    }
  };

  // Save inline order
  const handleSaveOrder = async (id: string) => {
    setActionInProgress(id);
    try {
      const res = await fetch(`/api/admin/works/${id}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: editingOrderVal }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update display order");
      }
      showToast("Display order updated");
      setEditingOrderId(null);
      fetchWorks(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Order update failed";
      showToast(msg, "error");
    } finally {
      setActionInProgress(null);
    }
  };

  // Delete Work
  const confirmDelete = async () => {
    if (!workToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/works/${workToDelete.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete work initiative");
      }

      showToast(`"${workToDelete.title}" deleted successfully`);
      setWorkToDelete(null);
      fetchWorks(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete work";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics summary
  const totalCount = pagination.total;
  const publishedCount = works.filter((w) => w.status === "PUBLISHED").length;
  const draftCount = works.filter((w) => w.status === "DRAFT").length;
  const featuredCount = works.filter((w) => w.isFeatured).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {workToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#EADCCB] bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#492A22]">
                  Delete Work Initiative?
                </h3>
                <p className="text-sm text-[#78685D]">
                  Are you sure you want to delete{" "}
                  <strong className="text-[#492A22]">
                    {workToDelete.title}
                  </strong>
                  ? This will permanently remove it from the database and public
                  site.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWorkToDelete(null)}
                disabled={isDeleting}
                className="border-[#EADCCB] text-[#78685D] hover:bg-[#FFF5E6]"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 font-semibold hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete Work"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Our Works" }]} />

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#492A22] sm:text-3xl">
              Our Works Management
            </h1>
            <Badge variant="warm" className="text-xs font-semibold">
              {totalCount} Total
            </Badge>
          </div>
          <p className="mt-1 text-sm text-[#78685D]">
            Manage grassroots initiatives, deliverables, beneficiaries, and
            public status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#EADCCB] text-[#492A22] hover:bg-[#FFF5E6]"
          >
            <Link
              href="/our-works"
              target="_blank"
              className="flex items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4 text-[#FF8A00]" />
              <span>View Public Page</span>
            </Link>
          </Button>

          <Button
            asChild
            className="bg-gradient-to-r from-[#F52232] to-[#FF8A00] font-semibold text-white shadow-xs hover:opacity-95"
          >
            <Link href="/admin/works/new" className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Add New Work</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-[#EADCCB] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#78685D]">
            Total Works
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#492A22]">
              {totalCount}
            </span>
            <span className="text-xs text-[#78685D]">initiatives</span>
          </div>
        </Card>

        <Card className="border-[#EADCCB] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Published Live
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              {publishedCount}
            </span>
            <span className="text-xs text-[#78685D]">active</span>
          </div>
        </Card>

        <Card className="border-[#EADCCB] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Drafts
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">
              {draftCount}
            </span>
            <span className="text-xs text-[#78685D]">pending</span>
          </div>
        </Card>

        <Card className="border-[#EADCCB] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F52232]">
            Featured
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#F52232]">
              {featuredCount}
            </span>
            <span className="text-xs text-[#78685D]">highlighted</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-[#EADCCB] bg-white shadow-2xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78685D]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search works by title, description, badge, category..."
                className="border-[#EADCCB] pl-9 text-sm"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="h-9 rounded-lg border border-[#EADCCB] bg-white px-3 text-xs font-semibold text-[#492A22] focus:border-[#FF8A00] focus:outline-hidden"
              >
                <option value="ALL">All Statuses</option>
                <option value="PUBLISHED">Published Live</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="h-9 rounded-lg border border-[#EADCCB] bg-white px-3 text-xs font-semibold text-[#492A22] focus:border-[#FF8A00] focus:outline-hidden"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Sort selector */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="h-9 rounded-lg border border-[#EADCCB] bg-white px-3 text-xs font-semibold text-[#492A22] focus:border-[#FF8A00] focus:outline-hidden"
              >
                <option value="order_asc">Display Order (1 → 99)</option>
                <option value="order_desc">Display Order (99 → 1)</option>
                <option value="title">Title (A → Z)</option>
                <option value="newest">Recently Added</option>
                <option value="oldest">Oldest First</option>
              </select>

              {/* In-place Refresh button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-9 border-[#EADCCB] text-[#78685D] hover:bg-[#FFF5E6] hover:text-[#492A22]"
                title="Refresh table"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#F52232]" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Works Table */}
      <Card className="overflow-hidden border-[#EADCCB] bg-white shadow-2xs">
        <CardHeader className="border-b border-[#EADCCB]/70 bg-[#FFFCF5] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#F52232]" />
              <span className="text-sm font-semibold text-[#492A22]">
                Our Works Initiatives ({pagination.total})
              </span>
            </div>
            {pagination.total > 0 && (
              <span className="text-xs text-[#78685D]">
                Page {pagination.page} of {pagination.totalPages}
              </span>
            )}
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#492A22]">
            <thead className="border-b border-[#EADCCB] bg-[#FFFDF9] text-xs font-bold uppercase tracking-wider text-[#78685D]">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Initiative
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Category
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Program Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-center">
                  Deliverables
                </th>
                <th scope="col" className="px-6 py-3.5 text-center">
                  Display Order
                </th>
                <th scope="col" className="px-6 py-3.5 text-center">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADCCB]/60">
              {initialLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#EADCCB]/40" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 rounded bg-[#EADCCB]/40" />
                          <div className="h-3 w-32 rounded bg-[#EADCCB]/30" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-28 rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="mx-auto h-4 w-8 rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="mx-auto h-4 w-10 rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="mx-auto h-5 w-16 rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="ml-auto h-8 w-28 rounded bg-[#EADCCB]/30" />
                    </td>
                  </tr>
                ))
              ) : works.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="mx-auto max-w-sm space-y-3">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5E6] text-[#F52232]">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-bold text-[#492A22]">
                        No Work Initiatives Found
                      </h3>
                      <p className="text-xs text-[#78685D]">
                        {debouncedSearch ||
                        statusFilter !== "ALL" ||
                        categoryFilter !== "ALL"
                          ? "Try adjusting your search criteria or filter settings."
                          : "Get started by adding your first grassroots work initiative."}
                      </p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href="/admin/works/new">
                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                          Add New Work
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                works.map((work) => {
                  const Icon =
                    (work.iconName && ICON_MAP[work.iconName]) || GraduationCap;
                  const isActioning = actionInProgress === work.id;

                  return (
                    <tr
                      key={work.id}
                      className="transition-colors hover:bg-[#FFFDF9]"
                    >
                      {/* Initiative Title & Icon */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F0DFCF] bg-[#FFF5E9] text-[#F4510B]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#492A22] hover:text-[#F52232]">
                                {work.title}
                              </span>
                              {work.isFeatured && (
                                <Badge
                                  variant="secondary"
                                  className="h-4.5 bg-amber-100 text-[10px] text-amber-800"
                                >
                                  <Sparkles className="mr-0.5 h-2.5 w-2.5 text-amber-600" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#78685D] mt-0.5">
                              {work.badge && (
                                <span className="font-semibold text-[#C54B20]">
                                  {work.badge}
                                </span>
                              )}
                              <span>•</span>
                              <span className="font-mono text-[11px] truncate max-w-[200px]">
                                /{work.slug}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-md bg-[#FFF5E6] px-2.5 py-1 text-xs font-semibold text-[#C54B20] border border-[#EADCCB]">
                          {work.category}
                        </span>
                      </td>

                      {/* Program Status */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-[#492A22]">
                          {work.programStatus || "Active & Ongoing"}
                        </span>
                      </td>

                      {/* Deliverables Count */}
                      <td className="px-6 py-4 text-center">
                        <Badge
                          variant="outline"
                          className="text-xs border-[#EADCCB]"
                        >
                          {work.features?.length || 0} items
                        </Badge>
                      </td>

                      {/* Display Order with inline editor */}
                      <td className="px-6 py-4 text-center">
                        {editingOrderId === work.id ? (
                          <div className="inline-flex items-center gap-1">
                            <Input
                              type="number"
                              value={editingOrderVal}
                              onChange={(e) =>
                                setEditingOrderVal(
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="h-7 w-16 text-center text-xs"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleSaveOrder(work.id)}
                              disabled={isActioning}
                              className="h-7 w-7 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setEditingOrderId(null)}
                              className="h-7 w-7 text-red-500 hover:bg-red-50"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOrderId(work.id);
                              setEditingOrderVal(work.displayOrder);
                            }}
                            title="Click to change display order"
                            className="group inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-[#492A22] hover:bg-[#FFF5E6]"
                          >
                            <span>#{work.displayOrder}</span>
                            <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 text-[#78685D]" />
                          </button>
                        )}
                      </td>

                      {/* Publication Status */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            work.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-800"
                              : work.status === "DRAFT"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {work.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Publish/Unpublish toggle */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(work)}
                            disabled={isActioning}
                            className={`h-8 text-xs font-semibold ${
                              work.status === "PUBLISHED"
                                ? "text-amber-700 hover:bg-amber-50"
                                : "text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {isActioning ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : work.status === "PUBLISHED" ? (
                              "Unpublish"
                            ) : (
                              "Publish"
                            )}
                          </Button>

                          {/* Edit button */}
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-[#EADCCB] text-[#492A22] hover:bg-[#FFF5E6]"
                            title="Edit Work"
                          >
                            <Link href={`/admin/works/${work.id}/edit`}>
                              <Edit className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          {/* Delete button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setWorkToDelete(work)}
                            className="h-8 w-8 border-[#EADCCB] text-red-600 hover:bg-red-50 hover:text-red-700"
                            title="Delete Work"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#EADCCB] bg-[#FFFDF9] px-6 py-3.5 text-xs text-[#78685D]">
            <span>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={!pagination.hasPrevPage}
                className="h-8 border-[#EADCCB] text-xs text-[#492A22]"
              >
                Previous
              </Button>
              <span className="font-semibold text-[#492A22]">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={!pagination.hasNextPage}
                className="h-8 border-[#EADCCB] text-xs text-[#492A22]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
