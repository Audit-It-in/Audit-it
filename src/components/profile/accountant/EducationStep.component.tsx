"use client";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { CertificateIcon, CheckCircleIcon, GraduationCapIcon } from "@phosphor-icons/react";
import { DynamicArrayField } from "../shared/DynamicArrayField.component";
import { EducationFormData, educationSchema, ProfileDefaults } from "@/src/helpers/profile-validation.helper";
import { SaveContinueButton } from "./SaveContinueButton.component";
import { Profile, ProfileStep } from "@/src/types/profile.type";
import { ProfileFormField } from "../shared/ProfileFormField.component";
import { ProfileFormSection } from "../shared/ProfileFormSection.component";
import { StatusMessage } from "@/src/types/common.type";
import { useEducation } from "@/src/services/profile.service";
import { useForm } from "react-hook-form";
import { useProfileFormState } from "@/src/hooks/useProfileFormState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

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

  // Fetch existing education data
  const { data: existingEducation } = useEducation(existingProfile?.id);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: ProfileDefaults.education,
  });

  const watchedCertifications = watch("certifications") || [];
  const watchedMemberships = watch("professional_memberships") || [];

  // Load existing education data into form
  useEffect(() => {
    if (existingEducation || existingProfile) {
      reset({
        institute_name: existingEducation?.institute_name || ProfileDefaults.education.institute_name,
        degree: existingEducation?.degree || ProfileDefaults.education.degree,
        field_of_study: existingEducation?.field_of_study || ProfileDefaults.education.field_of_study,
        start_date: existingEducation?.start_date || "",
        end_date: existingEducation?.end_date || "",
        grade: existingEducation?.grade || "",
        description: existingEducation?.description || "",
        // Load certifications and memberships from profile
        certifications: [],
        professional_memberships: [],
      });
    }
  }, [existingEducation, existingProfile, reset]);

  const onSubmit = async (data: EducationFormData) => {
    const stepData = {
      institute_name: data.institute_name,
      degree: data.degree,
      field_of_study: data.field_of_study,
      start_date: data.start_date,
      end_date: data.end_date,
      grade: data.grade,
      description: data.description,
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
                label='Institute Name'
                required
                placeholder='Institute of Chartered Accountants of India (ICAI)'
                error={errors.institute_name?.message}
                {...register("institute_name")}
              />

              <ProfileFormField
                label='Degree'
                placeholder='Chartered Accountant'
                error={errors.degree?.message}
                {...register("degree")}
              />

              <ProfileFormField
                label='Field of Study'
                placeholder='Accounting and Finance'
                error={errors.field_of_study?.message}
                {...register("field_of_study")}
              />

              <ProfileFormField
                label='Grade/Rank'
                placeholder='e.g., All India Rank 50, First Class'
                description='If you achieved any notable rank or distinction'
                error={errors.grade?.message}
                {...register("grade")}
              />

              <ProfileFormField
                label='Start Date'
                type='date'
                error={errors.start_date?.message}
                {...register("start_date")}
              />

              <ProfileFormField
                label='End Date'
                type='date'
                error={errors.end_date?.message}
                {...register("end_date")}
              />

              <ProfileFormField
                label='Description'
                placeholder='Additional details about your education'
                className='sm:col-span-2'
                error={errors.description?.message}
                {...register("description")}
              />
            </div>
          </div>
        </Card>
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
              Congratulations! You&apos;re completing your CA profile. After submitting this step, your profile will be
              ready and you can start receiving client inquiries.
            </p>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <SaveContinueButton
        isSubmitting={isSubmitting}
        submittingText='Completing Profile...'
        submitText='Complete Profile Setup'
      />
    </form>
  );
}
