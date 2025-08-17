# Tasks — Landing "How It Works" Neumorphic Upgrade

Note: Planning only. Do not commence implementation until explicitly approved.

## Checklist

- [x] Define scope from PRD and guardrails.
- [x] Author design and requirements (this work-item).
- [x] Implement updated UI in `src/components/landing/HowItWorks.component.tsx`.
- [x] Ensure fully mobile-responsive layout with clear breakpoints and no `vh`-based constraints.
- [x] Accessibility: roles, labels, keyboard flow, focus rings; SR text for steps.
- [x] Reduced motion: respect `prefers-reduced-motion`.
- [x] Optional telemetry: `how_it_works_view`, `how_it_works_focus`.
- [x] QA: visual, keyboard, SR, responsive, and performance checks.

## Acceptance Validation Steps

1. 3 step cards render with number badge, icon, title, and short description.
2. Mobile: stacked vertical list; Desktop (≥md): 3-column grid. No `vh` usage; comfortable spacing.
3. Visible focus rings; tab order left-to-right; no navigation on Enter/Space.
4. Neumorphic visuals only: `shadow-neumorphic-*`, borders, rounded corners; strictly no gradients.
5. Reduced motion honored: animations disabled/softened with `motion-reduce` utilities.
6. No runtime fetches; smooth 60fps interactions; icons treeshaken.

---

## LLM-Executable Implementation Plan

### 1) File to edit

- `src/components/landing/HowItWorks.component.tsx`

### 2) Data model (local, static)

- Keep a local `steps` array of exactly 3 entries:
  - `{ title: string; desc: string; Icon: PhosphorIcon }`
  - Titles: "Search", "Connect", "Get It Done"
  - Descriptions concise (≤80 chars)
  - Icons from `@phosphor-icons/react` with the `Icon` suffix (numbers or relevant pictograms)

### 3) Section wrapper

- Outer section:
  - Attributes: `aria-label='How it works'`
  - Classes: `py-12`
- Inner container:
  - Classes: `container mx-auto px-4 sm:px-6 lg:px-8`
- Heading block:
  - Title classes: `text-center text-2xl lg:text-3xl font-bold text-primary-900`
  - Subcopy classes: `text-center text-primary-800 mt-2`
- Body card wrapper (neumorphic):
  - Use `Card` or a `div` with classes: `p-6 shadow-neumorphic-xl border-2 border-primary-100/60 bg-white rounded-2xl`

### 4) Responsive layout (list semantics)

- Steps container uses list semantics and responsive grid:
  - Wrapper attributes: `role='list'`
  - Wrapper classes: `grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 relative`
  - Optional connector line (md+ only):
    - A child `div` absolutely positioned behind cards: `hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-primary-100`
    - Ensure it is rendered before the step items and does not intercept pointer events: add `pointer-events-none`

### 5) Step item (card) semantics and visuals

- Each step is a focusable list item, non-navigational:
  - Root element: `div`
  - Attributes: `role='listitem'`, `tabIndex={0}`, `aria-labelledby` pointing to the item title id
  - Base classes:
    - `rounded-2xl border-2 border-primary-100/60 bg-white p-5`
    - `shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-inset`
    - `transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white`
    - `motion-reduce:transform-none motion-reduce:transition-none`
- Inner layout:
  - Top row: icon frame + title
    - Icon frame classes: `p-2 rounded-xl bg-white border border-primary-200/60 shadow-neumorphic-md`
    - Icon classes: `h-6 w-6 text-primary-700`
    - Title element id: `id={`hiw-title-${i}`}` with classes `text-base font-semibold text-primary-900`
  - Description paragraph classes: `text-sm text-primary-800 mt-1`
- Number badge (absolute corner):
  - Wrapper classes: `absolute top-2 right-2 w-6 h-6 rounded-full border border-primary-200/60 bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center`
  - Content: step index (1..3)

### 6) Animation (subtle)

- Wrap each step with `AnimatedReveal` using staggered `delayMs={i*90}`.
- Respect reduced motion: current `AnimatedReveal` does not check `prefers-reduced-motion`; mitigate by adding Tailwind guards (`motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100`) on animated elements.

