# Design: Dashboard Page Neumorphic Redesign

## Overview

Redesign the entire dashboard into a cohesive, premium neumorphic experience (no gradients) that adapts to user role (CA vs Customer). Keep all data models and services intact; focus on layout, components, and interactions using existing hooks.

## Architecture

- App route: `app/dashboard/page.tsx` (client)
- Data hooks (existing):
  - Auth/identity: `useAuth()`
  - Profile details & verification: `useProfileDetails(user.id)`, `useVerification(profile.id)`
  - Contact requests lists: `useContactRequestsByCA(profile.id)`, `useContactRequestsByCustomer(profile.id)`
  - Analytics (CA): `useContactRequestStatsRPC(profile.id)` with fallback already handled in service

## Component Structure (≤200 lines each)

```
DashboardPage
└── DashboardContent
    ├── DashboardHeader (welcome, subcopy)
    ├── ProfilePreviewCard (owner-only details; already inline today → extractable)
    ├── QuickActions (View Public Profile | Edit Profile | Browse CAs)
    ├── RoleAwareRail
    │   ├── CA: ContactRequestsSummary (RPC analytics)
    │   └── Customer: GettingStartedTips (guided next steps)
    ├── RequestsPreview
    │   ├── CA: Inbound (top N, filters subset)
    │   └── Customer: Sent (top N)
    ├── RecentActivity (optional; reuse lists to show last 7 days)
    └── InfoTilesGrid (compact cards: profile setup, discovery, requests)
```

Notes:

- Keep `ProfilePreviewCard` visually prominent and reuse the avatar+verification pattern.
- Extract inline blocks from `app/dashboard/page.tsx` into focused components under `src/components/dashboard/*` as needed.

## Data Flow

- Role detection via `useAuth()`; redirect to `/auth` or `/role-selection` as today.
- Requests preview pulls first page with limit 5 using existing list hooks.
- CA analytics summary uses `useContactRequestStatsRPC(profile.id)`; if RPC fails, service falls back to client analytics.

## Layout

- Mobile-first single column; enhance to two columns on `lg:` with side-by-side cards (ProfilePreviewCard left, RoleAwareRail/RequestsPreview right).
- Spacing hierarchy: container `p-6` → section `p-4` → icon `p-3` → text `p-2`; avoid double padding.

## Visual (Neumorphic, no gradients)

- Containers: `shadow-neumorphic-xl`, `border-2 border-primary-100/60`, `bg-white`, `rounded-2xl`, `transition-all duration-500`, `neumorphic-optimized`.
- Interactive: `shadow-neumorphic-lg hover:shadow-neumorphic-xl active:shadow-neumorphic-inset` with brand tints; 44px+ touch targets.
- Avatar: inset frame + optional verified stamp (already implemented in `Avatar`).
- Badges/pills: solid tints; strong borders; no gradients.

## Accessibility

- Landmarks: each major card as `role="region"` with `aria-label`.
- Buttons with `aria-label`; maintain keyboard order and focus rings (`focus:shadow-neumorphic-focus`).
- Announce analytics numbers with readable labels.

## Performance

- Use responsive shadow utilities (mobile/tablet/desktop) and `data-neumo-mode="lite"` if available context-wide.
- Keep lists paginated; previews limited to 5–6 items.
- Avoid re-render storms with `React.memo` and stable callbacks.

## Error & Loading

- Skeletons for header/profile card, summary, and requests preview using inset neumorphic placeholders.
- Error banners/cards styled with neumorphic error state patterns.

## Navigation

- View Public Profile builds hyphen slugs via `toSlug()`.
- Edit Profile routes to `/profile?step=<last_completed_section|personal_info>`.
- Requests CTAs route to `/dashboard/contact-requests`.
