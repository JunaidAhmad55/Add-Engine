
-- Create a table for user-specific campaign templates
CREATE TABLE public.campaign_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  default_objective TEXT,
  default_budget NUMERIC,
  default_audience JSONB, -- To store structured audience data (locations, ageRange, interests)
  default_placements JSONB, -- To store an array of placement strings
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.campaign_templates ENABLE ROW LEVEL SECURITY;

-- Policies for campaign_templates:
-- 1. Users can select their own templates
CREATE POLICY "Users can select their own campaign templates"
  ON public.campaign_templates
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Users can insert new templates for themselves
CREATE POLICY "Users can insert their own campaign templates"
  ON public.campaign_templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own templates
CREATE POLICY "Users can update their own campaign templates"
  ON public.campaign_templates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own templates
CREATE POLICY "Users can delete their own campaign templates"
  ON public.campaign_templates
  FOR DELETE
  USING (auth.uid() = user_id);

