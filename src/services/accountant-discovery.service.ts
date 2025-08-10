"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/src/helpers/supabase.helper";
import type { ProfileDetails } from "@/src/types/profile.type";
import type { CADiscoveryFilters, PaginatedResponse, PaginationParams } from "@/src/types/contact-request.type";
import { CADiscoverySortOption, SortOrder } from "@/src/types/contact-request.type";
import { DEFAULT_PAGINATION } from "@/src/constants/contact.constants";

// === CORE SERVICE FUNCTIONS ===

export async function fetchAccountants(
  filters: CADiscoveryFilters = {},
  pagination: PaginationParams = { page: 1, limit: DEFAULT_PAGINATION.LIMIT }
): Promise<PaginatedResponse<ProfileDetails>> {
  try {
    let query = supabase
      .from("profile_details")
      .select("*", { count: "exact" })
      .eq("role", "accountant")
      .eq("is_active", true);

    // Apply location filters
    if (filters.location?.stateId) {
      query = query.eq("state_id", filters.location.stateId);
    }
    if (filters.location?.districtId) {
      query = query.eq("district_id", filters.location.districtId);
    }

    // Apply specialization filters
    if (filters.specializations && filters.specializations.length > 0) {
      query = query.overlaps("specialization_ids", filters.specializations);
    }

    // Apply language filters
    if (filters.languages && filters.languages.length > 0) {
      query = query.overlaps("language_ids", filters.languages);
    }

    // Apply verification filter
    if (filters.verified !== undefined) {
      // This would require joining with ca_verifications table
      // For now, we'll implement a basic check
      if (filters.verified) {
        query = query.not("username", "is", null); // Assuming verified CAs have usernames
      }
    }

    // Apply search query
    if (filters.searchQuery) {
      const searchTerm = `%${filters.searchQuery}%`;
      query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},bio.ilike.${searchTerm}`);
    }

    // Apply sorting
    if (filters.sortBy && filters.sortOrder) {
      const ascending = filters.sortOrder === SortOrder.ASC;
      switch (filters.sortBy) {
        case CADiscoverySortOption.NAME:
          query = query.order("first_name", { ascending });
          break;
        case CADiscoverySortOption.LOCATION:
          query = query.order("state_name", { ascending }).order("district_name", { ascending });
          break;
        case CADiscoverySortOption.EXPERIENCE:
          // This would require calculating experience from the experiences table
          query = query.order("created_at", { ascending: !ascending }); // Fallback to registration date
          break;
        case CADiscoverySortOption.RATING:
          // This would require a ratings system
          query = query.order("created_at", { ascending: !ascending }); // Fallback to registration date
          break;
        default:
          query = query.order("created_at", { ascending: false }); // Default to newest first
      }
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // Apply pagination
    const offset = (pagination.page - 1) * pagination.limit;
    query = query.range(offset, offset + pagination.limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / pagination.limit);

    return {
      data: (data || []) as ProfileDetails[],
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: count || 0,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  } catch (error) {
    console.error("Failed to fetch accountants:", error);
    throw new Error("Unable to load accountant profiles. Please try again.");
  }
}

export async function fetchAccountantProfile(
  state: string,
  district: string,
  username: string
): Promise<ProfileDetails | null> {
  try {
    const { data, error } = await supabase
      .from("profile_details")
      .select("*")
      .eq("role", "accountant")
      .eq("is_active", true)
      .eq("username", username)
      .ilike("state_name", state.replace("-", " "))
      .ilike("district_name", district.replace("-", " "))
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data as ProfileDetails | null;
  } catch (error) {
    console.error("Failed to fetch accountant profile:", error);
    throw new Error("Unable to load accountant profile. Please try again.");
  }
}

export async function searchAccountants(
  searchQuery: string,
  filters: Omit<CADiscoveryFilters, "searchQuery"> = {}
): Promise<ProfileDetails[]> {
  try {
    const searchFilters: CADiscoveryFilters = {
      ...filters,
      searchQuery,
    };

    const result = await fetchAccountants(searchFilters, { page: 1, limit: 10 });
    return result.data;
  } catch (error) {
    console.error("Failed to search accountants:", error);
    throw new Error("Unable to search accountant profiles. Please try again.");
  }
}

// === REACT QUERY HOOKS ===

export function useAccountants(
  filters: CADiscoveryFilters = {},
  pagination: PaginationParams = { page: 1, limit: DEFAULT_PAGINATION.LIMIT }
) {
  return useQuery({
    queryKey: ["accountants", filters, pagination],
    queryFn: () => fetchAccountants(filters, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useInfiniteAccountants(filters: CADiscoveryFilters = {}) {
  return useInfiniteQuery({
    queryKey: ["accountants-infinite", filters],
    queryFn: ({ pageParam = 1 }) => fetchAccountants(filters, { page: pageParam, limit: DEFAULT_PAGINATION.LIMIT }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAccountantProfile(state?: string, district?: string, username?: string) {
  return useQuery({
    queryKey: ["accountant-profile", state, district, username],
    queryFn: () => fetchAccountantProfile(state!, district!, username!),
    enabled: !!(state && district && username),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useAccountantSearch(searchQuery: string, filters: Omit<CADiscoveryFilters, "searchQuery"> = {}) {
  return useQuery({
    queryKey: ["accountant-search", searchQuery, filters],
    queryFn: () => searchAccountants(searchQuery, filters),
    enabled: searchQuery.length >= 2, // Only search with 2+ characters
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
