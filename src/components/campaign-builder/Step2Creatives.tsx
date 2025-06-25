import React, { useMemo, useState, useCallback } from 'react';
import type { CreativeAsset, AdSet, CampaignCoreData } from '@/types/campaign';
import AssetImportControls from './AssetImportControls';
import { useAssets } from '@/hooks/useAssets';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AdSetCard from './AdSetCard';
import { getAspectRatioGroup } from '@/lib/asset-utils';
import QueueModeModal from "./QueueModeModal";
import BulkAddAdSetsModal from "./BulkAddAdSetsModal";
import { FolderOpen } from "lucide-react";

interface Step2CreativesProps {
  campaignData: CampaignCoreData;
  availableAssets: CreativeAsset[];
  adSets: AdSet[];
  addAdSet: () => void;
  removeAdSet: (id: number) => void;
  updateAdSet: (id: number, field: string, value: string) => void;
  duplicateAdSet: (id: number) => void;
  handleAssetToggle: (adSetId: number, asset: CreativeAsset) => void;
  onAssetsUploaded: (assets: CreativeAsset[]) => void;
  onAddTag: (assetId: string, tag: string) => void;
  onRemoveTag: (assetId: string, tag: string) => void;
  orgId: string;
  userId: string;
}

const Step2Creatives: React.FC<Step2CreativesProps> = ({
  campaignData,
  availableAssets,
  adSets,
  addAdSet,
  removeAdSet,
  updateAdSet,
  duplicateAdSet,
  handleAssetToggle,
  onAssetsUploaded,
  onAddTag,
  onRemoveTag,
  orgId,
  userId,
}) => {
  const { assetsToDisplay } = useAssets(orgId, userId);

  const dimensionsMap = useMemo(() => 
    new Map(assetsToDisplay.map(a => [a.id, { width: a.width, height: a.height }]))
  , [assetsToDisplay]);
  
  const getAssetAspectRatioGroup = (asset: CreativeAsset) => {
    const dims = dimensionsMap.get(asset.id);
    return getAspectRatioGroup(dims?.width, dims?.height);
  };

  const totalSelectedAssets = adSets.reduce((sum, adSet) => sum + adSet.selectedAssets.length, 0);

  // New: Queue Mode modal
  const [queueModeOpen, setQueueModeOpen] = useState(false);

  // Bulk Add Ad Sets modal state
  const [bulkAddOpen, setBulkAddOpen] = useState(false);

  // Bulk Add logic
  const handleBulkAddAdSets = (count: number) => {
    for (let i = 0; i < count; i++) {
      addAdSet();
    }
  };

  // Distribute assets to ad sets
  const handleQueueAssign = useCallback(
    (assignments: { [adSetId: number]: CreativeAsset[] }) => {
      Object.entries(assignments).forEach(([adSetId, assets]) => {
        assets.forEach(asset => {
          handleAssetToggle(Number(adSetId), asset);
        });
      });
    },
    [handleAssetToggle]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Build Your Ad Sets</h3>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">Total Selected Assets: {totalSelectedAssets}</p>
          <AssetImportControls onAssetsUploaded={onAssetsUploaded} />
          {/* New button for Queue Mode */}
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setQueueModeOpen(true)}
            title="Queue Mode: Distribute assets in bulk"
          >
            <FolderOpen className="w-4 h-4" /> Queue Mode
          </Button>
          {/* Bulk Add Ad Sets */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setBulkAddOpen(true)}
            title="Bulk add ad sets"
          >
            + Bulk Add
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {adSets.map((adSet, index) => (
          <AdSetCard
            key={adSet.id}
            adSet={adSet}
            adSetIndex={index}
            campaignData={campaignData}
            availableAssets={availableAssets}
            onUpdate={updateAdSet}
            onRemove={removeAdSet}
            onDuplicate={duplicateAdSet}
            onAssetToggle={handleAssetToggle}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            aspectRatioGroup={getAssetAspectRatioGroup}
          />
        ))}
      </div>
      
      <Button onClick={addAdSet} variant="outline" className="w-full border-dashed">
        <Plus className="h-4 w-4 mr-2" />
        Add Ad Set
      </Button>

      {availableAssets.length === 0 && (
         <p className="text-sm text-gray-500 text-center py-4">No assets available in your library. Upload new assets to get started.</p>
      )}
      
      <QueueModeModal
        open={queueModeOpen}
        onClose={() => setQueueModeOpen(false)}
        availableAssets={availableAssets}
        adSets={adSets}
        onDistribute={handleQueueAssign}
      />
      {/* Bulk Add Modal */}
      <BulkAddAdSetsModal
        open={bulkAddOpen}
        onClose={() => setBulkAddOpen(false)}
        onAdd={handleBulkAddAdSets}
      />
    </div>
  );
};

export default Step2Creatives;
