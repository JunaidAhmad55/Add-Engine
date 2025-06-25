
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import type { CreativeAsset } from '@/types/campaign'; // Assuming CreativeAsset can represent these
import { CheckCircle, Video } from 'lucide-react';

// Mock TikTok assets
const mockTikTokAssets: CreativeAsset[] = [
  { id: '1', name: 'Cool Dance Challenge.mp4', type: 'video', preview: '/placeholder.svg', tags: ['dance', 'challenge'] },
  { id: '2', name: 'Funny Sketch.mp4', type: 'video', preview: '/placeholder.svg', tags: ['comedy', 'sketch'] },
  { id: '3', name: 'Product Demo Short.mp4', type: 'video', preview: '/placeholder.svg', tags: ['product', 'demo', 'short'] },
  { id: '4', name: 'Travel Vlog Clip.mp4', type: 'video', preview: '/placeholder.svg', tags: ['travel', 'vlog'] },
];

interface TikTokAssetPickerProps {
  onAssetsSelected: (assets: CreativeAsset[]) => void;
  onClose: () => void;
}

const TikTokAssetPicker: React.FC<TikTokAssetPickerProps> = ({ onAssetsSelected, onClose }) => {
  const [selectedTikTokAssets, setSelectedTikTokAssets] = useState<CreativeAsset[]>([]);

  const handleAssetToggle = (asset: CreativeAsset) => {
    setSelectedTikTokAssets(prev =>
      prev.find(a => a.id === asset.id)
        ? prev.filter(a => a.id !== asset.id)
        : [...prev, asset]
    );
  };

  const handleSubmit = () => {
    onAssetsSelected(selectedTikTokAssets);
    onClose();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select mock TikTok assets to import into your campaign.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
        {mockTikTokAssets.map(asset => (
          <div
            key={asset.id}
            onClick={() => handleAssetToggle(asset)}
            className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all flex flex-col items-center justify-center aspect-square ${
              selectedTikTokAssets.find(a => a.id === asset.id)
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Video className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-xs font-medium text-center truncate w-full">{asset.name}</p>
            {selectedTikTokAssets.find(a => a.id === asset.id) && (
              <div className="absolute top-1 right-1 bg-pink-600 text-white rounded-full p-0.5">
                <CheckCircle className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={selectedTikTokAssets.length === 0}>
          Add {selectedTikTokAssets.length} Asset{selectedTikTokAssets.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};

export default TikTokAssetPicker;
