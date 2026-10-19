import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { WorkForm } from "@/components/admin/work-form";

export const metadata: Metadata = {
  title: "Add Work Initiative | Samartha Trust Admin",
};

export default function NewWorkPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Our Works", href: "/admin/works" },
          { label: "Add Work Initiative" },
        ]}
      />
      <WorkForm mode="create" />
    </div>
  );
}
