"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card as NeumorphicCard } from "@/src/components/ui/card";
import { IconBadge } from "@/src/components/ui/icon-badge";
import { Badge } from "@/src/components/ui/badge";
import { ProfileStep, Profile } from "@/src/types/profile.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { ShieldCheckIcon, InfoIcon } from "@phosphor-icons/react";
import { useSaveProfileStep } from "@/src/services/profile.service";
import FileUpload from "@/src/components/common/FileUpload.component";
import { uploadCertificate, FILE_VALIDATION } from "@/src/services/upload.service";
import { verificationSchema, VerificationFormData } from "@/src/helpers/profile-validation.helper";

interface VerificationStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

export function VerificationStep({ userId, onStepComplete, onMessage, existingProfile }: VerificationStepProps) {
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      membership_number: "",
      certificate_url: "",
      professional_email: existingProfile?.email || "",
      professional_phone: existingProfile?.phone || "",
    },
  });

  // Mutations
  const saveProfileStepMutation = useSaveProfileStep();

  const formatMembershipNumber = (value: string): string => {
    // Remove any non-alphanumeric characters and convert to uppercase
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  };

  const onSubmit = async (data: VerificationFormData) => {
    try {
      // Validate that certificate is uploaded
      if (!certificateFile && !data.certificate_url) {
        onMessage({
          type: StatusMessageType.ERROR,
          text: "Please upload your CA membership certificate",
        });
        return;
      }

      // Handle certificate upload if there's a new file
      let certificateUrl = data.certificate_url;
      if (certificateFile) {
        setIsUploadingCertificate(true);
        const uploadResult = await uploadCertificate(certificateFile, userId, "membership");

        if (uploadResult.success && uploadResult.url) {
          certificateUrl = uploadResult.url;
        } else {
          onMessage({
            type: StatusMessageType.ERROR,
            text: uploadResult.error || "Failed to upload certificate",
          });
          setIsUploadingCertificate(false);
          return;
        }
        setIsUploadingCertificate(false);
      }

      await saveProfileStepMutation.mutateAsync({
        userId,
        step: ProfileStep.VERIFICATION,
        stepData: {
          membership_number: data.membership_number,
          membership_certificate_url: certificateUrl,
          professional_email: data.professional_email || null,
          professional_phone: data.professional_phone || null,
        },
      });

      onStepComplete(ProfileStep.VERIFICATION);
    } catch (error) {
      onMessage({
        type: StatusMessageType.ERROR,
        text: error instanceof Error ? error.message : "Failed to save verification information",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* CA Verification - Neumorphic Card */}
      <NeumorphicCard variant='default' size='default' overlay='primary' overflow>
        <div className='flex items-center gap-3 mb-6'>
          <IconBadge variant='accent' size='default' icon={ShieldCheckIcon} />
          <h3 className='text-lg font-bold text-primary-900'>CA Verification</h3>
          <Badge variant='destructive' className='ml-auto text-xs font-semibold'>
            Required
          </Badge>
        </div>

        <div className='space-y-6'>
          {/* Membership Number */}
          <div className='space-y-2'>
            <Label htmlFor='membership_number' className='text-sm font-medium text-primary-800'>
              ICAI Membership Number *
            </Label>
            <Input
              id='membership_number'
              {...register("membership_number")}
              placeholder='Enter your ICAI membership number'
              onChange={(e) => {
                const formatted = formatMembershipNumber(e.target.value);
                setValue("membership_number", formatted);
              }}
              hasError={!!errors.membership_number}
            />
            {errors.membership_number && (
              <p className='text-xs text-red-600 font-medium'>{errors.membership_number.message}</p>
            )}
          </div>

          {/* Certificate Upload */}
          <div className='space-y-3'>
            <Label className='text-sm font-medium text-primary-800'>Membership Certificate *</Label>
            <FileUpload
              value={certificateFile}
              onChange={setCertificateFile}
              accept='.pdf,.jpg,.jpeg,.png'
              maxSize={FILE_VALIDATION.CERTIFICATE.maxSize}
              allowedTypes={[...FILE_VALIDATION.CERTIFICATE.allowedTypes]}
              placeholder='Upload your ICAI membership certificate'
              helperText='PDF, JPEG, or PNG files. Max 5MB.'
              showPreview={true}
              isUploading={isUploadingCertificate}
              required={true}
            />
          </div>

          {/* Professional Contact (Optional) */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='professional_email' className='text-sm font-medium text-primary-800'>
                Professional Email
              </Label>
              <Input
                id='professional_email'
                type='email'
                {...register("professional_email")}
                placeholder='Optional professional email'
                hasError={!!errors.professional_email}
              />
              {errors.professional_email && (
                <p className='text-xs text-red-600 font-medium'>{errors.professional_email.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='professional_phone' className='text-sm font-medium text-primary-800'>
                Professional Phone
              </Label>
              <Input
                id='professional_phone'
                {...register("professional_phone")}
                placeholder='Optional professional phone'
                hasError={!!errors.professional_phone}
              />
              {errors.professional_phone && (
                <p className='text-xs text-red-600 font-medium'>{errors.professional_phone.message}</p>
              )}
            </div>
          </div>
        </div>
      </NeumorphicCard>

      {/* Verification Notice */}
      <NeumorphicCard variant='subtle' size='sm'>
        <div className='flex items-start gap-3'>
          <InfoIcon className='h-5 w-5 text-blue-600 mt-0.5' weight='bold' />
          <div className='space-y-2'>
            <h4 className='text-sm font-semibold text-blue-900'>Verification Process</h4>
            <ul className='text-xs text-blue-800 space-y-1'>
              <li>• Your membership certificate will be verified against ICAI records</li>
              <li>• Verification typically takes 1-2 business days</li>
              <li>• You'll receive an email notification once verified</li>
              <li>• Professional details are visible only to verified clients</li>
            </ul>
          </div>
        </div>
      </NeumorphicCard>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={isSubmitting || isUploadingCertificate}
          variant='accent'
          size='lg'
          className='px-8'
        >
          {isSubmitting || isUploadingCertificate ? (
            <div className='flex items-center gap-2'>
              <div className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              {isUploadingCertificate ? "Uploading..." : "Saving..."}
            </div>
          ) : (
            "Save & Continue to Professional Details"
          )}
        </Button>
      </div>
    </form>
  );
}
