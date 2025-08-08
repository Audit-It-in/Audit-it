// Test file to verify contact request types work correctly
import {
  ContactRequest,
  ContactRequestDetails,
  ContactRequestFormData,
  ContactRequestStatus,
  UrgencyLevel,
  CADiscoveryFilters,
  ContactRequestFilters,
} from "./src/types/contact-request.type";

import {
  CONTACT_REQUEST_STATUS,
  URGENCY_LEVELS,
  CONTACT_REQUEST_STATUS_LABELS,
  URGENCY_LEVEL_LABELS,
} from "./src/constants/contact.constants";

// Test basic ContactRequest interface
const testRequest: ContactRequest = {
  id: "test-id",
  ca_profile_id: "ca-id",
  customer_profile_id: "customer-id",
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+1234567890",
  subject: "Tax consultation needed",
  message: "I need help with my tax filing",
  service_needed: "tax-filing",
  urgency: UrgencyLevel.MEDIUM,
  location_city: "Mumbai",
  location_state: "Maharashtra",
  status: ContactRequestStatus.NEW,
  ca_private_notes: ["Initial inquiry"],
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

// Test form data interface
const testFormData: ContactRequestFormData = {
  subject: "Need audit services",
  message: "Looking for comprehensive audit services for my company",
  service_needed: "audit",
  urgency: UrgencyLevel.HIGH,
  customer_phone: "+1234567890",
  location_city: "Delhi",
  location_state: "Delhi",
};

// Test CA discovery filters
const testCAFilters: CADiscoveryFilters = {
  location: {
    stateId: 1,
    districtId: 10,
  },
  specializations: [1, 2, 3],
  languages: [1, 2],
  verified: true,
  searchQuery: "tax expert",
};

// Test contact request filters
const testRequestFilters: ContactRequestFilters = {
  status: [ContactRequestStatus.NEW, ContactRequestStatus.REPLIED],
  urgency: [UrgencyLevel.HIGH, UrgencyLevel.URGENT],
  dateRange: {
    start: "2025-01-01",
    end: "2025-01-31",
  },
  serviceType: ["tax", "audit"],
  searchQuery: "urgent",
};

// Test constants usage
const statusLabel = CONTACT_REQUEST_STATUS_LABELS[ContactRequestStatus.NEW];
const urgencyLabel = URGENCY_LEVEL_LABELS[UrgencyLevel.HIGH];

console.log("Types test passed successfully!");
