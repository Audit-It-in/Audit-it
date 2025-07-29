"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ProfileStep, Profile } from "@/src/types/profile.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { cn } from "@/src/helpers/tailwind.helper";
import {
  BriefcaseIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  WarningIcon,
  ChartLineUpIcon,
  CurrencyDollarIcon,
} from "@phosphor-icons/react";
import { useSaveProfileStep } from "@/src/services/profile.service";

interface ProfessionalStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

const experienceSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  company_name: z.string().min(2, "Company name is required"),
  location: z.string().optional(),
  is_current: z.boolean(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  description: z.string().optional(),
});

const professionalSchema = z
  .object({
    current_firm: z.string().optional(),
    years_of_experience: z.number().min(0, "Years of experience must be 0 or more").optional(),
    practice_areas: z.array(z.string()).optional(),
    professional_achievements: z.string().max(1000, "Achievements must be less than 1000 characters").optional(),
    consultation_fee: z.number().min(0, "Consultation fee must be 0 or more").optional(),
    experiences: z.array(experienceSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.experiences) {
        return data.experiences.every((exp) => exp.is_current || exp.end_date);
      }
      return true;
    },
    {
      message: "End date is required for non-current positions",
      path: ["experiences"],
    }
  );

type ProfessionalFormData = z.infer<typeof professionalSchema>;

