"use client";

import React from "react";
import {
  MapPinIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ChatCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@phosphor-icons/react";
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
  rating?: number;
  totalReviews?: number;
  responseTime?: string;
  onPrimaryCTA: () => void;
  secondaryPhone?: string | null;
  secondaryEmail?: string | null;
  isAuthenticated: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  location,
  initials,
  avatarUrl,
  isVerified,
  rating = 4.5,
  totalReviews = 0,
  responseTime = "",
  onPrimaryCTA,
  secondaryPhone,
  secondaryEmail,
  isAuthenticated,
}) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden shadow-neumorphic-lg border border-primary-200/50",
        "bg-gradient-to-br from-white via-primary-50/40 to-accent-50/30"
      )}
    >
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-full blur-2xl' />
      <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-200/30 to-transparent rounded-full blur-xl' />

      <div className='relative p-8 space-y-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='flex-shrink-0'>
            <div className='relative'>
              <div className='p-2 rounded-full shadow-neumorphic-inset bg-gradient-to-br from-primary-100 to-accent-100'>
                <Avatar className='h-32 w-32 shadow-neumorphic-md border-2 border-white/50'>
                  <AvatarImage src={avatarUrl || undefined} alt={fullName} className='object-cover' />
                  <AvatarFallback className='bg-gradient-to-br from-primary-200 to-accent-200 text-primary-800 font-bold text-3xl'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              {isVerified && (
                <div className='absolute -bottom-2 -right-2 p-2 rounded-full shadow-neumorphic-md bg-white border border-accent-200/50'>
                  <CheckCircleIcon className='h-8 w-8 text-accent-600' weight='fill' />
                </div>
              )}
            </div>
          </div>

          <div className='flex-1 space-y-6'>
            <div className='space-y-4'>
              <h1 className='text-4xl font-bold text-primary-900 leading-tight'>{fullName}</h1>
              {location && (
                <div className='flex items-center gap-3 p-3 rounded-full shadow-neumorphic-inset bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200/50 w-fit'>
                  <div className='p-2 rounded-full shadow-neumorphic-sm bg-white'>
                    <MapPinIcon className='h-5 w-5 text-primary-600' weight='bold' />
                  </div>
                  <span className='text-lg font-bold text-primary-800'>{location}</span>
                </div>
              )}

              <div className='flex flex-wrap gap-4'>
                <div className='flex items-center gap-3 p-3 rounded-full shadow-neumorphic-inset bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200/50'>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={cn("h-4 w-4", i < Math.floor(rating) ? "text-yellow-600" : "text-yellow-300")}
                        weight='fill'
                      />
                    ))}
                  </div>
                  <span className='font-bold text-yellow-800'>{rating}</span>
                  <span className='text-yellow-700 font-medium'>({totalReviews} reviews)</span>
                </div>
                {responseTime && (
                  <div className='flex items-center gap-3 p-3 rounded-full shadow-neumorphic-inset bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200/50'>
                    <div className='p-1 rounded-full shadow-neumorphic-sm bg-white'>
                      <ClockIcon className='h-4 w-4 text-accent-600' weight='bold' />
                    </div>
                    <span className='font-bold text-accent-800'>Responds in {responseTime}</span>
                  </div>
                )}
              </div>
            </div>

            <div className='flex flex-wrap gap-4'>
              <Button
                size='lg'
                onClick={onPrimaryCTA}
                className={cn(
                  "gap-3 px-8 py-4 shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm",
                  "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800",
                  "text-white border-0 transition-all duration-300 font-bold text-lg"
                )}
              >
                <ChatCircleIcon className='h-6 w-6' weight='bold' />
                {!isAuthenticated ? "Sign In to Contact" : "Contact Accountant"}
              </Button>

              {secondaryPhone && (
                <Button
                  size='lg'
                  className={cn(
                    "gap-3 px-6 py-4 shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
                    "bg-white text-primary-700 hover:text-primary-800 border border-primary-200/50",
                    "transition-all duration-300 font-bold"
                  )}
                >
                  <PhoneIcon className='h-5 w-5' weight='bold' />
                  Call
                </Button>
              )}

              {secondaryEmail && (
                <Button
                  size='lg'
                  className={cn(
                    "gap-3 px-6 py-4 shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
                    "bg-white text-accent-700 hover:text-accent-800 border border-accent-200/50",
                    "transition-all duration-300 font-bold"
                  )}
                >
                  <EnvelopeIcon className='h-5 w-5' weight='bold' />
                  Email
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
