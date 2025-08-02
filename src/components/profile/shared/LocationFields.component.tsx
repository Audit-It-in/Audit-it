"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";
import { WarningIcon } from "@phosphor-icons/react";
import { useStates, useDistricts } from "@/src/services/profile.service";

interface LocationFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  stateValue: number;
  onStateChange: (stateId: number) => void;
  className?: string;
}

export function LocationFields({ control, errors, stateValue, onStateChange, className = "" }: LocationFieldsProps) {
  const { data: states = [], isLoading: statesLoading, error: statesError } = useStates();
  const {
    data: districts = [],
    isLoading: districtsLoading,
    error: districtsError,
  } = useDistricts(stateValue || undefined);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {/* State Field */}
      <div className='space-y-2'>
        <Label htmlFor='state_id' className='text-sm font-medium text-primary-800'>
          State *
        </Label>
        <Controller
          name='state_id'
          control={control}
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ""}
              onValueChange={(value) => {
                const stateId = parseInt(value);
                field.onChange(stateId);
                onStateChange(stateId);
              }}
            >
              <SelectTrigger className='w-full' hasError={!!errors.state_id}>
                <SelectValue placeholder='Select state' />
              </SelectTrigger>
              <SelectContent>
                {statesLoading ? (
                  <div className='flex items-center justify-center py-2'>
                    <InlineLoader action={LoadingAction.LOADING} size={SpinnerSize.SMALL} />
                    <span className='ml-2 text-sm'>Loading states...</span>
                  </div>
                ) : statesError ? (
                  <div className='px-2 py-2 text-sm text-red-600'>Failed to load states</div>
                ) : states.length === 0 ? (
                  <div className='px-2 py-2 text-sm text-neutral-500'>No states available</div>
                ) : (
                  states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.state_id && (
          <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
            <WarningIcon className='h-3 w-3' />
            {errors.state_id.message}
          </p>
        )}
      </div>

      {/* District Field */}
      <div className='space-y-2'>
        <Label htmlFor='district_id' className='text-sm font-medium text-primary-800'>
          District *
        </Label>
        <Controller
          name='district_id'
          control={control}
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ""}
              onValueChange={(value) => field.onChange(parseInt(value))}
              disabled={!stateValue || districts.length === 0}
            >
              <SelectTrigger
                className='w-full'
                hasError={!!errors.district_id}
                disabled={!stateValue || districts.length === 0}
              >
                <SelectValue placeholder={stateValue ? "Select district" : "Select state first"} />
              </SelectTrigger>
              <SelectContent>
                {districtsLoading ? (
                  <div className='flex items-center justify-center py-2'>
                    <InlineLoader action={LoadingAction.LOADING} size={SpinnerSize.SMALL} />
                    <span className='ml-2 text-sm'>Loading districts...</span>
                  </div>
                ) : districtsError ? (
                  <div className='px-2 py-2 text-sm text-red-600'>Failed to load districts</div>
                ) : districts.length === 0 ? (
                  <div className='px-2 py-2 text-sm text-neutral-500'>
                    {stateValue ? "No districts available" : "Select a state first"}
                  </div>
                ) : (
                  districts.map((district) => (
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.district_id && (
          <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
            <WarningIcon className='h-3 w-3' />
            {errors.district_id.message}
          </p>
        )}
      </div>
    </div>
  );
}
