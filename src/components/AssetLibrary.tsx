import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Plus, Loader2, ImageIcon, FolderPlus, Globe, Layers } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import FileUpload from "./FileUpload";
import { useAssets } from "@/hooks/useAssets";
import AssetGrid from "./asset-library/AssetGrid";
import AssetList from "./asset-library/AssetList";
import AssetToolbar from "./asset-library/AssetToolbar";
import FolderSidebar from "./asset-library/FolderSidebar";
import { useFolders } from "@/hooks/useFolders";
import { useToast } from "@/hooks/use-toast";
import GoogleDrivePicker from "./campaign-builder/GoogleDrivePicker";
import AIRAssetPicker from "./campaign-builder/AIRAssetPicker";
import type { GoogleFile } from "@/lib/google-api";
import type { CreativeAsset } from "@/types/campaign";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface AssetLibraryProps {
  orgId: string;
  userId: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
}

// Helper function to map GoogleFile mimeType to asset file type
const mapMimeTypeToAssetFileType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'file'; // Default type
};

const AssetLibrary = ({ orgId, userId }: AssetLibraryProps) => {
  // ... keep existing code (state variables)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all'); 
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [isAirPickerOpen, setIsAirPickerOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();

  console.log("AssetLibrary - orgId:", orgId, "userId:", userId);

  const {
    assetsToDisplay,
    isLoadingAssets,
    assetsError,
    handleUploadComplete,
    handleDelete,
    isDeleting,
    deletingAssetId
  } = useAssets(orgId, userId);

  const { folders: dbFolders, isLoadingFolders, createFolder, isCreatingFolder } = useFolders(orgId, userId);

  // ... keep existing code (folders useMemo, useEffect for keyboard shortcuts)
  const folders: Folder[] = useMemo(() => {
    const allAssets = { name: 'All Assets', id: 'all', count: assetsToDisplay.length };
    const fetchedFolders = dbFolders.map(f => {
      const count = assetsToDisplay.filter((a: any) => a.folder_id === f.id).length;
      return { name: f.name, id: f.id, count };
    });
    return [allAssets, ...fetchedFolders];
  }, [dbFolders, assetsToDisplay]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // U = upload
      if (e.key === "u" || e.key === "U") {
        setIsUploadDialogOpen(true);
      }
      // D = dashboard (not implemented here but stub, could trigger tab change)
      // L = asset library (not implemented here but stub)
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ... keep existing code (filteredAssets useMemo, upload handlers)
  const filteredAssets = useMemo(() => {
    let assets = assetsToDisplay;

    if (selectedFolder !== 'all') {
      assets = assets.filter((asset: any) => asset.folder_id === selectedFolder);
    }

    if (searchTerm) {
      assets = assets.filter(asset => {
        const searchableFields = [
          asset.name?.toLowerCase() || "",
          ...(asset.tags?.map((tag: string) => tag.toLowerCase()) || []),
          asset.angle?.toLowerCase() || "",
          asset.hook?.toLowerCase() || "",
          asset.notes?.toLowerCase() || "",
        ];
        return searchableFields.some(str => str.includes(searchTerm.toLowerCase()));
      });
    }
    return assets;
  }, [assetsToDisplay, searchTerm, selectedFolder]);

  const handleUploadCompleteWithDialog = (results: any[]) => {
    handleUploadComplete(results);
    setIsUploadDialogOpen(false);
  };

  const handleDriveFilesSelected = (driveFiles: GoogleFile[]) => {
    // Convert GoogleFile to the format expected by handleUploadComplete
    const mockResults = driveFiles.map(driveFile => ({
      success: true,
      fileName: driveFile.name,
      url: driveFile.thumbnailLink || '/placeholder.svg',
      fileSize: driveFile.size ? parseInt(driveFile.size) : undefined,
      fileType: mapMimeTypeToAssetFileType(driveFile.mimeType),
      width: null,
      height: null,
    }));
    handleUploadComplete(mockResults);
    setIsDrivePickerOpen(false);
    toast({ 
      title: "Assets Imported", 
      description: `${driveFiles.length} asset(s) imported from Google Drive.` 
    });
  };

  const handleAirAssetsSelected = (airAssets: CreativeAsset[]) => {
    // Convert CreativeAsset to the format expected by handleUploadComplete
    const mockResults = airAssets.map(asset => ({
      success: true,
      fileName: asset.name,
      url: asset.preview,
      fileSize: undefined,
      fileType: asset.type,
      width: null,
      height: null,
    }));
    handleUploadComplete(mockResults);
    setIsAirPickerOpen(false);
    toast({ 
      title: "Assets Imported", 
      description: `${airAssets.length} asset(s) imported from AIR.` 
    });
  };
  
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      toast({ title: "Folder name cannot be empty.", variant: 'destructive' });
      return;
    }
    if (!orgId) {
      toast({ title: "Organization ID is required to create a folder.", variant: 'destructive' });
      return;
    }
    if (!userId) {
      toast({ title: "User authentication is required to create a folder.", variant: 'destructive' });
      return;
    }
    
    console.log("Creating folder with name:", newFolderName.trim(), "orgId:", orgId, "userId:", userId);
    createFolder({ name: newFolderName.trim() });
    setNewFolderName('');
    setIsNewFolderDialogOpen(false);
  }

  if (isLoadingAssets || isLoadingFolders) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg">Loading Assets...</p>
      </div>
    );
  }

  if (assetsError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">Error loading assets: {assetsError.message}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['assets', orgId] })} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header with Dark Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Asset Library</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your creative assets and media files</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {/* DARK MODE TOGGLE */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          {/* ... keep existing code (upload dialogs) */}
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Assets
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>Upload New Assets</DialogTitle>
              </DialogHeader>
              <FileUpload orgId={orgId} onUploadComplete={handleUploadCompleteWithDialog} maxFiles={10} />
            </DialogContent>
          </Dialog>

          <Dialog open={isDrivePickerOpen} onOpenChange={setIsDrivePickerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Import from Drive
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>Import from Google Drive</DialogTitle>
              </DialogHeader>
              <GoogleDrivePicker 
                onFilesSelected={handleDriveFilesSelected}
                onClose={() => setIsDrivePickerOpen(false)} 
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isAirPickerOpen} onOpenChange={setIsAirPickerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Layers className="h-4 w-4 mr-2" />
                Import from AIR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Import from AIR</DialogTitle>
              </DialogHeader>
              <AIRAssetPicker
                onAssetsSelected={handleAirAssetsSelected}
                onClose={() => setIsAirPickerOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateFolder}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="folder-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="folder-name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. Summer Campaign"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCreatingFolder}>
                    {isCreatingFolder ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Folder"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Toolbar */}
      <AssetToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Sidebar and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <FolderSidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
        />

        {/* Assets Grid/List */}
        <div className="lg:col-span-3">
          {filteredAssets.length === 0 && !isLoadingAssets && (
            <Card>
              <CardContent className="p-10 text-center">
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Assets Found</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search or upload new assets." : "Upload your first asset to get started!"}
                </p>
                {!searchTerm && (
                   <Button onClick={() => setIsUploadDialogOpen(true)} className="mt-4">
                     <Upload className="h-4 w-4 mr-2" /> Upload Assets
                   </Button>
                )}
              </CardContent>
            </Card>
          )}
          {viewMode === 'grid' && filteredAssets.length > 0 && (
            <AssetGrid
              assets={filteredAssets}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              deletingAssetId={deletingAssetId}
            />
          )}
          {viewMode === 'list' && filteredAssets.length > 0 && (
            <AssetList
              assets={filteredAssets}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              deletingAssetId={deletingAssetId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetLibrary;
