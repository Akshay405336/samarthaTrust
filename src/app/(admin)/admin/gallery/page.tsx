"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Power,
  PowerOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import {
  AdminPage,
  AdminPageHeader,
  AdminTableCard,
  AdminToolbar,
} from "@/components/admin/admin-page";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GalleryPhotoRow {
  id: string;
  url: string;
  altText: string;
  displayOrder: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
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

export default function AdminGalleryPage() {
  const [photos, setPhotos] = React.useState<GalleryPhotoRow[]>([]);
  const [pagination, setPagination] = React.useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sortOption, setSortOption] = React.useState("order_asc");

  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [actionLoadingIds, setActionLoadingIds] = React.useState<
    Record<string, string>
  >({});

  const [photoToDelete, setPhotoToDelete] =
    React.useState<GalleryPhotoRow | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [refreshTick, setRefreshTick] = React.useState(0);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const query = new URLSearchParams({
          page: String(pagination.page),
          limit: String(pagination.limit),
          sort: sortOption,
        });
        if (search.trim()) query.set("search", search.trim());
        if (statusFilter !== "ALL") query.set("status", statusFilter);

        const res = await fetch(`/api/admin/gallery?${query}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (active && json.success) {
          setPhotos(json.data);
          setPagination(json.pagination);
        }
      } catch {
        if (active) showToast("Failed to load gallery photos.", "error");
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
  }, [pagination.page, pagination.limit, search, statusFilter, sortOption, refreshTick]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshTick((t) => t + 1);
  };

  const handleTogglePublish = async (photo: GalleryPhotoRow) => {
    if (actionLoadingIds[photo.id]) return;
    setActionLoadingIds((p) => ({ ...p, [photo.id]: "publish" }));
    const isPublished = photo.status === "PUBLISHED";
    const endpoint = isPublished
      ? `/api/admin/gallery/${photo.id}/unpublish`
      : `/api/admin/gallery/${photo.id}/publish`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);

      const newStatus = isPublished ? "DRAFT" : "PUBLISHED";
      if (statusFilter !== "ALL" && statusFilter !== newStatus) {
        setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      } else {
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id ? { ...p, status: newStatus } : p
          )
        );
      }
      showToast(
        newStatus === "PUBLISHED"
          ? "Photo activated on the public gallery."
          : "Photo deactivated."
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Action failed", "error");
    } finally {
      setActionLoadingIds((prev) => {
        const next = { ...prev };
        delete next[photo.id];
        return next;
      });
    }
  };

  const confirmDelete = async () => {
    if (!photoToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${photoToDelete.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      showToast("Photo deleted permanently.");
      setPhotos((prev) => prev.filter((p) => p.id !== photoToDelete.id));
      setPhotoToDelete(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPage>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {toast.message}
        </div>
      )}

      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#EADDED] bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#35123F]">
                  Delete photo permanently?
                </h3>
                <p className="mt-1 text-sm text-[#75647B]">
                  Remove <strong>{photoToDelete.altText}</strong> from the
                  gallery and public site.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setPhotoToDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AdminPageHeader
        breadcrumbs={[{ label: "Gallery" }]}
        title="Gallery Management"
        description="Add single photos with alt text, optional links, and display order."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/gallery" target="_blank" className="gap-1.5">
                <ExternalLink className="h-4 w-4" />
                Public gallery
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/gallery/new" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add photo
              </Link>
            </Button>
          </>
        }
      />

      <AdminToolbar>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75647B]" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              placeholder="Search by alt text or link..."
              className="border-[#EADDED] pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="h-9 rounded-lg border border-[#EADDED] bg-white px-3 text-xs font-semibold text-[#35123F]"
            >
              <option value="ALL">All statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-9 rounded-lg border border-[#EADDED] bg-white px-3 text-xs font-semibold text-[#35123F]"
            >
              <option value="order_asc">Order (low → high)</option>
              <option value="order_desc">Order (high → low)</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#9200A8]" : ""}`} />
            </Button>
          </div>
        </div>
      </AdminToolbar>

      <AdminTableCard>
        <CardHeader className="border-b border-[#EADDED]/70 bg-[#FDF8FF] px-6 py-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-[#9200A8]" />
            <span className="text-sm font-semibold text-[#35123F]">
              Photos ({pagination.total})
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center space-y-3 p-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#9200A8]" />
              <p className="text-xs text-[#75647B]">Loading photos...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center p-12 text-center">
              <ImageIcon className="h-10 w-10 text-[#9200A8]" />
              <p className="mt-3 text-sm font-bold text-[#35123F]">No photos yet</p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/admin/gallery/new">Add first photo</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table w-full text-left text-sm">
                <thead className="border-b border-[#EADDED] bg-[#FDF8FF] text-xs uppercase tracking-wider text-[#75647B]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Image</th>
                    <th className="px-4 py-3.5 font-bold">Alt / name</th>
                    <th className="px-4 py-3.5 font-bold text-center">Order</th>
                    <th className="px-4 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADDED]/60">
                  {photos.map((photo) => {
                    const isPublished = photo.status === "PUBLISHED";
                    const busy = actionLoadingIds[photo.id];
                    return (
                      <tr key={photo.id} className="hover:bg-[#FAF5FF]">
                        <td className="px-5 py-3.5">
                          <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-[#EADDED] bg-slate-100">
                            <Image src={photo.url} alt={photo.altText} fill className="object-cover" unoptimized sizes="80px" />
                          </div>
                        </td>
                        <td className="max-w-xs px-4 py-3.5">
                          <span className="line-clamp-2 font-semibold text-[#35123F]">
                            {photo.altText}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-xs font-bold text-[#35123F]">
                          {photo.displayOrder}
                        </td>
                        <td className="px-4 py-3.5">
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                              Published
                            </span>
                          ) : photo.status === "DRAFT" ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                              Draft
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                              Archived
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-0.5">
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                              <Link href={`/admin/gallery/${photo.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={!!busy}
                              onClick={() => handleTogglePublish(photo)}
                              title={isPublished ? "Deactivate" : "Activate"}
                            >
                              {busy === "publish" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
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
                              className="h-8 w-8 hover:text-red-600"
                              onClick={() => setPhotoToDelete(photo)}
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

          {!initialLoading && photos.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-[#EADDED]/70 px-6 py-4 text-xs text-[#75647B] sm:flex-row">
              <div>
                Showing page{" "}
                <span className="font-bold text-[#35123F]">{pagination.page}</span> of{" "}
                <span className="font-bold text-[#35123F]">{pagination.totalPages}</span> (
                {pagination.total} photos)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  className="h-8 text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  className="h-8 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </AdminTableCard>
    </AdminPage>
  );
}
