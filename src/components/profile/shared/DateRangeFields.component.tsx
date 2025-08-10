"use client";

import { Controller, Control } from "react-hook-form";
import { DatePicker } from "@/src/components/ui/date-picker";
import { ProfileFormField } from "./ProfileFormField.component";

interface DateRangeFieldsProps<TFieldPathStart extends string, TFieldPathEnd extends string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  startName: TFieldPathStart;
  endName: TFieldPathEnd;
  startError?: string;
  endError?: string;
  disableEnd?: boolean;
}

export function DateRangeFields<TFieldPathStart extends string, TFieldPathEnd extends string>({
  control,
  startName,
  endName,
  startError,
  endError,
  disableEnd,
}: DateRangeFieldsProps<TFieldPathStart, TFieldPathEnd>) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className='grid grid-cols-2 gap-4'>
      <Controller
        name={startName}
        control={control}
        render={({ field }) => (
          <ProfileFormField label='Start Date' error={startError}>
            <DatePicker value={field.value} onChange={field.onChange} placeholder='dd/mm/yyyy' max={today} />
          </ProfileFormField>
        )}
      />

      <Controller
        name={endName}
        control={control}
        render={({ field }) => (
          <ProfileFormField label='End Date' error={endError}>
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder='dd/mm/yyyy'
              disabled={disableEnd}
              max={today}
            />
          </ProfileFormField>
        )}
      />
    </div>
  );
}
