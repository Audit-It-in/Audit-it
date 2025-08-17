# Design: Landing Hero — Animated Color Upgrade (No Gradients)

## Overview

Enhance the landing hero with richer motion and brand color presence while strictly following guardrails: no gradients; use solid surfaces with `shadow-neumorphic-*`, strong borders, rounded corners, branded focus rings, and 44px+ touch targets. Color comes only from primary blue and accent emerald tints.

Primary target: `src/components/landing/LandingHero.component.tsx`. Reuse `KineticHeadline.component.tsx`, `AnimatedReveal.component.tsx`, and `MagneticContainer.component.tsx` where helpful.

## Component Structure

```
LandingHero (client)
├─ KineticHeadline (animated words/letters)
├─ Subcopy (AnimatedReveal)
├─ HeroSearchCard (neumorphic; CTAs)
└─ AccentCloud (optional) — 3–6 floating chips
```

- Container shadows: `shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl`.
- Moving elements use `neumorphic-optimized` + `will-change: transform`.

## Visual System (No Gradients)

- Surfaces: `bg-white`, `bg-primary-50`, `bg-emerald-50`.
- Borders: `border-2 border-primary-100/60` (emerald variants where needed).
- Shadows: containers `shadow-neumorphic-xl`; interactive `shadow-neumorphic-lg hover:shadow-neumorphic-xl active:shadow-neumorphic-inset`.
- Colors: Tailwind brand scales only; never use gradient/glow utilities.

## Motion Primitives (to add)

- `float-slow`: translateY(-2px..2px) + tiny rotateZ, 6–10s ease-in-out.
- `chip-orbit`: slow circular path using CSS variables for radius/phase, 12–18s.
- `reveal-up`: opacity 0→1, translateY 8px→0.
- `pulse-shadow-primary`: swaps between primary shadow depths (sparingly on focus states).

Example accent chip (solid tint):

```tsx
<div
  className={cn(
    "absolute rounded-xl px-3 py-2 text-xs font-semibold",
    "bg-primary-50 text-primary-800 border-2 border-primary-200/60",
    "shadow-neumorphic-md animate-float-slow pointer-events-none will-change-transform"
  )}
>
  GST Services
</div>
```

## Interactions

- Headline: staggered entrance; a subset idles with very subtle `float-slow`.
- Search card: branded focus ring + slight depth on focus.
- CTAs: keep neumorphic hover/active; add `hover:scale-110 active:scale-95`.
- Accent chips: 3–6 floating/orbiting solid pills at low amplitude; disabled in reduced motion/lite.

## Accessibility

- Honor `prefers-reduced-motion: reduce` and `data-neumo-mode="lite"` by disabling idle motion.
- Maintain WCAG AA contrast on tinted surfaces.
- Provide `role="region"` + `aria-label` on the hero; clear labels on CTAs.

## Performance

- Limit moving elements; transform/opacity only; avoid animating large shadows.
- Ensure 60fps on capable devices; otherwise idle motion off.

## Risks / Notes

- Absolutely no gradients or blurred glow tricks.
- Floating elements must not intercept pointer events.

## References

- Files: `src/components/landing/LandingHero.component.tsx`, `src/components/landing/KineticHeadline.component.tsx`, `src/components/landing/AnimatedReveal.component.tsx`, `src/components/landing/MagneticContainer.component.tsx`
- Guardrails: `docs/work-items/README.md`, PRD `docs/prd/40-Design-System.md`.
