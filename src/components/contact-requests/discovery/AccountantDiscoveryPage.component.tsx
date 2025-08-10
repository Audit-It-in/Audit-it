"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MagnifyingGlassIcon, WarningIcon } from "@phosphor-icons/react";
import { SearchFilters } from "./SearchFilters.component";
import { Loader, InlineLoader } from "@/src/components/common/Loader.component";
import { DiscoveryGridSkeleton } from "@/src/components/contact-requests/skeletons/DiscoveryGridSkeleton.component";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/helpers/tailwind.helper";
import { useInfiniteAccountants } from "@/src/services/accountant-discovery.service";
import type { CADiscoveryFilters } from "@/src/types/contact-request.type";
import type { ProfileDetails } from "@/src/types/profile.type";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";
import { ResultsHeader } from "./ResultsHeader.component";
import { AccountantGrid } from "./AccountantGrid.component";
import { LoadMoreTrigger } from "./LoadMoreTrigger.component";
import { FilterRail } from "./FilterRail.component";
import { MobileFilterSheet } from "./MobileFilterSheet.component";

interface AccountantDiscoveryPageProps {
  initialFilters?: CADiscoveryFilters;
  onContactAccountant?: (profile: ProfileDetails) => void;
  className?: string;
}

export const AccountantDiscoveryPage: React.FC<AccountantDiscoveryPageProps> = ({
  initialFilters = {},
  onContactAccountant,
  className,
}) => {
  const [filters, setFilters] = useState<CADiscoveryFilters>(initialFilters);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Infinite query for accountants
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteAccountants(filters);

  // Auto-fetch next page when scrolling
  useEffect(() => {
    // no-op here; handled inside LoadMoreTrigger component to throttle per viewport
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, hasUserInteracted]);

  // Mark user interaction on first filter change
  const handleFiltersChange = useCallback((newFilters: CADiscoveryFilters) => {
    setFilters(newFilters);
    setHasUserInteracted(true);
  }, []);

  // Flatten all pages of data
  const allAccountants = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.pagination.total || 0;

  // Handle contact accountant action
  const handleContactAccountant = useCallback(
    (profile: ProfileDetails) => {
      if (onContactAccountant) {
        onContactAccountant(profile);
      } else {
        // Default behavior: navigate to accountant profile
        const profileUrl =
          profile.username && profile.state_name && profile.district_name
            ? `/accountants/${profile.state_name.toLowerCase().replace(/\s+/g, "-")}/${profile.district_name
                .toLowerCase()
                .replace(/\s+/g, "-")}/${profile.username}`
            : "#";

        if (profileUrl !== "#") {
          window.location.href = profileUrl;
        }
      }
    },
    [onContactAccountant]
  );

  // Loading state for initial load
  if (isLoading && !hasUserInteracted) {
    return (
      <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6", className)}>
        <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <DiscoveryGridSkeleton />
      </div>
    );
  }

  // Error state
  if (isError && error) {
    return (
      <div className={cn("space-y-6", className)}>
        <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />

        <Card variant='subtle' className='text-center py-12'>
          <div className='space-y-4'>
            <div className='flex justify-center'>
              <WarningIcon className='h-12 w-12 text-red-500' weight='bold' />
            </div>

            <div className='space-y-2'>
              <h3 className='text-lg font-semibold text-neutral-900'>Unable to Load Accountant Profiles</h3>
              <p className='text-neutral-600 max-w-md mx-auto'>
                {"We're having trouble loading the accountant profiles. Please check your connection and try again."}
              </p>
            </div>

            <Button onClick={() => refetch()} variant='outline' className='gap-2'>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8 py-6", className)}>
      <div className='space-y-4'>
        {/* Mobile Filter Sheet trigger */}
        <MobileFilterSheet filters={filters} onFiltersChange={handleFiltersChange} />

        <div className='grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6'>
          {/* Left filter rail (desktop) */}
          <FilterRail filters={filters} onFiltersChange={handleFiltersChange} />

          {/* Right content */}
          <div className='space-y-6'>
            <ResultsHeader totalCount={totalCount} filters={filters} />

            {allAccountants.length > 0 ? (
              <div className='space-y-4'>
                <AccountantGrid profiles={allAccountants} onContactClick={handleContactAccountant} />

                <LoadMoreTrigger
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  onLoadMore={() => hasUserInteracted && fetchNextPage()}
                  rootMargin='160px'
                />

                {!hasNextPage && allAccountants.length > 0 && (
                  <div className='text-center py-8 text-neutral-500 text-sm'>
                    You&apos;ve seen all available accountant profiles
                  </div>
                )}
              </div>
            ) : (
              <Card
                variant='subtle'
                className='text-center py-16 shadow-neumorphic-md border border-primary-200/50 bg-gradient-to-br from-white to-primary-50/20'
              >
                <div className='space-y-4'>
                  <div className='flex justify-center'>
                    <MagnifyingGlassIcon className='h-16 w-16 text-neutral-400' weight='bold' />
                  </div>

                  <div className='space-y-2'>
                    <h3 className='text-xl font-semibold text-primary-900'>No Accountants Found</h3>
                    <p className='text-primary-700/80 max-w-md mx-auto'>
                      {filters.searchQuery || filters.location?.stateId || filters.specializations?.length
                        ? "No Chartered Accountants match your current filters. Adjust your filters or clear them to see more results."
                        : "No Chartered Accountants are currently available. Please check back later."}
                    </p>
                  </div>

                  {(filters.searchQuery || filters.location?.stateId || filters.specializations?.length) && (
                    <Button
                      variant='outline'
                      onClick={() => handleFiltersChange({})}
                      className='gap-2 shadow-neumorphic-sm hover:shadow-neumorphic-md'
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
