# Database & API Patterns

## Database Architecture

### Supabase PostgreSQL Setup

The Audit-it platform uses **Supabase** as a Backend-as-a-Service with PostgreSQL, providing real-time subscriptions, Row Level Security (RLS), and edge functions for a complete backend solution.

### Schema Design Principles

#### Normalized Database Structure

- **Foreign Keys**: Replace text arrays with proper foreign key relationships
- **Lookup Tables**: Dedicated tables for languages, specializations, locations
- **Performance**: Optimized queries with proper indexing strategies
- **Scalability**: Schema designed to handle growth without major restructuring

#### Current Schema Overview

```sql
-- Core Tables
profiles                    -- User profiles with normalized references
experiences                 -- CA work history
educations                  -- CA education background
contact_requests           -- Customer-CA communication
ca_verifications          -- CA membership verification
social_profile            -- Social media links

-- Lookup Tables
languages                  -- Supported languages (normalized)
specializations           -- CA service specializations
specialization_categories -- Specialization groupings
states                    -- Indian states
districts                 -- Districts within states

-- Optimized Views
profile_details           -- Profiles with resolved names
contact_requests_with_details -- Requests with profile joins
specializations_with_categories -- Specializations with category info
```

### Migration Management

#### Sequential Migration System

- **Naming Convention**: `XXX-descriptive-name-YYYY-MM-DD.sql`
- **Idempotent Design**: Safe to run multiple times without data corruption
- **Manual Execution**: Run through Supabase SQL Editor in sequential order
- **Current Latest**: `009-contact-requests-view-2025-01-16.sql`

#### Migration History

```sql
001-base.sql                                    -- Initial schema
002-location-management-simple-2025-01-15.sql  -- States/districts normalization
003-profile-completion-tracking-2025-01-15.sql -- Completion percentage tracking
004-profile-location-fields-2025-01-15.sql     -- Foreign key location references
005-setup-certificate-storage-2025-01-15.sql   -- File storage buckets and RLS
006-normalize-schema-2025-01-16.sql            -- Languages table normalization
007-profile-picture-storage-2025-07-13.sql     -- Profile picture storage system
008-specializations-normalization-2025-07-22.sql -- Specializations and categories
009-contact-requests-view-2025-01-16.sql       -- Contact requests optimized views
```

### Row Level Security (RLS)

#### Security Policies

```sql
-- Contact Requests Security
-- CAs can view/update requests sent to them
CREATE POLICY "CAs can view their contact requests" ON contact_requests
    FOR SELECT USING (
        ca_profile_id IN (
            SELECT id FROM profiles WHERE auth_user_id = auth.uid()
        )
    );

-- Customers can view their own requests
CREATE POLICY "Customers can view their contact requests" ON contact_requests
    FOR SELECT USING (
        customer_profile_id IN (
            SELECT id FROM profiles WHERE auth_user_id = auth.uid()
        )
    );

-- Anonymous users can create contact requests
CREATE POLICY "Anonymous users can create contact requests" ON contact_requests
    FOR INSERT WITH CHECK (
        customer_profile_id IS NULL AND
        customer_name IS NOT NULL AND
        customer_email IS NOT NULL
    );
```

#### Public Access Tables

```sql
-- Read-only access for lookup data
GRANT SELECT ON languages TO anon, authenticated;
GRANT SELECT ON specializations TO anon, authenticated;
GRANT SELECT ON specialization_categories TO anon, authenticated;
GRANT SELECT ON states TO anon, authenticated;
GRANT SELECT ON districts TO anon, authenticated;
```

### Database Views for Performance

#### Profile Details View

```sql
CREATE VIEW public.profile_details AS
SELECT
  p.*,
  -- Location details
  s.name as state_name,
  d.name as district_name,
  -- Language details (aggregated)
  ARRAY(
    SELECT l.name
    FROM public.languages l
    WHERE l.id = ANY(p.language_ids)
    ORDER BY l.name
  ) as language_names,
  -- Specialization details (aggregated)
  ARRAY(
    SELECT sp.name
    FROM public.specializations sp
    WHERE sp.id = ANY(p.specialization_ids)
    ORDER BY sp.display_order
  ) as specialization_names
FROM public.profiles p
LEFT JOIN public.states s ON p.state_id = s.id
LEFT JOIN public.districts d ON p.district_id = d.id;
```

#### Contact Requests with Details View

