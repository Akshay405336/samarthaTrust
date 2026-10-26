"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
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
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSlug } from "@/lib/validations/work";

export const AVAILABLE_ICONS = [
  {
    id: "GraduationCap",
    label: "Graduation Cap (Education)",
    icon: GraduationCap,
  },
  { id: "HeartPulse", label: "Heart Pulse (Healthcare)", icon: HeartPulse },
  { id: "Users", label: "Users (Empowerment / Community)", icon: Users },
  { id: "Sprout", label: "Sprout (Rural / Environment)", icon: Sprout },
  { id: "BookOpen", label: "Open Book (Literacy / Schools)", icon: BookOpen },
  {
    id: "HandHeart",
    label: "Hand with Heart (Charity / Welfare)",
    icon: HandHeart,
  },
  { id: "TreePine", label: "Tree / Nature (Ecology)", icon: TreePine },
  { id: "Building", label: "Building / Infrastructure", icon: Building },
  {
    id: "Briefcase",
    label: "Briefcase (Livelihood / Skills)",
    icon: Briefcase,
  },
  {
    id: "ShieldCheck",
    label: "Shield (Safety / Protection)",
    icon: ShieldCheck,
  },
  { id: "Award", label: "Award (Honor / Achievement)", icon: Award },
  { id: "Sparkles", label: "Sparkles (Innovation / Special)", icon: Sparkles },
] as const;

export const CATEGORY_PRESETS = [
  "Education",
  "Healthcare",
  "Economic Empowerment",
  "Community Welfare",
  "Disability Welfare",
  "Environment & Water",
  "Emergency Relief",
];

export const PROGRAM_STATUS_PRESETS = [
  "Active & Ongoing",
  "Expanding Scope",
  "Seasonal Initiative",
  "Annual Program",
  "Completed Pilot",
];

interface WorkFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    category: string;
    badge?: string | null;
    shortDescription?: string | null;
    description: string;
    beneficiaries?: string | null;
    features?: string[];
    programStatus?: string | null;
    ctaText?: string | null;
    ctaLink?: string | null;
    featuredImage?: string | null;
    iconName?: string | null;
    displayOrder: number;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    isFeatured: boolean;
    publishedAt?: string | Date | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
  mode: "create" | "edit";
}

