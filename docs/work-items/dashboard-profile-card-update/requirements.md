# Requirements: Dashboard Profile Card Update

## User Story

As an authenticated user, I want the dashboard to show a rich preview of my public profile and a clear Edit action so I can quickly view how others see me and update my profile via the guided steps.

## Acceptance Criteria

1. WHEN I open the dashboard THEN I SHALL see a neumorphic profile card with my avatar, full name, username, location, verification status, and profile completion percentage.
2. WHEN my profile has `username`, `state_name`, and `district_name` available THEN I SHALL see a primary "View Public Profile" button that navigates to my public profile route.
3. WHEN required fields for the public URL are missing THEN the "View Public Profile" button SHALL be disabled and an inline hint SHALL tell me to complete Personal Info first.
4. WHEN I click "Edit Profile" THEN I SHALL be taken to `/profile` with the stepper; if `last_completed_section` exists it SHALL start from that context (query param `?step=<section>`), else it SHALL default to Personal Info.
5. The card SHALL conform to neumorphic design guardrails (no gradients, shadow-neumorphic-\*, border-2/3, rounded-xl/2xl, focus rings, 44px+ touch targets).
6. The implementation SHALL not modify database schema; it SHALL use existing hooks/services: `useAuth`, `useProfileDetails`, and `useVerification`.
7. The dashboard SHALL continue existing redirects for unauthenticated users and role selection.
8. WHEN I am viewing my own dashboard THEN I SHALL see my verification status (Verified / Pending verification / Not submitted); WHEN anyone views my public profile THEN they SHALL only see a generic "Verified" badge if verified, and no status otherwise (no pending/not-submitted disclosure publicly).

## Non-Functional

- Accessibility: Buttons have aria-labels; region landmark; focus-visible styles meet WCAG AA.
- Performance: Avoid layout shifts; defer optional chips until data is ready; use `neumorphic-optimized` and responsive shadow utilities.
- Code quality: ≤200 lines per component; TS strict; follow import order.
