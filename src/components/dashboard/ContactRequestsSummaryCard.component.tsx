"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";
import { InfoIcon } from "@phosphor-icons/react";

interface ContactRequestsSummaryCardProps {
  title?: string;
  total: number;
  newCount: number;
  replied: number;
  closed: number;
  responseRate: number; // percentage
  averageResponseTimeHours: number;
}

export function ContactRequestsSummaryCard({
  title = "Contact Requests Summary",
  total,
  newCount,
  replied,
  closed,
  responseRate,
  averageResponseTimeHours,
}: ContactRequestsSummaryCardProps) {
  return (
    <Card
      role='region'
      aria-label='Contact Requests Summary'
      className={cn(
        "relative overflow-hidden p-6 rounded-2xl",
        "shadow-neumorphic-xl hover:shadow-neumorphic-primary-xl",
        "border-2 border-primary-100/60 bg-white",
        "transition-all duration-500 neumorphic-optimized"
      )}
    >
      <div className='mb-4'>
        <h3 className='text-lg font-bold text-primary-900'>{title}</h3>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
        <SummaryItem label='Total' value={total} />
        <SummaryItem label='New' value={newCount} />
        <SummaryItem label='Replied' value={replied} />
        <SummaryItem label='Closed' value={closed} />
        <SummaryItem label='Response Rate' value={`${Math.round(responseRate)}%`} />
        <SummaryItem label={<AvgResponseLabel />} value={`${Math.round(averageResponseTimeHours)}h`} />
      </div>
    </Card>
  );
}

function SummaryItem({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className='p-4 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-primary-100/60'>
      <div className='text-xs font-semibold text-neutral-600'>{label}</div>
      <div className='mt-1 text-xl font-bold text-primary-900'>{value}</div>
    </div>
  );
}

function AvgResponseLabel() {
  const [open, setOpen] = React.useState(false);

  return (
    <span className='inline-flex items-center gap-2'>
      Avg Response Time
      <span className='relative inline-block'>
        <button
          type='button'
          aria-label='Average time from request creation to first reply (computed from created_at and replied_at)'
          className='p-1 rounded-full min-h-[28px] min-w-[28px] flex items-center justify-center shadow-neumorphic-sm border-2 border-primary-100/60 bg-white hover:shadow-neumorphic-lg focus:shadow-neumorphic-focus'
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onBlur={() => setOpen(false)}
        >
          <InfoIcon className='h-5 w-5 text-primary-700' weight='bold' />
        </button>
        {open && (
          <div
            role='tooltip'
            className='absolute z-50 left-1/2 -translate-x-1/2 mt-2 max-w-[220px] px-3 py-2 text-[11px] font-semibold text-neutral-800 bg-white border-2 border-primary-100/60 rounded-xl shadow-neumorphic-xl'
          >
            Average time from request creation to first reply. Computed from created_at → replied_at.
          </div>
        )}
      </span>
    </span>
  );
}

export default ContactRequestsSummaryCard;
