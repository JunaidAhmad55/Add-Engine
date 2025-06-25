
-- Enable Row Level Security on asset_folders table (if not already enabled)
ALTER TABLE public.asset_folders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view folders in their own org" ON public.asset_folders;
DROP POLICY IF EXISTS "Users can insert folders for their own org" ON public.asset_folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON public.asset_folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON public.asset_folders;

-- Create new policies for asset_folders
CREATE POLICY "Users can view folders in their own org"
ON public.asset_folders FOR SELECT
USING (org_id = public.get_user_team_id());

CREATE POLICY "Users can insert folders for their own org"
ON public.asset_folders FOR INSERT
WITH CHECK (org_id = public.get_user_team_id() AND user_id = auth.uid());

CREATE POLICY "Users can update their own folders"
ON public.asset_folders FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own folders"
ON public.asset_folders FOR DELETE
USING (user_id = auth.uid());
