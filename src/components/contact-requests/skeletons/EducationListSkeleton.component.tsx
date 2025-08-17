"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";

interface EducationListSkeletonProps {
  className?: string;
  count?: number;
}

export const EducationListSkeleton: React.FC<EducationListSkeletonProps> = ({ className, count = 2 }) => {
  return (
    <Card
      variant='default'
      size='default'
      className={cn("shadow-neumorphic-xl rounded-2xl border-2 border-primary-100/60 bg-white", className)}
    >
      <div className='p-2 space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='p-3 rounded-2xl shadow-neumorphic-inset-deep bg-white border-2 border-primary-100/60'>
            <div className='h-5 w-5 bg-neutral-200 rounded animate-pulse' />
          </div>
          <div className='h-5 w-32 bg-neutral-200 rounded animate-pulse' />
        </div>

        <div className='grid grid-cols-1 gap-4'>
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className='p-4 rounded-2xl shadow-neumorphic-md bg-white border-2 border-primary-100/60'>
              <div className='flex items-start justify-between gap-3'>
                <div className='space-y-2'>
                  <div className='h-4 w-2/3 bg-neutral-200 rounded animate-pulse' />
                  <div className='h-3 w-1/2 bg-neutral-200 rounded animate-pulse' />
                  <div className='h-3 w-24 bg-neutral-200 rounded animate-pulse' />
                </div>
                <div className='flex items-center gap-2 px-3 py-1 rounded-2xl shadow-neumorphic-inset-deep bg-white border-2 border-primary-100/60'>
                  <div className='h-3 w-16 bg-neutral-200 rounded animate-pulse' />
                </div>
              </div>
              <div className='h-3 w-10/12 bg-neutral-200 rounded animate-pulse mt-2' />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
