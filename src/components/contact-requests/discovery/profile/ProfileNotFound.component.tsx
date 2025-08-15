"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
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
      <nav className='flex items-center space-x-2 text-sm text-neutral-600 mb-4'>
        <Link href='/accountants' className='hover:text-primary-600 transition-colors'>
          Find CAs
        </Link>
        <span>/</span>
        <span className='capitalize'>{state.replace("-", " ")}</span>
        <span>/</span>
        <span className='capitalize'>{district.replace("-", " ")}</span>
        <span>/</span>
        <span className='text-neutral-900 font-medium'>{username}</span>
      </nav>

      <Card variant='subtle' className='text-center py-16'>
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold text-neutral-900'>Chartered Accountant Profile Not Found</h3>
          <p className='text-neutral-600 max-w-md mx-auto'>
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
