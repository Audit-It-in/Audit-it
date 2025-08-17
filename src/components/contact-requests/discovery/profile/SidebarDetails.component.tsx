"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { EnvelopeIcon, PhoneIcon, GlobeIcon } from "@phosphor-icons/react";

interface SidebarDetailsProps {
  languages?: string[] | null;
  specializations?: string[] | null;
  location: string;
  email?: string | null;
  phone?: string | null;
  whatsappAvailable?: boolean | null;
}

export const SidebarDetails: React.FC<SidebarDetailsProps> = ({
  languages,
  specializations,
  location,
  email,
  phone,
  whatsappAvailable,
}) => {
  return (
    <div className='space-y-6'>
      {specializations && specializations.length > 6 && (
        <Card
          id='all-specializations'
          variant='default'
          role='region'
          aria-labelledby='all-specializations-heading'
          className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl hover:shadow-neumorphic-primary-xl neumorphic-optimized transition-neumorphic'
        >
          <div className='p-2'>
            <h3 id='all-specializations-heading' className='text-lg font-semibold text-primary-900 mb-3'>
              All Specializations
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2' role='list' aria-label='All specializations list'>
              {specializations.map((spec, index) => (
                <Badge
                  key={index}
                  role='listitem'
                  variant='tag'
                  className='rounded-xl bg-primary-50 text-primary-800 border-primary-200/60'
                >
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}
      {languages && languages.length > 0 && (
        <Card
          variant='default'
          role='region'
          aria-labelledby='languages-heading'
          className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl hover:shadow-neumorphic-primary-xl neumorphic-optimized transition-neumorphic'
        >
          <div className='p-2'>
            <h3 id='languages-heading' className='text-lg font-semibold text-primary-900 mb-3'>
              Languages
            </h3>
            <div className='flex flex-wrap gap-2' role='list' aria-label='Languages list'>
              {languages.map((lang, index) => (
                <Badge
                  key={index}
                  role='listitem'
                  variant='tag'
                  className='rounded-xl bg-neutral-100 text-neutral-800 border-neutral-300/70 focus:shadow-neumorphic-focus transition-neumorphic'
                >
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card
        variant='default'
        role='region'
        aria-labelledby='contact-information-heading'
        className='rounded-2xl border-2 border-primary-100/60 shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl hover:shadow-neumorphic-primary-xl neumorphic-optimized transition-neumorphic'
      >
        <div className='p-2'>
          <h3 id='contact-information-heading' className='text-lg font-semibold text-primary-900 mb-3'>
            Contact Information
          </h3>
          <div className='space-y-3'>
            {email && (
              <div className='flex items-center gap-3 px-3 py-2 rounded-xl shadow-neumorphic-inset bg-white border border-neutral-200/60 focus-within:shadow-neumorphic-focus transition-neumorphic'>
                <EnvelopeIcon className='h-4 w-4 text-primary-700' weight='bold' />
                <span className='text-sm text-primary-800'>{email}</span>
              </div>
            )}

            {phone && (
              <div className='flex items-center gap-3 px-3 py-2 rounded-xl shadow-neumorphic-inset bg-white border border-neutral-200/60 focus-within:shadow-neumorphic-focus transition-neumorphic'>
                <PhoneIcon className='h-4 w-4 text-primary-700' weight='bold' />
                <span className='text-sm text-primary-800'>{phone}</span>
              </div>
            )}

            <div className='flex items-center gap-3 px-3 py-2 rounded-xl shadow-neumorphic-inset bg-white border border-neutral-200/60 focus-within:shadow-neumorphic-focus transition-neumorphic'>
              <GlobeIcon className='h-4 w-4 text-primary-700' weight='bold' />
              <span className='text-sm text-primary-800'>{location}</span>
            </div>

            {whatsappAvailable && (
              <div className='flex items-center gap-3 px-3 py-2 rounded-xl shadow-neumorphic-inset bg-white border-2 border-accent-100/60 focus-within:shadow-neumorphic-focus transition-neumorphic'>
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