export function WorkForm({ initialData, mode }: WorkFormProps) {
  const router = useRouter();

  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(
    Boolean(initialData?.slug)
  );

  const [category, setCategory] = React.useState(
    initialData?.category || "Education"
  );
  const [badge, setBadge] = React.useState(initialData?.badge || "");
  const [iconName, setIconName] = React.useState(
    initialData?.iconName || "GraduationCap"
  );
  const [programStatus, setProgramStatus] = React.useState(
    initialData?.programStatus || "Active & Ongoing"
  );
  const [beneficiaries, setBeneficiaries] = React.useState(
    initialData?.beneficiaries || ""
  );
  const [shortDescription, setShortDescription] = React.useState(
    initialData?.shortDescription || ""
  );
  const [description, setDescription] = React.useState(
    initialData?.description || ""
  );

  // Deliverables / Features
  const [features, setFeatures] = React.useState<string[]>(
    initialData?.features && initialData.features.length > 0
      ? initialData.features
      : [
          "Annual student kit distribution",
          "Merit-cum-means financial scholarships",
          "After-school remedial coaching centers",
        ]
  );
  const [newFeatureText, setNewFeatureText] = React.useState("");

  // Media & CTAs
  const [featuredImage, setFeaturedImage] = React.useState(
    initialData?.featuredImage || ""
  );
  const [imageUrlInput, setImageUrlInput] = React.useState(
    initialData?.featuredImage?.startsWith("http")
      ? initialData.featuredImage
      : ""
  );
  const [ctaText, setCtaText] = React.useState(
    initialData?.ctaText || "Support This Work"
  );
  const [ctaLink, setCtaLink] = React.useState(
    initialData?.ctaLink || "/contact"
  );

  // Settings & SEO
  const [displayOrder, setDisplayOrder] = React.useState<number>(
    initialData?.displayOrder ?? 0
  );
  const [status, setStatus] = React.useState<
    "DRAFT" | "PUBLISHED" | "ARCHIVED"
  >(initialData?.status || "DRAFT");
  const [isFeatured, setIsFeatured] = React.useState(
    initialData?.isFeatured ?? false
  );
  const [metaTitle, setMetaTitle] = React.useState(
    initialData?.metaTitle || ""
  );
  const [metaDescription, setMetaDescription] = React.useState(
    initialData?.metaDescription || ""
  );

  // UI state
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setSlug(
      e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
    );
  };

  // Add Deliverable
  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText("");
    }
  };

  // Remove Deliverable
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Update Deliverable
  const handleUpdateFeature = (index: number, text: string) => {
    const updated = [...features];
    updated[index] = text;
    setFeatures(updated);
  };

  // Move Deliverable Up
  const handleMoveFeatureUp = (index: number) => {
    if (index === 0) return;
    const updated = [...features];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setFeatures(updated);
  };

  // Move Deliverable Down
  const handleMoveFeatureDown = (index: number) => {
    if (index === features.length - 1) return;
    const updated = [...features];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setFeatures(updated);
  };

  // Handle image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        featuredImage: "Please choose a valid image file (JPG, PNG, WebP).",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        featuredImage: "Image file is too large. Maximum size is 5MB.",
      }));
      return;
    }

    try {
      setUploadingImage(true);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.featuredImage;
        return copy;
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "works");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFeaturedImage(data.url);
      setImageUrlInput("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setErrors((prev) => ({ ...prev, featuredImage: msg }));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleApplyImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    try {
      new URL(imageUrlInput.trim());
      setFeaturedImage(imageUrlInput.trim());
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.featuredImage;
        return copy;
      });
    } catch {
      setErrors((prev) => ({
        ...prev,
        featuredImage:
          "Please enter a valid URL beginning with http:// or https://",
      }));
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage("");
    setImageUrlInput("");
  };

  // Selected Lucide Icon Component
  const SelectedIcon =
    AVAILABLE_ICONS.find((item) => item.id === iconName)?.icon || GraduationCap;

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setGeneralError(null);
    setSuccessMessage(null);

    // Basic client validation
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    if (!category.trim()) newErrors.category = "Category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      category: category.trim(),
      badge: badge.trim() || null,
      shortDescription: shortDescription.trim() || null,
      description: description.trim(),
      beneficiaries: beneficiaries.trim() || null,
      features: features.map((f) => f.trim()).filter(Boolean),
      programStatus: programStatus.trim() || "Active & Ongoing",
      ctaText: ctaText.trim() || "Support This Work",
      ctaLink: ctaLink.trim() || "/contact",
      featuredImage: featuredImage.trim() || null,
      iconName: iconName || "GraduationCap",
      displayOrder: Number(displayOrder) || 0,
      status,
      isFeatured,
      metaTitle: metaTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
    };

    try {
      const endpoint =
        mode === "edit" && initialData?.id
          ? `/api/admin/works/${initialData.id}`
          : "/api/admin/works";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.details) {
          const fieldErrs: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.details)) {
            fieldErrs[key] = Array.isArray(msgs) ? msgs[0] : String(msgs);
          }
          setErrors(fieldErrs);
        }
        throw new Error(data.error || "Failed to save work initiative");
      }

      setSuccessMessage(
        mode === "edit"
          ? "Work initiative updated successfully!"
          : "Work initiative created successfully!"
      );

      setTimeout(() => {
        router.push("/admin/works");
        router.refresh();
      }, 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setGeneralError(msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#EADDED] text-[#35123F] hover:bg-[#FAF5FF]"
          >
            <Link href="/admin/works">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Works
            </Link>
          </Button>

          <span className="text-xs font-semibold text-[#75647B]">
            {mode === "create"
              ? "New Initiative"
              : `Editing: ${initialData?.title}`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/works")}
            disabled={saving}
            className="text-[#75647B] hover:text-[#35123F]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving || uploadingImage}
            className="bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] hover:from-[#5E008C] hover:via-[#7D0090] hover:to-[#D0006B] font-semibold text-white shadow-sm hover:opacity-95"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === "create" ? "Create Work" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {generalError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1 font-medium">{generalError}</div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <div className="flex-1 font-medium">{successMessage}</div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Core Fields */}
        <div className="space-y-6 lg:col-span-8">
          {/* Card: Basic Information */}
          <Card className="border-[#EADDED] shadow-2xs">
            <CardHeader className="border-b border-[#EADDED]/60 pb-4">
              <h2 className="text-base font-bold text-[#35123F]">
                Initiative Details
              </h2>
              <p className="text-xs text-[#75647B]">
                Enter the primary title, category, badge, and description for
                this initiative.
              </p>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Work Title <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Child Education & Scholarship Assistance"
                  className={
                    errors.title ? "border-red-400" : "border-[#EADDED]"
                  }
                />
                {errors.title && (
                  <p className="text-xs text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="slug"
                    className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                  >
                    URL Slug
                  </Label>
                  <span className="text-[11px] text-[#75647B]">
                    Auto-generated from title or custom
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="slug"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="child-education-scholarship-assistance"
                    className="border-[#EADDED] font-mono text-xs text-[#75647B]"
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs text-red-600">{errors.slug}</p>
                )}
              </div>

              {/* Badge & Category Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Category */}
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                  >
                    Category <span className="text-red-600">*</span>
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Education"
                      className={
                        errors.category ? "border-red-400" : "border-[#EADDED]"
                      }
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {CATEGORY_PRESETS.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                            category === cat
                              ? "bg-[#FCE7F3] text-[#9200A8] border border-[#9200A8]"
                              : "bg-[#FAF5FF] text-[#75647B] hover:bg-[#FCE7F3]/60"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.category && (
                    <p className="text-xs text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Badge text */}
                <div className="space-y-2">
                  <Label
                    htmlFor="badge"
                    className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                  >
                    Card Badge Tag
                  </Label>
                  <Input
                    id="badge"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Education First, Health & Well-being"
                    className="border-[#EADDED]"
                  />
                  <p className="text-[11px] text-[#75647B]">
                    Appears as a prominent warm pill at the top of the card.
                  </p>
                </div>
              </div>

              {/* Program Status & Beneficiaries */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Program Status */}
                <div className="space-y-2">
                  <Label
                    htmlFor="programStatus"
                    className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                  >
                    Operational Program Status
                  </Label>
                  <Input
                    id="programStatus"
                    value={programStatus}
                    onChange={(e) => setProgramStatus(e.target.value)}
                    placeholder="Active & Ongoing"
                    className="border-[#EADDED]"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {PROGRAM_STATUS_PRESETS.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setProgramStatus(st)}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                          programStatus === st
                            ? "bg-[#FCE7F3] text-[#9200A8] border border-[#9200A8]"
                            : "bg-[#FAF5FF] text-[#75647B] hover:bg-[#FCE7F3]/60"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Beneficiaries */}
                <div className="space-y-2">
                  <Label
                    htmlFor="beneficiaries"
                    className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                  >
                    Target Beneficiaries
                  </Label>
                  <Input
                    id="beneficiaries"
                    value={beneficiaries}
                    onChange={(e) => setBeneficiaries(e.target.value)}
                    placeholder="e.g. Rural families, elders, and young children"
                    className="border-[#EADDED]"
                  />
                  <p className="text-[11px] text-[#75647B]">
                    Displayed prominently in the action aside card.
                  </p>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="shortDescription"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Short Summary (Optional)
                </Label>
                <Input
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A one-sentence summary for previews or teasers"
                  className="border-[#EADDED]"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Detailed Description <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive narrative of this program's mission, impact, and activities..."
                  className={
                    errors.description ? "border-red-400" : "border-[#EADDED]"
                  }
                />
                {errors.description && (
                  <p className="text-xs text-red-600">{errors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card: Repeatable Deliverables / Features */}
          <Card className="border-[#EADDED] shadow-2xs">
            <CardHeader className="border-b border-[#EADDED]/60 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#35123F]">
                    Key Deliverables & Action Items
                  </h2>
                  <p className="text-xs text-[#75647B]">
                    Bullet points highlighted with checkmarks under this
                    initiative.
                  </p>
                </div>
                <Badge variant="warm" className="text-xs font-semibold">
                  {features.length} {features.length === 1 ? "Item" : "Items"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Add item input */}
              <div className="flex gap-2">
                <Input
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="Type deliverable (e.g. Free general physician consultations) and press Add..."
                  className="border-[#EADDED]"
                />
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  className="shrink-0 bg-[#9200A8] text-white hover:bg-[#7100A8]"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* Items list */}
              {features.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#EADDED] p-6 text-center text-xs text-[#75647B]">
                  No deliverables added yet. Add at least one action point
                  above.
                </div>
              ) : (
                <div className="space-y-2">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-[#EADDED] bg-[#FDF8FF] p-2.5 transition-all hover:border-[#9200A8]/40"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FAF5FF] text-[#9200A8] border border-[#EADDED]">
                        <Check className="h-3.5 w-3.5" />
                      </div>

                      <Input
                        value={feature}
                        onChange={(e) =>
                          handleUpdateFeature(idx, e.target.value)
                        }
                        className="h-8 flex-1 border-transparent bg-transparent text-sm focus-visible:border-[#9200A8] focus-visible:bg-white"
                      />

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveFeatureUp(idx)}
                          disabled={idx === 0}
                          title="Move up"
                          className="h-7 w-7 text-[#75647B] hover:text-[#35123F]"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveFeatureDown(idx)}
                          disabled={idx === features.length - 1}
                          title="Move down"
                          className="h-7 w-7 text-[#75647B] hover:text-[#35123F]"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFeature(idx)}
                          title="Delete deliverable"
                          className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Call to Action Details */}
          <Card className="border-[#EADDED] shadow-2xs">
            <CardHeader className="border-b border-[#EADDED]/60 pb-4">
              <h2 className="text-base font-bold text-[#35123F]">
                Support & Call To Action (CTA)
              </h2>
              <p className="text-xs text-[#75647B]">
                Configure the donor/volunteer call-to-action button rendered on
                the card.
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="ctaText"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Button Text
                </Label>
                <Input
                  id="ctaText"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Support This Work"
                  className="border-[#EADDED]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="ctaLink"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Destination URL
                </Label>
                <Input
                  id="ctaLink"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="/contact"
                  className="border-[#EADDED]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card: SEO Settings */}
          <Card className="border-[#EADDED] shadow-2xs">
            <CardHeader className="border-b border-[#EADDED]/60 pb-4">
              <h2 className="text-base font-bold text-[#35123F]">
                Search Engine Optimization (SEO)
              </h2>
              <p className="text-xs text-[#75647B]">
                Optional metadata for search indexers and social sharing.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label
                  htmlFor="metaTitle"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Meta Title
                </Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Child Education Initiatives | Samartha Trust"
                  className="border-[#EADDED]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="metaDescription"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Discover how Samartha Trust empowers underserved youth with scholarships and schools."
                  className="border-[#EADDED]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings, Visuals & Status */}
        <div className="space-y-6 lg:col-span-4">
          {/* Card: Publication & Status */}
          <Card className="border-[#EADDED] shadow-2xs">
            <CardHeader className="border-b border-[#EADDED]/60 pb-4">
              <h2 className="text-base font-bold text-[#35123F]">
                Status & Visibility
              </h2>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {/* Publication Status */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#35123F]">
                  Publication Status
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["DRAFT", "PUBLISHED", "ARCHIVED"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                        status === s
                          ? s === "PUBLISHED"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs"
                            : s === "DRAFT"
                              ? "border-amber-500 bg-amber-50 text-amber-800 shadow-xs"
                              : "border-slate-500 bg-slate-50 text-slate-800 shadow-xs"
                          : "border-[#EADDED] bg-white text-[#75647B] hover:bg-[#FAF5FF]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#75647B]">
                  Only <strong>PUBLISHED</strong> works appear on the public
                  website.
                </p>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between rounded-xl border border-[#EADDED] bg-[#FDF8FF] p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#35123F]">
                    <Sparkles className="h-3.5 w-3.5 text-[#C00083]" />
                    Featured Initiative
                  </div>
                  <p className="text-[11px] text-[#75647B]">
                    Highlight this work with extra prominence.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 accent-[#9200A8] cursor-pointer"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label
                  htmlFor="displayOrder"
                  className="text-xs font-bold uppercase tracking-wider text-[#35123F]"
                >
                  Display Order
                </Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(e) =>
                    setDisplayOrder(parseInt(e.target.value) || 0)
                  }
                  className="border-[#EADDED]"
                />
                <p className="text-[11px] text-[#75647B]">
                  Lower numbers display first (e.g. 1, 2, 3).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card: Icon Selection */}
          <Card className="border-[#EADDED] shadow-2xs">
            <CardHeader className="border-b border-[#EADDED]/60 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#35123F]">
                    Card Icon
                  </h2>
                  <p className="text-xs text-[#75647B]">
                    Icon displayed next to the work title.
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EADDED] bg-[#FAF5FF] text-[#9200A8]">
                  <SelectedIcon className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_ICONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = iconName === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIconName(item.id)}
                      title={item.label}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all ${
                        isSelected
                          ? "border-[#9200A8] bg-[#FCE7F3] text-[#9200A8] shadow-2xs"
                          : "border-[#EADDED] bg-white text-[#75647B] hover:border-[#9200A8]/50 hover:bg-[#FDF8FF]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="mt-1 text-[9px] font-semibold truncate max-w-full">
                        {item.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Card: Featured Image */}
          <Card className="border-[#EADDED] shadow-2xs">
            <CardHeader className="border-b border-[#EADDED]/60 pb-4">
              <h2 className="text-base font-bold text-[#35123F]">
                Initiative Image (Optional)
              </h2>
              <p className="text-xs text-[#75647B]">
                Upload an image or paste a URL for this work.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {featuredImage ? (
                <div className="space-y-3">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#EADDED] bg-[#FAF5FF]">
                    <Image
                      src={featuredImage}
                      alt="Work initiative visual"
                      fill
                      className="object-cover"
                      unoptimized={featuredImage.startsWith("http")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs font-mono text-[#75647B] max-w-[200px]">
                      {featuredImage}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File upload button */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#EADDED] p-6 text-center transition-colors hover:border-[#9200A8] hover:bg-[#FDF8FF]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF5FF] text-[#9200A8]">
                      {uploadingImage ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </div>
                    <span className="mt-2 text-xs font-bold text-[#35123F]">
                      {uploadingImage
                        ? "Uploading Image..."
                        : "Click to Upload Image"}
                    </span>
                    <span className="mt-1 text-[11px] text-[#75647B]">
                      JPG, PNG, WebP up to 5MB
                    </span>
                  </div>

                  {/* Or paste URL */}
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-[#75647B]">
                      Or paste an external Image URL:
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="border-[#EADDED] text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleApplyImageUrl}
                        className="border-[#EADDED] text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {errors.featuredImage && (
                <p className="text-xs text-red-600">{errors.featuredImage}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
