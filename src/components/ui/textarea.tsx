"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const textareaVariants = cva(
  [
    "flex w-full rounded-lg border px-3 py-2 text-base transition-all duration-200 resize-none",
    "placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50",
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
      },
      size: {
        sm: "min-h-[80px] px-2 py-2 text-sm",
        default: "min-h-[100px] px-3 py-2",
        lg: "min-h-[120px] px-4 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /**
   * Whether the textarea has an error state
   */
  hasError?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, hasError, ...props }, ref) => {
    const effectiveVariant = hasError ? "error" : variant;
    
    return (
      <textarea
        className={cn(textareaVariants({ variant: effectiveVariant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };