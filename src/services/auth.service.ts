"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/src/helpers/supabase.helper";
import { useSetAtom } from "jotai";
import { authUserAtom } from "@/src/store/auth.store";
import type { AuthUser, SignUpFormData, SignInFormData } from "@/src/types/auth.type";
import { Profile } from "@/src/types/profile.type";

// === CORE SERVICE FUNCTIONS ===

export async function signInWithEmail(data: SignInFormData): Promise<{ user: AuthUser; session: Session | null }> {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;
  if (!authData.user) throw new Error("No user returned from sign in");

  return {
    user: authData.user as AuthUser,
    session: authData.session,
  };
}

export async function signUpWithEmail(data: SignUpFormData): Promise<{ user: AuthUser; session: Session | null }> {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    },
  });

  if (error) throw error;
  if (!authData.user) throw new Error("No user returned from sign up");

  return {
    user: authData.user as AuthUser,
    session: authData.session,
  };
}

export async function signInWithGoogle(): Promise<{ url?: string }> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("auth_user_id", userId).single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function createUserProfile(userId: string, userData: Partial<Profile>): Promise<Profile> {
  // Ensure role is provided when creating profile
  if (!userData.role) {
    throw new Error("Role is required when creating a profile");
  }

  const profileData = {
    auth_user_id: userId,
    role: userData.role,
    country: "India",
    language_ids: [],
    specialization_ids: [],
    whatsapp_available: false,
    is_active: true,
    profile_completion_percentage: 20,
    ...userData,
  };

  const { data, error } = await supabase.from("profiles").insert([profileData]).select().single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").update(updates).eq("auth_user_id", userId).select().single();

  if (error) throw error;
  return data;
}

export async function checkIfUserNeedsRoleSelection(userId: string): Promise<boolean> {
  try {
    const profile = await fetchUserProfile(userId);
    return !profile || !profile.role;
  } catch {
    // If profile doesn't exist or can't be fetched, user needs role selection
    return true;
  }
}

export async function getCurrentSession(): Promise<{ user: AuthUser | null; session: Session | null }> {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return {
    user: (data.session?.user as AuthUser) || null,
    session: data.session,
  };
}

export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// === TANSTACK QUERY HOOKS ===

export function useSignIn() {
  const setUser = useSetAtom(authUserAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signInWithEmail,
    onSuccess: (data) => {
      setUser(data.user);
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["current-session"] });
      queryClient.invalidateQueries({ queryKey: ["profile", data.user.id] });
    },
    onError: (error) => {
      console.error("Sign in error:", error);
    },
  });
}

export function useSignUp() {
  const setUser = useSetAtom(authUserAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUpWithEmail,
    onSuccess: (data) => {
      setUser(data.user);
      // Invalidate queries after sign up
      queryClient.invalidateQueries({ queryKey: ["current-session"] });
      queryClient.invalidateQueries({ queryKey: ["profile", data.user.id] });
    },
    onError: (error) => {
      console.error("Sign up error:", error);
    },
  });
}

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("Google sign in error:", error);
    },
  });
}

export function useSignOut() {
  const setUser = useSetAtom(authUserAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      setUser(null);
      // Clear all queries on sign out
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Sign out error:", error);
    },
  });
}

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<Profile> }) =>
      createUserProfile(userId, userData),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", data.auth_user_id], data);
    },
    onError: (error) => {
      console.error("Create profile error:", error);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
      // Check if profile exists first
      const existingProfile = await fetchUserProfile(userId);
      
      if (!existingProfile) {
        // Create profile if it doesn't exist
        return createUserProfile(userId, updates);
      } else {
        // Update existing profile
        return updateUserProfile(userId, updates);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", data.auth_user_id], data);
    },
    onError: (error) => {
      console.error("Update profile error:", error);
    },
  });
}

export function useCurrentSession() {
  return useQuery({
    queryKey: ["current-session"],
    queryFn: getCurrentSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth queries
  });
}
