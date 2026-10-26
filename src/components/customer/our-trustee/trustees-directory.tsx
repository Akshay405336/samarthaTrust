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
import { getAssetUrl } from "@/lib/utils/asset-version";
import { listPublicTeamMembers } from "@/lib/team/team-service";

function getProfileImageUrl(image: string | null | undefined) {
  if (!image) return null;

  if (/^https?:\/\//i.test(image)) return image;

  if (image.startsWith("/")) return getAssetUrl(image);

  return getAssetUrl(`/images/profiles/${image}`);
}

export async function TrusteesDirectory() {
  let members: Awaited<ReturnType<typeof listPublicTeamMembers>> = [];

  try {
    members = await listPublicTeamMembers();
  } catch (error) {
    console.error("Failed to load trustees:", error);
  }

  const sortedMembers = [...members].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        {/* Section heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 border-b border-[#EADDED] pb-7 sm:mb-12 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-[#EADDED] bg-white px-3.5 py-2">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#75647B] sm:text-[11px]">
                The People Behind Our Mission
              </span>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.045em] text-[#35123F] sm:text-4xl lg:text-[46px]">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                Trustees
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#75647B] sm:text-base">
              The dedicated individuals guiding Samartha Trust with compassion,
              integrity, and a shared commitment to creating brighter futures.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:pb-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FCE7F3] text-[#9200A8]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-[#35123F]">
                {sortedMembers.length.toString().padStart(2, "0")}
              </p>
              <p className="mt-1.5 text-xs font-medium text-[#75647B]">
                {sortedMembers.length === 1
                  ? "Trustee profile"
                  : "Trustee profiles"}
              </p>
            </div>
          </div>
        </div>

        {/* Trustee directory */}
        {sortedMembers.length === 0 ? (
          <div className="rounded-3xl border border-[#EADDED] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FCE7F3]">
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
            {sortedMembers.map((member, index) => {
              const imageUrl = getProfileImageUrl(member.profileImage);

              return (
                <article
                  key={member.id}
                  className="group relative overflow-hidden rounded-[22px] border border-[#EADDED] bg-white transition-all duration-300 hover:border-[#9200A8]/40 hover:shadow-[0_14px_40px_rgba(53,18,63,0.07)] sm:rounded-[26px]"
                >
                  {/* Subtle brand accent */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="flex flex-col sm:flex-row">
                    {/* Portrait */}
                    <div className="relative min-h-[290px] shrink-0 overflow-hidden bg-[#FAF5FF] sm:min-h-[320px] sm:w-[250px] md:w-[280px] lg:w-[310px]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={member.name}
                          fill
                          unoptimized
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 280px, 310px"
                          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        />
                      ) : (
                        <div className="flex h-full min-h-[290px] items-center justify-center">
                          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#EADDED] bg-white">
                            <UserRound className="h-11 w-11 text-[#75647B]/50" />
                          </div>
                        </div>
                      )}

                      {/* Image overlay */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#35123F]/20 to-transparent"
                      />

                      {member.isFeatured && (
                        <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9200A8] shadow-sm backdrop-blur-sm">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#9200A8]" />
                          Featured Trustee
                        </div>
                      )}

                      {!member.isFeatured && (
                        <span className="absolute bottom-4 left-4 rounded-full border border-white/80 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#75647B] shadow-sm">
                          Trustee {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-7 md:p-8 lg:p-9">
                      {/* Name and social links */}
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="min-w-0">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#75647B]">
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
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7EAF0] bg-white text-[#0A66C2] transition-all duration-200 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
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
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7EAF0] bg-white text-[#1877F2] transition-all duration-200 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
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
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F0E3E8] bg-white text-[#D62976] transition-all duration-200 hover:border-[#D62976] hover:bg-[#D62976] hover:text-white"
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
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E1EAE4] bg-white text-[#16845B] transition-all duration-200 hover:border-[#16845B] hover:bg-[#16845B] hover:text-white"
                            >
                              <Globe className="h-[17px] w-[17px]" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Biography: show complete text */}
                      {(member.shortBio || member.bio) && (
                        <div className="mt-6 border-t border-[#EADDED] pt-5">
                          {member.shortBio && (
                            <p className="whitespace-pre-line break-words text-sm leading-7 text-[#75647B] sm:text-[15px]">
                              {member.shortBio}
                            </p>
                          )}

                          {member.bio && member.bio !== member.shortBio && (
                            <p
                              className={`whitespace-pre-line break-words text-sm leading-7 text-[#75647B] sm:text-[15px] ${
                                member.shortBio ? "mt-4" : ""
                              }`}
                            >
                              {member.bio}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Contact information */}
                      {(member.email || member.phone) && (
                        <div className="mt-auto pt-6">
                          <div className="flex flex-col gap-3 border-t border-[#EADDED] pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="group/contact flex min-w-0 items-center gap-3 text-sm text-[#75647B] transition-colors hover:text-[#9200A8]"
                              >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FCE7F3] text-[#9200A8] transition-colors group-hover/contact:bg-[#9200A8] group-hover/contact:text-white">
                                  <Mail className="h-4 w-4" />
                                </span>
                                <span className="break-all">
                                  {member.email}
                                </span>
                              </a>
                            )}

                            {member.phone && (
                              <a
                                href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}
                                className="group/contact flex items-center gap-3 text-sm text-[#75647B] transition-colors hover:text-[#9200A8]"
                              >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FCE7F3] text-[#9200A8] transition-colors group-hover/contact:bg-[#9200A8] group-hover/contact:text-white">
                                  <Phone className="h-4 w-4" />
                                </span>
                                <span>{member.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Small visual footer */}
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
