
import React from 'react';
import type { CreativeAsset } from '@/types/campaign';
import AssetCard from './AssetCard';
import BulkAssetControls from './BulkAssetControls';

interface SelectedAssetsSectionProps {
  selectedAssets: CreativeAsset[];
  selectedAssetIds: Set<string>;
  sortedGroupedSelectedAssets: [string, CreativeAsset[]][];
  onAssetToggle: (adSetId: number, asset: CreativeAsset) => void;
  onAddTag: (assetId: string, tag: string) => void;
  onRemoveTag: (assetId: string, tag: string) => void;
  onBulkSelect: (assets: CreativeAsset[]) => void;
  onBulkDeselect: (assets: CreativeAsset[]) => void;
  adSetId: number;
}

const SelectedAssetsSection: React.FC<SelectedAssetsSectionProps> = ({
  selectedAssets,
  selectedAssetIds,
  sortedGroupedSelectedAssets,
  onAssetToggle,
  onAddTag,
  onRemoveTag,
  onBulkSelect,
  onBulkDeselect,
  adSetId,
}) => {
  return (
    <div>
      <h4 className="font-medium mb-2">Selected Assets ({selectedAssets.length})</h4>
      {selectedAssets.length > 0 ? (
        <div className="space-y-4">
          {sortedGroupedSelectedAssets.map(([groupName, assets]) => (
            <div key={groupName}>
              <BulkAssetControls
                assets={assets}
                selectedAssetIds={selectedAssetIds}
                onSelectAll={onBulkSelect}
                onDeselectAll={onBulkDeselect}
                groupName={groupName}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    isSelected={true}
                    onToggleSelect={() => onAssetToggle(adSetId, asset)}
                    onAddTag={onAddTag}
                    onRemoveTag={onRemoveTag}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4 border-2 border-dashed rounded-lg">
          Select assets from the library below.
        </p>
      )}
    </div>
  );
};

export default SelectedAssetsSection;
