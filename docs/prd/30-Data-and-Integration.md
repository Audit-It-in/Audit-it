# Data, Database, and Integration

## Quick Summary

- Supabase client with auth auto-refresh and persisted session
- Signed URL strategy with in-memory TTL cache and targeted invalidation
- Standard query keys, stale times, and pagination contract
- Normalized database schema with views, indexes, and RLS notes

---

## Supabase Client Configuration

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
});
```

---

## Storage: Signed URL Strategy

```typescript
// src/services/upload.service.ts (excerpt)
type UrlCacheValue = { url: string; expires: number };
const urlCache = new Map<string, UrlCacheValue>();

export async function getSignedUrl(bucket: string, path: string, expiresInSeconds = 15 * 60): Promise<string> {
  const now = Date.now();
  const key = `${bucket}:${path}`;
  const cached = urlCache.get(key);
  if (cached && cached.expires > now + 5_000) return cached.url;

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) throw new Error("Failed to generate signed URL");
  const value = { url: data.signedUrl, expires: now + expiresInSeconds * 1000 };
  urlCache.set(key, value);
  return value.url;
}

export function clearUrlCache(bucket?: string, path?: string): void {
  if (bucket && path) urlCache.delete(`${bucket}:${path}`);
  else urlCache.clear();
}
```

```typescript
// React Query hook (avatar URLs)
export function useProfilePictureUrl(path?: string | null) {
  return useQuery<string>({
    queryKey: ["profile-picture-url", path],
    queryFn: () => getSignedProfilePictureUrl(path!),
    enabled: !!path,
    staleTime: 15 * 60 * 1000,
  });
}
```

---

## Query Keys and Cache Times

- Profiles: `["profile", userId]` — stale 30m
- Contact requests (all): `["contact-requests", filters, pagination]` — stale 5m
- CA dashboard: `["contact-requests", "ca", caProfileId, filters, pagination]` — stale 2m
- Customer requests: `["contact-requests", "customer", customerProfileId, filters, pagination]` — stale 5m
- Single request: `["contact-request", requestId]` — stale 2m
- Discovery: `["ca-discovery", filters, pagination]` — stale 10m
- Analytics: `["contact-request-analytics", caProfileId, dateRange]` — stale 15m
- Signed URLs: `["profile-picture-url", path]` — stale 15m

### Real-time Invalidation Pattern

Use a Postgres changes channel to invalidate relevant queries when `contact_requests` changes (CA dashboard and analytics). Invalidate:

- `["contact-requests", "ca", caProfileId]`
- `["contact-request-analytics", caProfileId]`

### Cache Invalidation on Mutations

On create/update contact requests, invalidate:

- `["contact-requests"]`
- `["contact-requests", "ca", caProfileId]`
- `["contact-requests", "customer", customerProfileId]` (when present)
- `["contact-request-analytics", caProfileId]`

---

## Pagination Contract

```typescript
export interface PaginationParams {
  page: number;
  limit: number;
}
export interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
}

// Supabase pattern
const offset = (page - 1) * limit;
const { data, count } = await supabase
  .from("contact_requests_with_details")
  .select("*", { count: "exact" })
  .range(offset, offset + limit - 1);
```

---

## Validation and Errors

### Zod vs Service-Level Validation

- Runtime form validation uses Zod.
- Service functions perform defensive checks and sanitize inputs before insert/update.

### Error Handling Contract (Normalization)

Normalize Supabase and network errors to domain errors. Example mapping:

```typescript
if (error.message.includes("PGRST301")) // permission denied
if (error.message.includes("PGRST116")) // not found
if (error.message.includes("23503"))    // FK violation
```

Return user-friendly messages; never surface raw DB errors to UI.

### Rate Limiting (Client-Side Guard)

- Basic in-memory throttle for anonymous creates. For production, enforce server-side limits (edge functions).

---

## Database Schema (Normalized)

### Core Tables

#### profiles

```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  username text UNIQUE,
  first_name text,
  middle_name text,
  last_name text,
  profile_picture_url text,
  bio text,
  gender text,
  role text NOT NULL,                    -- 'accountant', 'customer', 'admin'
  country text DEFAULT 'India',

  -- Normalized location references
  state_id integer REFERENCES states(id),
  district_id integer REFERENCES districts(id),

  -- Normalized arrays of IDs
  language_ids integer[] DEFAULT '{}',
  specialization_ids integer[] DEFAULT '{}',

  -- Contact information
  email text UNIQUE,
  phone text UNIQUE,
  whatsapp_available boolean DEFAULT false,

  -- Status and completion tracking
  is_active boolean DEFAULT true,
  profile_completion_percentage integer DEFAULT 0,
  last_completed_section text,
  completion_updated_at timestamp with time zone DEFAULT now(),

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### Lookup Tables

