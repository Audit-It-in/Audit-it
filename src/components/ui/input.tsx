"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const inputVariants = cva(
  [
    "flex w-full rounded-lg border px-3 py-2 text-base transition-all duration-200",
    "placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "focus:outline-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white border-neutral-300",
          "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
          "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20",
          "focus:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.15),inset_-3px_-3px_8px_rgba(255,255,255,0.95)]",
        ],
        error: [
          "bg-white border-red-400",
          "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
          "focus:border-red-400 focus:ring-2 focus:ring-red-500/20",
          "focus:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.15),inset_-3px_-3px_8px_rgba(255,255,255,0.95)]",
        ],
        subtle: [
          "bg-white border-neutral-300",
          "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.9)]",
          "focus:border-primary-400 focus:ring-1 focus:ring-primary-500/20",
          "focus:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.12),inset_-2px_-2px_6px_rgba(255,255,255,0.95)]",
        ],
        inset: [
          "bg-gradient-to-br from-neutral-50/80 to-neutral-100/60 border-neutral-200/60",
          "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]",
          "focus:border-primary-300/70 focus:ring-1 focus:ring-primary-500/15",
          "focus:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
        ],
      },
      size: {
        sm: "h-9 px-2 text-sm",
        default: "h-11 px-3",
        lg: "h-12 px-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  /**
   * Whether the input has an error state
   */
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, hasError, type, ...props }, ref) => {
    const effectiveVariant = hasError ? "error" : variant;

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant: effectiveVariant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
