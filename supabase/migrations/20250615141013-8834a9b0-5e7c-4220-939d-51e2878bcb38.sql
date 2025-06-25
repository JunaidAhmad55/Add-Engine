
-- Add a column to store the avatar URL in the user profiles table
ALTER TABLE public.profiles
ADD COLUMN avatar_url TEXT;

-- Create a public storage bucket for avatars with a 5MB file size limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif']);

-- Add a policy to allow public read access to all files in the avatars bucket
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Add a policy to allow authenticated users to upload their own avatar
-- This policy ensures users can only upload to a folder matching their user ID
CREATE POLICY "Authenticated user can upload avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Add a policy to allow authenticated users to update their own avatar
CREATE POLICY "Authenticated user can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Add a policy to allow authenticated users to delete their own avatar
CREATE POLICY "Authenticated user can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );
