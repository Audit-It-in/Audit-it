"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { GraduationCapIcon, CalendarIcon } from "@phosphor-icons/react";

interface EducationItem {
  id: string | number;
  degree?: string | null;
  institute_name?: string | null;
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
    <Card className='shadow-neumorphic-md border border-primary-100 bg-white'>
      <div className='p-6 space-y-6'>
        <div className='flex items-center gap-3'>
          <div className='p-3 rounded-full shadow-neumorphic-sm bg-white'>
            <GraduationCapIcon className='h-6 w-6 text-primary-600' weight='bold' />
          </div>
          <h2 className='text-2xl font-bold text-primary-900'>Education</h2>
        </div>

        <div className='space-y-4'>
          {educations.map((edu, index) => (
            <div key={edu.id}>
              <div className='space-y-2'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='font-semibold text-primary-900'>{edu.degree}</h3>
                    {edu.institute_name && <p className='text-primary-700'>{edu.institute_name}</p>}
                    {edu.field_of_study && <p className='text-sm text-primary-600'>{edu.field_of_study}</p>}
                  </div>
                  <div className='text-sm text-primary-700 text-right flex items-center gap-2 px-3 py-1 rounded-full shadow-neumorphic-inset bg-white border border-primary-200/50'>
                    <CalendarIcon className='h-4 w-4 text-primary-600' weight='bold' />
                    <span>
                      {edu.start_date && new Date(edu.start_date).getFullYear()}
                      {edu.end_date && ` - ${new Date(edu.end_date).getFullYear()}`}
                    </span>
                  </div>
                </div>

                {edu.description && <p className='text-primary-700 text-sm leading-relaxed'>{edu.description}</p>}
                {edu.grade && <div className='text-sm text-primary-700'>Grade: {edu.grade}</div>}
              </div>

              {index < educations.length - 1 && <Separator className='mt-4' />}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};


