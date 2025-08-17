# Design: Dashboard Profile Card Update

## Overview

Update the dashboard profile card to preview the user's public profile and provide an explicit Edit action that opens the guided profile steps. Keep all existing data models; apply the neumorphic design system (no gradients) with brand primary blue and accent emerald.

## Scope

- Replace the simple identity `Card` in `app/dashboard/page.tsx` with a neumorphic profile preview card.
- Show avatar, full name, username, location (state/district), verification indicator, and completion status.
- Provide two primary actions:
  - View Public Profile (navigates to accountants route)
  - Edit Profile (routes to `/profile`, resuming the stepper)

## Architecture

### Structure (Inline in page)

```
app/dashboard/page.tsx
└── DashboardContent (existing)
    ├── Profile Card (inline JSX block)
    │   ├── AvatarFrame (neumorphic avatar pattern)
    │   ├── IdentityBlock (name, username, location)
    │   ├── StatusRow (verification + completion)
    │   └── Actions (View Public Profile, Edit Profile)
    └── Existing dashboard tiles (unchanged)
```

Location-resolved data will be sourced via `useProfileDetails(user.id)` (for `state_name`, `district_name`, and derived arrays). Base identity comes from `useAuth()`.

### Data & URLs

- Public profile URL pattern: `app/accountants/[state]/[district]/[username]/page.tsx`.
- Construct href using `profile.username`, and `state_name`/`district_name` from `ProfileDetails` with hyphen slugs:
  - `/${"accountants"}/${toSlug(state_name)}/${toSlug(district_name)}/${username}`
- If any are missing, disable View button and show guidance to complete personal info first.

### Behavior

- Show completion percent using `profile.profile_completion_percentage`.
- Verification:
  - Dashboard (owner view): show explicit status using `useVerification(profile.id)` — "Verified" if `verified_at` present, "Pending" if record exists without `verified_at`, "Not submitted" if no record.
  - Public profile: only show a generic verified badge if verified; do not show pending/not-submitted to public users.
  - If uncertain or loading, hide the chip to avoid layout shift.
- Edit button routes to `/profile` and, if present, appends `?step=<last_completed_section>` to resume context; else default to personal info.

## Visual Design (Neumorphic, no gradients)

- Container: `Card` with deep shadows and strong borders.

```tsx
<Card className={cn(
  "relative overflow-hidden p-6 rounded-2xl",
  "shadow-neumorphic-xl hover:shadow-neumorphic-primary-xl",
  "border-2 border-primary-100/60 bg-white",
  "transition-all duration-500 neumorphic-optimized"
)}>
```

- Avatar frame (pattern from design tokens):

```tsx
<div className='p-2 rounded-full shadow-neumorphic-inset-deep bg-primary-50/60 border border-primary-200/40'>
  <div className='p-1 rounded-full shadow-neumorphic-lg bg-white'><!-- Avatar --></div>
  <!-- Optional verification badge overlaps bottom-right -->
</div>
```

- Identity and meta:

  - Name: `text-xl font-bold text-primary-900`
  - Username: `text-sm text-primary-700`
  - Location: `text-sm text-primary-700`
  - Status row: verification chip + completion badge

- Actions:
  - Primary: View Public Profile → `Button` with `shadow-neumorphic-primary-xl`, `border-2`
  - Secondary: Edit Profile → `Button` variant outline, `hover:shadow-neumorphic-lg`

### Spacing hierarchy

- Container `p-6` → content clusters `p-4` → icon containers `p-3` → text elements `p-2`. Avoid double padding.

## Accessibility

- Region landmark: `role="region"` with `aria-label="Dashboard Profile"`.
- Buttons have `aria-label` and 44px+ touch targets (`min-h-[44px]`).
- Focus rings: use `focus:shadow-neumorphic-focus` utilities.

## Performance

- Use `neumorphic-optimized` class; avoid extraneous decorative elements.
- Defer verification chip until `useVerification` resolves; no layout shift.

## Integration Points

- `app/dashboard/page.tsx`: Replace existing identity card with an inline neumorphic profile preview; use `useAuth`, `useProfileDetails`, and `useVerification` directly in the page.
- `src/services/profile.service.ts`: Reuse `useProfileDetails`, `useVerification`.

## Edge Cases

- Missing `username` or location: View button disabled with tooltip; show inline hint to complete personal info.
- Role missing → existing redirect to `/role-selection` remains unchanged.
