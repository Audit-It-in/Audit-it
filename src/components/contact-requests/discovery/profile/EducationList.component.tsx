"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { CalendarIcon, GraduationCapIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";

interface EducationItem {
  id: string | number;
  institute_name: string;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  grade?: string | null;
  description?: string | null;
}

interface EducationListProps {
  educations: EducationItem[];
}

export const EducationList: React.FC<EducationListProps> = ({ educations }) => {
  if (!educations || educations.length === 0) return null;

  return (
    <Card variant='default' size='default' className='shadow-neumorphic-xl rounded-2xl border-2 border-primary-100/60'>
      <div className='p-2 space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='p-3 rounded-2xl shadow-neumorphic-inset-deep bg-white border-2 border-primary-100/60'>
            <GraduationCapIcon className='h-5 w-5 text-primary-600' weight='bold' />
          </div>
          <h3 className='text-lg font-bold text-primary-900'>Education</h3>
        </div>

        <div className='grid grid-cols-1 gap-4'>
          {educations.map((edu) => {
            const startYear = edu.start_date ? new Date(edu.start_date).getFullYear() : undefined;
            const endYear = edu.end_date ? new Date(edu.end_date).getFullYear() : undefined;
            return (
              <div
                key={edu.id}
                className={cn(
                  "group transition-all duration-300",
                  "p-4 rounded-2xl shadow-neumorphic-md hover:shadow-neumorphic-lg",
                  "bg-white border-2 border-primary-100/60 hover:border-primary-200/80"
                )}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='space-y-1'>
                    <h4 className='font-bold text-primary-900 text-base'>{edu.institute_name}</h4>
                    {(edu.degree || edu.field_of_study) && (
                      <p className='text-primary-700 font-medium text-sm'>
                        {[edu.degree, edu.field_of_study].filter(Boolean).join(" • ")}
                      </p>
                    )}
                    {edu.grade && <p className='text-xs text-primary-600 font-semibold'>Grade: {edu.grade}</p>}
                  </div>
                  <div className='flex items-center gap-2 px-3 py-1 rounded-2xl shadow-neumorphic-inset-deep bg-white border-2 border-primary-100/60'>
                    <CalendarIcon className='h-3 w-3 text-primary-600' weight='bold' />
                    <span className='text-xs font-bold text-primary-800'>
                      {startYear ?? "—"} - {endYear ?? "—"}
                    </span>
                  </div>
                </div>

                {edu.description && (
                  <p className='text-primary-800 text-xs leading-relaxed font-medium mt-2 p-2 rounded-2xl shadow-neumorphic-inset-deep bg-neutral-50 border-2 border-primary-100/60'>
                    {edu.description.length > 160 ? `${edu.description.substring(0, 160)}...` : edu.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
