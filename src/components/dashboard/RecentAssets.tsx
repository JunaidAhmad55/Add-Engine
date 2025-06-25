
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, Video, FileText } from "lucide-react";
import { fileUploadService } from "@/lib/file-upload";

export interface RecentAsset {
    name: string;
    type: ReturnType<typeof fileUploadService.getFileType>;
    size: string;
    date: string;
}

interface RecentAssetsProps {
  assets: RecentAsset[];
  isLoading: boolean;
}

const RecentAssets = ({ assets, isLoading }: RecentAssetsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-green-600" />
          Recent Assets
        </CardTitle>
        <CardDescription>Latest uploads to your asset library</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && [...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
        {!isLoading && assets.length > 0 && assets.map((asset) => (
          <div key={asset.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {asset.type === 'image' && <Image className="h-4 w-4 text-blue-500" />}
              {asset.type === 'video' && <Video className="h-4 w-4 text-purple-500" />}
              {(asset.type === 'document' || asset.type === 'archive' || asset.type === 'pdf' || asset.type === 'text') && <FileText className="h-4 w-4 text-gray-500" />}
              <div>
                <p className="font-medium text-gray-900 text-sm truncate w-48" title={asset.name}>{asset.name}</p>
                <p className="text-xs text-gray-500">{asset.size}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">{asset.date}</span>
          </div>
        ))}
         {!isLoading && assets.length === 0 && (
            <div className="text-center p-4 text-sm text-gray-500">
                No recent assets to show.
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAssets;
