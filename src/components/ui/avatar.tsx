"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/helpers/tailwind.helper";

const avatarVariants = cva(
  [
    // Base neumorphic container
    "relative flex shrink-0 overflow-visible rounded-full",
    "transition-all duration-300 ease-out",
    // Neumorphic depth effect - raised from surface
    "before:absolute before:inset-0 before:rounded-full before:pointer-events-none",
    "before:bg-white",
    "before:shadow-[4px_4px_8px_rgba(37,99,235,0.15),-4px_-4px_8px_rgba(255,255,255,0.9)]",
    "before:transition-all before:duration-300",
    // Inner border highlight
    "after:absolute after:inset-[1px] after:rounded-full after:pointer-events-none",
    "after:border after:border-white/60 after:transition-all after:duration-300",
  ],
  {
    variants: {
      size: {
        xs: ["size-6", "before:shadow-[2px_2px_4px_rgba(37,99,235,0.12),-2px_-2px_4px_rgba(255,255,255,0.9)]"],
        sm: ["size-8", "before:shadow-[3px_3px_6px_rgba(37,99,235,0.14),-3px_-3px_6px_rgba(255,255,255,0.9)]"],
        md: ["size-10", "before:shadow-[4px_4px_8px_rgba(37,99,235,0.15),-4px_-4px_8px_rgba(255,255,255,0.9)]"],
        lg: ["size-12", "before:shadow-[5px_5px_10px_rgba(37,99,235,0.18),-5px_-5px_10px_rgba(255,255,255,0.9)]"],
        xl: ["size-16", "before:shadow-[6px_6px_12px_rgba(37,99,235,0.2),-6px_-6px_12px_rgba(255,255,255,0.9)]"],
        "2xl": ["size-20", "before:shadow-[8px_8px_16px_rgba(37,99,235,0.22),-8px_-8px_16px_rgba(255,255,255,0.9)]"],
      },
      variant: {
        default: ["cursor-default"],
        interactive: [
          "cursor-pointer",
          "hover:before:shadow-[6px_6px_12px_rgba(37,99,235,0.25),-6px_-6px_12px_rgba(255,255,255,0.95)]",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
          "active:before:shadow-[inset_3px_3px_6px_rgba(37,99,235,0.2),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]",
          "active:after:border-primary-200/40",
        ],
        online: ["after:shadow-[0_0_0_2px_rgba(16,185,129,0.3)]", "after:border-accent-400"],
        offline: ["after:shadow-[0_0_0_2px_rgba(156,163,175,0.3)]", "after:border-neutral-400"],
        away: ["after:shadow-[0_0_0_2px_rgba(245,158,11,0.3)]", "after:border-yellow-400"],
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root>, VariantProps<typeof avatarVariants> {}

function Avatar({ className, size, variant, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root data-slot='avatar' className={cn(avatarVariants({ size, variant }), className)} {...props} />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot='avatar-image'
      className={cn(
        "relative z-10 aspect-square size-full rounded-full object-cover",
        // Subtle inset shadow for realistic depth
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]",
        className
      )}
      {...props}
    />
  );
}

const avatarFallbackVariants = cva(
  [
    "relative z-10 flex size-full items-center justify-center rounded-full",
    "font-bold select-none tracking-tight",
    // Neumorphic fallback background (no gradients)
    "bg-primary-100",
    "text-primary-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]",
    "transition-all duration-300",
  ],
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-xl",
        "2xl": "text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  size?: VariantProps<typeof avatarFallbackVariants>["size"];
}

function AvatarFallback({ className, size, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn(avatarFallbackVariants({ size }), className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants, type AvatarProps };
