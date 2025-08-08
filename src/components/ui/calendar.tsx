"use client";

import { DayPicker } from "react-day-picker";
import { cn } from "@/src/helpers/tailwind.helper";
import "react-day-picker/style.css";
import { useMemo, useState } from "react";
import { addMonths, format, setMonth, setYear } from "date-fns";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

interface CalendarProps {
  mode?: "single";
  selected?: Date | undefined;
  onSelect?: (date?: Date) => void;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  minDate,
  maxDate,
}: CalendarProps) {
  const initialMonth = useMemo(() => selected ?? new Date(), [selected]);
  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);

  const handlePrev = () => setCurrentMonth((m) => addMonths(m, -1));
  const handleNext = () => setCurrentMonth((m) => addMonths(m, 1));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div
      className={cn(
        "rounded-xl border border-primary-200/50 bg-white",
        "shadow-[6px_6px_16px_rgba(0,0,0,0.08),-6px_-6px_16px_rgba(255,255,255,0.9)]",
        className
      )}
    >
      {/* Custom header: arrows with centered month + year select */}
      <div className='flex items-center justify-between px-2 pt-2'>
        <button
          type='button'
          className={cn(
            "h-8 w-8 grid place-items-center rounded-md border border-neutral-200 bg-white",
            "shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.9)]"
          )}
          aria-label='Previous month'
          onClick={handlePrev}
        >
          <CaretLeftIcon className='h-4 w-4 text-primary-700' weight='bold' />
        </button>

        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold text-primary-900 min-w-[84px] text-center'>
            {format(currentMonth, "MMMM")}
          </span>
          <Select
            value={String(currentMonth.getFullYear())}
            onValueChange={(v) => setCurrentMonth((m) => setYear(m, parseInt(v)))}
          >
            <SelectTrigger className='h-8 w-[90px] px-2 py-0'>
              <SelectValue placeholder={String(currentMonth.getFullYear())} />
            </SelectTrigger>
            <SelectContent className='max-h-64'>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          type='button'
          className={cn(
            "h-8 w-8 grid place-items-center rounded-md border border-neutral-200 bg-white",
            "shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.9)]"
          )}
          aria-label='Next month'
          onClick={handleNext}
        >
          <CaretRightIcon className='h-4 w-4 text-primary-700' weight='bold' />
        </button>
      </div>

      <DayPicker
        mode={mode}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        components={{ Caption: () => null, Nav: () => null }}
        styles={{
          caption: { display: "none" },
          caption_label: { display: "none" },
          nav: { display: "none" },
        }}
        /* Disable outside min/max if provided */
        modifiersClassNames={{}}
        className={cn("p-2 pt-1 text-sm w-80")}
        disabled={
          [minDate ? { before: minDate } : undefined, maxDate ? { after: maxDate } : undefined].filter(Boolean) as any
        }
        classNames={{
          caption: "hidden",
          caption_label: "hidden",
          nav: "hidden",
          month: "space-y-2",
          head_row: "grid grid-cols-7 gap-1 px-2 text-neutral-500",
          row: "grid grid-cols-7 gap-1 px-2",
          head_cell: "h-8 grid place-items-center font-medium",
          cell: "h-9",
          day: "p-1",
          day_button: cn(
            "h-8 w-8 rounded-md border border-neutral-200",
            "bg-white text-neutral-800",
            "shadow-[1px_1px_3px_rgba(0,0,0,0.06),-1px_-1px_3px_rgba(255,255,255,0.95)]",
            "hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.9)]",
            "transition-all"
          ),
          day_today: "ring-2 ring-primary-300 text-primary-900",
          day_selected: "!bg-primary-600 !text-white !border-primary-600 shadow-inner",
          day_outside: "opacity-40",
          day_disabled: "opacity-40 cursor-not-allowed",
        }}
      />
    </div>
  );
}
