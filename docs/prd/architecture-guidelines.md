# Architecture Guidelines

## Quick Summary

- **State Management**: Jotai for client state, TanStack Query for server state
- **Service Layer**: Dedicated service files with pure async functions + React Query hooks
- **Architecture**: Domain-based organization with clear separation of concerns
- **Patterns**: Consistent service patterns, proper error handling, optimal caching

## Detailed Sections

### [State Management Strategy](#state-management-strategy)

### [Service Layer Architecture](#service-layer-architecture)

### [Component Organization](#component-organization)

### [Caching and Performance](#caching-and-performance)

---

## State Management Strategy

### Core Libraries

#### TanStack Query (React Query)

- **Purpose**: Server state management, caching, background updates
- **Usage**: All data fetching operations (API calls, database queries)
- **Benefits**: Automatic caching, background refetching, optimistic updates
- **Configuration**: Global query client with appropriate defaults

#### Jotai

- **Purpose**: Client-side state management for UI state
- **Usage**: Form state, UI toggles, temporary data, derived state
- **Benefits**: Atomic approach, minimal boilerplate, excellent TypeScript support
- **Patterns**: Atom-based state with computed derivatives

### State Management Patterns

```typescript
// ✅ Good: TanStack Query for server data
const { data: profile, isLoading, error } = useProfile(userId);

// ✅ Good: Jotai for UI state
const [isMenuOpen, setIsMenuOpen] = useAtom(menuOpenAtom);

// ❌ Avoid: useState for server data
const [profile, setProfile] = useState(null);
```

### Guidelines

1. **Server State**: Always use TanStack Query for data from APIs/database
2. **Client State**: Use Jotai for UI state that doesn't persist
3. **Form State**: Use react-hook-form with Jotai for complex forms
4. **Derived State**: Use Jotai's computed atoms for derived values

---

## Service Layer Architecture

### Core Principles

#### Pure Async Functions

- **No React Dependencies**: Service functions are pure async functions
- **Independently Testable**: Can be unit tested without React context
- **Reusable**: Can be used in different contexts (components, background tasks)

#### TanStack Query Integration

- **Separate Hooks**: Each operation gets its own custom hook
- **Consistent Patterns**: All hooks follow the same structure and naming
- **Proper Cache Keys**: Consistent cache key patterns across services

### Service File Structure

```typescript
// Service file structure pattern
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/context/Auth.provider";

// === CORE SERVICE FUNCTIONS ===

export async function fetchProfile(userId: string): Promise<Profile> {
  // Pure async function with comprehensive error handling
}

export async function updateProfile(data: UpdateProfileData): Promise<Profile> {
  // Pure async function with proper validation
}

// === TANSTACK QUERY HOOKS ===

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
```

### Service Layer Guidelines

1. **File Organization**: One service file per domain (`profile.service.ts`, `contact-requests.service.ts`)
2. **Function Naming**: Clear, descriptive names following CRUD patterns
3. **Error Handling**: Comprehensive try-catch with logging and fallback data
4. **Type Safety**: Full TypeScript coverage with proper interfaces
5. **Cache Strategy**: Appropriate stale times based on data volatility

### Query Key Patterns

```typescript
// ✅ Consistent query key patterns
["profile", userId][("profiles", { role: "ca" })][("contact-requests", userId, filters)]; // Single entity // Collection with filters // Dependent queries
```

### Cache Management Strategy

#### Stale Time Guidelines

- **Static Data** (constants): 24 hours
- **User Profiles**: 30 minutes
- **Contact Requests**: 5 minutes
- **Real-time Data**: 0 (always fresh)

#### Invalidation Patterns

```typescript
// ✅ Granular invalidation
queryClient.invalidateQueries({ queryKey: ["profile", userId] });

// ✅ Pattern-based invalidation
queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
```

---

## Component Organization

### Domain-Based Structure

```
src/components/
├── ui/                        # shadcn/ui components (kebab-case naming)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── form.tsx
│   └── ...
├── auth/                      # Authentication feature
│   ├── SignInForm.component.tsx
│   └── SignUpForm.component.tsx
├── profile/                   # Profile management feature
│   ├── ProfileCard.component.tsx
│   └── ProfileForm.component.tsx
├── contact-requests/          # Contact request feature
│   ├── RequestCard.component.tsx
│   └── RequestList.component.tsx
└── layout/                    # Layout and navigation
    ├── Header.component.tsx
    └── Footer.component.tsx
```

### Service Layer Structure

```
src/services/
├── auth.service.ts             # Authentication operations
├── profile.service.ts          # Profile CRUD operations
├── location.service.ts         # States and districts data
├── language.service.ts         # Language management
├── specialization.service.ts   # Specialization management
├── contact-requests.service.ts # Contact request management
└── storage.service.ts          # File upload/storage
```

### UI Component Architecture

#### shadcn/ui Integration

The project uses **shadcn/ui** with a **New York** style configuration:

