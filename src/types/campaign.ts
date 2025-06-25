import type { LucideIcon } from 'lucide-react';

export interface CampaignStep {
  id: number;
  name: string;
  icon: LucideIcon;
}

export interface CampaignCoreData {
  name: string;
  objective: string;
  budget: string;
  audience: string;
}

export interface CreativeAsset {
  id: string;
  name: string;
  type: string; // Keep as string for flexibility
  preview: string;
  tags: string[];
  angle?: string;   // new field
  hook?: string;    // new field
  notes?: string;   // new field
  width?: number | null;  // Ensure aspect ratio grouping works
  height?: number | null; // Ensure aspect ratio grouping works
}

export interface AdCopyVariant {
  id: number;
  headline: string;
  primaryText: string;
  cta: string;
}

export interface AdSet {
  id: number; // Used for frontend key mapping, not the DB ID
  name: string;
  budget: string;
  audience: string;
  selectedAssets: CreativeAsset[];
}
