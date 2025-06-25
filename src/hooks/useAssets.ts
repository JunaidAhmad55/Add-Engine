import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/database";
import type { Asset as SupabaseAsset, AssetFileType } from "@/lib/db-types";
import type { CreateAssetPayload } from "@/lib/services/asset-service";
import type { AssetDisplayType } from "@/types/asset-types";
import { fileUploadService, type UploadResult } from "@/lib/file-upload";

const mapSupabaseAssetToDisplayType = (asset: SupabaseAsset): AssetDisplayType => {
  const sizeInMB = asset.size_bytes ? (asset.size_bytes / 1024 / 1024).toFixed(2) + " MB" : "N/A";
  const uploadDate = asset.created_at ? new Date(asset.created_at).toLocaleDateString() : "N/A";
  
  let displayType: AssetDisplayType['displayType'] = 'other'; 

  if (asset.file_type === 'image') {
    displayType = 'image';
  } else if (asset.file_type === 'video') {
    displayType = 'video';
  } else if (asset.file_type === 'pdf') {
    displayType = 'pdf';
  } else if (asset.file_type === 'file') { // Assuming 'file' is a generic type in your AssetFileType enum
    // Try to determine a more specific display type from the filename
    const guessedDisplayTypeFromFile = fileUploadService.getFileType(asset.filename);
    if (['image', 'video', 'pdf', 'document', 'archive', 'text'].includes(guessedDisplayTypeFromFile)) {
      displayType = guessedDisplayTypeFromFile as AssetDisplayType['displayType'];
    } else {
      displayType = 'document'; // Default to 'document' for generic 'file' type if specific guess fails
    }
  }
  // If asset.file_type is something else or null, displayType remains 'other'

  return {
    id: asset.id,
    name: asset.filename,
    type: asset.file_type, // This is the original AssetFileType from DB
    displayType: displayType, // This is for UI representation
    size: sizeInMB,
    tags: asset.tags || [],
    uploadDate: uploadDate,
    preview: asset.url || "/placeholder.svg",
    width: asset.width,
    height: asset.height,
    folder_id: asset.folder_id,
    angle: asset.angle || "",
    hook: asset.hook || "",
    notes: asset.notes || "",
  } as any;
};

const mapUploadResultToAssetFileType = (fileName: string): AssetFileType => {
  const serviceFileType = fileUploadService.getFileType(fileName);
  switch (serviceFileType) {
    case 'image': return 'image';
    case 'video': return 'video';
    case 'pdf': return 'pdf';
    // All other specific types from fileUploadService map to 'file' for AssetFileType
    case 'document':
    case 'archive':
    case 'text':
    case 'other':
    default:
      return 'file'; // Assuming 'file' is a valid AssetFileType for generic files
  }
};

export const useAssets = (orgId: string, userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: supabaseAssets, isLoading: isLoadingAssets, error: assetsError } = useQuery<SupabaseAsset[], Error>({
    queryKey: ['assets', orgId],
    queryFn: () => db.getAssetsByOrg(orgId),
    enabled: !!orgId,
  });

  const createAssetMutation = useMutation<SupabaseAsset, Error, CreateAssetPayload>({
    mutationFn: db.createAsset,
    onSuccess: (newAsset) => {
      queryClient.invalidateQueries({ queryKey: ['assets', orgId] });
      toast({ title: "Asset Created", description: `${newAsset.filename} added to your library.` });
    },
    onError: (error) => {
      toast({ title: "Error Creating Asset", description: error.message, variant: "destructive" });
    },
  });

  const deleteAssetMutation = useMutation<void, Error, { assetId: string; assetName: string }>({
    mutationFn: ({ assetId }) => db.deleteAsset(assetId, orgId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets', orgId] });
      toast({ title: "Asset Deleted", description: `${variables.assetName} has been removed.` });
    },
    onError: (error) => {
      toast({ title: "Error Deleting Asset", description: error.message, variant: "destructive" });
    },
  });

  const handleUploadComplete = (results: UploadResult[]) => {
    let successfulCount = 0;
    results.forEach(result => {
      if (result.success && result.fileName && result.url) {
        const payload: CreateAssetPayload = {
          filename: result.fileName,
          file_type: mapUploadResultToAssetFileType(result.fileName),
          url: result.url,
          tags: [], 
          user_id: userId,
          org_id: orgId,
          size_bytes: result.fileSize,
          width: result.width || null,
          height: result.height || null,
        };
        createAssetMutation.mutate(payload);
        successfulCount++;
      } else if (!result.success) {
        toast({
            title: "Individual Upload Failed",
            description: `Could not process ${result.fileName || 'a file'}: ${result.error || 'Unknown error'}`,
            variant: "destructive"
        });
      }
    });
  };
  
  const handleDelete = (assetId: string, assetName: string) => {
    if (deleteAssetMutation.isPending) return;
    deleteAssetMutation.mutate({ assetId, assetName });
  };

  const assetsToDisplay = supabaseAssets?.map(mapSupabaseAssetToDisplayType) || [];

  return {
    assetsToDisplay,
    isLoadingAssets,
    assetsError,
    handleUploadComplete,
    handleDelete,
    isDeleting: deleteAssetMutation.isPending,
    deletingAssetId: deleteAssetMutation.variables?.assetId
  };
};
