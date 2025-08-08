import { z } from "zod";
import { ValidationFields, CommonSchemas, FormRefinements } from "./validation.helper";
import { Profile } from "@/src/types/profile.type";

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

// Experience Step Schema (aligned with experiences table)
export const experienceSchema = z
  .object({
    id: z.string().optional(),
    title: ValidationFields.jobTitle(),
    company_name: ValidationFields.companyName(),
    location: ValidationFields.optionalText(),
    is_current: z.boolean().default(false),
    start_date: ValidationFields.requiredDate(),
    end_date: ValidationFields.optionalDate(),
    description: ValidationFields.description(),
  })
  .refine(
    (data) =>
      FormRefinements.experienceEndDate({ experiences: [{ is_current: data.is_current, end_date: data.end_date }] }),
    {
      path: ["end_date"],
      message: "End date is required when the position is not current",
    }
  );

export type ExperienceFormData = z.infer<typeof experienceSchema>;
export const experienceListSchema = z
  .object({
    experiences: z.array(experienceSchema).min(1, "Add at least one experience"),
  })
  .refine(
    (data) => {
      const keys = new Set<string>();
      for (const e of data.experiences) {
        const key = [
          (e.title ?? "").trim().toLowerCase(),
          (e.company_name ?? "").trim().toLowerCase(),
          e.start_date ?? "",
          e.end_date ?? "",
        ].join("|");
        if (keys.has(key)) return false;
        keys.add(key);
      }
      return true;
    },
    { path: ["experiences"], message: "Duplicate experience entries are not allowed" }
  )
  .refine(
    (data) => {
      const currentCount = data.experiences.filter((e) => !!e.is_current).length;
      return currentCount <= 1;
    },
    { path: ["experiences"], message: "Only one experience can be marked as currently working" }
  );
export type ExperienceListFormData = z.infer<typeof experienceListSchema>;

// Education Step Schema (allow optional id for editing/removal)
export const educationSchema = z.object({
  id: z.string().optional(),
  institute_name: z.string().min(2, "Institute name is required"),
  degree: z.string().optional(),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// Education list schema (support multiple entries similar to experiences)
export const educationListSchema = z
  .object({
    educations: z.array(educationSchema).min(1, "Add at least one education"),
  })
  .refine(
    (data) => {
      const keys = new Set<string>();
      for (const ed of data.educations) {
        const key = [
          (ed.institute_name ?? "").trim().toLowerCase(),
          (ed.degree ?? "").trim().toLowerCase(),
          (ed.field_of_study ?? "").trim().toLowerCase(),
          ed.start_date ?? "",
          ed.end_date ?? "",
        ].join("|");
        if (keys.has(key)) return false;
        keys.add(key);
      }
      return true;
    },
    { path: ["educations"], message: "Duplicate education entries are not allowed" }
  );
export type EducationListFormData = z.infer<typeof educationListSchema>;

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
    if (!ProfileValidation.isProfessionalComplete(profile)) return "EXPERIENCE";
    if (!ProfileValidation.isEducationComplete()) return "EDUCATION";
    return null; // All complete
  },

  // Validate step data before submission
  validateStepData: {
    personalInfo: (data: unknown) => personalInfoSchema.parse(data),
    verification: (data: unknown) => verificationSchema.parse(data),
    professional: (data: unknown) => experienceSchema.parse(data),
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
    // Deprecated: legacy professional fields were removed in favor of the experiences table
  },

  education: {
    institute_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    grade: "",
    description: "",
  },
};
