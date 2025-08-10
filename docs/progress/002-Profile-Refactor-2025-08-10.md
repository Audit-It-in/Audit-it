## Profile Refactor — 2025-08-10

Goal: Bring all profile-related components under 200 lines without changing functionality or neumorphic/brand design.

### Scope

- `PersonalInfoStep.component.tsx`
- `ProfessionalStep.component.tsx`
- `EducationStep.component.tsx`
- `VerificationStep.component.tsx`
- `ProfileStepper.component.tsx`

### Tasks

1. Centralize step metadata (single source of truth)

   - [x] Create `src/constants/profile-step.constants.ts` (order, weights, titles, descriptions, icons)
   - [x] Refactor `ProfileStepper` to import constants; remove inline `STEP_CONFIG`, title/description helpers
   - [x] Add `src/components/profile/accountant/ProfileStepper.util.ts` (URL-sync + completed-steps helpers)
   - DoD:
     - [x] Stepper UI unchanged; navigation/progress identical
     - [x] One constants file drives order/weights/meta
   - Status: Completed ✅

2. Debounced username availability (remove ad-hoc timers/state)

   - [x] Add `src/hooks/useDebouncedUsernameAvailability.ts`
   - [x] Integrate into `PersonalInfoStep` (keep 800ms UX; same messages/suggestions)
   - DoD:
     - [x] No regressions in availability checks or preview URL
     - [x] Component line count drops and effects/state simplified
   - Status: Completed ✅

3. Profile picture upload flow (unify file state + upload + form sync)

   - [x] Add `src/hooks/useProfilePictureUpload.ts`
   - [x] Integrate into `PersonalInfoStep` (storage path persisted; signed URL display unchanged)
   - DoD:
     - [x] Same validation, limits, and loading states
     - [x] Cache invalidation for signed URL preserved
   - Status: Completed ✅

4. Array-form foundations (shared for Experience/Education)

   - [x] Add `src/hooks/useArrayForm.ts` (wraps `useFieldArray`; provides `appendEmpty`, `removeAt`, `resetFromExisting`, `saveAll` with provided save fn, delete-by-id glue)
   - [x] Add `src/components/profile/shared/DateRangeFields.component.tsx` (controlled `start_date`/`end_date` pair)
   - [x] Add `src/components/profile/shared/ArrayRowActions.component.tsx` (Remove/Add area with same neumorphic styling)
   - DoD:
     - [x] Produces identical markup/props to current fields
   - Status: Completed ✅

5. Refactor ProfessionalStep using shared array-form utilities

   - [x] Use `useArrayForm` for rows CRUD
   - [x] Use `DateRangeFields.component` for date pair (respect current max/disabled rules)
   - [x] Use `ArrayRowActions.component` for actions area
   - [x] Save via `useArrayForm.saveAll(saveExperience)` (Promise.all)
   - DoD:
     - [x] UI/validation identical; deletes persist; step < 200 lines
   - Status: Completed ✅

6. Refactor EducationStep using shared array-form utilities

   - [x] Mirror ProfessionalStep changes with `saveEducation`
   - DoD:
     - [x] UI/validation identical; deletes persist; step < 200 lines
   - Status: Completed ✅

7. VerificationStep cleanup

   - [x] Move `formatMembershipNumber` to `src/helpers/validation.helper.ts`
   - [ ] Optional: introduce `useCertificateUpload` only if needed later
   - DoD:
     - [x] Behavior unchanged; component < 200 lines if feasible without splitting visuals
   - Status: Completed ✅ (utility extraction)

### Shared Rules

- Preserve neumorphic UI (`Card`, `IconBadge`, `shadow-neumorphic-*`, brand colors) and icon policy (`Icon` suffix, `weight='bold'`).
- Accessibility intact; mobile-first.
- No index files; explicit imports only.

### Build & Lint

- TS strict + ESLint must pass.

### Acceptance (DoD)

- Each target component < 200 lines
- Visual parity with neumorphic brand design
- Private storage paths; signed URLs resolved at runtime; caches invalidated after upload
- Query keys/stale times per PRD
- Green build + lints
