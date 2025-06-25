
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import type { CreativeAsset } from '@/types/campaign';
import { CheckCircle, Image, Video } from 'lucide-react';

// Mock Meta assets
const mockMetaAssets: CreativeAsset[] = [
  { id: '1', name: 'Summer_Sale_Post.jpg', type: 'image', preview: '/placeholder.svg', tags: ['summer', 'sale', 'post'] },
  { id: '2', name: 'Brand_Story_Video.mp4', type: 'video', preview: '/placeholder.svg', tags: ['brand', 'story', 'video'] },
  { id: '3', name: 'Carousel_Ad_Image_1.jpg', type: 'image', preview: '/placeholder.svg', tags: ['carousel', 'product'] },
  { id: '4', name: 'Customer_Testimonial.mp4', type: 'video', preview: '/placeholder.svg', tags: ['testimonial', 'social proof'] },
];

interface MetaAssetPickerProps {
  onAssetsSelected: (assets: CreativeAsset[]) => void;
  onClose: () => void;
}

const MetaAssetPicker: React.FC<MetaAssetPickerProps> = ({ onAssetsSelected, onClose }) => {
  const [selectedMetaAssets, setSelectedMetaAssets] = useState<CreativeAsset[]>([]);

  const handleAssetToggle = (asset: CreativeAsset) => {
    setSelectedMetaAssets(prev =>
      prev.find(a => a.id === asset.id)
        ? prev.filter(a => a.id !== asset.id)
        : [...prev, asset]
    );
  };

  const handleSubmit = () => {
    onAssetsSelected(selectedMetaAssets);
    onClose();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select mock Meta assets to import into your campaign.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
        {mockMetaAssets.map(asset => (
          <div
            key={asset.id}
            onClick={() => handleAssetToggle(asset)}
            className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all flex flex-col items-center justify-center aspect-square ${
              selectedMetaAssets.find(a => a.id === asset.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {asset.type === 'video' ? <Video className="h-12 w-12 text-gray-400 mb-2" /> : <Image className="h-12 w-12 text-gray-400 mb-2" />}
            <p className="text-xs font-medium text-center truncate w-full">{asset.name}</p>
            {selectedMetaAssets.find(a => a.id === asset.id) && (
              <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                <CheckCircle className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={selectedMetaAssets.length === 0}>
          Add {selectedMetaAssets.length} Asset{selectedMetaAssets.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};

export default MetaAssetPicker;
