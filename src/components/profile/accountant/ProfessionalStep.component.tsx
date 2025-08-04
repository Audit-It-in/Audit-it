"use client";
import { DynamicArrayField } from "../shared/DynamicArrayField.component";
import { SaveContinueButton } from "./SaveContinueButton.component";
import { ProfessionalFormData, professionalSchema, ProfileDefaults } from "@/src/helpers/profile-validation.helper";
import { Profile, ProfileStep } from "@/src/types/profile.type";
import { ProfileFormField } from "../shared/ProfileFormField.component";
import { ProfileFormSection } from "../shared/ProfileFormSection.component";
import { StatusMessage } from "@/src/types/common.type";
import { useForm } from "react-hook-form";
import { useProfileFormState } from "@/src/hooks/useProfileFormState";
import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseIcon, ChartLineUpIcon, CurrencyDollarIcon } from "@phosphor-icons/react";

interface ProfessionalStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

export function ProfessionalStep({ userId, onStepComplete, onMessage }: ProfessionalStepProps) {
  const {
    isSubmitting,
    handleSubmit: handleFormSubmit,
    showSuccess,
  } = useProfileFormState({
    userId,
    step: ProfileStep.EXPERIENCE,
    onStepComplete,
    onMessage,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: ProfileDefaults.professional,
  });

  const watchedPracticeAreas = watch("practice_areas") || [];

  const onSubmit = async (data: ProfessionalFormData) => {
    const stepData = {
      current_firm: data.current_firm || null,
      years_of_experience: data.years_of_experience || null,
      practice_areas: data.practice_areas || null,
      professional_achievements: data.professional_achievements || null,
      consultation_fee: data.consultation_fee || null,
    };

    await handleFormSubmit(stepData);
    showSuccess("Professional details saved successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Current Position */}
      <ProfileFormSection title='Current Practice' icon={BriefcaseIcon}>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <ProfileFormField
            label='Current Firm/Organization'
            placeholder='e.g., ABC & Associates'
            description='Where do you currently practice?'
            {...register("current_firm")}
          />

          <ProfileFormField
            label='Years of Experience'
            type='number'
            min={0}
            max={50}
            placeholder='5'
            error={errors.years_of_experience?.message}
            {...register("years_of_experience", { valueAsNumber: true })}
          />

          <div className='space-y-2 sm:col-span-2'>
            <ProfileFormField
              label='Consultation Fee (₹/hour)'
              type='number'
              min={0}
              placeholder='2000'
              description='Optional: Your hourly consultation rate'
              className='[&_input]:pl-8'
              {...register("consultation_fee", { valueAsNumber: true })}
            >
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 font-medium z-10'>₹</span>
                <input
                  type='number'
                  min='0'
                  {...register("consultation_fee", { valueAsNumber: true })}
                  placeholder='2000'
                  className='w-full h-10 pl-8 pr-4 bg-white border border-neutral-300 rounded-lg shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-1 focus:ring-primary-500/20'
                />
              </div>
            </ProfileFormField>
          </div>
        </div>
      </ProfileFormSection>

      {/* Practice Areas */}
      <ProfileFormSection title='Areas of Practice' icon={ChartLineUpIcon}>
        <DynamicArrayField
          value={watchedPracticeAreas}
          onChange={(newAreas) => setValue("practice_areas", newAreas)}
          placeholder='e.g., Corporate Tax, GST Compliance'
          description='Add your key areas of practice or specialization'
        />
      </ProfileFormSection>

      {/* Professional Achievements */}
      <ProfileFormSection title='Professional Achievements' icon={CurrencyDollarIcon}>
        <ProfileFormField
          label='Achievements & Recognition'
          type='textarea'
          placeholder='Describe your key achievements, awards, recognitions, or notable projects...'
          description='Optional: Highlight your professional accomplishments'
          error={errors.professional_achievements?.message}
          {...register("professional_achievements")}
        />
        <div className='flex justify-end'>
          <span className='text-xs text-neutral-500 font-medium'>
            {watch("professional_achievements")?.length || 0}/1000 characters
          </span>
        </div>
      </ProfileFormSection>

      {/* Submit Button */}
      <SaveContinueButton
        isSubmitting={isSubmitting}
        submittingText='Saving professional details...'
        submitText='Save & Continue to Education'
      />
    </form>
  );
}
