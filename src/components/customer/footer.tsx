import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ExternalLink, Heart } from "lucide-react";
import { Container } from "@/components/shared/container";

export function CustomerFooter() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-[#EADCCB] bg-[#FFFCF5] text-[#492A22]">
      <div className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* About column with logo */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-lg bg-white p-1 shrink-0 border border-[#EADCCB] shadow-2xs">
                  <Image
                    src="/logo.png"
                    alt="Samartha Trust Logo"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-lg font-bold text-[#492A22] tracking-tight">
                    Samartha Trust
                  </span>
                  <p className="text-xs font-semibold text-[#F52232]">
                    We Believe In Abilities
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#78685D] leading-relaxed">
                Dedicated to empowering individuals with abilities and uplifting
                underprivileged communities through accessible education,
                healthcare, and sustainable livelihood support.
              </p>
              <div className="pt-1">
                <span className="inline-block rounded-md bg-[#FFF5E6] px-3 py-1 text-xs font-medium text-[#492A22] border border-[#EADCCB]">
                  Registered Public Charitable Trust
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#492A22]">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#78685D]">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-[#F52232]"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-[#F52232]"
                  >
                    About Samartha Trust
                  </Link>
                </li>
                <li>
                  <Link
                    href="/programs"
                    className="transition-colors hover:text-[#F52232]"
                  >
                    Our Programs & Initiatives
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-[#F52232]"
                  >
                    Blog & Impact Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-[#F52232]"
                  >
                    Contact & Inquiries
                  </Link>
                </li>
              </ul>
            </div>

            {/* Core Programs */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#492A22]">
                Focus Areas
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#78685D]">
                <li>
                  <Link
                    href="/programs#education"
                    className="transition-colors hover:text-[#F52232]"
                  >
                    Education & Scholarships
                  </Link>
                </li>
                <li>
                  <Link
                    href="/programs#health"
                    className="transition-colors hover:text-[#F52232]"
                  >
                    Healthcare & Medical Camps
                  </Link>
                </li>
                <li>
                  <Link
                    href="/programs#skills"
                    className="transition-colors hover:text-[#F52232]"
                  >
                    Livelihoods & Skill Training
                  </Link>
                </li>
                <li>
                  <Link
                    href="/programs#community"
                    className="transition-colors hover:text-[#F52232]"
                  >
                    Community & Rural Welfare
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#492A22]">
                Contact Information
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#78685D]">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#F52232] shrink-0 mt-0.5" />
                  <span>
                    Samartha Trust Office, Bengaluru, Karnataka, India
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#FF8A00] shrink-0" />
                  <span className="hover:text-[#F52232] transition-colors">
                    info@samarthatrust.org
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#FF8A00] shrink-0" />
                  <span>+91 (0) 80 2345 6789</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#EADCCB] bg-white py-5 text-xs text-[#78685D]">
        <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="flex items-center gap-1.5">
            <span>© {currentYear} Samartha Trust. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <span>Made with care</span>
              <Heart className="h-3 w-3 text-[#F52232] fill-[#F52232]" />
            </span>
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[#78685D]">
              Inspired by samarthatrust.org
            </span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-[#78685D] hover:text-[#F52232] transition-colors font-medium"
            >
              <span>Admin Portal</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
