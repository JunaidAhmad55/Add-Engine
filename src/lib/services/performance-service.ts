
import { supabase } from '@/integrations/supabase/client';
import type { CampaignPerformance } from '@/lib/db-types';

export async function getCampaignPerformance(campaignId: string, orgId: string): Promise<CampaignPerformance[]> {
  const { data, error } = await supabase
    .from('campaign_performance')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('org_id', orgId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching campaign performance:', error);
    throw error;
  }
  return data || [];
}

export async function getPerformanceByOrg(orgId: string): Promise<Pick<CampaignPerformance, 'clicks' | 'conversions'>[]> {
  const { data, error } = await supabase
    .from('campaign_performance')
    .select('clicks, conversions')
    .eq('org_id', orgId);

  if (error) {
    console.error('Error fetching org performance:', error);
    throw error;
  }
  return data || [];
}
