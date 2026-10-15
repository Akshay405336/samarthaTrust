import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F52232] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFAA00] text-white font-semibold shadow-sm hover:opacity-95 hover:shadow-md active:scale-[0.99]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.99]",
        outline:
          "border border-[#EADCCB] bg-white text-[#492A22] shadow-xs hover:bg-[#FFF5E6] hover:text-[#F52232] hover:border-[#FF8A00]/60 active:scale-[0.99]",
        secondary:
          "border border-[#EADCCB] bg-[#FFF5E6] text-[#492A22] shadow-xs hover:bg-[#F4E6D2] hover:border-[#DFCBB4] active:scale-[0.99]",
        ghost: "text-[#492A22] hover:bg-[#FFF5E6] hover:text-[#F52232]",
        link: "text-[#F52232] underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-7 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
