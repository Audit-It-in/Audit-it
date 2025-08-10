"use client";

import React from "react";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileCardFooterProps {
  displaySpecializations: string[];
  remainingSpecializations: number;
}

export const ProfileCardFooter: React.FC<ProfileCardFooterProps> = ({ displaySpecializations, remainingSpecializations }) => {
  return (
    <div className='space-y-4'>
      <div className='space-y-3'>
        <h4 className='text-sm font-bold text-primary-800 flex items-center gap-2'>
          <div className='w-1 h-4 bg-primary-500 rounded-full shadow-neumorphic-sm'></div>
          Specializations
        </h4>
        <div className='flex flex-wrap gap-2'>
          {displaySpecializations.map((spec, index) => (
            <Badge
              key={index}
              variant='primary'
              className={cn(
                "text-xs font-medium shadow-neumorphic-sm hover:shadow-neumorphic-md transition-all duration-200"
              )}
            >
              {spec}
            </Badge>
          ))}
          {remainingSpecializations > 0 && (
            <Badge
              variant='outline'
              className='text-xs shadow-neumorphic-inset bg-neutral-50 text-primary-600 border-primary-300/50'
            >
              +{remainingSpecializations} more
            </Badge>
          )}
        </div>
      </div>
      {/* Footer meta intentionally removed (no WhatsApp, no Since, View Profile moved to header) */}
    </div>
  );
};


