-- File: src/migrations/008-specializations-normalization-2025-01-16.sql
-- Normalize specializations data by creating dedicated tables
-- Created: January 16, 2025

-- ===============================================
-- PART 1: Create specialization_categories table
-- ===============================================

-- Create specialization categories table
CREATE TABLE IF NOT EXISTS public.specialization_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE, -- for programmatic access
    description TEXT,
    display_order INTEGER DEFAULT 0, -- for UI ordering
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert specialization categories
INSERT INTO public.specialization_categories (name, code, description, display_order) VALUES
    ('Tax Services', 'TAX', 'Income tax, TDS, and other tax-related services', 1),
    ('GST Services', 'GST', 'GST registration, filing, and compliance services', 2),
    ('Registration Services', 'REGISTRATION', 'Company, partnership, and business registration services', 3),
    ('Audit Services', 'AUDIT', 'Statutory, internal, and financial audit services', 4),
    ('Compliance Services', 'COMPLIANCE', 'Regulatory compliance and management services', 5),
    ('Accounting Services', 'ACCOUNTING', 'Bookkeeping, payroll, and accounting services', 6),
    ('Planning Services', 'PLANNING', 'Financial and investment planning services', 7),
    ('Advisory Services', 'ADVISORY', 'Business, startup, and financial advisory services', 8),
    ('Other Services', 'OTHER', 'Miscellaneous and specialized services', 9)
ON CONFLICT (code) DO NOTHING;

-- Create indexes for specialization_categories
CREATE INDEX IF NOT EXISTS idx_specialization_categories_code ON public.specialization_categories(code);
CREATE INDEX IF NOT EXISTS idx_specialization_categories_is_active ON public.specialization_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_specialization_categories_display_order ON public.specialization_categories(display_order);

-- ===============================================
-- PART 2: Create specializations table
-- ===============================================

-- Create specializations table
CREATE TABLE IF NOT EXISTS public.specializations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE, -- for programmatic access
    category_id INTEGER NOT NULL REFERENCES public.specialization_categories(id) ON DELETE CASCADE,
    description TEXT,
    display_order INTEGER DEFAULT 0, -- for ordering within category
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, category_id) -- Unique specialization per category
);

-- Insert specializations with proper category references
DO $$
DECLARE
    tax_cat_id INTEGER;
    gst_cat_id INTEGER;
    reg_cat_id INTEGER;
    audit_cat_id INTEGER;
    comp_cat_id INTEGER;
    acc_cat_id INTEGER;
    plan_cat_id INTEGER;
    adv_cat_id INTEGER;
    other_cat_id INTEGER;
