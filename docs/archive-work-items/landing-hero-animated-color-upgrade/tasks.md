# Implementation Plan: Landing Hero — Animated Color Upgrade

## Constraints & Standards

- No gradients; solid brand tints with `shadow-neumorphic-*`, `border-2/3`, rounded corners, branded focus rings.
- Next.js 15, React 19, TS strict; components ≤200 lines; import order: React → third-party → UI → types → utils.
- Respect `prefers-reduced-motion` and `data-neumo-mode="lite"`.

## Checklist

- [x] 1. Add motion tokens to Tailwind

  - Keyframes/utilities: `float-slow`, `chip-orbit`, `reveal-up`, `pulse-shadow-primary` in `tailwind.config.js`.
  - Responsive variants; ensure tree-shaken output.

- [x] 2. Create `AccentChip` micro-component (≤70 lines)

  - Solid-tint pill with `border-2` + `shadow-neumorphic-md`.
  - Props: `label`, `tint: 'primary' | 'accent'`, `orbit?: boolean`, and optional CSS vars for radius/phase.
  - Disabled animation under reduced-motion/lite.

- [x] 3. Upgrade `LandingHero.component.tsx`

  - Staggered entrance via `AnimatedReveal`/`reveal-up`.
  - Branded focus/active on search input and CTAs; min touch targets.
  - Place 3–6 `AccentChip`s around the card (`pointer-events-none`), responsive positions.
  - Apply responsive shadows and `neumorphic-optimized`.

- [x] 4. Reduced-motion & lite-mode

  - CSS `@media (prefers-reduced-motion: reduce)` and `[data-neumo-mode="lite"] &` overrides to disable idle motion.

- [x] 5. Accessibility sweep

  - `role="region"` + `aria-label` on hero; labels on inputs/CTAs; focus-visible rings checked.

- [x] 6. Performance QA

  - 60fps on capable devices; no layout shifts; avoid animating large shadows.
  - Low-end mobile sanity; chips fall back to static.

- [x] 7. Links & UX QA

  - CTAs route: `/accountants` and `/auth?join=ca`; keyboard order logical.

- [x] 8. Lint/Typecheck
  - Ensure green build and lint, no warnings.

## Notes

- Keep new code colocated under `src/components/landing/`; no index files.
- Future: hook hero search to discovery filters (out of scope).
