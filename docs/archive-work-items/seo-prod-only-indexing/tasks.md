# Implementation Plan: SEO — Production-only Indexing

## Constraints & Standards

- No database changes; App Router only.
- Keep changes configuration-driven and environment-aware.
- Avoid gradients (UI guardrail unaffected by this task).

## Checklist

- [x] 1. Global metadata base and robots
  - Add `metadataBase` to `app/layout.tsx` using `APP_CONFIG.url`.
  - Make `robots` dynamic: index/follow only when `NEXT_PUBLIC_APP_URL` includes `auditit.in`.

- [x] 2. Robots route
  - Create `app/robots.ts` to:
    - Prod: allow all + sitemap URL
    - Non-prod: disallow all, no sitemap

- [x] 3. Sitemap route
  - Create `app/sitemap.ts` to:
    - Prod: emit core routes
    - Non-prod: minimal inert sitemap

- [x] 4. Headers for non-prod
  - Update `next.config.ts` to send `X-Robots-Tag: noindex, nofollow, noimageindex, noarchive` for all non-prod routes.

- [x] 5. Page-level robots
  - Profile page: set robots to prod-only index/follow; canonical uses hyphenized state/district
  - Dashboard: always `noindex, nofollow` via `app/dashboard/layout.tsx`
  - Home: robots follows prod-only rule

- [x] 6. Netlify context env
  - In `netlify.toml`, set:
    - production: `NEXT_PUBLIC_APP_URL=https://auditit.in`
    - deploy-preview: `NEXT_PUBLIC_APP_URL=${DEPLOY_PRIME_URL}`
    - branch-deploy: `NEXT_PUBLIC_APP_URL=${URL}`

- [ ] 7. QA
  - Verify prod robots.txt allows and references sitemap
  - Verify preview/branch robots.txt disallows all
  - Check response headers on preview/branch include `X-Robots-Tag`
  - Validate canonical on profile pages is absolute and hyphenized
  - Confirm dashboard pages have `noindex`
  - Submit prod sitemap to Search Console

## Notes

- Behavior key: `NEXT_PUBLIC_APP_URL` must be correctly set per environment.
- Future: expand sitemap with real dynamic routes when server-side data listing is available.