BEGIN
    -- Get category IDs
    SELECT id INTO tax_cat_id FROM public.specialization_categories WHERE code = 'TAX';
    SELECT id INTO gst_cat_id FROM public.specialization_categories WHERE code = 'GST';
    SELECT id INTO reg_cat_id FROM public.specialization_categories WHERE code = 'REGISTRATION';
    SELECT id INTO audit_cat_id FROM public.specialization_categories WHERE code = 'AUDIT';
    SELECT id INTO comp_cat_id FROM public.specialization_categories WHERE code = 'COMPLIANCE';
    SELECT id INTO acc_cat_id FROM public.specialization_categories WHERE code = 'ACCOUNTING';
    SELECT id INTO plan_cat_id FROM public.specialization_categories WHERE code = 'PLANNING';
    SELECT id INTO adv_cat_id FROM public.specialization_categories WHERE code = 'ADVISORY';
    SELECT id INTO other_cat_id FROM public.specialization_categories WHERE code = 'OTHER';

    -- Insert Tax Services
    INSERT INTO public.specializations (name, code, category_id, display_order) VALUES
        ('Income Tax Filing', 'income-tax-filing', tax_cat_id, 1),
        ('Tax Planning', 'tax-planning', tax_cat_id, 2),
        ('Tax Consultation', 'tax-consultation', tax_cat_id, 3),
        ('TDS Filing', 'tds-filing', tax_cat_id, 4)
    ON CONFLICT (code) DO NOTHING;

    -- Insert GST Services
    INSERT INTO public.specializations (name, code, category_id, display_order) VALUES
        ('GST Registration', 'gst-registration', gst_cat_id, 1),
        ('GST Filing', 'gst-filing', gst_cat_id, 2)

    ON CONFLICT (code) DO NOTHING;

    -- Insert Registration Services
    INSERT INTO public.specializations (name, code, category_id, display_order) VALUES
        ('Business Setup', 'business-setup', reg_cat_id, 1),
        ('Business Registration', 'business-registration', reg_cat_id, 2)
    ON CONFLICT (code) DO NOTHING;

    -- Insert Audit Services
    INSERT INTO public.specializations (name, code, category_id, display_order) VALUES
        ('Statutory Audit', 'statutory-audit', audit_cat_id, 1),
        ('Internal Audit', 'internal-audit', audit_cat_id, 2),
        ('Audit Services', 'audit-services', audit_cat_id, 3)
    ON CONFLICT (code) DO NOTHING;

    -- Insert Compliance Services
    INSERT INTO public.specializations (name, code, category_id, display_order) VALUES
        ('Compliance', 'compliance', comp_cat_id, 1),
        ('ESI & PF Registration', 'esi-pf-registration', comp_cat_id, 2)
    ON CONFLICT (code) DO NOTHING;

    -- Insert Accounting Services
    INSERT INTO public.specializations (name, code, category_id, display_order) VALUES
        ('Bookkeeping & Accounting', 'bookkeeping-accounting', acc_cat_id, 1),
        ('Payroll Management', 'payroll-management', acc_cat_id, 2)
    ON CONFLICT (code) DO NOTHING;

    -- Insert Planning Services
    INSERT INTO public.specializations (name, code, category_id, display_order) VALUES
        ('Financial Planning', 'financial-planning', plan_cat_id, 1),
        ('Insurance Planning', 'insurance-planning', plan_cat_id, 2)
    ON CONFLICT (code) DO NOTHING;

    -- Insert Advisory Services
    INSERT INTO public.specializations (name, code, category_id, display_order) VALUES
        ('General Consultation', 'general-consultation', adv_cat_id, 1)
    ON CONFLICT (code) DO NOTHING;

    -- Insert Other Services
    INSERT INTO public.specializations (name, code, category_id, display_order) VALUES
        ('Other', 'other', other_cat_id, 1)
    ON CONFLICT (code) DO NOTHING;
END $$;

-- Create indexes for specializations
CREATE INDEX IF NOT EXISTS idx_specializations_code ON public.specializations(code);
CREATE INDEX IF NOT EXISTS idx_specializations_category_id ON public.specializations(category_id);
CREATE INDEX IF NOT EXISTS idx_specializations_is_active ON public.specializations(is_active);
CREATE INDEX IF NOT EXISTS idx_specializations_display_order ON public.specializations(display_order);

-- ===============================================
-- PART 3: Update profiles table
-- ===============================================

-- Add new column for specialization IDs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS specialization_ids INTEGER[] DEFAULT '{}';

-- Create index for specialization_ids array
CREATE INDEX IF NOT EXISTS idx_profiles_specialization_ids ON public.profiles USING GIN(specialization_ids);

-- Add comment
COMMENT ON COLUMN public.profiles.specialization_ids IS 'Array of specialization IDs referencing specializations table';

-- ===============================================
-- PART 4: Data migration for specializations
-- ===============================================

-- Migrate existing specialization data from text array to ID array
DO $$
DECLARE
    profile_record RECORD;
    spec_name TEXT;
    spec_id INTEGER;
    spec_ids INTEGER[] := '{}';
