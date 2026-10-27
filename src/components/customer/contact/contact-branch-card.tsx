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
import { cn } from "@/lib/utils";

const CARD_THEMES = [
  {
    border: "border-[#C4B5FD]/40",
    main: "bg-gradient-to-br from-[#EDE9FE]/90 via-white to-[#FAF5FF]",
    address: "bg-gradient-to-br from-[#EDE9FE]/60 to-[#FAF5FF]",
    bar: "from-[#6366F1] via-[#9200A8] to-[#7100A8]",
    enter: "help-card-rise",
  },
  {
    border: "border-[#FBCFE8]/50",
    main: "bg-gradient-to-br from-[#FDF2F8]/95 via-white to-[#FCE7F3]/40",
    address: "bg-gradient-to-br from-[#FCE7F3]/55 to-[#FDF2F8]/50",
    bar: "from-[#E90078] via-[#9200A8] to-[#EC4899]",
    enter: "help-card-sway",
  },
  {
    border: "border-[#99F6E4]/45",
    main: "bg-gradient-to-br from-[#F0FDFA]/90 via-white to-[#CCFBF1]/35",
    address: "bg-gradient-to-br from-[#CCFBF1]/50 to-[#F0FDFA]",
    bar: "from-[#0D9488] via-[#14B8A6] to-[#6366F1]",
    enter: "help-card-pop",
  },
] as const;

const ENTER_ACTIVE: Record<(typeof CARD_THEMES)[number]["enter"], string> = {
  "help-card-rise": "help-card-rise-active",
  "help-card-sway": "help-card-sway-active",
  "help-card-pop": "help-card-pop-active",
};

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

export function ContactBranchCard({
  branch,
  index = 0,
  animate = false,
}: ContactBranchCardProps & { animate?: boolean }) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];

  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        theme.border,
        theme.main,
        theme.enter,
        animate && ENTER_ACTIVE[theme.enter]
      )}
      style={{ animationDelay: `${index * 110 + 60}ms` }}
    >
      <div
        aria-hidden="true"
        className={cn("h-1 w-full bg-gradient-to-r", theme.bar)}
      />

      <CardContent className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <div className="mb-4 flex items-start justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9200A8] backdrop-blur-sm">
              {branch.badge}
            </span>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EADDED]/80 bg-white/80 text-[#9200A8] transition-colors group-hover:bg-[#9200A8] group-hover:text-white">
              <BranchIcon id={branch.id} className="h-5 w-5" />
            </div>
          </div>

          <h3 className="text-lg font-bold leading-snug text-[#35123F] sm:text-xl">
            {branch.name}
          </h3>

          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#75647B]">
            {branch.category}
          </p>

          <div
            className={cn(
              "mt-4 flex items-start gap-2.5 rounded-xl border border-[#EADDED]/60 p-3.5 text-xs leading-relaxed text-[#75647B]",
              theme.address
            )}
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9200A8]" />
            <p className="font-medium text-[#35123F]">{branch.address}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2.5 border-t border-[#EADDED]/70 pt-5">
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 w-full border-[#EADDED] bg-white/90 text-xs font-bold text-[#35123F] hover:border-[#9200A8]/40 hover:bg-[#FAF5FF] hover:text-[#9200A8]"
            >
              <a
                href={`tel:${branch.phoneTel}`}
                aria-label={`Call ${branch.name} at ${branch.phoneDisplay}`}
              >
                <Phone className="mr-1.5 h-3.5 w-3.5 text-[#9200A8]" />
                <span>Call Branch</span>
              </a>
            </Button>

            <Button
              asChild
              size="sm"
              className="h-10 w-full border-0 bg-[#25D366] text-xs font-bold text-white shadow-2xs hover:bg-[#20BA5A] hover:shadow-xs"
            >
              <a
                href={branch.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Send WhatsApp message regarding ${branch.name}`}
              >
                <MessageCircle className="mr-1.5 h-3.5 w-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            </Button>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 w-full text-xs font-bold text-[#9200A8] hover:bg-white/60 hover:text-[#E90078]"
          >
            <a
              href={branch.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${branch.name}`}
            >
              <Navigation className="mr-1.5 h-3.5 w-3.5" />
              <span>Get Directions on Google Maps</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
