"use client";

import React from "react";
import { UsersIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";
import type { CADiscoveryFilters } from "@/src/types/contact-request.type";

interface ResultsHeaderProps {
  totalCount: number;
  filters: CADiscoveryFilters;
  className?: string;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({ totalCount, filters, className }) => {
  const hasAnyFilter = Boolean(
    filters.searchQuery ||
      filters.location?.stateId ||
      filters.location?.districtId ||
      (filters.specializations?.length || 0) > 0 ||
      (filters.languages?.length || 0) > 0 ||
      filters.verified
  );

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className='flex items-center gap-2'>
        <UsersIcon className='h-5 w-5 text-neutral-600' weight='bold' />
        <span className='text-sm text-neutral-600'>
          {`${totalCount} Chartered Accountant${totalCount !== 1 ? "s" : ""} found`}
        </span>
      </div>

      {hasAnyFilter && (
        <div className='flex items-center gap-2'>
          <span className='hidden sm:inline text-xs text-neutral-500'>Active:</span>
          <div className='hidden sm:flex items-center gap-2 max-w-[60%] overflow-hidden'>
            {[
              filters.searchQuery ? `"${filters.searchQuery}"` : null,
              filters.location?.stateId ? "State" : null,
              filters.location?.districtId ? "District" : null,
              (filters.specializations?.length || 0) > 0 ? `${filters.specializations!.length} services` : null,
              (filters.languages?.length || 0) > 0 ? `${filters.languages!.length} languages` : null,
              filters.verified ? "Verified" : null,
            ]
              .filter(Boolean)
              .slice(0, 4)
              .map((label, idx) => (
                <span
                  key={`chip-${idx}`}
                  className='px-2 py-1 rounded-full shadow-neumorphic-inset bg-primary-50 text-primary-700 text-xs border border-primary-200/50 truncate'
                  title={String(label)}
                >
                  {String(label)}
                </span>
              ))}
          </div>
          <span className='sm:hidden text-xs text-neutral-500'>
            {(filters.specializations?.length || 0) +
              (filters.languages?.length || 0) +
              (filters.searchQuery ? 1 : 0) +
              (filters.location?.stateId ? 1 : 0) +
              (filters.location?.districtId ? 1 : 0) +
              (filters.verified ? 1 : 0)}{" "}
            active
          </span>
        </div>
      )}
    </div>
  );
};
