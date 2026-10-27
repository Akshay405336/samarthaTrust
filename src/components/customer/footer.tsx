import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/shared/container";

export function CustomerFooter() {
  const currentYear = 2026;

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Samartha Trust", href: "/about" },
    { label: "Our Works", href: "/our-works" },
    { label: "Photo Gallery", href: "/gallery" },
    { label: "Our Programs & Initiatives", href: "/programs" },
    { label: "Make a Donation", href: "/donate" },
    { label: "Blog & Impact Stories", href: "/blog" },
    { label: "Contact & Inquiries", href: "/contact" },
  ];

  const focusAreas = [
    { label: "Education & Scholarships", href: "/programs#education" },
    { label: "Healthcare & Medical Camps", href: "/programs#health" },
    { label: "Livelihoods & Skill Training", href: "/programs#skills" },
    { label: "Community & Rural Welfare", href: "/programs#community" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#202326] text-white">
      {/* Subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#9200A8]/[0.08] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-white/[0.025] blur-3xl"
      />

      <div className="relative py-12 sm:py-14 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Brand column */}
            <div className="space-y-5">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 rounded-xl border border-white/10 bg-white p-1 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Samartha Trust Logo"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <span className="text-lg font-bold tracking-tight text-white">
                    Samartha Trust
                  </span>
                  <p className="mt-0.5 text-xs font-medium text-[#E90078]">
                    We Believe In Abilities
                  </p>
                </div>
              </Link>

              <p className="max-w-sm text-sm leading-7 text-[#B7BABE]">
                Dedicated to empowering individuals with abilities and uplifting
                underprivileged communities through accessible education,
                healthcare, and sustainable livelihood support.
              </p>

              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-[#E90078]" />
                <span className="text-xs font-medium text-[#D5D6D8]">
                  Registered Public Charitable Trust
                </span>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                Quick Links
              </h3>

              <div className="mt-3 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]" />

              <ul className="mt-5 space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-[#B7BABE] transition-colors duration-200 hover:text-white"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Focus areas */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                Focus Areas
              </h3>

              <div className="mt-3 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]" />

              <ul className="mt-5 space-y-3">
                {focusAreas.map((area) => (
                  <li key={area.href}>
                    <Link
                      href={area.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-[#B7BABE] transition-colors duration-200 hover:text-white"
                    >
                      <span>{area.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact information */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                Contact Information
              </h3>

              <div className="mt-3 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]" />

              <ul className="mt-5 space-y-4 text-sm text-[#B7BABE]">
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <MapPin className="h-4 w-4 text-[#E90078]" />
                  </div>
                  <span className="pt-1.5 leading-6">
                    Samartha Trust Office, Bengaluru, Karnataka, India
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <Mail className="h-4 w-4 text-[#E90078]" />
                  </div>
                  <a
                    href="mailto:info@samarthatrust.org"
                    className="break-all pt-2 transition-colors hover:text-white"
                  >
                    info@samarthatrust.org
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <Phone className="h-4 w-4 text-[#E90078]" />
                  </div>
                  <a
                    href="tel:+918023456789"
                    className="pt-2 transition-colors hover:text-white"
                  >
                    +91 (0) 80 2345 6789
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-[#191B1E]">
        <Container className="flex flex-col items-center justify-between gap-4 py-5 text-xs text-[#A7AAAE] sm:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center sm:justify-start sm:text-left">
            <span>© {currentYear} Samartha Trust. All rights reserved.</span>
            <span className="hidden text-white/30 sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              Made with care
              <Heart className="h-3 w-3 fill-[#E90078] text-[#E90078]" />
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <span className="text-[#85898E]">
              Inspired by samarthatrust.org
            </span>

            <Link
              href="/admin/login"
              prefetch={false}
              className="inline-flex items-center gap-1.5 font-medium text-[#B7BABE] transition-colors hover:text-[#E90078]"
            >
              Admin Portal
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
