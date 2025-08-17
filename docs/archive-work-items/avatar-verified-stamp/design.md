# Design: Avatar Verified Stamp

## Overview

Enhance the `Avatar` UI so that, when a user is verified, a neumorphic "stamp" appears as a circular badge over the avatar. No gradients; use brand colors (primary blue, accent emerald) and existing `shadow-neumorphic-*` utilities.

## Scope

- Add an optional verified stamp overlay to `src/components/ui/avatar.tsx`.
- Keep the base avatar behavior unchanged when not verified.
- Provide size-aware stamp that scales with avatar size and supports position variants.
- Maintain full accessibility and performance standards.

## API (Proposed)

```ts
type VerifiedStampPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type VerifiedStampSize = "sm" | "md" | "lg";

interface AvatarProps {
  // existing props...
  verified?: boolean; // if true, show the stamp
  verifiedLabel?: string; // accessible label (e.g., "Verified CA")
  stampPosition?: VerifiedStampPosition; // default: 'bottom-right'
  stampSize?: VerifiedStampSize; // default maps from avatar size
}
```

Notes:

- Keep public API minimal; defaults should "just work".
- Do not couple to data layer; pass `verified` from caller (e.g., via `useVerification`).

## Visual Design (Neumorphic, no gradients)

- **Stamp shape**: Circle with accent emerald emphasis, soft outer elevation and subtle inner ring.
- **Colors**: Background `bg-emerald-600` (or `bg-accent` variants), icon white, strong border rings for definition.
- **Shadows**: `shadow-neumorphic-accent-lg` on rest; `active:shadow-neumorphic-inset-deep` if ever interactive (not in this task).
- **Borders**: `border-2 border-white/90` outer ring for legibility over photos.
- **Motion**: Subtle entrance (`opacity-0 → opacity-100 translate-y-1 → 0`); `transition-neumorphic-smooth` on mount.
- **Positioning**: Default `bottom-right` overlapping avatar by ~20% with proper `outline-offset` for focus states (if needed in future).

### Size Mapping (relative to avatar)

- Avatar `sm` → Stamp `sm` (~16px)
- Avatar `md` → Stamp `md` (~20px)
- Avatar `lg` → Stamp `lg` (~24px)

Use Tailwind classes to implement exact sizes; avoid inline styles.

### Icon

- Phosphor `SealCheck` or `CheckCircle` as `SealCheckIcon` (import with alias). Size scales within the circle.

## Structure

```
Avatar (container, relative)
├─ AvatarImage / AvatarFallback (unchanged)
└─ VerifiedStamp (absolute, position variant)
```

### VerifiedStamp element (pattern)

```tsx
<div
  aria-hidden
  className={cn(
    "absolute rounded-full flex items-center justify-center",
    "bg-emerald-600 text-white",
    "shadow-neumorphic-accent-lg border-2 border-white/90",
    // position variant classes
    // size classes
    "transition-neumorphic-smooth"
  )}
>
  <SealCheckIcon weight='fill' className='block' />
  <span className='sr-only'>Verified</span>
  {/* if Avatar wrapper has role=img+label, the sr-only may be redundant; expose via prop */}
</div>
```

## Accessibility

- If `verifiedLabel` provided, render as `aria-label` on the stamp container or expose via `sr-only` text tied to the avatar region.
- Ensure stamp is non-interactive; `aria-hidden` true if parent already announces verification elsewhere.
- Maintain focus-visible styles on the avatar itself; stamp should not steal focus.

## Performance

- Zero additional network cost; small extra DOM node.
- Use `neumorphic-optimized` on the avatar root to keep animations smooth.
- No gradients; shadows from existing utilities.

## Integration Points

- `src/components/contact-requests/discovery/profile/ProfileHeader.component.tsx` — pass `verified` to `Avatar` from existing verification data.
- `app/dashboard/page.tsx` profile card — pass `verified` from `useVerification` where available.

## Risks / Considerations

- Small avatars (<=24px) may not accommodate stamp; auto-hide or clamp to `sm` and optionally allow callers to opt-out.
- Avoid obstructing critical content (e.g., initials). Use slight offset and white border for separation.
