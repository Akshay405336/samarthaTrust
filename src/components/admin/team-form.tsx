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
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  Tag,
} from "lucide-react";
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/shared/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TEAM_CATEGORIES, generateSlug } from "@/lib/validations/team";

interface TeamFormProps {
  initialData?: {
    id?: string;
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
  };
  mode: "create" | "edit";
}

export function TeamForm({ initialData, mode }: TeamFormProps) {
  const router = useRouter();

  const [name, setName] = React.useState(initialData?.name || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(
    Boolean(initialData?.slug)
  );
  const [designation, setDesignation] = React.useState(
    initialData?.designation || ""
  );

  const initialCat = initialData?.category || "Trustee";
  const isCustomInitialCat = !TEAM_CATEGORIES.includes(
    initialCat as (typeof TEAM_CATEGORIES)[number]
  );
  const [category, setCategory] = React.useState(
    isCustomInitialCat ? "Other" : initialCat
  );
  const [customCategory, setCustomCategory] = React.useState(
    isCustomInitialCat ? initialCat : ""
  );

  const [profileImage, setProfileImage] = React.useState(
    initialData?.profileImage || ""
  );
  const [shortBio, setShortBio] = React.useState(initialData?.shortBio || "");
  const [bio, setBio] = React.useState(initialData?.bio || "");

  // Contact & Socials
  const [email, setEmail] = React.useState(initialData?.email || "");
  const [phone, setPhone] = React.useState(initialData?.phone || "");
  const [linkedinUrl, setLinkedinUrl] = React.useState(
    initialData?.linkedinUrl || ""
  );
  const [facebookUrl, setFacebookUrl] = React.useState(
    initialData?.facebookUrl || ""
  );
  const [instagramUrl, setInstagramUrl] = React.useState(
    initialData?.instagramUrl || ""
  );
  const [websiteUrl, setWebsiteUrl] = React.useState(
    initialData?.websiteUrl || ""
  );

  // Settings
  const [displayOrder, setDisplayOrder] = React.useState<number>(
    initialData?.displayOrder ?? 0
  );
  const [isFeatured, setIsFeatured] = React.useState(
    initialData?.isFeatured ?? false
  );
  const [isActive, setIsActive] = React.useState(initialData?.isActive ?? true);

  // Status & states
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Auto-generate slug as name changes unless admin edited slug manually
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(newName));
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
      formData.append("folder", "team");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setProfileImage(data.url);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to upload image.";
      setGeneralError(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrors({});
    setGeneralError(null);
    setSuccessMessage(null);

    const finalCategory =
      category === "Other" && customCategory.trim()
        ? customCategory.trim()
        : category;

    const payload = {
      name: name.trim(),
      slug: slug.trim() || generateSlug(name),
      designation: designation.trim(),
      category: finalCategory,
      profileImage: profileImage.trim() || null,
      shortBio: shortBio.trim() || null,
      bio: bio.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      linkedinUrl: linkedinUrl.trim() || null,
      facebookUrl: facebookUrl.trim() || null,
      instagramUrl: instagramUrl.trim() || null,
      websiteUrl: websiteUrl.trim() || null,
      displayOrder: Number(displayOrder) || 0,
      isFeatured,
      isActive,
    };

    try {
      const endpoint =
        mode === "create"
          ? "/api/admin/team"
          : `/api/admin/team/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.details) {
          const fieldErrs: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.details)) {
            if (Array.isArray(v) && v.length > 0) {
              fieldErrs[k] = v[0] as string;
            }
          }
          setErrors(fieldErrs);
        }
        throw new Error(data.error || "Failed to save team member.");
      }

      setSuccessMessage(
        mode === "create"
          ? "Team member created successfully!"
          : "Team member updated successfully!"
      );

      setTimeout(() => {
        router.push("/admin/team");
        router.refresh();
      }, 900);
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "Error saving team member."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#EADCCB] text-[#78685D] hover:bg-[#FFF5E6]"
          >
            <Link href="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Team</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#492A22]">
              {mode === "create" ? "Add Team Member" : "Edit Team Member"}
            </h1>
            <p className="text-xs text-[#78685D]">
              {mode === "create"
                ? "Create a new leadership, trustee, or team profile for public display."
                : `Editing profile for "${name || "Team Member"}"`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => handleSubmit()}
            disabled={saving || uploadingImage}
            className="gap-2 bg-[#F52232] text-white hover:bg-[#D91B29] shadow-xs"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>
                  {mode === "create" ? "Save Member" : "Save Changes"}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {generalError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main profile content (2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info Card */}
            <Card className="border-[#EADCCB] bg-white shadow-2xs">
              <CardHeader className="border-b border-[#EADCCB]/70 bg-[#FFFCF5] px-6 py-4">
                <h2 className="text-base font-bold text-[#492A22]">
                  Profile Details
                </h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-[#492A22]"
                  >
                    Full Name <span className="text-[#F52232]">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Dr. Rajeshwari Sharma"
                    className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                    required
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Designation */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="designation"
                    className="text-sm font-semibold text-[#492A22]"
                  >
                    Designation / Title{" "}
                    <span className="text-[#F52232]">*</span>
                  </Label>
                  <Input
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Managing Trustee & Founder"
                    className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                    required
                  />
                  {errors.designation && (
                    <p className="text-xs text-red-600">{errors.designation}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="slug"
                      className="text-sm font-semibold text-[#492A22]"
                    >
                      Profile URL Slug
                    </Label>
                    <span className="text-[11px] text-[#78685D]">
                      Public URL: /team/{slug || "slug"}
                    </span>
                  </div>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="rajeshwari-sharma"
                    className="font-mono text-xs border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                  />
                  {errors.slug && (
                    <p className="text-xs text-red-600">{errors.slug}</p>
                  )}
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="category"
                    className="text-sm font-semibold text-[#492A22]"
                  >
                    Team Category <span className="text-[#F52232]">*</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="rounded-md border border-[#EADCCB] bg-white px-3 py-2 text-sm text-[#492A22] focus:border-[#FF8A00] focus:outline-hidden"
                    >
                      {TEAM_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Other">Custom Category...</option>
                    </select>

                    {category === "Other" && (
                      <Input
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter custom category"
                        className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                      />
                    )}
                  </div>
                  {errors.category && (
                    <p className="text-xs text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Short Bio */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="shortBio"
                      className="text-sm font-semibold text-[#492A22]"
                    >
                      Short Bio (Card summary)
                    </Label>
                    <span className="text-[11px] text-[#78685D]">
                      {shortBio.length}/500 chars
                    </span>
                  </div>
                  <Textarea
                    id="shortBio"
                    rows={3}
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    placeholder="Brief 1-2 sentence introduction displayed on profile cards and About Us overview..."
                    className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                    maxLength={500}
                  />
                  {errors.shortBio && (
                    <p className="text-xs text-red-600">{errors.shortBio}</p>
                  )}
                </div>

                {/* Full Bio */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-semibold text-[#492A22]"
                  >
                    Full Biography
                  </Label>
                  <Textarea
                    id="bio"
                    rows={6}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Comprehensive background, achievements, community commitment, education, and career profile..."
                    className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                  />
                  {errors.bio && (
                    <p className="text-xs text-red-600">{errors.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Public Contact & Social Links */}
            <Card className="border-[#EADCCB] bg-white shadow-2xs">
              <CardHeader className="border-b border-[#EADCCB]/70 bg-[#FFFCF5] px-6 py-4">
                <h2 className="text-base font-bold text-[#492A22]">
                  Public Contact & Social Handles (Optional)
                </h2>
                <p className="text-xs text-[#78685D]">
                  These details will be publicly displayed on the member profile
                  card and page.
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold text-[#492A22] flex items-center gap-1.5"
                    >
                      <Mail className="h-3.5 w-3.5 text-[#FF8A00]" />
                      <span>Public Email</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trustee@samarthatrust.org"
                      className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-semibold text-[#492A22] flex items-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#FF8A00]" />
                      <span>Public Phone</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="linkedinUrl"
                      className="text-xs font-semibold text-[#492A22] flex items-center gap-1.5"
                    >
                      <LinkedInIcon className="h-3.5 w-3.5 text-blue-600" />
                      <span>LinkedIn Profile URL</span>
                    </Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                    />
                    {errors.linkedinUrl && (
                      <p className="text-xs text-red-600">
                        {errors.linkedinUrl}
                      </p>
                    )}
                  </div>

                  {/* Website */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="websiteUrl"
                      className="text-xs font-semibold text-[#492A22] flex items-center gap-1.5"
                    >
                      <Globe className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Personal / Org Website URL</span>
                    </Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                    />
                    {errors.websiteUrl && (
                      <p className="text-xs text-red-600">
                        {errors.websiteUrl}
                      </p>
                    )}
                  </div>

                  {/* Facebook */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="facebookUrl"
                      className="text-xs font-semibold text-[#492A22] flex items-center gap-1.5"
                    >
                      <FacebookIcon className="h-3.5 w-3.5 text-blue-700" />
                      <span>Facebook URL</span>
                    </Label>
                    <Input
                      id="facebookUrl"
                      type="url"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/username"
                      className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                    />
                    {errors.facebookUrl && (
                      <p className="text-xs text-red-600">
                        {errors.facebookUrl}
                      </p>
                    )}
                  </div>

                  {/* Instagram */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="instagramUrl"
                      className="text-xs font-semibold text-[#492A22] flex items-center gap-1.5"
                    >
                      <InstagramIcon className="h-3.5 w-3.5 text-pink-600" />
                      <span>Instagram URL</span>
                    </Label>
                    <Input
                      id="instagramUrl"
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/username"
                      className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                    />
                    {errors.instagramUrl && (
                      <p className="text-xs text-red-600">
                        {errors.instagramUrl}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings (1 col) */}
          <div className="space-y-6">
            {/* Profile Photo Card */}
            <Card className="border-[#EADCCB] bg-white shadow-2xs">
              <CardHeader className="border-b border-[#EADCCB]/70 bg-[#FFFCF5] px-6 py-4">
                <h2 className="text-base font-bold text-[#492A22]">
                  Profile Photo
                </h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col items-center gap-4">
                  {/* Photo Preview */}
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-[#EADCCB] bg-[#FFF5E6] shadow-inner">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#78685D]">
                        <UserIcon className="h-14 w-14 stroke-1 text-[#78685D]/60" />
                      </div>
                    )}
                  </div>

                  {/* Photo Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="gap-1.5 border-[#EADCCB] text-[#492A22] hover:bg-[#FFF5E6]"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5 text-[#FF8A00]" />
                          <span>
                            {profileImage ? "Change Photo" : "Upload Photo"}
                          </span>
                        </>
                      )}
                    </Button>

                    {profileImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setProfileImage("")}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="Remove photo"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Manual URL entry fallback */}
                  <div className="w-full pt-2 border-t border-[#EADCCB]/60 space-y-1">
                    <Label
                      htmlFor="profileImageUrl"
                      className="text-[11px] text-[#78685D]"
                    >
                      Or paste direct image URL
                    </Label>
                    <Input
                      id="profileImageUrl"
                      type="url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="/images/trustees/name.jpg"
                      className="h-8 text-xs border-[#EADCCB]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Settings Card */}
            <Card className="border-[#EADCCB] bg-white shadow-2xs">
              <CardHeader className="border-b border-[#EADCCB]/70 bg-[#FFFCF5] px-6 py-4">
                <h2 className="text-base font-bold text-[#492A22]">
                  Visibility & Order
                </h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Active Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-[#EADCCB] p-3">
                  <div>
                    <Label
                      htmlFor="isActive"
                      className="text-sm font-semibold text-[#492A22] block cursor-pointer"
                    >
                      Active Status
                    </Label>
                    <p className="text-xs text-[#78685D]">
                      Visible to the public on the website
                    </p>
                  </div>
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-[#EADCCB] text-[#F52232] focus:ring-[#FF8A00] cursor-pointer"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-[#EADCCB] p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <div>
                      <Label
                        htmlFor="isFeatured"
                        className="text-sm font-semibold text-[#492A22] block cursor-pointer"
                      >
                        Featured Profile
                      </Label>
                      <p className="text-xs text-[#78685D]">
                        Highlight in featured leadership cards
                      </p>
                    </div>
                  </div>
                  <input
                    id="isFeatured"
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-[#EADCCB] text-[#FF8A00] focus:ring-[#FF8A00] cursor-pointer"
                  />
                </div>

                {/* Display Order */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="displayOrder"
                      className="text-xs font-semibold text-[#492A22]"
                    >
                      Display Order Sequence
                    </Label>
                    <span className="text-[11px] text-[#78685D]">
                      Lower numbers appear first
                    </span>
                  </div>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="border-[#EADCCB] focus-visible:ring-[#FF8A00]"
                  />
                  {errors.displayOrder && (
                    <p className="text-xs text-red-600">
                      {errors.displayOrder}
                    </p>
                  )}
                </div>

                {/* Final Submit in Sidebar */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={saving || uploadingImage}
                    className="w-full gap-2 bg-[#F52232] text-white hover:bg-[#D91B29] shadow-xs"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>
                          {mode === "create" ? "Add Member" : "Save Changes"}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
