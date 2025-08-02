"use client";

import { Button } from "@/src/components/ui/button";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";

interface SaveContinueButtonProps {
  isSubmitting: boolean;
  submitText: string;
  submittingText: string;
  disabled?: boolean;
}

export function SaveContinueButton({
  isSubmitting,
  submitText,
  submittingText,
  disabled = false,
}: SaveContinueButtonProps) {
  return (
    <div className='flex justify-end pt-4'>
      <Button
        type='submit'
        variant='primary'
        size='lg'
        disabled={isSubmitting || disabled}
        className='font-semibold w-full'
      >
        {isSubmitting ? (
          <div className='flex items-center gap-2'>
            <InlineLoader action={LoadingAction.SAVING} />
            <span>{submittingText}</span>
          </div>
        ) : (
          submitText
        )}
      </Button>
    </div>
  );
}
