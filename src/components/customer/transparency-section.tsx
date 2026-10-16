
import * as React from "react";
import {
  ShieldCheck,
  FileCheck2,
  HandHeart,
  ArrowUpRight,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import { Container } from "@/components/shared/container";

const complianceItems = [
  {
    number: "01",
    title: "12A Registration",
    category: "CHARITABLE STATUS",
    description:
      "Official recognition of our charitable purpose and organizational status.",
    action: "View Registration",
    href: "#12a-certificate",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "80G Certification",
    category: "DONOR TAX BENEFITS",
    description:
      "Eligible donations may qualify for tax deductions under applicable Section 80G rules.",
    action: "View Certificate",
    href: "#80g-certificate",
    icon: FileCheck2,
  },
  {
    number: "03",
    title: "CSR-1 Registration",
    category: "CORPORATE PARTNERSHIPS",
    description:
      "Registration supporting eligibility to undertake qualifying CSR activities.",
    action: "View Approval",
    href: "#csr-1-approval",
    icon: HandHeart,
  },
];

export function TransparencySection() {
  return (
    <section
      aria-labelledby="transparency-heading"
      className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-20"
    >
      <Container>
        {/* Intro */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-[#F4510B]" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#78685D]">
                Our Commitment
              </span>
            </div>

            <h2
              id="transparency-heading"
              className="max-w-lg text-[clamp(2.3rem,4vw,3.8rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-[#492A22]"
            >
              Trust is built
              <br />
              through <span className="text-[#F4510B]">transparency.</span>
            </h2>

            <p className="mt-5 max-w-md text-[15px] leading-7 text-[#78685D] sm:text-base">
              Every act of support deserves accountability. We value clear
              governance, responsible operations, and transparency in our work.
            </p>

            <div className="mt-7 flex items-center gap-3 border-t border-[#EEE5DC] pt-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFF8F0]">
                <BadgeCheck
                  className="h-6 w-6 text-[#24834B]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#492A22]">
                  Accountability comes first
                </p>
                <p className="mt-1 text-xs leading-5 text-[#78685D]">
                  A commitment to responsible charitable service.
                </p>
              </div>
            </div>
          </div>

          {/* Registration document list */}
          <div className="overflow-hidden rounded-2xl border border-[#EDE5DB] bg-[#FFFCF8]">
            <div className="flex items-center justify-between border-b border-[#EDE5DB] px-5 py-4 sm:px-7">
              <div>
                <p className="text-sm font-semibold text-[#492A22]">
                  Registrations & Approvals
                </p>
                <p className="mt-1 text-xs text-[#78685D]">
                  Organizational compliance details
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#24834B]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            <div className="divide-y divide-[#EDE5DB] px-5 sm:px-7">
              {complianceItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.number}
                    className="group py-5 sm:py-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#EDE5DB] bg-white text-[#F4510B] transition-colors duration-200 group-hover:border-[#F4510B]/30 group-hover:bg-[#FFF2E7]">
                        <Icon
                          className="h-6 w-6"
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-[#A18B78]">
                          {item.category}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold tracking-tight text-[#492A22] sm:text-xl">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#78685D]">
                          {item.description}
                        </p>

                        <a
                          href={item.href}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#24834B] transition-colors hover:text-[#176738]"
                        >
                          {item.action}
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </a>
                      </div>

                      <span className="hidden pt-1 text-xs font-medium text-[#C8B9A9] sm:block">
                        {item.number}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="flex items-start gap-3 border-t border-[#EDE5DB] bg-white px-5 py-4 sm:px-7">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-[#24834B]"
                aria-hidden="true"
              />
              <p className="text-xs leading-5 text-[#78685D]">
                Please refer to the relevant official documents for the exact
                scope and validity of each registration.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
