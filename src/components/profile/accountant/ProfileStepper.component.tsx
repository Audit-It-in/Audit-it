"use client";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { EducationStep } from "./EducationStep.component";
import { PersonalInfoStep } from "./PersonalInfoStep.component";
import { ProfessionalStep } from "./ProfessionalStep.component";
import { Profile, ProfileStep } from "@/src/types/profile.type";
import { Progress } from "@/src/components/ui/progress";
import { Separator } from "@/src/components/ui/separator";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { StatusMessage as StatusMessageComponent } from "@/src/components/common/StatusMessage.component";
import { StepCard } from "@/src/components/ui/step-card";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { VerificationStep } from "./VerificationStep.component";
import {
  UserIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";

// Step components (to be created)

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
    <Card className='mb-6' variant='default' size='default'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-base font-semibold text-primary-900'>Profile Completion</h3>
        <Badge variant='default'>{progressPercentage}%</Badge>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercentage} variant='default' size='default' fillVariant='primary' className='mb-6' />

      {/* Step Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {STEP_CONFIG.map((config, index) => (
          <StepCard
            key={config.step}
            stepNumber={index + 1}
            title={getStepTitle(config.step)}
            description={getStepDescription(config.step)}
            icon={config.icon}
            required={config.required}
            completed={completedSteps.has(config.step)}
            active={config.step === currentStep}
            clickable={canNavigateToStep(config.step)}
            onClick={() => navigateToStep(config.step)}
          />
        ))}
      </div>
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
      <Card variant='default' size='default'>
        <div className='mb-4'>
          <h2 className='text-xl font-bold text-primary-900 mb-1'>{currentStepConfig.title}</h2>
          <p className='text-sm text-neutral-600'>{currentStepConfig.description}</p>
        </div>

        <Separator className='mb-6' />

        {renderStepContent()}

        {renderStepActions()}
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
  const stepTitles = {
    [ProfileStep.PERSONAL_INFO]: "Personal Info",
    [ProfileStep.VERIFICATION]: "CA Verification",
    [ProfileStep.PROFESSIONAL]: "Professional",
    [ProfileStep.EDUCATION]: "Education",
  };
  return stepTitles[step] || step.replace("_", " ");
}

function getStepDescription(step: ProfileStep): string {
  const stepDescriptions = {
    [ProfileStep.PERSONAL_INFO]: "Basic details",
    [ProfileStep.VERIFICATION]: "ICAI credentials",
    [ProfileStep.PROFESSIONAL]: "Work experience",
    [ProfileStep.EDUCATION]: "Academic background",
  };
  return stepDescriptions[step] || "";
}
