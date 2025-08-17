"use client";

import React from "react";
import { MapPinIcon, ChatCircleIcon, MedalIcon } from "@phosphor-icons/react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { IconBadge } from "@/src/components/ui/icon-badge";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileHeaderProps {
  fullName: string;
  location?: string;
  initials: string;
  avatarUrl?: string | null;
  specializations?: string[];
  onPrimaryCTA: () => void;
  isAuthenticated: boolean;
  yearsExperience?: number;
  languages?: string[];
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  location,
  initials,
  avatarUrl,
  specializations = [],
  onPrimaryCTA,
  isAuthenticated,
  yearsExperience = 0,
  languages = [],
}) => {
  // Get specializations for header rail (summary)
  const MAX_HEADER_SPECS = 6;
  const displaySpecializations = specializations.slice(0, MAX_HEADER_SPECS);

  const handleViewAllSpecializations = () => {
    const el = document.getElementById("all-specializations");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Card
      variant='default'
      size='default'
      role='region'
      aria-label='Profile header'
      className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl hover:shadow-neumorphic-primary-xl neumorphic-optimized transition-neumorphic'
    >
      <div className='grid grid-cols-12 gap-6 items-start'>
        {/* Left Side: Profile Picture + Name + Location + Metrics */}
        <div className='col-span-12 lg:col-span-7 flex gap-4 items-start'>
          {/* Enhanced Profile Picture with deeper neumorphic effect */}
          <div className='relative flex-shrink-0 group'>
            <div className='p-2 rounded-full shadow-neumorphic-inset-deep bg-primary-50/80 border border-primary-200/40'>
              <div className='p-1 rounded-full shadow-neumorphic-lg bg-white'>
                <Avatar className='h-34 w-34 shadow-neumorphic-primary-lg border-3 border-white/80 transition-all duration-300 group-hover:shadow-neumorphic-accent-lg'>
                  <AvatarImage src={avatarUrl || undefined} alt={fullName} className='object-cover' />
                  <AvatarFallback className='bg-primary-200 text-primary-900 font-bold text-lg shadow-inner'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Name and Location beside profile picture */}
          <div className='space-y-2.5 flex-1'>
            <h1 className='text-lg font-bold text-primary-900 leading-tight'>{fullName}</h1>
            {location && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 px-4 py-2 rounded-xl shadow-neumorphic-inset-primary bg-primary-50 border border-primary-200/50 w-fit transition-all duration-300'>
                  <div className='p-1 rounded-full shadow-neumorphic-sm bg-white'>
                    <MapPinIcon className='h-3 w-3 text-primary-600' weight='bold' />
                  </div>
                  <span className='text-xs font-semibold text-primary-800'>{location.split(", ")[0]}</span>
                </div>
                {location.includes(", ") && (
                  <div className='flex items-center gap-2 px-4 py-2 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-neutral-200/50 w-fit ml-6 transition-all duration-300'>
                    <span className='text-xs font-semibold text-neutral-800'>{location.split(", ")[1]}</span>
                  </div>
                )}
              </div>
            )}

            {/* Metrics row: years of experience + languages */}
            <div className='flex flex-wrap items-center gap-2'>
              <div className='px-2.5 py-1.5 rounded-xl shadow-neumorphic-inset bg-white border border-primary-200/50'>
                <span className='text-[11px] font-bold text-primary-900'>{Math.max(yearsExperience, 0)}+ yrs</span>
              </div>
              {languages.slice(0, 3).map((lang, i) => (
                <div
                  key={i}
                  className='px-2.5 py-1.5 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-neutral-200/60'
                >
                  <span className='text-[11px] font-semibold text-neutral-800'>{lang}</span>
                </div>
              ))}
              {languages.length > 3 && (
                <div className='px-2.5 py-1.5 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-neutral-200/60'>
                  <span className='text-[11px] font-semibold text-neutral-800'>+{languages.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Specializations + CTA Panel */}
        <div
          className='col-span-12 lg:col-span-5 flex flex-col gap-3 min-h-[180px]'
          role='region'
          aria-labelledby='specializations-heading'
        >
          <h3
            id='specializations-heading'
            className='text-xs font-semibold text-primary-700 uppercase tracking-wide text-center'
          >
            Specializations
          </h3>
          {displaySpecializations.length > 0 && (
            <div className='rounded-2xl shadow-neumorphic-inset-deep bg-neutral-50 border-2 border-primary-100/60 p-3 md:p-4'>
              <div
                className='flex gap-2 overflow-x-auto snap-x sm:grid sm:grid-cols-2 sm:gap-2'
                role='list'
                aria-label='Specializations summary'
              >
                {displaySpecializations.map((spec, index) => (
                  <div
                    key={index}
                    role='listitem'
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-300",
                      "shadow-neumorphic-md hover:shadow-neumorphic-lg",
                      "bg-white border-2 border-primary-100/60 hover:border-primary-200/80",
                      "transform hover:scale-105",
                      "snap-start"
                    )}
                  >
                    <IconBadge
                      variant={index % 2 === 0 ? "accent" : "default"}
                      size='sm'
                      className='shrink-0'
                      icon={MedalIcon}
                      showGlow={false}
                    />
                    <span className='text-[11px] font-semibold text-primary-800 truncate'>{spec}</span>
                  </div>
                ))}
                {specializations.length > displaySpecializations.length && (
                  <button
                    type='button'
                    onClick={handleViewAllSpecializations}
                    className='flex items-center justify-center px-3 py-2 rounded-xl shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-inset focus:shadow-neumorphic-focus bg-white border-2 border-neutral-200/70 hover:border-neutral-300/80 transition-neumorphic min-h-[44px]'
                    aria-label='View all specializations'
                  >
                    <span className='text-[11px] font-semibold text-neutral-800'>
                      +{specializations.length - displaySpecializations.length}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Send Contact Request Button anchored bottom */}
          <div className='mt-auto pt-1 flex justify-center'>
            <Button
              onClick={onPrimaryCTA}
              className={cn(
                "px-7 py-3 text-sm font-bold rounded-2xl",
                "text-white",
                "shadow-neumorphic-primary-xl hover:shadow-neumorphic-primary-xl active:shadow-neumorphic-inset focus:shadow-neumorphic-focus",
                "bg-primary-700 hover:bg-primary-800 border-2 border-primary-500/50",
                "transform hover:scale-110 active:scale-95 transition-neumorphic min-h-[44px]"
              )}
              aria-label={!isAuthenticated ? "Sign in to contact" : "Send contact request"}
            >
              <span className='relative z-10 flex items-center gap-2.5'>
                <ChatCircleIcon className='h-5 w-5' weight='bold' />
                {!isAuthenticated ? "Sign In to Contact" : "Send Contact Request"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
