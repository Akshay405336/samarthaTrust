import * as React from "react";
import Link from "next/link";
import { HeartHandshake, Heart, Building2, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";

export function ContactVolunteerCTA() {
  return (
    <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F0] to-[#FFFCF5] py-14 sm:py-20 border-t border-[#EADCCB]">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#F52232]">
            Join Hands With Us
          </span>
          <h2 className="text-2xl font-bold text-[#492A22] sm:text-3xl lg:text-4xl mt-1.5">
            Ways You Can Create Real Change
          </h2>
          <p className="mt-3 text-sm text-[#78685D] max-w-2xl mx-auto leading-relaxed">
            Whether through personal time, financial contributions, or corporate
            alliances, every partnership directly enriches the lives of
            specially-abled children and rural families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* 1. Volunteering */}
          <Card className="border border-[#EADCCB] bg-white shadow-2xs hover:border-[#FF8A00]/60 hover:shadow-md transition-all flex flex-col justify-between">
            <CardContent className="p-6 sm:p-7 flex flex-col h-full justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] flex items-center justify-center mb-5">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#492A22]">
                  Become a Volunteer
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#78685D] leading-relaxed">
                  Contribute your skills during weekend camps, education workshops,
                  and special therapy sessions for children.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EADCCB]/60">
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F52232] hover:text-[#FF8A00] transition-colors"
                >
                  <span>Sign Up to Volunteer</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 2. Donations */}
          <Card className="border-2 border-[#F52232]/30 bg-white shadow-xs hover:border-[#F52232] hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C]"
            />
            <CardContent className="p-6 sm:p-7 flex flex-col h-full justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#FFF0E2] text-[#F52232] border border-[#F52232]/20 flex items-center justify-center mb-5">
                  <Heart className="h-6 w-6 fill-[#F52232]" />
                </div>
                <h3 className="text-lg font-bold text-[#492A22]">
                  Support With a Donation
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#78685D] leading-relaxed">
                  Fund assistive kits, nutrition, and specialized schooling.
                  Eligible for 50% tax deduction under Section 80G.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EADCCB]/60">
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F52232] hover:text-[#FF8A00] transition-colors"
                >
                  <span>Make a Secure Donation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 3. CSR Partnerships */}
          <Card className="border border-[#EADCCB] bg-white shadow-2xs hover:border-[#FF8A00]/60 hover:shadow-md transition-all flex flex-col justify-between">
            <CardContent className="p-6 sm:p-7 flex flex-col h-full justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] flex items-center justify-center mb-5">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#492A22]">
                  CSR & Institutional Ties
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#78685D] leading-relaxed">
                  Co-create audited, high-impact corporate social initiatives with
                  transparent tracking and reporting.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EADCCB]/60">
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F52232] hover:text-[#FF8A00] transition-colors"
                >
                  <span>Propose Collaboration</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
