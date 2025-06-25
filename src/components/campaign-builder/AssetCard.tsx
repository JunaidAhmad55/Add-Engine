
import React from 'react';
import type { CreativeAsset } from '@/types/campaign';
import { CheckCircle } from "lucide-react";
import AssetMediaPreview from './AssetMediaPreview';
import AssetTagsSection from './AssetTagsSection';
import AssetMetadataEditor from './AssetMetadataEditor';

interface AssetCardProps {
  asset: CreativeAsset;
  isSelected: boolean;
  onToggleSelect: (asset: CreativeAsset) => void;
  onAddTag: (assetId: string, tag: string) => void;
  onRemoveTag: (assetId:string, tag: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  isSelected,
  onToggleSelect,
  onAddTag,
  onRemoveTag,
}) => {
  return (
    <div
      className={`relative border-2 rounded-lg p-3 flex flex-col justify-between transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500'
      }`}
    >
      <div>
        <AssetMediaPreview asset={asset} onClick={() => onToggleSelect(asset)} />
        <p className="text-sm font-medium truncate cursor-pointer" onClick={() => onToggleSelect(asset)}>{asset.name}</p>
        <p className="text-xs text-gray-500 capitalize cursor-pointer" onClick={() => onToggleSelect(asset)}>{asset.type}</p>
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
            <CheckCircle className="h-4 w-4" />
          </div>
        )}
      </div>
      <AssetTagsSection
        assetId={asset.id}
        tags={asset.tags || []}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />
      <AssetMetadataEditor
        asset={asset}
      />
    </div>
  );
};

export default AssetCard;