```sql
CREATE OR REPLACE VIEW contact_requests_with_details AS
SELECT
    cr.*,
    -- CA Profile Details
    ca.first_name as ca_first_name,
    ca.last_name as ca_last_name,
    ca.profile_picture_url as ca_profile_picture,
    ca.bio as ca_bio,
    ca.username as ca_username,
    ca_state.name as ca_state_name,
    ca_district.name as ca_district_name,
    -- Customer Profile Details (if available)
    customer.first_name as customer_first_name,
    customer.last_name as customer_last_name,
    customer.profile_picture_url as customer_profile_picture,
    -- Computed fields for analytics
    CASE
        WHEN cr.replied_at IS NOT NULL THEN
            EXTRACT(EPOCH FROM (cr.replied_at - cr.created_at)) / 3600
        ELSE NULL
    END as response_time_hours,
    -- Urgency priority for sorting
    CASE cr.urgency
        WHEN 'urgent' THEN 4
        WHEN 'high' THEN 3
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 1
        ELSE 0
    END as urgency_priority
FROM contact_requests cr
LEFT JOIN profiles ca ON cr.ca_profile_id = ca.id
LEFT JOIN profiles customer ON cr.customer_profile_id = customer.id
LEFT JOIN states ca_state ON ca.state_id = ca_state.id
LEFT JOIN districts ca_district ON ca.district_id = ca_district.id;
```

### Performance Optimization

#### Composite Indexes

```sql
-- Contact request dashboard queries
CREATE INDEX IF NOT EXISTS idx_contact_requests_ca_dashboard
ON contact_requests(ca_profile_id, status, urgency, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_requests_customer_dashboard
ON contact_requests(customer_profile_id, status, created_at DESC)
WHERE customer_profile_id IS NOT NULL;

-- Profile search optimization
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_state_id ON profiles(state_id);
CREATE INDEX idx_profiles_district_id ON profiles(district_id);
CREATE INDEX idx_profiles_language_ids ON profiles USING GIN(language_ids);
CREATE INDEX idx_profiles_specialization_ids ON profiles USING GIN(specialization_ids);
```

#### Analytics Functions

```sql
-- Contact request statistics for CAs
CREATE OR REPLACE FUNCTION get_contact_request_stats(
    p_ca_profile_id uuid,
    p_start_date timestamp with time zone DEFAULT NULL,
    p_end_date timestamp with time zone DEFAULT NULL
)
RETURNS TABLE (
    total_requests bigint,
    new_requests bigint,
    replied_requests bigint,
    closed_requests bigint,
    response_rate numeric,
    avg_response_time_hours numeric
) AS $
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE status = 'new') as new_requests,
        COUNT(*) FILTER (WHERE status = 'replied') as replied_requests,
        COUNT(*) FILTER (WHERE status = 'closed') as closed_requests,
        CASE
            WHEN COUNT(*) > 0 THEN
                ROUND(
                    (COUNT(*) FILTER (WHERE status IN ('replied', 'closed'))::numeric / COUNT(*)::numeric) * 100,
                    2
                )
            ELSE 0
        END as response_rate,
        ROUND(
            AVG(
                CASE
                    WHEN replied_at IS NOT NULL THEN
                        EXTRACT(EPOCH FROM (replied_at - created_at)) / 3600
                    ELSE NULL
                END
            )::numeric,
            2
        ) as avg_response_time_hours
    FROM contact_requests
    WHERE ca_profile_id = p_ca_profile_id
        AND (p_start_date IS NULL OR created_at >= p_start_date)
        AND (p_end_date IS NULL OR created_at <= p_end_date);
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
```

## File Storage System

### Private Storage Buckets

#### Profile Pictures

```sql
-- Bucket configuration
CREATE BUCKET profile-pictures;

-- RLS Policy: Users can only access their own pictures
CREATE POLICY "Users can view own profile pictures" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload own profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### CA Certificates

```sql
-- Bucket for verification documents
CREATE BUCKET accountant-certificates;

