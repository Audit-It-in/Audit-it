"use client";

import React from "react";
import { MapPinIcon, StarIcon, ClockIcon, CheckCircleIcon, ChatCircleIcon } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileCardHeaderProps {
  fullName: string;
  initials: string;
  location?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  rating: number;
  responseTime: string;
  showContactButton: boolean;
  onContactClick: (e: React.MouseEvent) => void;
}

export const ProfileCardHeader: React.FC<ProfileCardHeaderProps> = ({
  fullName,
  initials,
  location,
  avatarUrl,
  isVerified,
  rating,
  responseTime,
  showContactButton,
  onContactClick,
}) => {
  return (
    <div className='flex items-start gap-4'>
      <div className='relative'>
        <div className='p-1 rounded-full shadow-neumorphic-inset bg-gradient-to-br from-primary-100 to-accent-100'>
          <Avatar className='h-16 w-16 shadow-neumorphic-sm'>
            <AvatarImage src={avatarUrl} alt={fullName} className='object-cover' />
            <AvatarFallback className='bg-gradient-to-br from-primary-200 to-accent-200 text-primary-800 font-bold text-lg'>
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {isVerified && (
          <div className='absolute -bottom-1 -right-1 p-1 rounded-full shadow-neumorphic-sm bg-white border border-accent-200/50'>
            <CheckCircleIcon className='h-5 w-5 text-accent-600' weight='fill' />
          </div>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='space-y-2'>
          <h3 className='font-bold text-lg text-primary-900 truncate'>{fullName || "Chartered Accountant"}</h3>

          {location && (
            <div className='flex items-center gap-2'>
              <div className='p-1 rounded-full shadow-neumorphic-inset bg-primary-100/50'>
                <MapPinIcon className='h-3 w-3 text-primary-600' weight='bold' />
              </div>
              <span className='text-sm text-primary-700 font-medium truncate'>{location}</span>
            </div>
          )}

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

      {showContactButton && (
        <Button
          size='sm'
          onClick={onContactClick}
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
  );
};


