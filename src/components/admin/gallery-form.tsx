"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  Save,
  Link2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface GalleryFormProps {
  initialData?: {
    id: string;
    url: string;
    altText: string;
    linkUrl?: string | null;
    displayOrder: number;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    fileSize?: number | null;
    mimeType?: string | null;
    width?: number | null;
    height?: number | null;
  };
  mode: "create" | "edit";
}

export function GalleryForm({ initialData, mode }: GalleryFormProps) {
  const router = useRouter();

  const [url, setUrl] = React.useState(initialData?.url || "");
  const [altText, setAltText] = React.useState(initialData?.altText || "");
  const [linkUrl, setLinkUrl] = React.useState(initialData?.linkUrl || "");
  const [displayOrder, setDisplayOrder] = React.useState<number>(
    initialData?.displayOrder ?? 0
  );
  const [status, setStatus] = React.useState<
    "DRAFT" | "PUBLISHED" | "ARCHIVED"
  >(initialData?.status || "DRAFT");

  const [fileMeta, setFileMeta] = React.useState({
    fileSize: initialData?.fileSize ?? (null as number | null),
    mimeType: initialData?.mimeType ?? (null as string | null),
    width: initialData?.width ?? (null as number | null),
    height: initialData?.height ?? (null as number | null),
  });

  const [uploading, setUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setGeneralError("Please choose an image file (JPG, PNG, WebP, etc.).");
      return;
    }
    setUploading(true);
    setGeneralError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      setUrl(data.url);
      if (!altText.trim()) {
        const baseName = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ");
        setAltText(baseName.slice(0, 200));
      }
      setFileMeta({
        fileSize: file.size,
        mimeType: file.type,
        width: data.width ?? null,
        height: data.height ?? null,
      });
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setErrors({});
    setGeneralError(null);
    setSuccessMessage(null);

    const payload = {
      url: url.trim(),
      altText: altText.trim(),
      linkUrl: linkUrl.trim() || null,
      displayOrder,
      status,
      ...fileMeta,
    };

    try {
      const endpoint =
        mode === "edit" && initialData?.id
          ? `/api/admin/gallery/${initialData.id}`
          : "/api/admin/gallery";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, val] of Object.entries(data.details)) {
            if (Array.isArray(val) && val[0]) fieldErrors[key] = val[0];
          }
          setErrors(fieldErrors);
        }
        throw new Error(data.error || "Failed to save photo");
      }

      setSuccessMessage(
        mode === "edit"
          ? "Photo updated successfully."
          : "Photo added successfully."
      );
      setTimeout(() => {
        router.push("/admin/gallery");
        router.refresh();
      }, 800);
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mt-0.5 shrink-0 text-[#75647B] hover:text-[#35123F]"
          >
            <Link href="/admin/gallery">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#35123F]">
              {mode === "create" ? "Add gallery photo" : "Edit gallery photo"}
            </h1>
            <p className="text-xs text-[#75647B]">
              {mode === "create"
                ? "Upload a single image with alt text and an optional link for the public gallery."
                : `Editing “${altText || "photo"}”`}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={saving || uploading}
          className="gap-2 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-xs hover:opacity-95"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {mode === "create" ? "Save photo" : "Save changes"}
            </>
          )}
        </Button>
      </div>

      {generalError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{generalError}</span>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-[#EADDED] bg-white shadow-2xs">
              <CardHeader className="border-b border-[#EADDED]/70 bg-[#FDF8FF] px-6 py-4">
                <h2 className="text-base font-bold text-[#35123F]">
                  Photo details
                </h2>
                <p className="text-xs text-[#75647B]">
                  Alt text is shown on the site and used by screen readers.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-1.5">
                  <Label htmlFor="altText" className="text-sm font-semibold text-[#35123F]">
                    Alt text / name <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="altText"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="e.g. Students receiving learning kits at rural school"
                    className="border-[#EADDED] focus-visible:ring-[#9200A8]"
                    required
                  />
                  {errors.altText && (
                    <p className="text-xs text-red-600">{errors.altText}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="linkUrl"
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#35123F]"
                  >
                    <Link2 className="h-3.5 w-3.5 text-[#9200A8]" />
                    Optional link URL
                  </Label>
                  <Input
                    id="linkUrl"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://samarthatrust.org/our-works/..."
                    className="border-[#EADDED] focus-visible:ring-[#9200A8]"
                  />
                  <p className="text-[11px] text-[#75647B]">
                    If set, clicking this photo on the public gallery opens this
                    link in a new tab. Leave empty to open the image lightbox.
                  </p>
                  {errors.linkUrl && (
                    <p className="text-xs text-red-600">{errors.linkUrl}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="url" className="text-sm font-semibold text-[#35123F]">
                    Image URL <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="/uploads/gallery/photo.png or https://..."
                    className="border-[#EADDED] font-mono text-xs focus-visible:ring-[#9200A8]"
                    required
                  />
                  {errors.url && (
                    <p className="text-xs text-red-600">{errors.url}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-[#EADDED] bg-white shadow-2xs">
              <CardHeader className="border-b border-[#EADDED]/70 bg-[#FDF8FF] px-6 py-4">
                <h2 className="text-base font-bold text-[#35123F]">Image</h2>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div
                  role="button"
                  tabIndex={0}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) void processFile(file);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`relative flex min-h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
                    isDragging
                      ? "border-[#9200A8] bg-[#FAF5FF]"
                      : "border-[#EADDED] bg-[#FDF8FF]/80"
                  }`}
                >
                  {url ? (
                    <>
                      <Image
                        src={url}
                        alt={altText || "Preview"}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUrl("");
                          setFileMeta({
                            fileSize: null,
                            mimeType: null,
                            width: null,
                            height: null,
                          });
                        }}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-[#75647B] shadow-sm hover:text-red-600"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-4 text-center">
                      <ImageIcon className="h-10 w-10 text-[#9200A8]/60" />
                      <p className="text-xs font-semibold text-[#35123F]">
                        Drag & drop an image here
                      </p>
                      <p className="text-[11px] text-[#75647B]">
                        JPG, PNG, WebP — max 5MB
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void processFile(file);
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full gap-2 border-[#EADDED]"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 text-[#9200A8]" />
                  )}
                  {url ? "Replace image" : "Upload from device"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-[#EADDED] bg-white shadow-2xs">
              <CardHeader className="border-b border-[#EADDED]/70 bg-[#FDF8FF] px-6 py-4">
                <h2 className="text-base font-bold text-[#35123F]">
                  Visibility & order
                </h2>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-sm font-semibold text-[#35123F]">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED"
                      )
                    }
                    className="h-10 w-full rounded-md border border-[#EADDED] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9200A8]"
                  >
                    <option value="DRAFT">Draft (hidden)</option>
                    <option value="PUBLISHED">Published (live on site)</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="displayOrder" className="text-sm font-semibold text-[#35123F]">
                    Display order
                  </Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={displayOrder}
                    onChange={(e) =>
                      setDisplayOrder(Number.parseInt(e.target.value, 10) || 0)
                    }
                    className="border-[#EADDED] focus-visible:ring-[#9200A8]"
                  />
                  <p className="text-[11px] text-[#75647B]">
                    Lower numbers appear first. Use 0 to auto-assign on create.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#EADDED] pt-6">
          <Button type="button" variant="outline" asChild className="border-[#EADDED]">
            <Link href="/admin/gallery">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={saving || uploading}
            className="min-w-[140px] gap-2 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {mode === "create" ? "Save photo" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
