# Tasks — Landing Hero: Functional Search Redesign

Note: Planning only. Do not commence implementation until explicitly approved.

## Checklist

- [x] UX finalize: hero uses full natural height within comfortable padding; no hard max-height cap on the card.

  - Section padding baseline: `py-8 sm:py-10`. No `max-h` on the card. Content arranged in 12-col grid for maximum utilization on md+.
  - Illustration: constrain with `max-h-56 md:max-h-64` and place on the right (5 cols) to avoid vertical bloat.

- [x] Create `HeroSearchBar.component.tsx` skeleton (no wiring yet):

  - [x] zod schema and RHF form
  - [x] Inputs: City/District (single), Specialisations (multi), Languages (multi)
  - [x] Submit button with primary styling
  - Notes: Skeleton added at `src/components/landing/HeroSearchBar.component.tsx`. Exposes `onSubmit(values)` and accepts optional static options for states/districts/specializations/languages (slug-based). Enforces deterministic, de-duplicated arrays.

- [x] Service hooks (plan only):

  - Lookup queries (TanStack Query):
    - `useStatesOptions(query?: string)` with `staleTime: 24*60*60*1000` (static lookup)
    - `useDistrictsOptions(stateSlug?: string, query?: string)` with `staleTime: 24h`
    - `useSpecializationsOptions(categorySlug?: string, query?: string)` with `staleTime: 24h`
    - `useLanguagesOptions(query?: string)` with `staleTime: 24h`
  - Debounced typeahead helpers:
    - `useDebouncedValue<T>(value: T, delayMs = 275)` for input-driven queries
    - Option mappers normalize to `{ id, label, slug, disabled? }`

- [x] URL encoding/decoding helpers spec: csv encode/decode, slug mapping, stable order

  - New helper (to be implemented): `src/helpers/search-url.helper.ts`
    - `encodeFiltersToQuery({ state, district, specializations, languages }): URLSearchParams`
      - slug inputs only; arrays de-duped + sorted; empty omitted
    - `parseFiltersFromQuery(search: string): { state?: string; district?: string; specializations: string[]; languages: string[] }`
      - accepts slugs; unknown params ignored; returns arrays sorted

- [x] Integrate into `LandingHero.component.tsx` (plan):

  - Reduce vertical padding: `py-8 sm:py-10`
  - Wrap search in inset card and place beneath headline
  - Ensure mobile keyboard doesn’t jump layout: avoid `vh` units on containers; use `min-h-0` in grid slots; cap illustration height
  - On submit: navigate to `/accountants?district=...&state=...&specializations=a,b&languages=c,d` using next/navigation `useRouter().push()`; preserve unrelated params

- [x] Accessibility review plan: labels, descriptions, roles, focus rings, error messages

  - Labels on all fields via `FormLabel`; `FormDescription` for helper text; focus rings use branded classes; check keyboard order and tab stops; ensure 44px targets.

- [x] Performance plan: measure FID for inputs, limit renders, lazy-load illustration

  - Debounce 250–300ms; cache lookups 24h; memoize options; virtualize long lists if needed; lazy-load illustration below the fold.

- [x] QA plan: cross-browser, URL deep link hydration, edge cases

  - Verify empty submission routes to `/accountants` with no extra params; multi-select deterministic ordering; network error handling shows inline retry and doesn’t alter height.

- [x] Telemetry plan: client event for search submissions (non-PII)
  - Event: `landing_hero_search_submit` with payload `{ district, state, specializationsCount, languagesCount }`

## Acceptance Validation Steps (to be executed after build)

1. Verify hero height across breakpoints with sample content.
2. Validate search query param formation and navigation.
3. Confirm discovery page filters hydrate from URL.
4. Check accessibility: keyboard flow, screen reader labels, focus visibility.
5. Test performance: input responsiveness, debounced fetches, cache behavior.
