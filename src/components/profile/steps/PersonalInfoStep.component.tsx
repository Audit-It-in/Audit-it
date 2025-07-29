"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { ProfileStep, Profile } from "@/src/types/profile.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { LoadingAction } from "@/src/types/ui.type";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { SpinnerSize } from "@/src/types/ui.type";
import { cn } from "@/src/helpers/tailwind.helper";
import {
  CheckCircleIcon,
  WarningIcon,
  LinkIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  ChatCircleIcon,
  BriefcaseIcon,
  CameraIcon,
} from "@phosphor-icons/react";
import AvatarUpload from "@/src/components/common/AvatarUpload.component";
import { uploadProfilePicture, FILE_VALIDATION } from "@/src/services/upload.service";
import {
  useSaveProfileStep,
  useUsernameAvailability,
  useLanguages,
  useSpecializations,
  useStates,
  useDistricts,
} from "@/src/services/profile.service";
import { useAuth } from "@/src/hooks/useAuth";

interface PersonalInfoStepProps {
  userId: string;
  onStepComplete: (step: ProfileStep) => void;
  onMessage: (message: StatusMessage) => void;
  existingProfile: Profile | null;
}

const personalInfoSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens and underscores"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  middle_name: z.string().optional(),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  profile_picture_url: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  state_id: z.number().min(1, "Please select a state"),
  district_id: z.number().min(1, "Please select a district"),
  language_ids: z.array(z.number()).min(1, "Select at least one language"),
  specialization_ids: z.array(z.number()).min(1, "Select at least one specialization"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[+]?[0-9\s\-()]+$/, "Invalid phone number format"),
  whatsapp_available: z.boolean().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export function PersonalInfoStep({ userId, onStepComplete, onMessage, existingProfile }: PersonalInfoStepProps) {
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [usernameAvailability, setUsernameAvailability] = useState<{
    isChecking: boolean;
    result: any;
  }>({ isChecking: false, result: null });
  const [hasInitialized, setHasInitialized] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  // Get auth user for Google metadata
  const { user } = useAuth();

  // Data fetching hooks
  const { data: languages = [] } = useLanguages();
  const { data: specializations = [] } = useSpecializations();
  const { data: states = [], isLoading: statesQueryLoading, error: statesQueryError } = useStates();

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    trigger,
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
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

  // Districts query - depends on form state
  const {
    data: districts = [],
    isLoading: districtsQueryLoading,
    error: districtsQueryError,
  } = useDistricts(watchedStateId || undefined);

  // Alias queries for easier reference
  const statesQuery = { isLoading: statesQueryLoading, error: statesQueryError };
  const districtsQuery = { isLoading: districtsQueryLoading, error: districtsQueryError };

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
  const saveProfileStepMutation = useSaveProfileStep();
  const checkUsernameMutation = useUsernameAvailability();

  // Reset district when state changes
  useEffect(() => {
    if (watchedStateId && districts.length > 0) {
      setValue("district_id", 0);
    }
  }, [watchedStateId, districts, setValue]);

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
          onMessage({
            type: StatusMessageType.ERROR,
            text: "Username is not available in this location. Please choose a different username.",
          });
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
          onMessage({
            type: StatusMessageType.ERROR,
            text: uploadResult.error || "Failed to upload profile picture",
          });
          setIsUploadingPicture(false);
          return;
        }
        setIsUploadingPicture(false);
      }

      await saveProfileStepMutation.mutateAsync({
        userId,
        step: ProfileStep.PERSONAL_INFO,
        stepData: {
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
        },
      });

      onStepComplete(ProfileStep.PERSONAL_INFO);
    } catch (error) {
      onMessage({
        type: StatusMessageType.ERROR,
        text: error instanceof Error ? error.message : "Failed to save personal information",
      });
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
      {/* Basic Information & Contact - Neumorphic Card */}
      <Card className='shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)] border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30 overflow-hidden'>
        <CardContent className='p-6 relative'>
          {/* Background gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-primary-100/10 via-transparent to-primary-200/20 opacity-60' />

          <div className='relative z-10'>
            {/* Header with Avatar */}
            <div className='flex items-start gap-6 mb-6'>
              <div className='flex items-center gap-3 flex-1'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]'>
                  <UserIcon className='h-5 w-5' weight='bold' />
                </div>
                <div>
                  <h3 className='text-lg font-bold text-primary-900'>Basic Information</h3>
                  <p className='text-sm text-neutral-600'>Your profile details and avatar</p>
                </div>
              </div>

              {/* Profile Avatar */}
              <div className='flex flex-col items-center space-y-2'>
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
                <Label className='text-xs font-medium text-primary-700 text-center'>Profile Picture</Label>
              </div>
            </div>

            {/* Name Fields Row */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
              <div className='space-y-2'>
                <Label htmlFor='first_name' className='text-sm font-medium text-primary-800'>
                  First Name *
                </Label>
                <Input
                  id='first_name'
                  {...register("first_name")}
                  placeholder='First name'
                  className={cn(
                    "h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
                    "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 focus:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.15)]",
                    errors.first_name && "border-red-400 focus:border-red-400 focus:ring-red-500/20"
                  )}
                />
                {errors.first_name && (
                  <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                    <WarningIcon className='h-3 w-3' />
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='middle_name' className='text-sm font-medium text-primary-800'>
                  Middle Name
                </Label>
                <Input
                  id='middle_name'
                  {...register("middle_name")}
                  placeholder='Optional'
                  className='h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='last_name' className='text-sm font-medium text-primary-800'>
                  Last Name *
                </Label>
                <Input
                  id='last_name'
                  {...register("last_name")}
                  placeholder='Last name'
                  className={cn(
                    "h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
                    "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20",
                    errors.last_name && "border-red-400 focus:border-red-400 focus:ring-red-500/20"
                  )}
                />
                {errors.last_name && (
                  <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                    <WarningIcon className='h-3 w-3' />
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Username and Bio Row */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
              <div className='space-y-2'>
                <Label htmlFor='username' className='text-sm font-medium text-primary-800'>
                  Username *
                </Label>
                <Input
                  id='username'
                  {...register("username")}
                  placeholder='Your username'
                  className={cn(
                    "h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
                    "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20",
                    errors.username && "border-red-400 focus:border-red-400 focus:ring-red-500/20"
                  )}
                />
                {errors.username && (
                  <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                    <WarningIcon className='h-3 w-3' />
                    {errors.username.message}
                  </p>
                )}
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

              <div className='space-y-2'>
                <Label htmlFor='bio' className='text-sm font-medium text-primary-800'>
                  Bio
                </Label>
                <Textarea
                  id='bio'
                  {...register("bio")}
                  placeholder='Tell us about yourself and your expertise...'
                  className={cn(
                    "min-h-[80px] bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
                    "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 resize-none",
                    errors.bio && "border-red-400 focus:border-red-400 focus:ring-red-500/20"
                  )}
                />
                {errors.bio && (
                  <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                    <WarningIcon className='h-3 w-3' />
                    {errors.bio.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information Row */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
              <div className='space-y-2'>
                <Label htmlFor='phone' className='text-sm font-medium text-primary-800'>
                  <PhoneIcon className='h-4 w-4 inline mr-1' />
                  Phone Number *
                </Label>
                <Input
                  id='phone'
                  type='tel'
                  {...register("phone")}
                  placeholder='+91 98765 43210'
                  className={cn(
                    "h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
                    "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20",
                    errors.phone && "border-red-400 focus:border-red-400 focus:ring-red-500/20"
                  )}
                />
                {errors.phone && (
                  <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                    <WarningIcon className='h-3 w-3' />
                    {errors.phone.message}
                  </p>
                )}
              </div>

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

            {/* Location Information */}
            <div className='space-y-4 mb-6'>
              <div className='flex items-center gap-2 mb-4'>
                <MapPinIcon className='h-5 w-5 text-primary-600' weight='bold' />
                <h4 className='text-base font-semibold text-primary-900'>Location</h4>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='state_id' className='text-sm font-medium text-primary-800'>
                    State *
                  </Label>
                  <Controller
                    name='state_id'
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          setValue("district_id", 0);
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
                            "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20",
                            errors.state_id && "border-red-400 focus:border-red-400 focus:ring-red-500/20"
                          )}
                        >
                          <SelectValue placeholder='Select state' />
                        </SelectTrigger>
                        <SelectContent>
                          {statesQueryLoading ? (
                            <div className='flex items-center justify-center py-2'>
                              <InlineLoader action={LoadingAction.LOADING} size={SpinnerSize.SMALL} />
                              <span className='ml-2 text-sm'>Loading states...</span>
                            </div>
                          ) : statesQueryError ? (
                            <div className='px-2 py-2 text-sm text-red-600'>Failed to load states</div>
                          ) : states.length === 0 ? (
                            <div className='px-2 py-2 text-sm text-neutral-500'>No states available</div>
                          ) : (
                            states.map((state) => (
                              <SelectItem key={state.id} value={state.id.toString()}>
                                {state.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.state_id && (
                    <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                      <WarningIcon className='h-3 w-3' />
                      {errors.state_id.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='district_id' className='text-sm font-medium text-primary-800'>
                    District *
                  </Label>
                  <Controller
                    name='district_id'
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={!watchedStateId || districts.length === 0}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full h-11 bg-white border-neutral-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]",
                            "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20",
                            "disabled:opacity-60 disabled:cursor-not-allowed",
                            errors.district_id && "border-red-400 focus:border-red-400 focus:ring-red-500/20"
                          )}
                        >
                          <SelectValue placeholder={watchedStateId ? "Select district" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {districtsQueryLoading ? (
                            <div className='flex items-center justify-center py-2'>
                              <InlineLoader action={LoadingAction.LOADING} size={SpinnerSize.SMALL} />
                              <span className='ml-2 text-sm'>Loading districts...</span>
                            </div>
                          ) : districtsQueryError ? (
                            <div className='px-2 py-2 text-sm text-red-600'>Failed to load districts</div>
                          ) : districts.length === 0 ? (
                            <div className='px-2 py-2 text-sm text-neutral-500'>
                              {watchedStateId ? "No districts available" : "Select a state first"}
                            </div>
                          ) : (
                            districts.map((district) => (
                              <SelectItem key={district.id} value={district.id.toString()}>
                                {district.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.district_id && (
                    <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                      <WarningIcon className='h-3 w-3' />
                      {errors.district_id.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Languages - Neumorphic Card */}
      <Card className='shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)] border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30'>
        <CardContent className='p-6 relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary-100/10 via-transparent to-primary-200/20 opacity-60' />

          <div className='relative z-10'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]'>
                <ChatCircleIcon className='h-5 w-5' weight='bold' />
              </div>
              <h3 className='text-lg font-bold text-primary-900'>Languages *</h3>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
              {languages.map((language) => (
                <label
                  key={language.id}
                  className={cn(
                    "group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border",
                    "shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.8)]",
                    "hover:shadow-[4px_4px_10px_rgba(0,0,0,0.12),-4px_-4px_10px_rgba(255,255,255,0.9)]",
                    watchedLanguageIds?.includes(language.id)
                      ? "border-primary-400/80 bg-gradient-to-br from-primary-50/80 via-primary-100/40 to-primary-200/60 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]"
                      : "border-neutral-200/60 bg-gradient-to-br from-neutral-50 to-neutral-100/60 hover:border-primary-300/50"
                  )}
                >
                  <Checkbox
                    checked={watchedLanguageIds?.includes(language.id) || false}
                    onCheckedChange={() => handleLanguageToggle(language.id)}
                    className='data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600'
                  />
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      watchedLanguageIds?.includes(language.id)
                        ? "text-primary-800"
                        : "text-neutral-700 group-hover:text-primary-700"
                    )}
                  >
                    {language.name}
                  </span>
                </label>
              ))}
            </div>
            {errors.language_ids && (
              <p className='text-xs text-red-600 font-medium flex items-center gap-1 mt-3'>
                <WarningIcon className='h-3 w-3' />
                {errors.language_ids.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Specializations - Neumorphic Card */}
      <Card className='shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)] border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30'>
        <CardContent className='p-6 relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary-100/10 via-transparent to-primary-200/20 opacity-60' />

          <div className='relative z-10'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]'>
                <BriefcaseIcon className='h-5 w-5' weight='bold' />
              </div>
              <h3 className='text-lg font-bold text-primary-900'>Specializations *</h3>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
              {specializations.map((specialization) => (
                <label
                  key={specialization.id}
                  className={cn(
                    "group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border",
                    "shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.8)]",
                    "hover:shadow-[4px_4px_10px_rgba(0,0,0,0.12),-4px_-4px_10px_rgba(255,255,255,0.9)]",
                    watchedSpecializationIds?.includes(specialization.id)
                      ? "border-primary-400/80 bg-gradient-to-br from-primary-50/80 via-primary-100/40 to-primary-200/60 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]"
                      : "border-neutral-200/60 bg-gradient-to-br from-neutral-50 to-neutral-100/60 hover:border-primary-300/50"
                  )}
                >
                  <Checkbox
                    checked={watchedSpecializationIds?.includes(specialization.id) || false}
                    onCheckedChange={() => handleSpecializationToggle(specialization.id)}
                    className='data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600'
                  />
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      watchedSpecializationIds?.includes(specialization.id)
                        ? "text-primary-800"
                        : "text-neutral-700 group-hover:text-primary-700"
                    )}
                  >
                    {specialization.name}
                  </span>
                </label>
              ))}
            </div>
            {errors.specialization_ids && (
              <p className='text-xs text-red-600 font-medium flex items-center gap-1 mt-3'>
                <WarningIcon className='h-3 w-3' />
                {errors.specialization_ids.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button - Neumorphic Design */}
      <div className='relative'>
        <Button
          type='submit'
          disabled={isSubmitting || usernameAvailability.isChecking}
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
              <span>Saving your information...</span>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <CheckCircleIcon className='h-5 w-5' weight='bold' />
              <span>Save & Continue to Verification</span>
            </div>
          )}
        </Button>

        {/* Glow effect */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg blur-lg opacity-20 -z-10' />
      </div>
    </form>
  );
}
