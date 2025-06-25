
import { supabase } from '@/integrations/supabase/client';
import type { AssetFolder } from '@/lib/db-types';

export interface CreateAssetFolderPayload {
  name: string;
  org_id: string;
  user_id: string;
}

export async function createAssetFolder(payload: CreateAssetFolderPayload): Promise<AssetFolder> {
  const { data, error } = await supabase
    .from('asset_folders')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error creating asset folder:', error);
    throw error;
  }
  return data;
}

export async function getAssetFoldersByOrg(orgId: string): Promise<AssetFolder[]> {
  const { data, error } = await supabase
    .from('asset_folders')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching asset folders by org:', error);
    throw error;
  }
  return data || [];
}
