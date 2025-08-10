### Contact Requests UI Overhaul — 2025-08-10

Goal: Redesign discovery and profile experiences for Contact Requests to strictly match app layout and neumorphic brand design (soft depth, primary blue + accent emerald), with accessible, mobile-first UX. No schema changes.

### Scope (files/components)

- `src/components/contact-requests/discovery/SearchFilters.component.tsx`
- `src/components/contact-requests/discovery/AccountantDiscoveryPage.component.tsx`
- `src/components/contact-requests/discovery/AccountantProfileCard.component.tsx`
- `src/components/contact-requests/discovery/AccountantProfileView.component.tsx`
- New: `src/components/contact-requests/ContactRequestModal.component.tsx`
- New: skeletons/util subcomponents for the above

### Tasks (UI/UX)

- [x] Global layout alignment

  - [x] Discovery page uses the app shell spacing: `container mx-auto px-4 sm:px-6 lg:px-8` with vertical rhythm `space-y-6`
  - [x] Desktop: two-column layout with a left filter rail (sticky at `top-20`) and right results grid
  - [x] Mobile: filters collapse to a top bar + sheet; results below
  - [x] Profile page hero header spans full width with a primary→accent subtle gradient and a raised card inside

  Details:

  - Ensure discovery/profile pages visually sit inside the same shell spacing as `app/page.tsx` and `app/dashboard/page.tsx`.
  - Desktop: left rail is a vertical stack of filter sections with sticky positioning and a max width ~320px; right pane is the responsive card grid.
  - Mobile: a single “Filters” button toggles a sheet/dialog; content scrolls with a fixed action bar (Apply/Clear).
  - Profile: the hero uses a large raised `Card` with gradient backdrop ornaments (blurred brand blobs) per neumorphic spec.

  LLM Prompt:

  ```
  Update the accountants discovery and profile pages to adopt the app shell spacing and introduce a sticky left filter rail on desktop and a sheet-based filter UX on mobile. Use Tailwind utilities from our PRD (neumorphic shadows and brand borders). Keep existing data and hooks. Do not change DB or services.
  ```

- [x] Neumorphic design enforcement

  - [x] Cards: `shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm border border-primary-200/50`
  - [x] Inputs/Selects: `shadow-neumorphic-inset focus:shadow-neumorphic-focus` + brand focus ring
  - [x] Buttons: raised defaults with gradient fills; outline variants use inset shadows
  - [x] Pills/Badges: inset chips for metrics/filters; brand tints for emphasis
  - [x] Error states: red-tinted inset (`shadow-neumorphic-inset-error`) and `text-red-600/90`

  Details:

  - Replace any ad-hoc `shadow-*` or gray borders with the custom neumorphic utilities and brand-colored borders.
  - Hover/active transitions must be smooth (200–300ms) and reflect depth changes (raised → inset).
  - Inputs must feel pressed (inset) with branded focus; destructive states tint red but keep accessible contrast.

  LLM Prompt:

  ```
  Sweep all discovery/profile UI components to replace generic shadows/borders with neumorphic classes from the UI guidelines. Ensure consistent interactive states (default/hover/active/focus/error) with brand colors. No functional changes.
  ```

- [x] Discovery UI (Accountant listing)

  - [x] Top search bar with embedded `MagnifyingGlassIcon` and placeholder copy per PRD
  - [x] Filters
    - [x] Mobile: “Filters” button opens a sheet with sections (Location, Specializations, Languages, Verified, Sort). Primary action row at bottom (Apply/Clear)
    - [x] Desktop: sticky left filter rail with section headers and subtle dividers
    - [x] Quick active filter chips below search; each chip removable; a “Clear all” ghost button on the right
  - [x] Results header: left-aligned `UsersIcon` + count; right-aligned active filters summary (truncated on mobile)

- [x] Card grid: consistent card height; avatar in inset halo; verified badge chip; bio excerpt; metric pills (Experience, Services, Contact)

  - [x] Pagination: infinite scroll + explicit ‘Load more’ button styled with raised gradient
  - [x] Loading skeletons: avatar circle + two text bars inside a card with `shadow-neumorphic-sm`
  - [x] Empty state: large `MagnifyingGlassIcon`, headline, supportive text, and ‘Clear filters’ outline button

  Details:

  - Search: left icon; placeholder text mirrors PRD tone. On mobile, occupies full width.
  - Chips: show names for state/district/specializations/languages; on remove, mutate the same filter key.
  - Results header: truncate chip list on small screens; show count with proper pluralization.
  - Card grid: balance title/bio/metrics; no layout shift when images load.

  LLM Prompt:

  ```
  Enhance the discovery page UI: add removable active filter chips, improve the results header with a concise summary on the right, style cards with inset avatar halo and metric pills, and provide skeletons while loading. Keep current hooks/filters intact.
  ```

