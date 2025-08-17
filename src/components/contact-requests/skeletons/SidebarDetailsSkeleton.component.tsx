"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";

interface SidebarDetailsSkeletonProps {
  className?: string;
}

export const SidebarDetailsSkeleton: React.FC<SidebarDetailsSkeletonProps> = ({ className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      <Card variant='default' className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-xl bg-white'>
        <div className='p-2'>
          <div className='h-5 w-40 bg-neutral-200 rounded animate-pulse mb-3' />
          <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className='h-6 rounded-xl bg-neutral-200 animate-pulse shadow-neumorphic-inset' />
            ))}
          </div>
        </div>
      </Card>

      <Card variant='default' className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-xl bg-white'>
        <div className='p-2'>
          <div className='h-5 w-32 bg-neutral-200 rounded animate-pulse mb-3' />
          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className='h-6 w-16 rounded-xl bg-neutral-200 animate-pulse shadow-neumorphic-inset' />
            ))}
          </div>
        </div>
      </Card>

      <Card variant='default' className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-xl bg-white'>
        <div className='p-2 space-y-3'>
          <div className='h-5 w-48 bg-neutral-200 rounded animate-pulse' />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className='flex items-center gap-3 px-3 py-2 rounded-xl shadow-neumorphic-inset bg-white border border-neutral-200/60'
            >
              <div className='h-4 w-4 bg-neutral-200 rounded animate-pulse' />
              <div className='h-4 w-40 bg-neutral-200 rounded animate-pulse' />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
