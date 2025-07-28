-- Setup Accountant Certificate Storage Bucket
-- Run this in your Supabase SQL Editor

-- Create the accountant-certificates bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'accountant-certificates',
  'accountant-certificates', 
  false, -- private bucket
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for accountant-certificates bucket
-- Allow authenticated users to upload their own certificates
CREATE POLICY "Users can upload their own certificates" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'accountant-certificates' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to view their own certificates
CREATE POLICY "Users can view their own certificates" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'accountant-certificates' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own certificates
CREATE POLICY "Users can update their own certificates" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'accountant-certificates' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own certificates
CREATE POLICY "Users can delete their own certificates" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'accountant-certificates' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  ); 