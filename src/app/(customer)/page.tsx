import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  HeartPulse,
  Users,
  Sprout,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/customer/hero-section";
import { ImpactSection } from "@/components/customer/ImpactSection";
import { HowYouCanHelpSection } from "@/components/customer/HowYouCanHelpSection";
import { LifeTransformedSection } from "@/components/customer/life-transformed-section";
import { TransparencySection } from "@/components/customer/transparency-section";
import { HomeBlogSection } from "@/components/customer/home-blog-section";

const focusAreas = [
  {
    icon: GraduationCap,
    title: "Education & Literacy",
    description:
      "Supporting underprivileged children with learning materials, scholarship assistance, and foundational digital education programs.",
    href: "/programs#education",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Access",
    description:
      "Organizing preventive medical checkups, eye-care screenings, and community health camps for underserved rural populations.",
    href: "/programs#health",
  },
  {
    icon: Users,
    title: "Skill Development",
    description:
      "Conducting vocational training and livelihood workshops designed to empower youth and women towards financial independence.",
    href: "/programs#skills",
  },
  {
    icon: Sprout,
    title: "Community Welfare",
    description:
      "Delivering relief resources, hygiene initiatives, and sustainable village welfare projects in times of need.",
    href: "/programs#community",
  },
];

const impactHighlights = [
  {
    number: "1,500+",
    label: "Children Supported",
    description: "Through educational assistance & mentorship initiatives",
  },
  {
    number: "45+",
    label: "Health Camps Conducted",
    description: "Delivering free primary consultations and checkups",
  },
  {
    number: "30+",
    label: "Communities Reached",
    description: "Across urban settlements and rural clusters",
  },
  {
    number: "100%",
    label: "Dedicated Commitment",
    description: "Ensuring transparent, accountable nonprofit operations",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Recreated Hero Section matching supplied reference */}
      <HeroSection />

      {/* Recreated Impact Section matching supplied reference */}
      <ImpactSection />

      {/* Recreated How You Can Help Section matching supplied reference */}
      <HowYouCanHelpSection />

      {/* Life Transformed Section */}
      <LifeTransformedSection />

      {/* Transparency & Governance Section */}
      <TransparencySection />

      {/* Dynamic Blog / Updates Section */}
      <React.Suspense fallback={<div className="min-h-48 bg-[#FFFCF5]" />}>
        <HomeBlogSection />
      </React.Suspense>

      {/* Focus Areas Section - Crisp White Background */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#EADCCB]">
        <Container>
          <SectionHeading
            badge="What We Do"
            title="Our Core Focus"
            highlight="Areas"
            description="We channel compassionate resources and dedicated volunteers into four foundational pillars of social impact."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Card
                  key={area.title}
                  className="group relative border border-[#EADCCB] bg-white transition-all hover:border-[#FF8A00]/60 hover:shadow-md"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB]/60 group-hover:scale-105 group-hover:bg-[#F52232] group-hover:text-white transition-all">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#492A22]">
                      {area.title}
                    </h3>
                    <p className="text-sm text-[#78685D] leading-relaxed">
                      {area.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={area.href}
                        className="inline-flex items-center text-xs font-semibold text-[#F52232] hover:text-[#FF8A00] gap-1 transition-colors"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Impact Indicators Section - Light Cream Alternate Section (~15%) */}
      <section className="py-16 bg-[#FFFCF5] border-b border-[#EADCCB]">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {impactHighlights.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[#EADCCB] bg-white p-6 space-y-2 shadow-2xs"
              >
                <div className="text-3xl font-extrabold text-[#F52232] sm:text-4xl">
                  {stat.number}
                </div>
                <div className="text-base font-bold text-[#492A22]">
                  {stat.label}
                </div>
                <p className="text-xs text-[#78685D] leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust & Transparency Mission Section - Crisp White Background */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#EADCCB]">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Badge variant="warm">Grassroots Impact</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-[#492A22] sm:text-4xl leading-tight">
                Built on Trust, Compassion, and Direct Social Service
              </h2>
              <p className="text-[#78685D] leading-relaxed">
                Samartha Trust was founded with the singular objective of
                bridging the gap between marginalized communities and
                sustainable developmental resources. We believe that every
                individual has unique abilities and deserves dignity, access to
                quality learning, and basic preventive healthcare.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#FFF5E6] flex items-center justify-center shrink-0 mt-0.5 border border-[#EADCCB]">
                    <ShieldCheck className="h-4 w-4 text-[#F52232]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#492A22]">
                      Complete Governance & Transparency
                    </h4>
                    <p className="text-xs text-[#78685D] mt-0.5">
                      Every initiative is tracked with meticulous accountability
                      and volunteer engagement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#FFF5E6] flex items-center justify-center shrink-0 mt-0.5 border border-[#EADCCB]">
                    <Award className="h-4 w-4 text-[#FF8A00]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#492A22]">
                      Direct Community Ownership
                    </h4>
                    <p className="text-xs text-[#78685D] mt-0.5">
                      We collaborate with local leaders to ensure
                      self-sustaining long-term change.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild variant="outline">
                  <Link href="/about">Read Our Story & Governance</Link>
                </Button>
              </div>
            </div>

            <div className="relative rounded-2xl border border-[#EADCCB] bg-[#FFFCF5] p-8 sm:p-10 shadow-2xs">
              <div className="space-y-6">
                <div className="border-l-4 border-[#F52232] pl-4">
                  <h3 className="text-lg font-bold text-[#492A22]">
                    Our Core Mission
                  </h3>
                  <p className="mt-2 text-sm text-[#78685D] leading-relaxed">
                    To catalyze holistic human development by facilitating
                    accessible learning, health awareness, and socioeconomic
                    empowerment for underprivileged and differently-abled
                    individuals.
                  </p>
                </div>

                <div className="border-l-4 border-[#FF8A00] pl-4">
                  <h3 className="text-lg font-bold text-[#492A22]">
                    Our Shared Vision
                  </h3>
                  <p className="mt-2 text-sm text-[#78685D] leading-relaxed">
                    An inclusive society where abilities are celebrated, no
                    child is deprived of education, no family lacks basic health
                    dignity, and every community has the capacity to thrive
                    independently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action Banner in Brand Gradient */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFAA00] text-white">
        <Container className="text-center max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
            Join Us in Making a Real Difference
          </h2>
          <p className="text-base text-white/95 sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you wish to volunteer your time, sponsor an educational kit,
            or partner on a healthcare initiative, your support brings hope and
            empowerment to hundreds of lives.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#492A22] hover:bg-[#FFF5E6] shadow-md border-0"
            >
              <Link href="/contact">Get in Touch with Us</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/programs">View All Initiatives</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