#### languages

```sql
CREATE TABLE public.languages (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE,
  code varchar(10) UNIQUE,
  native_name varchar(100),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

Default languages include: English, Hindi, Gujarati, Marathi, Tamil, Telugu, Kannada, Malayalam, Bengali, Punjabi, Urdu, Odia, Assamese.

#### specialization_categories

```sql
CREATE TABLE public.specialization_categories (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE,
  code varchar(50) NOT NULL UNIQUE,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### specializations

```sql
CREATE TABLE public.specializations (
  id serial PRIMARY KEY,
  name varchar(200) NOT NULL,
  code varchar(100) NOT NULL UNIQUE,
  category_id integer NOT NULL REFERENCES specialization_categories(id),
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(name, category_id)
);
```

#### states / districts

```sql
CREATE TABLE states (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE,
  code varchar(10) NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE districts (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL,
  state_id integer NOT NULL REFERENCES states(id),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(name, state_id)
);
```

### Related Tables

#### experiences

```sql
CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id),
  title text,
  company_name text,
  location text,
  is_current boolean DEFAULT false,
  start_date date,
  end_date date,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### educations

```sql
CREATE TABLE public.educations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id),
  institute_name text NOT NULL,
  degree text,
  field_of_study text,
  start_date date,
  end_date date,
  grade text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### contact_requests

```sql
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ca_profile_id uuid NOT NULL REFERENCES profiles(id),
  customer_profile_id uuid REFERENCES profiles(id),

  -- Customer information
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,

  -- Request details
  subject text NOT NULL,
  message text NOT NULL,
  service_needed text,
  urgency text NOT NULL,                -- 'low', 'medium', 'high', 'urgent'

  -- Location (optional)
  location_city text,
  location_state text,

  -- Status tracking
  status text NOT NULL DEFAULT 'new',  -- 'new', 'in_progress', 'replied', 'closed'
  ca_private_notes text[],
  replied_at timestamp with time zone,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### ca_verifications

```sql
CREATE TABLE public.ca_verifications (
  profile_id uuid PRIMARY KEY REFERENCES profiles(id),
  membership_number text,
  membership_certificate_url text,
  verified_at timestamp with time zone,
  verified_by uuid
);
```

#### social_profile

```sql
CREATE TABLE public.social_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id),
  linkedin_profile text,
  professional_website text,
  instagram_profile text,
  facebook_profile text,
  twitter_profile text,
  youtube_profile text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

---

## Database Views

### profile_details

```sql
CREATE VIEW public.profile_details AS
SELECT
  p.*,
  s.name as state_name,
  d.name as district_name,
  ARRAY(
    SELECT l.name FROM public.languages l
    WHERE l.id = ANY(p.language_ids)
    ORDER BY l.name
  ) as language_names,
  ARRAY(
    SELECT sp.name FROM public.specializations sp
    WHERE sp.id = ANY(p.specialization_ids)
    ORDER BY sp.display_order
  ) as specialization_names
FROM public.profiles p
LEFT JOIN public.states s ON p.state_id = s.id
LEFT JOIN public.districts d ON p.district_id = d.id;
```

### specializations_with_categories

```sql
CREATE VIEW public.specializations_with_categories AS
SELECT
  s.*,
  c.id as category_id,
  c.name as category_name,
  c.code as category_code,
  c.description as category_description,
  c.display_order as category_display_order
FROM public.specializations s
LEFT JOIN public.specialization_categories c ON s.category_id = c.id
ORDER BY c.display_order, s.display_order;
```

### contact_requests_with_details

