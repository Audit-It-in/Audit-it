# Design: Accountants Route Hyphen Slugs

## Overview

Normalize the public profile route under `app/accountants/[state]/[district]/[username]` so that `state` and `district` segments use hyphens instead of spaces (and are lowercase). Example: `Andhra Pradesh / Sri Potti Sriramulu Nellore` → `andhra-pradesh/sri-potti-sriramulu-nellore`.

- No DB changes. Only URL presentation and decoding on the server-side route.
- Username behavior remains unchanged (already slug-safe); do not transform username beyond existing behavior.

## Scope

- Outbound links (client): build URLs with hyphenized `state_name` and `district_name`.
- Inbound route (server): accept hyphenized segments and map back to original names (replace `-` with space, preserve case-insensitive matching at the service layer).
- Canonical and SEO metadata: update canonical URLs to the hyphen form.

## Architecture

### Client-side link construction

- Introduce a small, pure helper for slug operations in `src/helpers/slug.helper.ts`:

  - `toSlug(text: string): string` → trims, lowercases, replaces whitespace runs with `-`, strips leading/trailing `-`, collapses duplicate `-`.
  - Do NOT remove valid letters; keep ASCII only for now. Non-ASCII handling can be a future enhancement.

- Use `toSlug` when composing links to the profile page in:
  - Dashboard profile card (inline JSX in `app/dashboard/page.tsx`)
  - Discovery grid/profile card components that link to public profile

### Server-side param normalization

- In `app/accountants/[state]/[district]/[username]/page.tsx`:
  - After `decodeURIComponent`, map hyphens back to spaces for `state` and `district` only.
  - Pass normalized values to `fetchAccountantProfileServer(state, district, username)`.
  - Ensure `generateMetadata` uses the same normalization.

### SEO and Canonical

- Ensure `generateMetadata().alternates.canonical` uses the hyphenized segments built via `toSlug`.
- Optionally, implement a soft canonical consistency by always emitting canonical in hyphen form even if accessed via a legacy URL (percent-encoded spaces). Hard redirects can be a future task if needed.

## Visual/UX (Neumorphic, no gradients)

- No visual changes beyond any link buttons. Continue to use neumorphic patterns: `shadow-neumorphic-*`, `border-2/3`, `rounded-xl/2xl`, branded focus rings, 44px+ touch targets.

## Risks / Considerations

- Back-compat: Links with percent-encoded spaces should continue to resolve; decoding logic will still succeed.
- Username collisions: unchanged. Do not alter `username` segment.
- i18n: For now, focus on English names; Unicode transliteration is out-of-scope.

## Test Matrix

- State/district with single space: `Uttar Pradesh` → `uttar-pradesh`.
- Multiple spaces and punctuation removed/collapsed: `Dadra   and  Nagar Haveli` → `dadra-and-nagar-haveli`.
- Mixed case input; output always lowercase.
- Access via legacy URL (with spaces encoded) still loads profile; canonical emits hyphen form.
