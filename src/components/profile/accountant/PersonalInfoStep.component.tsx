"use client";
import AvatarUpload from "@/src/components/common/AvatarUpload.component";
import { Card as NeumorphicCard } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { CheckboxGroup } from "@/src/components/ui/checkbox-group";
import { FILE_VALIDATION, uploadProfilePicture } from "@/src/services/upload.service";
import { FormSubmitButton } from "../shared/FormSubmitButton.component";
import { IconBadge } from "@/src/components/ui/icon-badge";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { Label } from "@/src/components/ui/label";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";
import { LocationFields } from "../shared/LocationFields.component";
import { PersonalInfoFormData, personalInfoSchema, ProfileDefaults } from "@/src/helpers/profile-validation.helper";
import { Profile, ProfileStep } from "@/src/types/profile.type";
import { ProfileFormField } from "../shared/ProfileFormField.component";
import { StatusMessage } from "@/src/types/common.type";
import { useAuth } from "@/src/hooks/useAuth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguages, useSpecializations, useUsernameAvailability } from "@/src/services/profile.service";
import { useProfileFormState } from "@/src/hooks/useProfileFormState";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircleIcon,
  WarningIcon,
  LinkIcon,
  UserIcon,
  MapPinIcon,
  ChatCircleIcon,
  BriefcaseIcon,
} from "@phosphor-icons/react";

interface PersonalInfoStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

