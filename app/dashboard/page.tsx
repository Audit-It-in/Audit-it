"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useProfileDetails, useVerification } from "@/src/services/profile.service";
import { useProfilePictureUrl } from "@/src/services/upload.service";
import { APP_CONFIG } from "@/src/constants/app.constants";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { Loader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";
import { StatusMessage as StatusMessageComponent } from "@/src/components/common/StatusMessage.component";
import { StatusMessageType } from "@/src/types/common.type";
import { toSlug } from "@/src/helpers/slug.helper";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader.component";
import ProfilePreviewCard from "@/src/components/dashboard/ProfilePreviewCard.component";
import RoleAwareCASection from "@/src/components/dashboard/RoleAwareCASection.component";
import RoleAwareCustomerSection from "@/src/components/dashboard/RoleAwareCustomerSection.component";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <Loader
          action={LoadingAction.LOADING}
          title='Loading Dashboard'
          subtitle='Preparing your personalized experience'
        />
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, profile, isAuthenticated, authLoading, isCA, isCustomer } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showCompletion, setShowCompletion] = React.useState(false);

  // Inline data hooks for profile details and verification (owner view)
  const { data: details, isLoading: detailsLoading } = useProfileDetails(user?.id);
  const { data: verification, isLoading: verificationLoading } = useVerification(profile?.id);

  // Avatar signed URL resolution
  const picturePathOrUrl = profile?.profile_picture_url || "";
  const isAbsoluteUrl = Boolean(picturePathOrUrl && picturePathOrUrl.startsWith("http"));
  const { data: signedAvatarUrl } = useProfilePictureUrl(isAbsoluteUrl ? undefined : picturePathOrUrl);

  // Derived UI flags for tiles
  const profileCompletion = details?.profile_completion_percentage ?? profile?.profile_completion_percentage ?? 0;
  const needsProfileSetup = Boolean(
    profileCompletion < 100 || !profile?.username || !details?.state_name || !details?.district_name
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    } else if (!authLoading && isAuthenticated && profile !== undefined) {
      if (!profile || !profile.role) {
        router.push("/role-selection");
      }
    }
  }, [authLoading, isAuthenticated, profile, router]);

  useEffect(() => {
    if (searchParams.get("completed") === "profile") {
      setShowCompletion(true);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  if (authLoading) {
    return (
      <Loader
        action={LoadingAction.LOADING}
        title='Loading Dashboard'
        subtitle='Preparing your personalized experience'
      />
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen bg-neutral-50'>
      <main className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          {showCompletion && (
            <StatusMessageComponent
              message={{ type: StatusMessageType.SUCCESS, text: "Woohoo! profile saved successfully" }}
            />
          )}
          <DashboardHeader
            appName={APP_CONFIG.name}
            name={profile?.first_name || user?.email?.split("@")[0] || "User"}
          />

          <div className='mb-8'>
            <ProfilePreviewCard
              absoluteAvatarUrl={isAbsoluteUrl ? picturePathOrUrl : undefined}
              signedAvatarUrl={!isAbsoluteUrl ? signedAvatarUrl : undefined}
              firstName={profile?.first_name || undefined}
              lastName={profile?.last_name || undefined}
              email={user?.email || undefined}
              username={profile?.username || undefined}
              districtName={!detailsLoading ? details?.district_name || undefined : undefined}
              stateName={!detailsLoading ? details?.state_name || undefined : undefined}
              profileCompletion={details?.profile_completion_percentage ?? profile?.profile_completion_percentage ?? 0}
              verificationStatus={
                verificationLoading
                  ? undefined
                  : verification?.verified_at
                  ? "verified"
                  : verification
                  ? "pending"
                  : "none"
              }
              viewEnabled={Boolean(profile?.username && details?.state_name && details?.district_name)}
              onView={() => {
                const stateSlug = toSlug(details?.state_name || "");
                const districtSlug = toSlug(details?.district_name || "");
                const username = profile?.username || "";
                const publicHref = `/accountants/${stateSlug}/${districtSlug}/${username}`;
                router.push(publicHref);
              }}
              onEdit={() => {
                const step = (details?.last_completed_section as string) || "personal_info";
                router.push(`/profile?step=${step}`);
              }}
            />
          </div>

          {/* Role-aware rail: analytics + preview list */}
          {isCA && profile?.id && <RoleAwareCASection profileId={profile.id} />}
          {isCustomer && profile?.id && <RoleAwareCustomerSection profileId={profile.id} />}

          {(needsProfileSetup || isCustomer) && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {needsProfileSetup && (
                <Card className='p-6 hover:shadow-lg transition-shadow'>
                  <h4 className='font-semibold text-neutral-900 mb-2'>Profile Setup</h4>
                  <p className='text-sm text-neutral-600 mb-4'>
                    Complete your profile to enable your public profile and actions.
                  </p>
                  <Button variant='outline' size='sm' onClick={() => router.push("/profile")}>
                    Complete Profile
                  </Button>
                </Card>
              )}

              {isCustomer && (
                <Card className='p-6 hover:shadow-lg transition-shadow'>
                  <h4 className='font-semibold text-neutral-900 mb-2'>Find CAs</h4>
                  <p className='text-sm text-neutral-600 mb-4'>Search for chartered accountants in your area.</p>
                  <Button variant='outline' size='sm' onClick={() => router.push("/accountants")}>
                    Browse CAs
                  </Button>
                </Card>
              )}
            </div>
          )}

          {process.env.NODE_ENV === "development" && (
            <Card className='p-6 mt-8 bg-neutral-100'>
              <h4 className='font-semibold text-neutral-900 mb-4'>Debug Info (Dev Only)</h4>
              <div className='space-y-2 text-sm'>
                <p>
                  <strong>User ID:</strong> {user?.id}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Profile ID:</strong> {profile?.id || "Not created"}
                </p>
                <p>
                  <strong>Role:</strong> {profile?.role || "Not set"}
                </p>
                <p>
                  <strong>Created:</strong> {user?.created_at}
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
