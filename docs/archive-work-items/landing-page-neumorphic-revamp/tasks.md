# Implementation Plan: Landing Page Neumorphic Revamp

## Constraints & Standards

- No gradients; use `shadow-neumorphic-*`, strong borders, rounded corners, transitions, branded focus rings
- Next.js 15, React 19, TS strict; components ≤200 lines
- Phosphor icons with `Icon` suffix; import order: React → third-party → UI → types → utils

## Checklist

- [x] 1. Author spec docs (`design.md`, `requirements.md`, `tasks.md`)
- [ ] 2. Add components under `src/components/landing/`
  - `LandingHero.component.tsx`
  - `TrustBar.component.tsx`
  - `ServicesRail.component.tsx`
  - `HowItWorks.component.tsx`
  - `BottomCTA.component.tsx`
- [ ] 3. Compose landing in `app/page.tsx` using the new components
- [ ] 4. Accessibility sweep: roles/labels, focus-visible, touch targets
- [ ] 5. Performance sweep: responsive shadows, lite mode, no layout shifts
- [ ] 6. QA: links route correctly; design aligns with guardrails; lint/typecheck green

## Notes

- Future: hero search wiring to discovery filters without adding new API
