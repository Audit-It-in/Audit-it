# Design — Landing "How It Works" Neumorphic Upgrade

## Problem Statement

The current `How It Works` section is readable but visually flat and underspecified for accessibility and brand depth. It lacks strong neumorphic hierarchy, clear step sequencing, and rich focus states. We need a compact, high-signal, accessible step rail that communicates the 3-step flow at a glance without introducing gradients or interaction bloat.

## Goals

- Compress vertical footprint while improving hierarchy and scan speed.
- Present 3 steps with clear numbers, icons (Phosphor, `Icon` suffix), title, and short description.
- Apply strict neumorphic design: no gradients; use `shadow-neumorphic-*`, subtle brand tints, rounded corners, and branded focus rings.
- Ensure keyboard and screen reader clarity with list semantics and focusable step cards.

## Non-Goals

- No DB/schema changes; purely presentational.
- No change to the actual 3-step process content (Search → Connect → Get It Done).
- No animations beyond lightweight reveal and focus transitions.

## Information Architecture

- Section label: "How it works".
- Steps: 1) Search, 2) Connect, 3) Get It Done.
- Optional subcopy under the heading.
- Steps are presented as cards with numeric badges and icons.

## Components (≤200 lines each)

- `src/components/landing/HowItWorks.component.tsx` (existing → updated)
  - Use neumorphic card container for the section body.
  - Steps rendered as focusable card-like elements (buttons or `div role="listitem"` with `tabIndex=0`).
  - Keep within 200 lines; extract a tiny local `StepItem` if needed (colocated in the same file) to avoid extra files.
- Reuse `AnimatedReveal` for subtle entrance, respecting `prefers-reduced-motion`.
- Reuse `Card` from `src/components/ui/card` and `IconBadge` if helpful for the icon frame.

## Layout & Visual

- Section container: `p-6 shadow-neumorphic-xl border-2 border-primary-100/60 bg-white rounded-2xl`.
- Heading block: center-aligned title + short paragraph.
- Steps layout:
  - Mobile: stacked `grid grid-cols-1 gap-4`.
  - Desktop: `md:grid md:grid-cols-3 md:gap-6`.
  - Connector accent (md+): subtle horizontal connector line between cards using an absolutely positioned divider within the grid row, kept behind cards.
- Step card:
  - Base: `rounded-2xl border-2 border-primary-100/60 bg-white shadow-neumorphic-md p-5 transition-all`.
  - Hover/active: `hover:shadow-neumorphic-lg active:shadow-neumorphic-inset`.
  - Focus: `focus:outline-none focus:ring-2 focus:ring-primary-500`.
  - Icon frame: `p-2 rounded-xl bg-white shadow-neumorphic-md border border-primary-200/60` with icon in brand color.
  - Number badge: small circular badge at the corner with brand tint; no gradient.

## Accessibility

- Section `aria-label="How it works"`.
- Steps rendered as a semantic list (`role="list"` on container, `role="listitem"` on items) or buttons when interactive affordance is desired.
- Keyboard: natural tab order; Enter/Space do nothing (non-navigational) but focus ring is visible.
- Screen reader text announces: "Step <n>: <Title>. <Description>".
- 44px+ interactive area; WCAG AA contrast.

## Performance

- Static data; no runtime fetch.
- `AnimatedReveal` is lightweight and respects reduced motion.
- Standardized shadow utilities to avoid expensive custom box-shadows.

## Telemetry (optional)

- Event: `how_it_works_view` on first viewport intersection (client-only).
- Event: `how_it_works_focus` when a step receives keyboard focus `{ step: 1|2|3 }`.

## Implementation Notes

- Replace ad-hoc tint backgrounds with consistent brand tints and solid surfaces (no gradients).
- Use existing Phosphor number icons or `IconBadge` with numbers rendered as text; keep icon size ≈ 20–24px.
- Example visual shell for a step card (classes only):

```tsx
<div
  role='listitem'
  tabIndex={0}
  className={cn(
    "rounded-2xl border-2 border-primary-100/60 bg-white p-5",
    "shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-inset",
    "focus:outline-none focus:ring-2 focus:ring-primary-500"
  )}
>
  {/* icon + title + desc ... */}
  {/* number badge positioned absolutely in the card corner */}
</div>
```

## Risks & Mitigations

- Over-animation: keep reveal minimal; respect `prefers-reduced-motion`.
- Small screens: ensure copy wraps gracefully; maintain 44px+ targets.
- Shadow performance: use predefined `shadow-neumorphic-*` utilities.

## References

- PRD: `docs/prd/10-Product.md`, `docs/prd/40-Design-System.md`
- Guardrails: `docs/work-items/README.md` (no gradients; brand primary blue + accent emerald)
