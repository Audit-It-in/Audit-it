# Implementation Plan: Dashboard Page Neumorphic Redesign

## Constraints & Standards

- No DB schema changes. Reuse: `useAuth`, `useProfileDetails`, `useVerification`, `useContactRequestsByCA`, `useContactRequestsByCustomer`, `useContactRequestStatsRPC`.
- Neumorphic guardrails: no gradients; use `shadow-neumorphic-*`, `border-2/3`, `rounded-xl/2xl`, branded focus rings; 44px+ touch targets.
- Components ≤200 lines; TS strict; import order: React → third-party → UI → types → utils.

## Checklist

- [x] 1. Extract UI blocks into `src/components/dashboard/`

  - `DashboardHeader.component.tsx` — done
  - `ProfilePreviewCard.component.tsx` — done (migrated inline JSX)
  - `ContactRequestsSummaryCard.component.tsx` — done
  - `RequestsPreviewList.component.tsx` — done
  - `RoleAwareCASection.component.tsx` — done
  - `RoleAwareCustomerSection.component.tsx` — done

- [x] 2. Wire data

  - Use existing hooks with preview pagination (limit 5)
  - Role-awareness via `useAuth()`
  - Build public URL with `toSlug(state_name)`, `toSlug(district_name)`

- [x] 3. Apply neumorphic tokens and responsiveness

  - Containers: `shadow-neumorphic-xl`, `border-2`, `rounded-2xl`, `bg-white`
  - Interactive: `shadow-neumorphic-lg hover:shadow-neumorphic-xl active:shadow-neumorphic-inset`
  - Responsive shadow utilities for mobile/tablet/desktop
  - Add `neumorphic-optimized` to animated containers

- [x] 4. Accessibility

  - Regions with `aria-label` per card
  - Buttons labeled; focus rings present; touch targets >= 44px

- [ ] 5. Loading & Error States

  - Skeleton components for header, profile, summary, list
  - Neumorphic error card with retry where applicable

- [x] 6. Navigation

  - Ensure CTAs: View Public Profile, Edit Profile, View Requests
  - Preserve existing redirects for unauthenticated/role selection

- [ ] 7. QA
  - CA vs Customer views
  - Hyphenized profile URL correctness
  - Performance sanity (60fps interactions, no large rerenders)
  - Lint/typecheck green

## Notes

- Keep extraction incremental; start with `ProfilePreviewCard` from current page to avoid regressions.
- Reuse `Avatar` verified stamp; do not duplicate overlay code.
