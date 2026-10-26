import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#9200A8] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#9200A8] text-white shadow-xs hover:bg-[#7100A8]",
        secondary:
          "border-[#EADDED] bg-[#FCE7F3]/60 text-[#35123F] hover:bg-[#FCE7F3]",
        outline: "border-[#EADDED] text-[#35123F] bg-white hover:bg-[#FCE7F3]/40",
        warm: "border-[#EADDED] bg-[#FCE7F3]/60 text-[#9200A8] font-semibold",
        gradient:
          "border-transparent bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-xs",
        destructive: "border-red-200 bg-red-50 text-red-700",
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        warning: "border-amber-300 bg-amber-50 text-amber-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
