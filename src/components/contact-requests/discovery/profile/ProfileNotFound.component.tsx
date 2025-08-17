"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { WarningOctagonIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileNotFoundProps {
  state: string;
  district: string;
  username: string;
  className?: string;
}

export const ProfileNotFound: React.FC<ProfileNotFoundProps> = ({ state, district, username, className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Breadcrumb Navigation */}
      <nav className='flex items-center space-x-2 text-sm text-neutral-700 mb-4' aria-label='Breadcrumb'>
        <Link href='/accountants' className='hover:text-primary-600 transition-colors'>
          Find CAs
        </Link>
        <span>/</span>
        <span className='capitalize text-neutral-800'>{state.replace("-", " ")}</span>
        <span>/</span>
        <span className='capitalize text-neutral-800'>{district.replace("-", " ")}</span>
        <span>/</span>
        <span className='text-neutral-900 font-medium'>{username}</span>
      </nav>

      <Card
        variant='default'
        role='alert'
        aria-live='polite'
        className='text-center py-12 bg-white rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl'
      >
        <div className='space-y-5 max-w-xl mx-auto'>
          <div className='flex justify-center'>
            <div className='p-3 rounded-2xl shadow-neumorphic-inset-deep bg-neutral-50 border-2 border-primary-100/60'>
              <WarningOctagonIcon className='h-6 w-6 text-primary-700' weight='bold' />
            </div>
          </div>
          <h3 className='text-xl font-bold text-primary-900'>Chartered Accountant Profile Not Found</h3>
          <p className='text-primary-800 max-w-md mx-auto'>
            The requested Chartered Accountant profile could not be found. It may have been removed or the URL is
            incorrect.
          </p>
          <div className='flex gap-3 justify-center'>
            <Button variant='outline' onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button asChild>
              <Link href='/accountants'>Browse All CAs</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
