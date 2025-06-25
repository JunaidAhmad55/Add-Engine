
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { AdSet, CreativeAsset, CampaignCoreData } from '@/types/campaign';
import { processTokens } from '@/lib/token-utils';
import AdSetHeader from './AdSetHeader';
import AdSetForm from './AdSetForm';
import SelectedAssetsSection from './SelectedAssetsSection';
import AssetLibrarySection from './AssetLibrarySection';

interface AdSetCardProps {
  adSet: AdSet;
  adSetIndex: number;
  campaignData: CampaignCoreData;
  availableAssets: CreativeAsset[];
  onUpdate: (id: number, field: string, value: string) => void;
  onRemove: (id: number) => void;
  onDuplicate: (id: number) => void;
  onAssetToggle: (adSetId: number, asset: CreativeAsset) => void;
  onAddTag: (assetId: string, tag: string) => void;
  onRemoveTag: (assetId: string, tag: string) => void;
  aspectRatioGroup: (asset: CreativeAsset) => string;
}

const AdSetCard: React.FC<AdSetCardProps> = ({
  adSet,
  adSetIndex,
  campaignData,
  availableAssets,
  onUpdate,
  onRemove,
  onDuplicate,
  onAssetToggle,
  onAddTag,
  onRemoveTag,
  aspectRatioGroup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const selectedAssetIds = useMemo(() => new Set(adSet.selectedAssets.map(a => a.id)), [adSet.selectedAssets]);

  const unselectedAssets = useMemo(() => {
    return availableAssets.filter(a => !selectedAssetIds.has(a.id));
  }, [availableAssets, selectedAssetIds]);

  const filteredUnselectedAssets = useMemo(() => {
    if (!searchTerm.trim()) {
      return unselectedAssets;
    }
    const lowercasedTerm = searchTerm.trim().toLowerCase();
    return unselectedAssets.filter(a =>
      a.name.toLowerCase().includes(lowercasedTerm) ||
      (a.tags || []).some(tag => tag.toLowerCase().includes(lowercasedTerm))
    );
  }, [searchTerm, unselectedAssets]);

  const groupOrder = ['1:1 (Square)', '4:5 (Vertical)', '9:16 (Vertical)', '16:9 (Landscape)', 'Other'];

  const groupAndSortAssets = (assets: CreativeAsset[]) => {
    if (assets.length === 0) return [];
    const grouped = assets.reduce((acc, asset) => {
      const group = aspectRatioGroup(asset);
      if (!acc[group]) acc[group] = [];
      acc[group].push(asset);
      return acc;
    }, {} as Record<string, CreativeAsset[]>);
    
    return Object.entries(grouped).sort(([a], [b]) => {
        const indexA = groupOrder.indexOf(a);
        const indexB = groupOrder.indexOf(b);
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });
  };

  const sortedGroupedSelectedAssets = groupAndSortAssets(adSet.selectedAssets);
  const sortedGroupedUnselectedAssets = groupAndSortAssets(filteredUnselectedAssets);

  const processedName = processTokens(adSet.name, {
    campaign: campaignData,
    adSet,
    adSetIndex,
    date: new Date(),
  });

  const handleBulkSelect = (assets: CreativeAsset[]) => {
    assets.forEach(asset => {
      if (!selectedAssetIds.has(asset.id)) {
        onAssetToggle(adSet.id, asset);
      }
    });
  };

  const handleBulkDeselect = (assets: CreativeAsset[]) => {
    assets.forEach(asset => {
      if (selectedAssetIds.has(asset.id)) {
        onAssetToggle(adSet.id, asset);
      }
    });
  };

  return (
    <Card className="border-2 border-gray-200">
      <AdSetHeader
        adSetId={adSet.id}
        name={adSet.name}
        processedName={processedName}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onDuplicate={onDuplicate}
      />
      <CardContent className="p-4 space-y-4">
        <AdSetForm
          adSetId={adSet.id}
          budget={adSet.budget}
          audience={adSet.audience}
          onUpdate={onUpdate}
        />

        <SelectedAssetsSection
          selectedAssets={adSet.selectedAssets}
          selectedAssetIds={selectedAssetIds}
          sortedGroupedSelectedAssets={sortedGroupedSelectedAssets}
          onAssetToggle={onAssetToggle}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          onBulkSelect={handleBulkSelect}
          onBulkDeselect={handleBulkDeselect}
          adSetId={adSet.id}
        />

        <AssetLibrarySection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortedGroupedUnselectedAssets={sortedGroupedUnselectedAssets}
          selectedAssetIds={selectedAssetIds}
          unselectedAssets={unselectedAssets}
          availableAssets={availableAssets}
          onAssetToggle={onAssetToggle}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          onBulkSelect={handleBulkSelect}
          onBulkDeselect={handleBulkDeselect}
          adSetId={adSet.id}
        />
      </CardContent>
    </Card>
  );
};

export default AdSetCard;
