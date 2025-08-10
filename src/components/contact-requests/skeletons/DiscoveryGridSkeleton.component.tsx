"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";

interface DiscoveryGridSkeletonProps {
  count?: number;
  className?: string;
}

export const DiscoveryGridSkeleton: React.FC<DiscoveryGridSkeletonProps> = ({ count = 6, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className={cn("p-6 space-y-4", "shadow-neumorphic-md border border-primary-100 bg-white")}>
          <div className='flex items-start gap-4'>
            <div className='p-1 rounded-full shadow-neumorphic-inset bg-white'>
              <div className='h-16 w-16 rounded-full bg-neutral-200 animate-pulse shadow-neumorphic-sm' />
            </div>
            <div className='flex-1 space-y-3'>
              <div className='h-4 w-2/3 rounded bg-neutral-200 animate-pulse' />
              <div className='h-3 w-1/2 rounded bg-neutral-200 animate-pulse' />
              <div className='flex gap-2'>
                <div className='h-4 w-16 rounded-full bg-neutral-200 animate-pulse' />
                <div className='h-4 w-20 rounded-full bg-neutral-200 animate-pulse' />
              </div>
            </div>
          </div>
          <div className='h-10 rounded-lg bg-neutral-200 animate-pulse shadow-neumorphic-inset' />
        </Card>
      ))}
    </div>
  );
};


