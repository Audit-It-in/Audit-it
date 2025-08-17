# Tasks Documentation

Each work item (task/initiative) lives in its own subdirectory with a consistent, spec-first structure.

## Structure

- Create a new subdirectory per task using a clear, kebab-case name (e.g., `accountant-page-neumorphic-redesign`).
- Inside each task directory, always maintain these three documents:
  - `design.md` — design/architecture details and component structure
  - `requirements.md` — user stories and acceptance criteria
  - `tasks.md` — implementation plan with checklists and status

## Authoring Guidelines

- Always derive context from the PRD in `docs/prd/*` when writing or updating these docs.
- Keep documents focused and actionable; update checklists in `tasks.md` as work progresses.
- Do not add index files; each task directory is self-contained.

## Workflow

1. Create `docs/work-tems/<task-name>/`.
2. Add `design.md`, `requirements.md`, and `tasks.md`.
3. As implementation proceeds, mark items in `tasks.md` with `[x]` when completed and add any follow-ups.
4. Keep references to PRD sections where helpful.

## Inferences from `accountant-page-neumorphic-redesign`

- **Design guardrails**: Strictly no gradients; use solid surfaces with subtle brand tints, deep neumorphic shadows (`shadow-neumorphic-*`), enhanced borders (`border-2/3`), rounded corners (`rounded-xl/2xl`), and smooth transitions. Maintain WCAG AA focus rings, 44px+ touch targets, mobile-first.
- **Architecture**: Preserve existing DB schema and fields; compose small components (≤200 lines); TS strict; no index files; follow import order (React → third-party → UI → types → utils).
- **Spacing hierarchy**: Container `p-6` → content sections `p-4` → icon containers `p-3` → text elements `p-2`. Avoid double padding.
- **Content strategy**: Combine closely related sections when logical (e.g., “Professional Audit Trail”); conditionally render sections only when data exists; remove decorative-only elements.
- **Performance**: Prefer standardized shadow depths; use `neumorphic-optimized` (GPU hints); progressive loading with skeletons; keep 60fps interactions.

### Reusable UI patterns (no gradients)

- **Container**:

```tsx
<Card className={cn(
  "shadow-neumorphic-xl border-2 border-primary-100/60 bg-white rounded-2xl",
  "hover:border-primary-200/80 transition-all duration-500 before:absolute before:inset-0 before:bg-white/40 before:opacity-40"
)}>
```

- **Interactive element**:

```tsx
<div className={cn(
  "px-4 py-3 rounded-xl text-xs font-semibold",
  "shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-inset",
  "bg-primary-50 hover:bg-primary-100 border-2 border-primary-200/60"
)}>
```

- **Button**:

```tsx
<Button className={cn(
  "px-8 py-4 rounded-2xl font-bold text-white",
  "bg-primary-700 hover:bg-primary-800 shadow-neumorphic-primary-xl border-2 border-primary-500/50 hover:border-primary-400/60"
)}>
```

- **Avatar frame**:

```tsx
<div className='p-2 rounded-full shadow-neumorphic-inset-deep bg-primary-50/60 border border-primary-200/40'>
  <div className='p-1 rounded-full shadow-neumorphic-lg bg-white' />
</div>
```

### Current status snapshot (for leverage)

- **Done**: Tailwind neumorphic utilities; ProfileHeader; ProfessionalSummary; Experience timeline.
- **Next**: Education cards; SidebarDetails; ProfileCTA.

### Checklist template for a new work-tem

1. Define scope from PRD (`docs/prd/*`) and write:
   - `requirements.md`: user stories + acceptance criteria
   - `design.md`: structure, patterns, data used (existing fields only)
   - `tasks.md`: implementation checklist with “[ ]/[x]”
2. Apply guardrails: no gradients, neumorphic shadows, borders, rounded corners, focus rings, mobile-first.
3. Use spacing hierarchy; avoid double padding; conditionally render.
4. Keep components ≤200 lines; TS strict; follow import order.
5. Add skeletons for loading; verify 60fps interactions; check WCAG AA.
