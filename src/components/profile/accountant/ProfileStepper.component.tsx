"use client";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { EducationStep } from "./EducationStep.component";
import { PersonalInfoStep } from "./PersonalInfoStep.component";
import { ProfessionalStep } from "./ProfessionalStep.component";
import { Profile, ProfileStep } from "@/src/types/profile.type";
import { Progress } from "@/src/components/ui/progress";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { StatusMessage as StatusMessageComponent } from "@/src/components/common/StatusMessage.component";
import { StepCard } from "@/src/components/ui/step-card";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { VerificationStep } from "./VerificationStep.component";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { PROFILE_STEP_ORDER, PROFILE_STEP_META } from "@/src/constants/profile-step.constants";
import { getCompletedStepsFromProfile, calculateProgress, syncUrlWithStep } from "./ProfileStepper.util";

// Step components (to be created)

interface ProfileStepperProps {
  userId: string;
  initialStep: ProfileStep;
  existingProfile: Profile | null;
}

const STEP_ORDER = PROFILE_STEP_ORDER;

export function ProfileStepper({ userId, initialStep, existingProfile }: ProfileStepperProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ProfileStep>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<ProfileStep>>(
    new Set(existingProfile?.last_completed_section ? getCompletedStepsFromProfile(existingProfile) : [])
  );
  const [message, setMessage] = useState<StatusMessage | null>(null);
  const currentStepIndex = STEP_ORDER.findIndex((step) => step === currentStep);

  // Calculate progress
  const progressPercentage = calculateProgress(completedSteps);

  const navigateToStep = useCallback((targetStep: ProfileStep) => {
    setCurrentStep(targetStep);
    setMessage(null);

    // Update URL without navigation
    syncUrlWithStep(targetStep);
  }, []);

  const handleStepComplete = useCallback(
    (step: ProfileStep) => {
      setCompletedSteps((prev) => {
        const next = new Set([...prev, step]);
        const pct = calculateProgress(next);
        if (pct >= 100) setMessage({ type: StatusMessageType.SUCCESS, text: "Woohoo! profile saved successfully" });
        else setMessage(null);
        return next;
      });

      // Auto-advance to next step if not the last one
      const nextStepIndex = STEP_ORDER.findIndex((s) => s === step) + 1;
      if (nextStepIndex < STEP_ORDER.length) {
        setTimeout(() => {
          navigateToStep(STEP_ORDER[nextStepIndex]);
        }, 1500);
      } else {
        // Finished last step – navigate to dashboard
        setTimeout(() => {
          router.push("/dashboard?completed=profile");
        }, 1500);
      }
    },
    [router, navigateToStep]
  );

  const canNavigateToStep = useCallback(
    (targetStep: ProfileStep): boolean => {
      const targetIndex = STEP_ORDER.findIndex((s) => s === targetStep);

      // Always allow navigation to completed steps
      if (completedSteps.has(targetStep)) {
        return true;
      }

      // Allow navigation if all previous required steps are completed
      for (let i = 0; i < targetIndex; i++) {
        const prevStep = STEP_ORDER[i];
        const isRequired = PROFILE_STEP_META[prevStep].required;
        if (isRequired && !completedSteps.has(prevStep)) {
          return false;
        }
      }

      return true;
    },
    [completedSteps]
  );

  const renderStepNavigation = () => (
    <Card className='mb-6' variant='default' size='default'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-base font-semibold text-primary-900'>Profile Completion</h3>
        <Badge variant='default'>{progressPercentage}%</Badge>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercentage} variant='default' size='default' fillVariant='primary' className='mb-2' />

      {/* Step Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {STEP_ORDER.map((step, index) => (
          <StepCard
            key={step}
            stepNumber={index + 1}
            title={PROFILE_STEP_META[step].title}
            description={PROFILE_STEP_META[step].description}
            icon={PROFILE_STEP_META[step].icon}
            required={PROFILE_STEP_META[step].required}
            completed={completedSteps.has(step)}
            active={step === currentStep}
            clickable={canNavigateToStep(step)}
            onClick={() => navigateToStep(step)}
          />
        ))}
      </div>

      {/* Only show toast elsewhere for 100% completion; hide inline badge/card here */}
    </Card>
  );

  const renderStepContent = () => {
    const commonProps = {
      userId,
      onStepComplete: handleStepComplete,
      onMessage: setMessage,
      existingProfile,
    };

    switch (currentStep) {
      case ProfileStep.PERSONAL_INFO:
        return <PersonalInfoStep {...commonProps} />;
      case ProfileStep.VERIFICATION:
        return <VerificationStep {...commonProps} />;
      case ProfileStep.EXPERIENCE:
        return <ProfessionalStep {...commonProps} />;
      case ProfileStep.EDUCATION:
        return <EducationStep {...commonProps} />;
      default:
        return <PersonalInfoStep {...commonProps} />;
    }
  };

  const renderStepActions = () => {
    const prevStepIndex = currentStepIndex - 1;
    const nextStepIndex = currentStepIndex + 1;

    const canGoPrev = prevStepIndex >= 0;
    const canGoNext = nextStepIndex < STEP_ORDER.length && canNavigateToStep(STEP_ORDER[nextStepIndex]);

    return (
      <div className='flex items-center justify-between mt-6 pt-6 border-t border-neutral-200'>
        <Button
          variant='outline'
          onClick={() => canGoPrev && navigateToStep(STEP_ORDER[prevStepIndex])}
          disabled={!canGoPrev}
          className='flex items-center gap-2'
        >
          <ArrowLeftIcon className='h-4 w-4' weight='bold' />
          Previous
        </Button>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-neutral-500'>
            Step {currentStepIndex + 1} of {STEP_ORDER.length}
          </span>
        </div>

        <Button
          variant='outline'
          onClick={() => canGoNext && navigateToStep(STEP_ORDER[nextStepIndex])}
          disabled={!canGoNext}
          className='flex items-center gap-2'
        >
          Next
          <ArrowRightIcon className='h-4 w-4' weight='bold' />
        </Button>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Status Message */}
      {message && <StatusMessageComponent message={message} />}

      {/* Step Navigation */}
      {renderStepNavigation()}

      {/* Current Step Content */}
      <Card variant='default' size='default'>
        {renderStepContent()}

        {renderStepActions()}
      </Card>
    </div>
  );
}
