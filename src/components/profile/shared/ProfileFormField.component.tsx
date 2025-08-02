"use client";

import { forwardRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { WarningIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  type?: "input" | "textarea" | "number" | "email" | "tel" | "month";
  placeholder?: string;
  description?: string;
  className?: string;
  inputClassName?: string;
  children?: React.ReactNode;
}

export const ProfileFormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  ProfileFormFieldProps &
    React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(
  (
    { label, error, required, type = "input", placeholder, description, className, inputClassName, children, ...props },
    ref
  ) => {
    const fieldId = props.id || props.name;
    const isTextarea = type === "textarea";

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={fieldId} className='text-sm font-medium text-primary-800'>
          {label} {required && "*"}
        </Label>

        {children ? (
          children
        ) : isTextarea ? (
          <Textarea
            id={fieldId}
            placeholder={placeholder}
            hasError={!!error}
            className={inputClassName}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        ) : (
          <Input
            id={fieldId}
            type={type}
            placeholder={placeholder}
            hasError={!!error}
            className={inputClassName}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}

        {error && (
          <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
            <WarningIcon className='h-3 w-3' />
            {error}
          </p>
        )}

        {description && !error && <p className='text-xs text-neutral-600'>{description}</p>}
      </div>
    );
  }
);

ProfileFormField.displayName = "ProfileFormField";
