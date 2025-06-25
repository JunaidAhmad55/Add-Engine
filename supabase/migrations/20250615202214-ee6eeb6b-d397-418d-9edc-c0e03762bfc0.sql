
-- AI Settings: stores the encrypted OpenAI API key for each team/org and feature toggles
CREATE TABLE public.team_ai_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  openai_api_key TEXT, -- To be encrypted-at-rest with Supabase's column encryption
  god_mode_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id)
);

-- Audit log of all “God Mode” AI generations/interactions
CREATE TABLE public.ai_generation_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'image' | 'copy' | 'prompt_template' | etc.
  prompt TEXT,
  output TEXT,
  token_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Per-team rate limit/cap and usage tracking (tokens this period, max allowed, reset timing)
CREATE TABLE public.team_ai_quota (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  token_quota INTEGER NOT NULL DEFAULT 500000, -- Set your default quota here
  token_used INTEGER NOT NULL DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id)
);

-- Enable RLS for all new tables
ALTER TABLE public.team_ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_ai_quota ENABLE ROW LEVEL SECURITY;

-- Policies: Only members of a team can read/update their team's settings, logs, and quota
CREATE POLICY "Team members can view/update their AI settings"
  ON public.team_ai_settings
  FOR ALL
  USING (org_id = public.get_user_team_id());

CREATE POLICY "Team members can insert/select logs"
  ON public.ai_generation_audit_log
  FOR ALL
  USING (org_id = public.get_user_team_id());

CREATE POLICY "Team members can select/update quota"
  ON public.team_ai_quota
  FOR ALL
  USING (org_id = public.get_user_team_id());

-- Audit log triggers for updated_at
CREATE TRIGGER set_team_ai_settings_updated_at
  BEFORE UPDATE ON public.team_ai_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_team_ai_quota_updated_at
  BEFORE UPDATE ON public.team_ai_quota
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

