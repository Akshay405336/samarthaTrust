import * as React from "react";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ContactInfoCardProps } from "./contact-types";

export function ContactInfoCard({
  title,
  value,
  secondaryValue,
  href,
  icon: Icon,
  actionText,
  external,
}: ContactInfoCardProps) {
  const content = (
    <Card className="group relative overflow-hidden border border-[#EADCCB] bg-white transition-all duration-200 hover:border-[#FF8A00]/60 hover:shadow-sm">
      <CardContent className="p-5 sm:p-6 flex items-start gap-4">
        {/* Brand Icon Badge */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EADCCB] bg-[#FFF5E6] text-[#F52232] transition-colors group-hover:bg-[#F52232] group-hover:text-white">
          <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
        </div>

        {/* Content Details */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#78685D]">
            {title}
          </p>

          <p className="mt-1 text-sm sm:text-base font-bold text-[#492A22] leading-snug break-words">
            {value}
          </p>

          {secondaryValue && (
            <p className="mt-1 text-xs text-[#78685D] leading-relaxed">
              {secondaryValue}
            </p>
          )}

          {actionText && href && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#F52232] group-hover:text-[#FF8A00] transition-colors">
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
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F52232] rounded-xl"
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F52232] rounded-xl"
      >
        {content}
      </Link>
    );
  }

  return content;
}
