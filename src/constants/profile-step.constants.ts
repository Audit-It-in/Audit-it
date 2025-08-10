import type React from "react";
import { ProfileStep } from "@/src/types/profile.type";
import { UserIcon, ShieldCheckIcon, BriefcaseIcon, GraduationCapIcon } from "@phosphor-icons/react";

export const PROFILE_STEP_ORDER: ProfileStep[] = [
  ProfileStep.PERSONAL_INFO,
  ProfileStep.VERIFICATION,
  ProfileStep.EXPERIENCE,
  ProfileStep.EDUCATION,
];

export const PROFILE_STEP_WEIGHTS: Record<ProfileStep, number> = {
  [ProfileStep.PERSONAL_INFO]: 40,
  [ProfileStep.VERIFICATION]: 30,
  [ProfileStep.EXPERIENCE]: 20,
  [ProfileStep.EDUCATION]: 10,
};

type IconType = React.ComponentType<{
  className?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}>;

export const PROFILE_STEP_META: Record<
  ProfileStep,
  { title: string; description: string; required: boolean; icon: IconType }
> = {
  [ProfileStep.PERSONAL_INFO]: {
    title: "Personal Info",
    description: "Basic details",
    required: true,
    icon: UserIcon,
  },
  [ProfileStep.VERIFICATION]: {
    title: "CA Verification",
    description: "ICAI credentials",
    required: true,
    icon: ShieldCheckIcon,
  },
  [ProfileStep.EXPERIENCE]: {
    title: "Professional",
    description: "Work experience",
    required: false,
    icon: BriefcaseIcon,
  },
  [ProfileStep.EDUCATION]: {
    title: "Education",
    description: "Academic background",
    required: false,
    icon: GraduationCapIcon,
  },
};
