"use client";

import * as React from "react";
import Link from "next/link";
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
  Power,
  PowerOff,
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
import {
  AdminPage,
  AdminPageHeader,
  AdminTableCard,
  AdminToolbar,
} from "@/components/admin/admin-page";
import { CardHeader } from "@/components/ui/card";
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
  const [actionLoadingIds, setActionLoadingIds] = React.useState<
    Record<string, string>
  >({});

  // Delete modal state
  const [workToDelete, setWorkToDelete] = React.useState<WorkItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
  const fetchWorks = React.useCallback(async () => {
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
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    statusFilter,
    categoryFilter,
    sortOption,
  ]);

  React.useEffect(() => {
    let active = true;

    async function load() {
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
        if (active && json.success) {
          setWorks(json.data);
          setPagination(json.pagination);
        }
      } catch (err) {
        if (active) {
          console.error(err);
          showToast("Error loading works data", "error");
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
    debouncedSearch,
    statusFilter,
    categoryFilter,
    sortOption,
  ]);

  // Quick refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    void fetchWorks();
  };

  const handleTogglePublish = async (work: WorkItem) => {
    if (actionLoadingIds[work.id]) return;

    setActionLoadingIds((prev) => ({ ...prev, [work.id]: "publish" }));
    const isPublished = work.status === "PUBLISHED";
    const endpoint = isPublished
      ? `/api/admin/works/${work.id}/unpublish`
      : `/api/admin/works/${work.id}/publish`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Action failed");
      }

      const updatedStatus =
        (json.work?.status as WorkItem["status"] | undefined) ??
        (isPublished ? "DRAFT" : "PUBLISHED");

      if (statusFilter !== "ALL" && statusFilter !== updatedStatus) {
        setWorks((prev) => prev.filter((w) => w.id !== work.id));
        setPagination((prev) => {
          const newTotal = Math.max(0, prev.total - 1);
          return {
            ...prev,
            total: newTotal,
            totalPages: Math.max(1, Math.ceil(newTotal / prev.limit)),
          };
        });
      } else {
        setWorks((prev) =>
          prev.map((w) =>
            w.id === work.id ? { ...w, status: updatedStatus } : w
          )
        );
      }

      showToast(
        updatedStatus === "PUBLISHED"
          ? "Work initiative activated (published)."
          : "Work initiative deactivated (unpublished)."
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to toggle status";
      showToast(msg, "error");
    } finally {
      setActionLoadingIds((prev) => {
        const next = { ...prev };
        delete next[work.id];
        return next;
      });
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
      void fetchWorks();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete work";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPage>
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
          <div className="w-full max-w-md rounded-2xl border border-[#EADDED] bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#35123F]">
                  Delete Work Initiative?
                </h3>
                <p className="text-sm text-[#75647B]">
                  Are you sure you want to delete{" "}
                  <strong className="text-[#35123F]">
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
                className="border-[#EADDED] text-[#75647B] hover:bg-[#FAF5FF]"
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
                  "Delete Permanently"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AdminPageHeader
        breadcrumbs={[{ label: "Our Works" }]}
        title="Our Works Management"
        description="Manage grassroots initiatives, deliverables, beneficiaries, and public status."
        actions={
          <>
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link href="/our-works" target="_blank" className="flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4" />
                Public page
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-lg">
              <Link href="/admin/works/new" className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                Add work entry
              </Link>
            </Button>
          </>
        }
      />

      <AdminToolbar>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75647B]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search works by title, description, badge, category..."
                className="border-[#EADDED] pl-9 text-sm"
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
                className="h-9 rounded-lg border border-[#EADDED] bg-white px-3 text-xs font-semibold text-[#35123F] focus:border-[#9200A8] focus:outline-hidden"
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
                className="h-9 rounded-lg border border-[#EADDED] bg-white px-3 text-xs font-semibold text-[#35123F] focus:border-[#9200A8] focus:outline-hidden"
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
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="h-9 rounded-lg border border-[#EADDED] bg-white px-3 text-xs font-semibold text-[#35123F] focus:border-[#9200A8] focus:outline-hidden"
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
                className="h-9 border-[#EADDED] text-[#75647B] hover:bg-[#FAF5FF] hover:text-[#35123F]"
                title="Refresh table"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#9200A8]" : ""}`}
                />
              </Button>
            </div>
          </div>
      </AdminToolbar>

      <AdminTableCard>
        <CardHeader className="border-b border-[#EADDED]/70 bg-[#FDF8FF] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#9200A8]" />
              <span className="text-sm font-semibold text-[#35123F]">
                Our Works Initiatives ({pagination.total})
              </span>
            </div>
            {pagination.total > 0 && (
              <span className="text-xs text-[#75647B]">
                Page {pagination.page} of {pagination.totalPages}
              </span>
            )}
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="admin-table w-full text-left text-sm text-[#35123F]">
            <thead className="border-b border-[#EADDED] bg-[#FDF8FF] text-xs font-bold uppercase tracking-wider text-[#75647B]">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Initiative
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Category
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADDED]/60">
              {initialLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#FCE7F3]/60" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 rounded bg-[#FCE7F3]/60" />
                          <div className="h-3 w-32 rounded bg-[#EADDED]" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 rounded bg-[#EADDED]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="mx-auto h-5 w-16 rounded bg-[#EADDED]" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="ml-auto h-8 w-28 rounded bg-[#EADDED]" />
                    </td>
                  </tr>
                ))
              ) : works.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="mx-auto max-w-sm space-y-3">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF5FF] text-[#9200A8]">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-bold text-[#35123F]">
                        No Work Initiatives Found
                      </h3>
                      <p className="text-xs text-[#75647B]">
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
                  const isPublished = work.status === "PUBLISHED";
                  const isDraft = work.status === "DRAFT";
                  const isRowBusy = !!actionLoadingIds[work.id];
                  const currentAction = actionLoadingIds[work.id];

                  return (
                    <tr
                      key={work.id}
                      className="transition-colors hover:bg-[#FDF8FF]"
                    >
                      {/* Initiative Title & Icon */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EADDED] bg-[#FAF5FF] text-[#9200A8]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#35123F] hover:text-[#9200A8]">
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
                            <div className="flex items-center gap-2 text-xs text-[#75647B] mt-0.5">
                              {work.badge && (
                                <span className="font-semibold text-[#C00083]">
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
                        <span className="inline-flex rounded-md bg-[#FCE7F3]/60 px-2.5 py-1 text-xs font-semibold text-[#9200A8] border border-[#EADDED]">
                          {work.category}
                        </span>
                      </td>

                      {/* Publication status (read-only) */}
                      <td className="px-6 py-4">
                        {isPublished && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Published
                          </span>
                        )}
                        {isDraft && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                            Draft
                          </span>
                        )}
                        {work.status === "ARCHIVED" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-stone-500" />
                            Archived
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#75647B] hover:text-[#9200A8]"
                            title="Edit work initiative"
                          >
                            <Link href={`/admin/works/${work.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isRowBusy}
                            onClick={() => handleTogglePublish(work)}
                            className="h-8 w-8 text-[#75647B] hover:text-emerald-600 disabled:opacity-60"
                            title={
                              isPublished
                                ? "Deactivate (unpublish)"
                                : "Activate (publish)"
                            }
                            aria-label={
                              isPublished
                                ? "Deactivate work initiative"
                                : "Activate work initiative"
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
                            onClick={() => setWorkToDelete(work)}
                            className="h-8 w-8 text-[#75647B] hover:text-red-600 disabled:opacity-60"
                            title="Delete permanently"
                            aria-label="Delete permanently"
                          >
                            <Trash2 className="h-4 w-4" />
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

        {!initialLoading && pagination.total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#EADDED]/70 px-6 py-4 text-xs text-[#75647B] sm:flex-row">
            <div>
              Showing page{" "}
              <span className="font-bold text-[#35123F]">{pagination.page}</span> of{" "}
              <span className="font-bold text-[#35123F]">
                {pagination.totalPages}
              </span>{" "}
              ({pagination.total} total initiatives)
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrevPage || isRefreshing}
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
                    type="button"
                    disabled={isRefreshing}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: p }))
                    }
                    className={`h-8 w-8 rounded-md text-xs font-semibold transition-colors ${
                      pagination.page === p
                        ? "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-2xs"
                        : "text-[#75647B] hover:bg-[#FCE7F3]/60 hover:text-[#35123F]"
                    }`}
                    aria-current={pagination.page === p ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage || isRefreshing}
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
      </AdminTableCard>
    </AdminPage>
  );
}
