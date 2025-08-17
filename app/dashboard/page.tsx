"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { useProfileDetails, useVerification } from "@/src/services/profile.service";
import { useProfilePictureUrl } from "@/src/services/upload.service";
import { cn } from "@/src/helpers/tailwind.helper";
import { APP_CONFIG } from "@/src/constants/app.constants";
import { MapPinIcon, ShieldCheckIcon, WarningCircleIcon, PencilSimpleIcon, EyeIcon } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { Loader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";
import { StatusMessage as StatusMessageComponent } from "@/src/components/common/StatusMessage.component";
import { StatusMessageType } from "@/src/types/common.type";
import { toSlug } from "@/src/helpers/slug.helper";

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
  const { user, profile, isAuthenticated, authLoading } = useAuth();
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
          <div className='mb-8'>
            <Badge className='mb-4'>Welcome to {APP_CONFIG.name}</Badge>
            <h1 className='text-3xl font-bold text-neutral-900 mb-2'>
              Welcome back, {profile?.first_name || user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className='text-lg text-neutral-600'>Great to see you again. Here&apos;s your dashboard overview.</p>
          </div>

          <Card
            role='region'
            aria-label='Dashboard Profile'
            className={cn(
              "relative overflow-hidden p-6 mb-8 rounded-2xl",
              "shadow-neumorphic-xl hover:shadow-neumorphic-primary-xl",
              "border-2 border-primary-100/60 bg-white",
              "transition-all duration-500 neumorphic-optimized"
            )}
          >
            <div className='flex items-start gap-4'>
              {/* Avatar frame (neumorphic) */}
              <div className='relative flex-shrink-0'>
                <div className='p-2 rounded-full shadow-neumorphic-inset-deep bg-primary-50/60 border border-primary-200/40'>
                  <div className='p-1 rounded-full shadow-neumorphic-lg bg-white'>
                    <Avatar
                      className='h-16 w-16 border-3 border-white/80'
                      verified={!verificationLoading && Boolean(verification?.verified_at)}
                      verifiedLabel='Verified'
                      stampPosition='bottom-right'
                    >
                      <AvatarImage src={isAbsoluteUrl ? picturePathOrUrl : signedAvatarUrl} alt='Profile picture' />
                      <AvatarFallback className='bg-primary-200 text-primary-900 font-bold'>
                        {(profile?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                {/* Verified overlay handled inside Avatar now */}
              </div>

              {/* Identity + meta */}
              <div className='flex-1 min-w-0'>
                <div className='flex flex-wrap items-start gap-2'>
                  <h3 className='text-xl font-bold text-primary-900 truncate'>
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : user?.email?.split("@")[0] || "User"}
                  </h3>
                  {profile?.username && (
                    <span className='px-2 py-0.5 rounded-lg shadow-neumorphic-inset bg-neutral-50 border border-neutral-200/60 text-xs font-semibold text-neutral-800'>
                      @{profile.username}
                    </span>
                  )}
                </div>

                {/* Location */}
                <div className='mt-2'>
                  {!detailsLoading && (details?.state_name || details?.district_name) ? (
                    <div className='flex items-center gap-2 w-fit px-3 py-1.5 rounded-xl shadow-neumorphic-inset bg-white border border-primary-200/50'>
                      <div className='p-1 rounded-full shadow-neumorphic-sm bg-white'>
                        <MapPinIcon className='h-3.5 w-3.5 text-primary-700' weight='bold' />
                      </div>
                      <span className='text-xs font-semibold text-primary-800 truncate'>
                        {[details?.district_name, details?.state_name].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  ) : (
                    <div className='h-6 w-40 rounded-lg shadow-neumorphic-inset bg-neutral-100 border border-neutral-200/60 animate-pulse' />
                  )}
                </div>

                {/* Status row: verification + completion */}
                <div className='mt-3 flex flex-wrap items-center gap-2'>
                  {/* Verification chip (owner view); hide while loading to avoid shift) */}
                  {!verificationLoading && (
                    <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-neutral-200/70 shadow-neumorphic-sm bg-white text-xs font-semibold text-neutral-800'>
                      {verification?.verified_at ? (
                        <>
                          <ShieldCheckIcon className='h-3.5 w-3.5 text-primary-700' weight='bold' />
                          Verified
                        </>
                      ) : verification ? (
                        <>
                          <WarningCircleIcon className='h-3.5 w-3.5 text-yellow-600' weight='bold' />
                          Pending verification
                        </>
                      ) : (
                        <>
                          <WarningCircleIcon className='h-3.5 w-3.5 text-neutral-500' weight='bold' />
                          Not submitted
                        </>
                      )}
                    </span>
                  )}

                  {/* Completion badge */}
                  <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-neutral-200/60 text-[11px] font-bold text-primary-900'>
                    Completion: {details?.profile_completion_percentage ?? profile?.profile_completion_percentage ?? 0}%
                  </span>
                </div>

                {/* Actions */}
                <div className='mt-4 flex flex-wrap gap-3'>
                  {(() => {
                    const canView = Boolean(profile?.username && details?.state_name && details?.district_name);
                    const stateSlug = toSlug(details?.state_name || "");
                    const districtSlug = toSlug(details?.district_name || "");
                    const username = profile?.username || "";
                    const publicHref = `/accountants/${stateSlug}/${districtSlug}/${username}`;

                    return (
                      <Button
                        onClick={() => canView && router.push(publicHref)}
                        disabled={!canView}
                        className={cn(
                          "px-4 py-2 rounded-2xl min-h-[44px] text-sm font-bold",
                          "shadow-neumorphic-primary-xl active:shadow-neumorphic-inset focus:shadow-neumorphic-focus",
                          "bg-primary-700 hover:bg-primary-800 text-white border-2 border-primary-500/50"
                        )}
                        aria-label='View public profile'
                        title={!canView ? "Complete Personal Info to enable public profile" : "View Public Profile"}
                      >
                        <span className='flex items-center gap-2'>
                          <EyeIcon className='h-4 w-4' weight='bold' /> View Public Profile
                        </span>
                      </Button>
                    );
                  })()}

                  <Button
                    variant='outline'
                    onClick={() => {
                      const step = (details?.last_completed_section as string) || "personal_info";
                      router.push(`/profile?step=${step}`);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-2xl min-h-[44px] text-sm font-bold",
                      "shadow-neumorphic-lg hover:shadow-neumorphic-xl focus:shadow-neumorphic-focus",
                      "border-2"
                    )}
                    aria-label='Edit profile'
                  >
                    <span className='flex items-center gap-2'>
                      <PencilSimpleIcon className='h-4 w-4' weight='bold' /> Edit Profile
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Card className='p-6 hover:shadow-lg transition-shadow'>
              <h4 className='font-semibold text-neutral-900 mb-2'>Profile Setup</h4>
              <p className='text-sm text-neutral-600 mb-4'>Complete your profile to get better CA recommendations.</p>
              <Button variant='outline' size='sm' onClick={() => router.push("/profile")}>
                Complete Profile
              </Button>
            </Card>

            <Card className='p-6 hover:shadow-lg transition-shadow'>
              <h4 className='font-semibold text-neutral-900 mb-2'>Find CAs</h4>
              <p className='text-sm text-neutral-600 mb-4'>Search for chartered accountants in your area.</p>
              <Button variant='outline' size='sm'>
                Browse CAs
              </Button>
            </Card>

            <Card className='p-6 hover:shadow-lg transition-shadow'>
              <h4 className='font-semibold text-neutral-900 mb-2'>Contact Requests</h4>
              <p className='text-sm text-neutral-600 mb-4'>View and manage your contact requests.</p>
              <Button variant='outline' size='sm' onClick={() => router.push("/dashboard/contact-requests")}>
                View Requests
              </Button>
            </Card>
          </div>

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
