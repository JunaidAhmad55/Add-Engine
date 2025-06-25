
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Copy } from 'lucide-react';

interface AdSetHeaderProps {
  adSetId: number;
  name: string;
  processedName: string;
  onUpdate: (id: number, field: string, value: string) => void;
  onRemove: (id: number) => void;
  onDuplicate: (id: number) => void;
}

const AdSetHeader: React.FC<AdSetHeaderProps> = ({
  adSetId,
  name,
  processedName,
  onUpdate,
  onRemove,
  onDuplicate,
}) => {
  return (
    <div className="flex flex-row items-center justify-between bg-gray-50 p-4">
      <div className="flex-grow mr-2">
        <Input
          value={name}
          onChange={(e) => onUpdate(adSetId, 'name', e.target.value)}
          className="text-lg font-semibold w-full border-0 shadow-none focus-visible:ring-0 bg-transparent p-0"
          placeholder="Ad Set Name, e.g. US - {{campaign.objective}}"
        />
        <p className="text-xs text-gray-500 mt-1">
          Preview: <span className="font-medium text-gray-700">{processedName}</span>
        </p>
      </div>
      <div className="flex items-center flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={() => onDuplicate(adSetId)} title="Duplicate Ad Set">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onRemove(adSetId)} title="Remove Ad Set">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdSetHeader;
