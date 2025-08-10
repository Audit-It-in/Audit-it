"use client";
import AvatarUpload from "@/src/components/common/AvatarUpload.component";
import { Card as NeumorphicCard } from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { CheckboxGroup } from "@/src/components/ui/checkbox-group";
import { FILE_VALIDATION, uploadProfilePicture } from "@/src/services/upload.service";
import { SaveContinueButton } from "./SaveContinueButton.component";
import { IconBadge } from "@/src/components/ui/icon-badge";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { Label } from "@/src/components/ui/label";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";
import { LocationFields } from "../shared/LocationFields.component";
import { PersonalInfoFormData, personalInfoSchema, ProfileDefaults } from "@/src/helpers/profile-validation.helper";
import { Profile, ProfileStep, UsernameAvailability } from "@/src/types/profile.type";
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
    result: UsernameAvailability | null;
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
        profile_picture_url: existingProfile?.profile_picture_url || "",
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
  const handleStateChange = () => {
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
        } catch {
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
    hasInitialized,
    usernameAvailability.isChecking,
    checkUsernameMutation,
    usernameCheckTimeout,
    existingProfile,
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
          // Update the form field to reflect the new URL
          setValue("profile_picture_url", uploadResult.url);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Mobile-first Layout: Split into separate cards */}
      <div className='space-y-6 md:space-y-0 md:flex md:items-stretch'>
        {/* Left Card - Your Info */}
        <NeumorphicCard
          variant='default'
          size='sm'
          overlay='primary'
          overflow
          className='md:w-[48%] md:flex-shrink-0 flex flex-col md:mr-[4%]'
        >
          {/* Header */}
          <div className='flex items-center gap-3 mb-4'>
            <IconBadge variant='default' size='sm' icon={UserIcon} />
            <h3 className='text-base font-bold text-primary-900'>Your Info</h3>
          </div>

          {/* Profile Picture - Larger Size */}
          <div className='flex flex-col items-center space-y-4 mb-8'>
            <AvatarUpload
              value={profilePictureFile}
              onChange={(file) => {
                setProfilePictureFile(file);
                // Clear the URL when a new file is selected or removed
                if (file) {
                  setValue("profile_picture_url", "");
                } else {
                  // File was removed, clear the URL as well
                  setValue("profile_picture_url", "");
                }
              }}
              currentImageUrl={watch("profile_picture_url")}
              maxSize={FILE_VALIDATION.PROFILE_PICTURE.maxSize}
              allowedTypes={[...FILE_VALIDATION.PROFILE_PICTURE.allowedTypes]}
              isUploading={isUploadingPicture}
              size='2xl'
              showRemove={true}
              className='transition-all duration-300 hover:scale-[1.02]'
            />
            <Label className='text-sm font-semibold text-primary-700 text-center tracking-wide'>Profile Picture</Label>
          </div>

          {/* Form Fields - Flex grow to fill remaining space */}
          <div className='space-y-4 flex-grow flex flex-col'>
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
              placeholder='98765 43210'
              error={errors.phone?.message}
              {...register("phone")}
            />

            {/* Hidden field for profile picture URL */}
            <input type='hidden' {...register("profile_picture_url")} />

            {/* WhatsApp Available */}
            <div className='space-y-2 pl-2'>
              <Switch
                checked={watch("whatsapp_available") || false}
                onCheckedChange={(checked: boolean) => setValue("whatsapp_available", checked)}
                id='whatsapp-toggle'
                showLabel={true}
                label='Available on WhatsApp'
                labelPosition='left'
              />
            </div>
          </div>
        </NeumorphicCard>

        {/* Right Card - Other Details */}
        <NeumorphicCard
          variant='default'
          size='sm'
          overlay='primary'
          overflow
          className='md:w-[48%] md:flex-shrink-0 flex flex-col'
        >
          {/* Header */}
          <div className='flex items-center gap-3 mb-4'>
            <IconBadge variant='default' size='sm' icon={MapPinIcon} />
            <h3 className='text-base font-bold text-primary-900'>Other Details</h3>
          </div>

          <div className='space-y-4 flex-grow flex flex-col'>
            {/* Location Section */}
            <LocationFields
              control={control}
              errors={errors}
              stateValue={watchedStateId}
              onStateChange={handleStateChange}
            />

            {/* Username */}
            <div className='flex flex-col justify-start'>
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
            </div>

            {/* Bio - Flex grow to fill remaining space */}
            <div className='flex-grow flex flex-col'>
              <ProfileFormField
                label='Bio'
                type='textarea'
                placeholder='Tell us about yourself and your expertise...'
                error={errors.bio?.message}
                {...register("bio")}
                className='flex-grow flex flex-col'
                inputClassName='flex-grow h-full min-h-[14rem]'
              />
            </div>
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
      <SaveContinueButton
        isSubmitting={isSubmitting}
        disabled={usernameAvailability.isChecking}
        submittingText='Saving your information...'
        submitText='Save & Continue to Verification'
      />
    </form>
  );
}
