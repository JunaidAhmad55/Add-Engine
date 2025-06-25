import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { airApiService, type AIRAsset } from '@/lib/air-api';
import { Loader2, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import type { CreativeAsset } from '@/types/campaign';
import AIRAssetComments from "./AIRAssetComments";

interface AIRAssetPickerProps {
  onAssetsSelected: (assets: CreativeAsset[]) => void;
  onClose: () => void;
}

const getAssetIcon = (type: 'image' | 'video') => {
  if (type === 'image') return <ImageIcon className="h-5 w-5 text-blue-500" />;
  if (type === 'video') return <VideoIcon className="h-5 w-5 text-green-500" />;
  return null;
};

const AIRAssetPicker: React.FC<AIRAssetPickerProps> = ({ onAssetsSelected, onClose }) => {
  const [assets, setAssets] = useState<AIRAsset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<AIRAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsOpenId, setCommentsOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);

      if (!airApiService.isConnected()) {
        airApiService.getStoredApiKey(); // Try to load from storage
      }

      if (!airApiService.isConnected()) {
         setError('Not connected to AIR. Please connect your AIR account in Settings > Integrations.');
         setIsLoading(false);
         return;
      }
      
      const result = await airApiService.getAssets();
      if (result.success && result.assets) {
        setAssets(result.assets);
      } else {
        setError(result.error || 'Failed to fetch assets from AIR.');
      }
      setIsLoading(false);
    };

    fetchAssets();
  }, []);

  const handleAssetToggle = (asset: AIRAsset) => {
    setSelectedAssets(prev =>
      prev.find(a => a.id === asset.id)
        ? prev.filter(a => a.id !== asset.id)
        : [...prev, asset]
    );
  };

  const handleImport = () => {
    const creativeAssets: CreativeAsset[] = selectedAssets.map(asset => ({
        id: `air-${asset.id}`,
        name: asset.name,
        type: asset.type,
        preview: asset.previewUrl,
        tags: asset.tags || [],
    }));
    onAssetsSelected(creativeAssets);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2">Loading AIR assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
        <Button onClick={onClose} variant="outline" className="mt-4">Close</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Select assets to import from your AIR workspace.</p>
      <ScrollArea className="h-72 w-full rounded-md border p-4">
        {assets.length === 0 ? (
          <p className="text-center text-gray-500">No assets found in AIR.</p>
        ) : (
          <ul className="space-y-2">
            {assets.map(asset => (
              <li
                key={asset.id}
                className="flex flex-col gap-1 p-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleAssetToggle(asset)}>
                  <Checkbox
                    id={`asset-${asset.id}`}
                    checked={selectedAssets.some(a => a.id === asset.id)}
                    onCheckedChange={() => handleAssetToggle(asset)}
                  />
                  {getAssetIcon(asset.type)}
                  <label htmlFor={`asset-${asset.id}`} className="flex-grow text-sm font-medium truncate cursor-pointer">
                    {asset.name}
                  </label>
                  <button
                    className="text-xs px-2 py-0.5 rounded hover:bg-gray-100 border ml-2"
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setCommentsOpenId(commentsOpenId === asset.id ? null : asset.id);
                    }}
                  >
                    {commentsOpenId === asset.id ? "Hide Comments" : "View Comments"}
                  </button>
                </div>
                {commentsOpenId === asset.id && (
                  <AIRAssetComments assetId={asset.id} />
                )}
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleImport} disabled={selectedAssets.length === 0}>
          Import {selectedAssets.length > 0 ? `${selectedAssets.length} asset(s)` : ''}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AIRAssetPicker;
