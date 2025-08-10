"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";
import { useProfilePictureUrl } from "@/src/services/upload.service";
import type { ProfileDetails } from "@/src/types/profile.type";
import { ProfileCardHeader } from "./ProfileCardHeader.component";
import { ProfileCardMetrics } from "./ProfileCardMetrics.component";
import { ProfileCardFooter } from "./ProfileCardFooter.component";

interface AccountantProfileCardProps {
  profile: ProfileDetails;
  className?: string;
  showContactButton?: boolean;
  onContactClick?: (profile: ProfileDetails) => void;
  verifiedAt?: string | null;
}

export const AccountantProfileCard: React.FC<AccountantProfileCardProps> = ({
  profile,
  className,
  showContactButton = true,
  onContactClick,
  verifiedAt,
}) => {
  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase();
  const city = profile.district_name || "";
  const state = profile.state_name || "";
  const picturePathOrUrl = profile.profile_picture_url || "";
  const isAbsoluteUrl = picturePathOrUrl.startsWith("http");
  const { data: signedUrl } = useProfilePictureUrl(isAbsoluteUrl ? undefined : picturePathOrUrl);
  const avatarUrl = isAbsoluteUrl ? picturePathOrUrl : signedUrl;

  // Generate profile URL
  const profileUrl =
    profile.username && profile.state_name && profile.district_name
      ? `/accountants/${profile.state_name.toLowerCase().replace(/\s+/g, "-")}/${profile.district_name
          .toLowerCase()
          .replace(/\s+/g, "-")}/${profile.username}`
      : "#";

  // Get first few specializations to display
  const displaySpecializations = profile.specialization_names?.slice(0, 5) || [];
  const remainingSpecializations = (profile.specialization_names?.length || 0) - 5;

  // Verification heuristic or provided
  const isVerified = Boolean(verifiedAt) || !!profile.username;

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContactClick) {
      onContactClick(profile);
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer",
        "shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm",
        "bg-white border border-primary-100",
        className
      )}
    >
      <Link href={profileUrl} className='block'>
        <div className='space-y-5'>
          {/* Header */}
          <ProfileCardHeader
            fullName={fullName}
            initials={initials}
            locationCity={city}
            locationState={state}
            avatarUrl={avatarUrl || undefined}
            isVerified={isVerified}
          />

          {/* Specializations immediately after header */}
          {displaySpecializations.length > 0 && (
            <ProfileCardFooter
              displaySpecializations={displaySpecializations}
              remainingSpecializations={remainingSpecializations}
            />
          )}

          <ProfileCardMetrics numSpecializations={displaySpecializations.length} />

          {/* Bio moved to bottom */}
          {profile.bio && (
            <div className='p-3 rounded-lg shadow-neumorphic-inset bg-neutral-50 border border-primary-100'>
              <p className='text-sm text-primary-800/90 line-clamp-2 leading-relaxed font-medium'>{profile.bio}</p>
            </div>
          )}

          {showContactButton && (
            <div className='pt-2'>
              <Link href={profileUrl} onClick={handleContactClick} className='block'>
                <div className='w-full text-center px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-neumorphic-md hover:shadow-neumorphic-lg'>
                  Contact
                </div>
              </Link>
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};
