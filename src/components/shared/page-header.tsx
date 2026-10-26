import * as React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  badge,
  title,
  highlight,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white border-b border-[#EADDED] py-12 sm:py-16",
        className
      )}
    >
      {/* Subtle decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-[#E90078]/10 via-[#9200A8]/5 to-transparent blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center">
        {badge && (
          <span className="mb-4 inline-flex items-center rounded-full bg-[#FCE7F3]/60 border border-[#EADDED] px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-[#9200A8] shadow-2xs">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-[#35123F] leading-tight">
          {title}{" "}
          {highlight && (
            <span className="text-brand-gradient">{highlight}</span>
          )}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[#75647B] leading-relaxed">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
