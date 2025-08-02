"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/src/helpers/tailwind.helper";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-200 shadow-neumorphic-inset data-[state=checked]:bg-primary-600 data-[state=checked]:shadow-neumorphic-sm",
        accent:
          "bg-neutral-200 shadow-neumorphic-inset data-[state=checked]:bg-accent-600 data-[state=checked]:shadow-neumorphic-sm",
        outline:
          "bg-background border-input shadow-neumorphic-sm data-[state=checked]:bg-primary-50 data-[state=checked]:border-primary-300 data-[state=checked]:shadow-neumorphic-inset",
        soft: "bg-neutral-100 shadow-neumorphic-inset-deep data-[state=checked]:bg-primary-100 data-[state=checked]:shadow-neumorphic-md",
      },
      size: {
        sm: "h-5 w-9",
        default: "h-6 w-11",
        lg: "h-7 w-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white transition-all duration-300 shadow-neumorphic-md ring-0",
  {
    variants: {
      size: {
        sm: "h-4 w-4 translate-x-0 data-[state=checked]:translate-x-4",
        default: "h-5 w-5 translate-x-0 data-[state=checked]:translate-x-5",
        lg: "h-6 w-6 translate-x-0 data-[state=checked]:translate-x-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SwitchProps extends VariantProps<typeof switchVariants> {
  label?: string;
  description?: string;
  showLabel?: boolean;
  labelPosition?: "left" | "right";
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  (
    {
      className,
      variant,
      size,
      label,
      description,
      showLabel = false,
      labelPosition = "right",
      id,
      checked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const switchElement = (
      <SwitchPrimitive.Root
        className={cn(switchVariants({ variant, size, className }))}
        checked={checked}
        onCheckedChange={onCheckedChange}
        {...props}
        ref={ref}
        id={id}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            switchThumbVariants({ size }),
            // Enhanced elevation when checked
            "data-[state=checked]:shadow-neumorphic-lg",
            // Brand color reflection in thumb when checked
            variant === "default" && "data-[state=checked]:ring-1 data-[state=checked]:ring-primary-200",
            variant === "accent" && "data-[state=checked]:ring-1 data-[state=checked]:ring-accent-200"
          )}
        />
      </SwitchPrimitive.Root>
    );

    if (showLabel && (label || description)) {
      const labelContent = (
        <div className='grid gap-1.5 leading-none'>
          {label && (
            <label
              htmlFor={id}
              className='text-sm font-medium leading-none text-primary-900 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {label}
            </label>
          )}
          {description && <p className='text-xs text-primary-600/70'>{description}</p>}
        </div>
      );

      return (
        <div className='flex items-center space-x-3'>
          {labelPosition === "left" && labelContent}
          {switchElement}
          {labelPosition === "right" && labelContent}
        </div>
      );
    }

    return switchElement;
  }
);

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch, switchVariants };
