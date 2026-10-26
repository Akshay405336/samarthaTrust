import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  HeartPulse,
  Users,
  Sprout,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Programs & Initiatives",
  description:
    "Explore the grassroots social initiatives, education programs, and healthcare camps run by Samartha Trust.",
};

const programs = [
  {
    id: "education",
    icon: GraduationCap,
    badge: "Education First",
    title: "Child Education & Scholarship Assistance",
    description:
      "Education is the most powerful tool for breaking intergenerational poverty cycles. Our initiative provides underserved children with holistic academic support.",
    features: [
      "Annual school kit distribution (books, stationery, uniforms)",
      "Merit-cum-means financial scholarships for higher schooling",
      "After-school remedial coaching centers in rural villages",
      "Digital learning workshops introducing computers and basic coding",
    ],
    beneficiaries: "School-going children from marginalized backgrounds",
    status: "Active & Ongoing",
  },
  {
    id: "health",
    icon: HeartPulse,
    badge: "Health & Well-being",
    title: "Preventive Healthcare & Diagnostic Camps",
    description:
      "Access to basic medical screening is often limited in remote or socioeconomically disadvantaged regions. We bridge this critical gap through targeted health camps.",
    features: [
      "Free general physician consultations and vital checks",
      "Vision screening and complimentary corrective spectacles",
      "Pediatric nutrition screening and vitamin supplementation",
      "Hygiene, maternal health, and sanitation awareness workshops",
    ],
    beneficiaries: "Rural families, elders, and young children",
    status: "Active & Ongoing",
  },
  {
    id: "skills",
    icon: Users,
    badge: "Economic Empowerment",
    title: "Vocational Skills & Women Empowerment",
    description:
      "Fostering financial independence and entrepreneurial resilience by equipping women and youth with employable practical skills.",
    features: [
      "Certified tailoring, embroidery, and handicraft training modules",
      "Basic computer literacy and office administration coaching",
      "Micro-enterprise financial literacy and banking guidance",
      "Self-help group (SHG) formation and mentorship networks",
    ],
    beneficiaries: "Rural youth and aspiring women entrepreneurs",
    status: "Active & Ongoing",
  },
  {
    id: "community",
    icon: Sprout,
    badge: "Community Welfare",
    title: "Rural Welfare & Environmental Sustainability",
    description:
      "Strengthening the foundations of communities through sustainable sanitation, ecological conservation, and emergency response.",
    features: [
      "Potable water supply support in drought-prone areas",
      "Community tree-planting and environmental conservation drives",
      "Seasonal emergency relief kit distribution during crises",
      "Elderly and destitute care support in local hamlets",
    ],
    beneficiaries: "Vulnerable community members and regional habitats",
    status: "Active & Ongoing",
  },
];

export default function ProgramsPage() {
  return (
    <div className="bg-white">
      <PageHeader
        badge="Grassroots Action"
        title="Our Programs &"
        highlight="Initiatives"
        description="Comprehensive, community-centered programs engineered to deliver tangible, sustainable change."
      />

      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="space-y-10 sm:space-y-12">
            {programs.map((program) => {
              const Icon = program.icon;

              return (
                <div
                  key={program.id}
                  id={program.id}
                  className="scroll-mt-24 rounded-2xl border border-[#EADDED] bg-white p-8 sm:p-12 shadow-2xs transition-all hover:border-[#9200A8]/30 hover:shadow-md"
                >
                  <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="warm">{program.badge}</Badge>
                        <span className="text-xs font-semibold text-[#9200A8] flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-[#E90078]" />
                          <span>{program.status}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FCE7F3]/60 text-[#9200A8] border border-[#EADDED] shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#35123F] sm:text-3xl">
                          {program.title}
                        </h2>
                      </div>

                      <p className="text-base text-[#75647B] leading-relaxed">
                        {program.description}
                      </p>

                      <div className="pt-2">
                        <h3 className="text-xs font-bold text-[#35123F] mb-3 uppercase tracking-wider">
                          Key Program Deliverables:
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {program.features.map((feature, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-start gap-2.5"
                            >
                              <div className="rounded-full bg-[#FCE7F3] p-0.5 text-[#9200A8] border border-[#EADDED] mt-0.5 shrink-0">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-sm text-[#75647B]">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 rounded-xl border border-[#EADDED] bg-[#FAF5FF] p-6 space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#9200A8]">
                          Target Beneficiaries
                        </span>
                        <p className="mt-1 text-sm font-semibold text-[#35123F]">
                          {program.beneficiaries}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#EADDED] space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#35123F]">
                          Support This Initiative
                        </span>
                        <p className="text-xs text-[#75647B]">
                          Collaborate as a volunteer, institutional partner, or
                          donor for this program.
                        </p>
                        <Button asChild className="w-full">
                          <Link
                            href="/contact"
                            className="gap-2 justify-center"
                          >
                            <span>Get Involved</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Collaboration Callout - Alternate Light Section (~15%) */}
      <section className="bg-[#FAF5FF] py-16 sm:py-20 border-t border-[#EADDED]">
        <Container className="text-center max-w-3xl space-y-6">
          <h2 className="text-3xl font-bold text-[#35123F] tracking-tight sm:text-4xl">
            Have a Program or Community Collaboration in Mind?
          </h2>
          <p className="text-[#75647B] text-base sm:text-lg leading-relaxed">
            We welcome collaborative proposals from fellow non-profits, CSR
            foundations, and passionate civic volunteers to amplify grassroots
            impact.
          </p>
          <div className="pt-2">
            <Button asChild size="lg">
              <Link href="/contact">Propose a Collaboration</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
