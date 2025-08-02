"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Checkbox } from "./checkbox";
import { cn } from "@/src/helpers/tailwind.helper";

const checkboxGroupVariants = cva("grid gap-3", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2 sm:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
      responsive: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: {
    columns: "responsive",
  },
});

const checkboxCardVariants = cva(
  [
    "group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border",
    "shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.8)]",
    "hover:shadow-[4px_4px_10px_rgba(0,0,0,0.12),-4px_-4px_10px_rgba(255,255,255,0.9)]",
  ],
  {
    variants: {
      variant: {
        default: {
          checked: [
            "border-primary-400/80 bg-gradient-to-br from-primary-50/80 via-primary-100/40 to-primary-200/60",
            "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]",
          ],
          unchecked: [
            "border-neutral-200/60 bg-gradient-to-br from-neutral-50 to-neutral-100/60",
            "hover:border-primary-300/50",
          ],
        },
        accent: {
          checked: [
            "border-accent-400/80 bg-gradient-to-br from-accent-50/80 via-accent-100/40 to-accent-200/60",
            "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]",
          ],
          unchecked: [
            "border-neutral-200/60 bg-gradient-to-br from-neutral-50 to-neutral-100/60",
            "hover:border-accent-300/50",
          ],
        },
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const checkboxLabelVariants = cva("text-sm font-medium transition-colors duration-300", {
  variants: {
    variant: {
      default: {
        checked: "text-primary-800",
        unchecked: "text-neutral-700 group-hover:text-primary-700",
      },
      accent: {
        checked: "text-accent-800",
        unchecked: "text-neutral-700 group-hover:text-accent-700",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CheckboxGroupItem {
  id: string | number;
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface CheckboxGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof checkboxGroupVariants>,
    VariantProps<typeof checkboxCardVariants> {
  /**
   * The list of items to render as checkboxes
   */
  items: CheckboxGroupItem[];
  /**
   * The currently selected values
   */
  value?: (string | number)[];
  /**
   * Callback when selection changes
   */
  onChange?: (value: (string | number)[]) => void;
  /**
   * Whether the entire group is disabled
   */
  disabled?: boolean;
  /**
   * Custom checkbox props
   */
  checkboxProps?: React.ComponentProps<typeof Checkbox>;
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, columns, variant, items, value = [], onChange, disabled, checkboxProps, ...props }, ref) => {
    const handleToggle = (itemValue: string | number) => {
      if (disabled) return;

      const newValue = value.includes(itemValue) ? value.filter((v) => v !== itemValue) : [...value, itemValue];

      onChange?.(newValue);
    };

    return (
      <div ref={ref} className={cn(checkboxGroupVariants({ columns }), className)} {...props}>
        {items.map((item) => {
          const isChecked = value.includes(item.value);
          const isItemDisabled = disabled || item.disabled;

          return (
            <label
              key={item.id}
              className={cn(
                checkboxCardVariants({ variant }),
                isChecked ? checkboxCardVariants({ variant })?.checked : checkboxCardVariants({ variant })?.unchecked,
                isItemDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => handleToggle(item.value)}
                disabled={isItemDisabled}
                className={cn(
                  variant === "default"
                    ? "data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                    : "data-[state=checked]:bg-accent-600 data-[state=checked]:border-accent-600",
                  checkboxProps?.className
                )}
                {...checkboxProps}
              />
              <span
                className={cn(
                  checkboxLabelVariants({ variant }),
                  isChecked
                    ? checkboxLabelVariants({ variant })?.checked
                    : checkboxLabelVariants({ variant })?.unchecked
                )}
              >
                {item.label}
              </span>
            </label>
          );
        })}
      </div>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup, checkboxGroupVariants };
