
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdFormProps {
  formState: {
    name: string;
    status: string;
    headline: string;
    description: string;
    video_url: string;
  };
  errors: any;
  editing: any;
  onSubmit: (e: React.FormEvent) => void;
  onInput: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  nameInputRef: React.RefObject<HTMLInputElement>;
}

const AdForm: React.FC<AdFormProps> = ({
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
          <label htmlFor="ad-name" className="font-medium">Ad Name</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>This field is <span className="font-bold">required</span>.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          name="name"
          id="ad-name"
          placeholder="Ad Name"
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
          <label htmlFor="headline" className="font-medium">Headline</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>This field is <span className="font-bold">required</span>.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input name="headline" id="headline" placeholder="Headline" value={formState.headline} onChange={onInput} required aria-invalid={!!errors.headline} />
        {errors.headline && <p className="text-red-500 text-xs mt-1">{errors.headline}</p>}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="description" className="font-medium">Description</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>This field is <span className="font-bold">optional</span>. Any extra notes or callouts for ad copy.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input name="description" id="description" placeholder="Description" value={formState.description} onChange={onInput} />
      </div>
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="video_url" className="font-medium">Video URL</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>This field is <span className="font-bold">required</span>. Accepts image or video URLs.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input name="video_url" id="video_url" type="url" placeholder="Video or Image URL (required)" value={formState.video_url} onChange={onInput} required aria-invalid={!!errors.video_url} />
        {errors.video_url && <p className="text-red-500 text-xs mt-1">{errors.video_url}</p>}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <label htmlFor="status" className="font-medium">Status</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent>
                <span className="font-bold">Active</span>: Runs ad<br />
                <span className="font-bold">Paused</span>: Temporarily stops<br />
                <span className="font-bold">Archived</span>: Hidden/not served<br />
                <span className="font-bold">Deleted</span>: Will be removed
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <select name="status" id="status" value={formState.status} onChange={onInput} className="w-full border px-2 py-1 rounded">
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="ARCHIVED">Archived</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>
      <Button size="sm" className="w-full">{editing ? "Update" : "Create"} Ad</Button>
    </form>
  );
};

export default AdForm;
