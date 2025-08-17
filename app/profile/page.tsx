"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { ProfileStepper } from "@/src/components/profile/accountant/ProfileStepper.component";
import { CustomerOnboarding } from "@/src/components/profile/customer/CustomerOnboarding.component";
import { Loader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";
import { ProfileStep } from "@/src/types/profile.type";
import { UserRole } from "@/src/types/auth.type";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";

function ProfilePageContent() {
  const { user, profile, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial step from URL or default to personal info
  const initialStep = (searchParams.get("step") as ProfileStep) || ProfileStep.PERSONAL_INFO;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    } else if (!authLoading && isAuthenticated && profile !== undefined) {
      // If user is authenticated but doesn't have a role, redirect to role selection
      if (!profile || !profile.role) {
        router.push("/role-selection");
      }
    }
  }, [authLoading, isAuthenticated, profile, router]);

  if (authLoading) {
    return (
      <Loader action={LoadingAction.LOADING} title='Loading Profile Setup' subtitle='Preparing your profile builder' />
    );
  }

  if (!isAuthenticated || !profile || !profile.role) {
    return null;
  }

  // Customer onboarding (simplified, no header)
  if (profile.role === UserRole.CUSTOMER) {
    return <CustomerOnboarding />;
  }

  // Accountant profile setup (existing flow)
  return (
    <div className='min-h-screen bg-background'>
      <main className='container mx-auto px-4 py-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Page Header */}
          <div className='mb-6'>
            <nav
              role='navigation'
              aria-label='Profile setup navigation'
              className='mb-3 inline-flex items-center space-x-2 p-2 rounded-lg shadow-neumorphic-inset bg-neutral-50/80 border border-primary-100/50'
            >
              <button
                onClick={() => router.back()}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200",
                  "shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset focus:shadow-neumorphic-focus",
                  "bg-white/80 text-primary-600 hover:text-primary-700 text-sm font-medium",
                  "min-h-[44px] transition-neumorphic"
                )}
                aria-label='Go back'
              >
                <ArrowLeftIcon className='h-3.5 w-3.5' weight='bold' />
                Back
              </button>
            </nav>
            <h1 className='text-2xl font-bold text-primary-900 mb-1'>Complete Your CA Profile</h1>
            <p className='text-sm text-neutral-600'>
              Build your professional presence and start connecting with clients
            </p>
          </div>

          {/* Profile Stepper */}
          <ProfileStepper userId={user!.id} initialStep={initialStep} existingProfile={profile} />
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Loader action={LoadingAction.LOADING} title='Loading Profile' subtitle='Please wait...' />}>
      <ProfilePageContent />
    </Suspense>
  );
}
