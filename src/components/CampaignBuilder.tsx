import React, { useEffect, useCallback } from 'react';
import { 
  Settings, 
  Image, 
  FileText, 
  Rocket, 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { CampaignStep } from '@/types/campaign';

import { useCampaignBuilderLogic } from '@/hooks/useCampaignBuilderLogic';

import CampaignProgressSteps from "./campaign-builder/CampaignProgressSteps";
import Step1Settings from "./campaign-builder/Step1Settings";
import Step2Creatives from "./campaign-builder/Step2Creatives";
import Step3AdCopy from "./campaign-builder/Step3AdCopy";
import Step4ReviewLaunch from "./campaign-builder/Step4ReviewLaunch";
import SaveCampaignTemplate from "./campaign-builder/SaveCampaignTemplate";

// Static data specific to this CampaignBuilder instance
const steps: CampaignStep[] = [
  { id: 1, name: "Campaign Settings", icon: Settings },
  { id: 2, name: "Creative Assets", icon: Image },
  { id: 3, name: "Ad Copy", icon: FileText },
  { id: 4, name: "Review & Launch", icon: Rocket }
];

const objectives = [
  "Brand Awareness", "Reach", "Traffic", "Engagement", 
  "App Installs", "Video Views", "Lead Generation", "Conversions"
];

const CampaignBuilder = () => {
  const {
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
  } = useCampaignBuilderLogic();

  // Keyboard shortcut: Shift + L for "launch" (on review step)
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.shiftKey &&
        (e.key === "l" || e.key === "L") &&
        currentStep === 4 &&
        !isLaunching &&
        orgId &&
        user?.id &&
        totalAds > 0
      ) {
        e.preventDefault();
        handleLaunch(orgId, user.id);
      }
    },
    [currentStep, isLaunching, orgId, user, totalAds, handleLaunch]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Campaign Builder</h2>
        <p className="text-gray-600">Create and launch bulk ad campaigns in minutes</p>
      </div>

      <CampaignProgressSteps currentStep={currentStep} steps={steps} />

      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <Step1Settings
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              campaignTemplates={campaignTemplates}
              selectedTemplateId={selectedTemplateId}
              handleTemplateSelect={handleTemplateSelect}
              objectives={objectives}
            />
          )}

          {currentStep === 2 && (
            <Step2Creatives
              campaignData={campaignData}
              availableAssets={availableAssets}
              adSets={adSets}
              addAdSet={addAdSet}
              removeAdSet={removeAdSet}
              updateAdSet={updateAdSet}
              duplicateAdSet={duplicateAdSet}
              handleAssetToggle={handleAssetToggle}
              onAssetsUploaded={addUploadedAssets}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              orgId={orgId || ''}
              userId={user?.id || ''}
            />
          )}

          {currentStep === 3 && (
            <Step3AdCopy
              copyVariants={copyVariants}
              addCopyVariant={addCopyVariant}
              removeCopyVariant={removeCopyVariant}
              updateCopyVariant={updateCopyVariant}
            />
          )}

          {currentStep === 4 && (
            <Step4ReviewLaunch
              campaignData={campaignData}
              selectedAssets={adSets.flatMap(adSet => adSet.selectedAssets)}
              copyVariants={copyVariants}
              totalAds={totalAds}
              isLaunching={isLaunching}
              launchProgress={launchProgress}
            />
          )}

          {/* Navigation */}
          <Separator className="my-6" />
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep} 
              disabled={currentStep === 1 || isLaunching}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <SaveCampaignTemplate 
                campaignData={campaignData}
                disabled={isLaunching || !campaignData.name}
              />
              {currentStep < 4 ? (
                <Button 
                  onClick={handleNextStep}
                  disabled={
                    isLaunching ||
                    (currentStep === 1 && (!campaignData.name || !campaignData.objective || !campaignData.budget)) ||
                    (currentStep === 2 && adSets.some(as => as.selectedAssets.length === 0 || !as.name || !as.budget)) ||
                    (currentStep === 3 && copyVariants.some(v => !v.headline || !v.primaryText))
                  }
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                      if(orgId && user?.id) {
                          handleLaunch(orgId, user.id);
                      }
                  }}
                  disabled={isLaunching || totalAds === 0}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isLaunching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving... 
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Save Campaign
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignBuilder;
