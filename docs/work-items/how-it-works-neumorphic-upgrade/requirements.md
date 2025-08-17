# Requirements — Landing "How It Works" Neumorphic Upgrade

## User Stories

- As a visitor, I can understand in 3 quick steps how the platform works.
- As a keyboard user, I can navigate the steps and see a clear focus ring.
- As a screen reader user, I hear structured announcements for each step.

## Acceptance Criteria

- Section is labeled "How it works" and is accessible via a landmark/region.
- Renders 3 steps with: number badge, icon, title, short description.
- Visuals follow neumorphic guardrails: `shadow-neumorphic-*`, solid surfaces, brand tints, rounded corners, branded focus rings; strictly no gradients.
- Layout:
  - Mobile: stacked list; Desktop: 3-column grid.
  - Optional connector line on md+ behind the cards, not interfering with focus.
- Interaction:
  - Items are keyboard focusable; focus ring visible; no navigation on activation.
  - `AnimatedReveal` used with reduced motion honored.
- Performance: no data fetching; static content; smooth interactions.
- Accessibility: WCAG AA contrast; labels, roles, and announcements present.

## Constraints

- Tech: Next.js 15, React 19, TS strict, shadcn/ui, Tailwind.
- Components ≤200 lines; no index files; reuse existing UI helpers/components.

## Edge Cases

- Long localized titles/descriptions should wrap without breaking layout.
- High zoom or small screens maintain 44px targets and readable text.

## Tracking (optional)

- Log `how_it_works_view` once on viewport entry; `how_it_works_focus` when a step gains keyboard focus.

## Out of Scope

- Changing the platform flow, adding links from steps, or adding new steps.
