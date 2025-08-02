"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/src/helpers/tailwind.helper";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot='separator'
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        // Neumorphic separator with brand colors
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        "bg-gradient-to-r from-transparent via-primary-200/60 to-transparent",
        "shadow-[0_1px_2px_rgba(37,99,235,0.1)]",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