- [x] Search filters visual spec

  - [x] Inputs/selects use inset shadows; labels in primary shades; section titles with brand divider accent
  - [x] Location selects show state first; district disabled until state selected
  - [x] Specializations/Languages displayed as scrollable lists with checkbox + label; hover elevates chip slightly

- [x] Sort controls placed together with concise labels; order toggle uses a pill group

  - [x] Verified toggle as a single inset switch/checkbox with helper text

  Details:

  - Sections order: Search → Location → Sort → Specializations → Languages → Verified.
  - Each section title uses a subtle brand divider; lists cap height and scroll.
  - Keyboard: Tab order follows visual order; all labels are associated to controls.

  LLM Prompt:

  ```
  Restyle the SearchFilters UI to our neumorphic spec: inset inputs/selects with branded focus, scrollable lists with checkboxes, and a verified toggle. Maintain existing props/signatures and update only visuals and layout.
  ```

- [x] Profile card (in listing) polish

  - [x] Avatar container: small inset ring (`shadow-neumorphic-inset`) with gradient from primary-100 to accent-100
  - [x] Verified badge: small raised white pill with `CheckCircleIcon` accent
  - [x] Location row: inset dot/icon chip + truncated location text
  - [x] Metrics: 3 compact pills with consistent color mapping; hover increases depth
  - [x] CTA button: primary gradient (primary-600→700), white text, soft glow on hover

  Details:

  - Ensure consistent heights across cards; use `line-clamp` for bio.
  - Keep avatar fallback initials; signed URL is already handled at service/hook level.

  LLM Prompt:

  ```
  Redesign AccountantProfileCard visuals: inset avatar halo, verified badge pill, metric pills, and primary CTA with gradient. No data changes; preserve existing props.
  ```

- [x] Profile view (detail) visual system

  - [x] Hero: gradient background (white → primary-50/40 → accent-50/30), raised inner card
  - [x] Avatar: larger inset ring; verified badge scaled appropriately
  - [x] Headline stats: rating pill group and response-time pill with proper brand tones
  - [x] Highlights: two-column grid of neumorphic highlight tiles
  - [x] Experience/Education: list items as inset cards with icon leading and date chips
  - [x] Sidebar: stacked cards for Specializations, Languages, Verification, Contact Info (pills/badges consistent)
  - [x] Bottom CTA bar: centered, with primary CTA and optional outline secondary

  Details:

  - Avoid long walls of text; chunk into neumorphic tiles.
  - Ensure sticky/share header remains aligned to brand and doesn’t jitter on scroll.

  LLM Prompt:

  ```
  Apply the neumorphic visual system to the profile detail page: gradient hero, inset avatar, pill-based stats, and tiled sections. Keep existing hooks; update only markup/classes.
  ```

- [x] Contact request modal (visual)

  - [x] Modal surface raised; dimmed backdrop with soft blur; keyboard/ESC support
  - [x] Fields: subject, message, service select, urgency radio pills (low→urgent with color scale), optional phone, location
  - [x] Validation errors styled with inset-error and helper text pairing
  - [x] Submit button shows contextual loader; success state displays a lightweight success panel

  Details:

  - Modal is purely client-side UI; uses existing mutation `useCreateContactRequest`.
  - On success: close modal and later show a toast/snackbar (follow-up task) without navigation.
  - Respect neumorphic input/button styles and loading indicators.

  LLM Prompt:

  ```
  Implement a neumorphic contact request modal using react-hook-form + zod. Hook up `useCreateContactRequest`. Validate per PRD. Keep private storage policy intact; no schema/service changes.
  ```

- [ ] Accessibility & interactions

  - [x] All controls have labels/aria; chip remove buttons labeled; focus order correct
  - [x] Interactive states: hover/active/focus depth changes 200–300ms
  - [ ] Minimum touch targets ≥44px; keyboard navigation friendly

  Details:

  - Every interactive element must have a label or sr-only text. Ensure outline/focus rings are visible on keyboard nav.

  LLM Prompt:

  ```
  Audit the updated discovery/profile UIs for a11y: add ARIA labels, ensure focus indicators, and verify keyboard tab order. Do not alter data flow.
  ```

- [x] Iconography and typography

  - [x] Phosphor icons with `weight='bold'`, sizes `h-4 w-4`/`h-5 w-5` per context
  - [x] Brand color usage: icons adopt semantic brand classes; headings use primary-900/800; body neutral-700/600

  Details:

  - Prefer Phosphor with `Icon` suffix; keep weights bold; avoid mismatched sizes.

  LLM Prompt:

  ```
  Normalize iconography and typography across discovery/profile screens per PRD: Phosphor bold icons, consistent sizes, and brand color text classes.
  ```

