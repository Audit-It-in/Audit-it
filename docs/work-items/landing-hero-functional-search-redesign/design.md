# Design — Landing Hero: Functional Search Redesign (City, Specialisation, Languages)

## Problem Statement

The current landing hero visually dominates the viewport (≈60–70vh) and lacks functional filtering. We need a compact, high-utility hero that enables users to initiate a focused search by city (district), specialisation(s), and language(s), without altering the database schema.

## Goals

- Compress hero vertical footprint while maintaining strong hierarchy and brand impact.
- Add a functional search with 3 inputs: City (District), Specialisations (multi), Languages (multi).
- Route users to the discovery page with filters encoded in the URL; hydrate UI state from URL on load.
- Follow neumorphic design guardrails (no gradients) and accessibility best practices.

## Non-Goals

- No new database tables/columns; reuse normalized lookups and existing discovery services.
- No maps, geolocation, or complex query suggestions from external APIs.
- No changes to search ranking logic beyond filters.

## Information Architecture

- Primary CTAs: Search submit; secondary links remain visible but de-emphasized.
- Inputs order: City → Specialisations → Languages (reflects most-to-least decisive filter).
- Desktop: hero ≤ 48–55vh max; Mobile: ≤ 56vh. Keep content above the fold with next section peeking.

## Data & Sources

- City: treat as District. Use normalized `states` and `districts` (from migrations) and existing list endpoints.
- Specialisations: use `specializations` lookup (with categories) via existing services.
- Languages: use `languages` lookup via existing services.
- Discovery: reuse `accountant-discovery.service.ts`/server variant for filtered queries.

## URL/State Strategy

- Navigate to `/accountants` with query params: `district`, `state`, `specializations` (csv), `languages` (csv).
- Slugs: use hyphenated, lowercase slugs for stability; map to IDs client-side or at the discovery page.
- Deep-linkable: On load, hydrate form from URL; on submit, push new URL preserving other unrelated params.

### URL helper spec (detailed)

- Encode: arrays must be de-duplicated and sorted lexicographically before CSV. Omit empty keys. Only slugs are allowed in URL.
- Decode: parse slugs, split CSV to arrays, sort deterministically, ignore unknown params. Helpers live in `src/helpers/search-url.helper.ts`.

## Components (≤200 lines each)

- `HeroSearchBar.component.tsx`
  - Inputs: City (typeahead select), Specialisations (checkbox group / multi-combobox), Languages (checkbox group / multi-combobox)
  - Validation: zod schema; controlled via `react-hook-form`.
  - Debounced async option loading; cache via TanStack Query with sensible `staleTime`.
  - Status: Skeleton created at `src/components/landing/HeroSearchBar.component.tsx`; accepts `states`, `districts`, `specializationOptions`, `languageOptions` and `onSubmit`.
- `LandingHero.component.tsx` (existing)
  - Integrate search bar; reduce vertical padding; reflow headline/subcopy to 2 rows.
  - Maintain illustration but compress max-height and move to the side or behind content using absolute container.

## Visual & Layout

- Neumorphic, no gradients; brand primary blue + accent emerald.
- Container: `shadow-neumorphic-xl border-2 border-primary-100/60 bg-white rounded-2xl`.
- Inputs: `shadow-neumorphic-md hover:shadow-neumorphic-lg focus:ring-primary-500`.
- Height note: No hard max-height on the hero card; maintain comfortable `py-8 sm:py-10`. Avoid `vh` on nested containers; constrain illustration via `max-h-56 md:max-h-64` so content breathes.
- Grid: 12 cols; left content (badge, headline, copy, search area, CTAs) spans 7 cols; illustration spans 5 cols on md+; stack on mobile.
- Spacing hierarchy: container `p-6` → sections `p-4` → input `p-3` → label `p-2`.

## Accessibility

- Labels and descriptions for all fields; keyboard navigable; 44px touch targets.
- Announce async option loading states; ensure contrast AA; visible focus rings.

## Performance

- Debounced queries (250–300ms); option result caching; avoid unnecessary re-renders.
- Limit option payloads; paginate if needed; lazy-load illustration.

## Error/Empty States

- If lookups fail, show inline `StatusMessage` with retry; allow manual entry disabled (strict list only).
- If no options match, show “No results” option in dropdown.

## Telemetry (optional)

- Log search submissions and filter combinations (client event only); no PII.

## Risks & Mitigations

- Ambiguity of “City” vs District: UI labels as “City/District” with helper text; map to district IDs.
- URL length for multi-selects: use concise slugs; de-duplicate and sort before encoding.

## References

- PRD: `docs/prd/10-Product.md`, `docs/prd/20-Architecture.md`, `docs/prd/40-Design-System.md`
- Guidelines: `docs/work-items/README.md`
