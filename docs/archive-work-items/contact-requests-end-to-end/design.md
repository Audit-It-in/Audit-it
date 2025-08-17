# Design: Contact Requests End-to-End

## Overview

Complete the contact requests feature from creation to management and analytics for both roles:
- Customers can send requests from a CA profile and view their sent requests.
- CAs can view, filter, search, sort, and update inbound requests; see an analytics summary.

No database schema changes. Reuse existing tables, view, and RPC:
- `contact_requests` (base table)
- `contact_requests_with_details` (view)
- `get_contact_request_stats` (RPC)

Follow strict neumorphic design guardrails (no gradients) with brand primary blue + accent emerald.

## Architecture

### Routes

- `app/dashboard/contact-requests/page.tsx`
  - Single page that detects role and renders:
    - CA tab: inbound requests (default if user is CA)
    - Customer tab: my sent requests (default if user is Customer)
  - Mobile-first; uses cards list layout instead of complex table (no `table` component in UI kit).

### Data Flow

- Services/hooks (already present):
  - Lists: `useContactRequestsByCA(profile.id)`, `useContactRequestsByCustomer(profile.id)`
  - Detail: `useContactRequest(id)`
  - Mutations: `useCreateContactRequest()`, `useUpdateContactRequestStatus()`
  - Discovery (existing for entry-point): profile page uses `ContactRequestModal` → `createContactRequest`
- New usage: invoke `supabase.rpc('get_contact_request_stats', ...)` for CA analytics via a small addition in the contact-requests service (no schema change; function exists).

### Components (≤200 lines each)

- `src/components/contact-requests/management/RequestsFilters.component.tsx`
  - Controls: status multi-select, urgency multi-select, date range, search, sort (created/updated/urgency/status), order (asc/desc)
  - Emits `ContactRequestFilters`

- `src/components/contact-requests/management/RequestsList.component.tsx`
  - Renders a paginated, virtualized-feel list of request cards (Card per row) with key fields:
    - Created date (relative), subject, customer_name/ca_name (role-dependent), urgency/status badges, message preview
    - Row actions: View details, Mark Replied, Close, Add/Edit Notes
  - Uses TanStack Query data from parent

- `src/components/contact-requests/management/RequestRowActions.component.tsx`
  - Dropdown or inline action buttons calling `useUpdateContactRequestStatus()` with optimistic updates

- `src/components/contact-requests/management/RequestDetailsDrawer.component.tsx`
  - Slide-over with full details, including message, contact info, location, and notes editor (for CA)
  - Accessible focus trap; Esc/overlay to close

- `src/components/contact-requests/management/ContactRequestsSummary.component.tsx`
  - CA-only metrics widget (top of page): totals, response rate, avg response time
  - Source: RPC-backed analytics; fallback to existing client-side calc if RPC not available in environment

- Skeletons
  - `RequestsListSkeleton.component.tsx` (rows shimmer)
  - `RequestDetailsSkeleton.component.tsx`

### Page Composition

`/dashboard/contact-requests`
- Header: Title + role tabs (CA | Customer) when applicable
- Filters rail (collapsible on mobile)
- CA-only `ContactRequestsSummary`
- `RequestsList` with infinite/paged loading using existing pagination shape

### Caching & Query Keys

- Lists: reuse existing keys from `useContactRequests*` hooks (5m stale as already implemented)
- Detail: `['contact-request', id]`
- Analytics: `['contact-request-analytics', caProfileId, range]`
- On mutations: call `invalidateContactRequestCaches` (provided in the service) to refresh impacted queries

### Sorting & Filtering

- Backed by `contact_requests_with_details` view fields:
  - Sort by created_at, updated_at, urgency (uses urgency_priority in the view), status, ca/customer names
  - Filters: status[], urgency[], date range, service_needed[], free-text search over subject/message/name

### Security & RLS

- RLS already enforced on base table; lists read from view with `GRANT SELECT` to `authenticated, anon`
- CA update restricted by policies on base table; UI shows status/notes actions only when the user is a CA recipient

### Error Handling

- Reuse `handleContactRequestError` mapping in service; surface user-facing banners/toasts
- Validate form data via zod in `ContactRequestModal` (already implemented)

### Rate Limiting (Optional, no schema changes)

- UI/service-side check using existing in-memory limiter (`checkRateLimit`) keyed by user or email; show friendly error when exceeded
- Note: best-effort; can later move to Postgres or Edge Function if needed

### Analytics

- Prefer server-calculated metrics via `get_contact_request_stats`
- Service addition: new function `fetchContactRequestStatsViaRPC(caProfileId, range)` that calls `.rpc('get_contact_request_stats', ...)`
- UI summary cards: total, new, replied, closed, response rate, avg response time

## Visual/UX (Neumorphic, no gradients)

- All cards and controls use:
  - `shadow-neumorphic-xl`/`-lg` with `border-2` brand tints
  - Badges for urgency/status: use brand color classes already defined in constants/service helpers
  - Buttons: `shadow-neumorphic-primary-xl`, 44px+ touch targets, branded focus rings
  - Drawers/modals: inset/backdrop with blur; focus trap; keyboard accessible

## Performance

- Paginate lists; avoid large tables
- Use skeletons; keep animations at 60fps; apply `neumorphic-optimized`
- Avoid re-render storms with memoization and stable callbacks

## Accessibility

- Landmarks on page sections
- Keyboard support for filters, list items, and drawer actions
- ARIA labels on action buttons; announce status changes


