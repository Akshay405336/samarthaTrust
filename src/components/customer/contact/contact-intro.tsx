import * as React from "react";
import { HeartHandshake, Building2, Heart, Users } from "lucide-react";
import { Container } from "@/components/shared/container";

const ENGAGEMENT_AREAS = [
  {
    icon: HeartHandshake,
    title: "Grassroots Volunteering",
    description:
      "Join our weekend health checkups, vocational workshops, and education sessions for specially-abled youth.",
  },
  {
    icon: Building2,
    title: "CSR & Partnerships",
    description:
      "Collaborate with us on audited, high-impact institutional initiatives with full transparency.",
  },
  {
    icon: Heart,
    title: "Donations & Aid",
    description:
      "Support our ongoing initiatives with one-time contributions, nutrition drives, and learning kits.",
  },
  {
    icon: Users,
    title: "Community Outreach",
    description:
      "Refer families, children, or rural clusters in need of education, assistive aid, or medical care.",
  },
];

export function ContactIntro() {
  return (
    <section className="bg-[#FFFCF5] py-10 sm:py-12 border-b border-[#EADCCB]/60">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENGAGEMENT_AREAS.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="flex flex-col rounded-2xl border border-[#EADCCB] bg-white p-5 shadow-2xs transition-all hover:border-[#FF8A00]/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-[#492A22]">
                  {area.title}
                </h3>
                <p className="mt-1 text-xs text-[#78685D] leading-relaxed">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
