-- Migration: Create optimized view for contact requests with profile joins
-- Date: 2025-01-16
-- Description: Creates a database view that joins contact_requests with profile details for efficient querying

-- Create optimized view for contact request queries with profile joins
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
    -- Specialization Details
    ARRAY(
        SELECT s.name
        FROM specializations s
        WHERE s.code = cr.service_needed
    ) as service_specialization_names,
    -- Additional computed fields
    CASE 
        WHEN cr.replied_at IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (cr.replied_at - cr.created_at)) / 3600
        ELSE NULL
    END as response_time_hours,
    -- Urgency priority for sorting (urgent=4, high=3, medium=2, low=1)
    CASE cr.urgency
        WHEN 'urgent' THEN 4
        WHEN 'high' THEN 3
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 1
        ELSE 0
    END as urgency_priority
FROM contact_requests cr
-- Join with CA profile
LEFT JOIN profiles ca ON cr.ca_profile_id = ca.id
-- Join with customer profile (may be NULL for anonymous requests)
LEFT JOIN profiles customer ON cr.customer_profile_id = customer.id
-- Join with location data for CA
LEFT JOIN states ca_state ON ca.state_id = ca_state.id
LEFT JOIN districts ca_district ON ca.district_id = ca_district.id;

-- Create indexes on the underlying table for better view performance
CREATE INDEX IF NOT EXISTS idx_contact_requests_ca_profile_status 
ON contact_requests(ca_profile_id, status);

CREATE INDEX IF NOT EXISTS idx_contact_requests_customer_profile_status 
ON contact_requests(customer_profile_id, status) 
WHERE customer_profile_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contact_requests_urgency_created 
ON contact_requests(urgency, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_requests_status_updated 
ON contact_requests(status, updated_at DESC);

-- Create composite index for common CA dashboard queries
CREATE INDEX IF NOT EXISTS idx_contact_requests_ca_dashboard 
ON contact_requests(ca_profile_id, status, urgency, created_at DESC);

-- Create composite index for common customer dashboard queries
CREATE INDEX IF NOT EXISTS idx_contact_requests_customer_dashboard 
ON contact_requests(customer_profile_id, status, created_at DESC) 
WHERE customer_profile_id IS NOT NULL;

-- Add Row Level Security (RLS) policies for contact requests
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Policy: CAs can view requests sent to them
CREATE POLICY "CAs can view their contact requests" ON contact_requests
    FOR SELECT USING (
        ca_profile_id IN (
            SELECT id FROM profiles WHERE auth_user_id = auth.uid()
        )
    );

-- Policy: CAs can update requests sent to them (status, notes, replied_at)
CREATE POLICY "CAs can update their contact requests" ON contact_requests
    FOR UPDATE USING (
        ca_profile_id IN (
            SELECT id FROM profiles WHERE auth_user_id = auth.uid()
        )
    );

-- Policy: Customers can view their own requests
CREATE POLICY "Customers can view their contact requests" ON contact_requests
    FOR SELECT USING (
        customer_profile_id IN (
            SELECT id FROM profiles WHERE auth_user_id = auth.uid()
        )
    );

-- Policy: Authenticated users can create contact requests
CREATE POLICY "Authenticated users can create contact requests" ON contact_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Anonymous users can create contact requests (for anonymous inquiries)
CREATE POLICY "Anonymous users can create contact requests" ON contact_requests
    FOR INSERT WITH CHECK (
        customer_profile_id IS NULL AND 
        customer_name IS NOT NULL AND 
        customer_email IS NOT NULL
    );

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_requests_updated_at
    BEFORE UPDATE ON contact_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_requests_updated_at();

-- Add function to get contact request statistics for analytics
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON contact_requests_with_details TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_contact_request_stats(uuid, timestamp with time zone, timestamp with time zone) TO authenticated;

-- Add comments for documentation
COMMENT ON VIEW contact_requests_with_details IS 'Optimized view for contact requests with resolved profile relationships and computed fields';
COMMENT ON FUNCTION get_contact_request_stats IS 'Function to calculate contact request analytics for CAs';
COMMENT ON INDEX idx_contact_requests_ca_dashboard IS 'Composite index optimized for CA dashboard queries';
COMMENT ON INDEX idx_contact_requests_customer_dashboard IS 'Composite index optimized for customer dashboard queries';