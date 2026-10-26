import * as React from "react";
import Link from "next/link";
import { HeartHandshake, Heart, Building2, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";

export function ContactVolunteerCTA() {
  return (
    <section className="bg-gradient-to-b from-[#FAF5FF] via-white to-[#FAF5FF] py-14 sm:py-20 border-t border-[#EADDED]">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9200A8]">
            Join Hands With Us
          </span>
          <h2 className="text-2xl font-bold text-[#35123F] sm:text-3xl lg:text-4xl mt-1.5">
            Ways You Can Create Real Change
          </h2>
          <p className="mt-3 text-sm text-[#75647B] max-w-2xl mx-auto leading-relaxed">
            Whether through personal time, financial contributions, or corporate
            alliances, every partnership directly enriches the lives of
            specially-abled children and rural families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* 1. Volunteering */}
          <Card className="border border-[#EADDED] bg-white shadow-2xs hover:border-[#9200A8]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <CardContent className="p-6 sm:p-7 flex flex-col h-full justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#FCE7F3]/60 text-[#9200A8] border border-[#EADDED] flex items-center justify-center mb-5">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#35123F]">
                  Become a Volunteer
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#75647B] leading-relaxed">
                  Contribute your skills during weekend camps, education workshops,
                  and special therapy sessions for children.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EADDED]">
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#9200A8] hover:text-[#E90078] transition-colors"
                >
                  <span>Sign Up to Volunteer</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 2. Donations */}
          <Card className="border-2 border-[#9200A8]/30 bg-white shadow-xs hover:border-[#9200A8] hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]"
            />
            <CardContent className="p-6 sm:p-7 flex flex-col h-full justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#FCE7F3] text-[#9200A8] border border-[#9200A8]/20 flex items-center justify-center mb-5">
                  <Heart className="h-6 w-6 fill-[#9200A8]" />
                </div>
                <h3 className="text-lg font-bold text-[#35123F]">
                  Support With a Donation
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#75647B] leading-relaxed">
                  Fund assistive kits, nutrition, and specialized schooling.
                  Eligible for 50% tax deduction under Section 80G.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EADDED]">
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#9200A8] hover:text-[#E90078] transition-colors"
                >
                  <span>Make a Secure Donation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 3. CSR Partnerships */}
          <Card className="border border-[#EADDED] bg-white shadow-2xs hover:border-[#9200A8]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <CardContent className="p-6 sm:p-7 flex flex-col h-full justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#FCE7F3]/60 text-[#9200A8] border border-[#EADDED] flex items-center justify-center mb-5">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#35123F]">
                  CSR & Institutional Ties
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#75647B] leading-relaxed">
                  Co-create audited, high-impact corporate social initiatives with
                  transparent tracking and reporting.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EADDED]">
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#9200A8] hover:text-[#E90078] transition-colors"
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
