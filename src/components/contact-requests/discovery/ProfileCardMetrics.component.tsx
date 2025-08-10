"use client";

import React from "react";
import { BriefcaseIcon, CertificateIcon } from "@phosphor-icons/react";

interface ProfileCardMetricsProps {
  numSpecializations: number;
}

export const ProfileCardMetrics: React.FC<ProfileCardMetricsProps> = ({ numSpecializations }) => {
  return (
    <div className='grid grid-cols-2 gap-3'>
      <div className='text-center p-3 rounded-lg shadow-neumorphic-inset bg-primary-50/50 border border-primary-200/30'>
        <div className='flex justify-center mb-1'>
          <BriefcaseIcon className='h-4 w-4 text-primary-600' weight='bold' />
        </div>
        <div className='text-xs font-bold text-primary-800'>5+ Years</div>
        <div className='text-xs text-primary-600'>Experience</div>
      </div>

      <div className='text-center p-3 rounded-lg shadow-neumorphic-inset bg-accent-50/50 border border-accent-200/30'>
        <div className='flex justify-center mb-1'>
          <CertificateIcon className='h-4 w-4 text-accent-600' weight='bold' />
        </div>
        <div className='text-xs font-bold text-accent-800'>{numSpecializations}</div>
        <div className='text-xs text-accent-600'>Services</div>
      </div>
    </div>
  );
};


