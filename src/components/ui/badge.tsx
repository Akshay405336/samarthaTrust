import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#F52232] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#F52232] text-white shadow-xs hover:bg-[#E01828]",
        secondary:
          "border-[#EADCCB] bg-[#FFF5E6] text-[#492A22] hover:bg-[#F4E6D2]",
        outline: "border-[#EADCCB] text-[#492A22] bg-white hover:bg-[#FFF5E6]",
        warm: "border-[#EADCCB] bg-[#FFF5E6] text-[#F52232] font-semibold",
        gradient:
          "border-transparent bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFAA00] text-white shadow-xs",
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