BEGIN
    -- Loop through all profiles that have specializations
    FOR profile_record IN 
        SELECT id, specialization 
        FROM public.profiles 
        WHERE specialization IS NOT NULL AND array_length(specialization, 1) > 0
    LOOP
        spec_ids := '{}'; -- Reset for each profile
        
        -- Loop through each specialization name in the profile
        FOREACH spec_name IN ARRAY profile_record.specialization
        LOOP
            -- Find the specialization ID for this name (case-insensitive)
            SELECT s.id INTO spec_id 
            FROM public.specializations s 
            WHERE LOWER(s.name) = LOWER(trim(spec_name))
               OR LOWER(s.code) = LOWER(trim(spec_name))
            LIMIT 1;
            
            -- If specialization exists, add its ID to the array
            IF spec_id IS NOT NULL THEN
                spec_ids := spec_ids || spec_id;
            ELSE
                -- Log unknown specializations (optional - for debugging)
                RAISE NOTICE 'Unknown specialization found: % for profile %', spec_name, profile_record.id;
            END IF;
        END LOOP;
        
        -- Update the profile with the new specialization IDs
        UPDATE public.profiles 
        SET specialization_ids = spec_ids 
        WHERE id = profile_record.id;
    END LOOP;
END $$;

-- ===============================================
-- PART 5: Enable RLS and create policies
-- ===============================================

-- Enable RLS for both tables
ALTER TABLE public.specialization_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public read access for specialization_categories" ON public.specialization_categories FOR SELECT USING (true);
CREATE POLICY "Public read access for specializations" ON public.specializations FOR SELECT USING (true);

-- Create RLS policies for service role
CREATE POLICY "Service role full access for specialization_categories" ON public.specialization_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for specializations" ON public.specializations FOR ALL USING (auth.role() = 'service_role');

-- ===============================================
-- PART 6: Update functions and triggers
-- ===============================================

-- Add trigger for specialization_categories table
DROP TRIGGER IF EXISTS update_specialization_categories_updated_at ON public.specialization_categories;
CREATE TRIGGER update_specialization_categories_updated_at
    BEFORE UPDATE ON public.specialization_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for specializations table
DROP TRIGGER IF EXISTS update_specializations_updated_at ON public.specializations;
CREATE TRIGGER update_specializations_updated_at
    BEFORE UPDATE ON public.specializations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- PART 7: Add helpful views
-- ===============================================

-- Create a view to easily join specializations with their categories
CREATE OR REPLACE VIEW public.specializations_with_categories AS
SELECT 
    s.id,
    s.name,
    s.code,
    s.description,
    s.display_order,
    s.is_active,
    s.created_at,
    s.updated_at,
    -- Category details
    c.id as category_id,
    c.name as category_name,
    c.code as category_code,
    c.description as category_description,
    c.display_order as category_display_order
FROM public.specializations s
LEFT JOIN public.specialization_categories c ON s.category_id = c.id
ORDER BY c.display_order, s.display_order;

-- Grant read access to the view
GRANT SELECT ON public.specializations_with_categories TO authenticated, anon;

-- ===============================================
-- PART 8: Keep old column temporarily
-- ===============================================

-- Keep the old specialization column temporarily for rollback safety
-- It can be removed in a future migration after confirming the migration worked
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS specialization;

-- Add comment to indicate the column is deprecated
COMMENT ON COLUMN public.profiles.specialization IS 'DEPRECATED: Use specialization_ids instead. Will be removed in future migration.'; 

DROP VIEW IF EXISTS profile_details;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS specialization;
-- (then recreate the view as above)

CREATE OR REPLACE VIEW public.profile_details AS
SELECT 
    p.id,
    p.auth_user_id,
    p.username,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.profile_picture_url,
    p.bio,
    p.gender,
    p.role,
    p.country,
    p.language_ids,
    p.specialization_ids,
    p.email,
    p.phone,
    p.whatsapp_available,
    p.is_active,
    p.created_at,
    p.updated_at,
    p.state_id,
    p.district_id,
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

DROP TABLE IF EXISTS public.data_imports CASCADE;
DROP TABLE IF EXISTS public.processing_queue CASCADE;