export function PersonalInfoStep({ userId, onStepComplete, onMessage, existingProfile }: PersonalInfoStepProps) {
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [usernameAvailability, setUsernameAvailability] = useState<{
    isChecking: boolean;
    result: any;
  }>({ isChecking: false, result: null });
  const [hasInitialized, setHasInitialized] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  const {
    isSubmitting,
    handleSubmit: handleFormSubmit,
    showError,
  } = useProfileFormState({
    userId,
    step: ProfileStep.PERSONAL_INFO,
    onStepComplete,
    onMessage,
  });

  // Get auth user for Google metadata
  const { user } = useAuth();

  // Data fetching hooks
  const { data: languages = [] } = useLanguages();
  const { data: specializations = [] } = useSpecializations();

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    trigger,
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      ...ProfileDefaults.personalInfo,
      username: existingProfile?.username || "",
      first_name:
        existingProfile?.first_name ||
        user?.user_metadata?.full_name?.split(" ")[0] ||
        user?.user_metadata?.given_name ||
        "",
      middle_name: existingProfile?.middle_name || "",
      last_name:
        existingProfile?.last_name ||
        user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
        user?.user_metadata?.family_name ||
        "",
      profile_picture_url: existingProfile?.profile_picture_url || "",
      bio: existingProfile?.bio || "",
      state_id: existingProfile?.state_id || 0,
      district_id: existingProfile?.district_id || 0,
      language_ids: existingProfile?.language_ids || [],
      specialization_ids: existingProfile?.specialization_ids || [],
      phone: existingProfile?.phone || "",
      whatsapp_available: existingProfile?.whatsapp_available || false,
    },
  });

  // Watch form values
  const watchedStateId = watch("state_id");
  const watchedDistrictId = watch("district_id");
  const watchedUsername = watch("username");
  const watchedLanguageIds = watch("language_ids");
  const watchedSpecializationIds = watch("specialization_ids");

  // Reset form when existing profile changes (navigation)
  useEffect(() => {
    if (!hasInitialized && (existingProfile || user)) {
      reset({
        username: existingProfile?.username || "",
        first_name:
          existingProfile?.first_name ||
          user?.user_metadata?.full_name?.split(" ")[0] ||
          user?.user_metadata?.given_name ||
          "",
        middle_name: existingProfile?.middle_name || "",
        last_name:
          existingProfile?.last_name ||
          user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
          user?.user_metadata?.family_name ||
          "",
        bio: existingProfile?.bio || "",
        state_id: existingProfile?.state_id || 0,
        district_id: existingProfile?.district_id || 0,
        language_ids: existingProfile?.language_ids || [],
        specialization_ids: existingProfile?.specialization_ids || [],
        phone: existingProfile?.phone || "",
        whatsapp_available: existingProfile?.whatsapp_available || false,
      });
      setHasInitialized(true);
    }
  }, [existingProfile, user, reset, hasInitialized]);

  // Mutations
  const checkUsernameMutation = useUsernameAvailability();

  // Reset district when state changes
  const handleStateChange = (stateId: number) => {
    setValue("district_id", 0);
  };

  // Username availability checking with debounce
  useEffect(() => {
    // Only check if we have valid data and it's not the current user's existing username
    const shouldCheck =
      watchedUsername &&
      watchedUsername.length >= 3 &&
      watchedStateId &&
      watchedStateId > 0 &&
      watchedDistrictId &&
      watchedDistrictId > 0 &&
      !(
        existingProfile?.username === watchedUsername &&
        existingProfile?.state_id === watchedStateId &&
        existingProfile?.district_id === watchedDistrictId
      );

    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }

    if (shouldCheck && hasInitialized) {
      const timeout = setTimeout(async () => {
        // Double check we're not already checking
        if (usernameAvailability.isChecking) {
          return;
        }

        setUsernameAvailability({ isChecking: true, result: null });

        try {
          const result = await checkUsernameMutation.mutateAsync({
            username: watchedUsername,
            stateId: watchedStateId,
            districtId: watchedDistrictId,
            excludeUserId: existingProfile ? userId : undefined,
          });

          setUsernameAvailability({ isChecking: false, result });
        } catch (error) {
          setUsernameAvailability({ isChecking: false, result: null });
        }
      }, 800);

      setUsernameCheckTimeout(timeout);
    } else {
      setUsernameAvailability({ isChecking: false, result: null });
    }

    return () => {
      if (usernameCheckTimeout) {
        clearTimeout(usernameCheckTimeout);
      }
    };
  }, [
    watchedUsername,
    watchedStateId,
    watchedDistrictId,
    existingProfile?.username,
    existingProfile?.state_id,
    existingProfile?.district_id,
    userId,
  ]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      // Check username availability one final time
      if (!existingProfile || existingProfile.username !== data.username) {
        const availability = await checkUsernameMutation.mutateAsync({
          username: data.username,
          stateId: data.state_id,
          districtId: data.district_id,
          excludeUserId: existingProfile ? userId : undefined,
        });

        if (!availability.isAvailable) {
          showError("Username is not available in this location. Please choose a different username.");
          return;
        }
      }

      // Handle profile picture upload if there's a new file
      let profilePictureUrl = data.profile_picture_url;
      if (profilePictureFile) {
        setIsUploadingPicture(true);
        const uploadResult = await uploadProfilePicture(profilePictureFile, userId);

        if (uploadResult.success && uploadResult.url) {
          profilePictureUrl = uploadResult.url;
        } else {
          showError(uploadResult.error || "Failed to upload profile picture");
          setIsUploadingPicture(false);
          return;
        }
        setIsUploadingPicture(false);
      }

      const stepData = {
        username: data.username,
        first_name: data.first_name,
        middle_name: data.middle_name || null,
        last_name: data.last_name,
        profile_picture_url: profilePictureUrl || null,
        bio: data.bio || null,
        state_id: data.state_id,
        district_id: data.district_id,
        language_ids: data.language_ids,
        specialization_ids: data.specialization_ids,
        phone: data.phone,
        whatsapp_available: data.whatsapp_available,
      };

      await handleFormSubmit(stepData);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to save personal information");
    }
  };

  const handleLanguageToggle = (languageId: number) => {
    const currentIds = watchedLanguageIds || [];
    const newIds = currentIds.includes(languageId)
      ? currentIds.filter((id) => id !== languageId)
      : [...currentIds, languageId];
    setValue("language_ids", newIds);
    trigger("language_ids");
  };

  const handleSpecializationToggle = (specializationId: number) => {
    const currentIds = watchedSpecializationIds || [];
    const newIds = currentIds.includes(specializationId)
      ? currentIds.filter((id) => id !== specializationId)
      : [...currentIds, specializationId];
    setValue("specialization_ids", newIds);
    trigger("specialization_ids");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Mobile-first Layout: Split into separate cards */}
      <div className='md:flex md:gap-6'>
        {/* Left Card - Your Info */}
        <NeumorphicCard variant='default' size='sm' overlay='primary' overflow className='md:w-[40%]'>
          {/* Header */}
          <div className='flex items-center gap-3 mb-4'>
            <IconBadge variant='default' size='sm' icon={UserIcon} />
            <h3 className='text-base font-bold text-primary-900'>Your Info</h3>
          </div>

          {/* Profile Picture - Neumorphic Design */}
          <div className='flex flex-col items-center space-y-3 mb-6'>
            <div className='relative w-20 h-20 rounded-full bg-gradient-to-br from-neutral-50 to-neutral-100 shadow-[6px_6px_16px_rgba(0,0,0,0.12),-6px_-6px_16px_rgba(255,255,255,0.9)] border border-neutral-200/50'>
              <AvatarUpload
                value={profilePictureFile}
                onChange={setProfilePictureFile}
                currentImageUrl={watch("profile_picture_url")}
                maxSize={FILE_VALIDATION.PROFILE_PICTURE.maxSize}
                allowedTypes={[...FILE_VALIDATION.PROFILE_PICTURE.allowedTypes]}
                isUploading={isUploadingPicture}
                size='md'
                showRemove={true}
              />
            </div>
            <Label className='text-xs font-medium text-primary-700 text-center'>Profile Picture</Label>
          </div>

          {/* Form Fields */}
          <div className='space-y-4'>
            <ProfileFormField
              label='First Name'
              required
              placeholder='First name'
              error={errors.first_name?.message}
              {...register("first_name")}
            />

            <ProfileFormField label='Middle Name' placeholder='Optional' {...register("middle_name")} />

            <ProfileFormField
              label='Last Name'
              required
              placeholder='Last name'
              error={errors.last_name?.message}
              {...register("last_name")}
            />

            <ProfileFormField
              label='Phone Number'
              type='tel'
              required
              placeholder='+91 98765 43210'
              error={errors.phone?.message}
              {...register("phone")}
            />

            {/* WhatsApp Available */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-primary-800'>
                <ChatCircleIcon className='h-4 w-4 inline mr-1' />
                WhatsApp
              </Label>
              <div className='flex items-center gap-3 h-11 px-4 bg-white border border-neutral-300 rounded-lg shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]'>
                <Checkbox
                  checked={watch("whatsapp_available") || false}
                  onCheckedChange={(checked) => setValue("whatsapp_available", !!checked)}
                  className='data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600'
                />
                <span className='text-sm text-neutral-700 font-medium'>Available on WhatsApp</span>
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* Right Card - Other Details */}
        <NeumorphicCard variant='default' size='sm' overlay='primary' overflow className='mt-6 md:mt-0 md:w-[60%]'>
          {/* Header */}
          <div className='flex items-center gap-3 mb-4'>
            <IconBadge variant='default' size='sm' icon={MapPinIcon} />
            <h3 className='text-base font-bold text-primary-900'>Other Details</h3>
          </div>

          <div className='space-y-4'>
            {/* Location Section */}
            <LocationFields
              control={control}
              errors={errors}
              stateValue={watchedStateId}
              onStateChange={handleStateChange}
            />

            {/* Username */}
            <div className='space-y-2'>
              <ProfileFormField
                label='Username'
                required
                placeholder='Your username'
                error={errors.username?.message}
                {...register("username")}
              />
              {usernameAvailability.isChecking && (
                <div className='flex items-center gap-2 text-xs text-primary-600 bg-primary-50/60 p-2 rounded-lg border border-primary-200/60'>
                  <InlineLoader action={LoadingAction.LOADING} size={SpinnerSize.SMALL} />
                  <span className='font-medium'>Checking availability...</span>
                </div>
              )}
              {usernameAvailability.result && (
                <div className='text-xs'>
                  {usernameAvailability.result.isAvailable ? (
                    <div className='flex items-center gap-2 text-accent-700 bg-accent-50/60 p-2 rounded-lg border border-accent-200/60'>
                      <CheckCircleIcon className='h-4 w-4' />
                      <span className='font-medium'>Available</span>
                    </div>
                  ) : (
                    <div className='text-red-700 bg-red-50/60 p-2 rounded-lg border border-red-200/60'>
                      <div className='flex items-center gap-2 mb-1'>
                        <WarningIcon className='h-4 w-4' />
                        <span className='font-medium'>Not available</span>
                      </div>
                      {usernameAvailability.result.suggested && (
                        <div className='text-neutral-600'>
                          <span>Try: {usernameAvailability.result.suggested.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {usernameAvailability.result.profileUrl && (
                    <div className='flex items-center gap-2 text-primary-600 bg-primary-50/40 p-2 rounded-lg border border-primary-200/40 mt-2'>
                      <LinkIcon className='h-4 w-4' />
                      <span className='font-medium'>audit-it.com/{usernameAvailability.result.profileUrl}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bio */}
            <ProfileFormField
              label='Bio'
              type='textarea'
              placeholder='Tell us about yourself and your expertise...'
              error={errors.bio?.message}
              {...register("bio")}
            />
          </div>
        </NeumorphicCard>
      </div>

      {/* Languages - Neumorphic Card */}
      <NeumorphicCard variant='default' size='sm' overlay='primary'>
        <div className='flex items-center gap-3 mb-4'>
          <IconBadge variant='default' size='sm' icon={ChatCircleIcon} />
          <h3 className='text-base font-bold text-primary-900'>Languages *</h3>
        </div>

        <CheckboxGroup
          columns={4}
          variant='default'
          items={languages.map((lang) => ({
            id: lang.id,
            label: lang.name,
            value: lang.id,
          }))}
          value={watchedLanguageIds || []}
          onChange={(newValues) => {
            setValue("language_ids", newValues as number[]);
            trigger("language_ids");
          }}
        />
        {errors.language_ids && (
          <p className='text-xs text-red-600 font-medium flex items-center gap-1 mt-3'>
            <WarningIcon className='h-3 w-3' />
            {errors.language_ids.message}
          </p>
        )}
      </NeumorphicCard>

      {/* Specializations - Neumorphic Card */}
      <NeumorphicCard variant='default' size='sm' overlay='primary'>
        <div className='flex items-center gap-3 mb-4'>
          <IconBadge variant='default' size='sm' icon={BriefcaseIcon} />
          <h3 className='text-base font-bold text-primary-900'>Specializations *</h3>
        </div>

        <CheckboxGroup
          columns='responsive'
          variant='default'
          items={specializations.map((spec) => ({
            id: spec.id,
            label: spec.name,
            value: spec.id,
          }))}
          value={watchedSpecializationIds || []}
          onChange={(newValues) => {
            setValue("specialization_ids", newValues as number[]);
            trigger("specialization_ids");
          }}
        />
        {errors.specialization_ids && (
          <p className='text-xs text-red-600 font-medium flex items-center gap-1 mt-3'>
            <WarningIcon className='h-3 w-3' />
            {errors.specialization_ids.message}
          </p>
        )}
      </NeumorphicCard>

      {/* Submit Button - Neumorphic Design */}
      <FormSubmitButton
        isSubmitting={isSubmitting}
        disabled={usernameAvailability.isChecking}
        submittingText='Saving your information...'
        submitText='Save & Continue to Verification'
      />
    </form>
  );
}
