"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
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
  ArrowUpDown,
  Power,
  PowerOff,
  User as UserIcon,
} from "lucide-react";
import { AdminPage, AdminPageHeader, AdminTableCard, AdminToolbar } from "@/components/admin/admin-page";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
interface TeamMemberItem {
  id: string;
  name: string;
  slug: string;
  designation: string;
  profileImage?: string | null;
  bio?: string | null;
  shortBio?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
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

export default function AdminTeamPage() {
  const [members, setMembers] = React.useState<TeamMemberItem[]>([]);
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
  const [featuredFilter, setFeaturedFilter] = React.useState<string>("ALL");
  const [sortOrder, setSortOrder] = React.useState<string>("order_asc");

  // Delete modal state
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deletingName, setDeletingName] = React.useState<string>("");
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

  // Fetch team members when query parameters change
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
        if (featuredFilter !== "ALL") params.set("featured", featuredFilter);

        const res = await fetch(`/api/admin/team?${params.toString()}`);
        const data = await res.json();

        if (active && res.ok && data.success) {
          setMembers(data.data);
          setPagination(data.pagination);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to fetch team members:", err);
          showToast("Failed to load team members.", "error");
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
    featuredFilter,
    sortOrder,
  ]);

  // Manual refresh without page reload
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortOrder,
      });

      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (featuredFilter !== "ALL") params.set("featured", featuredFilter);

      const res = await fetch(`/api/admin/team?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setMembers(data.data);
        setPagination(data.pagination);
        showToast("Team members refreshed.");
      } else {
        showToast("Failed to refresh team members.", "error");
      }
    } catch {
      showToast("Error connecting to server.", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle active status in place
  const handleToggleActive = async (member: TeamMemberItem) => {
    const actionKey = "status";
    if (actionLoadingIds[member.id]) return;

    setActionLoadingIds((prev) => ({ ...prev, [member.id]: actionKey }));

    try {
      const res = await fetch(`/api/admin/team/${member.id}/toggle-active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.member) {
        const updated = data.member as TeamMemberItem;
        if (
          statusFilter === "ALL" ||
          (statusFilter === "ACTIVE" && updated.isActive) ||
          (statusFilter === "INACTIVE" && !updated.isActive)
        ) {
          setMembers((prev) =>
            prev.map((m) => (m.id === member.id ? updated : m))
          );
        } else {
          setMembers((prev) => prev.filter((m) => m.id !== member.id));
          setPagination((prev) => ({
            ...prev,
            total: Math.max(0, prev.total - 1),
            totalPages: Math.max(
              1,
              Math.ceil(Math.max(0, prev.total - 1) / prev.limit)
            ),
          }));
        }
        showToast(
          updated.isActive
            ? `${updated.name} activated on the website.`
            : `${updated.name} deactivated (hidden on the website).`
        );
      } else {
        showToast(data.error || "Failed to update member status.", "error");
      }
    } catch {
      showToast("Network error while updating status.", "error");
    } finally {
      setActionLoadingIds((prev) => {
        const next = { ...prev };
        delete next[member.id];
        return next;
      });
    }
  };

  // Delete team member
  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/team/${deletingId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMembers((prev) => prev.filter((m) => m.id !== deletingId));
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          totalPages: Math.max(
            1,
            Math.ceil(Math.max(0, prev.total - 1) / prev.limit)
          ),
        }));
        showToast("Team member deleted successfully.");
      } else {
        showToast(data.error || "Failed to delete team member.", "error");
      }
    } catch {
      showToast("Network error while deleting member.", "error");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
      setDeletingName("");
    }
  };

  return (
    <AdminPage>
      {/* Toast banner */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-lg border px-4 py-3 shadow-lg transition-all ${
            toast.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-red-300 bg-red-50 text-red-800"
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Team Management" },
        ]}
        title="Team Management"
        description="Manage trustees, leadership, and team profiles displayed on the Samartha Trust website."
        actions={
          <Button asChild size="sm" className="gap-2 rounded-lg">
            <Link href="/admin/team/new">
              <Plus className="h-4 w-4" />
              Add team member
            </Link>
          </Button>
        }
      />

      <AdminToolbar>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75647B]" />
              <Input
                type="text"
                placeholder="Search by name, designation, or bio..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="pl-9 bg-white border-[#EADDED] text-[#35123F] placeholder:text-[#75647B]/60 focus-visible:ring-[#9200A8]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#75647B] hover:text-[#35123F]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#75647B]">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="rounded-md border border-[#EADDED] bg-white px-2.5 py-1.5 text-xs font-medium text-[#35123F] focus:border-[#9200A8] focus:outline-hidden"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                </select>
              </div>

              {/* Featured Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#75647B]">
                <Sparkles className="h-3.5 w-3.5 text-[#C00083]" />
                <select
                  value={featuredFilter}
                  onChange={(e) => {
                    setFeaturedFilter(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="rounded-md border border-[#EADDED] bg-white px-2.5 py-1.5 text-xs font-medium text-[#35123F] focus:border-[#9200A8] focus:outline-hidden"
                >
                  <option value="ALL">All Featured</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Standard Only</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-1.5 text-xs text-[#75647B]">
                <ArrowUpDown className="h-3.5 w-3.5 text-[#9200A8]" />
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="rounded-md border border-[#EADDED] bg-white px-2.5 py-1.5 text-xs font-medium text-[#35123F] focus:border-[#9200A8] focus:outline-hidden"
                >
                  <option value="order_asc">Display Order (1 → 99)</option>
                  <option value="order_desc">Display Order (99 → 1)</option>
                  <option value="name_asc">Name (A → Z)</option>
                  <option value="name_desc">Name (Z → A)</option>
                  <option value="newest">Recently Added</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* In-place Refresh button */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-9 w-9 border-[#EADDED] text-[#75647B] hover:bg-[#FAF5FF] hover:text-[#35123F]"
                title="Refresh team members"
                aria-label="Refresh team members"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#9200A8]" : ""}`}
                />
              </Button>
            </div>
          </div>
      </AdminToolbar>

      <AdminTableCard>
        <CardHeader className="border-b border-[#EADDED]/70 bg-[#FDF8FF] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#9200A8]" />
              <span className="font-semibold text-sm text-[#35123F]">
                Team Profiles ({pagination.total})
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
            <div className="flex flex-col items-center justify-center space-y-3 p-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#9200A8]" />
              <p className="text-xs text-[#75647B]">
                Loading team members from database...
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#EADDED] bg-[#FAF5FF] text-[#9200A8]">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#35123F]">
                No team profiles found
              </h3>
              <p className="max-w-sm text-xs text-[#75647B]">
                {search || statusFilter !== "ALL" || featuredFilter !== "ALL"
                  ? "No team members match your search and filter criteria. Try clearing filters."
                  : "Add your first team profile to show on the About page."}
              </p>
              <Button asChild size="sm" className="mt-2 gap-1.5">
                <Link href="/admin/team/new">
                  <Plus className="h-4 w-4" />
                  <span>Add First Team Member</span>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table w-full text-left text-sm">
                <thead className="border-b border-[#EADDED] bg-[#FDF8FF] text-xs uppercase tracking-wider text-[#75647B]">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-bold">
                      Member & Slug
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-bold">
                      Designation
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-bold">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 text-right font-bold"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADDED]/60">
                  {members.map((member) => {
                    const isRowBusy = !!actionLoadingIds[member.id];
                    const currentAction = actionLoadingIds[member.id];

                    return (
                      <tr
                        key={member.id}
                        className={`group transition-colors hover:bg-[#FAF5FF] ${
                          isRowBusy ? "opacity-75" : ""
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#EADDED] bg-[#FAF5FF]">
                              {member.profileImage ? (
                                <Image
                                  src={member.profileImage}
                                  alt={member.name}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#75647B]">
                                  <UserIcon className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs sm:max-w-sm">
                              <Link
                                href={`/admin/team/${member.id}/edit`}
                                className="line-clamp-1 block text-sm font-bold text-[#35123F] transition-colors hover:text-[#9200A8]"
                              >
                                {member.name}
                              </Link>
                              <span className="block truncate font-mono text-[11px] text-[#75647B]">
                                /about#{member.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold"
                          >
                            {member.designation}
                          </Badge>
                        </td>

                        <td className="px-4 py-3.5">
                          {member.isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#75647B] hover:text-[#9200A8]"
                              title="Edit profile"
                            >
                              <Link href={`/admin/team/${member.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={isRowBusy}
                              onClick={() => handleToggleActive(member)}
                              className="h-8 w-8 text-[#75647B] hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                              title={
                                member.isActive
                                  ? "Deactivate (hide on site)"
                                  : "Activate (show on site)"
                              }
                              aria-label={
                                member.isActive
                                  ? "Deactivate team member"
                                  : "Activate team member"
                              }
                            >
                              {currentAction === "status" ? (
                                <Loader2 className="h-4 w-4 animate-spin text-[#9200A8]" />
                              ) : member.isActive ? (
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
                                setDeletingId(member.id);
                                setDeletingName(member.name);
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

          {!initialLoading && members.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-[#EADDED]/70 px-6 py-4 text-xs text-[#75647B] sm:flex-row">
              <div>
                Showing Page{" "}
                <span className="font-bold text-[#35123F]">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#35123F]">
                  {pagination.totalPages}
                </span>{" "}
                ({pagination.total} total members)
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
                  className="h-8 cursor-pointer text-xs"
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
                      className={`h-8 w-8 cursor-pointer rounded-md text-xs font-semibold transition-colors ${
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
                  className="h-8 cursor-pointer text-xs"
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-xl border border-[#EADDED] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#35123F]">
                  Delete Team Member
                </h3>
                <p className="text-xs text-[#75647B]">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#75647B] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#35123F]">
                &ldquo;{deletingName}&rdquo;
              </strong>
              ? Their public profile will no longer appear on the Samartha Trust
              website.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeletingId(null);
                  setDeletingName("");
                }}
                disabled={isDeleting}
                className="border-[#EADDED]"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="gap-2 bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Member</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
