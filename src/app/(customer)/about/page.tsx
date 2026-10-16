import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Heart,
  Shield,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Samartha Trust, our mission, vision, values, and our commitment to sustainable social development and disability empowerment.",
};

const coreValues = [
  {
    icon: Heart,
    title: "Compassion & Empathy",
    description:
      "We place the dignity, abilities, and well-being of the individuals and families we serve at the core of every project.",
  },
  {
    icon: Shield,
    title: "Uncompromising Integrity",
    description:
      "We adhere to strict standards of financial transparency, governance accountability, and operational ethics.",
  },
  {
    icon: Users,
    title: "Grassroots Inclusivity",
    description:
      "We work collaboratively with local community members and village leaders, ensuring long-term self-reliance.",
  },
  {
    icon: Target,
    title: "Measurable Impact",
    description:
      "We continuously evaluate our programs to ensure educational, health, and welfare resources yield true transformations.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <PageHeader
        badge="Who We Are"
        title="About Samartha"
        highlight="Trust"
        description="A registered non-profit charitable trust dedicated to empowering lives, believing in abilities, and bringing educational and healthcare dignity to underserved communities."
      />

      {/* Genesis & Background - Crisp White */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#EADCCB]">
        <Container>
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F52232]">
                Our Genesis & Journey
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-[#492A22] sm:text-4xl leading-tight">
                Serving with Purpose, Building Sustainable Hope
              </h2>
              <p className="text-base text-[#78685D] leading-relaxed sm:text-lg">
                Samartha Trust was instituted with the heartfelt conviction that
                every individual possesses inherent abilities that deserve
                nurturing and opportunity. Recognizing that lasting community
                change begins at the grassroots, our founders and volunteers set
                out to build a platform that directly connects compassionate
                citizens with actionable social welfare causes.
              </p>
              <p className="text-base text-[#78685D] leading-relaxed sm:text-lg">
                Over the years, our programs have evolved from modest local
                support circles into structured interventions in rural
                education, periodic medical diagnosis camps, and livelihood
                skill-building initiatives.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-6">
              <Card className="border border-[#EADCCB] bg-white shadow-2xs hover:shadow-xs transition-shadow">
                <CardContent className="p-8 space-y-3">
                  <div className="inline-flex rounded-xl bg-gradient-to-r from-[#F52232] to-[#FF8A00] p-2.5 text-white shadow-2xs">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#492A22]">
                    Our Mission
                  </h3>
                  <p className="text-sm text-[#78685D] leading-relaxed">
                    To deliver equitable educational resources, accessible
                    healthcare services, and sustainable livelihood
                    opportunities to economically disadvantaged and
                    differently-abled populations, helping them attain dignity
                    and self-sufficiency.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#EADCCB] bg-white shadow-2xs hover:shadow-xs transition-shadow">
                <CardContent className="p-8 space-y-3">
                  <div className="inline-flex rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FFD21C] p-2.5 text-white shadow-2xs">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#492A22]">
                    Our Vision
                  </h3>
                  <p className="text-sm text-[#78685D] leading-relaxed">
                    A just and empowered society where every child receives
                    quality schooling, every vulnerable individual has timely
                    medical access, and all communities foster mutual
                    resilience, opportunity, and belief in human abilities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values - Crisp White Background */}
      <section className="bg-white py-16 sm:py-24 border-b border-[#EADCCB]">
        <Container>
          <SectionHeading
            badge="Our Guiding Principles"
            title="Values That Guide Every"
            highlight="Action"
            description="Our institutional values shape how we interact with communities, volunteers, donors, and regulatory partners."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="bg-white border border-[#EADCCB] shadow-2xs hover:border-[#FF8A00]/50 hover:shadow-md transition-all"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#492A22]">
                      {value.title}
                    </h3>
                    <p className="text-sm text-[#78685D] leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Governance & Transparency - Alternate Light Warm Section (~15%) */}
      <section className="py-16 sm:py-24 bg-[#FFFCF5]">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-[#EADCCB] bg-white p-8 sm:p-12 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F52232]">
              Governance & Statutory Compliance
            </span>
            <h2 className="text-2xl font-bold text-[#492A22] sm:text-3xl">
              Committed to Complete Operational Accountability
            </h2>
            <p className="text-sm text-[#78685D] leading-relaxed sm:text-base">
              Samartha Trust functions under a registered public charitable
              trust deed. Our activities, annual statements, and project
              expenditures undergo systematic internal review to guarantee that
              contributions directly benefit program beneficiaries.
            </p>
            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#F52232] shrink-0" />
                <span className="text-sm font-medium text-[#492A22]">
                  Registered Public Trust Entity
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#F52232] shrink-0" />
                <span className="text-sm font-medium text-[#492A22]">
                  Transparent Project Tracking
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#F52232] shrink-0" />
                <span className="text-sm font-medium text-[#492A22]">
                  Direct Beneficiary Auditing
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#F52232] shrink-0" />
                <span className="text-sm font-medium text-[#492A22]">
                  Dedicated Volunteer Advisory Committee
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EADCCB] flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/contact" className="gap-2">
                  <span>Connect with Our Team</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/programs">Explore Programs</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
