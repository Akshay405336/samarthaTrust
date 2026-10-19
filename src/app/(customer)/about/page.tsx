import * as React from "react";
import type { Metadata } from "next";
import { AboutBanner } from "@/components/customer/about-us/about-banner";
import { AboutHeroSection } from "@/components/customer/about-us/about-hero-section";
import { VisionMissionSection } from "@/components/customer/about-us/vision-mission-section";
import { ProgramsSection } from "@/components/customer/about-us/programs-section";
import {
  TeamSection,
  TeamSectionSkeleton,
  type TeamMemberPublicItem,
} from "@/components/customer/about-us/team-section";
import { listPublicTeamMembers } from "@/lib/team/team-service";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Samartha Trust, our mission, and our commitment to inclusive education, healthcare, and community support.",
};

async function AboutTeamSection() {
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
    console.error("Failed to prefetch team members for about page:", error);
  }

  return (
    <TeamSection
      badge="Our People"
      title="Our Leadership &"
      highlight="Trustees"
      description="The dedicated stewards, trustees, and leaders guiding our mission of transparent social impact and community empowerment."
      initialMembers={initialMembers}
    />
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutBanner />

      <AboutHeroSection />

      <VisionMissionSection />

      <ProgramsSection />

      <React.Suspense fallback={<TeamSectionSkeleton />}>
        <AboutTeamSection />
      </React.Suspense>
    </main>
  );
}
