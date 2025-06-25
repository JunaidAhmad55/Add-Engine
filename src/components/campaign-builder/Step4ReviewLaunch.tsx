import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CreativeAsset as AppCreativeAsset } from '@/types/campaign'; // Using this for clarity

interface CampaignData {
  name: string;
  objective: string;
  budget: string;
  audience: string; // Added from CampaignCoreData
}

// Asset type for this component aligns with CreativeAsset from useCampaignState
interface AssetForReview {
  id: string; 
  name: string;
  preview: string;
  // type: 'image' | 'video' | 'file'; // Matches CreativeAsset.type from types/campaign.ts
}

interface CopyVariantForReview {
  id: number; // from useCampaignState AdCopyVariant
  headline: string;
  primaryText: string;
  cta: string;
}

interface Step4ReviewLaunchProps {
  campaignData: CampaignData;
  selectedAssets: AppCreativeAsset[]; // Use AppCreativeAsset which has string id
  copyVariants: CopyVariantForReview[];
  totalAds: number;
  isLaunching: boolean;
  launchProgress: number;
}

const Step4ReviewLaunch: React.FC<Step4ReviewLaunchProps> = ({
  campaignData,
  selectedAssets,
  copyVariants,
  totalAds,
  isLaunching,
  launchProgress,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Review & Launch Campaign</h3>
      
      {/* Campaign Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900">Campaign Details</h4>
              <p className="text-sm text-blue-700 mt-1">
                {campaignData.name || 'Untitled Campaign'}
              </p>
              <p className="text-sm text-blue-600">
                {campaignData.objective} • ${campaignData.budget || '0'}/day
              </p>
              {campaignData.audience && <p className="text-xs text-blue-500 mt-1">Audience: {campaignData.audience}</p>}
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Assets & Copy</h4>
              <p className="text-sm text-blue-700 mt-1">
                {selectedAssets.length} creative assets
              </p>
              <p className="text-sm text-blue-600">
                {copyVariants.length} copy variants
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Total Ads</h4>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {totalAds}
              </p>
              <p className="text-sm text-blue-600">
                ads to be created
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ad Preview */}
      <div>
        <h4 className="font-semibold mb-4">Ad Combinations Preview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {selectedAssets.slice(0, 6).map((asset) => 
            copyVariants.slice(0, 2).map((copy) => (
              <Card key={`${asset.id}-${copy.id}`} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="aspect-video bg-gray-100 rounded mb-2">
                    <img src={asset.preview} alt={asset.name} className="w-full h-full object-cover rounded" />
                  </div>
                  <p className="font-medium text-sm">{copy.headline || 'Sample Headline'}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {copy.primaryText?.substring(0, 50) || 'Sample ad text...'}
                  </p>
                  <Button size="sm" className="w-full mt-2" variant="outline">
                    {copy.cta}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {totalAds > 6 && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Showing 6 of {totalAds} total ads
          </p>
        )}
      </div>

      {/* Launch Progress */}
      {isLaunching && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">Saving Campaign...</h4>
                <p className="text-sm text-green-700">Storing campaign data in Supabase</p>
                <Progress value={launchProgress} className="mt-2" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-900">{launchProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Step4ReviewLaunch;
