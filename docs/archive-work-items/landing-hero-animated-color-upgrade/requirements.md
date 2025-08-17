# Requirements: Landing Hero — Animated Color Upgrade

## User Stories

- As a visitor, I want a lively, premium hero so I’m motivated to click Search or Join.
- As an accessibility-conscious user, I want motion that respects my OS settings.
- As a developer, I want a guardrail-compliant, performant implementation.

## Acceptance Criteria

1. WHEN the landing page loads THEN the hero SHALL animate in with staggered headline and reveal of subcopy/CTAs using solid-surface neumorphic components (no gradients).
2. WHEN idle on capable devices THEN subtle floating brand-tinted chips SHALL move slowly; on reduced-motion or lite mode they SHALL not animate.
3. WHEN the search input/card is focused THEN a branded focus ring and slight shadow depth change SHALL appear; performance remains smooth.
4. CTAs SHALL keep neumorphic hover/active states with `hover:scale-110` and `active:scale-95` plus branded shadows.
5. The design SHALL follow guardrails: solid tints, `shadow-neumorphic-*`, strong borders, rounded corners, focus rings, 44px+ touch targets.
6. The implementation SHALL honor `prefers-reduced-motion` and `data-neumo-mode="lite"` by disabling idle motion and reducing heavy shadows.
7. No database/API changes; only UI/styling; components remain ≤200 lines and TS strict.

## Non-Functional

- Performance: transform/opacity-only animations; 60fps target; no large shadow animations.
- Accessibility: ARIA labels on hero and controls; motion reduction honored.
- Code quality: import order, enum-first types, no index files.
