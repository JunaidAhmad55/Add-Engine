import { supabase } from '@/integrations/supabase/client';
import type { Campaign, CampaignStatus } from '@/lib/db-types';

export interface CreateCampaignPayload {
  name: string;
  objective?: string | null;
  audience?: string | null;
  status?: CampaignStatus;
  budget?: number | null;
  meta_campaign_id?: string | null;
  user_id: string;
  org_id: string;
  launched_at?: string | null;
}

export async function createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ ...payload, status: payload.status || 'draft' })
    .select()
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
  return data;
}

export async function getCampaignsByOrg(orgId: string): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('org_id', orgId);

  if (error) {
    console.error('Error fetching campaigns by org:', error);
    throw error;
  }
  return data || [];
}

export async function getCampaignById(id: string, orgId: string): Promise<Campaign | null> {
   const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching campaign by id:', error);
    throw error;
  }
  return data;
}

export async function updateCampaign(id: string, updates: Partial<Omit<Campaign, 'id' | 'created_at' | 'user_id' | 'org_id'>>, orgId: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .eq('org_id', orgId) // RLS will also enforce this
    .select()
    .single();

  if (error) {
    console.error('Error updating campaign:', error);
    // It's possible the campaign doesn't exist or RLS prevents access, leading to an error or null data.
    // Depending on PostgREST settings, an update on no rows might not be an error.
    if (error.code === 'PGRST204') return null; // PostgREST code for no rows found
    throw error;
  }
  return data;
}
