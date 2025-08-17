# Requirements: Landing Page Neumorphic Revamp

## User Stories

- As a customer, I want a compelling landing page that clearly shows value and lets me quickly find CAs, so I can start confidently.
- As a CA, I want a clear path to join and understand the platform’s trust and reach, so I’m motivated to sign up.

## Acceptance Criteria

1. WHEN the landing loads THEN I SHALL see a premium neumorphic hero (no gradients) with headline, subcopy, and two CTAs: Search CAs and Join as CA.
2. WHEN I scroll THEN I SHALL see a Trust bar with metrics (rating, verified CAs, Made in India) styled with neumorphic icon chips.
3. WHEN I view services THEN I SHALL see 4 neumorphic service tiles: Tax Filing, GST Services, Audit Services, Business Setup.
4. WHEN I view the guide THEN I SHALL see a "How It Works" section with 3 steps and numbered badges.
5. WHEN I reach the bottom THEN I SHALL see a conversion CTA band with Search and Join actions.
6. The design SHALL comply with guardrails: no gradients, `shadow-neumorphic-*`, brand colors, rounded corners, borders, 44px+ touch targets, accessible focus rings.
7. The change SHALL not modify DB schema; only UI components and page composition are updated.
8. Components SHALL be ≤200 lines and TS strict; import order respected.

## Non-Functional

- Performance: responsive shadows + lite mode; no heavy images; 60fps interactions
- Accessibility: ARIA labels on regions; keyboard navigation; screen-reader-friendly headings
- Code quality: composition over monoliths; reusable components under `src/components/landing/*`
