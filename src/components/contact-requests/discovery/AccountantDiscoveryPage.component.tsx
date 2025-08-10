"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { MagnifyingGlassIcon, UsersIcon, WarningIcon } from "@phosphor-icons/react";
import { SearchFilters } from "./SearchFilters.component";
import { AccountantProfileCard } from "./AccountantProfileCard.component";
import { Loader, InlineLoader } from "@/src/components/common/Loader.component";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/helpers/tailwind.helper";
import { useInfiniteAccountants } from "@/src/services/accountant-discovery.service";
import type { CADiscoveryFilters } from "@/src/types/contact-request.type";
import type { ProfileDetails } from "@/src/types/profile.type";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";

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

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Auto-fetch next page when scrolling
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && hasUserInteracted) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, hasUserInteracted]);

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
      <div className={cn("space-y-6", className)}>
        <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <Loader
          action={LoadingAction.LOADING}
          title='Loading Accountant Profiles'
          subtitle='Finding qualified Chartered Accountants for you...'
          fullScreen={false}
        />
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
    <div className={cn("space-y-6", className)}>
      {/* Search and Filters */}
      <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Results Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <UsersIcon className='h-5 w-5 text-neutral-600' weight='bold' />
          <span className='text-sm text-neutral-600'>
            {isLoading ? "Searching..." : `${totalCount} Chartered Accountant${totalCount !== 1 ? "s" : ""} found`}
          </span>
        </div>

        {/* Quick filter indicators */}
        {(filters.location?.stateId || filters.specializations?.length || filters.searchQuery) && (
          <div className='flex items-center gap-2 text-xs text-neutral-500'>
            <span>Filtered results</span>
            {filters.searchQuery && (
              <span className='bg-primary-100 text-primary-700 px-2 py-1 rounded'>{`"${filters.searchQuery}"`}</span>
            )}
          </div>
        )}
      </div>

      {/* Results Grid */}
      {allAccountants.length > 0 ? (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {allAccountants.map((profile, index) => (
              <AccountantProfileCard
                key={`${profile.id}-${index}`}
                profile={profile}
                onContactClick={handleContactAccountant}
                className='h-full'
              />
            ))}
          </div>

          {/* Load More Trigger */}
          {hasNextPage && (
            <div ref={loadMoreRef} className='flex justify-center py-8'>
              {isFetchingNextPage ? (
                <div className='flex items-center gap-2 text-neutral-600'>
                  <InlineLoader action={LoadingAction.LOADING} size={SpinnerSize.SMALL} />
                  <span className='text-sm'>Loading more accountants...</span>
                </div>
              ) : (
                <Button variant='outline' onClick={() => fetchNextPage()} className='gap-2'>
                  Load More Accountants
                </Button>
              )}
            </div>
          )}

          {/* End of Results */}
          {!hasNextPage && allAccountants.length > 0 && (
            <div className='text-center py-8 text-neutral-500 text-sm'>
              You&apos;ve seen all available accountant profiles
            </div>
          )}
        </div>
      ) : (
        // Empty State
        <Card variant='subtle' className='text-center py-16'>
          <div className='space-y-4'>
            <div className='flex justify-center'>
              <MagnifyingGlassIcon className='h-16 w-16 text-neutral-400' weight='bold' />
            </div>

            <div className='space-y-2'>
              <h3 className='text-xl font-semibold text-neutral-900'>No Accountants Found</h3>
              <p className='text-neutral-600 max-w-md mx-auto'>
                {filters.searchQuery || filters.location?.stateId || filters.specializations?.length
                  ? "No Chartered Accountants match your current search criteria. Try adjusting your filters or search terms."
                  : "No Chartered Accountants are currently available. Please check back later."}
              </p>
            </div>

            {(filters.searchQuery || filters.location?.stateId || filters.specializations?.length) && (
              <Button variant='outline' onClick={() => handleFiltersChange({})} className='gap-2'>
                Clear All Filters
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
