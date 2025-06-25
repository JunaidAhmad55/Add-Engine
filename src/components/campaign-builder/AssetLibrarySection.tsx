
import React from 'react';
import { Input } from '@/components/ui/input';
import type { CreativeAsset } from '@/types/campaign';
import AssetCard from './AssetCard';
import BulkAssetControls from './BulkAssetControls';

interface AssetLibrarySectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortedGroupedUnselectedAssets: [string, CreativeAsset[]][];
  selectedAssetIds: Set<string>;
  unselectedAssets: CreativeAsset[];
  availableAssets: CreativeAsset[];
  onAssetToggle: (adSetId: number, asset: CreativeAsset) => void;
  onAddTag: (assetId: string, tag: string) => void;
  onRemoveTag: (assetId: string, tag: string) => void;
  onBulkSelect: (assets: CreativeAsset[]) => void;
  onBulkDeselect: (assets: CreativeAsset[]) => void;
  adSetId: number;
}

const AssetLibrarySection: React.FC<AssetLibrarySectionProps> = ({
  searchTerm,
  setSearchTerm,
  sortedGroupedUnselectedAssets,
  selectedAssetIds,
  unselectedAssets,
  availableAssets,
  onAssetToggle,
  onAddTag,
  onRemoveTag,
  onBulkSelect,
  onBulkDeselect,
  adSetId,
}) => {
  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-gray-800">Asset Library</h4>
        <Input
          placeholder="Search by name or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {sortedGroupedUnselectedAssets.length > 0 ? (
        sortedGroupedUnselectedAssets.map(([groupName, assets]) => (
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
                  isSelected={false}
                  onToggleSelect={() => onAssetToggle(adSetId, asset)}
                  onAddTag={onAddTag}
                  onRemoveTag={onRemoveTag}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500 text-center py-4 border-2 border-dashed rounded-lg">
          {searchTerm && <p>No assets match your search.</p>}
          {!searchTerm && unselectedAssets.length === 0 && availableAssets.length > 0 && (
            <p>All available assets have been selected.</p>
          )}
          {!searchTerm && availableAssets.length === 0 && (
            <p>No assets available. Upload new assets.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetLibrarySection;
