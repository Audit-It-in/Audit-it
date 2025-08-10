"use client";

import React from "react";
import Link from "next/link";
import {
  MapPinIcon,
  ChatCircleIcon,
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  CertificateIcon,
  BriefcaseIcon,
} from "@phosphor-icons/react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { cn } from "@/src/helpers/tailwind.helper";
import { useProfilePictureUrl } from "@/src/services/upload.service";
import type { ProfileDetails } from "@/src/types/profile.type";

interface AccountantProfileCardProps {
  profile: ProfileDetails;
  className?: string;
  showContactButton?: boolean;
  onContactClick?: (profile: ProfileDetails) => void;
}

export const AccountantProfileCard: React.FC<AccountantProfileCardProps> = ({
  profile,
  className,
  showContactButton = true,
  onContactClick,
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

  // Mock data for features not yet implemented
  const isVerified = !!profile.username; // Simplified verification check
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
        <div className='p-6 space-y-5'>
          {/* Header Section */}
          <div className='flex items-start gap-4'>
            <div className='relative'>
              {/* Neumorphic Avatar Container */}
              <div className='p-1 rounded-full shadow-neumorphic-inset bg-gradient-to-br from-primary-100 to-accent-100'>
                <Avatar className='h-16 w-16 shadow-neumorphic-sm'>
                  <AvatarImage src={avatarUrl} alt={fullName} className='object-cover' />
                  <AvatarFallback className='bg-gradient-to-br from-primary-200 to-accent-200 text-primary-800 font-bold text-lg'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Verification Badge with Neumorphic Effect */}
              {isVerified && (
                <div className='absolute -bottom-1 -right-1 p-1 rounded-full shadow-neumorphic-sm bg-white border border-accent-200/50'>
                  <CheckCircleIcon className='h-5 w-5 text-accent-600' weight='fill' />
                </div>
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <div className='space-y-2'>
                <h3 className='font-bold text-lg text-primary-900 truncate'>{fullName || "Chartered Accountant"}</h3>

                {/* Location with Neumorphic Icon */}
                {location && (
                  <div className='flex items-center gap-2'>
                    <div className='p-1 rounded-full shadow-neumorphic-inset bg-primary-100/50'>
                      <MapPinIcon className='h-3 w-3 text-primary-600' weight='bold' />
                    </div>
                    <span className='text-sm text-primary-700 font-medium truncate'>{location}</span>
                  </div>
                )}

                {/* Rating and Response Time */}
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-1 px-2 py-1 rounded-full shadow-neumorphic-inset bg-yellow-50/80'>
                    <StarIcon className='h-3 w-3 text-yellow-600' weight='fill' />
                    <span className='text-xs font-bold text-yellow-800'>{rating}</span>
                  </div>

                  <div className='flex items-center gap-1 px-2 py-1 rounded-full shadow-neumorphic-inset bg-accent-50/80'>
                    <ClockIcon className='h-3 w-3 text-accent-600' weight='bold' />
                    <span className='text-xs font-medium text-accent-800'>{responseTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Button with Neumorphic Design */}
            {showContactButton && (
              <Button
                size='sm'
                onClick={handleContactClick}
                className={cn(
                  "gap-2 shrink-0 shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
                  "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800",
                  "text-white border-0 transition-all duration-200"
                )}
              >
                <ChatCircleIcon className='h-4 w-4' weight='bold' />
                Contact
              </Button>
            )}
          </div>

          {/* Professional Summary */}
          {profile.bio && (
            <div className='p-3 rounded-lg shadow-neumorphic-inset bg-gradient-to-r from-primary-50/50 to-accent-50/30 border border-primary-200/30'>
              <p className='text-sm text-primary-800/90 line-clamp-2 leading-relaxed font-medium'>{profile.bio}</p>
            </div>
          )}

          {/* Key Metrics */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='text-center p-3 rounded-lg shadow-neumorphic-inset bg-primary-50/50 border border-primary-200/30'>
              <div className='flex justify-center mb-1'>
                <BriefcaseIcon className='h-4 w-4 text-primary-600' weight='bold' />
              </div>
              <div className='text-xs font-bold text-primary-800'>5+ Years</div>
              <div className='text-xs text-primary-600'>Experience</div>
            </div>

            <div className='text-center p-3 rounded-lg shadow-neumorphic-inset bg-accent-50/50 border border-accent-200/30'>
              <div className='flex justify-center mb-1'>
                <CertificateIcon className='h-4 w-4 text-accent-600' weight='bold' />
              </div>
              <div className='text-xs font-bold text-accent-800'>{displaySpecializations.length}</div>
              <div className='text-xs text-accent-600'>Services</div>
            </div>

            <div className='text-center p-3 rounded-lg shadow-neumorphic-inset bg-green-50/50 border border-green-200/30'>
              <div className='flex justify-center mb-1'>
                <div className='w-3 h-3 bg-green-500 rounded-full shadow-neumorphic-sm'></div>
              </div>
              <div className='text-xs font-bold text-green-800'>
                {profile.whatsapp_available ? "Available" : "Email"}
              </div>
              <div className='text-xs text-green-600'>Contact</div>
            </div>
          </div>

          {/* Specializations */}
          {displaySpecializations.length > 0 && (
            <div className='space-y-3'>
              <h4 className='text-sm font-bold text-primary-800 flex items-center gap-2'>
                <div className='w-1 h-4 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full shadow-neumorphic-sm'></div>
                Specializations
              </h4>
              <div className='flex flex-wrap gap-2'>
                {displaySpecializations.map((spec, index) => (
                  <Badge
                    key={index}
                    className={cn(
                      "text-xs font-medium shadow-neumorphic-sm hover:shadow-neumorphic-md transition-all duration-200",
                      "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300/50"
                    )}
                  >
                    {spec}
                  </Badge>
                ))}
                {remainingSpecializations > 0 && (
                  <Badge
                    variant='outline'
                    className={cn(
                      "text-xs shadow-neumorphic-inset bg-neutral-50 text-primary-600 border-primary-300/50"
                    )}
                  >
                    +{remainingSpecializations} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className='flex items-center justify-between pt-3 border-t border-primary-200/50'>
            <div className='flex items-center gap-3 text-xs'>
              {profile.whatsapp_available && (
                <div className='flex items-center gap-1 px-2 py-1 rounded-full shadow-neumorphic-inset bg-green-50'>
                  <div className='w-2 h-2 bg-green-500 rounded-full shadow-neumorphic-sm'></div>
                  <span className='font-medium text-green-700'>WhatsApp</span>
                </div>
              )}

              <span className='text-primary-600/70 font-medium'>
                Since {new Date(profile.created_at).getFullYear()}
              </span>
            </div>

            {/* View Profile Link with Neumorphic Effect */}
            <div className='flex items-center gap-1 px-3 py-1 rounded-full shadow-neumorphic-sm bg-gradient-to-r from-primary-100 to-accent-100 group-hover:shadow-neumorphic-md transition-all duration-200'>
              <span className='text-xs font-bold text-primary-700 group-hover:text-primary-800'>View Profile</span>
              <div className='w-1 h-1 bg-primary-600 rounded-full group-hover:bg-primary-700 transition-colors duration-200'></div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
