
import { supabase } from '@/integrations/supabase/client';
import type { AdSet } from '@/lib/db-types';

export interface CreateAdSetPayload {
  campaign_id: string;
  name: string;
  budget?: number | null;
  audience?: string | null;
  org_id: string;
}

export async function createAdSet(payload: CreateAdSetPayload): Promise<AdSet> {
  const { data, error } = await supabase
    .from('ad_sets')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error creating ad set:', error);
    throw error;
  }
  return data;
}

export async function getAdSetsByCampaign(campaignId: string, orgId: string): Promise<AdSet[]> {
  const { data, error } = await supabase
    .from('ad_sets')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('org_id', orgId);

  if (error) {
    console.error('Error fetching ad sets by campaign:', error);
    throw error;
  }
  return data || [];
}
