"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const cardVariants = cva("rounded-lg border transition-all duration-300", {
  variants: {
    variant: {
      default: [
        "shadow-[6px_6px_16px_rgba(0,0,0,0.08),-6px_-6px_16px_rgba(255,255,255,0.9)]",
        "border-primary-100 bg-white",
      ],
      inset: [
        "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]",
        "border-neutral-200/60 bg-neutral-50",
      ],
      elevated: [
        "shadow-[8px_8px_20px_rgba(0,0,0,0.12),-8px_-8px_20px_rgba(255,255,255,0.95)]",
        "border-primary-100 bg-white",
        "hover:shadow-[10px_10px_24px_rgba(0,0,0,0.16),-10px_-10px_24px_rgba(255,255,255,1)]",
      ],
      subtle: [
        "shadow-[4px_4px_12px_rgba(0,0,0,0.06),-4px_-4px_12px_rgba(255,255,255,0.8)]",
        "border-neutral-200/60 bg-neutral-50",
        "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.08),-6px_-6px_16px_rgba(255,255,255,0.9)]",
      ],
    },
    size: {
      default: "p-6",
      sm: "p-4",
      lg: "p-8",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const cardOverlayVariants = cva("absolute inset-0 rounded-lg opacity-60 pointer-events-none", {
  variants: {
    overlay: {
      none: "hidden",
      primary: "bg-primary-100/10",
      accent: "bg-accent-100/10",
      neutral: "bg-neutral-100/10",
    },
  },
  defaultVariants: {
    overlay: "none",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants>,
    VariantProps<typeof cardOverlayVariants> {
  /**
   * Whether the card should have overflow hidden
   */
  overflow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, overlay, overflow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size }), overflow && "overflow-hidden", "relative", className)}
        {...props}
      >
        {/* Gradient overlay */}
        <div className={cardOverlayVariants({ overlay })} />

        {/* Content with relative positioning */}
        <div className='relative z-10'>{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card, cardVariants };