- [x] Discovery page improvements `AccountantDiscoveryPage.component.tsx`

  - [x] Add Grid/Card skeletons for initial & next-page loading (neumorphic placeholders)
  - [x] Keep infinite scroll but also show an explicit “Load more” button; throttle intersection more aggressively on mobile
  - [x] Results header: show compact active-filter summary via `ActiveChips`
  - [x] Empty state: add branded CTA to clear filters; ensure copy matches PRD tone
  - [x] File size <200 lines by extracting:
    - [x] `ResultsHeader.tsx`
    - [x] `AccountantGrid.tsx`
    - [x] `LoadMoreTrigger.tsx`

  Details:

  - The explicit Load More should visually match neumorphic primary/outline variants depending on state.
  - Intersection observer threshold tuned for mobile (`rootMargin: 100px` or more) to avoid jank.

  LLM Prompt:

  ```
  Add an explicit “Load more” button to the discovery list, keep intersection observer for auto-load, and ensure both are styled per neumorphic spec.
  ```

- [x] Profile card polish `AccountantProfileCard.component.tsx`

  - [x] Keep using `useProfilePictureUrl` with storage path; show fallback initials while resolving
  - [x] Verified badge: gate on `verification?.verified_at` if provided by caller; keep lightweight here (no new fetch)
  - [x] Replace mock labels with props where possible; keep mock rating until analytics ready; ensure consistent neumorphic chips
  - [x] Ensure <200 lines; extract to:
    - [x] `ProfileCardHeader.component.tsx` (avatar, name, location, badge)
    - [x] `ProfileCardMetrics.component.tsx`
    - [x] `ProfileCardFooter.component.tsx`

- [x] Profile view hardening `AccountantProfileView.component.tsx`

  - [x] Use signed avatar URL via `useProfilePictureUrl` (parity with card), and use signed URL in structured data when available
  - [x] Split giant file into sections to meet <200 lines:
    - [x] `ProfileNav.tsx` (breadcrumb + share)
    - [x] `ProfileHeader.tsx` (avatar, name, location, headline stats)
    - [x] `ProfileHighlights.component.tsx`
    - [x] `ExperienceList.component.tsx`
    - [x] `EducationList.component.tsx`
    - [x] `SidebarDetails.component.tsx` (specializations, languages, verification, contact info)
    - [x] `ProfileCTA.component.tsx` (bottom CTA)
  - [x] Neumorphic consistency: gradients, inset chips, brand borders per UI doc
  - [x] A11y: buttons have labels; structured data remains; keep mobile-first layout

- [x] New contact modal `ContactRequestModal.component.tsx`

  - [x] Implement modal using `react-hook-form + zod` with enums from `src/types/contact-request.type.ts`
  - [x] Fields: subject, message, service_needed (select from specializations), urgency (enum radio), optional phone, location_city/state
  - [x] Validation: reuse service/helper constraints; surface errors with neumorphic error styling
  - [x] Hook up `useCreateContactRequest` with success/reset states; integrate `LoadingAction.SAVING`
  - [x] A11y: focus trap, ESC close, labelled title/description, screen-reader success/error
  - [x] Trigger from card button and profile view CTA (if authenticated customer); else route to `/auth?returnUrl=`

- [x] Skeletons/utilities (shared)
  - [x] `CardSkeleton.tsx`, `AvatarSkeleton.tsx`, `ChipSkeleton.tsx` with `shadow-neumorphic-*`
  - [x] Reuse across discovery grid and profile view

### Non-functional requirements

- **No DB schema changes**; services/hooks only
- **Signed URLs**: avatars rendered via signed URLs; fallback initials during resolve
- **Caching**: query keys per PRD; invalidate related queries after contact submission
- **Performance**: mobile-first, avoid layout shift; skeletons for perceived performance
- **Accessibility**: labels, roles, focus management, keyboard interactions
- **Design**: strict neumorphic depth with brand colors; consistent states

### Acceptance criteria (DoD)

- Discovery page aligns with app layout (container/spacing), desktop rail + mobile sheet
- Filters visually match neumorphic spec; chips removable; verified toggle present; sort clear
- Results header, cards, and skeletons use branded neumorphic styles; pagination polished
- Profile view hero/header/sections follow neumorphic hierarchy with proper brand accents
- Contact modal visuals meet neumorphic/brand spec with accessible states and loader feedback
- Avatars load via signed URL with graceful fallback; no visual flicker or console errors
- Lighthouse a11y checks pass for these views; interactions feel smooth (200–300ms transitions)

### Impacted files (initial)

- Edit: `src/components/contact-requests/discovery/SearchFilters.component.tsx` (visuals only)
- Edit: `src/components/contact-requests/discovery/AccountantDiscoveryPage.component.tsx` (layout/visuals)
- Edit: `src/components/contact-requests/discovery/AccountantProfileCard.component.tsx` (visuals)
- Edit: `src/components/contact-requests/discovery/AccountantProfileView.component.tsx` (layout/visuals)
- Add: `src/components/contact-requests/ContactRequestModal.component.tsx` (UI)
- Add: `src/components/contact-requests/skeletons/*` (UI skeletons)

### Notes

- Verified badge in list remains heuristic unless verification is provided by parent to avoid extra queries
- Structured data image: use signed URL if available by render; otherwise fallback to initials/avatar placeholder
