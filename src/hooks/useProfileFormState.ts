import { useState, useCallback } from "react";
import { ProfileStep } from "@/src/types/profile.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { useSaveProfileStep } from "@/src/services/profile.service";

interface UseProfileFormStateProps {
  userId: string;
  step: ProfileStep;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
}

export function useProfileFormState({ userId, step, onStepComplete, onMessage }: UseProfileFormStateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const saveProfileMutation = useSaveProfileStep();

  const handleSubmit = useCallback(
    async (stepData: any) => {
      setIsSubmitting(true);
      try {
        await saveProfileMutation.mutateAsync({
          userId,
          step,
          stepData,
        });

        onMessage({
          type: StatusMessageType.SUCCESS,
          text: "Information saved successfully!",
        });

        onStepComplete(step);
      } catch (error) {
        onMessage({
          type: StatusMessageType.ERROR,
          text: error instanceof Error ? error.message : "Failed to save information",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [userId, step, onStepComplete, onMessage, saveProfileMutation]
  );

  const showError = useCallback(
    (message: string) => {
      onMessage({
        type: StatusMessageType.ERROR,
        text: message,
      });
    },
    [onMessage]
  );

  const showSuccess = useCallback(
    (message: string) => {
      onMessage({
        type: StatusMessageType.SUCCESS,
        text: message,
      });
    },
    [onMessage]
  );

  return {
    isSubmitting,
    handleSubmit,
    showError,
    showSuccess,
  };
}
