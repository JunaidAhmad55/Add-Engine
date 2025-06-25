
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTiktokCampaigns } from "@/hooks/useTiktokCampaigns";
import TiktokAdGroupManager from "./TiktokAdGroupManager";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, Delete } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import KeyboardShortcutsBar from "./shared/KeyboardShortcutsBar";
import CampaignForm from "./forms/CampaignForm";
import EmptyState from "./shared/EmptyState";

const requiredMsg = "Required field";
const mustBePositive = "Must be greater than 0";

const validateCampaign = (values: any) => {
  let errors: any = {};
  if (!values.name) errors.name = requiredMsg;
  if (!values.objective) errors.objective = requiredMsg;
  if (values.daily_budget !== undefined && values.daily_budget !== "") {
    if (isNaN(Number(values.daily_budget)) || Number(values.daily_budget) <= 0)
      errors.daily_budget = mustBePositive;
  }
  return errors;
};

const TiktokCampaignManager: React.FC = () => {
  const { campaigns, fetchCampaigns, createCampaign, updateCampaign, deleteCampaign, loading } = useTiktokCampaigns();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formState, setFormState] = useState({
    name: "",
    objective: "",
    status: "ACTIVE",
    daily_budget: "",
  });
  const [errors, setErrors] = useState<any>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  useEffect(() => {
    if (showForm && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showForm]);

  const resetForm = () => {
    setEditing(null);
    setFormState({
      name: "",
      objective: "",
      status: "ACTIVE",
      daily_budget: "",
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
    const validation = validateCampaign(formState);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    if (editing) {
      await updateCampaign(editing.id, formState);
      toast({
        title: "Campaign updated",
        description: `Campaign "${formState.name}" was updated.`,
        variant: "default",
      });
    } else {
      await createCampaign(formState);
      toast({
        title: "Campaign created",
        description: `Campaign "${formState.name}" was created.`,
        variant: "default",
      });
    }
    setShowForm(false);
    resetForm();
    fetchCampaigns();
  };

  const handleEdit = (campaign: any) => {
    setEditing(campaign);
    setFormState({
      name: campaign.name || "",
      objective: campaign.objective || "",
      status: campaign.status || "ACTIVE",
      daily_budget: campaign.daily_budget?.toString() ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = async (campaignId: string) => {
    if (window.confirm("Are you sure you want to delete this campaign (and all associated ad groups/ads)?")) {
      await deleteCampaign(campaignId);
      toast({
        title: "Campaign deleted",
        description: "Campaign and all its Ad Groups/Ads have been deleted.",
        variant: "destructive",
      });
      fetchCampaigns();
    }
  };

  const campaignsSorted = [...campaigns].sort((a, b) =>
    (b.updated_at ? new Date(b.updated_at) : new Date(b.created_at || 0)).getTime() -
    (a.updated_at ? new Date(a.updated_at) : new Date(a.created_at || 0)).getTime()
  );

  return (
    <Card className="max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>TikTok Campaign Manager</CardTitle>
        <Button onClick={() => { resetForm(); setShowForm(v => !v); }} className="ml-2" size="sm">
          {showForm ? "Cancel" : "New Campaign"}
        </Button>
      </CardHeader>
      <CardContent>
        <KeyboardShortcutsBar searchLabel="Search Campaigns" />
        {showForm && (
          <CampaignForm
            formState={formState}
            errors={errors}
            editing={editing}
            onSubmit={handleSubmit}
            onInput={handleInput}
            nameInputRef={nameInputRef}
          />
        )}
        <div className="space-y-4">
          {loading ? (
            <>
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-36 mb-2" />
                      <Skeleton className="h-3 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded" />
                  </div>
                  <div className="mt-3">
                    <Skeleton className="h-6 w-full rounded-md" />
                  </div>
                </Card>
              ))}
            </>
          ) : campaignsSorted.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="No campaigns found"
              description="Start by creating your first campaign."
              actionLabel="+ Add New Campaign"
              onAction={() => { resetForm(); setShowForm(true); }}
            />
          ) : (
            campaignsSorted.map(c => (
              <Card key={c.id} className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold">{c.name}</div>
                    <div className="text-xs">Objective: {c.objective}</div>
                    <div className="text-xs">Status: {c.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>
                      <Delete className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="mt-3">
                  <TiktokAdGroupManager campaignId={c.id} />
                </div>
              </Card>
            ))
          )
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default TiktokCampaignManager;
