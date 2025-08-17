"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/helpers/tailwind.helper";
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
        <Card variant='default' className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-xl'>
          <div className='p-2'>
            <h3 className='text-lg font-semibold text-primary-900 mb-3'>Specializations</h3>
            <div className='flex flex-wrap gap-2'>
              {specializations.map((spec, index) => (
                <Badge key={index} variant='tag' className='bg-primary-50 text-primary-800 border-primary-200/60'>
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {languages && languages.length > 0 && (
        <Card variant='default' className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-xl'>
          <div className='p-2'>
            <h3 className='text-lg font-semibold text-primary-900 mb-3'>Languages</h3>
            <div className='flex flex-wrap gap-2'>
              {languages.map((lang, index) => (
                <Badge key={index} variant='outline' className='rounded-xl'>
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {verification && (
        <Card variant='default' className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-xl'>
          <div className='p-2'>
            <h3 className='text-lg font-semibold text-primary-900 mb-3 flex items-center gap-2'>
              <CertificateIcon className='h-5 w-5 text-primary-700' weight='bold' />
              Verification
            </h3>
            <div className='space-y-3'>
              {verification.membership_number && (
                <div className='p-3 rounded-xl shadow-neumorphic-inset-deep bg-neutral-50 border-2 border-primary-100/60'>
                  <span className='text-sm font-medium text-primary-700'>Membership Number:</span>
                  <p className='text-primary-900 font-mono'>{verification.membership_number}</p>
                </div>
              )}

              {verification.verified_at && (
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl",
                    "shadow-neumorphic-inset-deep bg-white border-2 border-accent-100/60"
                  )}
                >
                  <CheckCircleIcon className='h-4 w-4 text-accent-600' weight='fill' />
                  <span className='text-sm font-semibold text-accent-700'>Verified Accountant</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card variant='default' className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-xl'>
        <div className='p-2'>
          <h3 className='text-lg font-semibold text-primary-900 mb-3'>Contact Information</h3>
          <div className='space-y-3'>
            {email && (
              <div className='flex items-center gap-3 px-3 py-2 rounded-xl shadow-neumorphic-inset bg-white border border-neutral-200/60'>
                <EnvelopeIcon className='h-4 w-4 text-primary-700' weight='bold' />
                <span className='text-sm text-primary-800'>{email}</span>
              </div>
            )}

            {phone && (
              <div className='flex items-center gap-3 px-3 py-2 rounded-xl shadow-neumorphic-inset bg-white border border-neutral-200/60'>
                <PhoneIcon className='h-4 w-4 text-primary-700' weight='bold' />
                <span className='text-sm text-primary-800'>{phone}</span>
              </div>
            )}

            <div className='flex items-center gap-3 px-3 py-2 rounded-xl shadow-neumorphic-inset bg-white border border-neutral-200/60'>
              <GlobeIcon className='h-4 w-4 text-primary-700' weight='bold' />
              <span className='text-sm text-primary-800'>{location}</span>
            </div>

            {whatsappAvailable && (
              <div className='flex items-center gap-3 px-3 py-2 rounded-xl shadow-neumorphic-inset bg-white border-2 border-accent-100/60'>
                <div className='w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center'>
                  <div className='w-2 h-2 bg-white rounded-full'></div>
                </div>
                <span className='text-sm text-emerald-700 font-medium'>WhatsApp Available</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};


