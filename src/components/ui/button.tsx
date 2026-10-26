import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white font-semibold shadow-sm hover:opacity-95 hover:shadow-md active:scale-[0.99]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.99]",
        outline:
          "border border-[#EADDED] bg-white text-[#35123F] shadow-xs hover:bg-[#FCE7F3]/40 hover:text-[#9200A8] hover:border-[#9200A8]/50 active:scale-[0.99]",
        secondary:
          "border border-[#EADDED] bg-[#FCE7F3]/50 text-[#35123F] shadow-xs hover:bg-[#FCE7F3] hover:border-[#D9BDD6] active:scale-[0.99]",
        ghost: "text-[#35123F] hover:bg-[#FCE7F3]/50 hover:text-[#9200A8]",
        link: "text-[#9200A8] underline-offset-4 hover:underline font-semibold",
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
