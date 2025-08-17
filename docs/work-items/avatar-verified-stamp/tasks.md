# Implementation Plan: Avatar Verified Stamp

## Constraints & Standards

- Neumorphic guardrails: no gradients; use `shadow-neumorphic-*`, strong borders, rounded corners, smooth transitions, branded focus rings.
- Do not change DB schema. Use existing verification state from services/hooks at call sites.
- Keep component ≤200 lines; TS strict; import order: React → third-party → UI → types → utils.

## Checklist

- [x] 1. Extend `src/components/ui/avatar.tsx` API

  - Add optional props: `verified?: boolean`, `verifiedLabel?: string`, `stampPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'` (default `bottom-right`), `stampSize?: 'sm' | 'md' | 'lg'` (default maps from avatar size).
  - Keep backwards compatibility; no visual change unless `verified` is true.

- [x] 2. Implement `VerifiedStamp` overlay (internal to avatar)

  - Absolute-positioned circle with classes:
    - Base: `rounded-full flex items-center justify-center text-white bg-emerald-600`
    - Shadow: `shadow-neumorphic-accent-lg`
    - Border: `border-2 border-white/90`
    - Motion: `transition-neumorphic-smooth opacity-0 translate-y-1 data-[show=true]:opacity-100 data-[show=true]:translate-y-0`
  - Icon: Phosphor `SealCheck` imported as `SealCheckIcon`.
  - Position/size class maps for `sm|md|lg` and four corners.
  - A11y: `aria-hidden` by default; if `verifiedLabel` provided, render `<span className="sr-only">{verifiedLabel}</span>`.

- [x] 3. Wire into usage sites (pass the prop only)

  - `src/components/contact-requests/discovery/profile/ProfileHeader.component.tsx` — pass `verified={isVerified}`.
  - `app/dashboard/page.tsx` profile preview card — pass `verified={verificationStatus === 'Verified'}`.
  - Avoid layout shifts; do not change parent structure.

- [ ] 4. Visual QA

  - Check sizes: `sm`, `md`, `lg` avatars render clean stamp without obscuring content.
  - Check color/contrast on light/dark surfaces; white border ensures separation.
  - Ensure no gradients and neumorphic shadows are consistent.

- [ ] 5. Accessibility QA

  - With `verifiedLabel`, verify screen readers announce verification appropriately without duplicate announcements when the page already indicates verification elsewhere.
  - Ensure stamp is not focusable and does not interfere with keyboard navigation.

- [ ] 6. Performance QA
  - Verify 60fps on hover/focus transitions; `neumorphic-optimized` applied on avatar as needed.

## Notes

- Keep the overlay optional and minimal to avoid breaking existing layouts.
- If avatars below 24px are encountered, consider auto-hiding the stamp or forcing `sm` size.