```sql
CREATE OR REPLACE VIEW contact_requests_with_details AS
SELECT
    cr.*,
    ca.first_name as ca_first_name,
    ca.last_name as ca_last_name,
    ca.profile_picture_url as ca_profile_picture,
    ca.bio as ca_bio,
    ca.username as ca_username,
    ca_state.name as ca_state_name,
    ca_district.name as ca_district_name,
    customer.first_name as customer_first_name,
    customer.last_name as customer_last_name,
    customer.profile_picture_url as customer_profile_picture,
    ARRAY(
        SELECT s.name FROM specializations s
        WHERE s.code = cr.service_needed
    ) as service_specialization_names,
    CASE WHEN cr.replied_at IS NOT NULL THEN EXTRACT(EPOCH FROM (cr.replied_at - cr.created_at)) / 3600 END as response_time_hours,
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

---

## Database Functions

### get_contact_request_stats

```sql
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
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE status = 'new') as new_requests,
        COUNT(*) FILTER (WHERE status = 'replied') as replied_requests,
        COUNT(*) FILTER (WHERE status = 'closed') as closed_requests,
        CASE WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE status IN ('replied', 'closed'))::numeric / COUNT(*)::numeric) * 100, 2) ELSE 0 END as response_rate,
        ROUND(AVG(CASE WHEN replied_at IS NOT NULL THEN EXTRACT(EPOCH FROM (replied_at - created_at)) / 3600 END)::numeric, 2) as avg_response_time_hours
    FROM contact_requests
    WHERE ca_profile_id = p_ca_profile_id
        AND (p_start_date IS NULL OR created_at >= p_start_date)
        AND (p_end_date IS NULL OR created_at <= p_end_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Storage Buckets

### profile-pictures

- Purpose: User profile pictures
- Access: Private (per-user)
- File Size Limit: 5MB
- Allowed MIME Types: image/jpeg, image/jpg, image/png, image/webp
- Naming: `{auth_user_id}/avatar.{ext}`

### accountant-certificates

- Purpose: CA membership certificates
- Access: Private (per-user)
- File Size Limit: 5MB
- Allowed MIME Types: application/pdf, image/jpeg, image/jpg, image/png
- Naming: `{auth_user_id}/certificate.{ext}`

---

## Indexing Strategy

```sql
-- Profile table indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX idx_profiles_state_id ON profiles(state_id);
CREATE INDEX idx_profiles_district_id ON profiles(district_id);
CREATE INDEX idx_profiles_language_ids ON profiles USING GIN(language_ids);
CREATE INDEX idx_profiles_specialization_ids ON profiles USING GIN(specialization_ids);
CREATE INDEX idx_profiles_completion_percentage ON profiles(profile_completion_percentage);

-- Contact request indexes
CREATE INDEX idx_contact_requests_ca_profile_id ON contact_requests(ca_profile_id);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at);

-- Optimized contact request indexes
CREATE INDEX IF NOT EXISTS idx_contact_requests_ca_profile_status ON contact_requests(ca_profile_id, status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_customer_profile_status ON contact_requests(customer_profile_id, status) WHERE customer_profile_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contact_requests_urgency_created ON contact_requests(urgency, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status_updated ON contact_requests(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_ca_dashboard ON contact_requests(ca_profile_id, status, urgency, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_customer_dashboard ON contact_requests(customer_profile_id, status, created_at DESC) WHERE customer_profile_id IS NOT NULL;

-- Lookup table indexes
CREATE INDEX idx_languages_name ON languages(name);
CREATE INDEX idx_specializations_category_id ON specializations(category_id);
CREATE INDEX idx_districts_state_id ON districts(state_id);
```

---

## Row Level Security (RLS)

- Public read (enabled): `languages`, `specialization_categories`, `specializations`, `states`, `districts`
- Contact requests (enabled): `contact_requests`
  - CAs can view/update requests sent to them; customers can view their own; both authenticated and anonymous inserts allowed (with constraints)
- Profiles/related (planned/controlled via service layer): `profiles`, `experiences`, `educations`

---

## Migration History

1. 001-base.sql — Initial schema
2. 002-location-management-simple-2025-01-15.sql — States and districts
3. 003-profile-completion-tracking-2025-01-15.sql — Completion tracking
4. 004-profile-location-fields-2025-01-15.sql — Foreign key location fields
5. 005-setup-certificate-storage-2025-01-15.sql — Certificate storage
6. 006-normalize-schema-2025-01-16.sql — Languages table and cleanup
7. 007-profile-picture-storage-2025-07-13.sql — Profile picture storage
8. 008-specializations-normalization-2025-07-22.sql — Specializations normalization
9. 009-contact-requests-view-2025-01-16.sql — Optimized view, indexes, RLS, analytics function

---

## TypeScript Integration

```typescript
// Types match database schema exactly
interface Profile {
  id: string;
  auth_user_id: string;
  language_ids: number[];
  specialization_ids: number[];
  state_id?: number;
  district_id?: number;
}

// Extended type for display with resolved names
interface ProfileDetails extends Profile {
  state_name?: string;
  district_name?: string;
  language_names: string[];
  specialization_names: string[];
}
```

---

## Related Documentation

- [10-Product](./10-Product.md)
- [20-Architecture](./20-Architecture.md)
- [40-Design-System](./40-Design-System.md)
