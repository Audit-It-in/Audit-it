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
    <div className='flex items-center justify-between mb-4'>
      <nav className='flex items-center space-x-2 p-2 rounded-lg shadow-neumorphic-inset bg-neutral-50/80 border border-primary-100/50'>
        <button
          onClick={onBack}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200",
            "shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
            "bg-white/80 text-primary-600 hover:text-primary-700 text-sm font-medium"
          )}
          aria-label='Go back'
        >
          <ArrowLeftIcon className='h-3.5 w-3.5' weight='bold' />
          Back
        </button>
        <div className='w-0.5 h-0.5 bg-primary-300 rounded-full' />
        <Link
          href='/accountants'
          className='text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors'
        >
          Find CAs
        </Link>
        <div className='w-0.5 h-0.5 bg-primary-300 rounded-full' />
        <span className='text-primary-700 font-semibold text-sm capitalize truncate max-w-[40vw]'>{fullName}</span>
      </nav>

      <Button
        onClick={onShare}
        size='sm'
        className={cn(
          "gap-1.5 px-3 py-2 text-xs shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
          "bg-accent-600 hover:bg-accent-700 text-white border-0 transition-all duration-200 rounded-lg"
        )}
      >
        <ShareIcon className='h-3.5 w-3.5' weight='bold' />
        Share Profile
      </Button>
    </div>
  );
};
