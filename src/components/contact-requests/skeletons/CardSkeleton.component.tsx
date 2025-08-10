"use client";

import React from "react";

export const CardSkeleton: React.FC = () => {
  return (
    <div className='p-6 rounded-xl shadow-neumorphic-sm border border-primary-200/40 bg-gradient-to-br from-white to-primary-50/20 space-y-4'>
      <div className='flex items-start gap-4'>
        <div className='rounded-full h-16 w-16 shadow-neumorphic-inset bg-neutral-100 animate-pulse' />
        <div className='flex-1 space-y-2'>
          <div className='h-4 w-1/3 rounded bg-neutral-200 animate-pulse' />
          <div className='h-3 w-2/3 rounded bg-neutral-200 animate-pulse' />
        </div>
        <div className='h-8 w-24 rounded-full bg-neutral-200 animate-pulse' />
      </div>
      <div className='h-10 w-full rounded bg-neutral-100 animate-pulse' />
      <div className='grid grid-cols-3 gap-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='h-12 rounded-lg shadow-neumorphic-inset bg-neutral-100 animate-pulse' />
        ))}
      </div>
    </div>
  );
};
