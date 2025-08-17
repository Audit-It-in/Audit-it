# Requirements — Landing Popular Services Neumorphic Upgrade

## User Stories

- As a customer, I can quickly scan popular services and tap one to see matching accountants.
- As a customer, I am routed to discovery with the service pre-applied as a specialization filter.
- As a keyboard user, I can navigate and activate service cards.
- As a mobile user, I can horizontally scroll the rail with snap behavior.

## Acceptance Criteria

- Section renders a labeled region "Popular services" with 6–12 cards (config-driven).
- Each card navigates to `/accountants` including `specializations=<slug>` (CSV rules maintained for future-proofing),
  merging with current URL by removing `district|specializations|languages` before applying encoded filters.
- Neumorphic visual style applied: `shadow-neumorphic-*`, brand primary blue + accent emerald; no gradients.
- Cards are keyboard accessible (Tab -> Enter/Space) with visible focus ring.
- Mobile: horizontal scroll with `snap-x snap-mandatory` and card width ~`w-[78vw]` (min 260px) to avoid edge clipping;
  Desktop: grid uses `repeat(auto-fit, minmax(220px, 1fr))` to maximize width usage on large screens.
- No additional data fetching; config is static and treeshakable.
- URLs are stable (slug-based), deterministic, and omit empty params.

## Constraints

- Tech stack: Next.js 15, React 19, TS strict, shadcn/ui, Tailwind, Phosphor icons.
- Avoid index files; components ≤200 lines; reuse `IconBadge` and `cn` helper.

## Edge Cases

- Very long titles: should not break layout; clamp and show tooltip on hover.
- Unknown slug in config: card still renders; navigation still works (server ignores unknowns gracefully).

## Tracking (optional)

- Log `popular_services_click` with `{ serviceSlug }` via `useTelemetry()`.
- `useTelemetry()` supports Plausible and GA4 if present; dev console fallback in non-prod.

## Out of Scope

- Personalization; server-driven ranking; analytics dashboards.
