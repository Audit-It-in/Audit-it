"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { MapPinIcon, ShieldCheckIcon, WarningCircleIcon, PencilSimpleIcon, EyeIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfilePreviewCardProps {
  signedAvatarUrl?: string;
  absoluteAvatarUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  districtName?: string;
  stateName?: string;
  profileCompletion?: number;
  verificationStatus?: "verified" | "pending" | "none";
  onView?: () => void;
  onEdit?: () => void;
  viewEnabled?: boolean;
}

export function ProfilePreviewCard(props: ProfilePreviewCardProps) {
  const {
    signedAvatarUrl,
    absoluteAvatarUrl,
    firstName,
    lastName,
    email,
    username,
    districtName,
    stateName,
    profileCompletion = 0,
    verificationStatus,
    onView,
    onEdit,
    viewEnabled,
  } = props;

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : email?.split("@")[0] || "User";
  const avatarInitial = (firstName?.[0] || email?.[0] || "U").toUpperCase();
  const isAbsolute = Boolean(absoluteAvatarUrl && absoluteAvatarUrl.startsWith("http"));

  return (
    <Card
      role='region'
      aria-label='Dashboard Profile'
      className={cn(
        "relative overflow-hidden p-6 rounded-2xl",
        "shadow-neumorphic-xl hover:shadow-neumorphic-primary-xl",
        "border-2 border-primary-100/60 bg-white",
        "transition-all duration-500 neumorphic-optimized"
      )}
    >
      <div className='flex items-start gap-4'>
        <div className='relative flex-shrink-0'>
          <div className='p-2 rounded-full shadow-neumorphic-inset-deep bg-primary-50/60 border border-primary-200/40'>
            <div className='p-1 rounded-full shadow-neumorphic-lg bg-white'>
              <Avatar
                className='h-16 w-16 border-3 border-white/80'
                verified={verificationStatus === "verified"}
                verifiedLabel='Verified'
              >
                <AvatarImage src={isAbsolute ? absoluteAvatarUrl : signedAvatarUrl} alt='Profile picture' />
                <AvatarFallback className='bg-primary-200 text-primary-900 font-bold'>{avatarInitial}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex flex-wrap items-start gap-2'>
            <h3 className='text-xl font-bold text-primary-900 truncate'>{displayName}</h3>
            {username && (
              <span className='px-2 py-0.5 rounded-lg shadow-neumorphic-inset bg-neutral-50 border border-neutral-200/60 text-xs font-semibold text-neutral-800'>
                @{username}
              </span>
            )}
          </div>

          <div className='mt-2'>
            {districtName || stateName ? (
              <div className='flex items-center gap-2 w-fit px-3 py-1.5 rounded-xl shadow-neumorphic-inset bg-white border border-primary-200/50'>
                <div className='p-1 rounded-full shadow-neumorphic-sm bg-white'>
                  <MapPinIcon className='h-3.5 w-3.5 text-primary-700' weight='bold' />
                </div>
                <span className='text-xs font-semibold text-primary-800 truncate'>
                  {[districtName, stateName].filter(Boolean).join(", ")}
                </span>
              </div>
            ) : (
              <div className='h-6 w-40 rounded-lg shadow-neumorphic-inset bg-neutral-100 border border-neutral-200/60 animate-pulse' />
            )}
          </div>

          <div className='mt-3 flex flex-wrap items-center gap-2'>
            {verificationStatus && (
              <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-neutral-200/70 shadow-neumorphic-sm bg-white text-xs font-semibold text-neutral-800'>
                {verificationStatus === "verified" ? (
                  <>
                    <ShieldCheckIcon className='h-3.5 w-3.5 text-primary-700' weight='bold' /> Verified
                  </>
                ) : verificationStatus === "pending" ? (
                  <>
                    <WarningCircleIcon className='h-3.5 w-3.5 text-yellow-600' weight='bold' /> Pending verification
                  </>
                ) : (
                  <>
                    <WarningCircleIcon className='h-3.5 w-3.5 text-neutral-500' weight='bold' /> Not submitted
                  </>
                )}
              </span>
            )}

            <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-neutral-200/60 text-[11px] font-bold text-primary-900'>
              Completion: {profileCompletion}%
            </span>
          </div>

          <div className='mt-4 flex flex-wrap gap-3'>
            <Button
              onClick={() => viewEnabled && onView && onView()}
              disabled={!viewEnabled}
              className={cn(
                "px-4 py-2 rounded-2xl min-h-[44px] text-sm font-bold",
                "shadow-neumorphic-primary-xl active:shadow-neumorphic-inset focus:shadow-neumorphic-focus",
                "bg-primary-700 hover:bg-primary-800 text-white border-2 border-primary-500/50"
              )}
              aria-label='View public profile'
              title={!viewEnabled ? "Complete Personal Info to enable public profile" : "View Public Profile"}
            >
              <span className='flex items-center gap-2'>
                <EyeIcon className='h-4 w-4' weight='bold' /> View Public Profile
              </span>
            </Button>

            <Button
              variant='outline'
              onClick={() => onEdit && onEdit()}
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
  );
}

export default ProfilePreviewCard;
