
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { CampaignCoreData, CreativeAsset, AdCopyVariant as CampaignBuilderAdCopyVariant } from '@/types/campaign'; // Renamed to avoid conflict
import { db, AssetFileType, Campaign, Asset, AdVariant } from "@/lib/database";
import { authService } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { slackService } from '@/lib/services/slack-service';


interface UseCampaignLaunchProps {
  campaignData: CampaignCoreData; // Added campaignData here
  selectedAssets: CreativeAsset[];
  copyVariants: CampaignBuilderAdCopyVariant[];
  resetCampaignState: () => void;
  setCurrentStep: (step: number) => void;
  resetTemplates: () => void;
}

export function useCampaignLaunch({
  campaignData,
  selectedAssets,
  copyVariants,
  resetCampaignState,
  setCurrentStep,
  resetTemplates,
}: UseCampaignLaunchProps) {
  const { toast } = useToast();
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);

  // New: Pre-launch validation
  function validateCampaignBeforeLaunch() {
    if (!campaignData.name?.trim()) {
      toast({ title: "Missing Campaign Name", description: "Please enter a campaign name.", variant: "destructive" });
      return false;
    }
    if (!campaignData.objective) {
      toast({ title: "Missing Objective", description: "Please select a campaign objective.", variant: "destructive" });
      return false;
    }
    if (!selectedAssets.length) {
      toast({ title: "No Assets Selected", description: "Add at least one asset before launching.", variant: "destructive" });
      return false;
    }
    if (!copyVariants.length) {
      toast({ title: "No Ad Copy", description: "Add at least one ad copy variant.", variant: "destructive" });
      return false;
    }
    if (!campaignData.budget || isNaN(Number(campaignData.budget))) {
      toast({ title: "Missing or Invalid Budget", description: "Set a valid campaign budget.", variant: "destructive" });
      return false;
    }
    // More validations can be added as needed (e.g. check integrations)
    return true;
  }

  const handleLaunch = async () => {
    if (!validateCampaignBeforeLaunch()) {
      return; // Block launch until all issues are fixed
    }

    setIsLaunching(true);
    setLaunchProgress(0);

    const user = authService.getCurrentUser();
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to launch a campaign.", variant: "destructive" });
      setIsLaunching(false);
      return;
    }

    let orgId: string;
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('team_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || !profile.team_id) {
        console.error("Error fetching profile or team_id:", profileError);
        toast({ title: "Error", description: "Could not retrieve organization details. Please try again.", variant: "destructive" });
        setIsLaunching(false);
        return;
      }
      orgId = profile.team_id;
    } catch (e) {
      console.error("Exception fetching profile:", e);
      toast({ title: "Error", description: "An unexpected error occurred while fetching organization details.", variant: "destructive" });
      setIsLaunching(false);
      return;
    }
    
    let createdCampaign: Campaign | null = null;

    try {
      // 1. Create Campaign
      const campaignToSave = {
        name: campaignData.name,
        objective: campaignData.objective || null,
        budget: campaignData.budget ? parseFloat(campaignData.budget) : null,
        audience: campaignData.audience || null,
        user_id: user.id,
        org_id: orgId,
        status: 'draft' as const, // Or 'launching' if direct launch
      };
      createdCampaign = await db.createCampaign(campaignToSave);
      setLaunchProgress(20);

      if (!createdCampaign) {
        throw new Error("Failed to create campaign shell.");
      }

      // NEW: Create a default Ad Set since Ad Variants now belong to Ad Sets.
      const adSet = await db.createAdSet({
        campaign_id: createdCampaign.id,
        name: `${createdCampaign.name} Ad Set`,
        budget: createdCampaign.budget,
        audience: createdCampaign.audience,
        org_id: orgId,
      });
      setLaunchProgress(30);


      // 2. Create/Link Assets and then AdVariants
      for (const creativeAsset of selectedAssets) {
        // For MVP, let's assume we create a new asset record for each selected one.
        // In a real app, you'd check if asset exists or handle uploads properly.
        const assetToSave = {
          filename: creativeAsset.name,
          // Ensure creativeAsset.type is compatible with AssetFileType
          file_type: creativeAsset.type as AssetFileType, 
          url: creativeAsset.preview, // This should be a real URL post-upload
          tags: creativeAsset.tags || [],
          user_id: user.id,
          org_id: orgId,
          size_bytes: null, // Placeholder, ideally get from upload
        };
        const savedAsset = await db.createAsset(assetToSave);
        setLaunchProgress(prev => prev + (30 / selectedAssets.length)); // Progress for asset creation

        for (const copyVariant of copyVariants) {
          const adVariantToSave = {
            ad_set_id: adSet.id,
            asset_id: savedAsset.id,
            headline: copyVariant.headline,
            primary_text: copyVariant.primaryText,
            call_to_action: copyVariant.cta,
            org_id: orgId,
            status: 'pending' as const,
          };
          await db.createAdVariant(adVariantToSave);
        }
        setLaunchProgress(prev => prev + (40 / selectedAssets.length)); // Progress for ad variant creation
      }

      setLaunchProgress(100);
      toast({
        title: "Campaign Saved Successfully!",
        description: `Campaign "${createdCampaign.name}" and its ${selectedAssets.length * copyVariants.length} ad variants have been saved.`,
      });

      // Send Slack notification, but don't wait for it to complete
      slackService.sendNotification(
        `🚀 Campaign Saved: *${createdCampaign.name}* with ${selectedAssets.length} assets and ${copyVariants.length} ad copy variants.`
      );

      // Optionally, if you want to simulate the old launch behavior after saving:
      // await new Promise(resolve => setTimeout(resolve, 800)); // simulate API call

    } catch (error) {
      console.error("Error launching campaign:", error);
      toast({
        title: "Launch Failed",
        description: `Could not save campaign: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      // Rollback or cleanup might be needed here in a real app
    } finally {
      setIsLaunching(false);
      if (launchProgress === 100) { // Only reset if fully successful
        setCurrentStep(1);
        resetCampaignState();
        resetTemplates();
      }
    }
  };

  return {
    isLaunching,
    launchProgress,
    handleLaunch,
  };
}

