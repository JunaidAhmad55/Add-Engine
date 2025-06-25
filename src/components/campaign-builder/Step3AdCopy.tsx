
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import GoogleDocsPicker, { MockDocContent } from './GoogleDocsPicker'; // Import the new picker
import { useToast } from '@/hooks/use-toast';


interface CopyVariant {
  id: number;
  headline: string;
  primaryText: string;
  cta: string;
}

interface Step3AdCopyProps {
  copyVariants: CopyVariant[];
  addCopyVariant: () => void;
  removeCopyVariant: (id: number) => void;
  updateCopyVariant: (id: number, field: string, value: string) => void;
}

const Step3AdCopy: React.FC<Step3AdCopyProps> = ({
  copyVariants,
  addCopyVariant,
  removeCopyVariant,
  updateCopyVariant,
}) => {
  const [isDocsPickerOpen, setIsDocsPickerOpen] = useState(false);
  const { toast } = useToast();

  const handleDocSelected = (docContent: MockDocContent) => {
    if (copyVariants.length > 0) {
      const firstVariantId = copyVariants[0].id;
      updateCopyVariant(firstVariantId, 'headline', docContent.headline);
      updateCopyVariant(firstVariantId, 'primaryText', docContent.primaryText);
      toast({
        title: "Content Imported",
        description: `Imported content from "${docContent.name}" into the first ad copy variant.`,
      });
    } else {
      // Optionally, handle case where no variants exist, though initial state provides one.
      // For now, we assume at least one variant exists.
      toast({
        title: "Import Failed",
        description: "No ad copy variant available to import content into.",
        variant: "destructive",
      });
    }
    setIsDocsPickerOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Ad Copy Variants</h3>
        <div className="flex gap-2">
          <Dialog open={isDocsPickerOpen} onOpenChange={setIsDocsPickerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Import from Docs
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Import Ad Copy from Document</DialogTitle>
                <DialogDescription>
                  Select a mock document. Its content will populate the headline and primary text of your first ad copy variant.
                </DialogDescription>
              </DialogHeader>
              <GoogleDocsPicker
                onDocSelected={handleDocSelected}
                onClose={() => setIsDocsPickerOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Button onClick={addCopyVariant} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {copyVariants.map((variant, index) => (
          <Card key={variant.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Copy Variant {index + 1}</CardTitle>
                {copyVariants.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCopyVariant(variant.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`headline-${variant.id}`}>Headline</Label>
                <Input
                  id={`headline-${variant.id}`}
                  placeholder="Catchy headline for your ad"
                  value={variant.headline}
                  onChange={(e) => updateCopyVariant(variant.id, 'headline', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`text-${variant.id}`}>Primary Text</Label>
                <Textarea
                  id={`text-${variant.id}`}
                  placeholder="Compelling description that drives action..."
                  value={variant.primaryText}
                  onChange={(e) => updateCopyVariant(variant.id, 'primaryText', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor={`cta-${variant.id}`}>Call-to-Action</Label>
                <Select
                  value={variant.cta}
                  onValueChange={(value) => updateCopyVariant(variant.id, 'cta', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Learn More">Learn More</SelectItem>
                    <SelectItem value="Shop Now">Shop Now</SelectItem>
                    <SelectItem value="Sign Up">Sign Up</SelectItem>
                    <SelectItem value="Get Started">Get Started</SelectItem>
                    <SelectItem value="Download">Download</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Step3AdCopy;
