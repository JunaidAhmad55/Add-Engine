
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BulkAddAdSetsModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (count: number) => void;
}

const BulkAddAdSetsModal: React.FC<BulkAddAdSetsModalProps> = ({ open, onClose, onAdd }) => {
  const [count, setCount] = useState(2);

  const handleAdd = () => {
    if (count >= 2 && count <= 20) {
      onAdd(count);
      setCount(2);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Add Ad Sets</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="adSetCount" className="block text-sm font-medium">
              Number of ad sets to add (2–20)
            </label>
            <input
              id="adSetCount"
              type="number"
              min={2}
              max={20}
              value={count}
              onChange={e => setCount(Math.max(2, Math.min(20, Number(e.target.value))))}
              className="mt-1 block w-20 rounded border border-gray-300 px-2 py-1 text-center"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={count < 2 || count > 20}>
            Add {count} Ad Sets
          </Button>
          <Button onClick={onClose} variant="ghost">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAddAdSetsModal;
