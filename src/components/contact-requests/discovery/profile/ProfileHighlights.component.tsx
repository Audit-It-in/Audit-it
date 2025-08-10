"use client";

import React from "react";
import { BriefcaseIcon, CertificateIcon, CheckCircleIcon } from "@phosphor-icons/react";

interface ProfileHighlightsProps {
  numExperiences: number;
  numSpecializations: number;
  isVerified: boolean;
  hasWhatsapp: boolean;
}

export const ProfileHighlights: React.FC<ProfileHighlightsProps> = ({
  numExperiences,
  numSpecializations,
  isVerified,
  hasWhatsapp,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='flex items-center gap-4 p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200/50'>
        <div className='p-3 rounded-full shadow-neumorphic-sm bg-white'>
          <BriefcaseIcon className='h-6 w-6 text-primary-600' weight='bold' />
        </div>
        <div>
          <div className='font-bold text-primary-900 text-lg'>{numExperiences}+ Years</div>
          <div className='text-sm font-medium text-primary-600'>Professional Experience</div>
        </div>
      </div>

      <div className='flex items-center gap-4 p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200/50'>
        <div className='p-3 rounded-full shadow-neumorphic-sm bg-white'>
          <CertificateIcon className='h-6 w-6 text-accent-600' weight='bold' />
        </div>
        <div>
          <div className='font-bold text-accent-900 text-lg'>{numSpecializations}</div>
          <div className='text-sm font-medium text-accent-600'>Service Specializations</div>
        </div>
      </div>

      {isVerified && (
        <div className='flex items-center gap-4 p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-r from-green-50 to-green-100 border border-green-200/50'>
          <div className='p-3 rounded-full shadow-neumorphic-sm bg-white'>
            <CheckCircleIcon className='h-6 w-6 text-green-600' weight='fill' />
          </div>
          <div>
            <div className='font-bold text-green-800 text-lg'>Verified CA</div>
            <div className='text-sm font-medium text-green-600'>ICAI Membership Verified</div>
          </div>
        </div>
      )}

      {hasWhatsapp && (
        <div className='flex items-center gap-4 p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-r from-green-50 to-green-100 border border-green-200/50'>
          <div className='p-3 rounded-full shadow-neumorphic-sm bg-white'>
            <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-neumorphic-sm'>
              <div className='w-3 h-3 bg-white rounded-full'></div>
            </div>
          </div>
          <div>
            <div className='font-bold text-green-800 text-lg'>WhatsApp Ready</div>
            <div className='text-sm font-medium text-green-600'>Quick Communication</div>
          </div>
        </div>
      )}
    </div>
  );
};


