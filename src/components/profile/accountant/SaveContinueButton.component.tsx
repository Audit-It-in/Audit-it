"use client";

import { Button } from "@/src/components/ui/button";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";
import { ArrowLineRightIcon } from "@phosphor-icons/react/dist/ssr";

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
          <span className='flex items-center justify-center gap-2'>
            <span>{submitText}</span>
            <ArrowLineRightIcon weight='bold' className='size-5' />
          </span>
        )}
      </Button>
    </div>
  );
}
