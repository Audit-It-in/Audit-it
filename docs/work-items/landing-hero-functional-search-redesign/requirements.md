# Requirements — Landing Hero: Functional Search Redesign

## User Stories

- As a customer, I can search for accountants by City/District, so I see professionals in my area.
- As a customer, I can filter by one or more Specialisations, so I find relevant experts.
- As a customer, I can filter by one or more Languages, so I can communicate effectively.
- As a customer, I can submit the search from the landing hero and be taken to the discovery results page with my filters applied.
- As a returning user, I can share or revisit a URL and see the same filters prefilled in the discovery page.

## Acceptance Criteria

- Hero vertical height does not exceed 55vh on desktop and 56vh on mobile (portrait) under default content.
- The search area contains 3 inputs: City/District (single select), Specialisations (multi), Languages (multi).
- Inputs support typeahead search for long lists; async loading is debounced and displays a loading indicator.
- Submitting the form navigates to `/accountants` with the following query params:
  - `state`: state slug (optional, when city/district implies state, both may be included)
  - `district`: district slug (required when a city/district is selected)
  - `specializations`: comma-separated slugs of selected specialisations
  - `languages`: comma-separated slugs of selected languages
- For multi-selects, values are de-duplicated and sorted lexicographically before encoding to ensure stable URLs.
- Discovery page reads these params and applies filters; initial UI state is hydrated from URL.
- No DB schema changes.
- Neumorphic design guardrails are followed: no gradients, use `shadow-neumorphic-*`, brand colors, focus rings, mobile-first.
- All fields have accessible labels, helper text, and keyboard navigation, meeting WCAG AA.

## Constraints

- Tech stack: Next.js 15, React 19, TS strict, shadcn/ui, Tailwind, TanStack Query, react-hook-form + zod, Jotai.
- Performance: keep input interactions at 60fps; debounce 250–300ms; reasonable `staleTime` for lookups.
- Caching: lookup lists (states, districts, specialisations, languages) are treated as static and use `staleTime: 24h`.
- Components ≤200 lines; no index files; follow import order conventions.

## Edge Cases

- Selecting multiple specialisations and languages; ensure deterministic order in URL.
- No matching options returned; show “No results found”.
- Network errors while fetching options; show inline retry without breaking layout height.
- Empty submission (no filters); navigate to `/accountants` without extra params.

## Tracking

- Log non-PII client events for search submissions: selected filters, counts.

## Out of Scope

- Autocomplete powered by third-party places APIs; geolocation; saved searches; server-side A/B tests.
