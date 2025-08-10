"use client";
import { SaveContinueButton } from "./SaveContinueButton.component";
import { experienceListSchema } from "@/src/helpers/profile-validation.helper";
import { z } from "zod";
import { Profile, ProfileStep } from "@/src/types/profile.type";
import { ProfileFormField } from "../shared/ProfileFormField.component";
import { ProfileFormSection } from "../shared/ProfileFormSection.component";
import { StatusMessage } from "@/src/types/common.type";
import { useForm, useWatch } from "react-hook-form";
import { useProfileFormState } from "@/src/hooks/useProfileFormState";
import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
// Removed per-experience Card to simplify visuals
import { deleteExperience, saveExperience, useExperiences } from "@/src/services/profile.service";
import { DateRangeFields } from "@/src/components/profile/shared/DateRangeFields.component";
import { Separator } from "@/src/components/ui/separator";
import { Checkbox } from "@/src/components/ui/checkbox";
import { cn } from "@/src/helpers/tailwind.helper";
import { ArrayRowActions } from "@/src/components/profile/shared/ArrayRowActions.component";
import { useArrayForm } from "@/src/hooks/useArrayForm";

interface ProfessionalStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

type ExperienceListFormInput = z.input<typeof experienceListSchema>;

export function ProfessionalStep({ userId, onStepComplete, onMessage, existingProfile }: ProfessionalStepProps) {
  const {
    isSubmitting,
    withSubmitting,
    handleSubmit: handleFormSubmit,
    showSuccess,
    showError,
  } = useProfileFormState({
    userId,
    step: ProfileStep.EXPERIENCE,
    onStepComplete,
    onMessage,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExperienceListFormInput>({
    resolver: zodResolver(experienceListSchema),
    defaultValues: {
      experiences: [
        {
          id: undefined,
          title: "",
          company_name: "",
          location: "",
          is_current: false,
          start_date: "",
          end_date: "",
          description: "",
        },
      ],
    },
  });

  const { fields, appendEmpty, removeAt, saveAll } = useArrayForm<{
    id?: string;
    title: string;
    company_name: string;
    location?: string;
    is_current?: boolean;
    start_date: string;
    end_date?: string;
    description?: string;
  }>({
    control,
    name: "experiences",
    defaultItem: {
      title: "",
      company_name: "",
      location: "",
      is_current: false,
      start_date: "",
      end_date: "",
      description: "",
    },
  });
  const watchedExperiences = useWatch({ control, name: "experiences" });

  const { data: existingExperiences } = useExperiences(existingProfile?.id);
  useEffect(() => {
    if (existingExperiences && existingExperiences.length > 0) {
      reset({
        experiences: existingExperiences.map((e) => ({
          id: e.id,
          title: e.title || "",
          company_name: e.company_name || "",
          location: e.location || "",
          is_current: !!e.is_current,
          start_date: e.start_date || "",
          end_date: e.end_date || "",
          description: e.description || "",
        })),
      });
    }
  }, [existingExperiences, reset]);

  const onSubmit = async (data: ExperienceListFormInput) => {
    await withSubmitting(async () => {
      try {
        if (!existingProfile?.id) {
          throw new Error("Profile not found");
        }

        await saveAll(data.experiences, async (exp) =>
          saveExperience({
            id: exp.id!,
            profile_id: existingProfile.id,
            title: exp.title,
            company_name: exp.company_name,
            location: exp.location,
            is_current: !!exp.is_current,
            start_date: exp.start_date,
            end_date: exp.end_date,
            description: exp.description,
          })
        );

        await handleFormSubmit({});
        showSuccess("Experiences saved successfully!");
      } catch (err) {
        showError(err instanceof Error ? err.message : "Failed to save experiences");
      }
    });
  };

  const handleDelete = async (index: number) => {
    try {
      const field = fields[index] as unknown as { id?: string };
      if (field?.id && existingProfile?.id) {
        await deleteExperience(field.id, existingProfile.id);
      }
      removeAt(index);
      showSuccess("Experience removed");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to remove experience");
    }
  };

  const handleAdd = () => appendEmpty();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <ProfileFormSection title='Professional Experience' icon={BriefcaseIcon} variant='default'>
        <div className='space-y-2'>
          {errors.experiences?.message && (
            <p className='text-xs text-red-500 font-medium px-1'>{errors.experiences.message as string}</p>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className='py-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <ProfileFormField
                  label='Job Title'
                  placeholder='e.g., Senior Associate'
                  error={errors.experiences?.[index]?.title?.message}
                  {...register(`experiences.${index}.title` as const)}
                />

                <ProfileFormField
                  label='Company/Firm'
                  placeholder='e.g., ABC & Associates'
                  error={errors.experiences?.[index]?.company_name?.message}
                  {...register(`experiences.${index}.company_name` as const)}
                />

                <ProfileFormField
                  label='Location'
                  placeholder='City, State'
                  error={errors.experiences?.[index]?.location?.message}
                  {...register(`experiences.${index}.location` as const)}
                />

                <DateRangeFields
                  control={control}
                  startName={`experiences.${index}.start_date` as const}
                  endName={`experiences.${index}.end_date` as const}
                  startError={errors.experiences?.[index]?.start_date?.message as string | undefined}
                  endError={errors.experiences?.[index]?.end_date?.message as string | undefined}
                  disableEnd={!!watchedExperiences?.[index]?.is_current}
                />

                <div className='sm:col-span-2'>
                  <label
                    htmlFor={`is_current_${index}`}
                    className='flex items-center gap-3 text-sm font-medium text-primary-800'
                  >
                    <Checkbox
                      id={`is_current_${index}`}
                      checked={!!watchedExperiences?.[index]?.is_current}
                      onCheckedChange={(checked) => {
                        const c = Boolean(checked);
                        if (c && Array.isArray(watchedExperiences)) {
                          watchedExperiences.forEach((_, i) => {
                            if (i !== index) setValue(`experiences.${i}.is_current`, false);
                          });
                        }
                        setValue(`experiences.${index}.is_current`, c);
                        if (c) setValue(`experiences.${index}.end_date`, "");
                      }}
                    />
                    <span className={cn("select-none")}>Currently working here</span>
                  </label>
                </div>

                <ProfileFormField
                  label='Description'
                  type='textarea'
                  placeholder='Briefly describe your role and responsibilities'
                  error={errors.experiences?.[index]?.description?.message}
                  className='sm:col-span-2'
                  {...register(`experiences.${index}.description` as const)}
                />

                <ArrayRowActions
                  canAdd={index === fields.length - 1}
                  onAdd={handleAdd}
                  onRemove={() => handleDelete(index)}
                />
              </div>
              {index < fields.length - 1 && <Separator className='mt-6' />}
            </div>
          ))}
        </div>
      </ProfileFormSection>

      <SaveContinueButton
        isSubmitting={isSubmitting}
        submittingText='Saving experiences...'
        submitText='Save & Continue to Education'
      />
    </form>
  );
}
