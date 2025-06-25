
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTiktokCampaigns } from "@/hooks/useTiktokCampaigns";
import { Delete } from "lucide-react";
import { Video as VideoIcon, Image as ImageIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import KeyboardShortcutsBar from "./shared/KeyboardShortcutsBar";
import AdForm from "./forms/AdForm";
import EmptyState from "./shared/EmptyState";

function getMediaType(url: string): "image" | "video" | "other" {
  if (!url) return "other";
  const imgExt = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
  const vidExt = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
  const lower = url.toLowerCase();
  if (imgExt.some(ext => lower.endsWith(ext))) return "image";
  if (vidExt.some(ext => lower.endsWith(ext))) return "video";
  return "other";
}

const requiredMsg = "Required field";

function validateAd(fields: any) {
  const errors: any = {};
  if (!fields.name) errors.name = requiredMsg;
  if (!fields.headline) errors.headline = requiredMsg;
  if (!fields.video_url) errors.video_url = requiredMsg;
  return errors;
}

const TiktokAdManager: React.FC<{ adGroupId: string }> = ({ adGroupId }) => {
  const { fetchAds, createAd, updateAd, deleteAd, ads, adsLoading } = useTiktokCampaigns();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formState, setFormState] = useState({
    name: "",
    status: "ACTIVE",
    headline: "",
    description: "",
    video_url: "",
  });
  const [errors, setErrors] = useState<any>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAds(adGroupId);
  }, [adGroupId, fetchAds]);

  useEffect(() => {
    if (showForm && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showForm]);

  const resetForm = () => {
    setEditing(null);
    setFormState({
      name: "",
      status: "ACTIVE",
      headline: "",
      description: "",
      video_url: "",
    });
    setErrors({});
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(fs => ({ ...fs, [name]: value }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAd(formState);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    if (editing) {
      await updateAd(editing.id, { ...formState });
      toast({
        title: "Ad updated",
        description: `Ad "${formState.name}" was updated.`,
        variant: "default",
      });
    } else {
      await createAd({
        ...formState,
        ad_group_id: adGroupId,
      });
      toast({
        title: "Ad created",
        description: `Ad "${formState.name}" was created.`,
        variant: "default",
      });
    }
    setShowForm(false);
    resetForm();
    fetchAds(adGroupId);
  };

  const handleEdit = (ad: any) => {
    setEditing(ad);
    setFormState({
      name: ad.name || "",
      status: ad.status,
      headline: ad.headline || "",
      description: ad.description || "",
      video_url: ad.video_url || "",
    });
    setShowForm(true);
  };

  const handleDeleteAd = async (adId: string) => {
    if (window.confirm("Delete this ad?")) {
      await deleteAd(adId);
      toast({
        title: "Ad deleted",
        description: "Ad was deleted.",
        variant: "destructive",
      });
      fetchAds(adGroupId);
    }
  };

  const adsSorted = [...ads].sort((a, b) =>
    (b.updated_at ? new Date(b.updated_at) : new Date(b.created_at || 0)).getTime() -
    (a.updated_at ? new Date(a.updated_at) : new Date(a.created_at || 0)).getTime()
  );

  return (
    <div className="border mt-3 p-3 bg-zinc-50 rounded">
      <KeyboardShortcutsBar searchLabel="Search Assets" />
      <div className="flex justify-between items-center">
        <div className="font-semibold">Ads</div>
        <Button onClick={() => { resetForm(); setShowForm(v => !v); }} size="sm" variant="outline">
          {showForm ? "Cancel" : "New Ad"}
        </Button>
      </div>
      {showForm && (
        <AdForm
          formState={formState}
          errors={errors}
          editing={editing}
          onSubmit={handleSubmit}
          onInput={handleInput}
          nameInputRef={nameInputRef}
        />
      )}
      {adsLoading ? (
        <div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="w-14 h-10" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : adsSorted.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No ads found"
          actionLabel="+ Add New Ad"
          onAction={() => { resetForm(); setShowForm(true); }}
        />
      ) : (
        <div className="space-y-1">
          {adsSorted.map(ad => {
            const type = getMediaType(ad.video_url ?? "");
            const [broken, setBroken] = useState(false);
            const mediaPreview = type === "image" && ad.video_url && !broken
              ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ad.video_url}
                  alt={ad.name}
                  className="object-cover w-full h-full"
                  style={{ maxWidth: 48, maxHeight: 48 }}
                  onError={() => setBroken(true)}
                />
              ) : type === "video"
              ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <VideoIcon className="w-8 h-8 text-purple-400" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Video URL (no preview until published)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
              )
              : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {ad.video_url ? "Could not load preview" : "No asset URL – add one!"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            return (
              <div key={ad.id} className="bg-white p-1 rounded mb-1 flex items-center border">
                <div className="w-14 h-10 flex-shrink-0 mr-3 flex items-center justify-center rounded overflow-hidden bg-zinc-100 border border-zinc-200">
                  {mediaPreview}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center gap-2">
                    <div className="font-bold">{ad.name}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(ad)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteAd(ad.id)}>
                        <Delete className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs mt-1">
                    Status: {ad.status} <br />
                    Headline: {ad.headline || "N/A"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TiktokAdManager;
