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
} from "@phosphor-icons/react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Separator } from "@/src/components/ui/separator";
import { Loader } from "@/src/components/common/Loader.component";
import { cn } from "@/src/helpers/tailwind.helper";
import { useAccountantProfile } from "@/src/services/accountant-discovery.service";
import { useExperiences, useEducations, useVerification } from "@/src/services/profile.service";
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
      <Card variant='subtle' className={cn("text-center py-16", className)}>
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold text-neutral-900'>Accountant Profile Not Found</h3>
          <p className='text-neutral-600 max-w-md mx-auto'>
            The requested accountant profile could not be found. It may have been removed or the URL is incorrect.
          </p>
          <Button variant='outline' onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </Card>
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
    if (onContactClick) {
      onContactClick(profile);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Card */}
      <Card variant='elevated' className='relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-50/30' />

        <div className='relative space-y-6'>
          {/* Main Profile Info */}
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex-shrink-0'>
              <div className='relative'>
                <Avatar className='h-32 w-32 border-4 border-white shadow-lg'>
                  <AvatarImage src={profile.profile_picture_url} alt={fullName} className='object-cover' />
                  <AvatarFallback className='bg-primary-100 text-primary-700 font-bold text-3xl'>
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Verification Badge */}
                {isVerified && (
                  <div className='absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg'>
                    <CheckCircleIcon className='h-8 w-8 text-accent-600' weight='fill' />
                  </div>
                )}
              </div>
            </div>

            <div className='flex-1 space-y-4'>
              <div>
                <h1 className='text-3xl font-bold text-neutral-900'>{fullName || "Accountant Profile"}</h1>

                {/* Location */}
                {location && (
                  <div className='flex items-center gap-2 mt-2 text-neutral-600'>
                    <MapPinIcon className='h-5 w-5' weight='bold' />
                    <span className='text-lg'>{location}</span>
                  </div>
                )}

                {/* Rating and Stats */}
                <div className='flex items-center gap-6 mt-4'>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={cn("h-5 w-5", i < Math.floor(rating) ? "text-yellow-500" : "text-neutral-300")}
                          weight='fill'
                        />
                      ))}
                    </div>
                    <span className='font-semibold text-neutral-900'>{rating}</span>
                    <span className='text-neutral-600'>({totalReviews} reviews)</span>
                  </div>

                  <div className='flex items-center gap-2 text-neutral-600'>
                    <ClockIcon className='h-5 w-5' weight='bold' />
                    <span>Responds in {responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className='flex flex-wrap gap-3'>
                <Button size='lg' onClick={handleContactClick} className='gap-2' glow='primary'>
                  <ChatCircleIcon className='h-5 w-5' weight='bold' />
                  Contact Accountant
                </Button>

                {profile.phone && (
                  <Button variant='outline' size='lg' className='gap-2'>
                    <PhoneIcon className='h-5 w-5' weight='bold' />
                    Call
                  </Button>
                )}

                {profile.email && (
                  <Button variant='outline' size='lg' className='gap-2'>
                    <EnvelopeIcon className='h-5 w-5' weight='bold' />
                    Email
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-neutral-200'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary-600'>{experiences.length}</div>
              <div className='text-sm text-neutral-600'>Years Experience</div>
            </div>

            <div className='text-center'>
              <div className='text-2xl font-bold text-accent-600'>{profile.specialization_names?.length || 0}</div>
              <div className='text-sm text-neutral-600'>Specializations</div>
            </div>

            <div className='text-center'>
              <div className='text-2xl font-bold text-neutral-700'>{totalReviews}</div>
              <div className='text-sm text-neutral-600'>Client Reviews</div>
            </div>

            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>{profile.whatsapp_available ? "Yes" : "No"}</div>
              <div className='text-sm text-neutral-600'>WhatsApp Available</div>
            </div>
          </div>
        </div>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* About */}
          {profile.bio && (
            <Card>
              <h2 className='text-xl font-semibold text-neutral-900 mb-4'>About</h2>
              <p className='text-neutral-700 leading-relaxed'>{profile.bio}</p>
            </Card>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <Card>
              <h2 className='text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2'>
                <BriefcaseIcon className='h-5 w-5' weight='bold' />
                Experience
              </h2>
              <div className='space-y-4'>
                {experiences.map((exp, index) => (
                  <div key={exp.id}>
                    <div className='space-y-2'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <h3 className='font-semibold text-neutral-900'>{exp.title}</h3>
                          <p className='text-neutral-700'>{exp.company_name}</p>
                          {exp.location && <p className='text-sm text-neutral-600'>{exp.location}</p>}
                        </div>
                        <div className='text-sm text-neutral-600 text-right'>
                          <div className='flex items-center gap-1'>
                            <CalendarIcon className='h-4 w-4' weight='bold' />
                            {exp.start_date && new Date(exp.start_date).getFullYear()}
                            {" - "}
                            {exp.is_current ? "Present" : exp.end_date && new Date(exp.end_date).getFullYear()}
                          </div>
                        </div>
                      </div>

                      {exp.description && <p className='text-neutral-700 text-sm leading-relaxed'>{exp.description}</p>}
                    </div>

                    {index < experiences.length - 1 && <Separator className='mt-4' />}
                  </div>
                ))}
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
    </div>
  );
};
