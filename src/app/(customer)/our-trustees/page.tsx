import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  TeamSection,
  TeamSectionSkeleton,
  type TeamMemberPublicItem,
} from "@/components/customer/about-us/team-section";
import { listPublicTeamMembers } from "@/lib/team/team-service";

export const metadata: Metadata = {
  title: "Our Trustees & Governance",
  description:
    "Governance, leadership, and board of trustees of Samartha Trust.",
};

async function OurTrusteesTeamSection() {
  let initialMembers: TeamMemberPublicItem[] = [];
  try {
    const members = await listPublicTeamMembers();
    initialMembers = members.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      designation: m.designation,
      profileImage: m.profileImage,
      shortBio: m.shortBio,
      bio: m.bio,
      email: m.email,
      phone: m.phone,
      linkedinUrl: m.linkedinUrl,
      facebookUrl: m.facebookUrl,
      instagramUrl: m.instagramUrl,
      websiteUrl: m.websiteUrl,
      displayOrder: m.displayOrder,
      isFeatured: m.isFeatured,
    }));
  } catch (error) {
    console.error("Failed to prefetch trustees for governance page:", error);
  }

  return (
    <TeamSection
      badge="Board Members"
      title="Board of"
      highlight="Trustees"
      description="Profiles of governing trustees and leaders dedicated to grassroots empowerment and institutional integrity."
      initialMembers={initialMembers}
    />
  );
}

export default function OurTrusteesPage() {
  return (
    <div className="bg-white">
      <PageHeader
        badge="Leadership & Governance"
        title="Our"
        highlight="Trustees"
        description="The dedicated board and governing trustees guiding the vision, values, and community missions of Samartha Trust."
      />

      {/* Governance commitment notice */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#EADCCB]">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-[#EADCCB] bg-[#FFFCF5] p-6 sm:p-10 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#492A22]">
                  Board of Trustees & Stewardship
                </h2>
                <p className="text-xs text-[#78685D]">
                  Registered Public Charitable Trust Governance
                </p>
              </div>
            </div>

            <p className="text-sm text-[#78685D] leading-relaxed">
              Samartha Trust operates under a registered public charitable trust
              deed. Our board of trustees and advisory council oversee all
              social welfare initiatives, ensuring that every program adheres to
              strict statutory compliance, transparent governance, and direct
              beneficiary impact.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href="/contact" className="gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Trust Office</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/about" className="gap-2">
                  <span>About Our Mission</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Dynamic Trustees and Leadership Directory */}
      <React.Suspense fallback={<TeamSectionSkeleton />}>
        <OurTrusteesTeamSection />
      </React.Suspense>
    </div>
  );
}
