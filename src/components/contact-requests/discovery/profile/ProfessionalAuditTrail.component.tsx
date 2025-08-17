"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { BriefcaseIcon, CalendarIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";

interface Experience {
  id: string | number;
  title?: string | null;
  company_name?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean | null;
  description?: string | null;
}

interface ProfessionalAuditTrailProps {
  fullName: string;
  location: string;
  bio?: string | null;
  experiences: Experience[];
}

export const ProfessionalAuditTrail: React.FC<ProfessionalAuditTrailProps> = ({
  fullName,
  location,
  bio,
  experiences,
}) => {
  return (
    <Card
      variant='default'
      size='default'
      role='region'
      aria-labelledby='professional-audit-trail-heading'
      className='shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl hover:shadow-neumorphic-primary-xl rounded-2xl border-2 border-primary-100/60 neumorphic-optimized transition-neumorphic'
    >
      <div className='p-2 space-y-6'>
        {/* Section Header */}
        <div className='flex items-center gap-3'>
          <div className='w-2 h-6 bg-primary-600 rounded-xl shadow-neumorphic-sm' />
          <h2 id='professional-audit-trail-heading' className='text-xl font-bold text-primary-900'>
            Professional Audit Trail
          </h2>
        </div>

        {/* Bio - solid surface, deep inset */}
        <div
          className={cn(
            "p-4 rounded-2xl shadow-neumorphic-inset-deep bg-neutral-50",
            "border-2 border-primary-100/60 transition-all duration-300 hover:border-primary-200/80"
          )}
        >
          {bio ? (
            <p className='text-primary-800 leading-relaxed font-medium'>{bio}</p>
          ) : (
            <p className='text-primary-700 italic font-medium'>
              {fullName} is a verified Chartered Accountant providing professional services in {location}.
            </p>
          )}
        </div>

        {/* Experience Timeline */}
        {experiences.length > 0 && (
          <div className='space-y-4' role='list' aria-label='Career journey timeline'>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-2xl shadow-neumorphic-inset-deep bg-white border-2 border-primary-100/60'>
                <BriefcaseIcon className='h-5 w-5 text-primary-600' weight='bold' />
              </div>
              <h3 className='text-lg font-bold text-primary-900'>Career Journey</h3>
            </div>

            <div className='relative pl-6'>
              {/* Vertical connector */}
              <div className='absolute left-2 top-0 bottom-0 w-1 rounded-full bg-primary-50 border border-primary-100 shadow-neumorphic-inset-deep' />

              <div className='space-y-4'>
                {experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className='relative' role='listitem'>
                    {/* Node */}
                    <div className='absolute -left-0.5 top-2 h-3 w-3 rounded-full bg-primary-600 border-2 border-white shadow-neumorphic-sm' />

                    <div
                      className={cn(
                        "group transition-all duration-300",
                        "p-4 rounded-2xl shadow-neumorphic-md hover:shadow-neumorphic-lg",
                        "bg-white border-2 border-primary-100/60 hover:border-primary-200/80",
                        "transform hover:scale-105 active:scale-95 focus-within:shadow-neumorphic-focus transition-neumorphic"
                      )}
                    >
                      <div className='space-y-2'>
                        <div className='flex items-start justify-between gap-3'>
                          <div className='space-y-1 flex-1'>
                            <h4 className='font-bold text-primary-900 text-base'>{exp.title || "Professional Role"}</h4>
                            {exp.company_name && (
                              <p className='text-primary-700 font-medium text-sm'>{exp.company_name}</p>
                            )}
                            {exp.location && <p className='text-xs text-primary-600 font-medium'>{exp.location}</p>}
                          </div>
                          <div className='flex items-center gap-2 px-3 py-1 rounded-2xl shadow-neumorphic-inset-deep bg-white border-2 border-primary-100/60'>
                            <CalendarIcon className='h-3 w-3 text-primary-600' weight='bold' />
                            <span className='text-xs font-bold text-primary-800'>
                              {exp.start_date && new Date(exp.start_date).getFullYear()} -{" "}
                              {exp.is_current ? "Present" : exp.end_date && new Date(exp.end_date).getFullYear()}
                            </span>
                          </div>
                        </div>

                        {exp.description && (
                          <p className='text-primary-800 text-xs leading-relaxed font-medium mt-2 p-2 rounded-2xl shadow-neumorphic-inset-deep bg-neutral-50 border-2 border-primary-100/60'>
                            {exp.description.length > 160 ? `${exp.description.substring(0, 160)}...` : exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {experiences.length > 3 && (
                  <div className='ml-0 relative'>
                    <div className='absolute -left-0.5 top-1.5 h-3 w-3 rounded-full bg-accent-600 border-2 border-white shadow-neumorphic-sm' />
                    <div className='p-4 rounded-2xl shadow-neumorphic-inset-deep bg-accent-50 border-2 border-accent-100 text-center'>
                      <p className='text-accent-700 font-semibold text-sm'>
                        + {experiences.length - 3} more position{experiences.length - 3 !== 1 ? "s" : ""} in career
                        history
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verification removed in redesign */}
      </div>
    </Card>
  );
};