### 7) Accessibility details

- Section label is descriptive and unique on page: `aria-label='How it works'`.
- List semantics: wrapper `role='list'`, items `role='listitem'`.
- Keyboard:
  - Root items are focusable via `tabIndex={0}`.
  - No navigation on Enter/Space. Optionally, prevent default on keydown for Space/Enter to avoid scroll.
- Screen reader: add visually-hidden text to read step number (optional):
  - Ex: `<span className='sr-only'>Step {i+1}:</span>` before title text

### 8) Mobile responsiveness specifics

- Grid defaults to single column on small screens: `grid grid-cols-1 gap-4`.
- Spacing: maintain padding (`p-5`) inside step cards; do not stack double paddings.
- Typography scales:
  - Title: `text-base` (bump to `lg:text-lg` if needed)
  - Description: `text-sm` (bump to `lg:text-base` if needed)
- Hide connector line on mobile: `hidden md:block`.
- Ensure 44px+ tap targets: root step card padding + content must meet it.

### 9) Telemetry (optional)

- Import `useTelemetry` from `src/hooks/useTelemetry.ts`.
- Fire once on section visibility (IntersectionObserver or `useEffect` + viewport check):
  - Event: `how_it_works_view` (no PII)
- Fire on item focus (keyboard):
  - Event: `how_it_works_focus` with `{ step: i+1 }`
- Example usage in component (pseudo):

```tsx
const { track } = useTelemetry();
// on mount or on first intersection
track('how_it_works_view');
// on focus
onFocus={() => track('how_it_works_focus', { step: i + 1 })}
```

### 10) Prohibited visuals

- Do NOT use gradients. Avoid `bg-gradient-*` and any custom gradient utilities.
- Use only approved neumorphic utilities: `shadow-neumorphic-md`, `shadow-neumorphic-lg`, `shadow-neumorphic-inset`, `shadow-neumorphic-xl`.

### 11) Example JSX skeleton (copy into the component and adapt)

```tsx
<section aria-label='How it works' className='py-12'>
  <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
    <div className='text-center mb-8'>
      <h2 className='text-2xl lg:text-3xl font-bold text-primary-900'>How It Works</h2>
      <p className='text-primary-800 mt-2'>Three simple steps to expert help.</p>
    </div>

    <div className='p-6 shadow-neumorphic-xl border-2 border-primary-100/60 bg-white rounded-2xl'>
      <div role='list' className='relative grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6'>
        <div className='pointer-events-none hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-primary-100' />

        {steps.map(({ title, desc, Icon }, i) => (
          <AnimatedReveal key={title} delayMs={i * 90}>
            <div
              role='listitem'
              tabIndex={0}
              aria-labelledby={`hiw-title-${i}`}
              className='relative rounded-2xl border-2 border-primary-100/60 bg-white p-5 shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-inset transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transform-none motion-reduce:transition-none'
            >
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 rounded-xl bg-white border border-primary-200/60 shadow-neumorphic-md'>
                  <Icon className='h-6 w-6 text-primary-700' weight='fill' />
                </div>
                <h3 id={`hiw-title-${i}`} className='text-base font-semibold text-primary-900'>
                  <span className='sr-only'>Step {i + 1}: </span>
                  {title}
                </h3>
              </div>
              <p className='text-sm text-primary-800'>{desc}</p>

              <div className='absolute top-2 right-2 w-6 h-6 rounded-full border border-primary-200/60 bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center'>
                {i + 1}
              </div>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </div>
  </div>
  {/* Optional: IntersectionObserver to fire how_it_works_view */}
</section>
```

### 12) Import order and limits

- Import order: React → third-party → UI → types → utils/helpers.
- Keep the component ≤200 lines. If needed, inline a tiny `StepItem` function inside the same file.

### 13) QA Checklist

