"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary-300 ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Neumorphic styling with brand colors
      "bg-gradient-to-br from-white to-primary-50/50",
      "shadow-[1px_1px_2px_rgba(37,99,235,0.1),-1px_-1px_2px_rgba(255,255,255,0.8)]",
      "data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-primary-500 data-[state=checked]:to-primary-600",
      "data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary-600",
      "data-[state=checked]:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_rgba(255,255,255,0.1)]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-white")}>
      <CheckIcon className='h-3 w-3' weight='bold' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
