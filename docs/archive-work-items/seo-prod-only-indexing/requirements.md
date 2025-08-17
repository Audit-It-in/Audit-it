# Requirements: SEO — Production-only Indexing (Staging Noindex)

## User Story

As the site owner, I want only the production site (auditit.in) to be indexed so staging/preview environments are never crawled.

## Acceptance Criteria

1. Robots
   - Prod robots.txt allows crawling and references the sitemap.
   - Non-prod robots.txt disallows all and does not reference a sitemap.
2. X-Robots-Tag headers
   - Non-prod responses include: noindex, nofollow, noimageindex, noarchive.
   - Prod responses do not include blocking tags.
3. Sitemap
   - Prod serves sitemap.xml with core routes.
   - Non-prod returns a minimal inert sitemap (or no list of URLs beyond root).
4. Canonical/metadata base
   - metadataBase uses NEXT_PUBLIC_APP_URL.
   - Accountant profile canonical uses hyphenized state/district.
5. Page-specific robots
   - Dashboard is always noindex, nofollow.
   - Public pages index, follow only on prod.
6. Environment-driven behavior
   - Toggled via NEXT_PUBLIC_APP_URL (prod when includes auditit.in).
   - Netlify contexts set NEXT_PUBLIC_APP_URL correctly for production and previews/branch deploys.
7. Verification
   - Manual checks pass for robots.txt, sitemap.xml, canonical, and headers across prod and preview builds.

## Non-Functional

- No DB changes.
- Minimal runtime cost.
- Compatible with Next.js App Router metadata APIs.
- Config-as-code preferred; Netlify UI env overrides optional.
