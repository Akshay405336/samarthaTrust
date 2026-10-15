import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail, ArrowRight, Info } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Trustees",
  description:
    "Governance, leadership, and board of trustees of Samartha Trust.",
};

export default function OurTrusteesPage() {
  return (
    <div>
      <PageHeader
        badge="Leadership & Governance"
        title="Our"
        highlight="Trustees"
        description="The dedicated board and governing trustees guiding the vision, values, and community missions of Samartha Trust."
      />

      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Governance commitment notice */}
            <div className="rounded-xl border border-[#EADCCB] bg-[#FFFCF5] p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#492A22]">
                    Board of Trustees & Stewardship
                  </h2>
                  <p className="text-xs text-[#78685D]">
                    Registered Public Charitable Trust Governance
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#78685D] leading-relaxed">
                Samartha Trust operates under a registered public charitable
                trust deed. Our board of trustees and advisory council oversee
                all social welfare initiatives, ensuring that every program
                adheres to strict statutory compliance, transparent governance,
                and direct beneficiary impact.
              </p>
            </div>

            {/* Placeholder card */}
            <Card className="border border-[#EADCCB] bg-white shadow-xs">
              <CardContent className="p-8 space-y-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5E6] text-[#FF8A00] border border-[#EADCCB]">
                  <Info className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#492A22]">
                    Trustee Profiles & Committee Directory
                  </h3>
                  <p className="text-sm text-[#78685D] max-w-lg mx-auto leading-relaxed">
                    Detailed trustee profiles, statutory advisory records, and
                    annual governance committee updates are maintained by the
                    Trust administration and will be published on this portal.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <Link href="/contact" className="gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Contact Trust Office</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/about" className="gap-2">
                      <span>About Samartha Trust</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
