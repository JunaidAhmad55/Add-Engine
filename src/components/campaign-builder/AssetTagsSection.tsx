
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X as XIcon, PlusCircle } from "lucide-react";

interface AssetTagsSectionProps {
  assetId: string;
  tags: string[];
  onAddTag: (assetId: string, tag: string) => void;
  onRemoveTag: (assetId: string, tag: string) => void;
}

const AssetTagsSection: React.FC<AssetTagsSectionProps> = ({
  assetId,
  tags,
  onAddTag,
  onRemoveTag,
}) => {
  const [tagInputValue, setTagInputValue] = useState('');

  const handleAddTag = () => {
    const trimmedTag = tagInputValue.trim();
    if (trimmedTag) {
      onAddTag(assetId, trimmedTag);
      setTagInputValue('');
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap gap-1 min-h-[22px]">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              onClick={() => onRemoveTag(assetId, tag)}
              className="ml-1 p-0.5 rounded-full hover:bg-gray-300"
              aria-label={`Remove tag ${tag}`}
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Add tag..."
          value={tagInputValue}
          onChange={(e) => setTagInputValue(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { handleAddTag(); e.preventDefault(); } }}
          className="h-8 text-xs flex-grow"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleAddTag}
          className="h-8 w-8"
          aria-label="Add tag"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AssetTagsSection;
