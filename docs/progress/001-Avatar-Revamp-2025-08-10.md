# Avatar Revamp — Progress & Plan

## Why this revamp

UI/UX and behavior for avatar upload/display are inconsistent with the project’s neumorphic guidelines and caching strategy, and the file handling around profile picture URLs is fragile.

## Findings (code-level)

- AvatarUpload bypasses the shared neumorphic `Avatar` UI and reimplements visuals with raw `next/image` and ad‑hoc shadows. Duplicate visual logic, not using `shadow-neumorphic-*` utilities.
  - Source: `src/components/common/AvatarUpload.component.tsx` — custom container instead of `src/components/ui/avatar.tsx`.
- Non-unique DOM id and imperative click: uses `document.getElementById('avatar-input')` which will break with multiple instances. Should use `useId` or ref.
- Missing `URL.revokeObjectURL` for local previews. Memory leak risk on repeated file selections.
- Public URL usage contradicts storage/privacy goals. `upload.service.ts` returns `publicUrl` for profile pictures; PRD indicates private buckets with signed URL access.
  - Source: `upload.service.ts#getPublicUrl` for `PROFILE_PICTURES` and `ACCOUNTANT_CERTIFICATES`.
- `profile.profile_picture_url` is treated as a direct URL in views (`AvatarImage src={...}`) and in `PersonalInfoStep`. This tightly couples DB to delivery URL; signed URLs should be resolved at runtime with caching.
  - Sources:
    - `src/components/contact-requests/discovery/AccountantProfileView.component.tsx`
    - `src/components/contact-requests/discovery/AccountantProfileCard.component.tsx`
    - `src/components/layout/Header.component.tsx`
- Validation is re-specified in components; should consume `FILE_VALIDATION` from `upload.service.ts` to prevent drift (some places already do, some don’t).
- Accessibility: missing input label association and keyboard trigger affordances; overlays lack ARIA.

## Target state

- Single source of truth UI: use `src/components/ui/avatar.tsx` for display and `AvatarUpload` for interaction, both adhering to neumorphic utilities and brand colors.
- Private storage paths saved in DB field `profile_picture_url` (semantics: storage path), not a public URL. Rendering resolves a signed URL on the fly.
- Signed URL layer: dedicated async function + React Query hook with caching and expiry, per PRD architecture.
- Robust upload flow: typed validation, progress, cancel/removal, consistent error surfacing, object URL revocation.
- A11y: labeled inputs, focus rings, keyboard access, ARIA for status/progress.

## Proposed APIs (concise)

```ts
// src/services/upload.service.ts
export async function uploadProfilePicture(
  file: File,
  userId: string
): Promise<{ success: boolean; path?: string; error?: string }>; // returns storage path only

// src/services/profile.service.ts (or a dedicated storage-url.service.ts)
export async function getSignedProfilePictureUrl(path: string): Promise<string>; // signed URL
export function useProfilePictureUrl(path?: string | null); /* { url, isLoading, error } */
```

Usage in views:

```tsx
// src/components/.../AccountantProfileCard.component.tsx
const { url } = useProfilePictureUrl(profile.profile_picture_url);
<AvatarImage src={url} alt={fullName} />;
```

## ToDos (execute in order)

1. Service semantics & privacy

- [x] Change `uploadProfilePicture` to return `path` only (stop returning `publicUrl`).
- [x] Update `PersonalInfoStep` save path: store `profile_picture_url` = storage path string.
- [x] Add `getSignedProfilePictureUrl(path)` and `useProfilePictureUrl(path)` with TanStack Query caching and sensible stale/expiry.
- [x] Implement simple in-memory cache keyed by `bucket:path` with expiry fallback (per PRD sample).

2. UI consistency & A11y in AvatarUpload

- [x] Refactor `AvatarUpload` to render `Avatar`, `AvatarImage`, `AvatarFallback` from `src/components/ui/avatar.tsx`.
- [x] Replace hardcoded shadow CSS with `shadow-neumorphic-*` utilities; keep brand color usage per UI spec.
- [x] Replace `document.getElementById` with a `ref` or `useId`; support multiple instances safely.
- [x] Add `aria-label`, `aria-describedby`, keyboard activation (Enter/Space) for the trigger region.
- [x] Revoke object URLs on unmount and when `value` changes.
- [x] Surface validation errors via a prop callback (`onError?: (msg: string) => void`) and/or visible helper text.

3. Integrate signed URLs in consumers

- [x] `AccountantProfileView`: swap to hook‑driven signed URL (with legacy absolute URL passthrough).
- [x] `AccountantProfileCard`: same swap.
- [x] `Header`: same swap.
- [x] Graceful fallback via `AvatarFallback` remains intact while URL resolves.

4. FileUpload hardening (shared improvements)

- [x] Centralize validation: default to `FILE_VALIDATION` where applicable; ensure messages consistent.
- [x] Add optional `onError` prop; display helper/error regions per UI/UX guidelines.
- [x] Revoke preview object URL and guard `next/image` usage with local blob.
- [x] A11y: label association, role=button on drop zone, keyboard handlers.

5. Visual polish to match PRD

- [x] Replace ad-hoc shadows with `shadow-neumorphic-*` classes across Avatar/File upload.
- [x] Ensure focus rings use brand tokens and smooth transitions (200–300ms).
- [x] Verify touch targets ≥44px via size presets (`lg` and above) and focusable wrappers.

6. Query/cache strategy

- [x] Query key pattern: `['profile-picture-url', path]`. Stale time 15 min, soft refetch.
- [x] Invalidate/clear URL cache after successful upload/delete.
- [x] Invalidate query key `['profile-picture-url']` after `saveProfileStep` to refresh avatar in UI.

7. DX and quality gates

- [ ] TS strict passes; no linter violations.

8. Migration/rollout plan

- [x] No legacy retention. Replaced UI usages with signed URL hook and removed public URL dependency in services.
- [x] For metadata (server), only absolute URLs are emitted; storage paths are omitted to avoid broken OG images. Add follow-up to generate absolute URLs server-side if needed.

Follow-ups (later):

- [ ] Server-side utility to produce absolute, time-safe image URLs for SEO metadata (if required by product).

## Acceptance criteria

- Avatar visuals match neumorphic guidelines and brand colors in all states (default, hover, active, focus, error).
- Profile picture upload reliably updates profile and re-renders with a signed URL, without flicker or memory leaks.
- All pages display avatars via the signed URL hook with real fallbacks and no console errors.
- A11y checks pass (labels, keyboard, ARIA) and touch targets are ≥44px.
- TS strict passes; no linter violations.

## Notes / edge cases

- Handle missing/invalid storage path by rendering initials fallback.
- If bucket policy changes, only the signed URL function needs adjustment.
- Consider optional image cropping before upload in a follow‑up task if UX requires it.
