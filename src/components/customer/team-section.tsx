"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Globe,
  Mail,
  Phone,
  ArrowRight,
  User as UserIcon,
  Sparkles,
} from "lucide-react";
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/shared/social-icons";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface TeamMemberPublicItem {
  id: string;
  name: string;
  slug: string;
  designation: string;
  category: string;
  profileImage?: string | null;
  shortBio?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  displayOrder: number;
  isFeatured: boolean;
}

interface TeamSectionProps {
  initialMembers?: TeamMemberPublicItem[];
  title?: string;
  highlight?: string;
  badge?: string;
  description?: string;
  categoryFilter?: string;
  showCategoryTabs?: boolean;
  featuredOnly?: boolean;
  hideIfEmpty?: boolean;
  alternateBackground?: boolean;
}

export function TeamSection({
  initialMembers,
  title = "Our Leadership &",
  highlight = "Trustees",
  badge = "Our People",
  description = "The dedicated stewards, trustees, and leaders driving our mission of transparent social impact and community empowerment.",
  categoryFilter,
  showCategoryTabs = true,
  featuredOnly = false,
  hideIfEmpty = false,
  alternateBackground = false,
}: TeamSectionProps) {
  const [members, setMembers] = React.useState<TeamMemberPublicItem[]>(
    initialMembers || []
  );
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    categoryFilter || "ALL"
  );
  const [isLoading, setIsLoading] = React.useState(!initialMembers);

  React.useEffect(() => {
    if (initialMembers) {
      setMembers(initialMembers);
      return;
    }

    let active = true;
    async function fetchTeam() {
      try {
        const params = new URLSearchParams();
        if (categoryFilter && categoryFilter !== "ALL") {
          params.set("category", categoryFilter);
        }
        if (featuredOnly) {
          params.set("featured", "true");
        }

        const res = await fetch(`/api/team?${params.toString()}`);
        const data = await res.json();
        if (active && res.ok && data.success) {
          setMembers(data.data);
        }
      } catch (err) {
        console.error("Failed to load team members:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void fetchTeam();
    return () => {
      active = false;
    };
  }, [initialMembers, categoryFilter, featuredOnly]);

  // Extract distinct categories available from members
  const availableCategories = React.useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set).sort();
  }, [members]);

  const filteredMembers = React.useMemo(() => {
    return members.filter((m) => {
      if (
        selectedCategory !== "ALL" &&
        m.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      if (featuredOnly && !m.isFeatured) {
        return false;
      }
      return true;
    });
  }, [members, selectedCategory, featuredOnly]);

  if (!isLoading && members.length === 0) {
    if (hideIfEmpty) return null;

    return (
      <section
        className={`py-16 sm:py-20 border-b border-[#EADCCB] ${alternateBackground ? "bg-[#FFFCF5]" : "bg-white"}`}
      >
        <Container>
          <SectionHeading
            badge={badge}
            title={title}
            highlight={highlight}
            description={description}
          />
          <div className="mx-auto max-w-lg rounded-xl border border-[#EADCCB] bg-white p-8 text-center shadow-2xs space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5E6] text-[#FF8A00] border border-[#EADCCB]">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#492A22]">
              Leadership Directory
            </h3>
            <p className="text-xs text-[#78685D] leading-relaxed">
              Profiles of trustees, directors, and advisory committee members
              are being updated by the Trust secretariat.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="team-heading"
      className={`py-16 sm:py-24 border-b border-[#EADCCB] ${alternateBackground ? "bg-[#FFFCF5]" : "bg-white"}`}
    >
      <Container>
        <SectionHeading
          badge={badge}
          title={title}
          highlight={highlight}
          description={description}
        />

        {/* Category Pills Filter */}
        {showCategoryTabs &&
          availableCategories.length > 1 &&
          !categoryFilter && (
            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === "ALL"
                    ? "bg-[#F52232] text-white shadow-xs"
                    : "bg-white border border-[#EADCCB] text-[#78685D] hover:border-[#FF8A00] hover:text-[#492A22]"
                }`}
              >
                All Leadership ({members.length})
              </button>
              {availableCategories.map((cat) => {
                const count = members.filter(
                  (m) => m.category.toLowerCase() === cat.toLowerCase()
                ).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? "bg-[#F52232] text-white shadow-xs"
                        : "bg-white border border-[#EADCCB] text-[#78685D] hover:border-[#FF8A00] hover:text-[#492A22]"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

        {/* Members Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="group relative flex flex-col justify-between overflow-hidden border border-[#EADCCB] bg-white transition-all hover:border-[#FF8A00]/60 hover:shadow-md"
            >
              <CardContent className="p-6 space-y-4">
                {/* Photo & Badge header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#EADCCB] bg-[#FFF5E6] shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    {member.profileImage ? (
                      <Image
                        src={member.profileImage}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#78685D]/60 bg-[#FFF5E6]">
                        <UserIcon className="h-10 w-10 stroke-1" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <Badge
                      variant="secondary"
                      className="bg-[#FFF5E6] text-[#492A22] border-[#EADCCB] text-[11px] font-semibold"
                    >
                      {member.category}
                    </Badge>
                    {member.isFeatured && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200"
                        title="Featured leadership member"
                      >
                        <Sparkles className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & Designation */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#492A22] group-hover:text-[#F52232] transition-colors leading-snug">
                    <Link href={`/team/${member.slug}`}>{member.name}</Link>
                  </h3>
                  <p className="text-xs font-semibold text-[#FF8A00] leading-tight">
                    {member.designation}
                  </p>
                </div>

                {/* Short Bio */}
                {member.shortBio && (
                  <p className="text-xs text-[#78685D] leading-relaxed line-clamp-3">
                    {member.shortBio}
                  </p>
                )}

                {/* Social and Contact Icons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[#78685D]">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#EADCCB] bg-[#FFFDF9] text-[#78685D] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      title={`${member.name} on LinkedIn`}
                    >
                      <LinkedInIcon className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {member.websiteUrl && (
                    <a
                      href={member.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#EADCCB] bg-[#FFFDF9] text-[#78685D] hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                      title="Personal / Professional Website"
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {member.facebookUrl && (
                    <a
                      href={member.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#EADCCB] bg-[#FFFDF9] text-[#78685D] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                      title="Facebook Profile"
                    >
                      <FacebookIcon className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {member.instagramUrl && (
                    <a
                      href={member.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#EADCCB] bg-[#FFFDF9] text-[#78685D] hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors"
                      title="Instagram Profile"
                    >
                      <InstagramIcon className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#EADCCB] bg-[#FFFDF9] text-[#78685D] hover:bg-red-50 hover:text-[#F52232] hover:border-red-200 transition-colors"
                      title={member.email}
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#EADCCB] bg-[#FFFDF9] text-[#78685D] hover:bg-orange-50 hover:text-[#FF8A00] hover:border-orange-200 transition-colors"
                      title={member.phone}
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </CardContent>

              {/* View Full Profile link */}
              <div className="border-t border-[#EADCCB]/70 bg-[#FFFCF5] px-6 py-3">
                <Link
                  href={`/team/${member.slug}`}
                  className="inline-flex items-center text-xs font-semibold text-[#F52232] hover:text-[#FF8A00] gap-1 transition-colors"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
