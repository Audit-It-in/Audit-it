"use client";

import React from "react";
import Link from "next/link";
import { MapPinIcon, ChatCircleIcon, CheckCircleIcon, StarIcon, ClockIcon } from "@phosphor-icons/react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { cn } from "@/src/helpers/tailwind.helper";
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
      variant='default'
      className={cn(
        "group hover:shadow-lg transition-all duration-300 cursor-pointer",
        "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      <Link href={profileUrl} className='block'>
        <div className='space-y-4'>
          {/* Header with Avatar and Basic Info */}
          <div className='flex items-start gap-4'>
            <div className='relative'>
              <Avatar className='h-16 w-16 border-2 border-primary-200'>
                <AvatarImage src={profile.profile_picture_url} alt={fullName} className='object-cover' />
                <AvatarFallback className='bg-primary-100 text-primary-700 font-semibold text-lg'>
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Verification Badge */}
              {isVerified && (
                <div className='absolute -bottom-1 -right-1 bg-white rounded-full p-1'>
                  <CheckCircleIcon className='h-5 w-5 text-accent-600' weight='fill' />
                </div>
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between'>
                <div>
                  <h3 className='font-semibold text-lg text-neutral-900 truncate'>
                    {fullName || "Accountant Profile"}
                  </h3>

                  {/* Location */}
                  {location && (
                    <div className='flex items-center gap-1 mt-1 text-neutral-600'>
                      <MapPinIcon className='h-4 w-4' weight='bold' />
                      <span className='text-sm truncate'>{location}</span>
                    </div>
                  )}

                  {/* Rating and Response Time */}
                  <div className='flex items-center gap-4 mt-2'>
                    <div className='flex items-center gap-1'>
                      <StarIcon className='h-4 w-4 text-yellow-500' weight='fill' />
                      <span className='text-sm font-medium text-neutral-700'>{rating}</span>
                    </div>

                    <div className='flex items-center gap-1 text-neutral-600'>
                      <ClockIcon className='h-4 w-4' weight='bold' />
                      <span className='text-sm'>Responds in {responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                {showContactButton && (
                  <Button size='sm' variant='outline' onClick={handleContactClick} className='gap-2 shrink-0'>
                    <ChatCircleIcon className='h-4 w-4' weight='bold' />
                    Contact
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && <p className='text-sm text-neutral-700 line-clamp-2 leading-relaxed'>{profile.bio}</p>}

          {/* Specializations */}
          {displaySpecializations.length > 0 && (
            <div className='space-y-2'>
              <h4 className='text-sm font-medium text-neutral-800'>Specializations</h4>
              <div className='flex flex-wrap gap-2'>
                {displaySpecializations.map((spec, index) => (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    {spec}
                  </Badge>
                ))}
                {remainingSpecializations > 0 && (
                  <Badge variant='outline' className='text-xs text-neutral-600'>
                    +{remainingSpecializations} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.language_names && profile.language_names.length > 0 && (
            <div className='space-y-2'>
              <h4 className='text-sm font-medium text-neutral-800'>Languages</h4>
              <div className='flex flex-wrap gap-2'>
                {profile.language_names.slice(0, 4).map((lang, index) => (
                  <Badge key={index} variant='outline' className='text-xs'>
                    {lang}
                  </Badge>
                ))}
                {profile.language_names.length > 4 && (
                  <Badge variant='outline' className='text-xs text-neutral-600'>
                    +{profile.language_names.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Footer with additional info */}
          <div className='flex items-center justify-between pt-2 border-t border-neutral-100'>
            <div className='flex items-center gap-4 text-xs text-neutral-500'>
              {profile.whatsapp_available && (
                <span className='flex items-center gap-1'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  WhatsApp Available
                </span>
              )}

              <span>Member since {new Date(profile.created_at).getFullYear()}</span>
            </div>

            {/* View Profile Link */}
            <span className='text-xs text-primary-600 font-medium group-hover:text-primary-700'>View Profile →</span>
          </div>
        </div>
      </Link>
    </Card>
  );
};
