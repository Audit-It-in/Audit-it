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
import { Badge } from "@/src/components/ui/badge";
import { ProfileStep, Profile } from "@/src/types/profile.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { LoadingAction } from "@/src/types/ui.type";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { cn } from "@/src/helpers/tailwind.helper";
import {
  GraduationCapIcon,
  PlusIcon,
  TrashIcon,
  CertificateIcon,
  CalendarIcon,
  WarningIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { useSaveProfileStep } from "@/src/services/profile.service";

interface EducationStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

const educationItemSchema = z.object({
  institute_name: z.string().min(2, "Institute name is required"),
  degree: z.string().min(2, "Degree is required"),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
});

const educationSchema = z.object({
  ca_qualification: z.object({
    institute_name: z.string().min(2, "Institute name is required"),
    completion_year: z
      .number()
      .min(1980, "Please enter a valid year")
      .max(new Date().getFullYear(), "Cannot be a future year"),
    rank: z.string().optional(),
  }),
  other_qualifications: z.array(educationItemSchema).optional(),
  certifications: z.array(z.string()).optional(),
  professional_memberships: z.array(z.string()).optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

export function EducationStep({ userId, onStepComplete, onMessage, existingProfile }: EducationStepProps) {
  const [certificationInput, setCertificationInput] = useState("");
  const [membershipInput, setMembershipInput] = useState("");

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      ca_qualification: {
        institute_name: "Institute of Chartered Accountants of India (ICAI)",
        completion_year: new Date().getFullYear(),
        rank: "",
      },
      other_qualifications: [
        {
          institute_name: "",
          degree: "",
          field_of_study: "",
          start_date: "",
          end_date: "",
          grade: "",
          description: "",
        },
      ],
      certifications: [],
      professional_memberships: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "other_qualifications",
  });

  // Watch values
  const watchedCertifications = watch("certifications") || [];
  const watchedMemberships = watch("professional_memberships") || [];

  // Mutations
  const saveProfileStepMutation = useSaveProfileStep();

  const addCertification = () => {
    if (certificationInput.trim() && !watchedCertifications.includes(certificationInput.trim())) {
      setValue("certifications", [...watchedCertifications, certificationInput.trim()]);
      setCertificationInput("");
    }
  };

  const removeCertification = (certToRemove: string) => {
    setValue(
      "certifications",
      watchedCertifications.filter((cert) => cert !== certToRemove)
    );
  };

  const addMembership = () => {
    if (membershipInput.trim() && !watchedMemberships.includes(membershipInput.trim())) {
      setValue("professional_memberships", [...watchedMemberships, membershipInput.trim()]);
      setMembershipInput("");
    }
  };

  const removeMembership = (membershipToRemove: string) => {
    setValue(
      "professional_memberships",
      watchedMemberships.filter((membership) => membership !== membershipToRemove)
    );
  };

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
    try {
      await saveProfileStepMutation.mutateAsync({
        userId,
        step: ProfileStep.EDUCATION,
        stepData: {
          // CA qualification is required, so always include it
          ca_qualification: data.ca_qualification,
          // Filter out empty education entries
          other_qualifications: data.other_qualifications?.filter((edu) => edu.institute_name && edu.degree) || [],
          certifications: data.certifications || [],
          professional_memberships: data.professional_memberships || [],
        },
      });

      onStepComplete(ProfileStep.EDUCATION);
    } catch (error) {
      onMessage({
        type: StatusMessageType.ERROR,
        text: error instanceof Error ? error.message : "Failed to save education information",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      {/* CA Qualification */}
      <Card className='border-primary-200 bg-primary-50/50'>
        <CardContent className='p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <GraduationCapIcon className='h-5 w-5 text-primary-600' weight='bold' />
            <h3 className='text-lg font-semibold text-primary-900'>CA Qualification</h3>
            <Badge className='bg-accent-100 text-accent-900 border-accent-200'>Required</Badge>
          </div>

          <div className='bg-white rounded-lg p-4 border border-primary-200'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='ca_institute'>Institute *</Label>
                <Input
                  id='ca_institute'
                  {...register("ca_qualification.institute_name")}
                  className={errors.ca_qualification?.institute_name ? "border-destructive" : ""}
                />
                {errors.ca_qualification?.institute_name && (
                  <p className='text-sm text-destructive flex items-center gap-1'>
                    <WarningIcon className='h-4 w-4' />
                    {errors.ca_qualification.institute_name.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='ca_completion_year'>Completion Year *</Label>
                <Input
                  id='ca_completion_year'
                  type='number'
                  min='1980'
                  max={new Date().getFullYear()}
                  {...register("ca_qualification.completion_year", { valueAsNumber: true })}
                  className={errors.ca_qualification?.completion_year ? "border-destructive" : ""}
                />
                {errors.ca_qualification?.completion_year && (
                  <p className='text-sm text-destructive flex items-center gap-1'>
                    <WarningIcon className='h-4 w-4' />
                    {errors.ca_qualification.completion_year.message}
                  </p>
                )}
              </div>

              <div className='space-y-2 sm:col-span-2'>
                <Label htmlFor='ca_rank'>Rank/Position (Optional)</Label>
                <Input
                  id='ca_rank'
                  {...register("ca_qualification.rank")}
                  placeholder='e.g., All India Rank 50, First Class'
                />
                <p className='text-xs text-neutral-500'>If you achieved any notable rank or distinction</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Qualifications */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <GraduationCapIcon className='h-5 w-5 text-primary-600' weight='bold' />
              <h3 className='text-lg font-semibold text-primary-900'>Other Qualifications</h3>
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addEducation}
              className='flex items-center gap-2'
            >
              <PlusIcon className='h-4 w-4' weight='bold' />
              Add Education
            </Button>
          </div>

          <div className='space-y-6'>
            {fields.map((field, index) => (
              <Card key={field.id} className='border border-neutral-200'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className='text-md font-medium text-primary-800'>Education {index + 1}</h4>
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
                    <div className='space-y-2'>
                      <Label htmlFor={`other_qualifications.${index}.institute_name`}>Institute/University</Label>
                      <Input
                        {...register(`other_qualifications.${index}.institute_name`)}
                        placeholder='e.g., Mumbai University'
                        className={errors.other_qualifications?.[index]?.institute_name ? "border-destructive" : ""}
                      />
                      {errors.other_qualifications?.[index]?.institute_name && (
                        <p className='text-sm text-destructive flex items-center gap-1'>
                          <WarningIcon className='h-4 w-4' />
                          {errors.other_qualifications[index]?.institute_name?.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor={`other_qualifications.${index}.degree`}>Degree</Label>
                      <Input
                        {...register(`other_qualifications.${index}.degree`)}
                        placeholder='e.g., Bachelor of Commerce, MBA'
                        className={errors.other_qualifications?.[index]?.degree ? "border-destructive" : ""}
                      />
                      {errors.other_qualifications?.[index]?.degree && (
                        <p className='text-sm text-destructive flex items-center gap-1'>
                          <WarningIcon className='h-4 w-4' />
                          {errors.other_qualifications[index]?.degree?.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor={`other_qualifications.${index}.field_of_study`}>Field of Study</Label>
                      <Input
                        {...register(`other_qualifications.${index}.field_of_study`)}
                        placeholder='e.g., Accounting & Finance'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor={`other_qualifications.${index}.grade`}>Grade/CGPA</Label>
                      <Input
                        {...register(`other_qualifications.${index}.grade`)}
                        placeholder='e.g., First Class, 8.5 CGPA'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor={`other_qualifications.${index}.start_date`}>Start Date</Label>
                      <Input type='month' {...register(`other_qualifications.${index}.start_date`)} />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor={`other_qualifications.${index}.end_date`}>End Date</Label>
                      <Input type='month' {...register(`other_qualifications.${index}.end_date`)} />
                    </div>
                  </div>

                  <div className='mt-4 space-y-2'>
                    <Label htmlFor={`other_qualifications.${index}.description`}>Description</Label>
                    <Textarea
                      {...register(`other_qualifications.${index}.description`)}
                      placeholder='Describe relevant coursework, projects, or achievements...'
                      className='min-h-[80px]'
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <CertificateIcon className='h-5 w-5 text-primary-600' weight='bold' />
            <h3 className='text-lg font-semibold text-primary-900'>Certifications</h3>
          </div>

          <div className='space-y-4'>
            <div className='flex gap-2'>
              <Input
                value={certificationInput}
                onChange={(e) => setCertificationInput(e.target.value)}
                placeholder='e.g., CPA, CFA, FRM, ACCA'
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
              />
              <Button
                type='button'
                onClick={addCertification}
                disabled={!certificationInput.trim()}
                className='flex items-center gap-2 px-4'
              >
                <PlusIcon className='h-4 w-4' weight='bold' />
                Add
              </Button>
            </div>

            {watchedCertifications.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {watchedCertifications.map((cert, index) => (
                  <Badge key={index} variant='secondary' className='flex items-center gap-2 px-3 py-1'>
                    {cert}
                    <button
                      type='button'
                      onClick={() => removeCertification(cert)}
                      className='text-neutral-500 hover:text-destructive'
                    >
                      <TrashIcon className='h-3 w-3' weight='bold' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <p className='text-xs text-neutral-500'>Add professional certifications and courses you've completed</p>
          </div>
        </CardContent>
      </Card>

      {/* Professional Memberships */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <CheckCircleIcon className='h-5 w-5 text-primary-600' weight='bold' />
            <h3 className='text-lg font-semibold text-primary-900'>Professional Memberships</h3>
          </div>

          <div className='space-y-4'>
            <div className='flex gap-2'>
              <Input
                value={membershipInput}
                onChange={(e) => setMembershipInput(e.target.value)}
                placeholder='e.g., Institute of Cost Accountants, IIA'
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMembership())}
              />
              <Button
                type='button'
                onClick={addMembership}
                disabled={!membershipInput.trim()}
                className='flex items-center gap-2 px-4'
              >
                <PlusIcon className='h-4 w-4' weight='bold' />
                Add
              </Button>
            </div>

            {watchedMemberships.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {watchedMemberships.map((membership, index) => (
                  <Badge key={index} variant='secondary' className='flex items-center gap-2 px-3 py-1'>
                    {membership}
                    <button
                      type='button'
                      onClick={() => removeMembership(membership)}
                      className='text-neutral-500 hover:text-destructive'
                    >
                      <TrashIcon className='h-3 w-3' weight='bold' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <p className='text-xs text-neutral-500'>Add memberships to professional institutes and organizations</p>
          </div>
        </CardContent>
      </Card>

      {/* Completion Notice */}
      <Card className='border-accent-200 bg-accent-50'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-3'>
            <CheckCircleIcon className='h-5 w-5 text-accent-600 mt-0.5' weight='bold' />
            <div>
              <h4 className='text-sm font-medium text-accent-900 mb-1'>Profile Completion</h4>
              <p className='text-sm text-accent-800'>
                Congratulations! You're completing your CA profile. After submitting this step, your profile will be
                ready and you can start receiving client inquiries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type='submit'
        disabled={isSubmitting}
        className='w-full h-12 bg-accent-600 hover:bg-accent-700 text-white'
      >
        {isSubmitting ? (
          <div className='flex items-center gap-2'>
            <InlineLoader action={LoadingAction.PROCESSING} />
            <span>Completing Profile...</span>
          </div>
        ) : (
          "Complete Profile Setup"
        )}
      </Button>
    </form>
  );
}