export function ProfessionalStep({ userId, onStepComplete, onMessage, existingProfile }: ProfessionalStepProps) {
  const [practiceAreaInput, setPracticeAreaInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      current_firm: "",
      years_of_experience: 0,
      practice_areas: [],
      professional_achievements: "",
      consultation_fee: 0,
      experiences: [
        {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  const watchedPracticeAreas = watch("practice_areas") || [];
  const watchedExperiences = watch("experiences");

  const saveProfileMutation = useSaveProfileStep();

  const onSubmit = async (data: ProfessionalFormData) => {
    try {
      await saveProfileMutation.mutateAsync({
        userId,
        step: ProfileStep.PROFESSIONAL,
        stepData: {
          current_firm: data.current_firm || null,
          years_of_experience: data.years_of_experience || null,
          practice_areas: data.practice_areas || null,
          professional_achievements: data.professional_achievements || null,
          consultation_fee: data.consultation_fee || null,
          work_experiences: data.experiences || null,
        },
      });

      onMessage({
        type: StatusMessageType.SUCCESS,
        text: "Professional details saved successfully!",
      });

      onStepComplete(ProfileStep.PROFESSIONAL);
    } catch (error) {
      onMessage({
        type: StatusMessageType.ERROR,
        text: "Failed to save professional details. Please try again.",
      });
    }
  };

  const addPracticeArea = () => {
    if (practiceAreaInput.trim()) {
      const currentAreas = watchedPracticeAreas;
      if (!currentAreas.includes(practiceAreaInput.trim())) {
        setValue("practice_areas", [...currentAreas, practiceAreaInput.trim()]);
        setPracticeAreaInput("");
      }
    }
  };

  const removePracticeAreaItem = (areaToRemove: string) => {
    setValue(
      "practice_areas",
      watchedPracticeAreas.filter((area) => area !== areaToRemove)
    );
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
      {/* Current Position - Neumorphic Card */}
      <Card className='shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)] border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30 overflow-hidden'>
        <CardContent className='p-6 relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary-100/10 via-transparent to-primary-200/20 opacity-60' />

          <div className='relative z-10'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]'>
                <BriefcaseIcon className='h-5 w-5' weight='bold' />
              </div>
              <h3 className='text-lg font-bold text-primary-900'>Current Practice</h3>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='current_firm' className='text-sm font-medium text-primary-800'>
                  Current Firm/Organization
                </Label>
                <Input
                  id='current_firm'
                  {...register("current_firm")}
                  placeholder='e.g., ABC & Associates'
                  className='h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20'
                />
                <p className='text-xs text-neutral-600'>Where do you currently practice?</p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='years_of_experience' className='text-sm font-medium text-primary-800'>
                  Years of Experience
                </Label>
                <Input
                  id='years_of_experience'
                  type='number'
                  min='0'
                  max='50'
                  {...register("years_of_experience", { valueAsNumber: true })}
                  placeholder='5'
                  className={cn(
                    "h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
                    "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20",
                    errors.years_of_experience && "border-red-400 focus:border-red-400 focus:ring-red-500/20"
                  )}
                />
                {errors.years_of_experience && (
                  <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                    <WarningIcon className='h-3 w-3' />
                    {errors.years_of_experience.message}
                  </p>
                )}
              </div>

              <div className='space-y-2 sm:col-span-2'>
                <Label htmlFor='consultation_fee' className='text-sm font-medium text-primary-800'>
                  Consultation Fee (₹/hour)
                </Label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 font-medium'>₹</span>
                  <Input
                    id='consultation_fee'
                    type='number'
                    min='0'
                    {...register("consultation_fee", { valueAsNumber: true })}
                    placeholder='2000'
                    className='h-11 pl-8 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20'
                  />
                </div>
                <p className='text-xs text-neutral-600'>Optional: Your hourly consultation rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Areas - Neumorphic Card */}
      <Card className='shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)] border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30'>
        <CardContent className='p-6 relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary-100/10 via-transparent to-primary-200/20 opacity-60' />

          <div className='relative z-10'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]'>
                <ChartLineUpIcon className='h-5 w-5' weight='bold' />
              </div>
              <h3 className='text-lg font-bold text-primary-900'>Areas of Practice</h3>
            </div>

            <div className='space-y-4'>
              <div className='flex gap-3'>
                <Input
                  value={practiceAreaInput}
                  onChange={(e) => setPracticeAreaInput(e.target.value)}
                  placeholder='e.g., Corporate Tax, GST Compliance'
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPracticeArea())}
                  className='flex-1 h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20'
                />
                <Button
                  type='button'
                  onClick={addPracticeArea}
                  disabled={!practiceAreaInput.trim()}
                  className='h-11 px-4 shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12),-6px_-6px_16px_rgba(255,255,255,0.9)] bg-primary-600 hover:bg-primary-700'
                >
                  <PlusIcon className='h-4 w-4' weight='bold' />
                </Button>
              </div>

              {watchedPracticeAreas.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {watchedPracticeAreas.map((area, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-primary-50/80 to-primary-100/60 border border-primary-200/60 rounded-lg shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]'
                    >
                      <span className='text-sm font-medium text-primary-800'>{area}</span>
                      <button
                        type='button'
                        onClick={() => removePracticeAreaItem(area)}
                        className='text-red-500 hover:text-red-700 transition-colors'
                      >
                        <TrashIcon className='h-3 w-3' weight='bold' />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className='text-xs text-neutral-600'>Add your key areas of practice or specialization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Experience - Neumorphic Card */}
      <Card className='shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)] border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30'>
        <CardContent className='p-6 relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary-100/10 via-transparent to-primary-200/20 opacity-60' />

          <div className='relative z-10'>
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
                <div
                  key={field.id}
                  className='p-4 rounded-xl bg-gradient-to-br from-neutral-50/80 to-neutral-100/60 border border-neutral-200/60 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]'
                >
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
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium text-primary-800'>Job Title *</Label>
                      <Input
                        {...register(`experiences.${index}.title`)}
                        placeholder='e.g., Senior Chartered Accountant'
                        className={cn(
                          "h-10 bg-white border-neutral-300 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-1 focus:ring-primary-500/20",
                          errors.experiences?.[index]?.title && "border-red-400 focus:border-red-400"
                        )}
                      />
                      {errors.experiences?.[index]?.title && (
                        <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                          <WarningIcon className='h-3 w-3' />
                          {errors.experiences[index]?.title?.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-sm font-medium text-primary-800'>Company *</Label>
                      <Input
                        {...register(`experiences.${index}.company_name`)}
                        placeholder='e.g., XYZ Chartered Accountants'
                        className={cn(
                          "h-10 bg-white border-neutral-300 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-1 focus:ring-primary-500/20",
                          errors.experiences?.[index]?.company_name && "border-red-400 focus:border-red-400"
                        )}
                      />
                      {errors.experiences?.[index]?.company_name && (
                        <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                          <WarningIcon className='h-3 w-3' />
                          {errors.experiences[index]?.company_name?.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-sm font-medium text-primary-800'>Location</Label>
                      <Input
                        {...register(`experiences.${index}.location`)}
                        placeholder='e.g., Mumbai, Maharashtra'
                        className='h-10 bg-white border-neutral-300 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-1 focus:ring-primary-500/20'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-sm font-medium text-primary-800'>Start Date *</Label>
                      <Input
                        type='month'
                        {...register(`experiences.${index}.start_date`)}
                        className={cn(
                          "h-10 bg-white border-neutral-300 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-1 focus:ring-primary-500/20",
                          errors.experiences?.[index]?.start_date && "border-red-400 focus:border-red-400"
                        )}
                      />
                      {errors.experiences?.[index]?.start_date && (
                        <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                          <WarningIcon className='h-3 w-3' />
                          {errors.experiences[index]?.start_date?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='mt-4 space-y-3'>
                    <div className='flex items-center gap-3 h-10 px-3 bg-white border border-neutral-300 rounded-lg shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]'>
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
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium text-primary-800'>End Date</Label>
                        <Input
                          type='month'
                          {...register(`experiences.${index}.end_date`)}
                          className={cn(
                            "h-10 bg-white border-neutral-300 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-1 focus:ring-primary-500/20",
                            errors.experiences?.[index]?.end_date && "border-red-400 focus:border-red-400"
                          )}
                        />
                        {errors.experiences?.[index]?.end_date && (
                          <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                            <WarningIcon className='h-3 w-3' />
                            {errors.experiences[index]?.end_date?.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className='space-y-2'>
                      <Label className='text-sm font-medium text-primary-800'>Description</Label>
                      <Textarea
                        {...register(`experiences.${index}.description`)}
                        placeholder='Describe your key responsibilities and achievements...'
                        className='min-h-[80px] resize-none bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20'
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Achievements - Neumorphic Card */}
      <Card className='shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)] border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30'>
        <CardContent className='p-6 relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary-100/10 via-transparent to-primary-200/20 opacity-60' />

          <div className='relative z-10'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]'>
                <CurrencyDollarIcon className='h-5 w-5' weight='bold' />
              </div>
              <h3 className='text-lg font-bold text-primary-900'>Professional Achievements</h3>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='professional_achievements' className='text-sm font-medium text-primary-800'>
                Achievements & Recognition
              </Label>
              <Textarea
                id='professional_achievements'
                {...register("professional_achievements")}
                placeholder='Describe your key achievements, awards, recognitions, or notable projects...'
                className='min-h-[120px] resize-none bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20'
              />
              <div className='flex items-center justify-between'>
                <p className='text-xs text-neutral-600'>Optional: Highlight your professional accomplishments</p>
                <span className='text-xs text-neutral-500 font-medium'>
                  {watch("professional_achievements")?.length || 0}/1000 characters
                </span>
              </div>
              {errors.professional_achievements && (
                <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                  <WarningIcon className='h-3 w-3' />
                  {errors.professional_achievements.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button - Neumorphic Design */}
      <div className='relative'>
        <Button
          type='submit'
          disabled={isSubmitting}
          className={cn(
            "w-full h-12 font-semibold text-white transition-all duration-300",
            "bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600",
            "shadow-[4px_4px_12px_rgba(0,0,0,0.15),-2px_-2px_8px_rgba(255,255,255,0.1)]",
            "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.2),-3px_-3px_10px_rgba(255,255,255,0.15)]",
            "hover:scale-[1.02] active:scale-[0.98]",
            "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          {isSubmitting ? (
            <div className='flex items-center gap-3'>
              <InlineLoader action={LoadingAction.SAVING} size={SpinnerSize.SMALL} />
              <span>Saving professional details...</span>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <CheckCircleIcon className='h-5 w-5' weight='bold' />
              <span>Save & Continue to Education</span>
            </div>
          )}
        </Button>

        {/* Glow effect */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg blur-lg opacity-20 -z-10' />
      </div>
    </form>
  );
}
