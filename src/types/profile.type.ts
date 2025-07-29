import { UserRole } from "./auth.type";

// Profile Stepper Types
export enum ProfileStep {
  PERSONAL_INFO = "personal_info",
  VERIFICATION = "verification",
  PROFESSIONAL = "professional",
  EDUCATION = "education",
}

export interface ProfileStepConfig {
  step: ProfileStep;
  title: string;
  description: string;
  icon: string;
  required: boolean;
  weight: number;
}

export interface ProfileStepValidation {
  isValid: boolean;
  completedFields: string[];
  missingRequiredFields: string[];
  errors: Record<string, string>;
}

export interface ProfileStepData {
  step: ProfileStep;
  data: Record<string, any>;
  validation: ProfileStepValidation;
  completedAt?: string;
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

// CA Verification interface
export interface CAVerification {
  profile_id: string;
  membership_number?: string;
  membership_certificate_url?: string;
  verified_at?: string;
  verified_by?: string;
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

// Contact Request interfaces
export enum ContactRequestStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  REPLIED = "replied",
  CLOSED = "closed",
}

export enum ContactUrgency {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface ContactRequest {
  id: string;
  ca_profile_id: string;
  customer_profile_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
  service_needed?: string;
  urgency: ContactUrgency;
  location_city?: string;
  location_state?: string;
  status: ContactRequestStatus;
  ca_private_notes?: string[];
  replied_at?: string;
  created_at: string;
  updated_at: string;
}

// Form types for profile operations
export interface ProfileUpdateData {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  bio?: string;
  gender?: string;
  country?: string;
  state_id?: number;
  district_id?: number;
  language_ids?: number[];
  specialization_ids?: number[];
  phone?: string;
  whatsapp_available?: boolean;
}

// Step-specific form data interfaces
export interface PersonalInfoFormData {
  username: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  bio?: string;
  profile_picture?: File;
  state_id: number;
  district_id: number;
  language_ids: number[];
  specialization_ids: number[];
  phone: string;
  whatsapp_available: boolean;
}

export interface VerificationFormData {
  membership_number: string;
  membership_certificate?: File;
  professional_email?: string;
  professional_phone?: string;
}

export interface ProfessionalFormData {
  current_firm?: string;
  years_of_experience?: number;
  practice_areas?: string[];
  professional_achievements?: string;
  consultation_fee?: number;
}

export interface EducationFormData {
  ca_qualification: {
    institute_name: string;
    completion_year: number;
    rank?: string;
  };
  other_qualifications: Education[];
  certifications?: string[];
  professional_memberships?: string[];
}

// Username availability checking
export interface UsernameAvailability {
  isAvailable: boolean;
  suggested?: string[];
  profileUrl?: string;
}

export interface ProfileFormData extends ProfileUpdateData {
  profile_picture?: File;
}

// Profile completion tracking
export interface ProfileCompletionStep {
  id: string;
  name: string;
  completed: boolean;
  required: boolean;
  weight: number;
}

export interface ProfileCompletionStatus {
  percentage: number;
  completed_steps: string[];
  pending_steps: string[];
  last_completed_section?: string;
  completion_updated_at: string;
}

// Utility types for profile operations
export type ProfileCreateData = Omit<
  Profile,
  "id" | "created_at" | "updated_at" | "profile_completion_percentage" | "completion_updated_at"
>;
export type ProfilePartialUpdate = Partial<
  Pick<
    Profile,
    | "first_name"
    | "middle_name"
    | "last_name"
    | "bio"
    | "gender"
    | "country"
    | "state_id"
    | "district_id"
    | "language_ids"
    | "specialization_ids"
    | "phone"
    | "whatsapp_available"
  >
>;
