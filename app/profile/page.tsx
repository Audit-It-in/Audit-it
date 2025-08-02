"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { Header } from "@/src/components/layout/Header.component";
import { ProfileStepper } from "@/src/components/profile/accountant/ProfileStepper.component";
import { Loader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";
import { ProfileStep } from "@/src/types/profile.type";
import { UserRole } from "@/src/types/auth.type";

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
      // If user is authenticated but doesn't have a role or not an accountant, redirect
      if (!profile || profile.role !== UserRole.ACCOUNTANT) {
        router.push("/role-selection");
      }
    }
  }, [authLoading, isAuthenticated, profile, router]);

  if (authLoading) {
    return (
      <Loader
        action={LoadingAction.LOADING}
        title='Loading Profile Setup'
        subtitle='Preparing your CA profile builder'
      />
    );
  }

  if (!isAuthenticated || !profile || profile.role !== UserRole.ACCOUNTANT) {
    return null;
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <main className='container mx-auto px-4 py-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Page Header */}
          <div className='mb-6'>
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
