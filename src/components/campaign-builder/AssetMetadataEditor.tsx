
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save as SaveIcon } from "lucide-react";
import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import type { CreativeAsset } from "@/types/campaign";

interface AssetMetadataEditorProps {
  asset: CreativeAsset;
}

const AssetMetadataEditor: React.FC<AssetMetadataEditorProps> = ({ asset }) => {
  const [angle, setAngle] = useState(asset.angle || "");
  const [hook, setHook] = useState(asset.hook || "");
  const [notes, setNotes] = useState(asset.notes || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveMetadata = async () => {
    setSaving(true);
    try {
      // MVP: org_id may not always be present
      // @ts-ignore
      await db.updateAssetMetadata(asset.id, { angle, hook, notes }, asset.org_id || "");
      toast({ title: "Saved!", description: "Asset details saved." });
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message || "Could not save metadata", variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Angle"
        value={angle}
        onChange={e => setAngle(e.target.value)}
        className="h-8 text-xs"
      />
      <Input
        type="text"
        placeholder="Hook"
        value={hook}
        onChange={e => setHook(e.target.value)}
        className="h-8 text-xs"
      />
      <Textarea
        placeholder="Notes"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="h-16 text-xs"
      />
      <Button
        onClick={handleSaveMetadata}
        disabled={saving}
        size="sm"
        className="mt-2 self-end"
      >
        {saving ? (
          <>
            <SaveIcon className="w-4 h-4 animate-spin mr-2" />Saving...
          </>
        ) : (
          <>
            <SaveIcon className="w-4 h-4 mr-2" />Save
          </>
        )}
      </Button>
    </div>
  );
};

export default AssetMetadataEditor;
