"use client";

import { StarIcon, UsersIcon, ShieldCheckIcon, FlagBannerIcon } from "@phosphor-icons/react";
import { Card } from "@/src/components/ui/card";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 py-2 rounded-xl bg-white border-2 border-primary-100/60 shadow-neumorphic-md text-primary-800 flex items-center gap-2 min-h-[44px]'>
      {children}
    </div>
  );
}

export function TrustBar() {
  return (
    <section aria-label='Trust Bar' className='py-8'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <Card variant='default' className='rounded-2xl border-2 border-primary-100/60 bg-white shadow-neumorphic-xl'>
          <div className='p-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6'>
            <Chip>
              <StarIcon className='h-5 w-5 text-accent-600' weight='fill' />
              <span className='font-semibold'>4.8/5 Average Rating</span>
            </Chip>
            <Chip>
              <UsersIcon className='h-5 w-5 text-primary-600' weight='bold' />
              <span className='font-semibold'>500+ Verified CAs</span>
            </Chip>
            <Chip>
              <ShieldCheckIcon className='h-5 w-5 text-primary-600' weight='bold' />
              <span className='font-semibold'>100% Verified</span>
            </Chip>
            <Chip>
              <FlagBannerIcon className='h-5 w-5 text-accent-600' weight='bold' />
              <span className='font-semibold'>Made in India</span>
            </Chip>
          </div>
        </Card>
      </div>
    </section>
  );
}
