"use client";

import React from "react";
import { MapPinIcon, CheckCircleIcon, ChatCircleIcon } from "@phosphor-icons/react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileHeaderProps {
  fullName: string;
  location?: string;
  initials: string;
  avatarUrl?: string | null;
  isVerified?: boolean;
  specializations?: string[];
  onPrimaryCTA: () => void;
  isAuthenticated: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  location,
  initials,
  avatarUrl,
  isVerified,
  specializations = [],
  onPrimaryCTA,
  isAuthenticated,
}) => {
  // Get first 5 specializations for display (3 in first row, 2 in second row)
  const displaySpecializations = specializations.slice(0, 5);

  return (
    <Card variant='enhanced' size='default'>
      <div className='flex gap-6'>
        {/* Left Side: Profile Picture + Name + Location - Equal Width */}
        <div className='flex-1 flex gap-3 items-start'>
          {/* Enhanced Profile Picture with deeper neumorphic effect */}
          <div className='relative flex-shrink-0 group'>
            {/* Outer neumorphic frame with enhanced depth */}
            <div className='p-2 rounded-full shadow-neumorphic-inset-deep bg-gradient-to-br from-primary-50/80 via-white to-primary-100/60 border border-primary-200/40'>
              {/* Inner neumorphic frame */}
              <div className='p-1 rounded-full shadow-neumorphic-lg bg-gradient-to-br from-white to-primary-50/30'>
                <Avatar className='h-34 w-34 shadow-neumorphic-primary-lg border-3 border-white/80 transition-all duration-300 group-hover:shadow-neumorphic-accent-lg'>
                  <AvatarImage src={avatarUrl || undefined} alt={fullName} className='object-cover' />
                  <AvatarFallback className='bg-gradient-to-br from-primary-200 via-primary-300 to-primary-400 text-primary-900 font-bold text-lg shadow-inner'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            {isVerified && (
              <div className='absolute -bottom-2 -right-2 rounded-full shadow-neumorphic-accent-xl bg-gradient-to-br from-accent-500 to-accent-700 ring-4 ring-white p-1.5 transform hover:scale-110 transition-all duration-300'>
                <CheckCircleIcon className='h-4 w-4 text-white drop-shadow-sm' weight='fill' />
              </div>
            )}
          </div>

          {/* Name and Location beside profile picture */}
          <div className='space-y-2 flex-1'>
            <h1 className='text-lg font-bold text-primary-900 leading-tight'>{fullName}</h1>
            {location && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 px-4 py-2 rounded-xl shadow-neumorphic-inset-primary bg-gradient-to-r from-primary-50/80 to-primary-100/60 border border-primary-200/50 w-fit hover:shadow-neumorphic-primary transition-all duration-300'>
                  <div className='p-1 rounded-full shadow-neumorphic-sm bg-white/80'>
                    <MapPinIcon className='h-3 w-3 text-primary-600' weight='bold' />
                  </div>
                  <span className='text-xs font-semibold text-primary-800'>{location.split(", ")[0]}</span>
                </div>
                {location.includes(", ") && (
                  <div className='flex items-center gap-2 px-4 py-2 rounded-xl shadow-neumorphic-inset bg-gradient-to-r from-neutral-50 to-neutral-100/60 border border-neutral-200/50 w-fit ml-6 hover:shadow-neumorphic-md transition-all duration-300'>
                    <span className='text-xs font-semibold text-neutral-700'>{location.split(", ")[1]}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Specializations + Contact Button - Equal Width */}
        <div className='flex-1 space-y-3'>
          {/* Specializations Heading */}
          <h3 className='text-sm font-semibold text-primary-700 uppercase tracking-wide text-center'>
            Specializations
          </h3>

          {/* Specializations Grid: 3 in first row, 2 in second row */}
          {displaySpecializations.length > 0 && (
            <div className='space-y-2'>
              {/* First Row - 3 specializations */}
              <div className='flex gap-2 justify-center'>
                {displaySpecializations.slice(0, 3).map((specialization, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 cursor-default",
                      "shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-inset",
                      "border-2 hover:border-opacity-80 transform hover:scale-110 active:scale-95",
                      // Enhanced color variations with deeper neumorphic effects
                      index % 3 === 0
                        ? "bg-gradient-to-br from-primary-50 via-primary-100/80 to-primary-200/60 border-primary-200/60 text-primary-800 hover:from-primary-100 hover:to-primary-200"
                        : index % 3 === 1
                        ? "bg-gradient-to-br from-accent-50 via-accent-100/80 to-accent-200/60 border-accent-200/60 text-accent-800 hover:from-accent-100 hover:to-accent-200"
                        : "bg-gradient-to-br from-neutral-50 via-neutral-100/80 to-neutral-200/60 border-neutral-200/60 text-neutral-800 hover:from-neutral-100 hover:to-neutral-200"
                    )}
                  >
                    {specialization}
                  </div>
                ))}
              </div>

              {/* Second Row - 2 specializations */}
              {displaySpecializations.length > 3 && (
                <div className='flex gap-2 justify-center'>
                  {displaySpecializations.slice(3, 5).map((specialization, index) => (
                    <div
                      key={index + 3}
                      className={cn(
                        "px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 cursor-default",
                        "shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-inset",
                        "border-2 hover:border-opacity-80 transform hover:scale-110 active:scale-95",
                        // Continue enhanced color pattern
                        index % 2 === 0
                          ? "bg-gradient-to-br from-accent-50 via-accent-100/80 to-accent-200/60 border-accent-200/60 text-accent-800 hover:from-accent-100 hover:to-accent-200"
                          : "bg-gradient-to-br from-primary-50 via-primary-100/80 to-primary-200/60 border-primary-200/60 text-primary-800 hover:from-primary-100 hover:to-primary-200"
                      )}
                    >
                      {specialization}
                    </div>
                  ))}

                  {/* More specializations indicator */}
                  {specializations.length > 5 && (
                    <div className='px-3 py-2 rounded-lg text-xs font-medium border border-dashed border-primary-300 bg-primary-50/30 text-primary-600'>
                      +{specializations.length - 5} more
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Contact Us Button */}
          <div className='pt-2 flex justify-center'>
            <Button
              onClick={onPrimaryCTA}
              className={cn(
                "px-8 py-4 text-sm font-bold relative overflow-hidden group",
                "bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900",
                "text-white shadow-neumorphic-primary-xl hover:shadow-neumorphic-primary-xl",
                "transform hover:scale-110 active:scale-95 transition-all duration-300",
                "rounded-2xl border-2 border-primary-500/50 hover:border-primary-400/60",
                // Enhanced button effects
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                "after:absolute after:inset-0 after:bg-primary-400/20 after:blur-xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300"
              )}
            >
              <span className='relative z-10 flex items-center gap-3'>
                <ChatCircleIcon className='h-5 w-5' weight='bold' />
                {!isAuthenticated ? "Sign In to Contact" : "Contact Us"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
