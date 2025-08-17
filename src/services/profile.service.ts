"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/helpers/supabase.helper";
import { ProfileStep } from "@/src/types/profile.type";
import type {
  Profile,
  ProfileDetails,
  UsernameAvailability,
  Language,
  SpecializationWithCategory,
  Education,
  Verification,
  Experience,
} from "@/src/types/profile.type";

// === CORE SERVICE FUNCTIONS ===

export async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("auth_user_id", userId).single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw new Error("Unable to load profile. Please try again.");
  }
}

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export async function fetchProfileDetails(userId: string): Promise<ProfileDetails | null> {
  try {
    // Fetch enriched view data (names, arrays)
    const { data: details, error: detailsError } = await supabase
      .from("profile_details")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (detailsError && detailsError.code !== "PGRST116") {
      throw detailsError;
    }

    if (!details) return null;

    // Fetch completion fields from profiles and merge (the view doesn't expose them)
    const { data: baseProfile, error: profileError } = await supabase
      .from("profiles")
      .select("profile_completion_percentage, last_completed_section, completion_updated_at")
      .eq("auth_user_id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError;
    }

    return {
      ...(details as unknown as ProfileDetails),
      profile_completion_percentage: baseProfile?.profile_completion_percentage ?? 0,
      last_completed_section: baseProfile?.last_completed_section ?? undefined,
      completion_updated_at: baseProfile?.completion_updated_at ?? new Date().toISOString(),
    } as ProfileDetails;
  } catch (error) {
    console.error("Failed to fetch profile details:", error);
    throw new Error("Unable to load profile details. Please try again.");
  }
}

