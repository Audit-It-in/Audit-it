# Implementation Plan

- [x] 1. Set up core types and constants for contact requests system

  - Create comprehensive TypeScript interfaces for ContactRequest, ContactRequestDetails, and form data types
  - Add contact request status and urgency enums to existing constants
  - Define filter interfaces for CA discovery and request management
  - _Requirements: 1.1, 2.1, 3.1, 5.1_

- [x] 2. Implement contact requests service layer with database operations

  - Create contact-requests.service.ts with CRUD operations for contact requests
  - Implement fetchContactRequests, createContactRequest, updateContactRequestStatus functions
  - Add TanStack Query hooks for contact request operations with proper caching
  - Implement error handling and data transformation utilities
  - Create database view for optimized contact request queries with profile joins
  - _Requirements: 3.4, 4.1, 5.1, 6.2_

- [x] 3. Create accountant discovery and search functionality

  - Implement AccountantDiscoveryPage component with search and filtering capabilities
  - Create SearchFilters component for location, specialization, and keyword filtering
  - Build AccountantProfileCard component for displaying CA information in search results
  - Add infinite scroll and real-time search functionality
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 4. Build detailed accountant profile view with contact capability

  - Create AccountantProfileView component showing complete CA profile information
  - Display CA's experience, education, verification status, and specializations
  - Add prominent "Contact CA" button for authenticated customers
  - Implement profile URL routing and SEO optimization
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 5. Implement contact request form with validation

  - Create ContactRequestForm component with comprehensive form fields
  - Implement Zod validation schema for form data validation
  - Add auto-population of customer information from authenticated user profile
  - Create form field components for subject, message, service type, and urgency selection
  - Add form submission handling with success/error states
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 6. Build customer dashboard for request tracking

  - Create CustomerRequestsDashboard component for viewing all customer requests
  - Implement CustomerRequestCard component for individual request display
  - Add CustomerRequestDetails component for detailed request view
  - Create status filtering and sorting functionality
  - Display request status, CA responses, and timestamps
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7. Implement accountant request management dashboard

  - Create AccountantRequestsDashboard component for CA's incoming request management
  - Build AccountantRequestCard component showing customer request information
  - Add filtering by status, urgency, and date range
  - Implement sorting by creation date, urgency level, and status
  - Add notification badge for new unread requests
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Create accountant request response and management system

  - Build AccountantRequestDetails component for detailed request viewing
  - Implement AccountantRequestResponse component for CA replies
  - Add functionality to update request status (replied, closed)
  - Create private notes system for CA internal tracking
  - Add response timestamp tracking and status updates
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 9. Implement shared UI components for request system

  - Create RequestStatusBadge component for visual status indicators
  - Build UrgencyIndicator component for urgency level display
  - Implement reusable form field components for contact requests
  - Add loading states and error handling components
  - Create responsive design components following neumorphic design principles
  - _Requirements: 4.2, 4.4, 5.4, 6.1_

- [ ] 10. Add request analytics and reporting for accountants

  - Create RequestAnalytics component showing CA performance metrics
  - Implement analytics queries for request volume, response rates, and trends
  - Add charts for monthly/weekly request breakdowns
  - Display most requested service types and conversion metrics
  - Create date range filtering for analytics data
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 11. Implement Row Level Security (RLS) policies for contact requests

  - Create RLS policies for contact request access control
  - Ensure customers can only view their own requests
  - Ensure CAs can only view requests sent to them
  - Add database triggers for automatic timestamp updates
  - _Requirements: 4.1, 5.1, 10.1, 10.2_

- [ ] 12. Add navigation and routing for contact request pages

  - Create Next.js app router pages for CA discovery (/accountants)
  - Add CA profile view page (/accountants/[state]/[district]/[username])
  - Implement customer dashboard page (/dashboard/requests)
  - Create CA dashboard page (/accountant/requests)
  - Add proper SEO metadata and Open Graph tags for CA profiles
  - _Requirements: 1.1, 2.1, 4.1, 5.1_

- [ ] 13. Implement comprehensive error handling and user feedback

  - Add error boundary components for contact request features
  - Create user-friendly error messages for common failure scenarios
  - Implement retry mechanisms for failed network requests
  - Add success notifications for completed actions
  - Create loading states for all async operations
  - _Requirements: 3.6, 6.5, 10.4_

- [ ] 14. Add form validation and data sanitization

  - Implement client-side validation using Zod schemas
  - Add server-side validation for all contact request endpoints
  - Create input sanitization for preventing XSS attacks
  - Add rate limiting for contact request submissions
  - Implement spam detection and prevention measures
  - _Requirements: 3.6, 8.3, 10.1, 10.2_

- [ ] 15. Create responsive mobile-first UI components

  - Ensure all contact request components work on mobile devices (320px+)
  - Implement touch-friendly interactions for mobile users
  - Add swipe gestures for request card actions
  - Optimize form layouts for mobile input
  - Test and refine neumorphic design elements for mobile screens
  - _Requirements: 1.1, 3.1, 4.1, 5.1_

- [ ] 16. Implement caching and performance optimizations

  - Configure TanStack Query caching strategies for contact request data
  - Add optimistic updates for request status changes
  - Implement infinite scroll with proper pagination
  - Add image lazy loading for CA profile pictures
  - Optimize bundle size and implement code splitting
  - _Requirements: 1.3, 4.1, 5.1, 7.1_

- [ ] 17. Integrate contact request system with existing authentication

  - Connect contact request forms with current user authentication system
  - Implement proper authorization checks for CA and customer roles
  - Add profile completion checks before allowing contact requests
  - Integrate with existing user profile data for auto-population
  - Ensure proper session management and security
  - _Requirements: 3.2, 4.1, 5.1, 10.1, 10.2_

- [ ] 18. Add notification system for contact request events

  - Implement in-app notifications for new contact requests
  - Add email notification templates for request events
  - Create notification preferences management
  - Add real-time updates using Supabase subscriptions
  - Implement notification badge counts and read/unread states
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 19. Final integration and deployment
  - Integrate all contact request components into main application
  - Verify complete user flows from CA discovery to response
  - Ensure proper data flow between customer and CA dashboards
  - Deploy contact request features to production environment
  - _Requirements: All requirements - final integration_
