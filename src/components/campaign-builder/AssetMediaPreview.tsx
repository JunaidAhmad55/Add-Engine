
import React from "react";
import { Video as VideoIcon } from "lucide-react";
import type { CreativeAsset } from "@/types/campaign";

interface AssetMediaPreviewProps {
  asset: CreativeAsset;
  onClick?: () => void;
}

const AssetMediaPreview: React.FC<AssetMediaPreviewProps> = ({ asset, onClick }) => (
  <div
    className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    {asset.type === 'video' && !asset.preview.startsWith('data:') && !asset.preview.includes('placeholder') ? (
      <VideoIcon className="h-16 w-16 text-gray-400" />
    ) : (
      <img src={asset.preview} alt={asset.name} className="w-full h-full object-cover rounded" />
    )}
  </div>
);

export default AssetMediaPreview;
