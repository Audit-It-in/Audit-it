import { z } from "zod";
import { ValidationFields, CommonSchemas } from "./validation.helper";
import { Profile } from "@/src/types/profile.type";

/**
 * Profile-specific validation schemas
 * These use the common validation utilities for consistency
 */

// Personal Information Step Schema
export const personalInfoSchema = z.object({
  username: ValidationFields.username(),
  ...CommonSchemas.personName(),
  profile_picture_url: ValidationFields.optionalText(),
  bio: ValidationFields.bio(),
  ...CommonSchemas.location(),
  language_ids: ValidationFields.requiredArray("Language"),
  specialization_ids: ValidationFields.requiredArray("Specialization"),
  ...CommonSchemas.contactInfo(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Verification Step Schema
export const verificationSchema = z.object({
  membership_number: ValidationFields.membershipNumber(),
  membership_certificate_url: ValidationFields.optionalText(),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;

// Professional Step Schema
export const professionalSchema = z.object({
  current_firm: ValidationFields.optionalText(),
  years_of_experience: ValidationFields.experienceYears(),
  practice_areas: ValidationFields.optionalStringArray(),
  professional_achievements: ValidationFields.achievements(),
  consultation_fee: ValidationFields.optionalPositiveNumber("Consultation fee"),
});

export type ProfessionalFormData = z.infer<typeof professionalSchema>;

// Education Step Schema
export const educationSchema = z.object({
  institute_name: z.string().min(2, "Institute name is required"),
  degree: z.string().optional(),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  certifications: ValidationFields.optionalStringArray(),
  professional_memberships: ValidationFields.optionalStringArray(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// Profile completion validation helpers
export const ProfileValidation = {
  // Check if personal info step is complete
  isPersonalInfoComplete: (profile: Profile | null): boolean => {
    return !!(
      profile?.first_name &&
      profile?.last_name &&
      profile?.username &&
      profile?.state_id &&
      profile?.district_id &&
      profile?.language_ids?.length > 0 &&
      profile?.specialization_ids?.length > 0 &&
      profile?.phone
    );
  },

  // Check if verification step is complete
  // Note: Verification data is stored in ca_verifications table
  isVerificationComplete: (): boolean => {
    // Verification step completion is tracked separately via ca_verifications table
    // For now, consider it incomplete by default since it requires manual verification
    return false;
  },

  // Check if professional step is complete (optional but valuable)
  // Note: Experience data is stored in experiences table
  isProfessionalComplete: (profile: Profile | null): boolean => {
    // Professional step completion is tracked via experiences table
    // This is an optional step, so we'll consider it complete if profile exists
    return !!profile?.id;
  },

  // Check if education step is complete
  // Note: Education data is stored in educations table
  isEducationComplete: (): boolean => {
    // Education step completion is tracked via educations table
    // This step is required for CAs, so we'll need proper validation
    return false;
  },

  // Calculate overall profile completion percentage
  getCompletionPercentage: (profile: Profile | null): number => {
    const steps = [
      { check: ProfileValidation.isPersonalInfoComplete, weight: 40 },
      { check: ProfileValidation.isVerificationComplete, weight: 30 },
      { check: ProfileValidation.isProfessionalComplete, weight: 20 },
      { check: ProfileValidation.isEducationComplete, weight: 10 },
    ];

    const completedWeight = steps.reduce((total, step) => {
      return total + (step.check(profile) ? step.weight : 0);
    }, 0);

    return Math.round(completedWeight);
  },

  // Get next incomplete step
  getNextIncompleteStep: (profile: Profile | null): string | null => {
    if (!ProfileValidation.isPersonalInfoComplete(profile)) return "PERSONAL_INFO";
    if (!ProfileValidation.isVerificationComplete()) return "VERIFICATION";
    if (!ProfileValidation.isProfessionalComplete(profile)) return "PROFESSIONAL";
    if (!ProfileValidation.isEducationComplete()) return "EDUCATION";
    return null; // All complete
  },

  // Validate step data before submission
  validateStepData: {
    personalInfo: (data: unknown) => personalInfoSchema.parse(data),
    verification: (data: unknown) => verificationSchema.parse(data),
    professional: (data: unknown) => professionalSchema.parse(data),
    education: (data: unknown) => educationSchema.parse(data),
  },
};

// Form default values
export const ProfileDefaults = {
  personalInfo: {
    username: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    profile_picture_url: "",
    bio: "",
    state_id: 0,
    district_id: 0,
    language_ids: [],
    specialization_ids: [],
    phone: "",
    whatsapp_available: false,
  },

  verification: {
    membership_number: "",
    membership_certificate_url: "",
  },

  professional: {
    current_firm: "",
    years_of_experience: 0,
    practice_areas: [],
    professional_achievements: "",
    consultation_fee: 0,
  },

  education: {
    institute_name: "Institute of Chartered Accountants of India (ICAI)",
    degree: "Chartered Accountant",
    field_of_study: "Accounting and Finance",
    start_date: "",
    end_date: "",
    grade: "",
    description: "",
    certifications: [],
    professional_memberships: [],
  },
};
