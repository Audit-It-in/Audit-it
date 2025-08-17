# Requirements: Dashboard Page Neumorphic Redesign

## User Stories

### As any authenticated user

- I see a premium, cohesive neumorphic dashboard with clear identity and next actions.

### As a Chartered Accountant (CA)

- I see my profile preview, quick actions, a summary of inbound contact requests (analytics), and a preview list of recent requests.

### As a Customer

- I see my profile preview, quick actions (Browse CAs, Edit Profile), and a preview list of my sent requests.

## Acceptance Criteria

1. WHEN the dashboard loads THEN I SHALL see a neumorphic layout (no gradients) with branded shadows and borders.
2. WHEN my identity loads THEN I SHALL see a Profile Preview card with avatar (verified stamp when applicable), name, username, location, verification status (owner-only), and completion percent.
3. WHEN I have role CA THEN I SHALL see an analytics summary sourced via RPC (fallback supported) and a preview list of inbound requests (max 5).
4. WHEN I have role Customer THEN I SHALL see a preview list of my sent requests (max 5) and getting-started guidance.
5. WHEN I click primary actions THEN I SHALL navigate appropriately: View Public Profile, Edit Profile, View Requests.
6. WHEN data is loading THEN I SHALL see matching neumorphic skeletons; WHEN errors occur THEN I SHALL see a neumorphic error message with retry.
7. The page SHALL maintain accessibility: landmarks, labels, focus-visible styles, and 44px+ touch targets.
8. The implementation SHALL not modify the database schema; only reuse existing hooks/services.
9. Components SHALL adhere to ≤200 lines; TS strict; composition over monoliths; no index files.

## Non-Functional

- Performance: responsive shadow utilities, lite mode support, pagination on previews.
- Code quality: consistent import order; enum-driven; no magic strings.
- Design consistency: apply established neumorphic tokens/utilities; no gradients.