```typescript
// Import shadcn components with proper path aliasing
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";

// Component composition following shadcn patterns
export const ProfileCard = ({ profile, className, ...props }: Props) => {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <UserIcon className='h-5 w-5' />
          {profile.first_name} {profile.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground'>{profile.bio}</p>
      </CardContent>
    </Card>
  );
};
```

#### Form Architecture Standards

All forms must follow the **react-hook-form + zod + shadcn** pattern:

```typescript
// Standard form architecture
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().pipe(z.email("Please enter a valid email")),
  language_ids: z.array(z.number()).min(1, "Select at least one language"),
});

type FormData = z.infer<typeof formSchema>;

export const ProfileForm = ({ profile, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      email: profile?.email || "",
      language_ids: profile?.language_ids || [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='first_name'>First Name</Label>
        <Input id='first_name' {...register("first_name")} aria-invalid={!!errors.first_name} />
        {errors.first_name && <p className='text-sm text-destructive'>{errors.first_name.message}</p>}
      </div>

      <Button type='submit' disabled={isSubmitting} className='w-full'>
        {isSubmitting ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
};
```

### Type Import Patterns

```typescript
// ✅ Good: Domain-specific imports with proper paths
import type { UserRole, AuthUser, SignInFormData } from "@/types/auth.type";
import type { Profile, ProfileDetails, ContactRequest } from "@/types/profile.type";

// ✅ Good: Service functions with proper typing
export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").select("*").eq("auth_user_id", userId).single();

  if (error) throw error;
  return data;
}

export async function fetchProfileWithDetails(userId: string): Promise<ProfileDetails> {
  const { data, error } = await supabase
    .from("profile_details") // Uses database view
    .select("*")
    .eq("auth_user_id", userId)
    .single();

  if (error) throw error;
  return data;
}
```

### Architectural Benefits

1. **Clear Boundaries**: Each domain has dedicated components and services
2. **Reusability**: UI components can be reused across features
3. **Maintainability**: Easy to locate and modify specific functionality
4. **Testability**: Clear separation enables focused testing

---

## Caching and Performance

### Performance Optimization Strategies

#### Smart Query Building

- Avoid N+1 problems with proper joins
- Use client-side processing for complex filtering when database queries become problematic
- Implement proper pagination with server-side support

#### Caching Strategy

```typescript
// Different caching strategies based on data type
const profileQuery = useQuery({
  queryKey: ["profile", userId],
  queryFn: () => fetchProfile(userId),
  staleTime: 30 * 60 * 1000, // 30 minutes - rarely changes
});

const contactRequestsQuery = useQuery({
  queryKey: ["contact-requests", userId],
  queryFn: () => fetchContactRequests(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes - more dynamic
});
```

#### Error Handling Strategy

```typescript
// Service level error handling
export async function fetchProfile(userId: string): Promise<Profile> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) throw error;
    return transformProfile(data);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw new Error("Unable to load profile. Please try again.");
  }
}

// Hook level error handling
export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
    retry: (failureCount, error) => {
      // Retry logic based on error type
      return failureCount < 3 && !error.message.includes("not found");
    },
  });
}
```

### Performance Guidelines

1. **Pagination**: Always implement server-side pagination for lists
2. **Caching**: Use appropriate stale times based on data volatility
3. **Error Recovery**: Implement retry logic with exponential backoff
4. **Optimistic Updates**: Use optimistic updates for better UX
5. **Background Sync**: Leverage TanStack Query's background refetching
6. **Async Resources**: Use dedicated hooks for expensive async operations
7. **Cache Invalidation**: Clear caches when resources are updated

#### Async Resource Management

For handling expensive async operations like signed URL generation:

```typescript
// ✅ GOOD: Dedicated hook with caching
export function useProfilePictureUrl(profilePicturePath?: string | null) {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!profilePicturePath) return;

    async function loadUrl() {
      setLoading(true);
      try {
        const signedUrl = await getProfilePictureUrlAsync(profilePicturePath);
        setUrl(signedUrl);
      } catch (error) {
        console.error("Failed to load URL:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUrl();
  }, [profilePicturePath]);

  return { url, loading };
}

// ❌ BAD: Synchronous call in render
function Component({ profilePath }) {
  const url = getProfilePictureUrl(profilePath); // Causes re-renders
  return <img src={url} />;
}
```

#### Cache Management Strategy

```typescript
// URL cache with expiry
const urlCache = new Map<string, { url: string; expires: number }>();

export function clearUrlCache(bucket?: string, path?: string): void {
  if (bucket && path) {
    const cacheKey = `${bucket}:${path}`;
    urlCache.delete(cacheKey);
  } else {
    urlCache.clear();
  }
}

// Clear cache on mutations
export function useUploadProfilePicture(profileId: string, authUserId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadProfilePicture(file, profileId, authUserId),
    onSuccess: (storagePath) => {
      // Clear URL cache for updated resource
      clearUrlCache("profile-pictures", storagePath);
      queryClient.refetchQueries({ queryKey: ["profile", authUserId] });
    },
  });
}
```

