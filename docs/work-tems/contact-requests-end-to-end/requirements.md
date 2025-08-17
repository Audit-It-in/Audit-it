# Requirements: Contact Requests End-to-End

## User Stories

### As a customer
- I can send a contact request from a CA’s profile page (already possible) and view my sent requests in the dashboard.

### As a Chartered Accountant (CA)
- I can view inbound contact requests sent to me, filter/search/sort them, update the status and notes, and see an analytics summary of my responsiveness.

## Acceptance Criteria

### Creation (existing, verify and polish)
1. WHEN I click “Send Contact Request” on a CA profile THEN a modal SHALL open with validated fields; submitting SHALL create a record in `contact_requests` with `status = 'new'`.
2. WHEN I am unauthenticated THEN the CTA SHALL redirect to `/auth?returnUrl=...` before opening the modal.
3. WHEN I am not a customer (e.g., I am a CA) THEN the CTA SHALL show a clear message that only customers can send requests.

### Dashboard Lists
4. WHEN I open `/dashboard/contact-requests` as a CA THEN I SHALL see my inbound requests list with filters: status[], urgency[], date range, service type[], free-text search; and sorting options: created, updated, urgency, status, customer name.
5. WHEN I open `/dashboard/contact-requests` as a customer THEN I SHALL see my sent requests list with similar filters and sorting options (CA name instead of customer name column).
6. WHEN I change filters or sorting THEN the list SHALL update via existing hooks without a full page reload; pagination is preserved.
7. WHEN there are no requests THEN I SHALL see a neumorphic empty state with guidance.
8. WHEN the list is loading THEN I SHALL see neumorphic skeleton rows.

### Request Actions (CA only where applicable)
9. WHEN I mark a request as Replied THEN `status` SHALL update to `replied` and `replied_at` SHALL be set; UI uses optimistic update and confirms on success.
10. WHEN I close a request THEN `status` SHALL update to `closed` with optimistic update.
11. WHEN I edit CA private notes THEN `ca_private_notes` SHALL update; list/detail reflects changes.

### Details View
12. WHEN I open a request item THEN I SHALL see a drawer with full details including subject, message, customer contact, location, specialization name(s), and timestamps.
13. The drawer SHALL be keyboard-accessible with a focus trap and ESC to close.

### Navigation
14. WHEN I click "View Requests" on the dashboard tile THEN I SHALL be navigated to `/dashboard/contact-requests`.
15. WHEN I open the accountant profile page THEN the placeholder alert SHALL be removed; clicking CTA opens the modal directly.

### Analytics (CA)
16. WHEN I am a CA viewing the contact-requests page THEN I SHALL see an analytics summary using the `get_contact_request_stats` RPC (total, new, replied, closed, response rate, avg response time). If RPC is unavailable, a graceful fallback occurs.

### Security & Data
17. All read/write operations SHALL respect existing RLS policies; no elevation or schema change is needed.
18. View reads SHALL use `contact_requests_with_details`; updates SHALL hit `contact_requests`.

### Design & Accessibility
19. All UI SHALL follow neumorphic guardrails (no gradients) with brand colors and `shadow-neumorphic-*` utilities; 44px+ touch targets and proper focus rings.
20. Filters, lists, and drawers SHALL be accessible: ARIA labels, roles, keyboard navigation, and status announcements for updates.

## Non-Functional
21. Code quality: ≤200 lines per component; TS strict; composition over monoliths; no index files.
22. Performance: list pagination; skeletons for loading; stable memoized props; `neumorphic-optimized` where appropriate.
23. Caching: honor existing query keys; call `invalidateContactRequestCaches` on mutations.


