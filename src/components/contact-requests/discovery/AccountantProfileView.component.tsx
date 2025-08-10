"use client";

import React from "react";
import {
  MapPinIcon,
  ChatCircleIcon,
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeIcon,
  CalendarIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CertificateIcon,
  ShareIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Separator } from "@/src/components/ui/separator";
import { Loader } from "@/src/components/common/Loader.component";
import Link from "next/link";
import { cn } from "@/src/helpers/tailwind.helper";
import { useAccountantProfile } from "@/src/services/accountant-discovery.service";
import { useExperiences, useEducations, useVerification } from "@/src/services/profile.service";
import { useAuth } from "@/src/hooks/useAuth";
import type { ProfileDetails } from "@/src/types/profile.type";
import { LoadingAction } from "@/src/types/ui.type";

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
  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase();
  const location = [profile.district_name, profile.state_name].filter(Boolean).join(", ");

  // Mock data for features not yet implemented
  const isVerified = !!verification?.verified_at;
  const rating = 4.5;
  const responseTime = "2 hours";
  const totalReviews = 23;

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

    if (onContactClick && profile) {
      onContactClick(profile);
    }
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
    image: profile.profile_picture_url,
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

      {/* Neumorphic Navigation Header */}
      <div className='flex items-center justify-between mb-6'>
        <nav className='flex items-center space-x-3 p-3 rounded-full shadow-neumorphic-inset bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200/50'>
          <button
            onClick={() => window.history.back()}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200",
              "shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
              "bg-white text-primary-700 hover:text-primary-800 font-medium"
            )}
          >
            <ArrowLeftIcon className='h-4 w-4' weight='bold' />
            Back
          </button>
          <div className='w-1 h-1 bg-primary-400 rounded-full'></div>
          <Link href='/accountants' className='text-primary-600 hover:text-primary-700 font-medium transition-colors'>
            Find CAs
          </Link>
          <div className='w-1 h-1 bg-primary-400 rounded-full'></div>
          <span className='text-primary-800 font-bold capitalize'>{fullName || username}</span>
        </nav>

        <Button
          onClick={handleShareProfile}
          className={cn(
            "gap-2 shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
            "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700",
            "text-white border-0 transition-all duration-200"
          )}
        >
          <ShareIcon className='h-4 w-4' weight='bold' />
          Share Profile
        </Button>
      </div>

      {/* Neumorphic Header Card */}
      <Card
        className={cn(
          "relative overflow-hidden shadow-neumorphic-lg border border-primary-200/50",
          "bg-gradient-to-br from-white via-primary-50/40 to-accent-50/30"
        )}
      >
        {/* Decorative Background Elements */}
        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-full blur-2xl'></div>
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-200/30 to-transparent rounded-full blur-xl'></div>

        <div className='relative p-8 space-y-8'>
          {/* Main Profile Section */}
          <div className='flex flex-col lg:flex-row gap-8'>
            <div className='flex-shrink-0'>
              <div className='relative'>
                {/* Neumorphic Avatar Container */}
                <div className='p-2 rounded-full shadow-neumorphic-inset bg-gradient-to-br from-primary-100 to-accent-100'>
                  <Avatar className='h-32 w-32 shadow-neumorphic-md border-2 border-white/50'>
                    <AvatarImage src={profile.profile_picture_url} alt={fullName} className='object-cover' />
                    <AvatarFallback className='bg-gradient-to-br from-primary-200 to-accent-200 text-primary-800 font-bold text-3xl'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Verification Badge with Neumorphic Effect */}
                {isVerified && (
                  <div className='absolute -bottom-2 -right-2 p-2 rounded-full shadow-neumorphic-md bg-white border border-accent-200/50'>
                    <CheckCircleIcon className='h-8 w-8 text-accent-600' weight='fill' />
                  </div>
                )}
              </div>
            </div>

            <div className='flex-1 space-y-6'>
              <div className='space-y-4'>
                <h1 className='text-4xl font-bold text-primary-900 leading-tight'>
                  {fullName || "Chartered Accountant"}
                </h1>

                {/* Location with Neumorphic Design */}
                {location && (
                  <div className='flex items-center gap-3 p-3 rounded-full shadow-neumorphic-inset bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200/50 w-fit'>
                    <div className='p-2 rounded-full shadow-neumorphic-sm bg-white'>
                      <MapPinIcon className='h-5 w-5 text-primary-600' weight='bold' />
                    </div>
                    <span className='text-lg font-bold text-primary-800'>{location}</span>
                  </div>
                )}

                {/* Rating and Stats with Neumorphic Cards */}
                <div className='flex flex-wrap gap-4'>
                  <div className='flex items-center gap-3 p-3 rounded-full shadow-neumorphic-inset bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200/50'>
                    <div className='flex items-center gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={cn("h-4 w-4", i < Math.floor(rating) ? "text-yellow-600" : "text-yellow-300")}
                          weight='fill'
                        />
                      ))}
                    </div>
                    <span className='font-bold text-yellow-800'>{rating}</span>
                    <span className='text-yellow-700 font-medium'>({totalReviews} reviews)</span>
                  </div>

                  <div className='flex items-center gap-3 p-3 rounded-full shadow-neumorphic-inset bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200/50'>
                    <div className='p-1 rounded-full shadow-neumorphic-sm bg-white'>
                      <ClockIcon className='h-4 w-4 text-accent-600' weight='bold' />
                    </div>
                    <span className='font-bold text-accent-800'>Responds in {responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Contact Actions with Neumorphic Buttons */}
              <div className='flex flex-wrap gap-4'>
                <Button
                  size='lg'
                  onClick={handleContactClick}
                  className={cn(
                    "gap-3 px-8 py-4 shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm",
                    "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800",
                    "text-white border-0 transition-all duration-300 font-bold text-lg"
                  )}
                >
                  <ChatCircleIcon className='h-6 w-6' weight='bold' />
                  {!isAuthenticated ? "Sign In to Contact" : "Contact Accountant"}
                </Button>

                {profile.phone && (
                  <Button
                    size='lg'
                    className={cn(
                      "gap-3 px-6 py-4 shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
                      "bg-white text-primary-700 hover:text-primary-800 border border-primary-200/50",
                      "transition-all duration-300 font-bold"
                    )}
                  >
                    <PhoneIcon className='h-5 w-5' weight='bold' />
                    Call
                  </Button>
                )}

                {profile.email && (
                  <Button
                    size='lg'
                    className={cn(
                      "gap-3 px-6 py-4 shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
                      "bg-white text-accent-700 hover:text-accent-800 border border-accent-200/50",
                      "transition-all duration-300 font-bold"
                    )}
                  >
                    <EnvelopeIcon className='h-5 w-5' weight='bold' />
                    Email
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Neumorphic Stats Cards */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-primary-200/50'>
            <div className='text-center p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/50'>
              <div className='flex justify-center mb-2'>
                <div className='p-2 rounded-full shadow-neumorphic-sm bg-white'>
                  <BriefcaseIcon className='h-6 w-6 text-primary-600' weight='bold' />
                </div>
              </div>
              <div className='text-2xl font-bold text-primary-800'>{experiences.length}+</div>
              <div className='text-sm font-medium text-primary-600'>Years Experience</div>
            </div>

            <div className='text-center p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200/50'>
              <div className='flex justify-center mb-2'>
                <div className='p-2 rounded-full shadow-neumorphic-sm bg-white'>
                  <CertificateIcon className='h-6 w-6 text-accent-600' weight='bold' />
                </div>
              </div>
              <div className='text-2xl font-bold text-accent-800'>{profile.specialization_names?.length || 0}</div>
              <div className='text-sm font-medium text-accent-600'>Specializations</div>
            </div>

            <div className='text-center p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200/50'>
              <div className='flex justify-center mb-2'>
                <div className='p-2 rounded-full shadow-neumorphic-sm bg-white'>
                  <StarIcon className='h-6 w-6 text-yellow-600' weight='fill' />
                </div>
              </div>
              <div className='text-2xl font-bold text-yellow-800'>{totalReviews}</div>
              <div className='text-sm font-medium text-yellow-600'>Client Reviews</div>
            </div>

            <div className='text-center p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-br from-green-50 to-green-100 border border-green-200/50'>
              <div className='flex justify-center mb-2'>
                <div className='p-2 rounded-full shadow-neumorphic-sm bg-white'>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      profile.whatsapp_available ? "bg-green-500" : "bg-neutral-400"
                    )}
                  >
                    <div className='w-3 h-3 bg-white rounded-full'></div>
                  </div>
                </div>
              </div>
              <div className='text-2xl font-bold text-green-800'>
                {profile.whatsapp_available ? "Available" : "Email Only"}
              </div>
              <div className='text-sm font-medium text-green-600'>WhatsApp Status</div>
            </div>
          </div>
        </div>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Neumorphic Professional Summary */}
          <Card className='shadow-neumorphic-md border border-primary-200/50 bg-gradient-to-br from-white to-primary-50/30'>
            <div className='p-6 space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full shadow-neumorphic-sm'></div>
                <h2 className='text-2xl font-bold text-primary-900'>Professional Summary</h2>
              </div>

              <div className='p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-r from-primary-50/50 to-accent-50/30 border border-primary-200/30'>
                {profile.bio ? (
                  <p className='text-primary-800 leading-relaxed font-medium'>{profile.bio}</p>
                ) : (
                  <p className='text-primary-700 italic font-medium'>
                    {fullName} is a verified Chartered Accountant providing professional services in {location}.
                  </p>
                )}
              </div>

              {/* Neumorphic Key Highlights */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center gap-4 p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200/50'>
                  <div className='p-3 rounded-full shadow-neumorphic-sm bg-white'>
                    <BriefcaseIcon className='h-6 w-6 text-primary-600' weight='bold' />
                  </div>
                  <div>
                    <div className='font-bold text-primary-900 text-lg'>{experiences.length}+ Years</div>
                    <div className='text-sm font-medium text-primary-600'>Professional Experience</div>
                  </div>
                </div>

                <div className='flex items-center gap-4 p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200/50'>
                  <div className='p-3 rounded-full shadow-neumorphic-sm bg-white'>
                    <CertificateIcon className='h-6 w-6 text-accent-600' weight='bold' />
                  </div>
                  <div>
                    <div className='font-bold text-accent-900 text-lg'>{profile.specialization_names?.length || 0}</div>
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

                {profile.whatsapp_available && (
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
            </div>
          </Card>

          {/* Neumorphic Experience Section */}
          {experiences.length > 0 && (
            <Card className='shadow-neumorphic-md border border-primary-200/50 bg-gradient-to-br from-white to-primary-50/30'>
              <div className='p-6 space-y-6'>
                <div className='flex items-center gap-3'>
                  <div className='p-3 rounded-full shadow-neumorphic-sm bg-gradient-to-br from-primary-100 to-accent-100'>
                    <BriefcaseIcon className='h-6 w-6 text-primary-600' weight='bold' />
                  </div>
                  <h2 className='text-2xl font-bold text-primary-900'>Professional Experience</h2>
                </div>

                <div className='space-y-4'>
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className='p-4 rounded-xl shadow-neumorphic-inset bg-gradient-to-r from-primary-50/50 to-accent-50/30 border border-primary-200/30'
                    >
                      <div className='space-y-3'>
                        <div className='flex items-start justify-between'>
                          <div className='space-y-1'>
                            <h3 className='font-bold text-primary-900 text-lg'>{exp.title}</h3>
                            <p className='text-primary-700 font-medium'>{exp.company_name}</p>
                            {exp.location && <p className='text-sm text-primary-600 font-medium'>{exp.location}</p>}
                          </div>
                          <div className='flex items-center gap-2 px-3 py-1 rounded-full shadow-neumorphic-inset bg-white border border-primary-200/50'>
                            <CalendarIcon className='h-4 w-4 text-primary-600' weight='bold' />
                            <span className='text-sm font-bold text-primary-800'>
                              {exp.start_date && new Date(exp.start_date).getFullYear()}
                              {" - "}
                              {exp.is_current ? "Present" : exp.end_date && new Date(exp.end_date).getFullYear()}
                            </span>
                          </div>
                        </div>

                        {exp.description && (
                          <p className='text-primary-800 text-sm leading-relaxed font-medium mt-3 p-3 rounded-lg shadow-neumorphic-inset bg-white/50 border border-primary-200/30'>
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <Card>
              <h2 className='text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2'>
                <GraduationCapIcon className='h-5 w-5' weight='bold' />
                Education
              </h2>
              <div className='space-y-4'>
                {educations.map((edu, index) => (
                  <div key={edu.id}>
                    <div className='space-y-2'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <h3 className='font-semibold text-neutral-900'>{edu.degree}</h3>
                          <p className='text-neutral-700'>{edu.institute_name}</p>
                          {edu.field_of_study && <p className='text-sm text-neutral-600'>{edu.field_of_study}</p>}
                        </div>
                        <div className='text-sm text-neutral-600 text-right'>
                          <div className='flex items-center gap-1'>
                            <CalendarIcon className='h-4 w-4' weight='bold' />
                            {edu.start_date && new Date(edu.start_date).getFullYear()}
                            {edu.end_date && ` - ${new Date(edu.end_date).getFullYear()}`}
                          </div>
                          {edu.grade && <div className='mt-1'>Grade: {edu.grade}</div>}
                        </div>
                      </div>

                      {edu.description && <p className='text-neutral-700 text-sm leading-relaxed'>{edu.description}</p>}
                    </div>

                    {index < educations.length - 1 && <Separator className='mt-4' />}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Specializations */}
          {profile.specialization_names && profile.specialization_names.length > 0 && (
            <Card>
              <h3 className='text-lg font-semibold text-neutral-900 mb-4'>Specializations</h3>
              <div className='flex flex-wrap gap-2'>
                {profile.specialization_names.map((spec, index) => (
                  <Badge key={index} variant='secondary'>
                    {spec}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Languages */}
          {profile.language_names && profile.language_names.length > 0 && (
            <Card>
              <h3 className='text-lg font-semibold text-neutral-900 mb-4'>Languages</h3>
              <div className='flex flex-wrap gap-2'>
                {profile.language_names.map((lang, index) => (
                  <Badge key={index} variant='outline'>
                    {lang}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Verification */}
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

          {/* Contact Info */}
          <Card>
            <h3 className='text-lg font-semibold text-neutral-900 mb-4'>Contact Information</h3>
            <div className='space-y-3'>
              {profile.email && (
                <div className='flex items-center gap-3'>
                  <EnvelopeIcon className='h-4 w-4 text-neutral-600' weight='bold' />
                  <span className='text-sm text-neutral-700'>{profile.email}</span>
                </div>
              )}

              {profile.phone && (
                <div className='flex items-center gap-3'>
                  <PhoneIcon className='h-4 w-4 text-neutral-600' weight='bold' />
                  <span className='text-sm text-neutral-700'>{profile.phone}</span>
                </div>
              )}

              <div className='flex items-center gap-3'>
                <GlobeIcon className='h-4 w-4 text-neutral-600' weight='bold' />
                <span className='text-sm text-neutral-700'>{location}</span>
              </div>

              {profile.whatsapp_available && (
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
      </div>

      {/* Call to Action Section */}
      <Card variant='elevated' className='text-center py-8 bg-gradient-to-r from-primary-50 to-accent-50'>
        <div className='max-w-2xl mx-auto space-y-4'>
          <h3 className='text-2xl font-bold text-neutral-900'>Ready to Connect with {fullName}?</h3>
          <p className='text-neutral-700'>
            Get professional CA services for your tax, audit, and compliance needs. Send a contact request to discuss
            your requirements.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center items-center'>
            <Button size='lg' onClick={handleContactClick} className='gap-2' glow='primary'>
              <ChatCircleIcon className='h-5 w-5' weight='bold' />
              {!isAuthenticated ? "Sign In to Contact" : "Send Contact Request"}
            </Button>

            {profile.phone && (
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
    </div>
  );
};
