# Tasks — Landing Popular Services Neumorphic Upgrade

Note: Planning only. Do not commence implementation until explicitly approved.

## Checklist

- [x] Define scope from PRD and guardrails.
- [x] Author design and requirements (this work-item).
- [x] Add static config for services in `src/components/landing/ServicesRail.component.tsx` (local const):
  - `{ title, slug, Icon, description? }` with Phosphor icons (suffix `Icon`).
- [x] Update `ServicesRail.component.tsx` to render neumorphic cards:
  - Horizontal scroll on mobile with scroll-snap; grid on md+.
  - Accessible button cards with `aria-label` and keyboard activation.
  - On click, build URL via `encodeFiltersToQuery({ specializations: [slug] })` and navigate with router.
  - Preserve unrelated params from current location if present.
- [x] Ensure section heading with branded styles and description.
- [x] Add optional telemetry hook for `popular_services_click`.
- [x] QA: keyboard navigation, focus visibility, scroll behavior, navigation URLs.

## Acceptance Validation Steps

1. Verify 6–12 service cards render with correct labels and icons.
2. Confirm mobile horizontal scrolling with snap and no layout jank.
3. Activate a card (click/Enter/Space) navigates to `/accountants?specializations=<slug>`.
4. Visuals match neumorphic guardrails: shadows, borders, rounded corners; no gradients.
5. No runtime fetches; bundle size acceptable; icons treeshaken.
