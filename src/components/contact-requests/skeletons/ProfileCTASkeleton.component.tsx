"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileCTASkeletonProps {
  className?: string;
}

export const ProfileCTASkeleton: React.FC<ProfileCTASkeletonProps> = ({ className }) => {
  return (
    <Card
      variant='default'
      className={cn(
        "text-center py-8 bg-white rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-xl",
        className
      )}
    >
      <div className='max-w-2xl mx-auto space-y-4'>
        <div className='h-6 w-64 mx-auto bg-neutral-200 rounded animate-pulse' />
        <div className='h-4 w-80 mx-auto bg-neutral-200 rounded animate-pulse' />
        <div className='flex flex-col sm:flex-row gap-3 justify-center items-center'>
          <div className='h-11 w-48 rounded-2xl bg-primary-200/70 animate-pulse shadow-neumorphic-primary-xl border-2 border-primary-500/50' />
          <div className='h-11 w-40 rounded-2xl bg-neutral-200 animate-pulse shadow-neumorphic-md border border-neutral-300/70 md:hidden' />
        </div>
      </div>
    </Card>
  );
};
