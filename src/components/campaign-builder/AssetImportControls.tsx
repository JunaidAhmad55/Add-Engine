import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Upload, Layers, Facebook, Film } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from '@/components/FileUpload';
import type { CreativeAsset } from '@/types/campaign';
import GoogleDrivePicker from './GoogleDrivePicker';
import type { GoogleFile } from '@/lib/google-api';
import TikTokAssetPicker from './TikTokAssetPicker';
import AIRAssetPicker from './AIRAssetPicker';
import MetaAssetPicker from './MetaAssetPicker';
import MetaCreativeUploadDialog from "./MetaCreativeUploadDialog";
import { useToast } from "@/hooks/use-toast";
import { incrementAssetImportAnalytics } from "@/lib/asset-import-analytics";

// Helper function to map GoogleFile mimeType to CreativeAsset type
const mapMimeTypeToAssetType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/zip') return 'zip';
  return 'file'; // Default type
};

interface AssetImportControlsProps {
  onAssetsUploaded: (assets: CreativeAsset[]) => void;
}

const AssetImportControls: React.FC<AssetImportControlsProps> = ({ onAssetsUploaded }) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [isTikTokPickerOpen, setIsTikTokPickerOpen] = useState(false);
  const [isAirPickerOpen, setIsAirPickerOpen] = useState(false);
  const [isMetaPickerOpen, setIsMetaPickerOpen] = useState(false);
  const [isMetaCreativeUploadOpen, setIsMetaCreativeUploadOpen] = useState(false);

  const { toast } = useToast();

  const notifyImport = (count: number, source: string) => {
    if (count === 0) return; // Don't show toast if nothing was imported
    toast({
      title: `Assets Imported`,
      description: `Successfully imported ${count} asset${count === 1 ? '' : 's'} from ${source}.`,
    });
  };

  const handleUploadComplete = (uploadedFiles: any[]) => {
    const newAssets: CreativeAsset[] = uploadedFiles.map(file => ({
      id: file.id.toString(),
      name: file.filename,
      type: file.fileType,
      preview: file.url,
      tags: [],
    }));
    onAssetsUploaded(newAssets);
    setIsUploadDialogOpen(false);
    notifyImport(newAssets.length, "Upload");
    incrementAssetImportAnalytics("Upload", newAssets.length);
  };

  const handleDriveFilesSelected = (driveFiles: GoogleFile[]) => {
    const newAssets: CreativeAsset[] = driveFiles.map(driveFile => ({
      id: `drive-${driveFile.id}`,
      name: driveFile.name,
      type: mapMimeTypeToAssetType(driveFile.mimeType),
      preview: driveFile.thumbnailLink || '/placeholder.svg',
      tags: [],
    }));
    onAssetsUploaded(newAssets);
    setIsDrivePickerOpen(false);
    notifyImport(newAssets.length, "Google Drive");
    incrementAssetImportAnalytics("Google Drive", newAssets.length);
  };

  const handleTikTokAssetsSelected = (tiktokAssets: CreativeAsset[]) => {
    const newAssets: CreativeAsset[] = tiktokAssets.map(asset => ({
      ...asset,
      id: `tiktok-${asset.id}`,
      tags: asset.tags || [],
    }));
    onAssetsUploaded(newAssets);
    setIsTikTokPickerOpen(false);
    notifyImport(newAssets.length, "TikTok");
    incrementAssetImportAnalytics("TikTok", newAssets.length);
  };

  const handleAirAssetsSelected = (airAssets: CreativeAsset[]) => {
    const newAssets: CreativeAsset[] = airAssets.map(asset => ({
      ...asset,
      id: `air-${asset.id}`,
      tags: asset.tags || [],
    }));
    onAssetsUploaded(newAssets);
    setIsAirPickerOpen(false);
    notifyImport(newAssets.length, "AIR");
    incrementAssetImportAnalytics("AIR", newAssets.length);
  };

  const handleMetaAssetsSelected = (metaAssets: CreativeAsset[]) => {
    const newAssets: CreativeAsset[] = metaAssets.map(asset => ({
      ...asset,
      id: `meta-${asset.id}`,
      tags: asset.tags || [],
    }));
    onAssetsUploaded(newAssets);
    setIsMetaPickerOpen(false);
    notifyImport(newAssets.length, "Meta");
    incrementAssetImportAnalytics("Meta", newAssets.length);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {/* AIR Import Dialog */}
      <Dialog open={isAirPickerOpen} onOpenChange={setIsAirPickerOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Layers className="h-4 w-4 mr-2" />
            Import from AIR
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import from AIR</DialogTitle>
            <DialogDescription>
              Select creative assets from your AIR workspace.
            </DialogDescription>
          </DialogHeader>
          <AIRAssetPicker
            onAssetsSelected={handleAirAssetsSelected}
            onClose={() => setIsAirPickerOpen(false)}
          />
        </DialogContent>
      </Dialog>
    
      {/* Meta Import Dialog */}
      <Dialog open={isMetaPickerOpen} onOpenChange={setIsMetaPickerOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Facebook className="h-4 w-4 mr-2" />
            Import from Meta
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import from Meta</DialogTitle>
            <DialogDescription>
              Select creative assets from your Meta Ads library.
            </DialogDescription>
          </DialogHeader>
          <MetaAssetPicker
            onAssetsSelected={handleMetaAssetsSelected}
            onClose={() => setIsMetaPickerOpen(false)}
          />
          <div className="text-right mt-4">
            <Button
              size="sm"
              variant="default"
              className="bg-blue-600 text-white"
              onClick={() => setIsMetaCreativeUploadOpen(true)}
              type="button"
            >
              Upload to Meta (Coming Soon)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* TikTok Import Dialog */}
      <Dialog open={isTikTokPickerOpen} onOpenChange={setIsTikTokPickerOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Film className="h-4 w-4 mr-2" />
            Import from TikTok
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import from TikTok</DialogTitle>
            <DialogDescription>
              Select video assets from TikTok.
            </DialogDescription>
          </DialogHeader>
          <TikTokAssetPicker 
            onAssetsSelected={handleTikTokAssetsSelected}
            onClose={() => setIsTikTokPickerOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Google Drive Import Dialog */}
      <Dialog open={isDrivePickerOpen} onOpenChange={setIsDrivePickerOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Globe className="h-4 w-4 mr-2" />
            Import from Drive
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Import from Google Drive</DialogTitle>
            <DialogDescription>
              Select files from your Google Drive. These files will be shown as available assets.
            </DialogDescription>
          </DialogHeader>
          <GoogleDrivePicker 
            onFilesSelected={handleDriveFilesSelected}
            onClose={() => setIsDrivePickerOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Local File Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Upload Creative Assets</DialogTitle>
          </DialogHeader>
          <FileUpload
            orgId="org-1"
            onUploadComplete={handleUploadComplete}
            maxFiles={10}
          />
        </DialogContent>
      </Dialog>

      {/* Meta Creative Upload Dialog */}
      <MetaCreativeUploadDialog
        open={isMetaCreativeUploadOpen}
        onOpenChange={setIsMetaCreativeUploadOpen}
      />
    </div>
  );
};

export default AssetImportControls;