- Keyboard: Tab through the three items; focus ring visible; no scroll-jumps; Space/Enter do not navigate.
- Mobile: Items stack vertically; padding and tap targets ≥44px; connector line hidden.
- Desktop: 3-column grid; connector line visible; no overlap with focus rings.
- Contrast: Titles/desc pass AA vs white background; focus ring visible against white.
- Performance: Hover/active shadows feel responsive; no layout thrash.
- Reduced motion: With OS “Reduce motion” on, reveal/transform effects are minimal.

---

## Task Completions

- 1. Implement updated UI in `src/components/landing/HowItWorks.component.tsx` — Done
     .- 2) Ensure fully mobile-responsive layout — Done

  - Confirmed grid is `grid-cols-1` on mobile and `md:grid-cols-3` on desktop, connector line hidden on mobile.
  - Added responsive typography: titles `text-base lg:text-lg`, descriptions `text-sm lg:text-base`.
  - Section spacing tightened per recent edit (`py-4`) while maintaining comfortable content padding.

- 3. Accessibility upgrades — Done

  - Ensured section label uses `aria-label='How it works'`; list semantics (`role='list'`/`role='listitem'`).
  - Added `aria-describedby` for each item and SR-only prefix for step number.
  - Keyboard: Prevent default on Enter/Space to avoid unintended scroll/activation; visible focus ring preserved.

- 4. Reduced motion guards — Done

  - Applied `motion-reduce:transition-none` and `motion-reduce:transform-none` to animated wrappers and items; `AnimatedReveal` children honor reduce motion.

- 5. Optional telemetry — Done

  - Fired `how_it_works_view` once on first render; fired `how_it_works_focus` on item focus with `{ step }` prop via `useTelemetry`.
  - Replaced ad-hoc grid/cards with a single neumorphic section card containing a semantic list (`role='list'` / `role='listitem'`).
  - Added connector line on md+ behind cards; ensured `pointer-events-none` and proper stacking.
  - Implemented focusable step items with branded focus rings; added SR-only "Step n:" for announcements.
  - Added number badge in top-right corner; icon frame uses white surface with `shadow-neumorphic-md`.
  - Wrapped items with `AnimatedReveal` and added `motion-reduce:*` guards to respect reduced motion.
  - Avoided gradients entirely; used `shadow-neumorphic-*` and solid surfaces.

- 6. QA — Done
  - Verified keyboard flow, SR labeling, focus rings, reduced motion behavior, mobile/desktop layouts, and connector line z-index.

## Leverage Existing Code (verified)

- [x] `AnimatedReveal` — `src/components/landing/AnimatedReveal.component.tsx`

  - In-view reveal with opacity/translate; no reduced-motion detection built-in.
  - Action: Add `motion-reduce:*` classes on the animated wrappers as noted.

- [x] `Card` — `src/components/ui/card.tsx`

  - Use `variant='default'` (solid surface). Avoid `enhanced*` variants (they include gradients; not allowed by guardrails).
  - Alternatively, use a plain `div` with neumorphic classes; both are acceptable.

- [x] `IconBadge` — `src/components/ui/icon-badge.tsx`

  - Available if we choose a solid badge. For this design, prefer a white framed icon instead of a filled badge.

- [x] `cn` helper — `src/helpers/tailwind.helper.ts`

  - Use for class merging.

- [x] `useTelemetry` — `src/hooks/useTelemetry.ts`

  - Supports Plausible/GA4 with dev fallback. Events to use: `how_it_works_view`, `how_it_works_focus`.

- [x] Tailwind neumorphic utilities — `tailwind.config.js`

  - `shadow-neumorphic-{sm,md,lg,xl}`; brand variants `shadow-neumorphic-primary-*`, `shadow-neumorphic-accent-*`; inset variants.
  - Mobile-optimized shadows `shadow-neumorphic-mobile-*` available for performance if needed.

- [x] Phosphor icons — `@phosphor-icons/react`

  - Import with `Icon` suffix (e.g., `NumberCircleOneIcon`).

- [x] Do-not-use note: `src/components/ui/step-card.tsx`
  - Contains gradient classes; conflicts with strict “no gradients” guardrail. Do not reuse here.
