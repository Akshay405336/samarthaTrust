import * as React from "react";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ContactInfoCardProps } from "./contact-types";
import { cn } from "@/lib/utils";

const ACCENT_STYLES = {
  teal: {
    shell: "bg-gradient-to-br from-[#F0FDFA]/90 via-white to-[#CCFBF1]/40",
    border: "border-[#99F6E4]/50 hover:border-[#0D9488]/45",
    icon: "bg-gradient-to-br from-[#CCFBF1] to-[#99F6E4]/50 text-[#0F766E] group-hover:from-[#0D9488] group-hover:to-[#14B8A6] group-hover:text-white",
  },
  violet: {
    shell: "bg-gradient-to-br from-[#FAF5FF]/95 via-white to-[#EDE9FE]/45",
    border: "border-[#C4B5FD]/45 hover:border-[#9200A8]/40",
    icon: "bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE]/60 text-[#6D28D9] group-hover:from-[#9200A8] group-hover:to-[#7100A8] group-hover:text-white",
  },
  rose: {
    shell: "bg-gradient-to-br from-[#FDF2F8]/95 via-white to-[#FCE7F3]/50",
    border: "border-[#FBCFE8]/55 hover:border-[#E90078]/40",
    icon: "bg-gradient-to-br from-[#FCE7F3] to-[#FBCFE8]/60 text-[#BE185D] group-hover:from-[#E90078] group-hover:to-[#9200A8] group-hover:text-white",
  },
} as const;

export function ContactInfoCard({
  title,
  value,
  secondaryValue,
  href,
  icon: Icon,
  actionText,
  external,
  accent = "violet",
}: ContactInfoCardProps) {
  const styles = ACCENT_STYLES[accent];

  const content = (
    <Card
      className={cn(
        "group relative overflow-hidden border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        styles.shell,
        styles.border
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#9200A8]/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />
      <CardContent className="flex items-start gap-4 p-5 sm:p-6">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/70 shadow-xs transition-all duration-300",
            styles.icon
          )}
        >
          <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#75647B]">
            {title}
          </p>

          <p className="mt-1 break-words text-sm font-bold leading-snug text-[#35123F] sm:text-base">
            {value}
          </p>

          {secondaryValue && (
            <p className="mt-1 text-xs leading-relaxed text-[#75647B]">
              {secondaryValue}
            </p>
          )}

          {actionText && href && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#9200A8] transition-colors group-hover:text-[#E90078]">
              <span>{actionText}</span>
              {external ? (
                <ExternalLink className="h-3 w-3" />
              ) : (
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
      >
        {content}
      </Link>
    );
  }

  return content;
}
