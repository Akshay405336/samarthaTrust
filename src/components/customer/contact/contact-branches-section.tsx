import * as React from "react";
import { Building2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ContactBranchCard } from "./contact-branch-card";
import { BRANCH_LOCATIONS } from "./contact-constants";

export function ContactBranchesSection() {
  return (
    <section className="bg-[#FAF5FF] py-14 sm:py-20 border-t border-[#EADDED]">
      <Container>
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EADDED] bg-[#FCE7F3]/60 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9200A8] mb-3 shadow-2xs">
            <Building2 className="h-3.5 w-3.5" />
            <span>Community Facilities</span>
          </div>

          <h2 className="text-2xl font-bold text-[#35123F] sm:text-3xl lg:text-4xl">
            Our Branch Locations
          </h2>

          <p className="mt-2 text-sm text-[#75647B] max-w-2xl mx-auto leading-relaxed">
            In addition to our registered administrative headquarters, Samartha
            Trust operates dedicated hostels, rehabilitation homes, and inclusive
            school branches across Bengaluru.
          </p>
        </div>

        {/* 3 Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {BRANCH_LOCATIONS.map((branch) => (
            <ContactBranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      </Container>
    </section>
  );
}
