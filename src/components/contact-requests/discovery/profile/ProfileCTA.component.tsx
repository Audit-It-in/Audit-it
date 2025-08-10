"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ChatCircleIcon, PhoneIcon } from "@phosphor-icons/react";

interface ProfileCTAProps {
  isAuthenticated: boolean;
  onContactClick: () => void;
  phone?: string | null;
}

export const ProfileCTA: React.FC<ProfileCTAProps> = ({ isAuthenticated, onContactClick, phone }) => {
  return (
    <Card variant='elevated' className='text-center py-8 bg-white'>
      <div className='max-w-2xl mx-auto space-y-4'>
        <h3 className='text-2xl font-bold text-neutral-900'>Ready to Connect?</h3>
        <p className='text-neutral-700'>
          Send a contact request to discuss your requirements with this Chartered Accountant.
        </p>
        <div className='flex flex-col sm:flex-row gap-3 justify-center items-center'>
          <Button size='lg' onClick={onContactClick} className='gap-2' glow='primary'>
            <ChatCircleIcon className='h-5 w-5' weight='bold' />
            {!isAuthenticated ? "Sign In to Contact" : "Send Contact Request"}
          </Button>

          {phone && (
            <Button variant='outline' size='lg' className='gap-2'>
              <PhoneIcon className='h-5 w-5' weight='bold' />
              Call Now
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <p className='text-sm text-neutral-600'>
            <a href='/auth' className='text-primary-600 hover:underline'>
              Sign up for free
            </a>{" "}
            to connect with verified Chartered Accountants
          </p>
        )}
      </div>
    </Card>
  );
};


