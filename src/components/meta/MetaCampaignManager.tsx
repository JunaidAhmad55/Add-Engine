
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMetaCampaigns } from "@/hooks/useMetaCampaigns";
import MetaAdSetManager from "./MetaAdSetManager";

const MetaCampaignManager: React.FC = () => {
  const { campaigns, fetchCampaigns, createCampaign, updateCampaign, isLoading } = useMetaCampaigns();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formState, setFormState] = useState({
    name: "",
    objective: "",
    status: "ACTIVE",
    special_ad_categories: ["NONE"],
    daily_budget: "",
    lifetime_budget: "",
    buying_type: "AUCTION",
  });

  // Load campaigns at mount
  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const resetForm = () => {
    setEditing(null);
    setFormState({
      name: "",
      objective: "",
      status: "ACTIVE",
      special_ad_categories: ["NONE"],
      daily_budget: "",
      lifetime_budget: "",
      buying_type: "AUCTION",
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(fs => ({ ...fs, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateCampaign(editing.id, {
        ...formState,
        daily_budget: formState.daily_budget ? Number(formState.daily_budget) : undefined,
        lifetime_budget: formState.lifetime_budget ? Number(formState.lifetime_budget) : undefined,
      });
    } else {
      await createCampaign({
        ...formState,
        daily_budget: formState.daily_budget ? Number(formState.daily_budget) : undefined,
        lifetime_budget: formState.lifetime_budget ? Number(formState.lifetime_budget) : undefined,
      });
    }
    setShowForm(false);
    resetForm();
    fetchCampaigns();
  };

  const handleEdit = (campaign: any) => {
    setEditing(campaign);
    setFormState({
      ...campaign,
      special_ad_categories: campaign.special_ad_categories || ["NONE"],
      daily_budget: campaign.daily_budget?.toString() ?? "",
      lifetime_budget: campaign.lifetime_budget?.toString() ?? "",
    });
    setShowForm(true);
  };

  return (
    <Card className="max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Meta Campaign Manager</CardTitle>
        <Button onClick={() => { resetForm(); setShowForm(v => !v); }} className="ml-2" size="sm">
          {showForm ? "Cancel" : "New Campaign"}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <Input name="name" placeholder="Campaign Name" value={formState.name} onChange={handleInput} required />
            <Input name="objective" placeholder="Objective (e.g. LINK_CLICKS)" value={formState.objective} onChange={handleInput} required />
            <select name="status" value={formState.status} onChange={handleInput} className="w-full border px-2 py-1 rounded">
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="ARCHIVED">Archived</option>
              <option value="DELETED">Deleted</option>
            </select>
            <Input name="daily_budget" type="number" placeholder="Daily Budget" value={formState.daily_budget} onChange={handleInput} />
            <Input name="lifetime_budget" type="number" placeholder="Lifetime Budget" value={formState.lifetime_budget} onChange={handleInput} />
            <select name="buying_type" value={formState.buying_type} onChange={handleInput} className="w-full border px-2 py-1 rounded">
              <option value="AUCTION">Auction</option>
              {/* Add more types if needed */}
            </select>
            {/* Add more options as needed */}
            <Button type="submit" className="w-full">{editing ? "Update" : "Create"} Campaign</Button>
          </form>
        )}
        <div className="space-y-4">
          {isLoading ? <div>Loading campaigns...</div> : campaigns.length === 0 ? <div>No campaigns.</div> :
            campaigns.map(c => (
              <Card key={c.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{c.name}</div>
                    <div className="text-xs">Objective: {c.objective}</div>
                    <div className="text-xs">Status: {c.status}</div>
                  </div>
                  <div>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>Edit</Button>
                  </div>
                </div>
                <div className="mt-3">
                  <MetaAdSetManager campaignId={c.id} />
                </div>
              </Card>
            ))
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaCampaignManager;
