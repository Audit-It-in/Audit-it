"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Loader } from "@/src/components/common/Loader.component";
import { useProfilePictureUrl } from "@/src/services/upload.service";
import Link from "next/link";
import { cn } from "@/src/helpers/tailwind.helper";
import { useAccountantProfile } from "@/src/services/accountant-discovery.service";
import { useExperiences, useVerification } from "@/src/services/profile.service";
import { useAuth } from "@/src/hooks/useAuth";
import type { ProfileDetails } from "@/src/types/profile.type";
import { LoadingAction } from "@/src/types/ui.type";
import { ContactRequestModal } from "@/src/components/contact-requests/ContactRequestModal.component";
import { ProfileNav } from "./profile/ProfileNav.component";
import { ProfileHeader } from "./profile/ProfileHeader.component";

import { SidebarDetails } from "./profile/SidebarDetails.component";
import { ProfileCTA } from "./profile/ProfileCTA.component";
import { ProfessionalAuditTrail } from "./profile/ProfessionalAuditTrail.component";
import { ProfileNotFound } from "./profile/ProfileNotFound.component";

interface AccountantProfileViewProps {
  state: string;
  district: string;
  username: string;
  onContactClick?: (profile: ProfileDetails) => void;
  className?: string;
}

export const AccountantProfileView: React.FC<AccountantProfileViewProps> = ({
  state,
  district,
  username,
  onContactClick,
  className,
}) => {
  // Authentication state
  const { isAuthenticated, isCustomer } = useAuth();

  // Fetch accountant profile data
  const { data: profile, isLoading, error } = useAccountantProfile(state, district, username);
  const { data: experiences = [] } = useExperiences(profile?.id);

  const { data: verification } = useVerification(profile?.id);

  // Prepare hooks/derived state that must be called consistently across renders
  const initials = `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`.toUpperCase();
  const location = [profile?.district_name, profile?.state_name].filter(Boolean).join(", ");

  // Signed URL for avatar (handles private storage path) – call hook unconditionally
  const picturePathOrUrl = profile?.profile_picture_url || "";
  const isAbsoluteUrl = picturePathOrUrl.startsWith("http");
  const { data: signedUrl } = useProfilePictureUrl(isAbsoluteUrl ? undefined : picturePathOrUrl);
  const avatarUrl = isAbsoluteUrl ? picturePathOrUrl : signedUrl;

  // Modal open state (single declaration)
  const [isContactOpen, setIsContactOpen] = React.useState(false);

  if (isLoading) {
    return (
      <Loader
        action={LoadingAction.LOADING}
        title='Loading Accountant Profile'
        subtitle='Getting detailed information about this Chartered Accountant...'
        fullScreen={false}
        className={className}
      />
    );
  }

  if (error || !profile) {
    return <ProfileNotFound state={state} district={district} username={username} className={className} />;
  }

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  // Mock data for features not yet implemented
  const isVerified = !!verification?.verified_at;

  const handleContactClick = () => {
    if (!isAuthenticated) {
      // Redirect to auth page with return URL
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth?returnUrl=${returnUrl}`;
      return;
    }

    if (!isCustomer) {
      // Show message that only customers can contact CAs
      alert("Only customers can send contact requests to Chartered Accountants. Please switch to a customer account.");
      return;
    }

    if (onContactClick && profile) onContactClick(profile);
    setIsContactOpen(true);
  };

  const handleShareProfile = async () => {
    const shareData = {
      title: `${fullName} - Chartered Accountant`,
      text: `Connect with ${fullName}, a verified Chartered Accountant in ${location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard!");
    }
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    jobTitle: "Chartered Accountant",
    description: profile.bio,
    image: avatarUrl || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.district_name,
      addressRegion: profile.state_name,
      addressCountry: "IN",
    },
    knowsAbout: profile.specialization_names,
    email: profile.email,
    telephone: profile.phone,
    url: window.location.href,
    sameAs: [],
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Structured Data for SEO */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <ProfileNav fullName={fullName || username} onBack={() => window.history.back()} onShare={handleShareProfile} />

      <ProfileHeader
        fullName={fullName || "Chartered Accountant"}
        location={location}
        initials={initials}
        avatarUrl={avatarUrl}
        isVerified={isVerified}
        specializations={profile?.specialization_names || []}
        onPrimaryCTA={handleContactClick}
        isAuthenticated={isAuthenticated}
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <ProfessionalAuditTrail
            fullName={fullName}
            location={location}
            bio={profile.bio}
            experiences={experiences}
            isVerified={isVerified}
          />
        </div>

        <SidebarDetails
          specializations={profile.specialization_names}
          languages={profile.language_names}
          verification={verification}
          location={location}
          email={profile.email}
          phone={profile.phone}
          whatsappAvailable={profile.whatsapp_available}
        />
      </div>

      <ProfileCTA isAuthenticated={isAuthenticated} onContactClick={handleContactClick} phone={profile.phone} />

      <ContactRequestModal open={isContactOpen} onClose={() => setIsContactOpen(false)} caProfile={profile} />
    </div>
  );
};
