"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";

// Base components
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectGroup = SelectPrimitive.Group;
const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;
const SelectScrollUpButton = SelectPrimitive.ScrollUpButton;
const SelectScrollDownButton = SelectPrimitive.ScrollDownButton;

const selectTriggerVariants = cva(
  [
    "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-base",
    "transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
    "data-[placeholder]:text-neutral-500",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  /**
   * Whether the select has an error state
   */
  hasError?: boolean;
}

const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, SelectTriggerProps>(
  ({ className, variant, size, hasError, children, ...props }, ref) => {
    const effectiveVariant = hasError ? "error" : variant;

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(selectTriggerVariants({ variant: effectiveVariant, size }), className)}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <CaretDownIcon className='h-4 w-4 opacity-50' weight='bold' />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  }
);

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-white text-neutral-900",
        "shadow-[0_4px_12px_rgba(37,99,235,0.15)] animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-2 px-3 text-sm outline-none",
      "focus:bg-primary-50 focus:text-primary-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "hover:bg-primary-50/50 transition-colors",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectTrigger,
  SelectContent,
  SelectItem,
  selectTriggerVariants,
};
