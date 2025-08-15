"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Loader } from "@/src/components/common/Loader.component";
import { useProfilePictureUrl } from "@/src/services/upload.service";
import Link from "next/link";
import { cn } from "@/src/helpers/tailwind.helper";
import { useAccountantProfile } from "@/src/services/accountant-discovery.service";
import { useExperiences, useEducations, useVerification } from "@/src/services/profile.service";
import { useAuth } from "@/src/hooks/useAuth";
import type { ProfileDetails } from "@/src/types/profile.type";
import { LoadingAction } from "@/src/types/ui.type";
import { ContactRequestModal } from "@/src/components/contact-requests/ContactRequestModal.component";
import { ProfileNav } from "./profile/ProfileNav.component";
import { ProfileHeader } from "./profile/ProfileHeader.component";
import { ProfileHighlights } from "./profile/ProfileHighlights.component";
import { ExperienceList } from "./profile/ExperienceList.component";
import { EducationList } from "./profile/EducationList.component";
import { SidebarDetails } from "./profile/SidebarDetails.component";
import { ProfileCTA } from "./profile/ProfileCTA.component";

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
  const { data: educations = [] } = useEducations(profile?.id);
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
    return (
      <div className={cn("space-y-6", className)}>
        {/* Breadcrumb Navigation */}
        <nav className='flex items-center space-x-2 text-sm text-neutral-600 mb-4'>
          <Link href='/accountants' className='hover:text-primary-600 transition-colors'>
            Find CAs
          </Link>
          <span>/</span>
          <span className='capitalize'>{state.replace("-", " ")}</span>
          <span>/</span>
          <span className='capitalize'>{district.replace("-", " ")}</span>
          <span>/</span>
          <span className='text-neutral-900 font-medium'>{username}</span>
        </nav>

        <Card variant='subtle' className='text-center py-16'>
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-neutral-900'>Chartered Accountant Profile Not Found</h3>
            <p className='text-neutral-600 max-w-md mx-auto'>
              The requested Chartered Accountant profile could not be found. It may have been removed or the URL is
              incorrect.
            </p>
            <div className='flex gap-3 justify-center'>
              <Button variant='outline' onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button asChild>
                <Link href='/accountants'>Browse All CAs</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
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
          <Card className='shadow-neumorphic-md border border-primary-100 bg-white'>
            <div className='p-6 space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-8 bg-primary-500 rounded-full shadow-neumorphic-sm'></div>
                <h2 className='text-2xl font-bold text-primary-900'>Professional Summary</h2>
              </div>
              <div className='p-4 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-primary-100'>
                {profile.bio ? (
                  <p className='text-primary-800 leading-relaxed font-medium'>{profile.bio}</p>
                ) : (
                  <p className='text-primary-700 italic font-medium'>
                    {fullName} is a verified Chartered Accountant providing professional services in {location}.
                  </p>
                )}
              </div>
              <ProfileHighlights
                numExperiences={experiences.length}
                numSpecializations={profile.specialization_names?.length || 0}
                isVerified={isVerified}
                hasWhatsapp={Boolean(profile.whatsapp_available)}
              />
            </div>
          </Card>

          <ExperienceList experiences={experiences} />
          <EducationList educations={educations} />
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
