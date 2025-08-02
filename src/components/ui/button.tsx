"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus:outline-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white font-semibold",
          "shadow-[4px_4px_12px_rgba(0,0,0,0.15),-2px_-2px_8px_rgba(255,255,255,0.1)]",
          "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.2),-3px_-3px_10px_rgba(255,255,255,0.15)]",
          "hover:scale-[1.02] active:scale-[0.98]",
          "disabled:hover:scale-100",
        ],
        primary: [
          "bg-primary-600 hover:bg-primary-700 text-white",
          "shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.8)]",
          "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12),-6px_-6px_16px_rgba(255,255,255,0.9)]",
          "hover:scale-[1.02] active:scale-[0.98]",
        ],
        accent: [
          "bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white",
          "shadow-[4px_4px_12px_rgba(0,0,0,0.15),-2px_-2px_8px_rgba(255,255,255,0.1)]",
          "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.2),-3px_-3px_10px_rgba(255,255,255,0.15)]",
          "active:shadow-[inset_4px_4px_12px_rgba(0,0,0,0.2)]",
          "hover:scale-[1.02] active:scale-[0.98]",
        ],
        outline: [
          "border border-primary-300 text-primary-700 hover:bg-primary-50",
          "shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.8)]",
          "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12),-6px_-6px_16px_rgba(255,255,255,0.9)]",
          "hover:scale-[1.01] active:scale-[0.99]",
        ],
        ghost: [
          "text-primary-700 hover:bg-primary-50/60",
          "hover:shadow-[2px_2px_6px_rgba(0,0,0,0.05),-2px_-2px_6px_rgba(255,255,255,0.8)]",
          "hover:scale-[1.01] active:scale-[0.99]",
        ],
        destructive: [
          "bg-red-600 hover:bg-red-700 text-white",
          "shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.8)]",
          "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12),-6px_-6px_16px_rgba(255,255,255,0.9)]",
          "hover:scale-[1.02] active:scale-[0.98]",
        ],
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-4",
        lg: "h-12 px-6 text-lg",
        icon: "h-11 w-11 px-0",
      },
      glow: {
        none: "",
        primary: "relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-600 before:to-accent-600 before:rounded-lg before:blur-lg before:opacity-20 before:-z-10",
        accent: "relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-accent-600 before:to-accent-700 before:rounded-lg before:blur-lg before:opacity-20 before:-z-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glow, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glow }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };