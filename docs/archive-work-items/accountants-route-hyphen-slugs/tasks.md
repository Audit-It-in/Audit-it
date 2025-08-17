# Implementation Plan: Accountants Route Hyphen Slugs

## Constraints & Standards

- No DB schema changes; reuse existing services and hooks.
- Keep code ≤200 lines per component; TS strict.
- Neumorphic guardrails remain in effect; this task is mostly routing/links.

## Checklist

- [x] 1. Add helper `src/helpers/slug.helper.ts`

  - Implemented `toSlug(text)` and `fromSlug(slug)` with whitespace→hyphen slugging and reverse mapping.

- [x] 2. Update server route param normalization

  - Updated `app/accountants/[state]/[district]/[username]/page.tsx` to de-slugify state/district via `fromSlug(...)` in both `generateMetadata` and the default export before calling services.

- [x] 3. Update canonical to hyphen form

  - `generateMetadata().alternates.canonical` now uses `toSlug(state)` and `toSlug(district)`.

- [x] 4. Update client link construction

  - Dashboard profile card in `app/dashboard/page.tsx` uses `toSlug(details.state_name)` and `toSlug(details.district_name)`.
  - Discovery links in `AccountantDiscoveryPage.component.tsx` and `AccountantProfileCard.component.tsx` updated to use `toSlug`.

- [x] 5. QA

  - Example verified: `Dadra   and  Nagar Haveli` → `dadra-and-nagar-haveli` via `toSlug`.
  - Legacy encoded-space URLs still resolve due to server-side `fromSlug` and service-side tolerant `.ilike(...replace(/-/g, " "))` matching.
  - Metadata canonical emits hyphenized segments.

## Notes

- Username unchanged; only state/district are slugified.
- Consider future enhancement for Unicode transliteration if required.
