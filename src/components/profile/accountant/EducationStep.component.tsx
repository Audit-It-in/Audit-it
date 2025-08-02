"use client";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { CertificateIcon, CheckCircleIcon, GraduationCapIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { DynamicArrayField } from "../shared/DynamicArrayField.component";
import { EducationFormData, educationSchema, ProfileDefaults } from "@/src/helpers/profile-validation.helper";
import { FormSubmitButton } from "../shared/FormSubmitButton.component";
import { Profile, ProfileStep } from "@/src/types/profile.type";
import { ProfileFormField } from "../shared/ProfileFormField.component";
import { ProfileFormSection } from "../shared/ProfileFormSection.component";
import { StatusMessage } from "@/src/types/common.type";
import { useFieldArray, useForm } from "react-hook-form";
import { useProfileFormState } from "@/src/hooks/useProfileFormState";
import { zodResolver } from "@hookform/resolvers/zod";

interface EducationStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

export function EducationStep({ userId, onStepComplete, onMessage, existingProfile }: EducationStepProps) {
  const { isSubmitting, handleSubmit: handleFormSubmit } = useProfileFormState({
    userId,
    step: ProfileStep.EDUCATION,
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
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: ProfileDefaults.education,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "other_qualifications",
  });

  const watchedCertifications = watch("certifications") || [];
  const watchedMemberships = watch("professional_memberships") || [];

  const addEducation = () => {
    append({
      institute_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      grade: "",
      description: "",
    });
  };

  const onSubmit = async (data: EducationFormData) => {
    const stepData = {
      ca_qualification: data.ca_qualification,
      other_qualifications: data.other_qualifications?.filter((edu) => edu.institute_name && edu.degree) || [],
      certifications: data.certifications || [],
      professional_memberships: data.professional_memberships || [],
    };

    await handleFormSubmit(stepData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      {/* CA Qualification */}
      <ProfileFormSection title='CA Qualification' icon={GraduationCapIcon}>
        <Card className='border-primary-200 bg-primary-50/50'>
          <div className='flex items-center gap-2 mb-4'>
            <h4 className='text-lg font-semibold text-primary-900'>Required Qualification</h4>
            <Badge className='bg-accent-100 text-accent-900 border-accent-200'>Required</Badge>
          </div>

          <div className='bg-white rounded-lg p-4 border border-primary-200'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <ProfileFormField
                label='Institute'
                required
                placeholder='ICAI'
                error={errors.ca_qualification?.institute_name?.message}
                {...register("ca_qualification.institute_name")}
              />

              <ProfileFormField
                label='Completion Year'
                type='number'
                required
                min={1980}
                max={new Date().getFullYear()}
                error={errors.ca_qualification?.completion_year?.message}
                {...register("ca_qualification.completion_year", { valueAsNumber: true })}
              />

              <ProfileFormField
                label='Rank/Position'
                placeholder='e.g., All India Rank 50, First Class'
                description='If you achieved any notable rank or distinction'
                className='sm:col-span-2'
                {...register("ca_qualification.rank")}
              />
            </div>
          </div>
        </Card>
      </ProfileFormSection>

      {/* Other Qualifications */}
      <ProfileFormSection title='Other Qualifications' icon={GraduationCapIcon}>
        <div className='flex items-center justify-between mb-4'>
          <h4 className='text-md font-medium text-primary-800'>Additional Education</h4>
          <Button type='button' variant='outline' size='sm' onClick={addEducation}>
            <PlusIcon className='h-4 w-4 mr-2' weight='bold' />
            Add Education
          </Button>
        </div>

        <div className='space-y-6'>
          {fields.map((field, index) => (
            <Card key={field.id} variant='inset' size='sm'>
              <div className='flex items-center justify-between mb-4'>
                <h5 className='text-md font-medium text-primary-800'>Education {index + 1}</h5>
                {fields.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => remove(index)}
                    className='text-destructive hover:text-destructive'
                  >
                    <TrashIcon className='h-4 w-4' weight='bold' />
                  </Button>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <ProfileFormField
                  label='Institute/University'
                  placeholder='e.g., Mumbai University'
                  error={errors.other_qualifications?.[index]?.institute_name?.message}
                  {...register(`other_qualifications.${index}.institute_name`)}
                />

                <ProfileFormField
                  label='Degree'
                  placeholder='e.g., Bachelor of Commerce, MBA'
                  error={errors.other_qualifications?.[index]?.degree?.message}
                  {...register(`other_qualifications.${index}.degree`)}
                />

                <ProfileFormField
                  label='Field of Study'
                  placeholder='e.g., Accounting & Finance'
                  {...register(`other_qualifications.${index}.field_of_study`)}
                />

                <ProfileFormField
                  label='Grade/CGPA'
                  placeholder='e.g., First Class, 8.5 CGPA'
                  {...register(`other_qualifications.${index}.grade`)}
                />

                <ProfileFormField
                  label='Start Date'
                  type='month'
                  {...register(`other_qualifications.${index}.start_date`)}
                />

                <ProfileFormField
                  label='End Date'
                  type='month'
                  {...register(`other_qualifications.${index}.end_date`)}
                />
              </div>

              <div className='mt-4'>
                <ProfileFormField
                  label='Description'
                  type='textarea'
                  placeholder='Describe relevant coursework, projects, or achievements...'
                  {...register(`other_qualifications.${index}.description`)}
                />
              </div>
            </Card>
          ))}
        </div>
      </ProfileFormSection>

      {/* Certifications */}
      <ProfileFormSection title='Certifications' icon={CertificateIcon}>
        <DynamicArrayField
          value={watchedCertifications}
          onChange={(newCerts) => setValue("certifications", newCerts)}
          placeholder='e.g., CPA, CFA, FRM, ACCA'
          description="Add professional certifications and courses you've completed"
        />
      </ProfileFormSection>

      {/* Professional Memberships */}
      <ProfileFormSection title='Professional Memberships' icon={CheckCircleIcon}>
        <DynamicArrayField
          value={watchedMemberships}
          onChange={(newMemberships) => setValue("professional_memberships", newMemberships)}
          placeholder='e.g., Institute of Cost Accountants, IIA'
          description='Add memberships to professional institutes and organizations'
        />
      </ProfileFormSection>

      {/* Completion Notice */}
      <Card className='border-accent-200 bg-accent-50'>
        <div className='flex items-start gap-3'>
          <CheckCircleIcon className='h-5 w-5 text-accent-600 mt-0.5' weight='bold' />
          <div>
            <h4 className='text-sm font-medium text-accent-900 mb-1'>Profile Completion</h4>
            <p className='text-sm text-accent-800'>
              Congratulations! You're completing your CA profile. After submitting this step, your profile will be ready
              and you can start receiving client inquiries.
            </p>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <FormSubmitButton
        isSubmitting={isSubmitting}
        submittingText='Completing Profile...'
        submitText='Complete Profile Setup'
      />
    </form>
  );
}
