"use client";

import * as React from "react";
import Image from "next/image";
import { Users, User as UserIcon, Sparkles } from "lucide-react";
import { LinkedInIcon } from "@/components/shared/social-icons";
import { Container } from "@/components/shared/container";
import { Pagination } from "@/components/shared/pagination";

export interface TeamMemberPublicItem {
  id: string;
  name: string;
  slug: string;
  designation: string;
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
  featuredOnly?: boolean;
  hideIfEmpty?: boolean;
  alternateBackground?: boolean;
  pageSize?: number;
}

export function TeamSection({
  initialMembers,
  title = "Our Leadership &",
  highlight = "Trustees",
  badge = "Our People",
  description = "The dedicated stewards, trustees, and leaders guiding our mission of transparent social impact and community empowerment.",
  featuredOnly = false,
  hideIfEmpty = false,
  pageSize = 9,
}: TeamSectionProps) {
  const [members, setMembers] = React.useState<TeamMemberPublicItem[]>(
    initialMembers || []
  );
  const [isLoading, setIsLoading] = React.useState(!initialMembers);
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    // If initial members were prefetched by the server component, no client fetch is needed
    if (initialMembers) {
      return;
    }

    let active = true;

    async function fetchTeam() {
      setIsLoading(true);

      try {
        const params = new URLSearchParams();

        if (featuredOnly) {
          params.set("featured", "true");
        }

        const response = await fetch(`/api/team?${params.toString()}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (active && response.ok && data.success) {
          setMembers(data.data);
        }
      } catch (error) {
        console.error("Failed to load team members:", error);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void fetchTeam();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredOnly]); // Omit initialMembers reference to prevent re-fetch loop on parent re-renders

  const filteredMembers = React.useMemo(
    () =>
      members
        .filter((member) => {
          if (featuredOnly && !member.isFeatured) {
            return false;
          }

          return true;
        })
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [members, featuredOnly]
  );

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedMembers = React.useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, safePage, pageSize]);

  if (!isLoading && members.length === 0 && hideIfEmpty) {
    return null;
  }

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="relative overflow-hidden bg-white py-10 text-[#492A22] sm:py-12 lg:py-14"
    >
      <Container>
        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F4510B] sm:text-xs">
              <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-[#FF303F] to-[#FFC928]" />
              {badge}
            </div>

            <h2
              id="team-heading"
              className="text-3xl font-extrabold leading-tight tracking-tight text-[#492A22] sm:text-4xl lg:text-5xl"
            >
              {title}{" "}
              <span className="bg-gradient-to-r from-[#FF303F] via-[#FF8A00] to-[#FFC928] bg-clip-text text-transparent">
                {highlight}
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-[#80685F] sm:text-base sm:leading-7 lg:max-w-md">
            {description}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[24px] border border-[#F0E3D8] bg-white"
              >
                <div className="h-52 animate-pulse bg-[#F5EAE1]" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#F5EAE1]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#F5EAE1]" />
                  <div className="h-3 w-full animate-pulse rounded bg-[#F5EAE1]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && members.length === 0 && !hideIfEmpty && (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#EADCCB] bg-white px-6 py-10 text-center shadow-sm">
            <Users className="mx-auto h-8 w-8 text-[#F4510B]" />
            <h3 className="mt-4 text-lg font-bold text-[#492A22]">
              Leadership Directory
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#80685F]">
              Team member profiles will appear here when available.
            </p>
          </div>
        )}

        {/* Team cards */}
        {!isLoading && filteredMembers.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedMembers.map((member) => {
                const bioText = member.shortBio || member.bio;

                return (
                  <article
                    key={member.id}
                    className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[#F0D9C7] bg-white shadow-[0_8px_25px_rgba(86,52,32,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(86,52,32,0.13)]"
                  >
                    {/* Profile image */}
                    <div className="relative h-[250px] overflow-hidden bg-[#F8F3EE] sm:h-[270px]">
                      {member.profileImage ? (
                        <Image
                          src={member.profileImage}
                          alt={member.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#FFF1E7] to-[#FFF8E7]">
                          <UserIcon className="h-16 w-16 text-[#D6A17D]" />
                        </div>
                      )}

                      {/* Designation badge */}
                      {member.designation && (
                        <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/95 px-4 py-2 text-xs font-bold text-[#725548] shadow-sm backdrop-blur-sm">
                          {member.designation}
                        </span>
                      )}

                      {/* LinkedIn icon */}
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on LinkedIn`}
                          title="View LinkedIn profile"
                          className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-[20px] border border-white/80 bg-[#0A66C2] text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-[#004182] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                        >
                          <LinkedInIcon className="h-5 w-5" />
                        </a>
                      )}

                      {/* Featured indicator */}
                      {member.isFeatured && (
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[#725548] shadow-sm">
                          <Sparkles className="h-3.5 w-3.5 text-[#FF8A18]" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Gradient card content */}
                    <div className="relative isolate flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-[#FFB32F] via-[#FF711B] to-[#E9362B] px-5 pb-5 pt-5 text-white sm:px-6">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-12 left-0 right-0 -z-10 h-24 bg-gradient-to-b from-[#FFE6A3]/90 via-[#FF9A29]/75 to-transparent blur-2xl"
                      />

                      <h3 className="text-xl font-extrabold leading-snug tracking-tight text-white">
                        {member.name}
                      </h3>

                      {/* Divider */}
                      <div className="my-4 h-px w-full bg-gradient-to-r from-white/70 via-white/35 to-transparent" />

                      {/* Bio: maximum two lines, then ellipsis */}
                      {bioText && (
                        <p className="line-clamp-2 text-sm leading-6 text-white/95">
                          {bioText}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 border-t border-[#F0E3D8] pt-2">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  totalRecords={filteredMembers.length}
                  limit={pageSize}
                  recordLabel="members"
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    const el = document.getElementById("team");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                />
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}

export function TeamSectionSkeleton() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[24px] border border-[#F0E3D8] bg-white"
            >
              <div className="h-52 animate-pulse bg-[#F5EAE1]" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#F5EAE1]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#F5EAE1]" />
                <div className="h-3 w-full animate-pulse rounded bg-[#F5EAE1]" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