### File Organization Rules

#### No Index Files Policy

- **Avoid index.ts/index.js files**: These create confusion in large projects
- **Explicit imports**: All imports should be direct to the specific files containing the exports
- **Clear module boundaries**: Each file should be imported directly by its filename

```typescript
// ✅ Good: Direct import
import { APP_CONFIG } from "@/constants/app.constants";
import { STORAGE_BUCKETS } from "@/constants/storage.constants";

// ❌ Bad: Index file import
import { APP_CONFIG, STORAGE_BUCKETS } from "@/constants";
```

---

## Type Organization Strategy

#### Separation of Concerns

The project maintains clear separation between common reusable types, domain-specific types, and UI component types:

**Common Types** (`src/types/common.type.ts`):

- `StatusMessageType` enum (ERROR, INFO, SUCCESS, WARNING) - reusable across app
- `StatusMessage` interface for consistent message handling
- `LoadingState` enum for generic UI states (IDLE, LOADING, SUCCESS, ERROR)
- `AsyncState` enum for async operations (IDLE, PENDING, FULFILLED, REJECTED)

**Authentication Types** (`src/types/auth.type.ts`):

- `AuthTab` enum for sign-in/sign-up tab states
- `AuthErrorType` enum for auth-specific error codes
- `AuthLoadingState` enum for auth-specific loading messages
- `UserRole` enum (shared across the application)
- `AuthUser`, `AuthSession`, `AuthContextType` for authentication state
- Form types for sign-in/sign-up operations

**UI Component Types** (`src/types/ui.type.ts`):

- `LoadingAction` enum for contextual loading states
- Component variant enums (spinners, buttons, etc.)
- Size enums for consistent component sizing

**Profile Types** (`src/types/profile.type.ts`):

- Core `Profile` interface matching the normalized database schema
- `ProfileDetails` extended interface with resolved names (from database views)
- Location types: `State`, `District` with proper foreign key relationships
- Language and specialization types with normalization support
- Related entity types: `Experience`, `Education`, `CAVerification`, `SocialProfile`
- Contact request types with proper enums for status and urgency
- Form and utility types for profile operations

#### Database Schema Alignment

Types are designed to match the normalized database schema:

```typescript
// Normalized language and specialization handling
export interface Profile {
  language_ids: number[]; // References languages table
  specialization_ids: number[]; // References specializations table
  state_id?: number; // References states table
  district_id?: number; // References districts table
  // No longer using text arrays for languages/specializations
}

// Extended profile with resolved names
export interface ProfileDetails extends Profile {
  state_name?: string;
  district_name?: string;
  language_names: string[]; // Resolved from language_ids
  specialization_names: string[]; // Resolved from specialization_ids
}
```

#### Enum-Driven Type Safety

The project uses comprehensive enum patterns for maximum type safety:

```typescript
// ✅ Common reusable enums
import { StatusMessageType, StatusMessage } from "@/src/types/common.type";

const showSuccess = (text: string) => {
  setMessage({ type: StatusMessageType.SUCCESS, text });
};

// ✅ Domain-specific enums  
import { AuthTab, AuthErrorType } from "@/src/types/auth.type";

const [activeTab, setActiveTab] = useState<AuthTab>(AuthTab.SIGNIN);
const errorMessage = AUTH_ERROR_MESSAGES[AuthErrorType.ACCESS_DENIED];

// ✅ UI component enums
import { LoadingAction } from "@/src/types/ui.type";

<Loader action={LoadingAction.SAVING} title="Saving..." />
```

#### Type Safety Benefits

1. **Normalized Data**: Types enforce foreign key relationships
2. **Extensibility**: Easy to add new languages/specializations via database
3. **Performance**: Optimized queries using ID arrays instead of text matching
4. **Maintainability**: Clear separation between common, domain, and UI concerns
5. **Enum Safety**: Compile-time validation prevents magic strings and typos
6. **Autocomplete**: Full IntelliSense support for all enum values
7. **Refactoring**: Safe rename operations cascade through codebase

---

## Best Practices Summary

### Service Layer

- **Consistency**: All services follow the same architectural patterns
- **Testability**: Core functions can be unit tested independently of React
- **Performance**: Optimal caching and query strategies established
- **Maintainability**: Clear separation of concerns between services and components
- **Type Safety**: Full TypeScript integration throughout the data flow

### Architecture Benefits

- **Scalability**: Easy to add new services and features
- **Maintainability**: Clear patterns make code easy to understand and modify
- **Performance**: Optimized caching and data fetching strategies
- **Developer Experience**: Predictable patterns for implementing new functionality

This architecture ensures scalable, maintainable, and performant data management across the entire application.

---

## Related Documentation

- [Overview](./overview.md) - Project description and objectives
- [Component Standards](./component-standards.md) - Component development guidelines
