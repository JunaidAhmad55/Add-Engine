
-- Create a table to store user activity logs
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB
);

-- Add comments to explain the purpose of columns
COMMENT ON COLUMN public.activity_log.action IS 'A machine-readable key for the action performed, e.g., ''campaign.created''';
COMMENT ON COLUMN public.activity_log.details IS 'A JSONB object containing context about the action, e.g., { "campaign_id": "...", "campaign_name": "..." }';

-- Add an index for faster querying by team
CREATE INDEX idx_activity_log_team_id_created_at ON public.activity_log (team_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: Allow team members to view their team's activity
CREATE POLICY "Team members can view their team's activity"
  ON public.activity_log
  FOR SELECT
  USING (team_id = public.get_user_team_id());

-- Policy: Allow users to insert their own activity
CREATE POLICY "Users can insert their own activity"
  ON public.activity_log
  FOR INSERT
  WITH CHECK (user_id = auth.uid() AND team_id = public.get_user_team_id());
