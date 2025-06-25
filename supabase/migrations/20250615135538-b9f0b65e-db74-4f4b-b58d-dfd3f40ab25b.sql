
-- Create the table for asset folders
CREATE TABLE public.asset_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    org_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add a comment to describe the table
COMMENT ON TABLE public.asset_folders IS 'Stores user-created folders for organizing assets.';

-- Enable Row Level Security
ALTER TABLE public.asset_folders ENABLE ROW LEVEL SECURITY;

-- Policies for asset_folders
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

-- Trigger to automatically update the 'updated_at' timestamp on changes
CREATE TRIGGER handle_asset_folders_updated_at
BEFORE UPDATE ON public.asset_folders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add a foreign key from the existing assets table to the new folders table
ALTER TABLE public.assets
ADD CONSTRAINT fk_asset_folder
FOREIGN KEY (folder_id) REFERENCES public.asset_folders(id) ON DELETE SET NULL;
