import { supabase } from '@/integrations/supabase/client';
import type { AdVariant, AdVariantStatus } from '@/lib/db-types';

export interface CreateAdVariantPayload {
  ad_set_id: string;
  asset_id: string;
  headline?: string | null;
  primary_text?: string | null;
  call_to_action?: string | null;
  meta_ad_id?: string | null;
  status?: AdVariantStatus;
  org_id: string;
}

export async function createAdVariant(payload: CreateAdVariantPayload): Promise<AdVariant> {
  const { data, error } = await supabase
    .from('ad_variants')
    .insert({ ...payload, status: payload.status || 'pending' })
    .select()
    .single();

  if (error) {
    console.error('Error creating ad variant:', error);
    throw error;
  }
  return data;
}

export async function getAdVariantsByCampaign(campaignId: string, orgId: string): Promise<AdVariant[]> {
  console.warn(
    `[Deprecation] getAdVariantsByCampaign is deprecated and will be removed. 
    Ad Variants are now linked to Ad Sets, not directly to Campaigns.`
  );
  return Promise.resolve([]);
}

export async function getAdVariantsByOrg(orgId: string): Promise<AdVariant[]> {
  const { data, error } = await supabase
    .from('ad_variants')
    .select('*')
    .eq('org_id', orgId);

  if (error) {
    console.error('Error fetching ad variants by org:', error);
    throw error;
  }
  return data || [];
}

export async function getAdVariantsByAdSetIds(adSetIds: string[], orgId: string): Promise<AdVariant[]> {
  if (!adSetIds || adSetIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('ad_variants')
    .select('*')
    .eq('org_id', orgId)
    .in('ad_set_id', adSetIds);

  if (error) {
    console.error('Error fetching ad variants by ad set IDs:', error);
    throw error;
  }
  return data || [];
}
