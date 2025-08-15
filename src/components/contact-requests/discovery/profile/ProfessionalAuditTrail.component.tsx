"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { BriefcaseIcon, CheckCircleIcon, CalendarIcon } from "@phosphor-icons/react";
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
  isVerified: boolean;
}

export const ProfessionalAuditTrail: React.FC<ProfessionalAuditTrailProps> = ({
  fullName,
  location,
  bio,
  experiences,
  isVerified,
}) => {
  return (
    <Card variant='enhanced' size='default'>
      <div className='p-2 space-y-6 relative z-10'>
        {/* Enhanced Section Header with Creative Name */}
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              "w-2 h-6 bg-gradient-to-b from-primary-500 to-primary-700 rounded-xl shadow-neumorphic-sm",
              "relative overflow-hidden",
              "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:rounded-xl"
            )}
          ></div>
          <h2 className='text-xl font-bold text-primary-900'>Professional Audit Trail</h2>
        </div>

        {/* Enhanced Bio Display with Deep Inset Container */}
        <div
          className={cn(
            "p-4 rounded-2xl shadow-neumorphic-inset-deep bg-gradient-to-br from-neutral-50 to-primary-50/30",
            "border-2 border-primary-200/40 relative overflow-hidden transition-all duration-500",
            "hover:shadow-neumorphic-inset-primary hover:border-primary-300/60",
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-primary-100/20 before:opacity-60 before:rounded-2xl"
          )}
        >
          <div className='relative z-10'>
            {bio ? (
              <p className='text-primary-800 leading-relaxed font-medium'>{bio}</p>
            ) : (
              <p className='text-primary-700 italic font-medium'>
                {fullName} is a verified Chartered Accountant providing professional services in {location}.
              </p>
            )}
          </div>
        </div>

        {/* Professional Experience Section - Only show if experiences exist */}
        {experiences.length > 0 && (
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div
                className={cn(
                  "p-3 rounded-2xl shadow-neumorphic-inset-deep bg-white/90 border-2 border-primary-200/40"
                )}
              >
                <BriefcaseIcon className='h-5 w-5 text-primary-600' weight='bold' />
              </div>
              <h3 className='text-lg font-bold text-primary-900'>Career Journey</h3>
            </div>

            <div className='space-y-3'>
              {experiences.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-500",
                    "p-4 rounded-2xl shadow-neumorphic-inset-deep bg-gradient-to-br from-white to-primary-50/30",
                    "border-2 border-primary-200/40 hover:border-primary-300/60",
                    "hover:shadow-neumorphic-inset-primary",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-primary-100/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:rounded-2xl"
                  )}
                >
                  <div className='relative z-10 space-y-2'>
                    <div className='flex items-start justify-between'>
                      <div className='space-y-1 flex-1'>
                        <h4 className='font-bold text-primary-900 text-base group-hover:text-primary-800 transition-colors duration-300'>
                          {exp.title || "Professional Role"}
                        </h4>
                        {exp.company_name && (
                          <p className='text-primary-700 font-medium text-sm group-hover:text-primary-600 transition-colors duration-300'>
                            {exp.company_name}
                          </p>
                        )}
                        {exp.location && (
                          <p className='text-xs text-primary-600 font-medium group-hover:text-primary-500 transition-colors duration-300'>
                            {exp.location}
                          </p>
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-2xl shadow-neumorphic-inset-deep",
                          "bg-white/90 border-2 border-primary-200/40 group-hover:border-primary-300/60 transition-all duration-300"
                        )}
                      >
                        <CalendarIcon className='h-3 w-3 text-primary-600' weight='bold' />
                        <span className='text-xs font-bold text-primary-800'>
                          {exp.start_date && new Date(exp.start_date).getFullYear()} -{" "}
                          {exp.is_current ? "Present" : exp.end_date && new Date(exp.end_date).getFullYear()}
                        </span>
                      </div>
                    </div>

                    {exp.description && (
                      <p className='text-primary-800 text-xs leading-relaxed font-medium mt-3 p-2 rounded-2xl shadow-neumorphic-inset-deep bg-white/60 border-2 border-primary-200/40 group-hover:bg-white/80 transition-all duration-300'>
                        {exp.description.length > 120 ? `${exp.description.substring(0, 120)}...` : exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Show more experiences indicator */}
              {experiences.length > 3 && (
                <div
                  className={cn(
                    "p-4 rounded-2xl shadow-neumorphic-inset-deep bg-gradient-to-br from-accent-50/50 to-accent-100/30",
                    "border-2 border-accent-200/40 text-center relative overflow-hidden",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-accent-100/20 before:opacity-60 before:rounded-2xl"
                  )}
                >
                  <p className='text-accent-700 font-semibold text-sm relative z-10'>
                    + {experiences.length - 3} more position{experiences.length - 3 !== 1 ? "s" : ""} in career history
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compact Metric Cards - Only show verification status */}
        {isVerified && (
          <div className='flex justify-center'>
            <div
              className={cn(
                "group cursor-default relative overflow-hidden transition-all duration-500 neumorphic-optimized",
                "shadow-neumorphic-lg hover:shadow-neumorphic-accent-lg",
                "transform hover:scale-110 active:scale-95",
                "bg-gradient-to-br from-accent-50 via-accent-100/80 to-accent-200/60",
                "border-2 border-accent-200/40 hover:border-accent-300/80",
                "rounded-2xl p-4 max-w-xs",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-accent-100/30 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:rounded-2xl"
              )}
            >
              <div className='flex items-center gap-3 relative z-10'>
                <div
                  className={cn(
                    "p-3 rounded-2xl shadow-neumorphic-inset-deep bg-white/90 border-2 border-accent-200/40",
                    "group-hover:shadow-neumorphic-inset-accent transition-all duration-300"
                  )}
                >
                  <CheckCircleIcon
                    className='h-5 w-5 text-accent-600 group-hover:text-accent-700 transition-colors duration-300'
                    weight='fill'
                  />
                </div>
                <div>
                  <div className='font-bold text-accent-900 text-lg group-hover:text-accent-800 transition-colors duration-300'>
                    Verified CA
                  </div>
                  <div className='text-xs font-semibold text-accent-600 group-hover:text-accent-700 transition-colors duration-300'>
                    ICAI Membership Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
