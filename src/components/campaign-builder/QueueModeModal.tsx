
import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAspectRatioGroup } from "@/lib/asset-utils";
import type { CreativeAsset, AdSet } from "@/types/campaign";
import { CheckCircle } from "lucide-react";

interface QueueModeModalProps {
  open: boolean;
  onClose: () => void;
  availableAssets: CreativeAsset[];
  adSets: AdSet[];
  onDistribute: (assignments: { [adSetId: number]: CreativeAsset[] }) => void;
}

const groupNames = ['1:1 (Square)', '4:5 (Vertical)', '9:16 (Vertical)', '16:9 (Landscape)', 'Other'];

const QueueModeModal: React.FC<QueueModeModalProps> = ({
  open,
  onClose,
  availableAssets,
  adSets,
  onDistribute
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [previewAssign, setPreviewAssign] = useState<{ [adSetId: number]: CreativeAsset[] }>({});
  const [completed, setCompleted] = useState(false);

  // Group assets by aspect ratio
  const groupedAssets = useMemo(() => {
    const grouping: Record<string, CreativeAsset[]> = {};
    for (const asset of availableAssets) {
      const group = getAspectRatioGroup(asset.width, asset.height);
      if (!grouping[group]) grouping[group] = [];
      grouping[group].push(asset);
    }
    return grouping;
  }, [availableAssets]);

  // Show group choices
  const groupOptions = groupNames.filter((group) => groupedAssets[group]?.length);

  // Map ad sets by group: choose target ad sets for each group
  const adSetGroups = useMemo(() => {
    // Suggest: if ad set name matches group, pre-select it
    const mapping: Record<string, AdSet[]> = {};
    for (const group of groupOptions) {
      mapping[group] = adSets.filter(set =>
        (set.name || "").toLowerCase().includes(group.toLowerCase().split(" ")[0])
      );
      if (mapping[group].length === 0)
        mapping[group] = adSets; // Fallback: suggest all
    }
    return mapping;
  }, [groupOptions, adSets]);

  // User selects which ad set(s) for this group of assets
  const [adSetSelections, setAdSetSelections] = useState<{ [group: string]: number[] }>({});

  const toggleAdSetForGroup = (group: string, adSetId: number) => {
    setAdSetSelections(sel => ({
      ...sel,
      [group]: sel[group]?.includes(adSetId)
        ? sel[group].filter(id => id !== adSetId)
        : [...(sel[group] || []), adSetId]
    }));
  };

  // Preview assignments
  const previewAssignments = useMemo(() => {
    const assignments: { [adSetId: number]: CreativeAsset[] } = {};
    for (const group of groupOptions) {
      const assets = groupedAssets[group] || [];
      const selected = adSetSelections[group] || [];
      for (const setId of selected) {
        assignments[setId] = (assignments[setId] || []).concat(assets);
      }
    }
    return assignments;
  }, [adSetSelections, groupedAssets, groupOptions]);

  // Confirm logic
  const handleAssign = () => {
    setCompleted(true);
    onDistribute(previewAssignments);
    setTimeout(() => {
      setCompleted(false);
      onClose();
      setAdSetSelections({});
    }, 1300);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Queue Mode: Distribute Assets to Ad Sets</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <p>
            <strong>How it works:</strong> Select an asset group (by aspect ratio), pick which ad sets they should be distributed to, then assign all in one click.
          </p>
          {groupOptions.length ? (
            groupOptions.map((group) =>
              <div key={group} className="border rounded px-3 py-2 mb-2">
                <div className="font-semibold">{group} <span className="text-xs text-gray-500">({groupedAssets[group].length} assets)</span></div>
                <div className="flex flex-wrap gap-2 py-1">
                  {adSets.map(adSet =>
                    <Button
                      key={adSet.id}
                      variant={adSetSelections[group]?.includes(adSet.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleAdSetForGroup(group, adSet.id)}
                    >
                      {adSetSelections[group]?.includes(adSet.id) && <CheckCircle className="w-4 h-4 mr-1" />}
                      {adSet.name}
                    </Button>
                  )}
                </div>
              </div>
            )
          ) : (
            <div>No asset groups found. Make sure you have uploaded images/videos with different aspect ratios.</div>
          )}

          <div>
            <strong>Preview:</strong>
            <ul className="text-sm pl-4 list-disc">
              {Object.entries(previewAssignments).map(([adSetId, assets]) => (
                <li key={adSetId}>
                  Ad Set <b>{adSets.find(a => a.id === +adSetId)?.name || adSetId}</b>: {assets.length} assets
                </li>
              ))}
              {Object.keys(previewAssignments).length === 0 && <li>No assignments yet.</li>}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleAssign}
            disabled={Object.keys(previewAssignments).length === 0}
            variant="default"
          >
            Assign to Ad Sets
          </Button>
          <Button onClick={onClose} variant="ghost">Cancel</Button>
        </DialogFooter>
        {completed && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-80">
            <CheckCircle className="text-green-600 w-8 h-8 mb-2" />
            <div className="text-green-700 font-bold">Assets Assigned!</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QueueModeModal;
