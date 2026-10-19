import * as React from "react";
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Home,
  GraduationCap,
  Heart,
  Building,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ContactBranchCardProps } from "./contact-types";

function BranchIcon({ id, className }: { id: string; className?: string }) {
  if (id === "boys-hostel") {
    return <Home className={className} />;
  }
  if (id === "tamil-kannada-school") {
    return <GraduationCap className={className} />;
  }
  if (id === "girls-home") {
    return <Heart className={className} />;
  }
  return <Building className={className} />;
}

export function ContactBranchCard({ branch }: ContactBranchCardProps) {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EADCCB] bg-white transition-all duration-200 hover:border-[#FF8A00]/60 hover:shadow-md">
      {/* Top Subtle Brand Gradient Strip */}
      <div
        aria-hidden="true"
        className="h-1 w-full bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C]"
      />

      <CardContent className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          {/* Header Row: Badge & Facility Icon */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="inline-flex items-center rounded-full border border-[#EADCCB] bg-[#FFF5E6] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#F52232]">
              {branch.badge}
            </span>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EADCCB] bg-[#FFF5E6] text-[#F52232] transition-colors group-hover:bg-[#F52232] group-hover:text-white">
              <BranchIcon id={branch.id} className="h-5 w-5" />
            </div>
          </div>

          {/* Branch Title */}
          <h3 className="text-lg font-bold text-[#492A22] sm:text-xl leading-snug">
            {branch.name}
          </h3>

          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#8C6D62]">
            {branch.category}
          </p>

          {/* Branch-Specific Address */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#F0E6DD] bg-[#FFFCF9] p-3.5 text-xs text-[#78685D] leading-relaxed">
            <MapPin className="h-4 w-4 shrink-0 text-[#F52232] mt-0.5" />
            <p className="font-medium text-[#492A22]">
              {branch.address}
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-6 pt-5 border-t border-[#EADCCB]/70 space-y-2.5">
          {/* Top Button Pair: Call & WhatsApp */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Call Action */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full border-[#EADCCB] bg-white text-[#492A22] hover:bg-[#FFF5E6] hover:text-[#F52232] hover:border-[#FF8A00]/50 text-xs font-bold h-10"
            >
              <a
                href={`tel:${branch.phoneTel}`}
                aria-label={`Call ${branch.name} at ${branch.phoneDisplay}`}
              >
                <Phone className="h-3.5 w-3.5 mr-1.5 text-[#F52232]" />
                <span>Call Branch</span>
              </a>
            </Button>

            {/* WhatsApp Action */}
            <Button
              asChild
              size="sm"
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold h-10 shadow-2xs hover:shadow-xs border-0"
            >
              <a
                href={branch.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Send WhatsApp message regarding ${branch.name}`}
              >
                <MessageCircle className="h-3.5 w-3.5 mr-1.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            </Button>
          </div>

          {/* Directions Button */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full h-9 text-xs font-bold text-[#F52232] hover:text-[#FF8A00] hover:bg-[#FFF5E6]"
          >
            <a
              href={branch.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${branch.name}`}
            >
              <Navigation className="h-3.5 w-3.5 mr-1.5" />
              <span>Get Directions on Google Maps</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
