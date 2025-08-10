"use client";

import React from "react";
import { AccountantProfileView } from "./AccountantProfileView.component";
import type { ProfileDetails } from "@/src/types/profile.type";

interface AccountantProfilePageClientProps {
  state: string;
  district: string;
  username: string;
}

export const AccountantProfilePageClient: React.FC<AccountantProfilePageClientProps> = ({
  state,
  district,
  username,
}) => {
  const handleContactClick = (profile: ProfileDetails) => {
    // This will be implemented when the contact form is created in a later task
    // For now, we'll show a placeholder message
    alert(
      `Contact request functionality will be implemented in the next task. Profile: ${profile.first_name} ${profile.last_name}`
    );
  };

  return (
    <div className='min-h-screen bg-neutral-50'>
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        <AccountantProfileView
          state={state}
          district={district}
          username={username}
          onContactClick={handleContactClick}
        />
      </div>
    </div>
  );
};
