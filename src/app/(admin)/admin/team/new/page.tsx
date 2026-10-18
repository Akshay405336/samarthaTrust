import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { TeamForm } from "@/components/admin/team-form";

export const metadata: Metadata = {
  title: "Add Team Member | Samartha Trust Admin",
};

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Team Management", href: "/admin/team" },
          { label: "Add Team Member" },
        ]}
      />
      <TeamForm mode="create" />
    </div>
  );
}
