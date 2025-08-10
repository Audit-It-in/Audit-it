"use client";

import React from "react";
import { FunnelIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { SearchFilters } from "./SearchFilters.component";
import type { CADiscoveryFilters } from "@/src/types/contact-request.type";

interface MobileFilterSheetProps {
  filters: CADiscoveryFilters;
  onFiltersChange: (filters: CADiscoveryFilters) => void;
}

export const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({ filters, onFiltersChange }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className='lg:hidden'>
      <div className='flex justify-end'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setOpen(true)}
          className='gap-2'
          aria-haspopup='dialog'
          aria-expanded={open}
          aria-controls='mobile-filter-sheet'
        >
          <FunnelIcon className='h-4 w-4' weight='bold' />
          Filters
        </Button>
      </div>

      {open && (
        <div className='fixed inset-0 z-[55]' role='dialog' aria-modal='true' aria-labelledby='mobile-filters-title'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => setOpen(false)}
            aria-hidden='true'
          />
          <div className='absolute inset-x-0 bottom-0 p-4' id='mobile-filter-sheet'>
            <Card className='shadow-neumorphic-lg border border-primary-200/50 bg-gradient-to-br from-white via-primary-50/40 to-accent-50/30'>
              <div className='p-4 space-y-4'>
                <div className='flex items-center justify-between'>
                  <div id='mobile-filters-title' className='font-semibold text-primary-900'>
                    Filters
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setOpen(false)}
                    className='gap-2'
                    aria-label='Close filters'
                  >
                    <XIcon className='h-4 w-4' weight='bold' />
                    Close
                  </Button>
                </div>

                <SearchFilters filters={filters} onFiltersChange={onFiltersChange} />

                <div className='flex items-center justify-end gap-2 pt-1'>
                  <Button variant='outline' onClick={() => onFiltersChange({})} aria-label='Clear all filters'>
                    Clear
                  </Button>
                  <Button onClick={() => setOpen(false)} aria-label='Apply filters'>
                    Apply
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
