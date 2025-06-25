
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdSetFormProps {
  adSetId: number;
  budget: string;
  audience: string;
  onUpdate: (id: number, field: string, value: string) => void;
}

const AdSetForm: React.FC<AdSetFormProps> = ({
  adSetId,
  budget,
  audience,
  onUpdate,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor={`budget-${adSetId}`}>Budget ($)</Label>
        <Input
          id={`budget-${adSetId}`}
          placeholder="e.g., 500"
          value={budget}
          onChange={(e) => onUpdate(adSetId, 'budget', e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`audience-${adSetId}`}>Audience</Label>
        <Input
          id={`audience-${adSetId}`}
          placeholder="e.g., US, 25-45, Interests in..."
          value={audience}
          onChange={(e) => onUpdate(adSetId, 'audience', e.target.value)}
        />
      </div>
    </div>
  );
};

export default AdSetForm;
