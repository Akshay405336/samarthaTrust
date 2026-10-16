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
  title: "Our Works",
  description:
    "Explore the grassroots social works, education programs, and healthcare camps conducted by Samartha Trust.",
};

const works = [
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

export default function OurWorksPage() {
  return (
    <div className="bg-white">
      <PageHeader
        badge="Grassroots Action"
        title="Our"
        highlight="Works"
        description="Comprehensive, community-centered works and initiatives engineered to deliver tangible, sustainable change."
      />

      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="space-y-10 sm:space-y-12">
            {works.map((work) => {
              const Icon = work.icon;

              return (
                <div
                  key={work.id}
                  id={work.id}
                  className="scroll-mt-24 rounded-2xl border border-[#EADCCB] bg-white p-8 sm:p-12 shadow-2xs transition-all hover:border-[#FF8A00]/50 hover:shadow-md"
                >
                  <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="warm">{work.badge}</Badge>
                        <span className="text-xs font-semibold text-[#F52232] flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-[#FF8A00]" />
                          <span>{work.status}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#492A22] sm:text-3xl">
                          {work.title}
                        </h2>
                      </div>

                      <p className="text-base text-[#78685D] leading-relaxed">
                        {work.description}
                      </p>

                      <div className="pt-2">
                        <h3 className="text-xs font-bold text-[#492A22] mb-3 uppercase tracking-wider">
                          Key Deliverables:
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {work.features.map((feature, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-start gap-2.5"
                            >
                              <div className="rounded-full bg-[#FFF5E6] p-0.5 text-[#F52232] border border-[#EADCCB] mt-0.5 shrink-0">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-sm text-[#78685D]">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 rounded-xl border border-[#EADCCB] bg-[#FFFCF5] p-6 space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#F52232]">
                          Target Beneficiaries
                        </span>
                        <p className="mt-1 text-sm font-semibold text-[#492A22]">
                          {work.beneficiaries}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#EADCCB] space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#492A22]">
                          Support This Work
                        </span>
                        <p className="text-xs text-[#78685D]">
                          Collaborate as a volunteer, institutional partner, or
                          donor for this initiative.
                        </p>
                        <Button asChild className="w-full">
                          <Link
                            href="/contact"
                            className="gap-2 justify-center"
                          >
                            <span>Donations & Support</span>
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

      {/* Collaboration Callout */}
      <section className="bg-[#FFFCF5] py-16 sm:py-20 border-t border-[#EADCCB]">
        <Container className="text-center max-w-3xl space-y-6">
          <h2 className="text-3xl font-bold text-[#492A22] tracking-tight sm:text-4xl">
            Have a Community Collaboration in Mind?
          </h2>
          <p className="text-[#78685D] text-base sm:text-lg leading-relaxed">
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
