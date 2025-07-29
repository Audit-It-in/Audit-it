"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/helpers/supabase.helper";
import { ProfileStep } from "@/src/types/profile.type";
import type {
  Profile,
  ProfileDetails,
  ProfileStepData,
  PersonalInfoFormData,
  VerificationFormData,
  ProfessionalFormData,
  EducationFormData,
  UsernameAvailability,
  Language,
  Specialization,
  SpecializationWithCategory,
  State,
  District,
  Experience,
  Education,
  CAVerification,
  SocialProfile,
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

export async function fetchProfileDetails(userId: string): Promise<ProfileDetails | null> {
  try {
    const { data, error } = await supabase.from("profile_details").select("*").eq("auth_user_id", userId).single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch profile details:", error);
    throw new Error("Unable to load profile details. Please try again.");
  }
}

export async function checkUsernameAvailability(
  username: string,
  stateId: number,
  districtId: number,
  excludeUserId?: string
): Promise<UsernameAvailability> {
  try {
    let query = supabase
      .from("profiles")
      .select("username, auth_user_id")
      .eq("username", username)
      .eq("state_id", stateId)
      .eq("district_id", districtId);

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

export async function saveProfileStep(
  userId: string,
  step: ProfileStep,
  stepData: Record<string, any>
): Promise<Profile> {
  try {
    // Get current profile
    const currentProfile = await fetchProfile(userId);

    // Merge step data with current profile
    const updates = {
      ...stepData,
      last_completed_section: step,
      completion_updated_at: new Date().toISOString(),
      profile_completion_percentage: calculateCompletionPercentage(step, stepData, currentProfile),
    };

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
  stepData: Record<string, any>,
  currentProfile: Profile | null
): number {
  const stepWeights = {
    [ProfileStep.PERSONAL_INFO]: 40,
    [ProfileStep.VERIFICATION]: 30,
    [ProfileStep.PROFESSIONAL]: 20,
    [ProfileStep.EDUCATION]: 10,
  };

  let totalCompletion = 0;

  // Add weight for completed step
  totalCompletion += stepWeights[completedStep];

  // Add weights for previously completed steps
  if (currentProfile) {
    const lastCompleted = currentProfile.last_completed_section as ProfileStep;
    const stepOrder = [
      ProfileStep.PERSONAL_INFO,
      ProfileStep.VERIFICATION,
      ProfileStep.PROFESSIONAL,
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

// === TANSTACK QUERY HOOKS ===

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useProfileDetails(userId?: string) {
  return useQuery({
    queryKey: ["profile-details", userId],
    queryFn: () => fetchProfileDetails(userId!),
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
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

export function useSaveProfileStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, step, stepData }: { userId: string; step: ProfileStep; stepData: Record<string, any> }) =>
      saveProfileStep(userId, step, stepData),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", data.auth_user_id], data);
      queryClient.invalidateQueries({ queryKey: ["profile-details", data.auth_user_id] });
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
