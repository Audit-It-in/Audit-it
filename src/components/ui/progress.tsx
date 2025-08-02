"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const progressVariants = cva(["relative w-full overflow-hidden rounded-full transition-all duration-300"], {
  variants: {
    variant: {
      default: [
        "bg-gradient-to-r from-neutral-100 to-neutral-200",
        "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
      ],
      subtle: [
        "bg-gradient-to-r from-neutral-50 to-neutral-100",
        "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]",
      ],
      deep: [
        "bg-gradient-to-r from-neutral-200 to-neutral-300",
        "shadow-[inset_3px_3px_8px_rgba(0,0,0,0.2),inset_-3px_-3px_8px_rgba(255,255,255,0.95)]",
      ],
    },
    size: {
      sm: "h-2",
      default: "h-3",
      lg: "h-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const progressFillVariants = cva(["h-full rounded-full transition-all duration-500"], {
  variants: {
    fillVariant: {
      primary: [
        "bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500",
        "shadow-[2px_2px_6px_rgba(0,0,0,0.2)]",
      ],
      accent: ["bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700", "shadow-[2px_2px_6px_rgba(0,0,0,0.2)]"],
      success: ["bg-gradient-to-r from-green-500 via-green-600 to-emerald-500", "shadow-[2px_2px_6px_rgba(0,0,0,0.2)]"],
      warning: [
        "bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600",
        "shadow-[2px_2px_6px_rgba(0,0,0,0.2)]",
      ],
      danger: ["bg-gradient-to-r from-red-500 via-red-600 to-red-700", "shadow-[2px_2px_6px_rgba(0,0,0,0.2)]"],
    },
  },
  defaultVariants: {
    fillVariant: "primary",
  },
});

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressFillVariants> {
  /**
   * The progress value between 0 and 100
   */
  value?: number;
  /**
   * Whether to show a subtle animation
   */
  animated?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant, size, fillVariant, value = 0, animated, ...props }, ref) => {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);

    return (
      <div ref={ref} className={cn(progressVariants({ variant, size }), className)} {...props}>
        <div
          className={cn(
            progressFillVariants({ fillVariant }),
            animated && "animate-pulse",
            // Add a slight glow effect when progress is substantial
            clampedValue > 50 && "shadow-[2px_2px_6px_rgba(0,0,0,0.2),0_0_8px_rgba(var(--primary-500),0.3)]"
          )}
          style={{
            width: `${clampedValue}%`,
            transition: "width 500ms ease-in-out, box-shadow 300ms ease-in-out",
          }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress, progressVariants, progressFillVariants };
