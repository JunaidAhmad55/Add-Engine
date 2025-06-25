
-- Create table to store daily campaign performance metrics
CREATE TABLE public.campaign_performance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    spend NUMERIC(10, 2) NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    org_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    -- A campaign can only have one performance record per day
    UNIQUE (campaign_id, date) 
);

-- Add comments to columns for clarity
COMMENT ON COLUMN public.campaign_performance.impressions IS 'Number of times the ad was shown';
COMMENT ON COLUMN public.campaign_performance.clicks IS 'Number of clicks on the ad';
COMMENT ON COLUMN public.campaign_performance.spend IS 'Amount of money spent on a given day';
COMMENT ON COLUMN public.campaign_performance.conversions IS 'Number of desired actions taken (e.g., sign-ups, purchases)';

-- Enable Row Level Security
ALTER TABLE public.campaign_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to manage performance data for campaigns in their organization
CREATE POLICY "Users can manage performance data for their own org"
ON public.campaign_performance
FOR ALL
USING (org_id = public.get_user_team_id())
WITH CHECK (org_id = public.get_user_team_id());

-- Trigger to automatically update 'updated_at' timestamp on modification
CREATE TRIGGER handle_campaign_performance_updated_at
BEFORE UPDATE ON public.campaign_performance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
