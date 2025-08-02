import { z } from "zod";

/**
 * Common validation schemas and utilities for form validation
 * These provide consistent validation patterns across the application
 */

// Base field validators
export const ValidationFields = {
  // Text field validators
  requiredText: (fieldName: string, minLength = 2) =>
    z.string().min(minLength, `${fieldName} must be at least ${minLength} characters`),

  optionalText: (maxLength?: number) =>
    maxLength
      ? z.string().max(maxLength, `Must be less than ${maxLength} characters`).optional()
      : z.string().optional(),

  // Name validators
  firstName: () => z.string().min(2, "First name must be at least 2 characters"),
  lastName: () => z.string().min(2, "Last name must be at least 2 characters"),
  middleName: () => z.string().optional(),

  // Professional field validators
  companyName: () => z.string().min(2, "Company name is required"),
  jobTitle: () => z.string().min(2, "Job title is required"),
  instituteName: () => z.string().min(2, "Institute name is required"),
  degree: () => z.string().min(2, "Degree is required"),

  // Bio and description validators
  bio: () => z.string().max(500, "Bio must be less than 500 characters").optional(),
  description: () => z.string().optional(),
  achievements: () => z.string().max(1000, "Achievements must be less than 1000 characters").optional(),

  // Contact field validators
  email: (fieldName = "email") =>
    z.string().email(`Please enter a valid ${fieldName}`),

  optionalEmail: (fieldName = "email") =>
    z.string().email(`Please enter a valid ${fieldName}`).optional().or(z.literal("")),

  phone: () =>
    z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[+]?[0-9\s\-()]+$/, "Invalid phone number format"),

  // Username validator
  username: () =>
    z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens and underscores"),

  // Membership number validator
  membershipNumber: () =>
    z
      .string()
      .min(6, "Membership number must be at least 6 characters")
      .regex(/^[A-Z0-9]+$/, "Membership number should contain only uppercase letters and numbers"),

  // Numeric field validators
  positiveNumber: (fieldName: string) =>
    z.number().min(0, `${fieldName} must be 0 or more`),

  requiredSelection: (fieldName: string) =>
    z.number().min(1, `Please select a ${fieldName.toLowerCase()}`),

  optionalPositiveNumber: (fieldName: string) =>
    z.number().min(0, `${fieldName} must be 0 or more`).optional(),

  // Date validators
  requiredDate: () => z.string().min(1, "Date is required"),
  optionalDate: () => z.string().optional(),
  monthDate: () => z.string().optional(),

  // Year validator
  completionYear: () =>
    z
      .number()
      .min(1980, "Please enter a valid year")
      .max(new Date().getFullYear(), "Cannot be a future year"),

  // Experience years
  experienceYears: () =>
    z.number().min(0, "Years of experience must be 0 or more").optional(),

  // Array validators
  requiredArray: (fieldName: string, minLength = 1) =>
    z.array(z.number()).min(minLength, `Select at least one ${fieldName.toLowerCase()}`),

  optionalStringArray: () => z.array(z.string()).optional(),

  // Boolean validators
  optionalBoolean: () => z.boolean().optional(),
};

// Common compound schemas
export const CommonSchemas = {
  // Person name schema
  personName: () => ({
    first_name: ValidationFields.firstName(),
    middle_name: ValidationFields.middleName(),
    last_name: ValidationFields.lastName(),
  }),

  // Location selection schema
  location: () => ({
    state_id: ValidationFields.requiredSelection("State"),
    district_id: ValidationFields.requiredSelection("District"),
  }),

  // Contact information schema
  contactInfo: () => ({
    phone: ValidationFields.phone(),
    whatsapp_available: ValidationFields.optionalBoolean(),
  }),

  // Professional contact schema
  professionalContact: () => ({
    email: ValidationFields.optionalEmail("professional email"),
    phone: ValidationFields.phone(),
  }),

  // Work experience item schema
  workExperience: () => ({
    title: ValidationFields.jobTitle(),
    company_name: ValidationFields.companyName(),
    location: ValidationFields.optionalText(),
    is_current: z.boolean(),
    start_date: ValidationFields.requiredDate(),
    end_date: ValidationFields.optionalDate(),
    description: ValidationFields.description(),
  }),

  // Education item schema
  educationItem: () => ({
    institute_name: ValidationFields.instituteName(),
    degree: ValidationFields.degree(),
    field_of_study: ValidationFields.optionalText(),
    start_date: ValidationFields.optionalDate(),
    end_date: ValidationFields.optionalDate(),
    grade: ValidationFields.optionalText(),
    description: ValidationFields.description(),
  }),

  // CA qualification schema
  caQualification: () => ({
    institute_name: ValidationFields.instituteName(),
    completion_year: ValidationFields.completionYear(),
    rank: ValidationFields.optionalText(),
  }),
};

// Form-specific refinements
export const FormRefinements = {
  // Experience refinement - end date required if not current
  experienceEndDate: (data: any) => {
    if (data.experiences) {
      return data.experiences.every((exp: any) => exp.is_current || exp.end_date);
    }
    return true;
  },

  // Professional phone number refinement
  professionalPhoneFormat: (phone: string) => {
    return z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, "Please enter a valid Indian phone number")
      .parse(phone);
  },
};

// Validation error messages
export const ValidationMessages = {
  required: (fieldName: string) => `${fieldName} is required`,
  minLength: (fieldName: string, length: number) => `${fieldName} must be at least ${length} characters`,
  maxLength: (fieldName: string, length: number) => `${fieldName} must be less than ${length} characters`,
  email: (fieldName = "email") => `Please enter a valid ${fieldName}`,
  phone: () => "Please enter a valid phone number",
  selection: (fieldName: string) => `Please select a ${fieldName.toLowerCase()}`,
  arrayMinLength: (fieldName: string, length: number) => `Select at least ${length} ${fieldName.toLowerCase()}`,
  positiveNumber: (fieldName: string) => `${fieldName} must be 0 or more`,
  invalidFormat: (fieldName: string) => `Invalid ${fieldName.toLowerCase()} format`,
  futureDate: () => "Cannot be a future date",
  pastDate: () => "Cannot be a past date",
};