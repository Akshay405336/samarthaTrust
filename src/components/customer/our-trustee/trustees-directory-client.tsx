"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/shared/social-icons";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

export type TrusteeDirectoryItem = {
  id: string;
  name: string;
  designation: string | null;
  profileImageUrl: string | null;
  shortBio: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  websiteUrl: string | null;
  isFeatured: boolean;
};

type TrusteesDirectoryClientProps = {
  members: TrusteeDirectoryItem[];
};

const CARD_ENTERS = ["help-card-rise", "help-card-sway", "help-card-pop"] as const;

export function TrusteesDirectoryClient({
  members,
}: TrusteesDirectoryClientProps) {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.08,
  });

  const countLabel =
    members.length === 1 ? "Trustee profile" : "Trustee profiles";

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-[#FAF5FF]/50 via-white to-white py-12 sm:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="help-section-grid-bg pointer-events-none absolute inset-0 opacity-35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#FCE7F3]/50 blur-3xl"
      />

      <Container className="relative">
        <div className="mb-9 flex flex-col justify-between gap-5 border-b border-[#EADDED] pb-7 sm:mb-12 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div
              className={cn(
                revealVariant("slide-right"),
                "mb-4 inline-flex items-center gap-2.5 rounded-full border border-[#EADDED] bg-white px-3.5 py-2 shadow-sm"
              )}
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078]" />
              <span className="bg-gradient-to-r from-[#7100A8] to-[#9200A8] bg-clip-text text-[10px] font-bold uppercase tracking-[0.19em] text-transparent sm:text-[11px]">
                The People Behind Our Mission
              </span>
            </div>

            <h2
              className={cn(
                revealVariant("scale-in"),
                "text-3xl font-extrabold leading-tight tracking-[-0.045em] text-[#35123F] sm:text-4xl lg:text-[46px]"
              )}
              style={{ animationDelay: "100ms" }}
            >
              Meet Our{" "}
              <span className="relative inline-block">
                <span className="help-team-wave bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                  Trustees
                </span>
                <span
                  className="about-title-underline absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078]"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p
              className={cn(
                revealVariant("blur-in"),
                "mt-4 max-w-xl text-sm leading-7 text-[#75647B] sm:text-base"
              )}
              style={{ animationDelay: "200ms" }}
            >
              The dedicated individuals guiding Samartha Trust with compassion,
              integrity, and a shared commitment to creating brighter futures.
            </p>
          </div>

          <div
            className={cn(
              revealVariant("clip-up"),
              "about-ring-pulse flex shrink-0 items-center gap-3 rounded-2xl border border-[#EADDED] bg-white px-4 py-3 shadow-sm sm:pb-1"
            )}
            style={{ animationDelay: "280ms" }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7100A8] to-[#E90078] text-white shadow-md">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-[#35123F]">
                {members.length.toString().padStart(2, "0")}
              </p>
              <p className="mt-1.5 text-xs font-medium text-[#75647B]">
                {countLabel}
              </p>
            </div>
          </div>
        </div>

        {members.length === 0 ? (
          <div
            className={cn(
              revealVariant("scale-in"),
              "rounded-3xl border border-[#EADDED] bg-gradient-to-br from-white to-[#FAF5FF] px-6 py-16 text-center"
            )}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FCE7F3] to-[#EDE9FE]">
              <Users className="h-7 w-7 text-[#9200A8]" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#35123F]">
              Trustee profiles coming soon
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75647B]">
              Published trustee profiles will appear here as we introduce the
              people guiding our mission.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {members.map((member, index) => {
              const enterClass = CARD_ENTERS[index % CARD_ENTERS.length];
              const enterActive = `${enterClass}-active`;
              const delay = 120 + index * 110;

              return (
                <article
                  key={member.id}
                  className={cn(
                    enterClass,
                    isInView && enterActive,
                    member.isFeatured && "help-card-glow",
                    "motion-card-tilt home-card-hover group relative overflow-hidden rounded-[22px] border border-[#EADDED] bg-white sm:rounded-[26px]"
                  )}
                  style={
                    {
                      animationDelay: `${delay}ms`,
                      "--help-card-glow":
                        "linear-gradient(120deg, #7100A8, #9200A8, #E90078)",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="help-accent-bar absolute inset-x-0 top-0 z-10 h-1.5 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]"
                    aria-hidden="true"
                  />

                  <div className="flex flex-col sm:flex-row">
                    <div className="relative min-h-[290px] shrink-0 overflow-hidden bg-gradient-to-br from-[#FAF5FF] to-[#FCE7F3] sm:min-h-[320px] sm:w-[250px] md:w-[280px] lg:w-[310px]">
                      {member.profileImageUrl ? (
                        <Image
                          src={member.profileImageUrl}
                          alt={member.name}
                          fill
                          unoptimized
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 280px, 310px"
                          className="home-img-zoom object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full min-h-[290px] items-center justify-center">
                          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#EADDED] bg-white shadow-inner">
                            <UserRound className="h-11 w-11 text-[#9200A8]/40" />
                          </div>
                        </div>
                      )}

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#35123F]/35 via-[#7100A8]/10 to-transparent"
                      />

                      {member.isFeatured ? (
                        <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9200A8] shadow-sm backdrop-blur-sm">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#9200A8]" />
                          Featured Trustee
                        </div>
                      ) : (
                        <span className="absolute bottom-4 left-4 rounded-full border border-white/80 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#75647B] shadow-sm">
                          Trustee {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-7 md:p-8 lg:p-9">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="min-w-0">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#9200A8]/80">
                            Samartha Trust · Leadership
                          </p>
                          <h3 className="break-words text-2xl font-extrabold leading-tight tracking-[-0.035em] text-[#35123F] sm:text-[27px]">
                            {member.name}
                          </h3>
                          {member.designation && (
                            <p className="mt-2 text-sm font-semibold leading-6 text-[#9200A8] sm:text-[15px]">
                              {member.designation}
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} on LinkedIn`}
                              title="LinkedIn"
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7EAF0] bg-white text-[#0A66C2] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
                            >
                              <LinkedInIcon className="h-[17px] w-[17px]" />
                            </a>
                          )}
                          {member.facebookUrl && (
                            <a
                              href={member.facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} on Facebook`}
                              title="Facebook"
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7EAF0] bg-white text-[#1877F2] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                            >
                              <FacebookIcon className="h-[17px] w-[17px]" />
                            </a>
                          )}
                          {member.instagramUrl && (
                            <a
                              href={member.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} on Instagram`}
                              title="Instagram"
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F0E3E8] bg-white text-[#D62976] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D62976] hover:bg-[#D62976] hover:text-white"
                            >
                              <InstagramIcon className="h-[17px] w-[17px]" />
                            </a>
                          )}
                          {member.websiteUrl && (
                            <a
                              href={member.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name}'s website`}
                              title="Website"
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E1EAE4] bg-white text-[#16845B] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16845B] hover:bg-[#16845B] hover:text-white"
                            >
                              <Globe className="h-[17px] w-[17px]" />
                            </a>
                          )}
                        </div>
                      </div>

                      {(member.shortBio || member.bio) && (
                        <div className="mt-6 border-t border-[#EADDED] pt-5">
                          {member.shortBio && (
                            <p className="whitespace-pre-line break-words text-sm leading-7 text-[#75647B] sm:text-[15px]">
                              {member.shortBio}
                            </p>
                          )}
                          {member.bio && member.bio !== member.shortBio && (
                            <p
                              className={cn(
                                "whitespace-pre-line break-words text-sm leading-7 text-[#75647B] sm:text-[15px]",
                                member.shortBio && "mt-4"
                              )}
                            >
                              {member.bio}
                            </p>
                          )}
                        </div>
                      )}

                      {(member.email || member.phone) && (
                        <div className="mt-auto pt-6">
                          <div className="flex flex-col gap-3 border-t border-[#EADDED] pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="group/contact flex min-w-0 items-center gap-3 text-sm text-[#75647B] transition-colors hover:text-[#9200A8]"
                              >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FCE7F3] to-[#FAF5FF] text-[#9200A8] transition-all group-hover/contact:from-[#9200A8] group-hover/contact:to-[#7100A8] group-hover/contact:text-white">
                                  <Mail className="h-4 w-4" />
                                </span>
                                <span className="break-all">{member.email}</span>
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}
                                className="group/contact flex items-center gap-3 text-sm text-[#75647B] transition-colors hover:text-[#9200A8]"
                              >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FCE7F3] to-[#FAF5FF] text-[#9200A8] transition-all group-hover/contact:from-[#9200A8] group-hover/contact:to-[#7100A8] group-hover/contact:text-white">
                                  <Phone className="h-4 w-4" />
                                </span>
                                <span>{member.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex items-center justify-between border-t border-[#EADDED] pt-4">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#75647B]">
                          Compassion · Commitment · Community
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-[#75647B]/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#9200A8]" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
