"use client";

import React from "react";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileCardFooterProps {
  displaySpecializations: string[];
  remainingSpecializations: number;
  createdAtISO: string;
  hasWhatsapp: boolean;
}

export const ProfileCardFooter: React.FC<ProfileCardFooterProps> = ({
  displaySpecializations,
  remainingSpecializations,
  createdAtISO,
  hasWhatsapp,
}) => {
  return (
    <div className='space-y-4'>
      <div className='space-y-3'>
        <h4 className='text-sm font-bold text-primary-800 flex items-center gap-2'>
          <div className='w-1 h-4 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full shadow-neumorphic-sm'></div>
          Specializations
        </h4>
        <div className='flex flex-wrap gap-2'>
          {displaySpecializations.map((spec, index) => (
            <Badge
              key={index}
              className={cn(
                "text-xs font-medium shadow-neumorphic-sm hover:shadow-neumorphic-md transition-all duration-200",
                "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300/50"
              )}
            >
              {spec}
            </Badge>
          ))}
          {remainingSpecializations > 0 && (
            <Badge variant='outline' className='text-xs shadow-neumorphic-inset bg-neutral-50 text-primary-600 border-primary-300/50'>
              +{remainingSpecializations} more
            </Badge>
          )}
        </div>
      </div>

      <div className='flex items-center justify-between pt-3 border-t border-primary-200/50'>
        <div className='flex items-center gap-3 text-xs'>
          {hasWhatsapp && (
            <div className='flex items-center gap-1 px-2 py-1 rounded-full shadow-neumorphic-inset bg-green-50'>
              <div className='w-2 h-2 bg-green-500 rounded-full shadow-neumorphic-sm'></div>
              <span className='font-medium text-green-700'>WhatsApp</span>
            </div>
          )}

          <span className='text-primary-600/70 font-medium'>Since {new Date(createdAtISO).getFullYear()}</span>
        </div>

        <div className='flex items-center gap-1 px-3 py-1 rounded-full shadow-neumorphic-sm bg-gradient-to-r from-primary-100 to-accent-100 group-hover:shadow-neumorphic-md transition-all duration-200'>
          <span className='text-xs font-bold text-primary-700 group-hover:text-primary-800'>View Profile</span>
          <div className='w-1 h-1 bg-primary-600 rounded-full group-hover:bg-primary-700 transition-colors duration-200'></div>
        </div>
      </div>
    </div>
  );
};


