"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const cardVariants = cva("rounded-lg border transition-all duration-300", {
  variants: {
    variant: {
      default: [
        "shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)]",
        "border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30",
      ],
      inset: [
        "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]",
        "border-neutral-200/60 bg-gradient-to-br from-neutral-50/80 to-neutral-100/60",
      ],
      elevated: [
        "shadow-[8px_8px_20px_rgba(0,0,0,0.15),-8px_-8px_20px_rgba(255,255,255,0.95)]",
        "border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30",
        "hover:shadow-[10px_10px_24px_rgba(0,0,0,0.2),-10px_-10px_24px_rgba(255,255,255,1)]",
      ],
      subtle: [
        "shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.8)]",
        "border-neutral-200/60 bg-gradient-to-br from-neutral-50 to-neutral-100/60",
        "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)]",
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
      primary: "bg-gradient-to-br from-primary-100/10 via-transparent to-primary-200/20",
      accent: "bg-gradient-to-br from-accent-100/10 via-transparent to-accent-200/20",
      neutral: "bg-gradient-to-br from-neutral-100/10 via-transparent to-neutral-200/20",
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
