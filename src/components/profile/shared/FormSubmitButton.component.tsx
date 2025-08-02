"use client";

import { Button } from "@/src/components/ui/button";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";
import { CheckCircleIcon } from "@phosphor-icons/react";

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  submittingText?: string;
  submitText?: string;
  disabled?: boolean;
  className?: string;
}

export function FormSubmitButton({
  isSubmitting,
  submittingText = "Saving...",
  submitText = "Save & Continue",
  disabled = false,
  className = "w-full",
}: FormSubmitButtonProps) {
  return (
    <Button
      type='submit'
      disabled={isSubmitting || disabled}
      variant='default'
      size='lg'
      glow='primary'
      className={className}
    >
      {isSubmitting ? (
        <div className='flex items-center gap-3'>
          <InlineLoader action={LoadingAction.SAVING} size={SpinnerSize.SMALL} />
          <span>{submittingText}</span>
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          <CheckCircleIcon className='h-5 w-5' weight='bold' />
          <span>{submitText}</span>
        </div>
      )}
    </Button>
  );
}
