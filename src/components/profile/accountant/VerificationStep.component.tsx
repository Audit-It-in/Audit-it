"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveContinueButton } from "@/src/components/profile/accountant/SaveContinueButton.component";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card as NeumorphicCard } from "@/src/components/ui/card";
import { ProfileStep, Profile } from "@/src/types/profile.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { InfoIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { useSaveProfileStep, useVerification } from "@/src/services/profile.service";
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

  // Fetch existing verification data
  const { data: existingVerification, isLoading: isLoadingVerification } = useVerification(existingProfile?.id);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      membership_number: "",
      membership_certificate_url: "",
    },
  });

  // Populate form with existing verification data
  React.useEffect(() => {
    if (existingVerification) {
      reset({
        membership_number: existingVerification.membership_number || "",
        membership_certificate_url: existingVerification.membership_certificate_url || "",
      });
    }
  }, [existingVerification, reset]);

  // Mutations
  const saveProfileStepMutation = useSaveProfileStep();

  const formatMembershipNumber = (value: string): string => {
    // Remove any non-alphanumeric characters and convert to uppercase
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  };

  const onSubmit = async (data: VerificationFormData) => {
    try {
      // Validate that certificate is uploaded or already exists
      if (!certificateFile && !data.membership_certificate_url && !existingVerification?.membership_certificate_url) {
        onMessage({
          type: StatusMessageType.ERROR,
          text: "Please upload your CA membership certificate",
        });
        return;
      }

      // Handle certificate upload if there's a new file
      let certificateUrl = data.membership_certificate_url || existingVerification?.membership_certificate_url;
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

  // Show loading state while fetching verification data
  if (isLoadingVerification) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto'></div>
          <p className='text-sm text-gray-600 mt-2'>Loading verification data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* CA Verification - Neumorphic Card */}
      <NeumorphicCard variant='default' size='default' overlay='primary' overflow>
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

            {/* Show existing certificate if available */}
            {existingVerification?.membership_certificate_url && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-3 mb-3'>
                <div className='flex items-center gap-2'>
                  <CheckCircleIcon className='h-5 w-5 text-green-600' weight='fill' />
                  <span className='text-sm font-medium text-green-800'>Certificate uploaded</span>
                </div>
                <p className='text-xs text-green-700 mt-1'>
                  Your membership certificate is already on file. Upload a new file below to replace it.
                </p>
              </div>
            )}

            <FileUpload
              value={certificateFile}
              onChange={setCertificateFile}
              accept='.pdf,.jpg,.jpeg,.png'
              maxSize={FILE_VALIDATION.CERTIFICATE.maxSize}
              allowedTypes={[...FILE_VALIDATION.CERTIFICATE.allowedTypes]}
              placeholder={
                existingVerification?.membership_certificate_url
                  ? "Replace your ICAI membership certificate"
                  : "Upload your ICAI membership certificate"
              }
              helperText={
                existingVerification?.membership_certificate_url
                  ? "Certificate already uploaded. You can upload a new one to replace it. PDF, JPEG, or PNG files. Max 5MB."
                  : "PDF, JPEG, or PNG files. Max 5MB."
              }
              showPreview={true}
              isUploading={isUploadingCertificate}
              required={!existingVerification?.membership_certificate_url}
            />
          </div>
        </div>
      </NeumorphicCard>

      {/* Submit Button */}
      <SaveContinueButton
        isSubmitting={isSubmitting || isUploadingCertificate}
        submittingText={isUploadingCertificate ? "Uploading..." : "Saving..."}
        submitText='Save & Continue to Professional Details'
      />
      {/* Verification Notice */}
      <NeumorphicCard variant='subtle' size='sm'>
        <div className='flex items-start gap-3'>
          <InfoIcon className='h-5 w-5 text-blue-600 mt-0.5' weight='bold' />
          <div className='space-y-2'>
            <h4 className='text-sm font-semibold text-blue-900'>Verification Process</h4>
            <ul className='text-xs text-blue-800 space-y-1'>
              <li>• Your membership certificate will be verified against ICAI records</li>
              <li>• Verification typically takes 1-2 business days</li>
              <li>• You&apos;ll receive an email notification once verified</li>
              <li>• Professional details are visible only to verified clients</li>
            </ul>
          </div>
        </div>
      </NeumorphicCard>
    </form>
  );
}
