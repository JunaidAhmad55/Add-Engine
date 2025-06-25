
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, Layers } from 'lucide-react';
import type { CreativeAsset } from '@/types/campaign';

interface BulkAssetControlsProps {
  assets: CreativeAsset[];
  selectedAssetIds: Set<string>;
  onSelectAll: (assets: CreativeAsset[]) => void;
  onDeselectAll: (assets: CreativeAsset[]) => void;
  groupName: string;
}

const BulkAssetControls: React.FC<BulkAssetControlsProps> = ({
  assets,
  selectedAssetIds,
  onSelectAll,
  onDeselectAll,
  groupName,
}) => {
  const allSelected = assets.length > 0 && assets.every(asset => selectedAssetIds.has(asset.id));
  const someSelected = assets.some(asset => selectedAssetIds.has(asset.id));

  return (
    <div className="flex items-center gap-2 mb-2">
      <Layers className="h-4 w-4 text-gray-500" />
      <span className="text-sm font-medium text-gray-700">{groupName}</span>
      <div className="flex gap-1 ml-auto">
        {!allSelected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectAll(assets)}
            className="h-7 px-2 text-xs"
          >
            <CheckSquare className="h-3 w-3 mr-1" />
            Select All
          </Button>
        )}
        {someSelected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeselectAll(assets)}
            className="h-7 px-2 text-xs"
          >
            <Square className="h-3 w-3 mr-1" />
            Deselect All
          </Button>
        )}
      </div>
    </div>
  );
};

export default BulkAssetControls;
