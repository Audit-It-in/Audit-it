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
  const location = [profile.district_name, profile.state_name].filter(Boolean).join(", ");
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
  const displaySpecializations = profile.specialization_names?.slice(0, 3) || [];
  const remainingSpecializations = (profile.specialization_names?.length || 0) - 3;

  // Verification heuristic or provided
  const isVerified = Boolean(verifiedAt) || !!profile.username;
  const rating = 4.5; // Mock rating
  const responseTime = "2 hours"; // Mock response time

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
        "bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20",
        "border border-primary-200/50",
        className
      )}
    >
      <Link href={profileUrl} className='block'>
        <div className='space-y-5'>
          <ProfileCardHeader
            fullName={fullName}
            initials={initials}
            location={location}
            avatarUrl={avatarUrl || undefined}
            isVerified={isVerified}
            rating={rating}
            responseTime={responseTime}
            showContactButton={showContactButton}
            onContactClick={handleContactClick}
          />

          {profile.bio && (
            <div className='p-3 rounded-lg shadow-neumorphic-inset bg-gradient-to-r from-primary-50/50 to-accent-50/30 border border-primary-200/30'>
              <p className='text-sm text-primary-800/90 line-clamp-2 leading-relaxed font-medium'>{profile.bio}</p>
            </div>
          )}

          <ProfileCardMetrics
            numSpecializations={displaySpecializations.length}
            hasWhatsapp={Boolean(profile.whatsapp_available)}
          />

          {displaySpecializations.length > 0 && (
            <ProfileCardFooter
              displaySpecializations={displaySpecializations}
              remainingSpecializations={remainingSpecializations}
              createdAtISO={profile.created_at}
              hasWhatsapp={Boolean(profile.whatsapp_available)}
            />
          )}
        </div>
      </Link>
    </Card>
  );
};
