# Database Schema Documentation

## Quick Reference

| **Entity**           | **Purpose**               | **Key Features**             |
| -------------------- | ------------------------- | ---------------------------- |
| **profiles**         | Core user data            | Normalized with foreign keys |
| **languages**        | Language management       | Replaces text arrays         |
| **specializations**  | Service categories        | Hierarchical with categories |
| **states/districts** | Location management       | Normalized location data     |
| **contact_requests** | Customer-CA communication | Status tracking and notes    |

## Schema Overview

The database follows a normalized design with proper foreign key relationships, replacing text arrays with dedicated lookup tables for better performance and maintainability.

### Core Tables

#### profiles

Core user information with normalized references:

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

Normalized language management:

```sql
CREATE TABLE public.languages (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE,
  code varchar(10) UNIQUE,              -- ISO language codes
  native_name varchar(100),             -- Language in native script
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Default Languages:** English, Hindi, Gujarati, Marathi, Tamil, Telugu, Kannada, Malayalam, Bengali, Punjabi, Urdu, Odia, Assamese

#### specialization_categories

Service category hierarchy:

```sql
CREATE TABLE public.specialization_categories (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE,
  code varchar(50) NOT NULL UNIQUE,     -- Programmatic access
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Categories:** Tax Services, GST Services, Registration Services, Audit Services, Compliance Services, Accounting Services, Planning Services, Advisory Services, Other Services

#### specializations

Individual services within categories:

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

Location management:

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

CA work history:

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

CA education history:

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

Customer-CA communication:

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

CA certification verification:

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

Social media and professional links:

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

## Database Views

### profile_details

Aggregated profile view with resolved names:

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

### specializations_with_categories

Specializations with category information:

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

## Storage Buckets

### profile-pictures

- **Purpose:** User profile pictures
- **Access:** Private (users can only access their own)
- **File Size Limit:** 5MB
- **Allowed MIME Types:** image/jpeg, image/jpg, image/png
- **Naming Convention:** `{auth_user_id}/avatar.{ext}`

### ca-certificates

- **Purpose:** CA membership certificates
- **Access:** Private (users can only access their own)
- **File Size Limit:** 5MB
- **Allowed MIME Types:** application/pdf, image/jpeg, image/jpg, image/png
- **Naming Convention:** `{auth_user_id}/certificate.{ext}`

## Indexing Strategy

### Performance Indexes

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

-- Lookup table indexes
CREATE INDEX idx_languages_name ON languages(name);
CREATE INDEX idx_specializations_category_id ON specializations(category_id);
CREATE INDEX idx_districts_state_id ON districts(state_id);
```

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Public Read Access:** Languages, specializations, states, districts
- **User-Specific Access:** Profiles, experiences, educations (users can only access their own)
- **Contact Request Access:** CAs can view requests sent to them, customers can view their own requests
- **Service Role Access:** Full access for server-side operations

## Migration History

1. **001-base.sql** - Initial schema
2. **002-location-management-simple-2025-01-15.sql** - States and districts
3. **003-profile-completion-tracking-2025-01-15.sql** - Completion tracking
4. **004-profile-location-fields-2025-01-15.sql** - Foreign key location fields
5. **005-setup-certificate-storage-2025-01-15.sql** - Certificate storage
6. **006-normalize-schema-2025-01-16.sql** - Languages table and cleanup
7. **007-profile-picture-storage-2025-07-13.sql** - Profile picture storage
8. **008-specializations-normalization-2025-07-22.sql** - Specializations normalization

## TypeScript Integration

The database schema is fully integrated with TypeScript types:

```typescript
// Types match database schema exactly
interface Profile {
  id: string;
  auth_user_id: string;
  language_ids: number[]; // References languages.id[]
  specialization_ids: number[]; // References specializations.id[]
  state_id?: number; // References states.id
  district_id?: number; // References districts.id
  // ... other fields
}

// Extended type for display with resolved names
interface ProfileDetails extends Profile {
  state_name?: string;
  district_name?: string;
  language_names: string[];
  specialization_names: string[];
}
```

This schema provides a robust, normalized foundation for the CA platform with proper relationships, indexing, and type safety.
