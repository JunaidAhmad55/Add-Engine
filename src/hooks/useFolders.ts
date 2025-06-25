
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/database";
import type { CreateAssetFolderPayload } from "@/lib/services/asset-folder-service";
import type { AssetFolder } from "@/lib/db-types";

export const useFolders = (orgId: string, userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log("useFolders - orgId:", orgId, "userId:", userId);

  const { data: folders, isLoading: isLoadingFolders, error: foldersError } = useQuery<AssetFolder[], Error>({
    queryKey: ['asset_folders', orgId],
    queryFn: () => {
      console.log("Fetching folders for orgId:", orgId);
      return db.getAssetFoldersByOrg(orgId);
    },
    enabled: !!orgId,
  });

  const createFolderMutation = useMutation<AssetFolder, Error, { name: string }>({
    mutationFn: ({ name }) => {
      if (!userId) {
        console.error("No userId provided for folder creation");
        throw new Error("User must be logged in to create a folder.");
      }
      if (!orgId) {
        console.error("No orgId provided for folder creation");
        throw new Error("Organization ID is required to create a folder.");
      }
      
      const payload: CreateAssetFolderPayload = {
        name,
        org_id: orgId,
        user_id: userId,
      };
      
      console.log("Creating folder with payload:", payload);
      return db.createAssetFolder(payload);
    },
    onSuccess: (newFolder) => {
      console.log("Folder created successfully:", newFolder);
      queryClient.invalidateQueries({ queryKey: ['asset_folders', orgId] });
      toast({ title: "Folder Created", description: `Folder "${newFolder.name}" has been created.` });
    },
    onError: (error) => {
      console.error("Error creating folder:", error);
      toast({ title: "Error Creating Folder", description: error.message, variant: "destructive" });
    },
  });

  return {
    folders: folders || [],
    isLoadingFolders,
    foldersError,
    createFolder: createFolderMutation.mutate,
    isCreatingFolder: createFolderMutation.isPending,
  };
};
