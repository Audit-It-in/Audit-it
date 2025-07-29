"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

import { Separator } from "@/src/components/ui/separator";
import { ProfileStep, Profile } from "@/src/types/profile.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { cn } from "@/src/helpers/tailwind.helper";
import {
  UserIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { StatusMessage as StatusMessageComponent } from "@/src/components/common/StatusMessage.component";

// Step components (to be created)
import { PersonalInfoStep } from "./steps/PersonalInfoStep.component";
import { VerificationStep } from "./steps/VerificationStep.component";
import { ProfessionalStep } from "./steps/ProfessionalStep.component";
import { EducationStep } from "./steps/EducationStep.component";

interface ProfileStepperProps {
  userId: string;
  initialStep: ProfileStep;
  existingProfile: Profile | null;
}

interface StepConfig {
  step: ProfileStep;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  required: boolean;
  weight: number;
}

const STEP_CONFIG: StepConfig[] = [
  {
    step: ProfileStep.PERSONAL_INFO,
    title: "Personal Information",
    description: "Basic details and profile setup",
    icon: UserIcon,
    required: true,
    weight: 40,
  },
  {
    step: ProfileStep.VERIFICATION,
    title: "CA Verification",
    description: "Professional credentials and documents",
    icon: ShieldCheckIcon,
    required: true,
    weight: 30,
  },
  {
    step: ProfileStep.PROFESSIONAL,
    title: "Professional Details",
    description: "Work experience and expertise",
    icon: BriefcaseIcon,
    required: false,
    weight: 20,
  },
  {
    step: ProfileStep.EDUCATION,
    title: "Education & Qualifications",
    description: "Academic background and certifications",
    icon: GraduationCapIcon,
    required: false,
    weight: 10,
  },
];

export function ProfileStepper({ userId, initialStep, existingProfile }: ProfileStepperProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ProfileStep>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<ProfileStep>>(
    new Set(existingProfile?.last_completed_section ? getCompletedStepsFromProfile(existingProfile) : [])
  );
  const [message, setMessage] = useState<StatusMessage | null>(null);

  const currentStepIndex = STEP_CONFIG.findIndex((config) => config.step === currentStep);
  const currentStepConfig = STEP_CONFIG[currentStepIndex];

  // Calculate progress
  const totalWeight = STEP_CONFIG.reduce((sum, config) => sum + config.weight, 0);
  const completedWeight = Array.from(completedSteps).reduce((sum, step) => {
    const config = STEP_CONFIG.find((c) => c.step === step);
    return sum + (config?.weight || 0);
  }, 0);
  const progressPercentage = Math.round((completedWeight / totalWeight) * 100);

  const navigateToStep = useCallback((targetStep: ProfileStep) => {
    setCurrentStep(targetStep);
    setMessage(null);

    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set("step", targetStep);
    window.history.replaceState({}, "", url.toString());
  }, []);

  const handleStepComplete = useCallback(
    (step: ProfileStep) => {
      setCompletedSteps((prev) => new Set([...prev, step]));
      setMessage({
        type: StatusMessageType.SUCCESS,
        text: `${getStepTitle(step)} completed successfully!`,
      });

      // Auto-advance to next step if not the last one
      const nextStepIndex = STEP_CONFIG.findIndex((config) => config.step === step) + 1;
      if (nextStepIndex < STEP_CONFIG.length) {
        setTimeout(() => {
          navigateToStep(STEP_CONFIG[nextStepIndex].step);
        }, 1500);
      } else {
        // Profile completed, redirect to profile view
        setTimeout(() => {
          router.push("/profile/view");
        }, 2000);
      }
    },
    [router, navigateToStep]
  );

  const canNavigateToStep = useCallback(
    (targetStep: ProfileStep): boolean => {
      const targetIndex = STEP_CONFIG.findIndex((config) => config.step === targetStep);

      // Always allow navigation to completed steps
      if (completedSteps.has(targetStep)) {
        return true;
      }

      // Allow navigation if all previous required steps are completed
      for (let i = 0; i < targetIndex; i++) {
        const prevConfig = STEP_CONFIG[i];
        if (prevConfig.required && !completedSteps.has(prevConfig.step)) {
          return false;
        }
      }

      return true;
    },
    [completedSteps]
  );

  const renderStepNavigation = () => (
    <Card className='mb-6 shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)] border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-base font-semibold text-primary-900'>Profile Completion</h3>
          <Badge className='bg-gradient-to-r from-primary-100/80 to-accent-100/80 border border-primary-300/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] text-primary-700 font-semibold'>
            {progressPercentage}%
          </Badge>
        </div>

        {/* Neumorphic Progress Bar */}
        <div className='w-full h-3 bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-full shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] mb-6'>
          <div
            className='h-full bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 rounded-full transition-all duration-500 shadow-[2px_2px_6px_rgba(0,0,0,0.2)]'
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Neumorphic Step Cards */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {STEP_CONFIG.map((config, index) => {
            const isActive = config.step === currentStep;
            const isCompleted = completedSteps.has(config.step);
            const StepIcon = config.icon;

            const stepTitles = {
              [ProfileStep.PERSONAL_INFO]: "Personal Info",
              [ProfileStep.VERIFICATION]: "CA Verification",
              [ProfileStep.PROFESSIONAL]: "Professional",
              [ProfileStep.EDUCATION]: "Education",
            };

            return (
              <button
                key={config.step}
                onClick={() => canNavigateToStep(config.step) && navigateToStep(config.step)}
                disabled={!canNavigateToStep(config.step)}
                className={cn(
                  "relative p-4 rounded-xl transition-all duration-500 text-center group overflow-hidden",
                  "hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed",
                  isActive &&
                    cn(
                      "shadow-[inset_4px_4px_12px_rgba(0,0,0,0.15),inset_-4px_-4px_12px_rgba(255,255,255,0.9)]",
                      "border-2 border-primary-400/80 bg-gradient-to-br from-primary-50/80 via-primary-100/40 to-primary-200/60"
                    ),
                  isCompleted &&
                    !isActive &&
                    cn(
                      "shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)]",
                      "border border-accent-300/50 bg-gradient-to-br from-accent-50/60 to-accent-100/40 hover:shadow-[8px_8px_20px_rgba(0,0,0,0.15),-8px_-8px_20px_rgba(255,255,255,0.95)]"
                    ),
                  !isActive &&
                    !isCompleted &&
                    cn(
                      "shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.8)]",
                      "border border-neutral-200/60 bg-gradient-to-br from-neutral-50 to-neutral-100/60 opacity-70",
                      "hover:opacity-90 hover:shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)]"
                    )
                )}
              >
                {/* Background gradient overlay */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-500 rounded-xl",
                    isActive && "opacity-100 bg-gradient-to-br from-primary-100/20 via-transparent to-primary-200/30",
                    isCompleted &&
                      !isActive &&
                      "opacity-60 bg-gradient-to-br from-accent-100/15 via-transparent to-accent-200/25"
                  )}
                />

                {/* Icon with neumorphic styling */}
                <div className='relative z-10 flex flex-col items-center gap-3'>
                  <div
                    className={cn(
                      "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500",
                      isActive &&
                        cn(
                          "shadow-[inset_3px_3px_8px_rgba(0,0,0,0.2),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]",
                          "bg-gradient-to-br from-primary-600 to-primary-700 text-white"
                        ),
                      isCompleted &&
                        !isActive &&
                        cn(
                          "shadow-[3px_3px_8px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.9)]",
                          "bg-gradient-to-br from-accent-500 to-accent-600 text-white"
                        ),
                      !isActive &&
                        !isCompleted &&
                        cn(
                          "shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.8)]",
                          "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-500"
                        )
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <CheckCircleIcon className='h-5 w-5' weight='bold' />
                    ) : (
                      <StepIcon className='h-5 w-5' weight='bold' />
                    )}

                    {/* Glow effect for active/completed */}
                    {(isActive || isCompleted) && (
                      <div
                        className={cn(
                          "absolute inset-0 rounded-xl blur-lg opacity-30",
                          isActive && "bg-primary-600",
                          isCompleted && !isActive && "bg-accent-500"
                        )}
                      />
                    )}
                  </div>

                  {/* Title and description */}
                  <div className='w-full'>
                    <div className='flex items-center justify-center gap-1 mb-1'>
                      <span
                        className={cn(
                          "text-xs font-semibold transition-colors duration-300",
                          isActive && "text-primary-800",
                          isCompleted && !isActive && "text-accent-800",
                          !isActive && !isCompleted && "text-neutral-600"
                        )}
                      >
                        {stepTitles[config.step]}
                      </span>
                      {config.required && <span className='text-xs text-red-500 font-bold'>*</span>}
                    </div>
                    <p
                      className={cn(
                        "text-xs leading-tight transition-colors duration-300",
                        isActive && "text-primary-700 font-medium",
                        isCompleted && !isActive && "text-accent-700",
                        !isActive && !isCompleted && "text-neutral-500"
                      )}
                    >
                      {config.step === ProfileStep.PERSONAL_INFO && "Basic details"}
                      {config.step === ProfileStep.VERIFICATION && "ICAI credentials"}
                      {config.step === ProfileStep.PROFESSIONAL && "Work experience"}
                      {config.step === ProfileStep.EDUCATION && "Academic background"}
                    </p>
                  </div>
                </div>

                {/* Enhanced step number with neumorphic styling */}
                <div
                  className={cn(
                    "absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white z-20",
                    "flex items-center justify-center text-xs font-bold transition-all duration-500",
                    "shadow-[2px_2px_6px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.8)]",
                    isActive && "bg-gradient-to-br from-primary-600 to-primary-700 text-white",
                    isCompleted && !isActive && "bg-gradient-to-br from-accent-500 to-accent-600 text-white",
                    !isActive && !isCompleted && "bg-gradient-to-br from-neutral-300 to-neutral-400 text-neutral-700"
                  )}
                >
                  {index + 1}

                  {/* Ping animation for active step */}
                  {isActive && (
                    <div className='absolute inset-0 rounded-full animate-ping bg-primary-600 opacity-20'></div>
                  )}
                </div>

                {/* Selection indicator line */}
                <div
                  className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500",
                    isActive &&
                      "w-3/4 bg-gradient-to-r from-primary-400/80 via-primary-600 to-primary-400/80 shadow-sm",
                    isCompleted &&
                      !isActive &&
                      "w-2/3 bg-gradient-to-r from-accent-400/80 via-accent-500 to-accent-400/80",
                    !isActive && !isCompleted && "w-0"
                  )}
                />
              </button>
            );
          })}
        </div>
      </CardContent>
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
      case ProfileStep.PROFESSIONAL:
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
    const canGoNext = nextStepIndex < STEP_CONFIG.length && canNavigateToStep(STEP_CONFIG[nextStepIndex].step);

    return (
      <div className='flex items-center justify-between mt-6 pt-6 border-t border-neutral-200'>
        <Button
          variant='outline'
          onClick={() => canGoPrev && navigateToStep(STEP_CONFIG[prevStepIndex].step)}
          disabled={!canGoPrev}
          className='flex items-center gap-2'
        >
          <ArrowLeftIcon className='h-4 w-4' weight='bold' />
          Previous
        </Button>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-neutral-500'>
            Step {currentStepIndex + 1} of {STEP_CONFIG.length}
          </span>
        </div>

        <Button
          variant='outline'
          onClick={() => canGoNext && navigateToStep(STEP_CONFIG[nextStepIndex].step)}
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
      <Card>
        <CardContent className='p-4'>
          <div className='mb-4'>
            <h2 className='text-xl font-bold text-primary-900 mb-1'>{currentStepConfig.title}</h2>
            <p className='text-sm text-neutral-600'>{currentStepConfig.description}</p>
          </div>

          <Separator className='mb-6' />

          {renderStepContent()}

          {renderStepActions()}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function getCompletedStepsFromProfile(profile: Profile): ProfileStep[] {
  const steps: ProfileStep[] = [];

  // Determine completed steps based on profile data
  if (profile.first_name && profile.username && profile.state_id && profile.district_id) {
    steps.push(ProfileStep.PERSONAL_INFO);
  }

  // Add logic for other steps based on profile data
  // This will be expanded as we implement the verification system

  return steps;
}

function getStepTitle(step: ProfileStep): string {
  const config = STEP_CONFIG.find((c) => c.step === step);
  return config?.title || step.replace("_", " ");
}
