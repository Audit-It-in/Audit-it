"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { WarningCircleIcon, WifiSlashIcon, ArrowClockwiseIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileErrorStateProps {
  message?: string;
  onRetry: () => void;
  className?: string;
}

export const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({ message, onRetry, className }) => {
  const isOffline = typeof navigator !== "undefined" && navigator && navigator.onLine === false;

  return (
    <Card
      variant='default'
      role='alert'
      aria-live='polite'
      className={cn(
        "text-center py-12 bg-white rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl",
        className
      )}
    >
      <div className='space-y-5 max-w-xl mx-auto'>
        <div className='flex justify-center'>
          <div className='p-3 rounded-2xl shadow-neumorphic-inset-deep bg-neutral-50 border-2 border-primary-100/60'>
            {isOffline ? (
              <WifiSlashIcon className='h-6 w-6 text-primary-700' weight='bold' />
            ) : (
              <WarningCircleIcon className='h-6 w-6 text-primary-700' weight='bold' />
            )}
          </div>
        </div>
        <h3 className='text-xl font-bold text-primary-900'>
          {isOffline ? "You are offline" : "We couldn’t load this profile"}
        </h3>
        <p className='text-primary-800 max-w-md mx-auto'>
          {isOffline
            ? "Please check your internet connection and try again."
            : message || "Something went wrong while fetching the profile. Please try again."}
        </p>
        <div className='flex gap-3 justify-center'>
          <Button
            variant='primary'
            onClick={onRetry}
            className='gap-2 rounded-xl focus:shadow-neumorphic-focus shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-inset'
          >
            <ArrowClockwiseIcon className='h-4 w-4' weight='bold' />
            Retry
          </Button>
        </div>
      </div>
    </Card>
  );
};
