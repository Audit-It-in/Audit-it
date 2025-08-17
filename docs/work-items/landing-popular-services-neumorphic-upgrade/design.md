# Design — Landing Popular Services Neumorphic Upgrade

## Problem Statement

The current `Popular Services` section lacks strong visual hierarchy, deep links to filtered search, and rich interaction. We need an accessible, neumorphic, high-signal rail that showcases top services and routes directly to discovery with specialization filters applied.

## Goals

- Compress vertical footprint; increase scannability and tap target clarity.
- Add deep links to `/accountants` with `specializations` (CSV of slugs) and optional `languages` carry-over if present.
- Maintain strict neumorphic design (no gradients) with brand primary blue + accent emerald.
- Ensure full keyboard accessibility and screen reader clarity.

## Non-Goals

- No DB schema changes. No new tables. No ranking algorithm changes.
- No personalization or server-side A/B.

## Data & Sources

- Use existing normalized `specializations` lookup (with categories) already used by discovery services.
- A curated subset will be defined in a config: title, slug, icon (Phosphor), optional description and category slug.
- Navigation encodes slugs via `encodeFiltersToQuery` in `src/helpers/search-url.helper.ts`.

## Components (≤200 lines each)

- `src/components/landing/ServicesRail.component.tsx` (existing)
  - Render a responsive rail (horizontal scroll on mobile, grid on md+).
  - Cards use neumorphic shadows, icon badge, title, optional subcopy.
  - Click/Enter navigates to `/accountants?specializations=<slug>`; preserve unrelated existing params.
- (Optional, only if needed to stay ≤200 lines) `ServiceCard.component.tsx` colocated under `src/components/landing/`.
- Existing `IconBadge` from `src/components/ui/icon-badge.tsx` is reused.

## Navigation & URL Strategy

- Base route: `/accountants`.
- Query params:
  - `specializations`: CSV of specialization slugs (single on click; can be extended to multi later).
  - Preserve `languages` if present in current URL (optional enhancement).
- Helpers: `encodeFiltersToQuery` and `parseFiltersFromQuery` in `src/helpers/search-url.helper.ts` (planned in another work-item) ensure de-dup + sorted arrays.

## Layout & Visual

- Section container: `p-6 shadow-neumorphic-xl border-2 border-primary-100/60 bg-white rounded-2xl`.
- Card (button):
  - Base: `px-4 py-3 rounded-xl shadow-neumorphic-md bg-white border-2 border-primary-200/60 transition-all duration-300`.
  - Hover/active: `hover:shadow-neumorphic-lg active:shadow-neumorphic-inset focus:ring-2 focus:ring-primary-500`.
  - Icon frame: use `IconBadge` with brand accents (no gradients).
- Layout:
  - Mobile: horizontal scroll-snap rail with overflow-x-auto; `snap-x snap-mandatory` and `snap-center` on cards.
  - Desktop: responsive grid (e.g., `md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4`).
- Keep hero and rail heights comfortable; avoid `vh` units.

## Accessibility

- Provide an `aria-label="Popular services"` region. Cards are `button` elements with clear `aria-label` (e.g., "Find accountants for <Service>").
- Roving tabindex or natural tab order; Enter/Space activates navigation.
- Maintain 44px+ targets; visible focus rings; descriptive labels.

## Performance

- Static config for services; no runtime fetching. Icons via Phosphor tree-shaken imports.
- Avoid layout thrash; use CSS scroll-snap; GPU-friendly transitions; limit shadows to standardized depths.

## Telemetry (optional)

- Event: `popular_services_click` with `{ serviceSlug }` (client-only, no PII).

## Risks & Mitigations

- Long service titles: clamp to 1–2 lines with ellipsis; tooltips on hover for desktop.
- Overflow on mobile: scroll-snap with easing and sufficient card width.

## References

- PRD: `docs/prd/10-Product.md`, `docs/prd/20-Architecture.md`, `docs/prd/40-Design-System.md`
- Design guardrails: `docs/work-items/README.md`

## Implementation Notes (Completed)

- Component updated: `src/components/landing/ServicesRail.component.tsx`
  - Static, typed config colocated in component:
    - Type: `{ title: string; slug: string; Icon: IconBadgeProps["icon"]; description?: string }`
    - Icons from `@phosphor-icons/react` with `Icon` suffix (e.g., `ReceiptIcon`).
  - Navigation: builds query via `encodeFiltersToQuery({ specializations: [slug] })` from `src/helpers/search-url.helper.ts`,
    then merges with current URL by deleting `district|specializations|languages` and setting encoded values; pushes to `/accountants`.
  - Accessibility: cards are `button` elements with `aria-label="Find accountants for <Service>"`, 44px+ targets, visible focus ring.
  - Layout/responsiveness:
    - XS: horizontal scroll-snap rail, card width `w-[78vw]` (min 260px) to prevent edge clipping.
    - SM+: responsive grid using `grid-cols-[repeat(auto-fit,minmax(220px,1fr))]` to fully utilize width on large screens.
    - Scales typography: titles `text-sm → text-base` and descriptions `text-xs → text-sm` across breakpoints.
  - Visuals: reuses `IconBadge` (variant `default`, size `default`) and neumorphic classes (`shadow-neumorphic-md` → hover/inset variants).
  - Telemetry (optional): `useTelemetry()` from `src/hooks/useTelemetry.ts` logs `popular_services_click` with `{ serviceSlug }`.
    - Supports Plausible (`window.plausible`) and GA4 (`window.gtag`) if present; dev logs in non-prod.

### Example config entry

```ts
const popularServices = [
  { title: "Tax Filing", slug: "tax-filing", Icon: ReceiptIcon, description: "ITR filing and advisory" },
  // ...
];
```

### Navigation merge logic (essential)

```ts
const current = new URLSearchParams(searchParams?.toString());
const params = encodeFiltersToQuery({ specializations: [slug] });
["district", "specializations", "languages"].forEach((k) => current.delete(k));
params.forEach((v, k) => current.set(k, v));
router.push(current.toString() ? `/accountants?${current}` : "/accountants");
```

## Next Steps Hints

- Full-bleed option: swap section wrapper from `container` to a wider `max-w-7xl` or `max-w-none` with responsive paddings.
- Multi-select deep links: extend click handler to union with existing `specializations` from `parseFiltersFromQuery` before encoding.
- Long titles: add desktop-only tooltip on the title; keep `line-clamp-2` for copy.
- Service set curation: update the colocated `popularServices` array; icons are treeshaken via direct named imports.
