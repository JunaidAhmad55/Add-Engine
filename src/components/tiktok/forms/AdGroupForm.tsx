
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdGroupFormProps {
  formState: {
    name: string;
    status: string;
    daily_budget: string;
    targeting_countries: string;
  };
  errors: any;
  editing: any;
  onSubmit: (e: React.FormEvent) => void;
  onInput: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  nameInputRef: React.RefObject<HTMLInputElement>;
}

const AdGroupForm: React.FC<AdGroupFormProps> = ({
  formState,
  errors,
  editing,
  onSubmit,
  onInput,
  nameInputRef,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-2 my-2">
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="adgroup-name" className="font-medium">Ad Group Name</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>This field is <span className="font-bold">required</span>.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          name="name"
          id="adgroup-name"
          placeholder="Ad Group Name"
          value={formState.name}
          onChange={onInput}
          ref={nameInputRef}
          required
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="adgroup-status" className="font-medium">Status</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>
                <span className="font-bold">Active</span>: Runs ads<br />
                <span className="font-bold">Paused</span>: Temporarily stops<br />
                <span className="font-bold">Archived</span>: Hidden/not served
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <select name="status" id="adgroup-status" value={formState.status} onChange={onInput} className="w-full border px-2 py-1 rounded">
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="daily_budget" className="font-medium">Daily Budget</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>Must be greater than <span className="font-bold">0</span>. How much you'll spend daily on this Ad Group.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input name="daily_budget" id="daily_budget" type="number" placeholder="Daily Budget" value={formState.daily_budget} onChange={onInput} min={1} aria-invalid={!!errors.daily_budget} />
        {errors.daily_budget && <p className="text-red-500 text-xs mt-1">{errors.daily_budget}</p>}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="targeting_countries" className="font-medium">Targeting Countries</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>
                Comma-separated list (e.g. US, CA). Leave blank for all.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input name="targeting_countries" id="targeting_countries" placeholder="Targeting Countries (comma separated, e.g. US, CA)" value={formState.targeting_countries} onChange={onInput} />
      </div>
      <Button size="sm" className="w-full">{editing ? "Update" : "Create"} Ad Group</Button>
    </form>
  );
};

export default AdGroupForm;
