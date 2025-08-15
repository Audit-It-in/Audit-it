"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const cardVariants = cva("border transition-all neumorphic-optimized", {
  variants: {
    variant: {
      default: [
        "shadow-[6px_6px_16px_rgba(0,0,0,0.08),-6px_-6px_16px_rgba(255,255,255,0.9)]",
        "border-primary-100 bg-white rounded-lg duration-300",
      ],
      inset: [
        "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]",
        "border-neutral-200/60 bg-neutral-50 rounded-lg duration-300",
      ],
      elevated: [
        "shadow-[8px_8px_20px_rgba(0,0,0,0.12),-8px_-8px_20px_rgba(255,255,255,0.95)]",
        "border-primary-100 bg-white rounded-lg duration-300",
        "hover:shadow-[10px_10px_24px_rgba(0,0,0,0.16),-10px_-10px_24px_rgba(255,255,255,1)]",
      ],
      subtle: [
        "shadow-[4px_4px_12px_rgba(0,0,0,0.06),-4px_-4px_12px_rgba(255,255,255,0.8)]",
        "border-neutral-200/60 bg-neutral-50 rounded-lg duration-300",
        "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.08),-6px_-6px_16px_rgba(255,255,255,0.9)]",
      ],
      // Enhanced neumorphic variants based on ProfileHeader and Professional Audit Trail
      enhanced: [
        "relative overflow-hidden duration-500",
        "shadow-neumorphic-xl hover:shadow-neumorphic-primary-xl",
        "border-2 border-primary-100/60 bg-gradient-to-br from-neutral-50 via-white to-primary-50/40",
        "hover:bg-gradient-to-br hover:from-primary-50/30 hover:via-white hover:to-accent-50/20",
        "hover:border-primary-200/80 rounded-2xl",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-primary-100/20 before:opacity-50",
      ],
      "enhanced-accent": [
        "relative overflow-hidden duration-500",
        "shadow-neumorphic-xl hover:shadow-neumorphic-accent-xl",
        "border-2 border-accent-100/60 bg-gradient-to-br from-neutral-50 via-white to-accent-50/40",
        "hover:bg-gradient-to-br hover:from-accent-50/30 hover:via-white hover:to-primary-50/20",
        "hover:border-accent-200/80 rounded-2xl",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-accent-100/20 before:opacity-50",
      ],
      "enhanced-neutral": [
        "relative overflow-hidden duration-500",
        "shadow-neumorphic-xl hover:shadow-neumorphic-lg",
        "border-2 border-neutral-200/60 bg-gradient-to-br from-neutral-50 via-white to-neutral-100/40",
        "hover:bg-gradient-to-br hover:from-neutral-100/30 hover:via-white hover:to-neutral-200/20",
        "hover:border-neutral-300/80 rounded-2xl",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-neutral-100/20 before:opacity-50",
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
    const isEnhanced = variant?.includes("enhanced");

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size }),
          overflow && "overflow-hidden",
          !isEnhanced && "relative", // Enhanced variants already have relative positioning
          className
        )}
        {...props}
      >
        {/* Gradient overlay - only for non-enhanced variants */}
        {!isEnhanced && <div className={cardOverlayVariants({ overlay })} />}

        {/* Content with relative positioning */}
        <div className={cn(isEnhanced ? "relative z-10" : "relative")}>{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card, cardVariants };
