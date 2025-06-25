
import { supabase } from '@/integrations/supabase/client';
import type { CampaignTemplate } from '@/lib/db-types'; // Using our defined type

// Campaign Template methods - USES SUPABASE
export async function getCampaignTemplates(userId: string): Promise<CampaignTemplate[]> {
  if (!userId) {
      console.error("User ID is required to fetch campaign templates.");
      return [];
  }
  const { data, error } = await supabase
    .from('campaign_templates')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching campaign templates from Supabase:', error);
    throw error;
  }
  return data || [];
}

export async function getCampaignTemplateById(id: string, userId: string): Promise<CampaignTemplate | null> {
   if (!userId) {
      console.error("User ID is required to fetch a campaign template by ID.");
      return null;
  }
  const { data, error } = await supabase
    .from('campaign_templates')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching campaign template by ID from Supabase:', error);
    return null;
  }
  return data;
}

export async function createCampaignTemplate(templateData: Omit<CampaignTemplate, 'id' | 'created_at' | 'updated_at' | 'user_id'> & { user_id: string }): Promise<CampaignTemplate> {
  const { data, error } = await supabase
      .from('campaign_templates')
      .insert([templateData])
      .select()
      .single();

  if (error) {
      console.error('Error creating campaign template in Supabase:', error);
      throw error;
  }
  return data;
}

export async function updateCampaignTemplate(id: string, userId: string, updates: Partial<Omit<CampaignTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<CampaignTemplate | null> {
  const { data, error } = await supabase
      .from('campaign_templates')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
  
  if (error) {
      console.error('Error updating campaign template in Supabase:', error);
      return null;
  }
  return data;
}

export async function deleteCampaignTemplate(id: string, userId: string): Promise<boolean> {
  const { error } = await supabase
      .from('campaign_templates')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

  if (error) {
      console.error('Error deleting campaign template in Supabase:', error);
      return false;
  }
  return true;
}
