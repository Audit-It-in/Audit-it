"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileHeaderSkeletonProps {
  className?: string;
}

export const ProfileHeaderSkeleton: React.FC<ProfileHeaderSkeletonProps> = ({ className }) => {
  return (
    <Card
      variant='default'
      size='default'
      className={cn(
        "rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-xl bg-white",
        "neumorphic-optimized",
        className
      )}
    >
      <div className='grid grid-cols-12 gap-6 items-start p-2'>
        {/* Left: Avatar + name/location + metrics */}
        <div className='col-span-12 lg:col-span-7 flex gap-4 items-start'>
          <div className='relative flex-shrink-0'>
            <div className='p-2 rounded-full shadow-neumorphic-inset-deep bg-primary-50/80 border border-primary-200/40'>
              <div className='p-1 rounded-full shadow-neumorphic-lg bg-white'>
                <div className='h-34 w-34 rounded-full bg-neutral-200 animate-pulse shadow-neumorphic-sm' />
              </div>
            </div>
          </div>

          <div className='space-y-3 flex-1'>
            <div className='h-5 w-2/3 bg-neutral-200 rounded animate-pulse' />
            <div className='space-y-2'>
              <div className='flex items-center gap-2 px-4 py-2 rounded-xl shadow-neumorphic-inset-primary bg-primary-50 border border-primary-200/50 w-fit'>
                <div className='h-3 w-24 bg-neutral-200 rounded animate-pulse' />
              </div>
              <div className='flex items-center gap-2 px-4 py-2 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-neutral-200/50 w-fit ml-6'>
                <div className='h-3 w-20 bg-neutral-200 rounded animate-pulse' />
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className='px-2.5 py-1.5 rounded-xl shadow-neumorphic-inset bg-white border border-neutral-200/60'
                >
                  <div className='h-3 w-10 bg-neutral-200 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Specializations rail + CTA placeholder */}
        <div className='col-span-12 lg:col-span-5 flex flex-col gap-3 min-h-[180px]'>
          <div className='rounded-2xl shadow-neumorphic-inset-deep bg-neutral-50 border-2 border-primary-100/60 p-3'>
            <div className='flex gap-2 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-2'>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className='px-2.5 py-1.5 rounded-xl shadow-neumorphic-md bg-white border-2 border-primary-100/60'
                >
                  <div className='h-3 w-20 bg-neutral-200 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </div>
          <div className='mt-auto pt-1 flex justify-center'>
            <div className='h-10 w-56 rounded-2xl bg-primary-200/70 animate-pulse shadow-neumorphic-primary-xl border-2 border-primary-500/50' />
          </div>
        </div>
      </div>
    </Card>
  );
};
