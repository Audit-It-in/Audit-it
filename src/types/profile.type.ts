import { UserRole } from "./auth.type";

// Profile Stepper Types
export enum ProfileStep {
  PERSONAL_INFO = "personal_info",
  VERIFICATION = "verification",
  EXPERIENCE = "experience",
  EDUCATION = "education",
}

export interface ProfileStepValidation {
  isValid: boolean;
  completedFields: string[];
  missingRequiredFields: string[];
  errors: Record<string, string>;
}

// Location types
export interface State {
  id: number;
  name: string;
  code: string;
  created_at: string;
}

export interface District {
  id: number;
  name: string;
  state_id: number;
  created_at: string;
}

// Language types
export interface Language {
  id: number;
  name: string;
  code?: string;
  native_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Specialization types
export interface SpecializationCategory {
  id: number;
  name: string;
  code: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Specialization {
  id: number;
  name: string;
  code: string;
  category_id: number;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpecializationWithCategory extends Specialization {
  category_name: string;
  category_code: string;
  category_description?: string;
  category_display_order: number;
}

// Core profile interface based on latest migration schema
export interface Profile {
  id: string;
  auth_user_id: string;
  username?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  bio?: string;
  gender?: string;
  role: UserRole;
  country: string;
  state_id?: number;
  district_id?: number;
  language_ids: number[];
  specialization_ids: number[];
  email?: string;
  phone?: string;
  whatsapp_available: boolean;
  is_active: boolean;
  profile_completion_percentage: number;
  last_completed_section?: string;
  completion_updated_at: string;
  created_at: string;
  updated_at: string;
}

// Extended profile with resolved names (from profile_details view)
export interface ProfileDetails extends Profile {
  state_name?: string;
  district_name?: string;
  language_names: string[];
  specialization_names: string[];
}

// Experience interface
export interface Experience {
  id: string;
  profile_id: string;
  title?: string;
  company_name?: string;
  location?: string;
  is_current: boolean;
  start_date?: string;
  end_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Education interface
export interface Education {
  id: string;
  profile_id: string;
  institute_name: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Social Profile interface
export interface SocialProfile {
  id: string;
  profile_id: string;
  linkedin_profile?: string;
  professional_website?: string;
  instagram_profile?: string;
  facebook_profile?: string;
  twitter_profile?: string;
  youtube_profile?: string;
  created_at: string;
  updated_at: string;
}
export interface Verification {
  profile_id: string;
  membership_number?: string; // nullable in DB
  membership_certificate_url?: string; // nullable in DB
  verified_at?: string;
  verified_by?: string;
}

// Username availability checking
export interface UsernameAvailability {
  isAvailable: boolean;
  suggested?: string[];
  profileUrl?: string;
}
