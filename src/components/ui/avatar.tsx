"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/src/helpers/tailwind.helper";

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        // Neumorphic styling with brand colors
        "bg-gradient-to-br from-white to-primary-50/80",
        "shadow-[2px_2px_4px_rgba(37,99,235,0.1),-2px_-2px_4px_rgba(255,255,255,0.9)]",
        "border border-primary-100/50",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot='avatar-image'
      className={cn("aspect-square size-full rounded-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn(
        "flex size-full items-center justify-center rounded-full text-primary-700 font-medium",
        "bg-gradient-to-br from-primary-50 to-primary-100/80",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
