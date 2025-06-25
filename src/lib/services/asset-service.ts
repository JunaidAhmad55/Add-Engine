import { supabase } from '@/integrations/supabase/client';
import type { Asset, AssetFileType } from '@/lib/db-types';

export interface CreateAssetPayload {
  filename: string;
  file_type: AssetFileType;
  url: string;
  tags?: string[];
  folder_id?: string | null;
  user_id: string;
  org_id: string;
  size_bytes?: number | null;
  width?: number | null;
  height?: number | null;
}

export async function createAsset(payload: CreateAssetPayload): Promise<Asset> {
  const { data, error } = await supabase
    .from('assets')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
  return data;
}

export async function getAssetsByOrg(orgId: string): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('org_id', orgId);

  if (error) {
    console.error('Error fetching assets by org:', error);
    throw error;
  }
  return data || [];
}

export async function deleteAsset(id: string, orgId: string): Promise<void> {
  const { error } = await supabase
    .from('assets')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId); // Ensure user can only delete from their org via RLS

  if (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
}

export async function updateAssetTags(
  id: string,
  tags: string[],
  orgId: string
): Promise<Asset> {
  const { data, error } = await supabase
    .from('assets')
    .update({ tags })
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();

  if (error) {
    console.error('Error updating asset tags:', error);
    throw error;
  }
  return data;
}

export async function updateAssetMetadata(
  id: string,
  updates: { angle?: string; hook?: string; notes?: string },
  orgId: string
): Promise<Asset> {
  const { data, error } = await supabase
    .from('assets')
    .update(updates)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();

  if (error) {
    console.error('Error updating asset metadata:', error);
    throw error;
  }
  return data;
}
