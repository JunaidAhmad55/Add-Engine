
import type { Database, Json } from '@/integrations/supabase/types'; // Supabase generated types

// App-specific User type (might be different from Supabase.User)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'buyer' | 'creator';
  orgId: string;
  createdAt: Date;
  password?: string; // For mock purposes
}

export type Account = {
  id: string;
  name: string;
  plan_type: string;
  seat_limit: number;
  created_at: string;
  updated_at: string;
};

export type AccountMembership = {
  id: string;
  user_id: string;
  account_id: string;
  role: 'admin' | 'buyer' | 'creator';
  created_at: string;
  updated_at: string;
};

// Use Supabase generated types for DB entities
export type AdSet = Database['public']['Tables']['ad_sets']['Row'];
export type Asset = Database['public']['Tables']['assets']['Row'];
export type AssetFolder = Database['public']['Tables']['asset_folders']['Row'];
export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type AdVariant = Database['public']['Tables']['ad_variants']['Row'];
export type CampaignPerformance = Database['public']['Tables']['campaign_performance']['Row'];

// CampaignTemplate type using Supabase generated type
export type CampaignTemplate = Database['public']['Tables']['campaign_templates']['Row'];

// Enum types from Supabase schema (useful for frontend validation or type safety)
export type AssetFileType = Database['public']['Enums']['asset_file_type'];
export type CampaignStatus = Database['public']['Enums']['campaign_status'];
export type AdVariantStatus = Database['public']['Enums']['ad_variant_status'];
