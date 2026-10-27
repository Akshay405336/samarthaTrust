"use client";

import * as React from "react";
import Image from "next/image";
import { Users, User as UserIcon, Sparkles } from "lucide-react";
import { LinkedInIcon } from "@/components/shared/social-icons";
import { Container } from "@/components/shared/container";
import { Pagination } from "@/components/shared/pagination";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

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

  const { ref: sectionRef, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.1,
  });

  if (!isLoading && members.length === 0 && hideIfEmpty) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="team"
      aria-labelledby="team-heading"
      className="relative overflow-hidden bg-gradient-to-b from-white to-[#FAF5FF]/80 py-10 text-[#35123F] sm:py-12 lg:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-[#FCE7F3]/50 blur-3xl"
      />
      <Container className="relative">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div
              className={cn(
                revealVariant("slide-left"),
                "mb-3 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] sm:text-xs"
              )}
            >
              <span className="h-1.5 w-6 animate-pulse rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078]" />
              <span className="bg-gradient-to-r from-[#7100A8] to-[#9200A8] bg-clip-text text-transparent">
                {badge}
              </span>
            </div>

            <h2
              id="team-heading"
              className={cn(
                revealVariant("scale-in"),
                "text-3xl font-extrabold leading-tight tracking-tight text-[#35123F] sm:text-4xl lg:text-5xl"
              )}
              style={{ animationDelay: "100ms" }}
            >
              {title}{" "}
              <span className="relative inline-block">
                <span className="help-team-wave bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                  {highlight}
                </span>
                <span
                  className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078] opacity-70"
                  aria-hidden="true"
                />
              </span>
            </h2>
          </div>

          <p
            className={cn(
              revealVariant("blur-in"),
              "max-w-xl text-sm leading-6 text-[#75647B] sm:text-base sm:leading-7 lg:max-w-md"
            )}
            style={{ animationDelay: "180ms" }}
          >
            {description}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[24px] border border-[#EADDED] bg-white"
              >
                <div className="h-52 animate-pulse bg-[#FAF5FF]" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#FAF5FF]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#FAF5FF]" />
                  <div className="h-3 w-full animate-pulse rounded bg-[#FAF5FF]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && members.length === 0 && !hideIfEmpty && (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#EADDED] bg-white px-6 py-10 text-center shadow-sm">
            <Users className="mx-auto h-8 w-8 text-[#9200A8]" />
            <h3 className="mt-4 text-lg font-bold text-[#35123F]">
              Leadership Directory
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#75647B]">
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
                    className="motion-card-tilt home-card-hover group relative flex flex-col overflow-hidden rounded-[24px] border border-[#EADDED] bg-white shadow-[0_8px_25px_rgba(53,18,63,0.07)] hover:border-[#9200A8]/35 hover:shadow-[0_16px_34px_rgba(113,0,168,0.12)]"
                  >
                    <div
                      className="absolute inset-x-0 top-0 z-10 h-1 scale-x-0 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] transition-transform duration-500 group-hover:scale-x-100"
                      aria-hidden="true"
                    />
                    {/* Profile image */}
                    <div className="relative h-[250px] overflow-hidden bg-[#FAF5FF] sm:h-[270px]">
                      {member.profileImage ? (
                        <Image
                          src={member.profileImage}
                          alt={member.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="home-img-zoom object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#FAF5FF] to-[#FCE7F3]">
                          <UserIcon className="h-16 w-16 text-[#75647B]/60" />
                        </div>
                      )}

                      {/* Designation badge */}
                      {member.designation && (
                        <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/95 px-4 py-2 text-xs font-bold text-[#75647B] shadow-sm backdrop-blur-sm">
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
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[#75647B] shadow-sm">
                          <Sparkles className="h-3.5 w-3.5 text-[#E90078]" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Gradient card content */}
                    <div className="relative isolate flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-[#7100A8] via-[#9200A8] to-[#C00083] px-5 pb-5 pt-5 text-white sm:px-6">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-12 left-0 right-0 -z-10 h-24 bg-gradient-to-b from-[#FCE7F3]/30 via-[#9200A8]/30 to-transparent blur-2xl"
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
              <div className="mt-8 border-t border-[#EADDED] pt-2">
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
              className="overflow-hidden rounded-[24px] border border-[#EADDED] bg-white"
            >
              <div className="h-52 animate-pulse bg-[#FAF5FF]" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#FAF5FF]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#FAF5FF]" />
                <div className="h-3 w-full animate-pulse rounded bg-[#FAF5FF]" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