-- RLS Policy: CAs can only access their own certificates
CREATE POLICY "CAs can manage own certificates" ON storage.objects
FOR ALL USING (
  bucket_id = 'accountant-certificates' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Signed URL Strategy

#### Implementation Pattern

```typescript
// Service layer: Generate signed URLs with caching
const urlCache = new Map<string, { url: string; expires: number }>();

export async function getSignedProfilePictureUrl(path: string): Promise<string> {
  const cacheKey = `profile-pictures:${path}`;
  const cached = urlCache.get(cacheKey);

  // Return cached URL if still valid
  if (cached && cached.expires > Date.now()) {
    return cached.url;
  }

  // Generate new signed URL
  const { data, error } = await supabase.storage.from("profile-pictures").createSignedUrl(path, 60 * 60); // 1 hour expiry

  if (error) throw error;

  // Cache the URL
  urlCache.set(cacheKey, {
    url: data.signedUrl,
    expires: Date.now() + 55 * 60 * 1000, // 55 minutes (5 min buffer)
  });

  return data.signedUrl;
}

// React hook for signed URLs
export function useProfilePictureUrl(path?: string | null) {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!path) return;

    async function loadUrl() {
      setLoading(true);
      try {
        const signedUrl = await getSignedProfilePictureUrl(path);
        setUrl(signedUrl);
      } catch (error) {
        console.error("Failed to load signed URL:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUrl();
  }, [path]);

  return { url, loading };
}
```

## Service Layer Architecture

### Pure Function Pattern

#### Service Function Structure

```typescript
// Pure async functions without React dependencies
export async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("auth_user_id", userId).single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw new Error("Unable to load profile. Please try again.");
  }
}

// TanStack Query hook for React integration
export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
```

### Error Handling Strategy

#### Comprehensive Error Management

```typescript
// Error type definitions
export enum ContactRequestErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  CA_NOT_FOUND = "CA_NOT_FOUND",
  REQUEST_NOT_FOUND = "REQUEST_NOT_FOUND",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ContactRequestError {
  type: ContactRequestErrorType;
  message: string;
  field?: string;
  code?: string;
}

// Error handling function
function handleContactRequestError(error: unknown): ContactRequestError {
  console.error("Contact request error:", error);

  if (error instanceof Error) {
    // Supabase specific errors
    if (error.message.includes("PGRST301")) {
      return {
        type: ContactRequestErrorType.PERMISSION_DENIED,
        message: "You do not have permission to perform this action",
      };
    }

    if (error.message.includes("PGRST116")) {
      return {
        type: ContactRequestErrorType.REQUEST_NOT_FOUND,
        message: "Contact request not found",
      };
    }

    if (error.message.includes("23503")) {
      return {
        type: ContactRequestErrorType.CA_NOT_FOUND,
        message: "CA profile not found",
      };
    }
  }

  return {
    type: ContactRequestErrorType.UNKNOWN_ERROR,
    message: "An unexpected error occurred. Please try again.",
  };
}
```

### Query Key Patterns

#### Consistent Cache Key Strategy

```typescript
// Profile queries
["profile", userId][("profile-details", userId)][("profile-picture-url", path)][ // Single profile // Profile with resolved names // Signed URL for profile picture
  // Contact request queries
  ("contact-requests", filters, pagination)
][("contact-requests", "ca", caProfileId, filters)][("contact-requests", "customer", customerId, filters)][ // All requests with filters // CA's requests // Customer's requests
  ("contact-request", requestId)
][ // Single request
  // Discovery queries
  ("ca-discovery", filters, pagination)
]["languages"]["specializations"]["states"][("districts", stateId)][ // CA search results // Language lookup (24h cache) // Specialization lookup (24h cache) // States lookup (24h cache) // Districts for state (24h cache)
  // Analytics queries
  ("contact-request-analytics", caProfileId, dateRange)
]; // CA performance metrics
```

### Cache Management Strategy

#### Stale Time Configuration

```typescript
// Cache duration based on data volatility
const CACHE_TIMES = {
  // Static lookup data
  STATIC_DATA: 24 * 60 * 60 * 1000, // 24 hours

  // User profiles (moderate changes)
  PROFILE_DATA: 30 * 60 * 1000, // 30 minutes

  // Contact requests (frequent updates)
  CONTACT_REQUESTS: 5 * 60 * 1000, // 5 minutes

  // Real-time data
  REAL_TIME: 0, // Always fresh

  // Analytics (can be cached longer)
  ANALYTICS: 15 * 60 * 1000, // 15 minutes

  // Signed URLs (with buffer for expiry)
  SIGNED_URLS: 55 * 60 * 1000, // 55 minutes (5 min buffer)
};

// Usage in hooks
export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
    staleTime: CACHE_TIMES.PROFILE_DATA,
  });
}
```

#### Cache Invalidation Patterns

```typescript
// Mutation with cache invalidation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => updateProfile(userId, updates),
    onSuccess: (data) => {
      // Update specific profile in cache
      queryClient.setQueryData(["profile", data.auth_user_id], data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["profile-details", data.auth_user_id] });
      queryClient.invalidateQueries({ queryKey: ["profile-picture-url"] });

      // Invalidate discovery results if profile affects search
      if (data.role === "accountant") {
        queryClient.invalidateQueries({ queryKey: ["ca-discovery"] });
      }
    },
  });
}
```

## API Integration Patterns

### Supabase Client Configuration

#### Client Setup

```typescript
// src/helpers/supabase.helper.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

### Real-time Subscriptions

#### Contact Request Updates

```typescript
// Real-time subscription for CA dashboard
export function useContactRequestSubscription(caProfileId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!caProfileId) return;

    const subscription = supabase
      .channel(`contact-requests:ca:${caProfileId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_requests",
          filter: `ca_profile_id=eq.${caProfileId}`,
        },
        (payload) => {
          // Invalidate contact request queries on changes
          queryClient.invalidateQueries({
            queryKey: ["contact-requests", "ca", caProfileId],
          });

          // Update analytics
          queryClient.invalidateQueries({
            queryKey: ["contact-request-analytics", caProfileId],
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caProfileId, queryClient]);
}
```

### Pagination Patterns

#### Consistent Pagination Interface

```typescript
// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Implementation with Supabase
export async function fetchContactRequests(
  filters: ContactRequestFilters = {},
  pagination: PaginationParams = { page: 1, limit: 20 }
): Promise<PaginatedResponse<ContactRequestDetails>> {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  let query = supabase.from("contact_requests_with_details").select("*", { count: "exact" });

  // Apply filters
  if (filters.status && filters.status.length > 0) {
    query = query.in("status", filters.status);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: (data || []) as ContactRequestDetails[],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
```

### Validation Patterns

#### Zod Schema Integration

```typescript
// Form validation schema
const contactRequestSchema = z.object({
  ca_profile_id: z.string().uuid("Invalid CA profile ID"),
  customer_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  customer_email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message must be less than 1000 characters"),
  urgency: z.nativeEnum(UrgencyLevel, {
    errorMap: () => ({ message: "Please select an urgency level" }),
  }),
  customer_phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]+$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .optional(),
});

// Service function with validation
export async function createContactRequest(requestData: CreateContactRequestData): Promise<ContactRequest> {
  // Validate input data
  const validatedData = contactRequestSchema.parse(requestData);

  try {
    const { data, error } = await supabase
      .from("contact_requests")
      .insert([
        {
          ...validatedData,
          status: ContactRequestStatus.NEW,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as ContactRequest;
  } catch (error) {
    const contactError = handleContactRequestError(error);
    throw new Error(contactError.message);
  }
}
```

## Performance Best Practices

### Query Optimization

#### Efficient Data Fetching

```typescript
// Use database views for complex joins
export async function fetchCAsForDiscovery(
  filters: CADiscoveryFilters = {},
  pagination: PaginationParams = { page: 1, limit: 20 }
): Promise<PaginatedResponse<ProfileDetails>> {
  // Use optimized view instead of complex joins
  let query = supabase
    .from("profile_details") // Pre-joined view
    .select("*", { count: "exact" })
    .eq("role", "accountant")
    .eq("is_active", true);

  // Apply filters efficiently
  if (filters.specializations && filters.specializations.length > 0) {
    query = query.overlaps("specialization_ids", filters.specializations);
  }

  // Use proper indexing for performance
  query = query.order("created_at", { ascending: false });

  return executeQuery(query, pagination);
}
```

#### Batch Operations

```typescript
// Batch insert for better performance
export async function saveBatchExperiences(experiences: Experience[]): Promise<Experience[]> {
  const { data, error } = await supabase.from("experiences").upsert(experiences, { onConflict: "id" }).select();

  if (error) throw error;
  return data as Experience[];
}
```

### Memory Management

#### Cache Size Limits

```typescript
// Implement cache size limits for signed URLs
const MAX_CACHE_SIZE = 1000;
const urlCache = new Map<string, { url: string; expires: number }>();

export function clearExpiredUrls(): void {
  const now = Date.now();
  for (const [key, value] of urlCache.entries()) {
    if (value.expires <= now) {
      urlCache.delete(key);
    }
  }

  // Limit cache size
  if (urlCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(urlCache.entries());
    const toDelete = entries.slice(0, entries.length - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => urlCache.delete(key));
  }
}
```

This comprehensive database and API pattern guide ensures consistent, performant, and maintainable data operations throughout the Audit-it platform.
