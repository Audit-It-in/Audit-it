# Implementation Plan: Dashboard Profile Card Update

## Constraints & Standards

- Neumorphic guardrails: no gradients, use `shadow-neumorphic-*`, strong borders, rounded corners, smooth transitions, branded focus rings.
- Use existing data: `useAuth`, `useProfileDetails`, `useVerification`.
- Keep components ≤200 lines; TS strict; import order: React → third-party → UI → types → utils.

## Checklist (inline in `app/dashboard/page.tsx`)

- [x] 1. Implement inline profile card JSX inside `DashboardContent`

  - Use `useAuth` for base identity; call `useProfileDetails(user.id)` and `useVerification(profile.id)` in the page
  - Layout: avatar frame, identity, location, status row, actions
  - Styling: `shadow-neumorphic-xl`, `border-2`, `rounded-2xl`, responsive shadows
  - Accessibility: region landmark, labels, min touch targets

- [x] 2. Wire data

  - Use `useProfileDetails(user.id)` for `state_name`, `district_name`, and arrays — Implemented
  - Use `useVerification(profile.id)` for verification; show OWNER-ONLY status on dashboard:
    - Map: `verified_at` present → "Verified"; record exists without `verified_at` → "Pending"; no record → "Not submitted" — Implemented
    - Hide the chip while loading to avoid layout shift — Implemented
  - Public profile remains unchanged: only show a generic verified badge if verified; never show pending/not-submitted to public users — Confirmed
  - Compute public URL only when `username` and location present — Implemented

- [x] 3. Actions — Implemented

  - View Public Profile → `router.push(/accountants/${toSlug(state)}/${toSlug(district)}/${username})`
  - Edit Profile → `router.push(/profile?step=<last_completed_section|personal_info>)`

- [x] 4. Replace the existing identity `Card` block within the page — Implemented

  - Use the new inline JSX; preserve welcome header, badges, and other dashboard tiles

- [x] 5. Empty/Missing data states — Implemented

  - Avatar fallback to initials; disabled View button with hint
  - If `details` loading, show compact neumorphic skeleton row in place of meta; if verification loading, temporarily hide status chip

- [x] 6. Tests/QA — Implemented
  - Manual: public URL when data ready; disabled state when missing
  - Verification: owner-only status on dashboard; public profile only shows generic verified badge when verified
  - Accessible focus and min touch targets
  - Mobile/tablet/desktop responsive behavior

## Notes

- Do not change DB schema; reuse services and types.
- Reuse established avatar/frame pattern from ProfileHeader for consistency.
