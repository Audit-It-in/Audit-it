"use client";

import React, { useState, useCallback } from "react";
import { MagnifyingGlassIcon, FunnelIcon, XIcon } from "@phosphor-icons/react";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/helpers/tailwind.helper";
import { useStates, useDistricts, useLanguages, useSpecializations } from "@/src/services/profile.service";
import type { CADiscoveryFilters, CADiscoverySortOption, SortOrder } from "@/src/types/contact-request.type";
import { CA_DISCOVERY_SORT_LABELS, SORT_ORDER_LABELS } from "@/src/constants/contact.constants";

interface SearchFiltersProps {
  filters: CADiscoveryFilters;
  onFiltersChange: (filters: CADiscoveryFilters) => void;
  className?: string;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, className }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery || "");

  // Data queries
  const { data: states = [] } = useStates();
  const { data: districts = [] } = useDistricts(filters.location?.stateId);
  const { data: languages = [] } = useLanguages();
  const { data: specializations = [] } = useSpecializations();

  // Debounced search handler
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      const timeoutId = setTimeout(() => {
        onFiltersChange({
          ...filters,
          searchQuery: value.trim() || undefined,
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [filters, onFiltersChange]
  );

  const handleLocationChange = (field: "stateId" | "districtId", value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;

    if (field === "stateId") {
      onFiltersChange({
        ...filters,
        location: {
          stateId: numValue,
          districtId: undefined, // Reset district when state changes
        },
      });
    } else {
      onFiltersChange({
        ...filters,
        location: {
          ...filters.location,
          districtId: numValue,
        },
      });
    }
  };

  const handleSpecializationToggle = (specializationId: number) => {
    const current = filters.specializations || [];
    const updated = current.includes(specializationId)
      ? current.filter((id) => id !== specializationId)
      : [...current, specializationId];

    onFiltersChange({
      ...filters,
      specializations: updated.length > 0 ? updated : undefined,
    });
  };

  const handleLanguageToggle = (languageId: number) => {
    const current = filters.languages || [];
    const updated = current.includes(languageId) ? current.filter((id) => id !== languageId) : [...current, languageId];

    onFiltersChange({
      ...filters,
      languages: updated.length > 0 ? updated : undefined,
    });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.location?.stateId) count++;
    if (filters.location?.districtId) count++;
    if (filters.specializations?.length) count++;
    if (filters.languages?.length) count++;
    if (filters.verified !== undefined) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card variant='subtle' className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className='relative'>
        <MagnifyingGlassIcon
          className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500'
          weight='bold'
        />
        <Input
          placeholder='Search accountants by name, location, or specialization...'
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Filter Toggle and Clear */}
      <div className='flex items-center justify-between'>
        <Button variant='ghost' size='sm' onClick={() => setShowAdvanced(!showAdvanced)} className='gap-2'>
          <FunnelIcon className='h-4 w-4' weight='bold' />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge variant='secondary' className='ml-1'>
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant='ghost' size='sm' onClick={clearAllFilters} className='gap-2 text-red-600 hover:text-red-700'>
            <XIcon className='h-4 w-4' weight='bold' />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className='space-y-4 pt-4 border-t border-neutral-200'>
          {/* Location Filters */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>State</label>
              <Select
                value={filters.location?.stateId?.toString() || ""}
                onValueChange={(value) => handleLocationChange("stateId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select state' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>District</label>
              <Select
                value={filters.location?.districtId?.toString() || ""}
                onValueChange={(value) => handleLocationChange("districtId", value)}
                disabled={!filters.location?.stateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select district' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sorting */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>Sort By</label>
              <Select
                value={filters.sortBy || ""}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    sortBy: (value as CADiscoverySortOption) || undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Sort by relevance' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CA_DISCOVERY_SORT_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>Order</label>
              <Select
                value={filters.sortOrder || ""}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    sortOrder: (value as SortOrder) || undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select order' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SORT_ORDER_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>Specializations</label>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto'>
              {specializations.map((spec) => (
                <div key={spec.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`spec-${spec.id}`}
                    checked={filters.specializations?.includes(spec.id) || false}
                    onCheckedChange={() => handleSpecializationToggle(spec.id)}
                  />
                  <label htmlFor={`spec-${spec.id}`} className='text-sm text-neutral-700 cursor-pointer'>
                    {spec.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>Languages</label>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2 max-h-24 overflow-y-auto'>
              {languages.map((lang) => (
                <div key={lang.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`lang-${lang.id}`}
                    checked={filters.languages?.includes(lang.id) || false}
                    onCheckedChange={() => handleLanguageToggle(lang.id)}
                  />
                  <label htmlFor={`lang-${lang.id}`} className='text-sm text-neutral-700 cursor-pointer'>
                    {lang.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Filter */}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='verified'
              checked={filters.verified || false}
              onCheckedChange={(checked) =>
                onFiltersChange({
                  ...filters,
                  verified: checked ? true : undefined,
                })
              }
            />
            <label htmlFor='verified' className='text-sm text-neutral-700 cursor-pointer'>
              Show only verified accountants
            </label>
          </div>
        </div>
      )}
    </Card>
  );
};
