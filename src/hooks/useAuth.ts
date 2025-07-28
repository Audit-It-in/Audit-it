"use client";

import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Session } from "@supabase/supabase-js";
import {
  useSignIn,
  useSignUp,
  useSignOut,
  useProfile,
  useUpdateProfile,
  useCurrentSession,
  onAuthStateChange,
} from "@/src/services/auth.service";
import {
  authUserAtom,
  isAuthenticatedAtom,
  userRoleAtom,
  isCAAtom,
  isCustomerAtom,
  profileCompletionAtom,
} from "@/src/store/auth.store";
import { UserRole } from "@/src/types/auth.type";
import type { AuthUser } from "@/src/types/auth.type";
import type { Profile } from "@/src/types/profile.type";

export function useAuth() {
  const [user, setUser] = useAtom(authUserAtom);

  // TanStack Query hooks
  const { data: sessionData, isLoading: sessionLoading } = useCurrentSession();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();
  const updateProfileMutation = useUpdateProfile();

  // Jotai setters for computed values
  const setUserRole = useSetAtom(userRoleAtom);
  const setIsCA = useSetAtom(isCAAtom);
  const setIsCustomer = useSetAtom(isCustomerAtom);
  const setProfileCompletion = useSetAtom(profileCompletionAtom);

  // Computed values from Jotai (for backward compatibility)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const userRole = useAtomValue(userRoleAtom);
  const isCA = useAtomValue(isCAAtom);
  const isCustomer = useAtomValue(isCustomerAtom);
  const profileCompletion = useAtomValue(profileCompletionAtom);

  // Sync session data with Jotai store
  useEffect(() => {
    if (sessionData?.user) {
      setUser(sessionData.user);
    } else if (sessionData?.user === null) {
      setUser(null);
    }
  }, [sessionData, setUser]);

  // Update computed values when profile changes
  useEffect(() => {
    if (profile) {
      setUserRole(profile.role || null);
      setIsCA(profile.role === UserRole.ACCOUNTANT);
      setIsCustomer(profile.role === UserRole.CUSTOMER);
      setProfileCompletion(profile.profile_completion_percentage || 0);
    } else {
      setUserRole(null);
      setIsCA(false);
      setIsCustomer(false);
      setProfileCompletion(0);
    }
  }, [profile, setUserRole, setIsCA, setIsCustomer, setProfileCompletion]);

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = onAuthStateChange(async (event: string, session: Session | null) => {
      if (session?.user) {
        setUser(session.user as AuthUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  // Auth functions using TanStack Query mutations
  const signIn = async (email: string, password: string) => {
    return signInMutation.mutateAsync({ email, password });
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    return signUpMutation.mutateAsync({
      email,
      password,
      firstName,
      lastName,
      confirmPassword: password,
    });
  };

  const signOut = async () => {
    return signOutMutation.mutateAsync();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("No authenticated user");
    return updateProfileMutation.mutateAsync({ userId: user.id, updates });
  };

  return {
    // User data
    user,
    profile,

    // Loading states
    authLoading: sessionLoading,
    profileLoading,

    // Computed values
    isAuthenticated,
    userRole,
    isCA,
    isCustomer,
    profileCompletion,

    // Auth functions
    signIn,
    signUp,
    signOut,
    updateProfile,

    // Mutation states for advanced usage
    signInMutation,
    signUpMutation,
    signOutMutation,
    updateProfileMutation,
  };
}
