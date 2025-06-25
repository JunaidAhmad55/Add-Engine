
-- Create ENUM types for status fields to ensure data consistency

CREATE TYPE public.asset_file_type AS ENUM (
  'image',
  'video',
  'pdf',
  'file' -- Added a generic file type
);

CREATE TYPE public.campaign_status AS ENUM (
  'draft',
  'launching',
  'active',
  'paused',
  'completed'
);

CREATE TYPE public.ad_variant_status AS ENUM (
  'pending',
  'active',
  'rejected'
);

-- Create the 'assets' table
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_type public.asset_file_type NOT NULL,
  url TEXT NOT NULL, -- This could be a Supabase Storage URL or external URL
  tags TEXT[] DEFAULT '{}',
  folder_id UUID, -- Optional, if you implement folder structures
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL, -- Should correspond to team_id in profiles
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  size_bytes BIGINT,
  CONSTRAINT assets_org_id_fk FOREIGN KEY (org_id) REFERENCES public.teams(id) ON DELETE CASCADE -- Assuming org_id is team_id
);

-- RLS for 'assets' table
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage assets in their own organization"
  ON public.assets
  FOR ALL
  USING (org_id = public.get_user_team_id() AND user_id = auth.uid()) -- Check both org and user for direct ownership
  WITH CHECK (org_id = public.get_user_team_id() AND user_id = auth.uid());

-- Create the 'campaigns' table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  objective TEXT,
  audience TEXT, -- Added audience field
  status public.campaign_status NOT NULL DEFAULT 'draft',
  budget NUMERIC,
  meta_campaign_id TEXT, -- For integration with Meta platform
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, -- Renamed createdBy to user_id
  org_id UUID NOT NULL, -- Should correspond to team_id in profiles
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  launched_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT campaigns_org_id_fk FOREIGN KEY (org_id) REFERENCES public.teams(id) ON DELETE CASCADE -- Assuming org_id is team_id
);

-- RLS for 'campaigns' table
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage campaigns in their own organization"
  ON public.campaigns
  FOR ALL
  USING (org_id = public.get_user_team_id() AND user_id = auth.uid())
  WITH CHECK (org_id = public.get_user_team_id() AND user_id = auth.uid());

-- Create the 'ad_variants' table
CREATE TABLE public.ad_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  headline TEXT,
  primary_text TEXT,
  call_to_action TEXT,
  meta_ad_id TEXT, -- For integration with Meta platform
  status public.ad_variant_status NOT NULL DEFAULT 'pending',
  org_id UUID NOT NULL, -- Denormalized for easier RLS or direct queries, ensure it matches campaign's org_id
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ad_variants_org_id_fk FOREIGN KEY (org_id) REFERENCES public.teams(id) ON DELETE CASCADE -- Assuming org_id is team_id
);

-- RLS for 'ad_variants' table
ALTER TABLE public.ad_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage ad_variants for campaigns in their own organization"
  ON public.ad_variants
  FOR ALL
  USING (
    org_id = public.get_user_team_id() AND
    EXISTS (
      SELECT 1
      FROM public.campaigns c
      WHERE c.id = ad_variants.campaign_id AND c.org_id = public.get_user_team_id() AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    org_id = public.get_user_team_id() AND
    EXISTS (
      SELECT 1
      FROM public.campaigns c
      WHERE c.id = ad_variants.campaign_id AND c.org_id = public.get_user_team_id() AND c.user_id = auth.uid()
    )
  );

-- Trigger to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_campaign_update
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER handle_ad_variant_update
  BEFORE UPDATE ON public.ad_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

