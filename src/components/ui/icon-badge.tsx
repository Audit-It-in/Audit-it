"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const iconBadgeVariants = cva(
  [
    "relative flex items-center justify-center rounded-xl transition-all duration-500",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-br from-primary-600 to-primary-700 text-white",
          "shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]",
        ],
        accent: [
          "bg-gradient-to-br from-accent-600 to-accent-700 text-white",
          "shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]",
        ],
        success: [
          "bg-gradient-to-br from-accent-500 to-accent-600 text-white",
          "shadow-[3px_3px_8px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.9)]",
        ],
        neutral: [
          "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-500",
          "shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.8)]",
        ],
        inset: [
          "bg-gradient-to-br from-primary-600 to-primary-700 text-white",
          "shadow-[inset_3px_3px_8px_rgba(0,0,0,0.2),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]",
        ],
      },
      size: {
        sm: "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
        default: "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
        lg: "h-12 w-12 [&_svg]:h-6 [&_svg]:w-6",
        xl: "h-16 w-16 [&_svg]:h-8 [&_svg]:w-8",
      },
      glow: {
        none: "",
        primary:
          "before:absolute before:inset-0 before:rounded-xl before:blur-lg before:opacity-30 before:bg-primary-600 before:-z-10",
        accent:
          "before:absolute before:inset-0 before:rounded-xl before:blur-lg before:opacity-30 before:bg-accent-500 before:-z-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  }
);

export interface IconBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof iconBadgeVariants> {
  /**
   * The icon component to render
   */
  icon?: React.ComponentType<any>;
  /**
   * Whether to show a glow effect
   */
  showGlow?: boolean;
}

const IconBadge = React.forwardRef<HTMLDivElement, IconBadgeProps>(
  ({ className, variant, size, glow, icon: Icon, showGlow, children, ...props }, ref) => {
    const effectiveGlow = showGlow ? (variant === "accent" || variant === "success" ? "accent" : "primary") : glow;

    return (
      <div ref={ref} className={cn(iconBadgeVariants({ variant, size, glow: effectiveGlow }), className)} {...props}>
        {Icon && <Icon weight='bold' />}
        {children}
      </div>
    );
  }
);

IconBadge.displayName = "IconBadge";

export { IconBadge, iconBadgeVariants };
