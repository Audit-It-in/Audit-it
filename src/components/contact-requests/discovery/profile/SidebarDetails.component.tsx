"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CertificateIcon, EnvelopeIcon, PhoneIcon, GlobeIcon, CheckCircleIcon } from "@phosphor-icons/react";

interface SidebarDetailsProps {
  specializations?: string[] | null;
  languages?: string[] | null;
  verification?: { membership_number?: string | null; verified_at?: string | null } | null;
  location: string;
  email?: string | null;
  phone?: string | null;
  whatsappAvailable?: boolean | null;
}

export const SidebarDetails: React.FC<SidebarDetailsProps> = ({
  specializations,
  languages,
  verification,
  location,
  email,
  phone,
  whatsappAvailable,
}) => {
  return (
    <div className='space-y-6'>
      {specializations && specializations.length > 0 && (
        <Card>
          <h3 className='text-lg font-semibold text-neutral-900 mb-4'>Specializations</h3>
          <div className='flex flex-wrap gap-2'>
            {specializations.map((spec, index) => (
              <Badge key={index} variant='secondary'>
                {spec}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {languages && languages.length > 0 && (
        <Card>
          <h3 className='text-lg font-semibold text-neutral-900 mb-4'>Languages</h3>
          <div className='flex flex-wrap gap-2'>
            {languages.map((lang, index) => (
              <Badge key={index} variant='outline'>
                {lang}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {verification && (
        <Card>
          <h3 className='text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2'>
            <CertificateIcon className='h-5 w-5' weight='bold' />
            Verification
          </h3>
          <div className='space-y-3'>
            {verification.membership_number && (
              <div>
                <span className='text-sm font-medium text-neutral-700'>Membership Number:</span>
                <p className='text-neutral-900 font-mono'>{verification.membership_number}</p>
              </div>
            )}

            {verification.verified_at && (
              <div className='flex items-center gap-2 text-green-600'>
                <CheckCircleIcon className='h-4 w-4' weight='fill' />
                <span className='text-sm font-medium'>Verified Accountant</span>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card>
        <h3 className='text-lg font-semibold text-neutral-900 mb-4'>Contact Information</h3>
        <div className='space-y-3'>
          {email && (
            <div className='flex items-center gap-3'>
              <EnvelopeIcon className='h-4 w-4 text-neutral-600' weight='bold' />
              <span className='text-sm text-neutral-700'>{email}</span>
            </div>
          )}

          {phone && (
            <div className='flex items-center gap-3'>
              <PhoneIcon className='h-4 w-4 text-neutral-600' weight='bold' />
              <span className='text-sm text-neutral-700'>{phone}</span>
            </div>
          )}

          <div className='flex items-center gap-3'>
            <GlobeIcon className='h-4 w-4 text-neutral-600' weight='bold' />
            <span className='text-sm text-neutral-700'>{location}</span>
          </div>

          {whatsappAvailable && (
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-green-500 rounded-full flex items-center justify-center'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
              </div>
              <span className='text-sm text-green-700 font-medium'>WhatsApp Available</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


