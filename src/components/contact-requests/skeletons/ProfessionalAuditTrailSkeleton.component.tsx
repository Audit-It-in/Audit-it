"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfessionalAuditTrailSkeletonProps {
  className?: string;
  showTimeline?: boolean;
}

export const ProfessionalAuditTrailSkeleton: React.FC<ProfessionalAuditTrailSkeletonProps> = ({
  className,
  showTimeline = true,
}) => {
  return (
    <Card
      variant='default'
      size='default'
      className={cn("shadow-neumorphic-xl rounded-2xl border-2 border-primary-100/60 bg-white", className)}
    >
      <div className='p-2 space-y-6'>
        <div className='flex items-center gap-3'>
          <div className='w-2 h-6 bg-neutral-200 rounded-xl shadow-neumorphic-sm animate-pulse' />
          <div className='h-5 w-48 bg-neutral-200 rounded animate-pulse' />
        </div>

        <div className='p-4 rounded-2xl shadow-neumorphic-inset-deep bg-neutral-50 border-2 border-primary-100/60'>
          <div className='space-y-2'>
            <div className='h-4 w-11/12 bg-neutral-200 rounded animate-pulse' />
            <div className='h-4 w-10/12 bg-neutral-200 rounded animate-pulse' />
            <div className='h-4 w-9/12 bg-neutral-200 rounded animate-pulse' />
          </div>
        </div>

        {showTimeline && (
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-2xl shadow-neumorphic-inset-deep bg-white border-2 border-primary-100/60'>
                <div className='h-5 w-5 bg-neutral-200 rounded animate-pulse' />
              </div>
              <div className='h-5 w-40 bg-neutral-200 rounded animate-pulse' />
            </div>

            <div className='relative pl-6'>
              <div className='absolute left-2 top-0 bottom-0 w-1 rounded-full bg-neutral-100 border border-neutral-200 shadow-neumorphic-inset-deep' />

              <div className='space-y-4'>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className='relative'>
                    <div className='absolute -left-0.5 top-2 h-3 w-3 rounded-full bg-neutral-300 border-2 border-white shadow-neumorphic-sm' />
                    <div className='p-4 rounded-2xl shadow-neumorphic-md bg-white border-2 border-primary-100/60'>
                      <div className='space-y-3'>
                        <div className='flex items-start justify-between gap-3'>
                          <div className='space-y-2 flex-1'>
                            <div className='h-4 w-2/3 bg-neutral-200 rounded animate-pulse' />
                            <div className='h-3 w-1/3 bg-neutral-200 rounded animate-pulse' />
                            <div className='h-3 w-1/4 bg-neutral-200 rounded animate-pulse' />
                          </div>
                          <div className='flex items-center gap-2 px-3 py-1 rounded-2xl shadow-neumorphic-inset-deep bg-white border-2 border-primary-100/60'>
                            <div className='h-3 w-20 bg-neutral-200 rounded animate-pulse' />
                          </div>
                        </div>
                        <div className='h-3 w-10/12 bg-neutral-200 rounded animate-pulse' />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
