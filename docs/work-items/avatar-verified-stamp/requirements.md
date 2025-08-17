# Requirements: Avatar Verified Stamp

## User Story

As a user viewing profiles, I want a clear verified indicator on the avatar, so that I can quickly trust verified professionals at a glance.

## Acceptance Criteria

1. WHEN a profile is verified AND the `Avatar` is rendered THEN a circular verified stamp SHALL appear over the avatar using neumorphic styling (no gradients).
2. WHEN a profile is not verified THEN the avatar SHALL render without the stamp (no layout shift beyond the overlay itself).
3. The stamp SHALL scale with avatar size (`sm`, `md`, `lg`) and position correctly (default `bottom-right`).
4. The design SHALL follow neumorphic guardrails: `shadow-neumorphic-*`, strong borders (`border-2/3`), rounded corners, brand accent emerald coloring, and smooth transitions.
5. The implementation SHALL be accessible: provide an `aria-label` or `sr-only` text when needed; the stamp itself SHALL be non-interactive.
6. The change SHALL not modify the database schema; it SHALL rely on existing verification data from services/hooks.
7. The component code SHALL remain ≤200 lines; TS strict; no index files.

## Non-Functional

- Performance: Minimal DOM overhead; hardware-accelerated transitions via `neumorphic-optimized`.
- Code quality: Pure prop-driven behavior; no data fetching inside the UI component.
- Consistency: Works across all current avatar usage sites without breaking changes (new props are optional).
