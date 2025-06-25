
import { useState, useEffect, useMemo } from 'react';

import type { CreativeAsset } from '@/types/campaign';

import { useCampaignState } from '@/hooks/useCampaignState';
import { useCampaignSteps } from '@/hooks/useCampaignSteps';
import { useCampaignTemplates } from '@/hooks/useCampaignTemplates';
import { useAdSetCampaignLaunch } from '@/hooks/useAdSetCampaignLaunch';
import { useAssets } from '@/hooks/useAssets';
import { authService } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { db } from '@/lib/database';
import { processTokens } from '@/lib/token-utils';

export const useCampaignBuilderLogic = () => {
    const {
        currentStep,
        setCurrentStep,
        handleNext: handleNextStep,
        handlePrevious: handlePreviousStep,
    } = useCampaignSteps();

    const user = authService.getCurrentUser();
    const [orgId, setOrgId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrgId = async () => {
            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('team_id')
                    .eq('id', user.id)
                    .single();
                if (profile?.team_id) {
                    setOrgId(profile.team_id);
                } else if (error) {
                    console.error("Error fetching orgId:", error.message);
                }
            }
        };
        fetchOrgId();
    }, [user]);

    const { assetsToDisplay } = useAssets(orgId || '', user?.id || '');

    const creativeAssetsForBuilder: CreativeAsset[] = useMemo(() => {
        return assetsToDisplay
            .filter(asset => asset.type === 'image' || asset.type === 'video')
            .map(asset => ({
                id: asset.id,
                name: asset.name,
                type: asset.type as 'image' | 'video',
                preview: asset.preview,
                tags: asset.tags,
            }));
    }, [assetsToDisplay]);

    const {
        campaignData,
        setCampaignData,
        availableAssets,
        addUploadedAssets,
        adSets,
        addAdSet,
        removeAdSet,
        updateAdSet,
        duplicateAdSet,
        handleAssetToggle,
        addTagToAsset,
        removeTagFromAsset,
        copyVariants,
        addCopyVariant,
        removeCopyVariant,
        updateCopyVariant,
        resetCampaignState,
        initialCampaignData,
    } = useCampaignState(creativeAssetsForBuilder);

    const {
        campaignTemplates,
        selectedTemplateId,
        handleTemplateSelect,
        resetTemplates,
    } = useCampaignTemplates({ setCampaignData, initialCampaignData });
    
    const processedAdSets = useMemo(() => {
        const date = new Date();
        return adSets.map((adSet, index) => ({
            ...adSet,
            name: processTokens(adSet.name, {
                campaign: campaignData,
                adSet,
                adSetIndex: index,
                date,
            }),
        }));
    }, [adSets, campaignData]);

    const {
        isLaunching,
        launchProgress,
        handleLaunch,
    } = useAdSetCampaignLaunch({
        campaignData,
        adSets: processedAdSets,
        copyVariants,
        resetCampaignState,
        setCurrentStep,
        resetTemplates,
    });

    const handleAddTag = async (assetId: string, tag: string) => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return;

        const asset = availableAssets.find(a => a.id === assetId);
        if (!asset) return;

        const newTags = [...new Set([...(asset.tags || []), trimmedTag])];
        
        addTagToAsset(assetId, trimmedTag);

        if (orgId && user?.id) {
            try {
                await db.updateAssetTags(assetId, newTags, orgId);
                await db.logActivity({
                    action: 'asset.tag.added',
                    details: { asset_id: assetId, tag: trimmedTag },
                    team_id: orgId,
                    user_id: user.id,
                });
            } catch (error) {
                console.error("Failed to add asset tag:", error);
            }
        }
    };

    const handleRemoveTag = async (assetId: string, tagToRemove: string) => {
        const asset = availableAssets.find(a => a.id === assetId);
        if (!asset) return;

        const newTags = (asset.tags || []).filter(t => t !== tagToRemove);

        removeTagFromAsset(assetId, tagToRemove);

        if (orgId && user?.id) {
            try {
                await db.updateAssetTags(assetId, newTags, orgId);
                await db.logActivity({
                    action: 'asset.tag.removed',
                    details: { asset_id: assetId, tag: tagToRemove },
                    team_id: orgId,
                    user_id: user.id,
                });
            } catch (error) {
                console.error("Failed to remove asset tag:", error);
            }
        }
    };

    const totalAds = adSets.reduce((total, adSet) => total + (adSet.selectedAssets.length * copyVariants.length), 0);

    return {
        currentStep,
        handleNextStep,
        handlePreviousStep,
        user,
        orgId,
        campaignData,
        setCampaignData,
        availableAssets,
        addUploadedAssets,
        adSets,
        addAdSet,
        removeAdSet,
        updateAdSet,
        duplicateAdSet,
        handleAssetToggle,
        copyVariants,
        addCopyVariant,
        removeCopyVariant,
        updateCopyVariant,
        campaignTemplates,
        selectedTemplateId,
        handleTemplateSelect,
        isLaunching,
        launchProgress,
        handleLaunch,
        handleAddTag,
        handleRemoveTag,
        totalAds,
    };
};
