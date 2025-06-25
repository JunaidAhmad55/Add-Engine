
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTiktokCampaigns } from "@/hooks/useTiktokCampaigns";
import TiktokAdManager from "./TiktokAdManager";
import { Delete, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import KeyboardShortcutsBar from "./shared/KeyboardShortcutsBar";
import AdGroupForm from "./forms/AdGroupForm";
import EmptyState from "./shared/EmptyState";

const requiredMsg = "Required field";
const mustBePositive = "Must be greater than 0";

function validateAdGroup(fields: any) {
  let errors: any = {};
  if (!fields.name) errors.name = requiredMsg;
  if (fields.daily_budget !== undefined && fields.daily_budget !== "") {
    if (isNaN(Number(fields.daily_budget)) || Number(fields.daily_budget) <= 0)
      errors.daily_budget = mustBePositive;
  }
  return errors;
}

const TiktokAdGroupManager: React.FC<{ campaignId: string }> = ({ campaignId }) => {
  const { fetchAdGroups, createAdGroup, updateAdGroup, deleteAdGroup, adGroups, adGroupsLoading } = useTiktokCampaigns();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formState, setFormState] = useState({
    name: "",
    status: "ACTIVE",
    daily_budget: "",
    targeting_countries: "",
  });
  const [errors, setErrors] = useState<any>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchAdGroups(campaignId); }, [campaignId, fetchAdGroups]);

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
      daily_budget: "",
      targeting_countries: "",
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
    const validation = validateAdGroup(formState);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    const targeting = formState.targeting_countries
      ? { countries: formState.targeting_countries.split(",").map(c => c.trim()).filter(Boolean) }
      : undefined;
    if (editing) {
      await updateAdGroup(editing.id, {
        ...formState,
        daily_budget: formState.daily_budget ? Number(formState.daily_budget) : undefined,
        targeting,
      });
      toast({
        title: "Ad Group updated",
        description: `Ad Group "${formState.name}" was updated.`,
        variant: "default",
      });
    } else {
      await createAdGroup({
        ...formState,
        campaign_id: campaignId,
        daily_budget: formState.daily_budget ? Number(formState.daily_budget) : undefined,
        targeting,
      });
      toast({
        title: "Ad Group created",
        description: `Ad Group "${formState.name}" was created.`,
        variant: "default",
      });
    }
    setShowForm(false);
    resetForm();
    fetchAdGroups(campaignId);
  };

  const handleEdit = (adGroup: any) => {
    setEditing(adGroup);
    setFormState({
      name: adGroup.name || "",
      status: adGroup.status,
      targeting_countries: adGroup.targeting?.countries?.join(", ") ?? "",
      daily_budget: adGroup.daily_budget?.toString() ?? "",
    });
    setShowForm(true);
  };

  const handleDeleteAdGroup = async (adGroupId: string) => {
    if (window.confirm("Delete this ad group (and all its ads)?")) {
      await deleteAdGroup(adGroupId);
      toast({
        title: "Ad Group deleted",
        description: "Ad Group was deleted (all its ads too).",
        variant: "destructive",
      });
      fetchAdGroups(campaignId);
    }
  };

  const adGroupsSorted = [...adGroups].sort((a, b) =>
    (b.updated_at ? new Date(b.updated_at) : new Date(b.created_at || 0)).getTime() -
    (a.updated_at ? new Date(a.updated_at) : new Date(a.created_at || 0)).getTime()
  );

  return (
    <div className="border mt-4 rounded-lg p-3 bg-neutral-50">
      <KeyboardShortcutsBar searchLabel="Search Groups" />
      <div className="flex justify-between items-center">
        <div className="font-semibold">Ad Groups</div>
        <Button onClick={() => { resetForm(); setShowForm(v => !v); }} size="sm" variant="outline">
          {showForm ? "Cancel" : "New Ad Group"}
        </Button>
      </div>
      {showForm && (
        <AdGroupForm
          formState={formState}
          errors={errors}
          editing={editing}
          onSubmit={handleSubmit}
          onInput={handleInput}
          nameInputRef={nameInputRef}
        />
      )}
      {adGroupsLoading ? (
        <div>
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="bg-white p-2 rounded mb-1 flex flex-col border">
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : adGroupsSorted.length === 0 ? (
        <EmptyState
          icon={Info}
          title="No ad groups found"
          actionLabel="+ Add New Ad Group"
          onAction={() => { resetForm(); setShowForm(true); }}
        />
      ) : (
        <div className="space-y-1">
          {adGroupsSorted.map(a => (
            <div key={a.id} className="bg-white p-2 rounded mb-1 flex flex-col border">
              <div className="flex justify-between items-center gap-2">
                <div>
                  <span className="font-bold">{a.name}</span>
                  <span className="ml-2 text-xs">Status: {a.status}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(a)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteAdGroup(a.id)}>
                    <Delete className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              <div className="text-xs mt-1">
                Targeting: {a.targeting?.countries?.join(", ") || "None"}
              </div>
              <TiktokAdManager adGroupId={a.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TiktokAdGroupManager;
