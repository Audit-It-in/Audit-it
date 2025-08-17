# Implementation Plan: Contact Requests End-to-End

## Constraints & Standards

- No DB schema changes; reuse `contact_requests`, `contact_requests_with_details`, `get_contact_request_stats`.
- Neumorphic guardrails: no gradients; use `shadow-neumorphic-*`, strong borders, rounded corners, branded focus rings; mobile-first.
- Components ≤200 lines; TS strict; import order: React → third-party → UI → types → utils.

## Checklist

- [x] 1. Create dashboard route `app/dashboard/contact-requests/page.tsx`

  - Detect role (CA vs Customer) from `useAuth()`; render appropriate tab as default
  - Layout: header, filters, optional CA analytics, list
  - Wire TanStack Query lists with pagination and filters

- [x] 2. Build filters component `RequestsFilters.component.tsx`

  - Inputs: `ContactRequestFilters` + callbacks; supports status[], urgency[], date range, service type[], search, sort, order
  - Neumorphic inputs using existing UI primitives; accessible labels

- [x] 3. Build list component `RequestsList.component.tsx`

  - Card-per-row rendering of `ContactRequestDetails`
  - Shows key fields, urgency/status badges, and `RequestRowActions`
  - Loading: `RequestsListSkeleton`
  - Empty: neumorphic empty state

- [x] 4. Build row actions `RequestRowActions.component.tsx`

  - Actions: View details, Mark Replied, Close, Edit Notes
  - Hook: `useUpdateContactRequestStatus()` with optimistic updates

- [x] 5. Build details drawer `RequestDetailsDrawer.component.tsx`

  - Shows full message and metadata; notes editor for CA
  - Focus trap; close on ESC/backdrop

- [x] 6. CA analytics summary `ContactRequestsSummary.component.tsx`

  - Add service method to call RPC: `fetchContactRequestStatsViaRPC(caProfileId, range)`
  - Display totals, response rate, avg response time
  - Fallback to existing client-side `fetchContactRequestAnalytics` if RPC not available

- [x] 7. Navigation wiring

  - Update dashboard tile button in `app/dashboard/page.tsx` → `router.push("/dashboard/contact-requests")`
  - Remove placeholder alert in `AccountantProfilePageClient.component.tsx` and rely solely on modal

## Notes

- Keep pagination in sync with `DEFAULT_PAGINATION`.
- Use `invalidateContactRequestCaches` after any status/notes mutation.
- Ensure role-based UI: actions only visible to CA recipients.
