import * as React from "react";
import Link from "next/link";
import { MessageSquare, ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";

export function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white border-b border-[#EADDED]">
      {/* Subtle background ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-[#E90078]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 -z-10 h-64 w-64 rounded-full bg-[#7100A8]/[0.05] blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-3xl py-12 text-center sm:py-16 lg:py-20">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-[#FCE7F3]/60 px-3.5 py-1.5 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#9200A8] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9200A8]">
              Get In Touch
            </span>
            <Sparkles className="h-3 w-3 text-[#E90078]" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight text-[#35123F] sm:text-4xl lg:text-5xl leading-tight">
            Contact{" "}
            <span className="bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
              Samartha Trust
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#75647B] sm:text-base sm:leading-7">
            Whether you have a general inquiry, wish to volunteer in our community
            welfare programs, or represent an organization seeking an impactful
            CSR partnership, we are eager to hear from you.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact-form"
              className="group inline-flex min-h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Send Us a Message</span>
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>

            <Link
              href="/our-works"
              className="inline-flex min-h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#EADDED] bg-white px-6 py-2.5 text-sm font-bold text-[#35123F] transition-colors hover:border-[#9200A8]/40 hover:bg-[#FAF5FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
            >
              <span>Explore Our Works</span>
              <ArrowRight className="h-4 w-4 text-[#75647B]" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
