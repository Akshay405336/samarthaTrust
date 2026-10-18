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
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Tag,
  ArrowUpDown,
  Eye,
  Check,
  X,
  User as UserIcon,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TEAM_CATEGORIES } from "@/lib/validations/team";

interface TeamMemberItem {
  id: string;
  name: string;
  slug: string;
  designation: string;
  category: string;
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
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [featuredFilter, setFeaturedFilter] = React.useState<string>("ALL");
  const [sortOrder, setSortOrder] = React.useState<string>("order_asc");

  // Delete modal state
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deletingName, setDeletingName] = React.useState<string>("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Quick edit display order state
  const [editingOrderId, setEditingOrderId] = React.useState<string | null>(
    null
  );
  const [editingOrderVal, setEditingOrderVal] = React.useState<number>(0);

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
        if (categoryFilter !== "ALL") params.set("category", categoryFilter);
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
    categoryFilter,
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
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
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
          `${updated.name} ${updated.isActive ? "activated" : "deactivated"}.`
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

  // Toggle featured status in place
  const handleToggleFeatured = async (member: TeamMemberItem) => {
    const actionKey = "featured";
    if (actionLoadingIds[member.id]) return;

    setActionLoadingIds((prev) => ({ ...prev, [member.id]: actionKey }));

    try {
      const res = await fetch(`/api/admin/team/${member.id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !member.isFeatured }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.member) {
        const updated = data.member as TeamMemberItem;
        if (
          featuredFilter === "ALL" ||
          (featuredFilter === "true" && updated.isFeatured) ||
          (featuredFilter === "false" && !updated.isFeatured)
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
          `${updated.name} ${updated.isFeatured ? "featured" : "unfeatured"}.`
        );
      } else {
        showToast(data.error || "Failed to toggle featured status.", "error");
      }
    } catch {
      showToast("Network error while toggling featured status.", "error");
    } finally {
      setActionLoadingIds((prev) => {
        const next = { ...prev };
        delete next[member.id];
        return next;
      });
    }
  };

  // Save quick display order
  const handleSaveOrder = async (member: TeamMemberItem) => {
    const actionKey = "order";
    if (actionLoadingIds[member.id]) return;

    setActionLoadingIds((prev) => ({ ...prev, [member.id]: actionKey }));

    try {
      const res = await fetch(`/api/admin/team/${member.id}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: editingOrderVal }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.member) {
        const updated = data.member as TeamMemberItem;
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? updated : m))
        );
        setEditingOrderId(null);
        showToast(
          `Display order for ${updated.name} updated to ${updated.displayOrder}.`
        );
      } else {
        showToast(data.error || "Failed to update display order.", "error");
      }
    } catch {
      showToast("Network error while updating display order.", "error");
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
    <div className="space-y-6">
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

      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/admin" },
              { label: "Team Management" },
            ]}
          />
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#492A22]">
            Team Management
          </h1>
          <p className="text-sm text-[#78685D]">
            Manage trustees, leadership, and team profiles displayed on the
            Samartha Trust website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="gap-2 bg-[#F52232] text-white hover:bg-[#D91B29] shadow-xs"
          >
            <Link href="/admin/team/new">
              <Plus className="h-4 w-4" />
              <span>Add Team Member</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters panel */}
      <Card className="border-[#EADCCB] bg-white shadow-2xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78685D]" />
              <Input
                type="text"
                placeholder="Search by name, designation, or bio..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="pl-9 bg-white border-[#EADCCB] text-[#492A22] placeholder:text-[#78685D]/60 focus-visible:ring-[#FF8A00]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#78685D] hover:text-[#492A22]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#78685D]">
                <Tag className="h-3.5 w-3.5 text-[#FF8A00]" />
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="rounded-md border border-[#EADCCB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#492A22] focus:border-[#FF8A00] focus:outline-hidden"
                >
                  <option value="ALL">All Categories</option>
                  {TEAM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#78685D]">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="rounded-md border border-[#EADCCB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#492A22] focus:border-[#FF8A00] focus:outline-hidden"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                </select>
              </div>

              {/* Featured Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#78685D]">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <select
                  value={featuredFilter}
                  onChange={(e) => {
                    setFeaturedFilter(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="rounded-md border border-[#EADCCB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#492A22] focus:border-[#FF8A00] focus:outline-hidden"
                >
                  <option value="ALL">All Featured</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Standard Only</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-1.5 text-xs text-[#78685D]">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="rounded-md border border-[#EADCCB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#492A22] focus:border-[#FF8A00] focus:outline-hidden"
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
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 border-[#EADCCB] text-[#78685D] hover:bg-[#FFF5E6] hover:text-[#492A22]"
                title="Refresh team members"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#F52232]" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card className="border-[#EADCCB] bg-white shadow-2xs overflow-hidden">
        <CardHeader className="border-b border-[#EADCCB]/70 bg-[#FFFCF5] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#F52232]" />
              <span className="font-semibold text-sm text-[#492A22]">
                Team Profiles ({pagination.total})
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
            <thead className="bg-[#FFFDF9] border-b border-[#EADCCB] text-xs font-bold uppercase tracking-wider text-[#78685D]">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Member
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Category
                </th>
                <th scope="col" className="px-6 py-3.5 text-center">
                  Display Order
                </th>
                <th scope="col" className="px-6 py-3.5 text-center">
                  Featured
                </th>
                <th scope="col" className="px-6 py-3.5 text-center">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Updated
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADCCB]/60">
              {initialLoading ? (
                // Skeletons
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#EADCCB]/40" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 rounded bg-[#EADCCB]/40" />
                          <div className="h-3 w-24 rounded bg-[#EADCCB]/30" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-20 rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-4 w-8 mx-auto rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-5 w-16 mx-auto rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-5 w-16 mx-auto rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 rounded bg-[#EADCCB]/30" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 w-24 ml-auto rounded bg-[#EADCCB]/30" />
                    </td>
                  </tr>
                ))
              ) : members.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5E6] text-[#FF8A00] border border-[#EADCCB]">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[#492A22]">
                      No team profiles found
                    </h3>
                    <p className="mt-1 text-xs text-[#78685D] max-w-sm mx-auto">
                      {search ||
                      categoryFilter !== "ALL" ||
                      statusFilter !== "ALL" ||
                      featuredFilter !== "ALL"
                        ? "No team members matched your active search or filter criteria. Try clearing filters."
                        : "No team members have been added to the database yet. Click below to add the first profile."}
                    </p>
                    <div className="mt-5">
                      <Button
                        asChild
                        size="sm"
                        className="gap-2 bg-[#F52232] text-white hover:bg-[#D91B29]"
                      >
                        <Link href="/admin/team/new">
                          <Plus className="h-4 w-4" />
                          <span>Add First Team Member</span>
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                // Real rows
                members.map((member) => {
                  const isActionLoading = Boolean(actionLoadingIds[member.id]);
                  const activeAction = actionLoadingIds[member.id];
                  const isEditingOrder = editingOrderId === member.id;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-[#FFFDF9] transition-colors"
                    >
                      {/* Member Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#EADCCB] bg-[#FFF5E6]">
                            {member.profileImage ? (
                              <Image
                                src={member.profileImage}
                                alt={member.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#78685D]">
                                <UserIcon className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/team/${member.id}/edit`}
                              className="font-bold text-[#492A22] hover:text-[#F52232] transition-colors text-sm line-clamp-1"
                            >
                              {member.name}
                            </Link>
                            <p className="text-xs text-[#78685D] line-clamp-1 mt-0.5">
                              {member.designation}
                            </p>
                            {/* Contact icons preview */}
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#78685D]/70">
                              {member.email && (
                                <span
                                  title={member.email}
                                  className="inline-flex items-center gap-0.5"
                                >
                                  <Mail className="h-3 w-3" />
                                </span>
                              )}
                              {member.phone && (
                                <span
                                  title={member.phone}
                                  className="inline-flex items-center gap-0.5"
                                >
                                  <Phone className="h-3 w-3" />
                                </span>
                              )}
                              {member.websiteUrl && (
                                <span
                                  title={member.websiteUrl}
                                  className="inline-flex items-center gap-0.5"
                                >
                                  <Globe className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className="bg-[#FFF5E6] text-[#492A22] border-[#EADCCB] font-semibold text-xs"
                        >
                          {member.category}
                        </Badge>
                      </td>

                      {/* Display Order */}
                      <td className="px-6 py-4 text-center">
                        {isEditingOrder ? (
                          <div className="inline-flex items-center gap-1">
                            <Input
                              type="number"
                              value={editingOrderVal}
                              onChange={(e) =>
                                setEditingOrderVal(Number(e.target.value))
                              }
                              className="h-7 w-16 text-center text-xs p-1"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSaveOrder(member)}
                              disabled={isActionLoading}
                              className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50"
                              title="Save order"
                            >
                              {isActionLoading && activeAction === "order" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingOrderId(null)}
                              className="h-7 w-7 p-0 text-[#78685D] hover:bg-stone-100"
                              title="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOrderId(member.id);
                              setEditingOrderVal(member.displayOrder);
                            }}
                            className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs font-semibold text-[#492A22] bg-[#FFF5E6]/80 hover:bg-[#FFF5E6] border border-[#EADCCB]/60 transition-colors"
                            title="Click to edit display order"
                          >
                            <span>#{member.displayOrder}</span>
                            <Edit className="h-2.5 w-2.5 text-[#78685D]" />
                          </button>
                        )}
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(member)}
                          disabled={isActionLoading}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${
                            member.isFeatured
                              ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                              : "border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100"
                          }`}
                          title={
                            member.isFeatured
                              ? "Click to unfeature"
                              : "Click to feature"
                          }
                        >
                          {isActionLoading && activeAction === "featured" ? (
                            <Loader2 className="h-3 w-3 animate-spin text-amber-600" />
                          ) : (
                            <Sparkles
                              className={`h-3 w-3 ${
                                member.isFeatured
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-stone-400"
                              }`}
                            />
                          )}
                          <span>
                            {member.isFeatured ? "Featured" : "Standard"}
                          </span>
                        </button>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(member)}
                          disabled={isActionLoading}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${
                            member.isActive
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              : "border-stone-300 bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                          title={
                            member.isActive
                              ? "Click to deactivate"
                              : "Click to activate"
                          }
                        >
                          {isActionLoading && activeAction === "status" ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                member.isActive
                                  ? "bg-emerald-600"
                                  : "bg-stone-400"
                              }`}
                            />
                          )}
                          <span>{member.isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Updated Date */}
                      <td className="px-6 py-4 text-xs text-[#78685D]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#FF8A00]" />
                          <span>
                            {new Date(member.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View public profile */}
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#78685D] hover:bg-[#FFF5E6] hover:text-[#492A22]"
                            title="View public profile"
                          >
                            <Link href={`/team/${member.slug}`} target="_blank">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          {/* Edit button */}
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#78685D] hover:bg-[#FFF5E6] hover:text-[#492A22]"
                            title="Edit profile"
                          >
                            <Link href={`/admin/team/${member.id}/edit`}>
                              <Edit className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingId(member.id);
                              setDeletingName(member.name);
                            }}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                            title="Delete profile"
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

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-[#EADCCB] bg-[#FFFDF9] px-6 py-3.5 flex items-center justify-between">
            <span className="text-xs text-[#78685D]">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} members
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.max(1, p.page - 1),
                  }))
                }
                disabled={!pagination.hasPrevPage}
                className="h-8 text-xs border-[#EADCCB]"
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-[#492A22]">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.min(p.totalPages, p.page + 1),
                  }))
                }
                disabled={!pagination.hasNextPage}
                className="h-8 text-xs border-[#EADCCB]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-xl border border-[#EADCCB] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#492A22]">
                  Delete Team Member
                </h3>
                <p className="text-xs text-[#78685D]">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#78685D] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#492A22]">
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
                className="border-[#EADCCB]"
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
    </div>
  );
}
