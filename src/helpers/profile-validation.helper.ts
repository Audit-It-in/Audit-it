import { z } from "zod";
import { ValidationFields, CommonSchemas, FormRefinements } from "./validation.helper";

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
  certificate_url: ValidationFields.optionalText(),
  professional_email: ValidationFields.optionalEmail("professional email"),
  professional_phone: ValidationFields.phone(),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;

// Professional Step Schema
export const professionalSchema = z
  .object({
    current_firm: ValidationFields.optionalText(),
    years_of_experience: ValidationFields.experienceYears(),
    practice_areas: ValidationFields.optionalStringArray(),
    professional_achievements: ValidationFields.achievements(),
    consultation_fee: ValidationFields.optionalPositiveNumber("Consultation fee"),
    experiences: z.array(z.object(CommonSchemas.workExperience())).optional(),
  })
  .refine(FormRefinements.experienceEndDate, {
    message: "End date is required for non-current positions",
    path: ["experiences"],
  });

export type ProfessionalFormData = z.infer<typeof professionalSchema>;

// Education Step Schema  
export const educationSchema = z.object({
  ca_qualification: z.object(CommonSchemas.caQualification()),
  other_qualifications: z.array(z.object(CommonSchemas.educationItem())).optional(),
  certifications: ValidationFields.optionalStringArray(),
  professional_memberships: ValidationFields.optionalStringArray(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// Profile completion validation helpers
export const ProfileValidation = {
  // Check if personal info step is complete
  isPersonalInfoComplete: (profile: any): boolean => {
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
  isVerificationComplete: (profile: any): boolean => {
    return !!(profile?.membership_number);
  },

  // Check if professional step is complete (optional but valuable)
  isProfessionalComplete: (profile: any): boolean => {
    return !!(
      profile?.years_of_experience !== null ||
      profile?.current_firm ||
      profile?.practice_areas?.length > 0 ||
      profile?.work_experiences?.length > 0
    );
  },

  // Check if education step is complete
  isEducationComplete: (profile: any): boolean => {
    return !!(
      profile?.ca_qualification?.institute_name &&
      profile?.ca_qualification?.completion_year
    );
  },

  // Calculate overall profile completion percentage
  getCompletionPercentage: (profile: any): number => {
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
  getNextIncompleteStep: (profile: any): string | null => {
    if (!ProfileValidation.isPersonalInfoComplete(profile)) return "PERSONAL_INFO";
    if (!ProfileValidation.isVerificationComplete(profile)) return "VERIFICATION";
    if (!ProfileValidation.isProfessionalComplete(profile)) return "PROFESSIONAL";
    if (!ProfileValidation.isEducationComplete(profile)) return "EDUCATION";
    return null; // All complete
  },

  // Validate step data before submission
  validateStepData: {
    personalInfo: (data: any) => personalInfoSchema.parse(data),
    verification: (data: any) => verificationSchema.parse(data),
    professional: (data: any) => professionalSchema.parse(data),
    education: (data: any) => educationSchema.parse(data),
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
    certificate_url: "",
    professional_email: "",
    professional_phone: "",
  },

  professional: {
    current_firm: "",
    years_of_experience: 0,
    practice_areas: [],
    professional_achievements: "",
    consultation_fee: 0,
    experiences: [
      {
        title: "",
        company_name: "",
        location: "",
        is_current: false,
        start_date: "",
        end_date: "",
        description: "",
      },
    ],
  },

  education: {
    ca_qualification: {
      institute_name: "Institute of Chartered Accountants of India (ICAI)",
      completion_year: new Date().getFullYear(),
      rank: "",
    },
    other_qualifications: [
      {
        institute_name: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        grade: "",
        description: "",
      },
    ],
    certifications: [],
    professional_memberships: [],
  },
};