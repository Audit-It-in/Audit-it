"use client";
import { Button } from "@/src/components/ui/button";
import { GraduationCapIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import {
  educationListSchema,
  EducationListFormData,
  educationSchema,
  ProfileDefaults,
} from "@/src/helpers/profile-validation.helper";
import { SaveContinueButton } from "./SaveContinueButton.component";
import { Profile, ProfileStep } from "@/src/types/profile.type";
import { ProfileFormField } from "../shared/ProfileFormField.component";
import { ProfileFormSection } from "../shared/ProfileFormSection.component";
import { StatusMessage } from "@/src/types/common.type";
import { deleteEducation, saveEducation, useEducations } from "@/src/services/profile.service";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useProfileFormState } from "@/src/hooks/useProfileFormState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { DatePicker } from "@/src/components/ui/date-picker";
import { Separator } from "@/src/components/ui/separator";
import { z } from "zod";

interface EducationStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

export function EducationStep({ userId, onStepComplete, onMessage, existingProfile }: EducationStepProps) {
  const {
    isSubmitting,
    handleSubmit: handleFormSubmit,
    showError,
    showSuccess,
  } = useProfileFormState({
    userId,
    step: ProfileStep.EDUCATION,
    onStepComplete,
    onMessage,
  });

  // Fetch existing education data (all)
  const { data: existingEducations } = useEducations(existingProfile?.id);

  type EducationFormRow = z.infer<typeof educationSchema>;
  type EducationListFormInput = { educations: EducationFormRow[] };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationListFormInput>({
    resolver: zodResolver(educationListSchema),
    defaultValues: {
      educations: [{ ...ProfileDefaults.education } as EducationFormRow],
    },
  });

  const { fields, append, remove } = useFieldArray({ name: "educations", control });

  // Load existing education data into form
  useEffect(() => {
    if (existingEducations && existingEducations.length > 0) {
      reset({
        educations: existingEducations.map((e) => ({
          id: e.id,
          institute_name: e.institute_name || "",
          degree: e.degree || "",
          field_of_study: e.field_of_study || "",
          start_date: e.start_date || "",
          end_date: e.end_date || "",
          grade: e.grade || "",
          description: e.description || "",
        })),
      });
    }
  }, [existingEducations, reset]);

  const onSubmit = async (data: EducationListFormInput) => {
    try {
      // Save each education row
      for (const ed of data.educations) {
        await saveEducation({
          id: ed.id,
          profile_id: existingProfile?.id as string,
          institute_name: ed.institute_name,
          degree: ed.degree,
          field_of_study: ed.field_of_study,
          start_date: ed.start_date,
          end_date: ed.end_date,
          grade: ed.grade,
          description: ed.description,
        } as any);
      }

      await handleFormSubmit({});
      showSuccess("Education saved successfully!");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save education");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <ProfileFormSection title='Education' icon={GraduationCapIcon}>
        <div className='space-y-2'>
          {fields.map((field, index) => (
            <div key={field.id} className='py-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <ProfileFormField
                  label='Institute Name'
                  required
                  placeholder='Institute of Chartered Accountants of India (ICAI)'
                  error={(errors as any)?.educations?.[index]?.institute_name?.message}
                  {...register(`educations.${index}.institute_name` as const)}
                />

                <ProfileFormField
                  label='Degree'
                  placeholder='Chartered Accountant / B.Com / M.Com / etc.'
                  error={(errors as any)?.educations?.[index]?.degree?.message}
                  {...register(`educations.${index}.degree` as const)}
                />

                <ProfileFormField
                  label='Field of Study'
                  placeholder='Accounting and Finance'
                  error={(errors as any)?.educations?.[index]?.field_of_study?.message}
                  {...register(`educations.${index}.field_of_study` as const)}
                />

                <ProfileFormField
                  label='Grade/Rank'
                  placeholder='e.g., All India Rank 50, First Class'
                  error={(errors as any)?.educations?.[index]?.grade?.message}
                  {...register(`educations.${index}.grade` as const)}
                />

                <Controller
                  control={control}
                  name={`educations.${index}.start_date` as const}
                  render={({ field }) => (
                    <ProfileFormField
                      label='Start Date'
                      error={(errors as any)?.educations?.[index]?.start_date?.message}
                    >
                      <DatePicker value={field.value} onChange={field.onChange} placeholder='dd/mm/yyyy' />
                    </ProfileFormField>
                  )}
                />

                <Controller
                  control={control}
                  name={`educations.${index}.end_date` as const}
                  render={({ field }) => (
                    <ProfileFormField label='End Date' error={(errors as any)?.educations?.[index]?.end_date?.message}>
                      <DatePicker value={field.value} onChange={field.onChange} placeholder='dd/mm/yyyy' />
                    </ProfileFormField>
                  )}
                />

                <ProfileFormField
                  label='Description'
                  placeholder='Additional details about your education'
                  className='sm:col-span-2'
                  error={(errors as any)?.educations?.[index]?.description?.message}
                  {...register(`educations.${index}.description` as const)}
                />

                <div className='flex items-center justify-between gap-3 sm:col-span-2'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='text-red-600 hover:bg-red-50'
                    onClick={async () => {
                      const id = (fields[index] as unknown as { id?: string }).id;
                      if (id && existingProfile?.id) await deleteEducation(id, existingProfile.id);
                      remove(index);
                    }}
                  >
                    <TrashIcon className='h-4 w-4' weight='bold' />
                    Remove
                  </Button>
                  {index === fields.length - 1 && (
                    <Button type='button' variant='outline' onClick={() => append({ ...ProfileDefaults.education })}>
                      <PlusIcon className='h-4 w-4' weight='bold' />
                      Add another education
                    </Button>
                  )}
                </div>
              </div>
              {index < fields.length - 1 && <Separator className='mt-6' />}
            </div>
          ))}
        </div>
      </ProfileFormSection>

      <SaveContinueButton isSubmitting={isSubmitting} submittingText='Saving education...' submitText='Save & Finish' />
    </form>
  );
}
