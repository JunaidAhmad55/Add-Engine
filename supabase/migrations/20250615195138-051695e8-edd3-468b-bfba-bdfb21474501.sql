
-- Create a table to store third-party account integrations and tokens
CREATE TABLE public.account_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL,
  platform TEXT NOT NULL, -- e.g. 'google_drive', 'meta_ads', 'tiktok_ads'
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_in INTEGER,
  token_type TEXT,
  account_label TEXT, -- e.g. user email, account name, or provider ID
  provider_account_id TEXT, -- ID from the OAuth provider
  extra_data JSONB, -- For any provider-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Only allow access to integrations for teams the user belongs to.
ALTER TABLE public.account_integrations ENABLE ROW LEVEL SECURITY;

-- Allow team members to SELECT their team's integrations
CREATE POLICY "Team members can view their team integrations"
  ON public.account_integrations
  FOR SELECT
  USING (
    team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid())
  );

-- Allow team members to INSERT integrations for their own team
CREATE POLICY "Team members can add their team integrations"
  ON public.account_integrations
  FOR INSERT
  WITH CHECK (
    team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid())
  );

-- Allow team members to UPDATE their team integrations
CREATE POLICY "Team members can update their team integrations"
  ON public.account_integrations
  FOR UPDATE
  USING (
    team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid())
  );

-- Allow team members to DELETE their team integrations
CREATE POLICY "Team members can delete their team integrations"
  ON public.account_integrations
  FOR DELETE
  USING (
    team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid())
  );
