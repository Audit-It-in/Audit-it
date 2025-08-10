"use client";

import React from "react";
import { MapPinIcon, CheckCircleIcon, ChatCircleIcon } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

interface ProfileCardHeaderProps {
  fullName: string;
  initials: string;
  locationCity?: string;
  locationState?: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export const ProfileCardHeader: React.FC<ProfileCardHeaderProps> = ({
  fullName,
  initials,
  locationCity,
  locationState,
  avatarUrl,
  isVerified,
}) => {
  return (
    <div className='flex items-start gap-4'>
      <div className='relative'>
        <div className='p-1 rounded-full shadow-neumorphic-inset bg-white'>
          <Avatar className='h-16 w-16 shadow-neumorphic-sm'>
            <AvatarImage src={avatarUrl} alt={fullName} className='object-cover' />
            <AvatarFallback className='bg-primary-200 text-primary-800 font-bold text-lg'>{initials}</AvatarFallback>
          </Avatar>
        </div>

        {isVerified && (
          <div className='absolute -bottom-1 -right-1 rounded-full shadow-neumorphic-sm bg-accent-600 ring-2 ring-white p-0.5'>
            <CheckCircleIcon className='h-4 w-4 text-white' weight='fill' />
          </div>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='space-y-2'>
          <h3 className='font-bold text-lg text-primary-900 truncate'>{fullName || "Chartered Accountant"}</h3>

          {(locationCity || locationState) && (
            <div className='flex items-center gap-2'>
              <div className='p-1 rounded-full shadow-neumorphic-inset bg-primary-100/50'>
                <MapPinIcon className='h-4 w-4 text-primary-600' weight='bold' />
              </div>
              <span className='text-sm text-primary-700 font-medium truncate'>
                {locationCity}
                {locationCity && locationState && <br />}
                {locationState}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


