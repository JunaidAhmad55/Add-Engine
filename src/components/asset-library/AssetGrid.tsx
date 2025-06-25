
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Loader2 } from "lucide-react";
import type { AssetDisplayType } from "@/types/asset-types";
import { getFileIcon } from "@/lib/asset-utils";

interface AssetGridProps {
  assets: AssetDisplayType[];
  onDelete: (assetId: string, assetName: string) => void;
  isDeleting: boolean;
  deletingAssetId?: string;
}

const AssetGrid = ({ assets, onDelete, isDeleting, deletingAssetId }: AssetGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <Card key={asset.id} className="group hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
              {asset.displayType === 'image' || asset.displayType === 'video' ? (
                <img
                  src={asset.preview}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                   {getFileIcon(asset.displayType)}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button size="icon" variant="secondary" title="Download (not implemented)" disabled className="bg-white/80 hover:bg-white">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    title="Delete Asset" 
                    onClick={() => onDelete(asset.id, asset.name)} 
                    disabled={isDeleting && deletingAssetId === asset.id}
                    className="bg-red-500/80 hover:bg-red-500 text-white"
                  >
                    {isDeleting && deletingAssetId === asset.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getFileIcon(asset.displayType)}
                <p className="font-medium text-sm truncate" title={asset.name}>{asset.name}</p>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{asset.size}</span>
                <span>{asset.uploadDate}</span>
              </div>
              <div className="flex flex-wrap gap-1 min-h-[22px]">
                {(asset.tags || []).slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {asset.tags && asset.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{asset.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AssetGrid;
