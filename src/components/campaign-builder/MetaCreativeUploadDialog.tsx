
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface MetaCreativeUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MetaCreativeUploadDialog: React.FC<MetaCreativeUploadDialogProps> = ({ open, onOpenChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Meta Creative Upload",
      description: "Uploading creatives directly to Meta is not yet supported in this workspace! This is planned soon.",
      variant: "destructive"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Upload Creative to Meta</DialogTitle>
          <DialogDescription>
            This feature will let you upload images/videos directly to Meta’s Ad Library for campaign use.
            <br />
            <span className="text-red-600 font-medium">Coming soon: direct upload to Meta via API.</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <Input 
            type="file" 
            accept="image/*,video/*"
            disabled
            onChange={handleFileChange}
            className="disabled:opacity-70"
          />
          <p className="text-xs text-gray-500">
            For now, uploading to Meta is disabled. You can use import or local upload instead.
          </p>
          <DialogFooter>
            <Button type="submit" disabled>
              Upload&nbsp;(Coming Soon)
            </Button>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MetaCreativeUploadDialog;
