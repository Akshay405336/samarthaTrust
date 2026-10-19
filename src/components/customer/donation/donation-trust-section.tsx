import * as React from "react";
import {
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import { TRUST_PILLARS } from "./donation-constants";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
};

export function DonationTrustSection() {
  return (
    <section className="py-12 sm:py-16 bg-[#FFFDF9] border-t border-[#EFE8D8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F52232]">
            Our Commitment to Donors
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#492A22] mt-2">
            Giving with Confidence & Trust
          </h2>
          <p className="text-xs sm:text-sm text-[#78685D] mt-2 leading-relaxed">
            At Samartha Trust, we treat every donor contribution with the utmost
            respect, integrity, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.iconName] || ShieldCheck;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-6 border border-[#EFE8D8] shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFF0E2] flex items-center justify-center text-[#F52232] shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#492A22]">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#78685D] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
