import * as React from "react";
import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, HeartHandshake } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/customer/contact-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact & Inquiries",
  description:
    "Get in touch with Samartha Trust for volunteering, CSR partnerships, program inquiries, and community welfare initiatives.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <PageHeader
        badge="Get In Touch"
        title="Contact Samartha"
        highlight="Trust"
        description="Whether you have an inquiry, wish to volunteer, or want to explore an institutional CSR collaboration, we are eager to hear from you."
      />

      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#492A22] sm:text-3xl">
                  Send Us a Direct Message
                </h2>
                <p className="mt-1.5 text-sm text-[#78685D] leading-relaxed">
                  Fill in your details below and our coordinator will respond
                  within 1-2 business days.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EADCCB] bg-white p-6 sm:p-8 shadow-xs">
                <ContactForm />
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#492A22] sm:text-3xl">
                  Trust Headquarters
                </h2>
                <p className="mt-1.5 text-sm text-[#78685D] leading-relaxed">
                  Our administrative office coordinates field programs across
                  rural and semi-urban clusters.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="border border-[#EADCCB] bg-white shadow-2xs">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#492A22]">
                        Registered Office
                      </h4>
                      <p className="mt-1 text-sm text-[#78685D] leading-relaxed">
                        Samartha Trust Office, <br />
                        Bengaluru, Karnataka, India
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#EADCCB] bg-white shadow-2xs">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#492A22]">
                        Electronic Mail
                      </h4>
                      <p className="mt-1 text-sm text-[#78685D] leading-relaxed">
                        General Inquiries: info@samarthatrust.org <br />
                        Volunteering: volunteers@samarthatrust.org
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#EADCCB] bg-white shadow-2xs">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#492A22]">
                        Telephone
                      </h4>
                      <p className="mt-1 text-sm text-[#78685D] leading-relaxed">
                        Office: +91 (0) 80 2345 6789 <br />
                        Helpline: +91 98765 43210
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#EADCCB] bg-white shadow-2xs">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB] shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#492A22]">
                        Visiting Hours
                      </h4>
                      <p className="mt-1 text-sm text-[#78685D] leading-relaxed">
                        Monday – Friday: 9:30 AM – 5:30 PM <br />
                        Saturday: 10:00 AM – 1:30 PM
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="rounded-xl border border-dashed border-[#EADCCB] bg-[#FFFCF5] p-6">
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="h-5 w-5 text-[#F52232]" />
                    <span className="font-bold text-sm text-[#492A22]">
                      Volunteering With Us
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#78685D] leading-relaxed">
                    We welcome doctors, educators, students, therapists, and
                    professionals wishing to contribute time during weekend
                    health and education camps. Please mention your interests in
                    your inquiry message.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
