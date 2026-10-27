"use client";

import {
  ArrowUpRight,
  ShieldCheck,
  FileCheck2,
  HandHeart,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const complianceItems = [
  {
    number: "01",
    title: "12A Registration",
    category: "CHARITABLE STATUS",
    description:
      "Our charitable registration supports the trust's work in accordance with applicable requirements.",
    action: "View Registration",
    href: "#12a-certificate",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "80G Certification",
    category: "DONOR TAX BENEFITS",
    description:
      "Eligible donations may qualify for tax deductions, subject to applicable rules and certificate validity.",
    action: "View Certificate",
    href: "#80g-certificate",
    icon: FileCheck2,
  },
  {
    number: "03",
    title: "CSR-1 Registration",
    category: "CORPORATE PARTNERSHIPS",
    description:
      "Registration relevant to undertaking qualifying corporate social responsibility activities.",
    action: "View Approval",
    href: "#csr-1-approval",
    icon: HandHeart,
  },
];

export function TransparencySection() {
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.15,
  });

  return (
    <section
      ref={ref}
      aria-labelledby="transparency-heading"
      className="relative isolate overflow-hidden bg-gradient-to-br from-[#7100A8] via-[#9200A8] to-[#E90078] py-10 text-white sm:py-12 lg:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-white/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-white/[0.05] blur-3xl"
      />

      <Container>
        <div className="relative grid items-center gap-4 lg:grid-cols-[1fr_0.8fr] lg:gap-10">
          <div className={cn(revealVariant("slide-right"))}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                Trust & Transparency
              </span>
            </div>

            <h2
              id="transparency-heading"
              className="mt-3 max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl"
            >
              Trust is built on{" "}
              <span className="text-white/80">transparency.</span>
            </h2>
          </div>

          <p
            className={cn(
              "motion-blur-in max-w-xl text-sm leading-6 text-white/90 sm:text-base sm:leading-7 lg:justify-self-end",
              isInView && "motion-active"
            )}
            style={{ animationDelay: "180ms" }}
          >
            We believe in responsible governance, clear communication, and
            accountability to everyone who supports our mission.
          </p>
        </div>

        <div className="relative mt-7 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-3">
          {complianceItems.map((item, index) => {
            const Icon = item.icon;
            const delay = 180 + index * 100;

            return (
              <article
                key={item.number}
                className={cn(
                  "help-transparency-card home-card-hover group relative flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-white/30 bg-white/[0.12] p-5 text-white shadow-sm backdrop-blur-sm hover:border-white/50 hover:bg-white/[0.18] hover:shadow-lg sm:p-5",
                  isInView && "help-transparency-card-active"
                )}
                style={{ animationDelay: `${delay}ms` }}
              >
                <div className="relative flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/[0.15] transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25">
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-xs font-semibold tracking-widest text-white/60">
                    {item.number}
                  </span>
                </div>

                <div className="relative mt-5 flex flex-1 flex-col">
                  <p className="text-[9px] font-bold tracking-[0.14em] text-white/75">
                    {item.category}
                  </p>

                  <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-6 text-white/85">
                    {item.description}
                  </p>

                  <Link
                    href={item.href}
                    className="group/link mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-white/90"
                  >
                    {item.action}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
