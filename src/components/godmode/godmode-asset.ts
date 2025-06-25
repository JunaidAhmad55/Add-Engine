
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function uploadImageAndRegisterAsset({
  result,
  org_id,
  user_id,
  onUploadComplete,
}: {
  result: string;
  org_id: string;
  user_id: string;
  onUploadComplete?: () => void;
}) {
  // Prepare base64 data for upload
  try {
    const byteString = atob(result);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([intArray], { type: "image/png" });
    const bucket = "ai-assets";
    const filename = `godmode_${Date.now()}.png`;

    // @ts-ignore
    let uploadRes = await supabase.storage.from(bucket).upload(filename, blob, {
      contentType: "image/png",
      upsert: false,
    });

    if (uploadRes.error && uploadRes.error.message?.includes("The resource was not found") && supabase.storage?.createBucket) {
      await supabase.storage.createBucket(bucket, { public: true });
      uploadRes = await supabase.storage.from(bucket).upload(filename, blob, {
        contentType: "image/png",
        upsert: false,
      });
    }

    if (uploadRes.error) throw new Error(`Upload failed: ${uploadRes.error.message}`);

    // @ts-ignore
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename);
    if (!publicUrl) throw new Error("Could not get image URL");

    const size_bytes = blob.size;

    await import("@/lib/services/asset-service").then(async (module) => {
      await module.createAsset({
        filename,
        file_type: "image",
        url: publicUrl,
        user_id,
        org_id,
        size_bytes,
        width: null,
        height: null,
      });
    });

    toast({
      title: "Uploaded to Asset Library",
      description: filename,
    });

    if (onUploadComplete) onUploadComplete();
  } catch (e: any) {
    toast({
      title: "Failed to Upload Image",
      description: e.message,
      variant: "destructive",
    });
  }
}
