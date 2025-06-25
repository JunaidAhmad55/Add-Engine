
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CampaignFormProps {
  formState: {
    name: string;
    objective: string;
    status: string;
    daily_budget: string;
  };
  errors: any;
  editing: any;
  onSubmit: (e: React.FormEvent) => void;
  onInput: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  nameInputRef: React.RefObject<HTMLInputElement>;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  formState,
  errors,
  editing,
  onSubmit,
  onInput,
  nameInputRef,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-8">
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="campaign-name" className="font-medium">Campaign Name</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                This field is <span className="font-bold">required</span>.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          name="name"
          id="campaign-name"
          placeholder="Campaign Name"
          value={formState.name}
          onChange={onInput}
          required
          aria-invalid={!!errors.name}
          ref={nameInputRef}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="objective" className="font-medium">Objective</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                This field is <span className="font-bold">required</span>.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          name="objective"
          id="objective"
          placeholder="Objective"
          value={formState.objective}
          onChange={onInput}
          required
          aria-invalid={!!errors.objective}
        />
        {errors.objective && <p className="text-red-500 text-xs mt-1">{errors.objective}</p>}
      </div>
      <div>
        <label htmlFor="daily_budget" className="font-medium flex items-center gap-1">
          Daily Budget&nbsp;
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>
                Must be greater than <span className="font-bold">0</span>. How much you'll spend daily for this campaign.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </label>
        <Input
          name="daily_budget"
          id="daily_budget"
          type="number"
          placeholder="Daily Budget"
          value={formState.daily_budget}
          onChange={onInput}
          min={1}
          aria-invalid={!!errors.daily_budget}
        />
        {errors.daily_budget && <p className="text-red-500 text-xs mt-1">{errors.daily_budget}</p>}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="status" className="font-medium">Status</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>
                <span className="font-bold">Active</span>: Runs campaign<br />
                <span className="font-bold">Paused</span>: Temporarily stop<br />
                <span className="font-bold">Archived</span>: Closed/hidden
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <select name="status" id="status" value={formState.status} onChange={onInput} className="w-full border px-2 py-1 rounded">
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <Button type="submit" className="w-full">{editing ? "Update" : "Create"} Campaign</Button>
    </form>
  );
};

export default CampaignForm;
