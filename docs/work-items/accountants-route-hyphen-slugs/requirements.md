# Requirements: Accountants Route Hyphen Slugs

## User Story

As a customer sharing or bookmarking CA profiles, I want profile URLs under `/accountants/<state>/<district>/<username>` to use hyphens instead of spaces for state and district so the links are clean, readable, and consistent.

## Acceptance Criteria

1. WHEN a public profile link is rendered anywhere in the app THEN the `state` and `district` segments SHALL be lowercase and hyphenized (spaces collapsed to `-`).
2. WHEN a user opens a URL with hyphenized `state`/`district` segments THEN the server route SHALL correctly decode them back to original names and load the profile.
3. WHEN metadata is generated for the profile page THEN the canonical URL SHALL use hyphenized `state` and `district`.
4. WHEN a legacy URL containing spaces (percent-encoded) is accessed THEN the page SHALL still load successfully; the canonical still emits the hyphenized form.
5. The implementation SHALL not modify the database schema and SHALL reuse existing services and hooks.
6. The change SHALL not alter `username` behavior.
7. The UI SHALL continue to follow neumorphic design guardrails; no visual regressions are introduced.

## Non-Functional

- Code quality: small, pure helper with unit-like coverage via usage sites; TS strict.
- Performance: helper is O(n) on short strings; negligible cost.
- Backwards compatibility: tolerant decoding for legacy links.
