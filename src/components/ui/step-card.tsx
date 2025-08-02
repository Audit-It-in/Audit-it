"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";

const stepCardVariants = cva(
  [
    "relative p-4 rounded-xl transition-all duration-500 text-center group overflow-hidden",
    "hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed",
  ],
  {
    variants: {
      state: {
        active: [
          "shadow-[inset_4px_4px_12px_rgba(0,0,0,0.15),inset_-4px_-4px_12px_rgba(255,255,255,0.9)]",
          "border-2 border-primary-400/80 bg-gradient-to-br from-primary-50/80 via-primary-100/40 to-primary-200/60",
        ],
        completed: [
          "shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)]",
          "border border-accent-300/50 bg-gradient-to-br from-accent-50/60 to-accent-100/40",
          "hover:shadow-[8px_8px_20px_rgba(0,0,0,0.15),-8px_-8px_20px_rgba(255,255,255,0.95)]",
        ],
        inactive: [
          "shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.8)]",
          "border border-neutral-200/60 bg-gradient-to-br from-neutral-50 to-neutral-100/60 opacity-70",
          "hover:opacity-90 hover:shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)]",
        ],
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
);

const stepOverlayVariants = cva("absolute inset-0 opacity-0 transition-opacity duration-500 rounded-xl", {
  variants: {
    state: {
      active: "opacity-100 bg-gradient-to-br from-primary-100/20 via-transparent to-primary-200/30",
      completed: "opacity-60 bg-gradient-to-br from-accent-100/15 via-transparent to-accent-200/25",
      inactive: "",
    },
  },
  defaultVariants: {
    state: "inactive",
  },
});

const stepIconVariants = cva(
  "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500",
  {
    variants: {
      state: {
        active: [
          "shadow-[inset_3px_3px_8px_rgba(0,0,0,0.2),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]",
          "bg-gradient-to-br from-primary-600 to-primary-700 text-white",
        ],
        completed: [
          "shadow-[3px_3px_8px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.9)]",
          "bg-gradient-to-br from-accent-500 to-accent-600 text-white",
        ],
        inactive: [
          "shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.8)]",
          "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-500",
        ],
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
);

const stepNumberVariants = cva(
  [
    "absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white z-20",
    "flex items-center justify-center text-xs font-bold transition-all duration-500",
    "shadow-[2px_2px_6px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.8)]",
  ],
  {
    variants: {
      state: {
        active: "bg-gradient-to-br from-primary-600 to-primary-700 text-white",
        completed: "bg-gradient-to-br from-accent-500 to-accent-600 text-white",
        inactive: "bg-gradient-to-br from-neutral-300 to-neutral-400 text-neutral-700",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
);

const stepIndicatorVariants = cva(
  "absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500",
  {
    variants: {
      state: {
        active: "w-3/4 bg-gradient-to-r from-primary-400/80 via-primary-600 to-primary-400/80 shadow-sm",
        completed: "w-2/3 bg-gradient-to-r from-accent-400/80 via-accent-500 to-accent-400/80",
        inactive: "w-0",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
);

export interface StepCardProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
    VariantProps<typeof stepCardVariants> {
  /**
   * The step number to display
   */
  stepNumber: number;
  /**
   * The step title
   */
  title: string;
  /**
   * The step description
   */
  description: string;
  /**
   * The icon component to render
   */
  icon?: React.ComponentType<any>;
  /**
   * Whether this step is required
   */
  required?: boolean;
  /**
   * Whether this step is completed
   */
  completed?: boolean;
  /**
   * Whether this step is currently active
   */
  active?: boolean;
  /**
   * Whether this step can be clicked
   */
  clickable?: boolean;
  /**
   * Custom click handler
   */
  onClick?: () => void;
  /**
   * Whether to show glow effect
   */
  showGlow?: boolean;
  /**
   * Whether to show ping animation for active step
   */
  showPing?: boolean;
}

const StepCard = React.forwardRef<HTMLButtonElement, StepCardProps>(
  (
    {
      className,
      stepNumber,
      title,
      description,
      icon: Icon,
      required,
      completed,
      active,
      clickable = true,
      onClick,
      showGlow = true,
      showPing = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const stepState = active ? "active" : completed ? "completed" : "inactive";
    const isDisabled = disabled || !clickable;

    const handleClick = () => {
      if (!isDisabled && onClick) {
        onClick();
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(stepCardVariants({ state: stepState }), className)}
        {...props}
      >
        {/* Background gradient overlay */}
        <div className={stepOverlayVariants({ state: stepState })} />

        {/* Main content */}
        <div className='relative z-10 flex flex-col items-center gap-3'>
          {/* Icon container */}
          <div className={stepIconVariants({ state: stepState })}>
            {completed && !active ? (
              <CheckCircleIcon className='h-5 w-5' weight='bold' />
            ) : Icon ? (
              <Icon className='h-5 w-5' weight='bold' />
            ) : (
              <span className='text-sm font-bold'>{stepNumber}</span>
            )}

            {/* Glow effect for active/completed */}
            {showGlow && (active || completed) && (
              <div
                className={cn(
                  "absolute inset-0 rounded-xl blur-lg opacity-30",
                  active && "bg-primary-600",
                  completed && !active && "bg-accent-500"
                )}
              />
            )}
          </div>

          {/* Title and description */}
          <div className='w-full'>
            <div className='flex items-center justify-center gap-1 mb-1'>
              <span
                className={cn(
                  "text-xs font-semibold transition-colors duration-300",
                  active && "text-primary-800",
                  completed && !active && "text-accent-800",
                  !active && !completed && "text-neutral-600"
                )}
              >
                {title}
              </span>
              {required && <span className='text-xs text-red-500 font-bold'>*</span>}
            </div>
            <p
              className={cn(
                "text-xs leading-tight transition-colors duration-300",
                active && "text-primary-700 font-medium",
                completed && !active && "text-accent-700",
                !active && !completed && "text-neutral-500"
              )}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Step number badge */}
        <div className={stepNumberVariants({ state: stepState })}>
          {stepNumber}

          {/* Ping animation for active step */}
          {showPing && active && (
            <div className='absolute inset-0 rounded-full animate-ping bg-primary-600 opacity-20' />
          )}
        </div>

        {/* Selection indicator line */}
        <div className={stepIndicatorVariants({ state: stepState })} />
      </button>
    );
  }
);

StepCard.displayName = "StepCard";

export { StepCard, stepCardVariants };
