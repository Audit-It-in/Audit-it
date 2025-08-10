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
    <Card
      variant='subtle'
      className={cn("space-y-4", "shadow-neumorphic-md border border-primary-100 bg-white", className)}
    >
      {/* Search Bar */}
      <div className='relative'>
        <MagnifyingGlassIcon
          className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500'
          weight='bold'
        />
        <Input
          placeholder='Search accountants by name, location, or specialization...'
          aria-label='Search accountants'
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='pl-10 shadow-neumorphic-inset focus:shadow-neumorphic-focus'
        />
      </div>

      {/* Filter Toggle and Clear */}
      <div className='flex items-center justify-between'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowAdvanced(!showAdvanced)}
          className='gap-2'
          aria-expanded={showAdvanced}
          aria-controls='advanced-filters'
        >
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

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className='flex flex-wrap gap-2'>
          {filters.searchQuery && (
            <Badge className='shadow-neumorphic-sm bg-primary-100 text-primary-800 border border-primary-200/60'>
              {`"${filters.searchQuery}"`}
              <button
                aria-label='Remove search filter'
                title='Remove'
                className='ml-2 inline-flex items-center justify-center rounded-full hover:bg-primary-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 h-11 w-11'
                onClick={() => onFiltersChange({ ...filters, searchQuery: undefined })}
              >
                <XIcon className='h-3 w-3' weight='bold' />
              </button>
            </Badge>
          )}
          {filters.location?.stateId && (
            <Badge className='shadow-neumorphic-sm bg-primary-50 text-primary-800 border border-primary-200/60'>
              {states.find((s) => s.id === filters.location?.stateId)?.name || "State"}
              <button
                aria-label='Remove state filter'
                title='Remove'
                className='ml-2 inline-flex items-center justify-center rounded-full hover:bg-primary-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 h-11 w-11'
                onClick={() => onFiltersChange({ ...filters, location: { districtId: undefined } })}
              >
                <XIcon className='h-3 w-3' weight='bold' />
              </button>
            </Badge>
          )}
          {filters.location?.districtId && (
            <Badge className='shadow-neumorphic-sm bg-primary-50 text-primary-800 border border-primary-200/60'>
              {districts.find((d) => d.id === filters.location?.districtId)?.name || "District"}
              <button
                aria-label='Remove district filter'
                title='Remove'
                className='ml-2 inline-flex items-center justify-center rounded-full hover:bg-primary-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 h-11 w-11'
                onClick={() =>
                  onFiltersChange({ ...filters, location: { ...filters.location, districtId: undefined } })
                }
              >
                <XIcon className='h-3 w-3' weight='bold' />
              </button>
            </Badge>
          )}
          {filters.specializations?.map((id) => (
            <Badge
              key={`spec-chip-${id}`}
              className='shadow-neumorphic-sm bg-primary-100 text-primary-800 border border-primary-200/60'
            >
              {specializations.find((s) => s.id === id)?.name || id}
              <button
                aria-label='Remove specialization'
                title='Remove'
                className='ml-2 inline-flex items-center justify-center rounded-full hover:bg-primary-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 h-11 w-11'
                onClick={() => handleSpecializationToggle(id)}
              >
                <XIcon className='h-3 w-3' weight='bold' />
              </button>
            </Badge>
          ))}
          {filters.languages?.map((id) => (
            <Badge
              key={`lang-chip-${id}`}
              className='shadow-neumorphic-sm bg-accent-100 text-accent-900 border border-accent-200/60'
            >
              {languages.find((l) => l.id === id)?.name || id}
              <button
                aria-label='Remove language'
                title='Remove'
                className='ml-2 inline-flex items-center justify-center rounded-full hover:bg-accent-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 h-11 w-11'
                onClick={() => handleLanguageToggle(id)}
              >
                <XIcon className='h-3 w-3' weight='bold' />
              </button>
            </Badge>
          ))}
          {filters.verified && (
            <Badge className='shadow-neumorphic-sm bg-green-100 text-green-800 border border-green-200/60'>
              Verified
              <button
                aria-label='Remove verified filter'
                title='Remove'
                className='ml-2 inline-flex items-center justify-center rounded-full hover:bg-green-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 h-11 w-11'
                onClick={() => onFiltersChange({ ...filters, verified: undefined })}
              >
                <XIcon className='h-3 w-3' weight='bold' />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <div id='advanced-filters' className='space-y-4 pt-4 border-t border-primary-200/50'>
          {/* Location Filters */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2' htmlFor='filter-state'>
                State
              </label>
              <Select
                value={filters.location?.stateId?.toString() || ""}
                onValueChange={(value) => handleLocationChange("stateId", value)}
              >
                <SelectTrigger id='filter-state' className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'>
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
              <label className='block text-sm font-medium text-neutral-700 mb-2' htmlFor='filter-district'>
                District
              </label>
              <Select
                value={filters.location?.districtId?.toString() || ""}
                onValueChange={(value) => handleLocationChange("districtId", value)}
                disabled={!filters.location?.stateId}
              >
                <SelectTrigger id='filter-district' className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'>
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
              <label className='block text-sm font-medium text-neutral-700 mb-2' htmlFor='filter-sort-by'>
                Sort By
              </label>
              <Select
                value={filters.sortBy || ""}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    sortBy: (value as CADiscoverySortOption) || undefined,
                  })
                }
              >
                <SelectTrigger id='filter-sort-by' className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'>
                  <SelectValue placeholder='Sort by' />
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
              <div className='flex gap-2'>
                {Object.entries(SORT_ORDER_LABELS).map(([key, label]) => {
                  const isActive = filters.sortOrder === (key as SortOrder);
                  return (
                    <button
                      key={key}
                      type='button'
                      onClick={() =>
                        onFiltersChange({
                          ...filters,
                          sortOrder: key as SortOrder,
                        })
                      }
                      className={cn(
                        "px-3 py-1.5 rounded-full border text-sm transition-all duration-200",
                        "shadow-neumorphic-inset hover:shadow-neumorphic-md",
                        isActive
                          ? "bg-primary-100 text-primary-800 border-primary-300 ring-2 ring-primary-400"
                          : "bg-white text-primary-700 border-primary-200"
                      )}
                      aria-pressed={isActive}
                      aria-label={`Sort order: ${label}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
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
                  <label htmlFor={`spec-${spec.id}`} className='text-sm text-primary-800 cursor-pointer'>
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
                  <label htmlFor={`lang-${lang.id}`} className='text-sm text-primary-800 cursor-pointer'>
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
