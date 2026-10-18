import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { TeamForm } from "@/components/admin/team-form";
import { getTeamMemberById } from "@/lib/team/team-service";

interface EditTeamMemberPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditTeamMemberPageProps): Promise<Metadata> {
  const { id } = await params;
  const member = await getTeamMemberById(id);
  return {
    title: member
      ? `Edit "${member.name}" | Team Management`
      : "Edit Team Member",
  };
}

export default async function EditTeamMemberPage({
  params,
}: EditTeamMemberPageProps) {
  const { id } = await params;
  const member = await getTeamMemberById(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Team Management", href: "/admin/team" },
          { label: `Edit: ${member.name}` },
        ]}
      />
      <TeamForm
        mode="edit"
        initialData={{
          id: member.id,
          name: member.name,
          slug: member.slug,
          designation: member.designation,
          category: member.category,
          profileImage: member.profileImage,
          bio: member.bio,
          shortBio: member.shortBio,
          email: member.email,
          phone: member.phone,
          linkedinUrl: member.linkedinUrl,
          facebookUrl: member.facebookUrl,
          instagramUrl: member.instagramUrl,
          websiteUrl: member.websiteUrl,
          displayOrder: member.displayOrder,
          isFeatured: member.isFeatured,
          isActive: member.isActive,
        }}
      />
    </div>
  );
}
