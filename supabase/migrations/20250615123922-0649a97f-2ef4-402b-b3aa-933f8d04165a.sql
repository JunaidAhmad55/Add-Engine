
-- Create the new ad_sets table to store ad set information
CREATE TABLE public.ad_sets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    budget NUMERIC,
    audience TEXT,
    org_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add a trigger to automatically update the 'updated_at' timestamp
CREATE TRIGGER handle_ad_sets_updated_at
BEFORE UPDATE ON public.ad_sets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row-Level Security for the new ad_sets table
ALTER TABLE public.ad_sets ENABLE ROW LEVEL SECURITY;

-- Create a policy to ensure users can only access ad sets within their organization
CREATE POLICY "Organizations can manage their own ad sets"
ON public.ad_sets
FOR ALL
USING (org_id = public.get_user_team_id())
WITH CHECK (org_id = public.get_user_team_id());

-- Modify the existing ad_variants table to link to ad_sets instead of campaigns

-- Step 1: Drop the campaign_id column. Using CASCADE will also drop the dependent RLS policy that caused the error.
ALTER TABLE public.ad_variants DROP COLUMN IF EXISTS campaign_id CASCADE;

-- Step 2: Add the new ad_set_id column. It will link to the ad_sets table.
ALTER TABLE public.ad_variants ADD COLUMN ad_set_id UUID;

-- Step 3: Add the new foreign key constraint to link ad_variants to ad_sets.
ALTER TABLE public.ad_variants 
ADD CONSTRAINT ad_variants_ad_set_id_fkey 
FOREIGN KEY (ad_set_id) REFERENCES public.ad_sets(id) ON DELETE CASCADE;

-- Step 4: Create a new RLS policy for ad_variants that checks ownership through the ad_sets table.
CREATE POLICY "Users can manage ad_variants for ad_sets in their own org"
ON public.ad_variants
FOR ALL
USING (
  org_id = public.get_user_team_id() AND
  EXISTS (
    SELECT 1 FROM public.ad_sets
    WHERE public.ad_sets.id = ad_variants.ad_set_id AND public.ad_sets.org_id = public.get_user_team_id()
  )
)
WITH CHECK (
  org_id = public.get_user_team_id() AND
  EXISTS (
    SELECT 1 FROM public.ad_sets
    WHERE public.ad_sets.id = ad_variants.ad_set_id AND public.ad_sets.org_id = public.get_user_team_id()
  )
);
