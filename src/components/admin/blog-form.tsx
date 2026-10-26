"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  X,
  Sparkles,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileEdit,
  Loader2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { generateSlug } from "@/lib/validations/blog";

const CATEGORY_PRESETS = [
  "Education",
  "Healthcare",
  "Skill Development",
  "Community Welfare",
  "Disability Empowerment",
  "Field Stories",
];

interface BlogFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    coverImage?: string | null;
    authorName: string;
    category: string;
    tags?: string[];
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    isFeatured: boolean;
    publishedAt?: string | Date | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
  mode: "create" | "edit";
}

export function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter();

  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(
    Boolean(initialData?.slug)
  );
  const [excerpt, setExcerpt] = React.useState(initialData?.excerpt || "");
  const [content, setContent] = React.useState(initialData?.content || "");
  const [coverImage, setCoverImage] = React.useState(
    initialData?.coverImage || ""
  );
  const [authorName, setAuthorName] = React.useState(
    initialData?.authorName || "Samartha Outreach Team"
  );
  const [category, setCategory] = React.useState(
    initialData?.category || "Education"
  );
  const [customCategory, setCustomCategory] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState(
    initialData?.tags?.join(", ") || "Community, Outreach"
  );
  const [status, setStatus] = React.useState<
    "DRAFT" | "PUBLISHED" | "ARCHIVED"
  >(initialData?.status || "DRAFT");
  const [isFeatured, setIsFeatured] = React.useState(
    initialData?.isFeatured ?? false
  );
  const [publishedAt, setPublishedAt] = React.useState<string>(() => {
    if (initialData?.publishedAt) {
      const d = new Date(initialData.publishedAt);
      return d.toISOString().slice(0, 16);
    }
    return "";
  });
  const [metaTitle, setMetaTitle] = React.useState(
    initialData?.metaTitle || ""
  );
  const [metaDescription, setMetaDescription] = React.useState(
    initialData?.metaDescription || ""
  );

  const [previewTab, setPreviewTab] = React.useState<"write" | "preview">(
    "write"
  );
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Auto-generate slug as title changes unless admin edited slug manually
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
  };

  // Image file upload handler
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploadingImage(true);
    setGeneralError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setCoverImage(data.url);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to upload image.";
      setGeneralError(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save handler (supports both draft and published submissions)
  const handleSubmit = async (
    submitStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  ) => {
    setSaving(true);
    setErrors({});
    setGeneralError(null);
    setSuccessMessage(null);

    const activeStatus = submitStatus || status;
    const finalCategory =
      category === "Other" && customCategory ? customCategory : category;

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: slug || generateSlug(title),
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      authorName,
      category: finalCategory,
      tags: tagsArray,
      status: activeStatus,
      isFeatured,
      publishedAt:
        activeStatus === "PUBLISHED"
          ? publishedAt
            ? new Date(publishedAt).toISOString()
            : new Date().toISOString()
          : null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/blogs"
          : `/api/admin/blogs/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.details)) {
            fieldErrors[key] = Array.isArray(msgs) ? msgs[0] : String(msgs);
          }
          setErrors(fieldErrors);
        }
        throw new Error(data.error || "Failed to save blog post.");
      }

      setSuccessMessage(
        mode === "create"
          ? "Blog post created successfully!"
          : "Blog post updated successfully!"
      );

      // Navigate back to listing after short feedback
      setTimeout(() => {
        router.push("/admin/blogs");
        router.refresh();
      }, 700);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "An error occurred while saving.";
      setGeneralError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EADDED] pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/blogs" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#35123F] sm:text-2xl">
              {mode === "create" ? "Create New Blog Post" : "Edit Blog Post"}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "edit" && initialData?.status === "PUBLISHED" && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/blog/${slug}`}
                target="_blank"
                className="gap-1.5 text-xs text-[#75647B] hover:text-[#9200A8]"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Public Page</span>
              </Link>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => handleSubmit("DRAFT")}
            className="gap-1.5 text-xs"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Draft</span>
          </Button>

          <Button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit("PUBLISHED")}
            className="gap-1.5 text-xs"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            <span>
              {status === "PUBLISHED" ? "Update Article" : "Publish Now"}
            </span>
          </Button>
        </div>
      </div>

      {/* General feedback banner */}
      {generalError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
          <p className="font-medium">{generalError}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* Main Grid: Form Left (7 cols), Meta/Settings Right (5 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Core Content */}
        <div className="space-y-6 lg:col-span-8">
          {/* Title & Slug */}
          <Card className="border border-[#EADDED] bg-white shadow-2xs">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label
                  htmlFor="title"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Article Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Annual Education Drive: Distributing Learning Kits to Rural Students"
                  className="mt-1.5 text-base font-semibold border-[#EADDED] focus-visible:ring-[#9200A8]"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="slug"
                    className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                  >
                    URL Slug
                  </Label>
                  <span className="text-[11px] text-[#75647B]">
                    Public URL: /blog/{slug || "slug-here"}
                  </span>
                </div>
                <Input
                  id="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="annual-education-drive-2026"
                  className="mt-1.5 font-mono text-xs border-[#EADDED] focus-visible:ring-[#9200A8]"
                />
                {errors.slug && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.slug}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="excerpt"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Summary / Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief 1-2 sentence overview shown in article preview cards and Google search results..."
                  className="mt-1.5 text-sm border-[#EADDED] focus-visible:ring-[#9200A8]"
                />
                <div className="mt-1 flex justify-between text-[11px] text-[#75647B]">
                  <span>Recommended: 120-250 characters</span>
                  <span>{excerpt.length}/500</span>
                </div>
                {errors.excerpt && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.excerpt}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Editor with Preview Mode */}
          <Card className="border border-[#EADDED] bg-white shadow-2xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EADDED] pb-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#35123F]">
                    Article Content *
                  </Label>
                </div>

                <div className="flex rounded-lg border border-[#EADDED] p-0.5 bg-[#FDF8FF]">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("write")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      previewTab === "write"
                        ? "bg-white text-[#9200A8] shadow-2xs"
                        : "text-[#75647B] hover:text-[#35123F]"
                    }`}
                  >
                    <FileEdit className="h-3.5 w-3.5" />
                    <span>Write</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("preview")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      previewTab === "preview"
                        ? "bg-white text-[#9200A8] shadow-2xs"
                        : "text-[#75647B] hover:text-[#35123F]"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Live Preview</span>
                  </button>
                </div>
              </div>

              {previewTab === "write" ? (
                <div className="space-y-2">
                  {/* Formatting quick toolbar */}
                  <div className="flex flex-wrap items-center gap-1 text-xs text-[#75647B] border-b border-[#EADDED]/60 pb-2">
                    <span className="text-[11px] font-semibold text-[#35123F] mr-1">
                      Markdown Supported:
                    </span>
                    <code className="rounded bg-[#FCE7F3]/60 px-1.5 py-0.5 text-[11px] font-mono text-[#9200A8]">
                      ## Heading
                    </code>
                    <code className="rounded bg-[#FCE7F3]/60 px-1.5 py-0.5 text-[11px] font-mono text-[#9200A8]">
                      **Bold**
                    </code>
                    <code className="rounded bg-[#FCE7F3]/60 px-1.5 py-0.5 text-[11px] font-mono text-[#9200A8]">
                      *Italic*
                    </code>
                    <code className="rounded bg-[#FCE7F3]/60 px-1.5 py-0.5 text-[11px] font-mono text-[#9200A8]">
                      - Bullet list
                    </code>
                    <code className="rounded bg-[#FCE7F3]/60 px-1.5 py-0.5 text-[11px] font-mono text-[#9200A8]">
                      [Link](https://...)
                    </code>
                  </div>

                  <Textarea
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article narrative here... Markdown formatting like headings, bold, bullet lists, and paragraphs are supported."
                    className="font-sans text-sm leading-relaxed border-[#EADDED] focus-visible:ring-[#9200A8]"
                  />
                  {errors.content && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.content}
                    </p>
                  )}
                </div>
              ) : (
                <div className="min-h-[380px] rounded-lg border border-[#EADDED] p-6 bg-[#FDF8FF]/50 overflow-y-auto">
                  {content ? (
                    <div className="prose prose-stone max-w-none space-y-4 text-sm leading-relaxed text-[#35123F]">
                      {content.split("\n\n").map((para, i) => {
                        if (para.startsWith("## ")) {
                          return (
                            <h2
                              key={i}
                              className="text-xl font-bold text-[#35123F] border-b border-[#EADDED] pb-2 mt-4"
                            >
                              {para.replace("## ", "")}
                            </h2>
                          );
                        }
                        if (para.startsWith("### ")) {
                          return (
                            <h3
                              key={i}
                              className="text-lg font-bold text-[#35123F] mt-3"
                            >
                              {para.replace("### ", "")}
                            </h3>
                          );
                        }
                        return <p key={i}>{para}</p>;
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-[#75647B] italic">
                      No content written yet. Switch back to &quot;Write&quot;
                      tab to compose the story.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Publishing, Media, Category, SEO */}
        <div className="space-y-6 lg:col-span-4">
          {/* Publication Status Box */}
          <Card className="border border-[#EADDED] bg-white shadow-2xs">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#35123F]">
                Publishing Details
              </h3>

              <div>
                <Label
                  htmlFor="status"
                  className="text-xs font-semibold text-[#35123F]"
                >
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
                  className="mt-1.5 w-full rounded-md border border-[#EADDED] bg-white px-3 py-2 text-xs font-medium text-[#35123F] focus:outline-none focus:ring-1 focus:ring-[#9200A8]"
                >
                  <option value="DRAFT">Draft (Admin Only)</option>
                  <option value="PUBLISHED">Published (Live to Public)</option>
                  <option value="ARCHIVED">Archived (Internal Archive)</option>
                </select>
              </div>

              <div>
                <Label
                  htmlFor="publishedAt"
                  className="text-xs font-semibold text-[#35123F]"
                >
                  Publication Date
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="text-xs border-[#EADDED] focus-visible:ring-[#9200A8]"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#75647B]">
                  If published and left blank, defaults to current time.
                </p>
              </div>

              <div className="pt-2 border-t border-[#EADDED]/70">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-[#EADDED] text-[#9200A8] focus:ring-[#9200A8]"
                  />
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#C00083]" />
                    <span className="text-xs font-semibold text-[#35123F]">
                      Feature on Homepage & Blog Top
                    </span>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image Upload & Preview */}
          <Card className="border border-[#EADDED] bg-white shadow-2xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#35123F]">
                  Featured Cover Image
                </Label>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="text-[11px] text-[#9200A8] hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {coverImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#EADDED] bg-[#FAF5FF]">
                  <Image
                    src={coverImage}
                    alt="Cover preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
                    title="Remove Image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#EADDED] bg-[#FDF8FF] p-6 text-center cursor-pointer hover:border-[#9200A8]/60 hover:bg-[#FAF5FF] transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9200A8] border border-[#EADDED] shadow-2xs">
                    {uploadingImage ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5" />
                    )}
                  </div>
                  <span className="mt-2 text-xs font-semibold text-[#35123F]">
                    {uploadingImage
                      ? "Uploading file..."
                      : "Click to upload cover image"}
                  </span>
                  <span className="text-[11px] text-[#75647B] mt-0.5">
                    JPG, PNG, WebP up to 5 MB
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />

              <div>
                <Label
                  htmlFor="coverUrl"
                  className="text-[11px] font-semibold text-[#75647B]"
                >
                  Or Enter Image URL / Public Path:
                </Label>
                <Input
                  id="coverUrl"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="/images/samartha-hero.png"
                  className="mt-1 text-xs border-[#EADDED] focus-visible:ring-[#9200A8]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Taxonomy & Author */}
          <Card className="border border-[#EADDED] bg-white shadow-2xs">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#35123F]">
                Category & Author
              </h3>

              <div>
                <Label
                  htmlFor="category"
                  className="text-xs font-semibold text-[#35123F]"
                >
                  Category
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-[#EADDED] bg-white px-3 py-2 text-xs font-medium text-[#35123F] focus:outline-none focus:ring-1 focus:ring-[#9200A8]"
                >
                  {CATEGORY_PRESETS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Other / Custom...</option>
                </select>

                {category === "Other" && (
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name"
                    className="mt-2 text-xs border-[#EADDED]"
                  />
                )}
              </div>

              <div>
                <Label
                  htmlFor="authorName"
                  className="text-xs font-semibold text-[#35123F]"
                >
                  Author Display Name
                </Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Samartha Outreach Team"
                  className="mt-1.5 text-xs border-[#EADDED] focus-visible:ring-[#9200A8]"
                />
              </div>

              <div>
                <Label
                  htmlFor="tags"
                  className="text-xs font-semibold text-[#35123F]"
                >
                  Tags (Comma separated)
                </Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Education, Scholarships, Rural"
                  className="mt-1.5 text-xs border-[#EADDED] focus-visible:ring-[#9200A8]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Search Engine Optimization (SEO) */}
          <Card className="border border-[#EADDED] bg-white shadow-2xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-[#9200A8]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#35123F]">
                  Search Engine Optimization (SEO)
                </h3>
              </div>

              <div>
                <Label
                  htmlFor="metaTitle"
                  className="text-xs font-semibold text-[#35123F]"
                >
                  Meta Title
                </Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || "Title shown in browser tab and search"}
                  className="mt-1 text-xs border-[#EADDED] focus-visible:ring-[#9200A8]"
                />
              </div>

              <div>
                <Label
                  htmlFor="metaDesc"
                  className="text-xs font-semibold text-[#35123F]"
                >
                  Meta Description
                </Label>
                <Textarea
                  id="metaDesc"
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || "Search engine summary snippet..."}
                  className="mt-1 text-xs border-[#EADDED] focus-visible:ring-[#9200A8]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
