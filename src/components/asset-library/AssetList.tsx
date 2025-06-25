
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Loader2 } from "lucide-react";
import type { AssetDisplayType } from "@/types/asset-types";
import { getFileIcon } from "@/lib/asset-utils";

interface AssetListProps {
  assets: AssetDisplayType[];
  onDelete: (assetId: string, assetName: string) => void;
  isDeleting: boolean;
  deletingAssetId?: string;
}

const AssetList = ({ assets, onDelete, isDeleting, deletingAssetId }: AssetListProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {assets.map((asset) => (
            <div key={asset.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {asset.displayType === 'image' || asset.displayType === 'video' ? (
                        <img src={asset.preview} alt={asset.name} className="w-full h-full object-cover rounded-lg" onError={(e) => (e.currentTarget.src = '/placeholder.svg')} />
                    ) : (
                        getFileIcon(asset.displayType)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate" title={asset.name}>{asset.name}</p>
                    <p className="text-sm text-gray-500">
                      {asset.size} • {asset.uploadDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                  <div className="hidden sm:flex flex-wrap gap-1">
                    {(asset.tags || []).slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-1">
                     <Button size="icon" variant="ghost" title="Download (not implemented)" disabled>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      title="Delete Asset" 
                      onClick={() => onDelete(asset.id, asset.name)} 
                      disabled={isDeleting && deletingAssetId === asset.id}
                      className="text-red-500 hover:text-red-700"
                    >
                       {isDeleting && deletingAssetId === asset.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetList;
