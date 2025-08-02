"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center rounded-lg border px-3 py-1 text-xs font-medium",
    "w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none",
    "transition-all duration-200 overflow-hidden",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-r from-primary-100/80 to-accent-100/80 border border-primary-300/60",
          "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]",
          "text-primary-700 font-semibold",
        ],
        primary: [
          "bg-gradient-to-br from-primary-50/80 to-primary-100/60 border border-primary-200/60",
          "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]",
          "text-primary-800 font-medium",
        ],
        accent: [
          "bg-accent-100 text-accent-900 border-accent-200",
          "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]",
        ],
        secondary: [
          "bg-gradient-to-br from-neutral-50/80 to-neutral-100/60 border border-neutral-200/60",
          "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]",
          "text-neutral-700 font-medium",
        ],
        success: [
          "bg-gradient-to-br from-green-50/80 to-green-100/60 border border-green-200/60",
          "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]",
          "text-green-800 font-medium",
        ],
        warning: [
          "bg-gradient-to-br from-yellow-50/80 to-yellow-100/60 border border-yellow-200/60",
          "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]",
          "text-yellow-800 font-medium",
        ],
        destructive: [
          "bg-gradient-to-br from-red-50/80 to-red-100/60 border border-red-200/60",
          "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]",
          "text-red-800 font-medium",
        ],
        outline: [
          "border border-neutral-300 bg-white",
          "shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)]",
          "text-neutral-700 hover:bg-neutral-50",
        ],
        tag: [
          "bg-gradient-to-br from-primary-50/80 to-primary-100/60 border border-primary-200/60",
          "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]",
          "text-primary-800 font-medium group",
          "hover:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
        ],
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /**
   * Whether the badge can be removed (shows remove button)
   */
  removable?: boolean;
  /**
   * Callback when the remove button is clicked
   */
  onRemove?: () => void;
  /**
   * Custom remove icon
   */
  removeIcon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, asChild = false, removable, onRemove, removeIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    };

    return (
      <Comp ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {children}
        {removable && (
          <button
            type='button'
            onClick={handleRemove}
            className='ml-1 text-current hover:text-red-600 transition-colors duration-200'
            aria-label='Remove'
          >
            {removeIcon || "×"}
          </button>
        )}
      </Comp>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
