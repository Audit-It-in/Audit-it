"use client";

import React from "react";
import { SearchFilters } from "./SearchFilters.component";
import type { CADiscoveryFilters } from "@/src/types/contact-request.type";

interface FilterRailProps {
  filters: CADiscoveryFilters;
  onFiltersChange: (filters: CADiscoveryFilters) => void;
}

export const FilterRail: React.FC<FilterRailProps> = ({ filters, onFiltersChange }) => {
  return (
    <aside className='hidden lg:block'>
      <div className='sticky top-20 space-y-4'>
        <SearchFilters filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </aside>
  );
};
