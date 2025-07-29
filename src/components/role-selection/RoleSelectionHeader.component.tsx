"use client";

import { Badge } from "@/src/components/ui/badge";

export const RoleSelectionHeader = () => {
  return (
    <div className='text-center mb-10 relative'>
      {/* Background decoration */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-primary-100/60 via-primary-200/70 to-accent-100/60 rounded-full blur-3xl opacity-70'></div>
      </div>

      <div className='relative inline-block mb-6'>
        <Badge
          variant='secondary'
          className='bg-gradient-to-r from-primary-100/80 to-accent-100/80 border border-primary-300/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] px-5 py-2 text-sm font-semibold text-primary-700 backdrop-blur-sm'
        >
          ✨ Complete Your Profile
        </Badge>
      </div>

      <div className='space-y-4 max-w-3xl mx-auto'>
        <h1 className='text-4xl sm:text-5xl font-bold leading-tight'>
          <span className='text-neutral-800'>What describes you </span>
          <span className='bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent relative'>
            best?
            <div className='absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400/60 via-primary-600/80 to-accent-400/60 rounded-full'></div>
          </span>
        </h1>

        <p className='text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed'>
          Choose your role to unlock a personalized experience and features designed specifically for your journey.
        </p>
      </div>
    </div>
  );
};
