
import { useState, useCallback } from 'react';
import { db } from '@/lib/database';
import type { CampaignCoreData, AdSet, AdCopyVariant } from '@/types/campaign';

interface UseAdSetCampaignLaunchProps {
  campaignData: CampaignCoreData;
  adSets: AdSet[];
  copyVariants: AdCopyVariant[];
  resetCampaignState: () => void;
  setCurrentStep: (step: number) => void;
  resetTemplates: () => void;
}

export function useAdSetCampaignLaunch({
  campaignData,
  adSets,
  copyVariants,
  resetCampaignState,
  setCurrentStep,
  resetTemplates,
}: UseAdSetCampaignLaunchProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);

  const handleLaunch = useCallback(async (orgId: string, userId: string) => {
    setIsLaunching(true);
    setLaunchProgress(0);

    try {
      const campaign = await db.createCampaign({
        name: campaignData.name,
        objective: campaignData.objective,
        budget: parseFloat(campaignData.budget) || null,
        audience: campaignData.audience,
        status: 'launching',
        org_id: orgId,
        user_id: userId,
      });
      setLaunchProgress(10);

      await db.logActivity({
        action: 'campaign.created',
        details: { campaign_id: campaign.id, name: campaign.name },
        team_id: orgId,
        user_id: userId,
      });

      for (const adSet of adSets) {
        const createdAdSet = await db.createAdSet({
            campaign_id: campaign.id,
            name: adSet.name,
            budget: parseFloat(adSet.budget) || null,
            audience: adSet.audience,
            org_id: orgId
        });

        for (const asset of adSet.selectedAssets) {
          for (const copy of copyVariants) {
            await db.createAdVariant({
              ad_set_id: createdAdSet.id,
              asset_id: asset.id,
              headline: copy.headline,
              primary_text: copy.primaryText,
              call_to_action: copy.cta,
              status: 'pending',
              org_id: orgId,
            });
          }
        }
      }
      
      setLaunchProgress(90);

      await db.updateCampaign(campaign.id, { status: 'active', launched_at: new Date().toISOString() }, orgId);
      
      await db.logActivity({
        action: 'campaign.launched',
        details: { campaign_id: campaign.id, name: campaign.name },
        team_id: orgId,
        user_id: userId,
      });

      setLaunchProgress(100);

      setTimeout(() => {
        resetCampaignState();
        resetTemplates();
        setCurrentStep(1);
        setIsLaunching(false);
      }, 1000);

    } catch (error) {
      console.error("Failed to launch campaign:", error);
      setIsLaunching(false);
    }
  }, [campaignData, adSets, copyVariants, resetCampaignState, setCurrentStep, resetTemplates]);

  return { isLaunching, launchProgress, handleLaunch };
}
