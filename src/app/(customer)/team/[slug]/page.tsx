import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  User as UserIcon,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/shared/social-icons";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTeamMemberBySlug } from "@/lib/team/team-service";

interface TeamMemberPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const members = await prisma.teamMember.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    if (members.length > 0) {
      return members.map((m) => ({ slug: m.slug }));
    }
  } catch {
    // Fallback if db is unavailable at build time
  }

  // Next.js 16 with Cache Components requires generateStaticParams to return at least one result
  return [{ slug: "trustee" }];
}

export async function generateMetadata({
  params,
}: TeamMemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug, true);

  if (!member) {
    return {
      title: "Profile Not Found | Samartha Trust",
      description: "The requested team member profile could not be found.",
    };
  }

  const title = `${member.name} - ${member.designation} | Samartha Trust`;
  const description =
    member.shortBio ||
    `${member.name} serves as ${member.designation} at Samartha Trust. Learn about their background and community stewardship.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      ...(member.profileImage
        ? {
            images: [
              {
                url: member.profileImage,
                width: 800,
                height: 800,
                alt: member.name,
              },
            ],
          }
        : {}),
    },
  };
}

export default function TeamMemberProfilePage({ params }: TeamMemberPageProps) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-white py-16">
          <Container className="max-w-4xl text-center">
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F52232] border-t-transparent" />
              <p className="text-xs text-[#78685D]">Loading profile...</p>
            </div>
          </Container>
        </div>
      }
    >
      <TeamMemberProfileContent params={params} />
    </React.Suspense>
  );
}

async function TeamMemberProfileContent({ params }: TeamMemberPageProps) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug, true);

  if (!member) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Back navigation header */}
      <div className="border-b border-[#EADCCB]/70 bg-[#FFFCF5] py-4">
        <Container>
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2 text-[#78685D] hover:text-[#492A22] hover:bg-[#FFF5E6]"
            >
              <Link href="/about">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to About Us</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-white text-[#492A22] border-[#EADCCB] text-xs font-semibold"
              >
                {member.category}
              </Badge>
              {member.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  <Sparkles className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>Featured</span>
                </span>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Main profile section */}
      <section className="py-12 sm:py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Portrait & Details (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border-2 border-[#EADCCB] bg-[#FFF5E6] shadow-md">
                {member.profileImage ? (
                  <Image
                    src={member.profileImage}
                    alt={member.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 320px, 380px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#78685D]/60 bg-[#FFF5E6]">
                    <UserIcon className="h-24 w-24 stroke-1" />
                  </div>
                )}
              </div>

              {/* Public Contact Card */}
              {(member.email ||
                member.phone ||
                member.linkedinUrl ||
                member.websiteUrl ||
                member.facebookUrl ||
                member.instagramUrl) && (
                <div className="rounded-xl border border-[#EADCCB] bg-[#FFFCF5] p-5 space-y-3.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F52232]">
                    Connect & Verification
                  </h3>

                  <div className="space-y-2.5 text-sm text-[#78685D]">
                    {member.email && (
                      <div className="flex items-center gap-2.5">
                        <Mail className="h-4 w-4 text-[#FF8A00] shrink-0" />
                        <a
                          href={`mailto:${member.email}`}
                          className="hover:text-[#F52232] transition-colors truncate"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}

                    {member.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-[#FF8A00] shrink-0" />
                        <a
                          href={`tel:${member.phone}`}
                          className="hover:text-[#F52232] transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}

                    {member.websiteUrl && (
                      <div className="flex items-center gap-2.5">
                        <Globe className="h-4 w-4 text-[#FF8A00] shrink-0" />
                        <a
                          href={member.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#F52232] transition-colors truncate"
                        >
                          {member.websiteUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Social icons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EADCCB]/60">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EADCCB] bg-white text-[#78685D] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <LinkedInIcon className="h-4 w-4" />
                      </a>
                    )}

                    {member.facebookUrl && (
                      <a
                        href={member.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EADCCB] bg-white text-[#78685D] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                        title="Facebook Profile"
                      >
                        <FacebookIcon className="h-4 w-4" />
                      </a>
                    )}

                    {member.instagramUrl && (
                      <a
                        href={member.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EADCCB] bg-white text-[#78685D] hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors"
                        title="Instagram Profile"
                      >
                        <InstagramIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Bio & Achievements (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F52232]">
                  {member.category}
                </span>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#492A22] sm:text-4xl">
                  {member.name}
                </h1>
                <p className="mt-2 text-base font-semibold text-[#FF8A00] sm:text-lg">
                  {member.designation}
                </p>
              </div>

              {/* Short Bio Highlight */}
              {member.shortBio && (
                <div className="rounded-xl border-l-4 border-[#F52232] bg-[#FFFCF5] p-5 text-sm sm:text-base text-[#492A22] leading-relaxed font-medium">
                  {member.shortBio}
                </div>
              )}

              {/* Full Biography */}
              {member.bio ? (
                <div className="prose prose-stone max-w-none text-[#78685D] leading-relaxed space-y-4 pt-2">
                  {member.bio.split("\n\n").map((para, idx) => (
                    <p
                      key={idx}
                      className="whitespace-pre-line text-sm sm:text-base"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#78685D] italic">
                  Biography is currently being curated by the Samartha Trust
                  administrative office.
                </p>
              )}

              {/* Trust Stewardship Banner */}
              <div className="mt-10 rounded-xl border border-[#EADCCB] bg-white p-6 shadow-2xs flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] shrink-0 mt-0.5">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#492A22]">
                    Dedicated to Community Welfare & Governance
                  </h4>
                  <p className="text-xs text-[#78685D] mt-1 leading-relaxed">
                    All trustees, advisory members, and leadership personnel at
                    Samartha Trust serve in accordance with the registered
                    public charitable trust deed, ensuring transparent resource
                    allocation and direct beneficiary service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
