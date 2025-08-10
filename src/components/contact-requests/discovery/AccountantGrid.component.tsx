"use client";

import React from "react";
import { AccountantProfileCard } from "./AccountantProfileCard.component";
import type { ProfileDetails } from "@/src/types/profile.type";

interface AccountantGridProps {
  profiles: ProfileDetails[];
  onContactClick: (profile: ProfileDetails) => void;
}

export const AccountantGrid: React.FC<AccountantGridProps> = ({ profiles, onContactClick }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {profiles.map((profile, index) => (
        <AccountantProfileCard
          key={`${profile.id}-${index}`}
          profile={profile}
          onContactClick={onContactClick}
          className='h-full'
        />
      ))}
    </div>
  );
};
