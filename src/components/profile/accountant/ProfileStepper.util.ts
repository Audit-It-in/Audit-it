import { PROFILE_STEP_ORDER, PROFILE_STEP_WEIGHTS } from "@/src/constants/profile-step.constants";
import { Profile, ProfileStep } from "@/src/types/profile.type";

export function getCompletedStepsFromProfile(profile: Profile): ProfileStep[] {
  const byOrder = [...PROFILE_STEP_ORDER];

  if (profile.last_completed_section) {
    const lastIndex = byOrder.indexOf(profile.last_completed_section as ProfileStep);
    if (lastIndex >= 0) return byOrder.slice(0, lastIndex + 1);
  }

  const steps: ProfileStep[] = [];
  if (profile.first_name && profile.username && profile.state_id && profile.district_id) {
    steps.push(ProfileStep.PERSONAL_INFO);
  }
  return steps;
}

export function calculateProgress(completedSteps: Set<ProfileStep>): number {
  const totalWeight = PROFILE_STEP_ORDER.reduce((sum, step) => sum + PROFILE_STEP_WEIGHTS[step], 0);
  const completedWeight = Array.from(completedSteps).reduce((sum, step) => sum + (PROFILE_STEP_WEIGHTS[step] || 0), 0);
  return Math.round((completedWeight / totalWeight) * 100);
}

export function syncUrlWithStep(targetStep: ProfileStep) {
  const url = new URL(window.location.href);
  url.searchParams.set("step", targetStep);
  window.history.replaceState({}, "", url.toString());
}
