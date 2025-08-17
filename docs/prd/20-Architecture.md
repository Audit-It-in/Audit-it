# Architecture, Types, Performance

## Quick Summary

- State Management: Jotai (client), TanStack Query (server)
- Service Layer: Pure async functions + dedicated React Query hooks
- Architecture: Domain-based, no index files, explicit imports
- Patterns: Consistent query keys, error normalization, optimal caching

---

## State Management Strategy

### Core Libraries

#### TanStack Query (React Query)

- Purpose: Server state, caching, background updates
- Usage: All data fetching (APIs/database)
- Benefits: Caching, background refetch, optimistic updates

#### Jotai

- Purpose: Client-side UI state
- Usage: Form/UI state, derived atoms
- Benefits: Atomic, minimal boilerplate, strong TS support

### State Management Patterns

```typescript
// Server data → TanStack Query
const { data: profile, isLoading, error } = useProfile(userId);

// UI state → Jotai
const [isMenuOpen, setIsMenuOpen] = useAtom(menuOpenAtom);

// Avoid useState for server data
```

Guidelines:

1. Server State: Always use TanStack Query for API/DB data
2. Client State: Use Jotai for UI state that doesn't persist
3. Form State: react-hook-form with Jotai for complex forms
4. Derived State: Jotai computed atoms

---

## Service Layer Architecture

### Core Principles

#### Pure Async Functions

- No React dependencies; independently testable and reusable

#### TanStack Query Integration

- Separate hooks per operation, consistent structure and naming, proper cache keys

### Service File Structure (Pattern)

```typescript
// === CORE SERVICE FUNCTIONS ===
export async function fetchProfile(userId: string): Promise<Profile> {
  /* ... */
}
export async function updateProfile(data: UpdateProfileData): Promise<Profile> {
  /* ... */
}

// === TANSTACK QUERY HOOKS ===
export function useProfile(userId: string) {
  /* ... */
}
export function useUpdateProfile() {
  /* ... */
}
```

### Guidelines

1. One service file per domain (e.g., `profile.service.ts`)
2. Clear CRUD naming
3. Comprehensive error handling with friendly messages
4. Full TypeScript coverage
5. Appropriate stale times by volatility

### Query Key Patterns

```typescript
["profile", userId][("profiles", { role: "ca" })][("contact-requests", userId, filters)];
```

### Cache Management Strategy

#### Stale Time Guidelines

- Static Data: 24h
- User Profiles: 30m
- Contact Requests: 5m
- Real-time Data: 0

#### Invalidation Patterns

```typescript
queryClient.invalidateQueries({ queryKey: ["profile", userId] });
queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
```

#### Error Handling Strategy

```typescript
export async function fetchProfile(userId: string): Promise<Profile> {
  try {
    // ... supabase query
    return transformProfile(data);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw new Error("Unable to load profile. Please try again.");
  }
}
```

---

## Type System and Enums

### Organization

```
src/types/
├── common.type.ts
├── auth.type.ts
├── profile.type.ts
├── ui.type.ts
└── location.type.ts
```

### Common Types

```typescript
export enum StatusMessageType {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}
export interface StatusMessage {
  type: StatusMessageType;
  text: string;
}
export enum LoadingState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}
export enum AsyncState {
  IDLE = "idle",
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}
```

### Auth Types

```typescript
export enum AuthTab {
  SIGNIN = "signin",
  SIGNUP = "signup",
}
export enum AuthErrorType {
  ACCESS_DENIED = "access_denied",
  CALLBACK_ERROR = "callback_error",
  CANCELLED = "cancelled",
  DEFAULT = "default",
}
export enum AuthLoadingState {
  AUTHENTICATING = "authenticating",
  REDIRECTING = "redirecting",
  LOADING = "loading",
  SETTING_UP = "settingUp",
}
```

### UI Types

```typescript
export enum LoadingAction {
  SAVING = "saving",
  UPLOADING = "uploading",
  SEARCHING = "searching",
  PROCESSING = "processing",
  LOADING = "loading",
  SYNCING = "syncing",
  DOWNLOADING = "downloading",
}
```

### Usage Patterns

```typescript
// Enum-driven state
const [activeTab, setActiveTab] = useState<AuthTab>(AuthTab.SIGNIN);
const [message, setMessage] = useState<StatusMessage | null>(null);

// Type-safe mappings
export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, StatusMessage> = {
  /* ... */
};

// Helper mapping from raw error codes to enum and message
function getAuthErrorType(errorCode: string | null): AuthErrorType {
  if (!errorCode) return AuthErrorType.DEFAULT;
  const values = Object.values(AuthErrorType) as string[];
  return values.includes(errorCode) ? (errorCode as AuthErrorType) : AuthErrorType.DEFAULT;
}

export function getAuthErrorMessage(errorCode: string | null): StatusMessage {
  const type = getAuthErrorType(errorCode);
  return AUTH_ERROR_MESSAGES[type];
}
```

### Best Practices

1. Enum naming: descriptive, SCREAMING_SNAKE_CASE values
2. Enum values: lowercase strings; concise and consistent
3. Separation: common vs domain vs UI types
4. Import organization: group by type category; explicit imports; no barrels

### Type System Benefits

1. Normalized Data: Types enforce FK relationships and ID arrays
2. Extensibility: Add languages/specializations via DB without type churn
3. Performance: Optimized queries using IDs vs text matching
4. Maintainability: Clear separation between common, domain, UI concerns
5. Enum Safety: Compile-time validation prevents magic strings and typos
6. Autocomplete: Full IntelliSense for enum values and contracts
7. Refactoring: Safe renames cascade through the codebase

---

## File Organization Rules

### No Index Files Policy

- Avoid index.ts/js; use explicit imports to enforce clear module boundaries.

```typescript
// Direct imports
import { APP_CONFIG } from "@/constants/app.constants";
```

---

## Caching and Performance

### Bundle Optimization

- Route/component-level code splitting via dynamic imports
- Prefer specific imports; avoid barrels; analyze bundle pre-release

### Image Optimization

- Next Image with `sizes`, `priority` above the fold
- Supabase storage remotePatterns configured in `next.config.ts`
- Avatar signed URLs cached via React Query (stale ~15m)

### React Rendering

- Memoize list items, callbacks, expensive calculations
- Virtualize long lists where needed
- Debounce search inputs; lazy-load filters

### TanStack Query

- Stale times by volatility (profiles 30m, requests 5m, discovery 10m, analytics 15m)
- Prefetch static lookups; deduplicate by key

### Neumorphic CSS Performance

- Use `.neumorphic-optimized` for acceleration
- Prefer transform/opacity transitions; reduce shadow intensity on mobile

### Network

- Batch related requests via `Promise.all`; avoid chatty updates; mutate then invalidate

### Monitoring

- Track Web Vitals and compare against performance budget before release

---

## Services vs Helpers Architecture

### Services (`/src/services/`)

Purpose: Handle data fetching, API calls, and database operations.

### Helpers (`/src/helpers/`)

Purpose: Pure utilities, formatting, validation. Helpers never call services.

---

## Related Documentation

- [10-Product](./10-Product.md)
- [30-Data-and-Integration](./30-Data-and-Integration.md)
- [40-Design-System](./40-Design-System.md)
