"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/helpers/supabase.helper";
import {
  ContactRequest,
  ContactRequestDetails,
  CreateContactRequestData,
  UpdateContactRequestData,
  ContactRequestFilters,
  CADiscoveryFilters,
  PaginatedResponse,
  PaginationParams,
  ContactRequestAnalytics,
  ContactRequestError,
  ContactRequestErrorType,
  ContactRequestStatus,
  UrgencyLevel,
  ContactRequestSortOption,
  SortOrder,
} from "@/src/types/contact-request.type";
import { ProfileDetails } from "@/src/types/profile.type";
import { DEFAULT_PAGINATION } from "@/src/constants/contact.constants";

// === ERROR HANDLING ===

function handleContactRequestError(error: unknown): ContactRequestError {
  console.error("Contact request error:", error);

  if (error instanceof Error) {
    // Supabase specific errors
    if (error.message.includes("PGRST301")) {
      return {
        type: ContactRequestErrorType.PERMISSION_DENIED,
        message: "You do not have permission to perform this action",
      };
    }

    if (error.message.includes("PGRST116")) {
      return {
        type: ContactRequestErrorType.REQUEST_NOT_FOUND,
        message: "Contact request not found",
      };
    }

    if (error.message.includes("23503")) {
      return {
        type: ContactRequestErrorType.CA_NOT_FOUND,
        message: "CA profile not found",
      };
    }

    if (error.message.includes("fetch")) {
      return {
        type: ContactRequestErrorType.NETWORK_ERROR,
        message: "Network connection failed. Please check your internet connection.",
      };
    }

    if (error.message.includes("rate limit")) {
      return {
        type: ContactRequestErrorType.RATE_LIMIT_EXCEEDED,
        message: "Too many requests. Please wait before trying again.",
      };
    }
  }

  return {
    type: ContactRequestErrorType.UNKNOWN_ERROR,
    message: "An unexpected error occurred. Please try again.",
  };
}

// === CORE SERVICE FUNCTIONS ===

