"use client";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { DynamicArrayField } from "../shared/DynamicArrayField.component";
import { FormSubmitButton } from "../shared/FormSubmitButton.component";
import { ProfessionalFormData, professionalSchema, ProfileDefaults } from "@/src/helpers/profile-validation.helper";
import { Profile, ProfileStep } from "@/src/types/profile.type";
import { ProfileFormField } from "../shared/ProfileFormField.component";
import { ProfileFormSection } from "../shared/ProfileFormSection.component";
import { StatusMessage } from "@/src/types/common.type";
import { useFieldArray, useForm } from "react-hook-form";
import { useProfileFormState } from "@/src/hooks/useProfileFormState";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  ChartLineUpIcon,
  CurrencyDollarIcon,
} from "@phosphor-icons/react";

interface ProfessionalStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

export function ProfessionalStep({ userId, onStepComplete, onMessage, existingProfile }: ProfessionalStepProps) {
  const {
    isSubmitting,
    handleSubmit: handleFormSubmit,
    showSuccess,
  } = useProfileFormState({
    userId,
    step: ProfileStep.PROFESSIONAL,
    onStepComplete,
    onMessage,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: ProfileDefaults.professional,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  const watchedPracticeAreas = watch("practice_areas") || [];
  const watchedExperiences = watch("experiences");

  const onSubmit = async (data: ProfessionalFormData) => {
    const stepData = {
      current_firm: data.current_firm || null,
      years_of_experience: data.years_of_experience || null,
      practice_areas: data.practice_areas || null,
      professional_achievements: data.professional_achievements || null,
      consultation_fee: data.consultation_fee || null,
      work_experiences: data.experiences || null,
    };

    await handleFormSubmit(stepData);
    showSuccess("Professional details saved successfully!");
  };

  const addExperience = () => {
    append({
      title: "",
      company_name: "",
      location: "",
      is_current: false,
      start_date: "",
      end_date: "",
      description: "",
    });
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

      {/* Work Experience */}
      <Card variant='default' size='default' overlay='primary'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]'>
              <ClockIcon className='h-5 w-5' weight='bold' />
            </div>
            <h3 className='text-lg font-bold text-primary-900'>Work Experience</h3>
          </div>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addExperience}
            className='shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12),-6px_-6px_16px_rgba(255,255,255,0.9)] border-primary-300 text-primary-700 hover:bg-primary-50'
          >
            <PlusIcon className='h-4 w-4 mr-2' weight='bold' />
            Add Experience
          </Button>
        </div>

        <div className='space-y-4'>
          {fields.map((field, index) => (
            <Card key={field.id} variant='inset' size='default'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='text-sm font-semibold text-primary-800'>Experience {index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => remove(index)}
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                  >
                    <TrashIcon className='h-4 w-4' weight='bold' />
                  </Button>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <ProfileFormField
                  label='Job Title'
                  required
                  placeholder='e.g., Senior Chartered Accountant'
                  error={errors.experiences?.[index]?.title?.message}
                  {...register(`experiences.${index}.title`)}
                />

                <ProfileFormField
                  label='Company'
                  required
                  placeholder='e.g., XYZ Chartered Accountants'
                  error={errors.experiences?.[index]?.company_name?.message}
                  {...register(`experiences.${index}.company_name`)}
                />

                <ProfileFormField
                  label='Location'
                  placeholder='e.g., Mumbai, Maharashtra'
                  {...register(`experiences.${index}.location`)}
                />

                <ProfileFormField
                  label='Start Date'
                  type='month'
                  required
                  error={errors.experiences?.[index]?.start_date?.message}
                  {...register(`experiences.${index}.start_date`)}
                />
              </div>

              <div className='mt-4 space-y-3'>
                <div className='flex items-center gap-3 h-10 px-3 bg-white border border-neutral-300 rounded-lg'>
                  <Checkbox
                    checked={watchedExperiences?.[index]?.is_current || false}
                    onCheckedChange={(checked) => {
                      setValue(`experiences.${index}.is_current`, !!checked);
                      if (checked) {
                        setValue(`experiences.${index}.end_date`, "");
                      }
                    }}
                    className='data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600'
                  />
                  <span className='text-sm text-neutral-700 font-medium'>I currently work here</span>
                </div>

                {!watchedExperiences?.[index]?.is_current && (
                  <ProfileFormField
                    label='End Date'
                    type='month'
                    error={errors.experiences?.[index]?.end_date?.message}
                    {...register(`experiences.${index}.end_date`)}
                  />
                )}

                <ProfileFormField
                  label='Description'
                  type='textarea'
                  placeholder='Describe your key responsibilities and achievements...'
                  {...register(`experiences.${index}.description`)}
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>

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
      <FormSubmitButton
        isSubmitting={isSubmitting}
        submittingText='Saving professional details...'
        submitText='Save & Continue to Education'
      />
    </form>
  );
}
