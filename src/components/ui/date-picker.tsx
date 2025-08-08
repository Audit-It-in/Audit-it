"use client";

import { useMemo, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/helpers/tailwind.helper";
import { dateToIso, formatIsoToDisplay, isoToDate } from "@/src/helpers/date.helper";

export interface DatePickerProps {
  value?: string | null | ""; // yyyy-MM-dd
  onChange?: (value: string | "") => void;
  placeholder?: string;
  disabled?: boolean;
  min?: string; // yyyy-MM-dd
  max?: string; // yyyy-MM-dd
  className?: string;
}

export function DatePicker({
  value = "",
  onChange,
  placeholder = "dd/mm/yyyy",
  disabled,
  min,
  max,
  className,
}: DatePickerProps) {
  const selectedDate = useMemo(() => isoToDate(value || undefined), [value]);
  const [open, setOpen] = useState(false);
  const minDate = useMemo(() => (min ? isoToDate(min) : undefined), [min]);
  const maxDate = useMemo(() => (max ? isoToDate(max) : undefined), [max]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className={cn("relative", className)}>
        <PopoverPrimitive.Trigger asChild>
          <div className='relative'>
            <Input
              readOnly
              value={formatIsoToDisplay(value || undefined)}
              placeholder={placeholder}
              disabled={disabled}
              className='pr-10'
            />
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 shadow-neumorphic-sm'
              aria-label='Open calendar'
              disabled={disabled}
            >
              <CalendarIcon className='h-4 w-4 text-primary-600' />
            </Button>
          </div>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side='bottom'
            align='start'
            className={cn(
              "z-50 mt-2 rounded-xl border border-primary-200/50 bg-white p-2",
              "shadow-[8px_8px_20px_rgba(0,0,0,0.12),-6px_-6px_14px_rgba(255,255,255,0.95)]"
            )}
          >
            <Calendar
              selected={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              onSelect={(d) => {
                const iso = d ? dateToIso(d) : "";
                onChange?.(iso);
                setOpen(false);
              }}
            />
            <PopoverPrimitive.Arrow className='fill-white' />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </div>
    </PopoverPrimitive.Root>
  );
}