export async function fetchContactRequests(
  filters: ContactRequestFilters = {},
  pagination: PaginationParams = { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT }
): Promise<PaginatedResponse<ContactRequestDetails>> {
  try {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Build query with filters
    let query = supabase.from("contact_requests_with_details").select("*", { count: "exact" });

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      query = query.in("status", filters.status);
    }

    if (filters.urgency && filters.urgency.length > 0) {
      query = query.in("urgency", filters.urgency);
    }

    if (filters.dateRange) {
      query = query.gte("created_at", filters.dateRange.start).lte("created_at", filters.dateRange.end);
    }

    if (filters.serviceType && filters.serviceType.length > 0) {
      query = query.in("service_needed", filters.serviceType);
    }

    if (filters.searchQuery) {
      query = query.or(
        `subject.ilike.%${filters.searchQuery}%,message.ilike.%${filters.searchQuery}%,customer_name.ilike.%${filters.searchQuery}%`
      );
    }

    // Apply sorting
    const sortBy = filters.sortBy || ContactRequestSortOption.CREATED_DATE;
    const sortOrder = filters.sortOrder || SortOrder.DESC;

    switch (sortBy) {
      case ContactRequestSortOption.CREATED_DATE:
        query = query.order("created_at", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.UPDATED_DATE:
        query = query.order("updated_at", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.URGENCY:
        // Custom urgency ordering: urgent > high > medium > low
        query = query.order("urgency", {
          ascending: sortOrder === SortOrder.ASC,
          nullsFirst: false,
        });
        break;
      case ContactRequestSortOption.STATUS:
        query = query.order("status", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.CA_NAME:
        query = query.order("ca_first_name", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.CUSTOMER_NAME:
        query = query.order("customer_name", { ascending: sortOrder === SortOrder.ASC });
        break;
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      data: (data || []) as ContactRequestDetails[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    const contactError = handleContactRequestError(error);
    throw new Error(contactError.message);
  }
}

export async function fetchContactRequestsByCA(
  caProfileId: string,
  filters: ContactRequestFilters = {},
  pagination: PaginationParams = { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT }
): Promise<PaginatedResponse<ContactRequestDetails>> {
  try {
    // CA filter applied explicitly via eq("ca_profile_id", caProfileId)

    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("contact_requests_with_details")
      .select("*", { count: "exact" })
      .eq("ca_profile_id", caProfileId);

    // Apply same filtering logic as fetchContactRequests
    if (filters.status && filters.status.length > 0) {
      query = query.in("status", filters.status);
    }

    if (filters.urgency && filters.urgency.length > 0) {
      query = query.in("urgency", filters.urgency);
    }

    if (filters.dateRange) {
      query = query.gte("created_at", filters.dateRange.start).lte("created_at", filters.dateRange.end);
    }

    if (filters.searchQuery) {
      query = query.or(
        `subject.ilike.%${filters.searchQuery}%,message.ilike.%${filters.searchQuery}%,customer_name.ilike.%${filters.searchQuery}%`
      );
    }

    // Apply sorting
    const sortBy = filters.sortBy || ContactRequestSortOption.CREATED_DATE;
    const sortOrder = filters.sortOrder || SortOrder.DESC;

    switch (sortBy) {
      case ContactRequestSortOption.CREATED_DATE:
        query = query.order("created_at", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.UPDATED_DATE:
        query = query.order("updated_at", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.URGENCY:
        query = query.order("urgency", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.STATUS:
        query = query.order("status", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.CUSTOMER_NAME:
        query = query.order("customer_name", { ascending: sortOrder === SortOrder.ASC });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      data: (data || []) as ContactRequestDetails[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    const contactError = handleContactRequestError(error);
    throw new Error(contactError.message);
  }
}

export async function fetchContactRequestsByCustomer(
  customerProfileId: string,
  filters: ContactRequestFilters = {},
  pagination: PaginationParams = { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT }
): Promise<PaginatedResponse<ContactRequestDetails>> {
  try {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("contact_requests_with_details")
      .select("*", { count: "exact" })
      .eq("customer_profile_id", customerProfileId);

    // Apply filtering logic
    if (filters.status && filters.status.length > 0) {
      query = query.in("status", filters.status);
    }

    if (filters.urgency && filters.urgency.length > 0) {
      query = query.in("urgency", filters.urgency);
    }

    if (filters.dateRange) {
      query = query.gte("created_at", filters.dateRange.start).lte("created_at", filters.dateRange.end);
    }

    if (filters.searchQuery) {
      query = query.or(
        `subject.ilike.%${filters.searchQuery}%,message.ilike.%${filters.searchQuery}%,ca_first_name.ilike.%${filters.searchQuery}%`
      );
    }

    // Apply sorting
    const sortBy = filters.sortBy || ContactRequestSortOption.CREATED_DATE;
    const sortOrder = filters.sortOrder || SortOrder.DESC;

    switch (sortBy) {
      case ContactRequestSortOption.CREATED_DATE:
        query = query.order("created_at", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.UPDATED_DATE:
        query = query.order("updated_at", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.URGENCY:
        query = query.order("urgency", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.STATUS:
        query = query.order("status", { ascending: sortOrder === SortOrder.ASC });
        break;
      case ContactRequestSortOption.CA_NAME:
        query = query.order("ca_first_name", { ascending: sortOrder === SortOrder.ASC });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      data: (data || []) as ContactRequestDetails[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    const contactError = handleContactRequestError(error);
    throw new Error(contactError.message);
  }
}

export async function fetchContactRequestById(id: string): Promise<ContactRequestDetails | null> {
  try {
    const { data, error } = await supabase.from("contact_requests_with_details").select("*").eq("id", id).single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data as ContactRequestDetails | null;
  } catch (error) {
    const contactError = handleContactRequestError(error);
    throw new Error(contactError.message);
  }
}

export async function createContactRequest(requestData: CreateContactRequestData): Promise<ContactRequest> {
  try {
    const { data, error } = await supabase
      .from("contact_requests")
      .insert([
        {
          ca_profile_id: requestData.ca_profile_id,
          customer_profile_id: requestData.customer_profile_id || null,
          customer_name: requestData.customer_name,
          customer_email: requestData.customer_email,
          customer_phone: requestData.customer_phone || null,
          subject: requestData.subject,
          message: requestData.message,
          service_needed: requestData.service_needed || null,
          urgency: requestData.urgency,
          location_city: requestData.location_city || null,
          location_state: requestData.location_state || null,
          status: ContactRequestStatus.NEW,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data as ContactRequest;
  } catch (error) {
    const contactError = handleContactRequestError(error);
    throw new Error(contactError.message);
  }
}

export async function updateContactRequestStatus(
  id: string,
  updateData: UpdateContactRequestData
): Promise<ContactRequest> {
  try {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updateData.status !== undefined) {
      updates.status = updateData.status;

      // Set replied_at timestamp when status changes to replied
      if (updateData.status === ContactRequestStatus.REPLIED) {
        updates.replied_at = new Date().toISOString();
      }
    }

    if (updateData.ca_private_notes !== undefined) {
      updates.ca_private_notes = updateData.ca_private_notes;
    }

    if (updateData.replied_at !== undefined) {
      updates.replied_at = updateData.replied_at;
    }

    const { data, error } = await supabase.from("contact_requests").update(updates).eq("id", id).select().single();

    if (error) throw error;

    return data as ContactRequest;
  } catch (error) {
    const contactError = handleContactRequestError(error);
    throw new Error(contactError.message);
  }
}

// === CA DISCOVERY FUNCTIONS ===

export async function fetchCAsForDiscovery(
  filters: CADiscoveryFilters = {},
  pagination: PaginationParams = { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT }
): Promise<PaginatedResponse<ProfileDetails>> {
  try {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

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
      // This would require a join with ca_verifications table
      // For now, we'll implement this as a simple filter
      if (filters.verified) {
        query = query.not("membership_number", "is", null);
      }
    }

    // Apply search query
    if (filters.searchQuery) {
      query = query.or(
        `first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,bio.ilike.%${filters.searchQuery}%,username.ilike.%${filters.searchQuery}%`
      );
    }

    // Apply sorting (simplified for now)
    query = query.order("created_at", { ascending: false });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      data: (data || []) as ProfileDetails[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    const contactError = handleContactRequestError(error);
    throw new Error(contactError.message);
  }
}

// === ANALYTICS FUNCTIONS ===

export async function fetchContactRequestAnalytics(
  caProfileId: string,
  dateRange?: { start: string; end: string }
): Promise<ContactRequestAnalytics> {
  try {
    let query = supabase.from("contact_requests").select("*").eq("ca_profile_id", caProfileId);

    if (dateRange) {
      query = query.gte("created_at", dateRange.start).lte("created_at", dateRange.end);
    }

    const { data, error } = await query;

    if (error) throw error;

    const requests = data || [];

    // Calculate basic metrics
    const totalRequests = requests.length;
    const newRequests = requests.filter((r) => r.status === ContactRequestStatus.NEW).length;
    const repliedRequests = requests.filter((r) => r.status === ContactRequestStatus.REPLIED).length;
    const closedRequests = requests.filter((r) => r.status === ContactRequestStatus.CLOSED).length;
    const responseRate = totalRequests > 0 ? ((repliedRequests + closedRequests) / totalRequests) * 100 : 0;

    // Calculate average response time (simplified)
    const repliedRequestsWithTime = requests.filter((r) => r.replied_at && r.created_at);
    const averageResponseTime =
      repliedRequestsWithTime.length > 0
        ? repliedRequestsWithTime.reduce((acc, r) => {
            const created = new Date(r.created_at).getTime();
            const replied = new Date(r.replied_at!).getTime();
            return acc + (replied - created) / (1000 * 60 * 60); // hours
          }, 0) / repliedRequestsWithTime.length
        : 0;

    // Generate trend data (simplified)
    const requestTrends = requests.map((r) => ({
      date: r.created_at.split("T")[0],
      count: 1,
      status: r.status as ContactRequestStatus,
    }));

    // Generate service type analytics
    const serviceTypeCounts = requests.reduce((acc, r) => {
      const service = r.service_needed || "General Inquiry";
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topServiceTypes = (Object.entries(serviceTypeCounts) as Array<[string, number]>).map(
      ([serviceType, countValue]) => ({
        serviceType,
        count: countValue,
        percentage: totalRequests > 0 ? (countValue / totalRequests) * 100 : 0,
      })
    );

    // Generate monthly breakdown (simplified)
    const monthlyBreakdown = [
      {
        month: new Date().toLocaleString("default", { month: "long" }),
        year: new Date().getFullYear(),
        totalRequests,
        responseRate,
      },
    ];

    return {
      totalRequests,
      newRequests,
      repliedRequests,
      closedRequests,
      responseRate,
      averageResponseTime,
      requestTrends,
      topServiceTypes,
      monthlyBreakdown,
    };
  } catch (error) {
    const contactError = handleContactRequestError(error);
    throw new Error(contactError.message);
  }
}

// === TANSTACK QUERY HOOKS ===

// Hook for fetching contact requests with filters and pagination
export function useContactRequests(
  filters: ContactRequestFilters = {},
  pagination: PaginationParams = { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT }
) {
  return useQuery({
    queryKey: ["contact-requests", filters, pagination],
    queryFn: () => fetchContactRequests(filters, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching CA's contact requests
export function useContactRequestsByCA(
  caProfileId: string,
  filters: ContactRequestFilters = {},
  pagination: PaginationParams = { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT }
) {
  return useQuery({
    queryKey: ["contact-requests", "ca", caProfileId, filters, pagination],
    queryFn: () => fetchContactRequestsByCA(caProfileId, filters, pagination),
    enabled: !!caProfileId,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for CA dashboard)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching customer's contact requests
export function useContactRequestsByCustomer(
  customerProfileId: string,
  filters: ContactRequestFilters = {},
  pagination: PaginationParams = { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT }
) {
  return useQuery({
    queryKey: ["contact-requests", "customer", customerProfileId, filters, pagination],
    queryFn: () => fetchContactRequestsByCustomer(customerProfileId, filters, pagination),
    enabled: !!customerProfileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single contact request by ID
export function useContactRequest(id: string) {
  return useQuery({
    queryKey: ["contact-request", id],
    queryFn: () => fetchContactRequestById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for CA discovery with filters and pagination
export function useCAsForDiscovery(
  filters: CADiscoveryFilters = {},
  pagination: PaginationParams = { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT }
) {
  return useQuery({
    queryKey: ["ca-discovery", filters, pagination],
    queryFn: () => fetchCAsForDiscovery(filters, pagination),
    staleTime: 10 * 60 * 1000, // 10 minutes (CA profiles change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for fetching contact request analytics
export function useContactRequestAnalytics(caProfileId: string, dateRange?: { start: string; end: string }) {
  return useQuery({
    queryKey: ["contact-request-analytics", caProfileId, dateRange],
    queryFn: () => fetchContactRequestAnalytics(caProfileId, dateRange),
    enabled: !!caProfileId,
    staleTime: 15 * 60 * 1000, // 15 minutes (analytics can be cached longer)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Prefer server-side analytics via RPC when available
export async function fetchContactRequestStatsViaRPC(
  caProfileId: string,
  dateRange?: { start?: string; end?: string }
): Promise<ContactRequestAnalytics> {
  try {
    const { data, error } = await supabase.rpc(
      "get_contact_request_stats",
      {
        p_ca_profile_id: caProfileId,
        p_start_date: dateRange?.start ?? null,
        p_end_date: dateRange?.end ?? null,
      }
    );

    if (error) throw error;

    const row = Array.isArray(data) ? data[0] : data;
    const result: ContactRequestAnalytics = {
      totalRequests: Number(row?.total_requests ?? 0),
      newRequests: Number(row?.new_requests ?? 0),
      repliedRequests: Number(row?.replied_requests ?? 0),
      closedRequests: Number(row?.closed_requests ?? 0),
      responseRate: Number(row?.response_rate ?? 0),
      averageResponseTime: Number(row?.avg_response_time_hours ?? 0),
      // Provide minimal placeholders for fields not computed by RPC
      requestTrends: [],
      topServiceTypes: [],
      monthlyBreakdown: [],
    };

    return result;
  } catch (_error) {
    // Fallback to client-side analytics if RPC fails
    return fetchContactRequestAnalytics(caProfileId, dateRange as { start: string; end: string } | undefined);
  }
}

export function useContactRequestStatsRPC(caProfileId: string, dateRange?: { start?: string; end?: string }) {
  return useQuery({
    queryKey: ["contact-request-analytics", "rpc", caProfileId, dateRange],
    queryFn: () => fetchContactRequestStatsViaRPC(caProfileId, dateRange),
    enabled: !!caProfileId,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// === MUTATION HOOKS ===

// Hook for creating a new contact request
export function useCreateContactRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestData: CreateContactRequestData) => createContactRequest(requestData),
    onSuccess: (newRequest) => {
      // Invalidate and refetch contact request lists
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
      queryClient.invalidateQueries({ queryKey: ["contact-requests", "ca", newRequest.ca_profile_id] });

      if (newRequest.customer_profile_id) {
        queryClient.invalidateQueries({
          queryKey: ["contact-requests", "customer", newRequest.customer_profile_id],
        });
      }

      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ["contact-request-analytics", newRequest.ca_profile_id],
      });
    },
    onError: (error) => {
      console.error("Failed to create contact request:", error);
    },
  });
}

// Hook for updating contact request status
export function useUpdateContactRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: UpdateContactRequestData }) =>
      updateContactRequestStatus(id, updateData),
    onSuccess: (updatedRequest) => {
      // Update the specific contact request in cache
      queryClient.setQueryData(["contact-request", updatedRequest.id], updatedRequest);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
      queryClient.invalidateQueries({ queryKey: ["contact-requests", "ca", updatedRequest.ca_profile_id] });

      if (updatedRequest.customer_profile_id) {
        queryClient.invalidateQueries({
          queryKey: ["contact-requests", "customer", updatedRequest.customer_profile_id],
        });
      }

      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ["contact-request-analytics", updatedRequest.ca_profile_id],
      });
    },
    onError: (error) => {
      console.error("Failed to update contact request:", error);
    },
  });
}

// Hook for optimistic updates when marking requests as read/unread
export function useOptimisticContactRequestUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: UpdateContactRequestData }) =>
      updateContactRequestStatus(id, updateData),
    onMutate: async ({ id, updateData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["contact-request", id] });

      // Snapshot previous value
      const previousRequest = queryClient.getQueryData(["contact-request", id]);

      // Optimistically update
      queryClient.setQueryData(["contact-request", id], (old: ContactRequest | undefined) => {
        if (!old) return old;
        return {
          ...old,
          ...updateData,
          updated_at: new Date().toISOString(),
        };
      });

      return { previousRequest };
    },
    onError: (_error, variables, context) => {
      // Rollback on error
      if (context?.previousRequest) {
        queryClient.setQueryData(["contact-request", variables.id], context.previousRequest);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["contact-request", variables.id] });
    },
  });
}

// === DATA TRANSFORMATION UTILITIES ===

export function transformContactRequestForDisplay(request: ContactRequestDetails): ContactRequestDetails {
  return {
    ...request,
    // Ensure dates are properly formatted
    created_at: new Date(request.created_at).toISOString(),
    updated_at: new Date(request.updated_at).toISOString(),
    replied_at: request.replied_at ? new Date(request.replied_at).toISOString() : undefined,

    // Sanitize and format text fields
    subject: request.subject.trim(),
    message: request.message.trim(),
    customer_name: request.customer_name.trim(),

    // Ensure arrays are properly initialized
    ca_private_notes: request.ca_private_notes || [],
    service_specialization_names: request.service_specialization_names || [],
  };
}

export function getUrgencyColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case UrgencyLevel.LOW:
      return "text-green-600 bg-green-50 border-green-200";
    case UrgencyLevel.MEDIUM:
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case UrgencyLevel.HIGH:
      return "text-orange-600 bg-orange-50 border-orange-200";
    case UrgencyLevel.URGENT:
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getStatusColor(status: ContactRequestStatus): string {
  switch (status) {
    case ContactRequestStatus.NEW:
      return "text-blue-600 bg-blue-50 border-blue-200";
    case ContactRequestStatus.REPLIED:
      return "text-green-600 bg-green-50 border-green-200";
    case ContactRequestStatus.CLOSED:
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function formatResponseTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`;
  } else if (hours < 24) {
    return `${Math.round(hours)} hours`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days} days`;
  }
}

export function getRelativeTimeString(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// === VALIDATION UTILITIES ===

export function validateContactRequestData(data: CreateContactRequestData): string[] {
  const errors: string[] = [];

  // Required field validation
  if (!data.ca_profile_id?.trim()) {
    errors.push("CA profile ID is required");
  }

  if (!data.customer_name?.trim()) {
    errors.push("Customer name is required");
  } else if (data.customer_name.trim().length < 2) {
    errors.push("Customer name must be at least 2 characters");
  } else if (data.customer_name.trim().length > 100) {
    errors.push("Customer name must be less than 100 characters");
  }

  if (!data.customer_email?.trim()) {
    errors.push("Customer email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer_email.trim())) {
    errors.push("Please enter a valid email address");
  }

  if (!data.subject?.trim()) {
    errors.push("Subject is required");
  } else if (data.subject.trim().length < 5) {
    errors.push("Subject must be at least 5 characters");
  } else if (data.subject.trim().length > 100) {
    errors.push("Subject must be less than 100 characters");
  }

  if (!data.message?.trim()) {
    errors.push("Message is required");
  } else if (data.message.trim().length < 20) {
    errors.push("Message must be at least 20 characters");
  } else if (data.message.trim().length > 1000) {
    errors.push("Message must be less than 1000 characters");
  }

  if (!data.urgency) {
    errors.push("Urgency level is required");
  } else if (!Object.values(UrgencyLevel).includes(data.urgency)) {
    errors.push("Invalid urgency level");
  }

  // Optional field validation
  if (data.customer_phone && data.customer_phone.trim()) {
    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    if (!phoneRegex.test(data.customer_phone.trim())) {
      errors.push("Please enter a valid phone number");
    } else if (data.customer_phone.trim().length < 10 || data.customer_phone.trim().length > 15) {
      errors.push("Phone number must be between 10 and 15 characters");
    }
  }

  if (data.location_city && data.location_city.trim().length > 50) {
    errors.push("City name must be less than 50 characters");
  }

  if (data.location_state && data.location_state.trim().length > 50) {
    errors.push("State name must be less than 50 characters");
  }

  return errors;
}

export function sanitizeContactRequestData(data: CreateContactRequestData): CreateContactRequestData {
  return {
    ...data,
    customer_name: data.customer_name.trim(),
    customer_email: data.customer_email.trim().toLowerCase(),
    customer_phone: data.customer_phone?.trim() || undefined,
    subject: data.subject.trim(),
    message: data.message.trim(),
    service_needed: data.service_needed?.trim() || undefined,
    location_city: data.location_city?.trim() || undefined,
    location_state: data.location_state?.trim() || undefined,
  };
}

// === RATE LIMITING UTILITIES ===

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 60 * 1000
): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier);

  if (!userRequests || now > userRequests.resetTime) {
    // Reset or initialize counter
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userRequests.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  // Increment counter
  userRequests.count++;
  return true;
}

export function getRateLimitStatus(identifier: string): { remaining: number; resetTime: number } {
  const userRequests = requestCounts.get(identifier);
  const maxRequests = 5; // Default limit

  if (!userRequests || Date.now() > userRequests.resetTime) {
    return { remaining: maxRequests, resetTime: Date.now() + 60 * 60 * 1000 };
  }

  return {
    remaining: Math.max(0, maxRequests - userRequests.count),
    resetTime: userRequests.resetTime,
  };
}

// === CACHE UTILITIES ===

export function getContactRequestCacheKey(
  type: "list" | "detail" | "analytics",
  params: Record<string, unknown>
): string[] {
  const baseKey = ["contact-requests"];

  switch (type) {
    case "list":
      return [...baseKey, "list", JSON.stringify(params)];
    case "detail":
      return [...baseKey, "detail", params.id as string];
    case "analytics":
      return [...baseKey, "analytics", params.caProfileId as string, JSON.stringify(params.dateRange || {})];
    default:
      return baseKey;
  }
}

import type { QueryClient } from "@tanstack/react-query";

export function invalidateContactRequestCaches(
  queryClient: QueryClient,
  caProfileId?: string,
  customerProfileId?: string
) {
  // Invalidate all contact request queries
  queryClient.invalidateQueries({ queryKey: ["contact-requests"] });

  // Invalidate specific CA queries
  if (caProfileId) {
    queryClient.invalidateQueries({ queryKey: ["contact-requests", "ca", caProfileId] });
    queryClient.invalidateQueries({ queryKey: ["contact-request-analytics", caProfileId] });
  }

  // Invalidate specific customer queries
  if (customerProfileId) {
    queryClient.invalidateQueries({ queryKey: ["contact-requests", "customer", customerProfileId] });
  }

  // Invalidate CA discovery cache (might affect CA profiles)
  queryClient.invalidateQueries({ queryKey: ["ca-discovery"] });
}
