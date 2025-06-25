
import { Button } from "@/components/ui/button";
import { Loader2, Clipboard, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { uploadImageAndRegisterAsset } from "./godmode-asset";
import { GenerateMode, GodModeResultType } from "./useGodModeGenerate";

interface GodModeResultViewProps {
  result: string | null;
  resultType: GodModeResultType;
  onBack: () => void;
  org_id: string;
  user_id: string;
}

export function GodModeResultView({
  result,
  resultType,
  onBack,
  org_id,
  user_id,
}: GodModeResultViewProps) {
  const [uploading, setUploading] = useState(false);

  const handleCopyText = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      toast({ title: "Ad copy copied to clipboard" });
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleUpload = async () => {
    if (!result || !org_id || !user_id) return;
    setUploading(true);
    await uploadImageAndRegisterAsset({
      result,
      org_id,
      user_id,
      onUploadComplete: () => setUploading(false),
    });
    setUploading(false);
  };

  return (
    <div className="py-4 text-center space-y-4">
      <div className="flex justify-center gap-2 mb-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onBack}
          className="mr-1"
        >
          &larr; Back
        </Button>
        {resultType === "text" && (
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleCopyText}
          >
            <Clipboard className="h-4 w-4" /> Copy Ad Copy
          </Button>
        )}
        {resultType === "image" && (
          <Button
            size="sm"
            variant="default"
            className="flex items-center gap-2"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            Add to Asset Library
          </Button>
        )}
      </div>
      {resultType === "image" && (
        <div>
          <img
            src={`data:image/png;base64,${result}`}
            alt="Generated"
            className="max-w-xs max-h-96 rounded border mx-auto"
          />
        </div>
      )}
      {resultType === "text" && (
        <div className="bg-gray-100 rounded p-4 text-left font-mono text-sm whitespace-pre-line max-h-80 overflow-y-auto">
          {result}
        </div>
      )}
    </div>
  );
}
