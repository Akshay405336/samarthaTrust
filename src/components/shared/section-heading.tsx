import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  highlight,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col mb-12 sm:mb-16",
        alignClasses[align],
        className
      )}
    >
      {badge && (
        <span className="mb-3.5 inline-flex items-center rounded-full bg-[#FFF5E6] border border-[#EADCCB] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#F52232] shadow-2xs">
          {badge}
        </span>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-[#492A22] sm:text-3xl lg:text-4xl leading-tight">
        {title}{" "}
        {highlight && <span className="text-brand-gradient">{highlight}</span>}
      </h2>
      {description && (
        <p className="mt-4 text-base text-[#78685D] sm:text-lg leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
