import {
  ContactRequestStatus,
  UrgencyLevel,
  CADiscoverySortOption,
  ContactRequestSortOption,
  SortOrder,
} from "../types/contact-request.type";

// Contact Request Status Constants
export const CONTACT_REQUEST_STATUS = {
  NEW: ContactRequestStatus.NEW,
  REPLIED: ContactRequestStatus.REPLIED,
  CLOSED: ContactRequestStatus.CLOSED,
} as const;

// Contact Request Urgency Constants
export const URGENCY_LEVELS = {
  LOW: UrgencyLevel.LOW,
  MEDIUM: UrgencyLevel.MEDIUM,
  HIGH: UrgencyLevel.HIGH,
  URGENT: UrgencyLevel.URGENT,
} as const;

// Status display labels for UI
export const CONTACT_REQUEST_STATUS_LABELS = {
  [ContactRequestStatus.NEW]: "New",
  [ContactRequestStatus.REPLIED]: "Replied",
  [ContactRequestStatus.CLOSED]: "Closed",
} as const;

// Urgency display labels and colors for UI
export const URGENCY_LEVEL_LABELS = {
  [UrgencyLevel.LOW]: "Low",
  [UrgencyLevel.MEDIUM]: "Medium",
  [UrgencyLevel.HIGH]: "High",
  [UrgencyLevel.URGENT]: "Urgent",
} as const;

export const URGENCY_LEVEL_COLORS = {
  [UrgencyLevel.LOW]: "text-green-600 bg-green-50",
  [UrgencyLevel.MEDIUM]: "text-yellow-600 bg-yellow-50",
  [UrgencyLevel.HIGH]: "text-orange-600 bg-orange-50",
  [UrgencyLevel.URGENT]: "text-red-600 bg-red-50",
} as const;

// CA Discovery Sort Options
export const CA_DISCOVERY_SORT_OPTIONS = {
  RELEVANCE: CADiscoverySortOption.RELEVANCE,
  NAME: CADiscoverySortOption.NAME,
  EXPERIENCE: CADiscoverySortOption.EXPERIENCE,
  RATING: CADiscoverySortOption.RATING,
  LOCATION: CADiscoverySortOption.LOCATION,
} as const;

export const CA_DISCOVERY_SORT_LABELS = {
  [CADiscoverySortOption.RELEVANCE]: "Most Relevant",
  [CADiscoverySortOption.NAME]: "Name",
  [CADiscoverySortOption.EXPERIENCE]: "Experience",
  [CADiscoverySortOption.RATING]: "Rating",
  [CADiscoverySortOption.LOCATION]: "Location",
} as const;

// Contact Request Sort Options
export const CONTACT_REQUEST_SORT_OPTIONS = {
  CREATED_DATE: ContactRequestSortOption.CREATED_DATE,
  UPDATED_DATE: ContactRequestSortOption.UPDATED_DATE,
  URGENCY: ContactRequestSortOption.URGENCY,
  STATUS: ContactRequestSortOption.STATUS,
  CA_NAME: ContactRequestSortOption.CA_NAME,
  CUSTOMER_NAME: ContactRequestSortOption.CUSTOMER_NAME,
} as const;

export const CONTACT_REQUEST_SORT_LABELS = {
  [ContactRequestSortOption.CREATED_DATE]: "Date Created",
  [ContactRequestSortOption.UPDATED_DATE]: "Last Updated",
  [ContactRequestSortOption.URGENCY]: "Urgency Level",
  [ContactRequestSortOption.STATUS]: "Status",
  [ContactRequestSortOption.CA_NAME]: "CA Name",
  [ContactRequestSortOption.CUSTOMER_NAME]: "Customer Name",
} as const;

// Sort Order Options
export const SORT_ORDER_OPTIONS = {
  ASC: SortOrder.ASC,
  DESC: SortOrder.DESC,
} as const;

export const SORT_ORDER_LABELS = {
  [SortOrder.ASC]: "Ascending",
  [SortOrder.DESC]: "Descending",
} as const;

// Default pagination settings
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Contact request form validation constants
export const CONTACT_REQUEST_VALIDATION = {
  SUBJECT: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
  },
  MESSAGE: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 1000,
  },
  CUSTOMER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  PHONE: {
    PATTERN: /^[+]?[\d\s\-()]+$/,
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
} as const;

// Rate limiting constants
export const RATE_LIMITS = {
  CONTACT_REQUESTS_PER_HOUR: 5,
  CONTACT_REQUESTS_PER_DAY: 20,
  SEARCH_REQUESTS_PER_MINUTE: 30,
} as const;

// Analytics time ranges
export const ANALYTICS_TIME_RANGES = {
  LAST_7_DAYS: "7d",
  LAST_30_DAYS: "30d",
  LAST_90_DAYS: "90d",
  LAST_YEAR: "1y",
  ALL_TIME: "all",
} as const;

export const ANALYTICS_TIME_RANGE_LABELS = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  "1y": "Last Year",
  all: "All Time",
} as const;
