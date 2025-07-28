import { User as SupabaseUser } from "@supabase/supabase-js";
import { Profile } from "./profile.type";

export enum UserRole {
  ACCOUNTANT = "accountant",
  CUSTOMER = "customer",
  ADMIN = "admin",
}

// Use type alias instead of interface extension to avoid empty interface warning
export type AuthUser = SupabaseUser;

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

// Form types
export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

// Auth session types
export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

// Auth error types
export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

// Auth state types
export interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  session: AuthSession | null;
  loading: boolean;
  initialized: boolean;
}

// Authentication response types
export interface SignInResponse {
  user: AuthUser;
  session: AuthSession;
}

export interface SignUpResponse {
  user: AuthUser;
  session: AuthSession | null;
}
