import { ProfileDetails, SpecializationWithCategory } from "./profile.type";

// Contact Request Status Enum
export enum ContactRequestStatus {
  NEW = "new",
  REPLIED = "replied",
  CLOSED = "closed",
}

// Contact Request Urgency Enum
export enum UrgencyLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// Core Contact Request interface based on database schema
export interface ContactRequest {
  id: string;
  ca_profile_id: string;
  customer_profile_id?: string; // NULL for anonymous requests
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
  service_needed?: string;
  urgency: UrgencyLevel;
  location_city?: string;
  location_state?: string;
  status: ContactRequestStatus;
  ca_private_notes?: string[];
  replied_at?: string;
  created_at: string;
  updated_at: string;
}

// Extended interface with resolved relationships for detailed views
export interface ContactRequestDetails extends ContactRequest {
  ca_profile: ProfileDetails;
  customer_profile?: ProfileDetails;
  service_specialization?: SpecializationWithCategory;
  ca_first_name?: string;
  ca_last_name?: string;
  ca_profile_picture?: string;
  ca_bio?: string;
  ca_state_name?: string;
  ca_district_name?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_profile_picture?: string;
  service_specialization_names?: string[];
}

// Form data interface for contact request submission
export interface ContactRequestFormData {
  subject: string;
  message: string;
  service_needed?: string;
  urgency: UrgencyLevel;
  customer_phone?: string;
  location_city?: string;
  location_state?: string;
}

// Interface for creating new contact requests
export interface CreateContactRequestData extends ContactRequestFormData {
  ca_profile_id: string;
  customer_profile_id?: string;
  customer_name: string;
  customer_email: string;
}

// Interface for updating contact request status
export interface UpdateContactRequestData {
  status?: ContactRequestStatus;
  ca_private_notes?: string[];
  replied_at?: string;
}

// Filter interfaces for CA discovery
export interface CADiscoveryFilters {
  location?: {
    stateId?: number;
    districtId?: number;
  };
  specializations?: number[];
  languages?: number[];
  verified?: boolean;
  searchQuery?: string;
  sortBy?: CADiscoverySortOption;
  sortOrder?: SortOrder;
}

// Sort options for CA discovery
export enum CADiscoverySortOption {
  RELEVANCE = "relevance",
  NAME = "name",
  EXPERIENCE = "experience",
  RATING = "rating",
  LOCATION = "location",
}

// Filter interfaces for contact request management
export interface ContactRequestFilters {
  status?: ContactRequestStatus[];
  urgency?: UrgencyLevel[];
  dateRange?: {
    start: string;
    end: string;
  };
  serviceType?: string[];
  searchQuery?: string;
  sortBy?: ContactRequestSortOption;
  sortOrder?: SortOrder;
}

// Sort options for contact requests
export enum ContactRequestSortOption {
  CREATED_DATE = "created_date",
  UPDATED_DATE = "updated_date",
  URGENCY = "urgency",
  STATUS = "status",
  CA_NAME = "ca_name",
  CUSTOMER_NAME = "customer_name",
}

// Generic sort order
export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

// Pagination interface for lists
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

// Response interface for paginated results
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Analytics interfaces for CA request performance
export interface ContactRequestAnalytics {
  totalRequests: number;
  newRequests: number;
  repliedRequests: number;
  closedRequests: number;
  responseRate: number;
  averageResponseTime: number; // in hours
  requestTrends: RequestTrendData[];
  topServiceTypes: ServiceTypeAnalytics[];
  monthlyBreakdown: MonthlyRequestData[];
}

export interface RequestTrendData {
  date: string;
  count: number;
  status: ContactRequestStatus;
}

export interface ServiceTypeAnalytics {
  serviceType: string;
  count: number;
  percentage: number;
}

export interface MonthlyRequestData {
  month: string;
  year: number;
  totalRequests: number;
  responseRate: number;
}

// Error types for contact request operations
export enum ContactRequestErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  CA_NOT_FOUND = "CA_NOT_FOUND",
  REQUEST_NOT_FOUND = "REQUEST_NOT_FOUND",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ContactRequestError {
  type: ContactRequestErrorType;
  message: string;
  field?: string;
  code?: string;
}
