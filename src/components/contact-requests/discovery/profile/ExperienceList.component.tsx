"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { CalendarIcon, BriefcaseIcon } from "@phosphor-icons/react";

interface ExperienceItem {
  id: string | number;
  title?: string | null;
  company_name?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean | null;
  description?: string | null;
}

interface ExperienceListProps {
  experiences: ExperienceItem[];
}

export const ExperienceList: React.FC<ExperienceListProps> = ({ experiences }) => {
  if (!experiences || experiences.length === 0) return null;

  return (
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
                    <h3 className='font-bold text-primary-900 text-lg'>{exp.title || "Experience"}</h3>
                    {exp.company_name && <p className='text-primary-700 font-medium'>{exp.company_name}</p>}
                    {exp.location && <p className='text-sm text-primary-600 font-medium'>{exp.location}</p>}
                  </div>
                  <div className='flex items-center gap-2 px-3 py-1 rounded-full shadow-neumorphic-inset bg-white border border-primary-200/50'>
                    <CalendarIcon className='h-4 w-4 text-primary-600' weight='bold' />
                    <span className='text-sm font-bold text-primary-800'>
                      {exp.start_date && new Date(exp.start_date).getFullYear()} - {exp.is_current ? "Present" : exp.end_date && new Date(exp.end_date).getFullYear()}
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
  );
};


