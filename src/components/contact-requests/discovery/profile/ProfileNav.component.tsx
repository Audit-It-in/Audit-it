"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftIcon, ShareIcon } from "@phosphor-icons/react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileNavProps {
  fullName: string;
  onBack?: () => void;
  onShare?: () => void;
}

export const ProfileNav: React.FC<ProfileNavProps> = ({ fullName, onBack, onShare }) => {
  return (
    <div className='flex items-center justify-between mb-6'>
      <nav className='flex items-center space-x-3 p-3 rounded-full shadow-neumorphic-inset bg-neutral-50 border border-primary-100'>
        <button
          onClick={onBack}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200",
            "shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
            "bg-white text-primary-700 hover:text-primary-800 font-medium"
          )}
          aria-label='Go back'
        >
          <ArrowLeftIcon className='h-4 w-4' weight='bold' />
          Back
        </button>
        <div className='w-1 h-1 bg-primary-400 rounded-full' />
        <Link href='/accountants' className='text-primary-600 hover:text-primary-700 font-medium transition-colors'>
          Find CAs
        </Link>
        <div className='w-1 h-1 bg-primary-400 rounded-full' />
        <span className='text-primary-800 font-bold capitalize truncate max-w-[40vw]'>{fullName}</span>
      </nav>

      <Button
        onClick={onShare}
        className={cn(
          "gap-2 shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset bg-accent-600 hover:bg-accent-700 text-white border-0 transition-all duration-200"
        )}
      >
        <ShareIcon className='h-4 w-4' weight='bold' />
        Share Profile
      </Button>
    </div>
  );
};