export function useProfileDetails(userId?: string) {
  return useQuery({
    queryKey: ["profile-details", userId],
    queryFn: () => fetchProfileDetails(userId!),
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

async function generateUsernameSuggestions(
  baseUsername: string,
  stateId: number,
  districtId: number
): Promise<string[]> {
  const suggestions: string[] = [];

  // Generate variations
  const variations = [
    `${baseUsername}ca`,
    `${baseUsername}123`,
    `${baseUsername}2024`,
    `ca${baseUsername}`,
    `${baseUsername}audit`,
  ];

  for (const variation of variations) {
    const { isAvailable } = await checkUsernameAvailability(variation, stateId, districtId);
    if (isAvailable) {
      suggestions.push(variation);
    }
    if (suggestions.length >= 3) break;
  }

  return suggestions;
}

export async function checkUsernameAvailability(
  username: string,
  stateId: number,
  districtId: number,
  excludeUserId?: string
): Promise<UsernameAvailability> {
  try {
    // DB enforces global uniqueness of username, so check without location filters
    let query = supabase.from("profiles").select("username, auth_user_id").eq("username", username);

    if (excludeUserId) {
      query = query.neq("auth_user_id", excludeUserId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const isAvailable = !data || data.length === 0;

    // Get state and district names for URL preview
    const { data: locationData } = await supabase
      .from("states")
      .select(
        `
        name,
        districts!inner(name)
      `
      )
      .eq("id", stateId)
      .eq("districts.id", districtId)
      .single();

    const profileUrl = locationData
      ? `${locationData.name.toLowerCase()}/${locationData.districts[0]?.name.toLowerCase()}/${username}`
      : undefined;

    return {
      isAvailable,
      profileUrl,
      suggested: isAvailable ? [] : await generateUsernameSuggestions(username, stateId, districtId),
    };
  } catch (error) {
    console.error("Failed to check username availability:", error);
    throw new Error("Unable to verify username availability. Please try again.");
  }
}

export function useUsernameAvailability() {
  return useMutation({
    mutationFn: ({
      username,
      stateId,
      districtId,
      excludeUserId,
    }: {
      username: string;
      stateId: number;
      districtId: number;
      excludeUserId?: string;
    }) => checkUsernameAvailability(username, stateId, districtId, excludeUserId),
  });
}

export async function fetchVerification(profileId: string): Promise<Verification | null> {
  try {
    const { data, error } = await supabase.from("ca_verifications").select("*").eq("profile_id", profileId).single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch verification:", error);
    return null;
  }
}

export function useVerification(profileId?: string) {
  return useQuery({
    queryKey: ["verification", profileId],
    queryFn: () => (profileId ? fetchVerification(profileId) : Promise.resolve(null)),
    enabled: !!profileId,
  });
}

// === EXPERIENCES ===

export async function fetchExperiences(profileId: string): Promise<Experience[]> {
  try {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("profile_id", profileId)
      .order("start_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    throw new Error("Unable to load experience information. Please try again.");
  }
}

export function useExperiences(profileId?: string) {
  return useQuery<Experience[]>({
    queryKey: ["experiences", profileId],
    queryFn: () => (profileId ? fetchExperiences(profileId) : Promise.resolve([])),
    enabled: !!profileId,
  });
}

type UpsertExperience = Omit<Experience, "created_at" | "updated_at"> & { id?: string };

export async function saveExperience(experienceData: UpsertExperience): Promise<Experience> {
  try {
    if (experienceData.id) {
      const { data, error } = await supabase
        .from("experiences")
        .update({
          title: experienceData.title,
          company_name: experienceData.company_name,
          location: experienceData.location,
          is_current: experienceData.is_current,
          start_date: experienceData.start_date,
          end_date: experienceData.end_date,
          description: experienceData.description,
        })
        .eq("id", experienceData.id)
        .eq("profile_id", experienceData.profile_id)
        .select()
        .single();

      if (error) throw error;
      return data as Experience;
    } else {
      const { data, error } = await supabase
        .from("experiences")
        .insert([
          {
            profile_id: experienceData.profile_id,
            title: experienceData.title,
            company_name: experienceData.company_name,
            location: experienceData.location,
            is_current: experienceData.is_current ?? false,
            start_date: experienceData.start_date,
            end_date: experienceData.end_date,
            description: experienceData.description,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Experience;
    }
  } catch (error) {
    console.error("Failed to save experience:", error);
    throw new Error("Unable to save experience information. Please try again.");
  }
}

export async function deleteExperience(id: string, profileId: string): Promise<void> {
  try {
    const { error } = await supabase.from("experiences").delete().eq("id", id).eq("profile_id", profileId);
    if (error) throw error;
  } catch (error) {
    console.error("Failed to delete experience:", error);
    throw new Error("Unable to delete experience. Please try again.");
  }
}

// Education: fetch single most-recent (convenience)
export async function fetchEducation(profileId: string): Promise<Education | null> {
  try {
    const { data, error } = await supabase
      .from("educations")
      .select("*")
      .eq("profile_id", profileId)
      .order("start_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch education:", error);
    return null;
  }
}

export function useEducation(profileId?: string) {
  return useQuery({
    queryKey: ["education", profileId],
    queryFn: () => (profileId ? fetchEducation(profileId) : Promise.resolve(null)),
    enabled: !!profileId,
  });
}

// Education: fetch all records for a profile (schema-aligned)
export async function fetchEducations(profileId: string): Promise<Education[]> {
  try {
    const { data, error } = await supabase
      .from("educations")
      .select("*")
      .eq("profile_id", profileId)
      .order("start_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Failed to fetch educations:", error);
    throw new Error("Unable to load education information. Please try again.");
  }
}

export function useEducations(profileId?: string) {
  return useQuery<Education[]>({
    queryKey: ["educations", profileId],
    queryFn: () => (profileId ? fetchEducations(profileId) : Promise.resolve([])),
    enabled: !!profileId,
  });
}

export async function deleteEducation(id: string, profileId: string): Promise<void> {
  try {
    const { error } = await supabase.from("educations").delete().eq("id", id).eq("profile_id", profileId);
    if (error) throw error;
  } catch (error) {
    console.error("Failed to delete education:", error);
    throw new Error("Unable to delete education. Please try again.");
  }
}

export async function saveVerificationStep(verificationData: Verification): Promise<Verification> {
  try {
    const { profile_id } = verificationData;
    // Check if verification record already exists
    const { data: existingVerification } = await supabase
      .from("ca_verifications")
      .select("*")
      .eq("profile_id", profile_id)
      .single();

    if (existingVerification) {
      // Update existing verification record
      const { error } = await supabase.from("ca_verifications").update(verificationData).eq("profile_id", profile_id);

      if (error) throw error;
    } else {
      // Create new verification record
      const { error } = await supabase.from("ca_verifications").insert([verificationData]);

      if (error) throw error;
    }
    return existingVerification as Verification;
  } catch (error) {
    console.error("Failed to save verification step:", error);
    throw new Error("Unable to save verification information. Please try again.");
  }
}

export function useSaveVerificationStep() {
  return useMutation({
    mutationFn: (verificationData: Verification) => saveVerificationStep(verificationData),
  });
}

// Education: upsert a single education row (insert when id missing, update by id when present)
export async function saveEducation(
  educationData: Omit<Education, "created_at" | "updated_at" | "id"> & { id?: string }
): Promise<Education> {
  try {
    if (educationData.id) {
      const { data, error } = await supabase
        .from("educations")
        .update({
          institute_name: educationData.institute_name,
          degree: educationData.degree,
          field_of_study: educationData.field_of_study,
          start_date: educationData.start_date,
          end_date: educationData.end_date,
          grade: educationData.grade,
          description: educationData.description,
        })
        .eq("id", educationData.id)
        .eq("profile_id", educationData.profile_id)
        .select()
        .single();

      if (error) throw error;
      return data as Education;
    } else {
      const { data, error } = await supabase
        .from("educations")
        .insert([
          {
            profile_id: educationData.profile_id,
            institute_name: educationData.institute_name,
            degree: educationData.degree,
            field_of_study: educationData.field_of_study,
            start_date: educationData.start_date,
            end_date: educationData.end_date,
            grade: educationData.grade,
            description: educationData.description,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Education;
    }
  } catch (error) {
    console.error("Failed to save education:", error);
    throw new Error("Unable to save education information. Please try again.");
  }
}

export async function saveProfileStep(
  userId: string,
  step: ProfileStep,
  stepData: Record<string, unknown>
): Promise<Profile> {
  try {
    // Get current profile
    const currentProfile = await fetchProfile(userId);

    // Handle verification step separately since it goes to the ca_verifications table
    if (step === ProfileStep.VERIFICATION) {
      const { membership_number, membership_certificate_url } = stepData as Record<string, unknown>;
      const verificationPayload: Verification = {
        profile_id: (currentProfile?.id as string) ?? "",
        membership_number: (membership_number as string) ?? "",
        membership_certificate_url: (membership_certificate_url as string) ?? "",
      };
      await saveVerificationStep(verificationPayload);
      // fall through to update profile completion fields below
    }

    // Handle education step separately since it goes to the educations table
    if (step === ProfileStep.EDUCATION) {
      // Only save when form actually provided an education row
      if ((stepData as Partial<Education>).institute_name) {
        const educationPayload = {
          ...(stepData as Partial<Education>),
          profile_id: currentProfile?.id as string,
        } as Omit<Education, "created_at" | "updated_at">;
        await saveEducation(educationPayload);
      }
      // fall through to update profile completion fields below
    }

    // Handle experience step separately since it goes to the experiences table
    if (step === ProfileStep.EXPERIENCE) {
      const s = stepData as Partial<Experience>;
      if (s.title || s.company_name || s.start_date) {
        const experiencePayload = {
          ...(stepData as Partial<Experience>),
          profile_id: currentProfile?.id as string,
        } as Omit<Experience, "created_at" | "updated_at">;
        await saveExperience(experiencePayload);
      }
      // fall through to update profile completion fields below
    }

    // Merge step data with current profile for other steps
    const includeStepDataOnProfile = step === ProfileStep.PERSONAL_INFO;
    const updates = {
      // Only include stepData for PERSONAL_INFO, other steps are handled in their own tables
      ...(includeStepDataOnProfile ? stepData : {}),
      last_completed_section: step,
      completion_updated_at: new Date().toISOString(),
      profile_completion_percentage: calculateCompletionPercentage(step, stepData, currentProfile),
    } as Record<string, unknown>;

    let result;
    if (currentProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("auth_user_id", userId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new profile with step data
      const profileData = {
        auth_user_id: userId,
        role: "accountant",
        country: "India",
        language_ids: [],
        specialization_ids: [],
        whatsapp_available: false,
        is_active: true,
        ...updates,
      };

      const { data, error } = await supabase.from("profiles").insert([profileData]).select().single();

      if (error) throw error;
      result = data;
    }

    return result;
  } catch (error) {
    console.error(`Failed to save ${step} step:`, error);
    throw new Error(`Unable to save ${step.replace("_", " ")} information. Please try again.`);
  }
}

function calculateCompletionPercentage(
  completedStep: ProfileStep,
  stepData: Record<string, unknown>,
  currentProfile: Profile | null
): number {
  const stepWeights = {
    [ProfileStep.PERSONAL_INFO]: 40,
    [ProfileStep.VERIFICATION]: 30,
    [ProfileStep.EXPERIENCE]: 20,
    [ProfileStep.EDUCATION]: 10,
  };

  let totalCompletion = 0;

  // Add weight for completed step
  totalCompletion += stepWeights[completedStep];

  // Add weights for previously completed steps
  if (currentProfile) {
    const stepOrder = [
      ProfileStep.PERSONAL_INFO,
      ProfileStep.VERIFICATION,
      ProfileStep.EXPERIENCE,
      ProfileStep.EDUCATION,
    ];

    const currentStepIndex = stepOrder.indexOf(completedStep);
    for (let i = 0; i < currentStepIndex; i++) {
      totalCompletion += stepWeights[stepOrder[i]];
    }
  }

  return Math.min(totalCompletion, 100);
}

// Lookup data functions
export async function fetchLanguages(): Promise<Language[]> {
  try {
    const { data, error } = await supabase.from("languages").select("*").eq("is_active", true).order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Failed to fetch languages:", error);
    throw new Error("Unable to load languages. Please try again.");
  }
}

export async function fetchSpecializations(): Promise<SpecializationWithCategory[]> {
  try {
    const { data, error } = await supabase
      .from("specializations_with_categories")
      .select("*")
      .eq("is_active", true)
      .order("category_display_order, display_order");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Failed to fetch specializations:", error);
    throw new Error("Unable to load specializations. Please try again.");
  }
}

// Location queries
export const fetchStates = async (): Promise<{ id: number; name: string; code: string }[]> => {
  const { data, error } = await supabase.from("states").select("id, name, code").order("name", { ascending: true });

  if (error) {
    console.error("Error fetching states:", error);
    throw error;
  }

  return data || [];
};

export const fetchDistricts = async (stateId: number): Promise<{ id: number; name: string; state_id: number }[]> => {
  const { data, error } = await supabase
    .from("districts")
    .select("id, name, state_id")
    .eq("state_id", stateId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }

  return data || [];
};

export const fetchAllDistricts = async (): Promise<{ id: number; name: string; state_id: number }[]> => {
  const { data, error } = await supabase
    .from("districts")
    .select("id, name, state_id")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching all districts:", error);
    throw error;
  }

  return data || [];
};

export function useSaveProfileStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      step,
      stepData,
    }: {
      userId: string;
      step: ProfileStep;
      stepData: Record<string, unknown>;
    }) => saveProfileStep(userId, step, stepData),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", data.auth_user_id], data);
      queryClient.invalidateQueries({ queryKey: ["profile-details", data.auth_user_id] });
      queryClient.invalidateQueries({ queryKey: ["verification", data.id] });
      queryClient.invalidateQueries({ queryKey: ["education", data.id] });
      queryClient.invalidateQueries({ queryKey: ["experiences", data.id] });
      // Ensure any signed avatar URLs refetch after profile updates
      queryClient.invalidateQueries({ queryKey: ["profile-picture-url"] });
    },
  });
}

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
  });
}

export function useSpecializations() {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: fetchSpecializations,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
  });
}

export function useStates() {
  return useQuery<{ id: number; name: string; code: string }[]>({
    queryKey: ["states"],
    queryFn: fetchStates,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
  });
}

export function useDistricts(stateId?: number) {
  return useQuery<{ id: number; name: string; state_id: number }[]>({
    queryKey: ["districts", stateId],
    queryFn: () => fetchDistricts(stateId!),
    enabled: !!stateId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
  });
}

export function useAllDistricts() {
  return useQuery<{ id: number; name: string; state_id: number }[]>({
    queryKey: ["districts", "all"],
    queryFn: fetchAllDistricts,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
  });
}
