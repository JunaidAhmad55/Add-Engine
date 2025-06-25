import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMetaCampaigns } from "@/hooks/useMetaCampaigns";
import MetaAdManager from "./MetaAdManager";

const MetaAdSetManager: React.FC<{ campaignId: string }> = ({ campaignId }) => {
  const { fetchAdSets, createAdSet, updateAdSet, adSets, adSetsLoading } = useMetaCampaigns();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formState, setFormState] = useState({
    name: "",
    status: "ACTIVE",
    daily_budget: "",
    lifetime_budget: "",
    targeting_countries: "",
  });

  useEffect(() => {
    fetchAdSets(campaignId);
    // eslint-disable-next-line
  }, [campaignId]);

  const resetForm = () => {
    setEditing(null);
    setFormState({
      name: "",
      status: "ACTIVE",
      daily_budget: "",
      lifetime_budget: "",
      targeting_countries: "",
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(fs => ({ ...fs, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targeting = formState.targeting_countries
      ? { geo_locations: { countries: formState.targeting_countries.split(",").map(c => c.trim()).filter(Boolean) } }
      : undefined;
    if (editing) {
      await updateAdSet(editing.id, {
        ...formState,
        daily_budget: formState.daily_budget ? Number(formState.daily_budget) : undefined,
        lifetime_budget: formState.lifetime_budget ? Number(formState.lifetime_budget) : undefined,
        targeting,
      });
    } else {
      await createAdSet({
        ...formState,
        campaign_id: campaignId,
        daily_budget: formState.daily_budget ? Number(formState.daily_budget) : undefined,
        lifetime_budget: formState.lifetime_budget ? Number(formState.lifetime_budget) : undefined,
        targeting,
      });
    }
    setShowForm(false);
    resetForm();
    fetchAdSets(campaignId);
  };

  const handleEdit = (adSet: any) => {
    setEditing(adSet);
    setFormState({
      ...adSet,
      targeting_countries: adSet.targeting?.geo_locations?.countries?.join(", ") ?? "",
      daily_budget: adSet.daily_budget?.toString() ?? "",
      lifetime_budget: adSet.lifetime_budget?.toString() ?? "",
    });
    setShowForm(true);
  };

  return (
    <div className="border mt-4 rounded-lg p-3 bg-neutral-50">
      <div className="flex justify-between items-center">
        <div className="font-semibold">Ad Sets</div>
        <Button onClick={() => { resetForm(); setShowForm(v => !v); }} size="sm" variant="outline">
          {showForm ? "Cancel" : "New Ad Set"}
        </Button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-2 my-2">
          <Input name="name" placeholder="Ad Set Name" value={formState.name} onChange={handleInput} required />
          <select name="status" value={formState.status} onChange={handleInput} className="w-full border px-2 py-1 rounded">
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <Input name="daily_budget" type="number" placeholder="Daily Budget" value={formState.daily_budget} onChange={handleInput} />
          <Input name="lifetime_budget" type="number" placeholder="Lifetime Budget" value={formState.lifetime_budget} onChange={handleInput} />
          <Input name="targeting_countries" placeholder="Targeting Countries (comma separated, e.g. US, CA, GB)" value={formState.targeting_countries} onChange={handleInput} />
          {/* Extend with more targeting/settings as needed */}
          <Button size="sm" className="w-full">{editing ? "Update" : "Create"} Ad Set</Button>
        </form>
      )}
      {adSetsLoading ? <div>Loading ad sets...</div> : (
        <div className="space-y-1">
          {adSets.map(a => (
            <div key={a.id} className="bg-white p-2 rounded mb-1 flex flex-col border">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">{a.name}</span>
                  <span className="ml-2 text-xs">Status: {a.status}</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => handleEdit(a)}>Edit</Button>
              </div>
              <div className="text-xs mt-1">
                Targeting: {a.targeting?.geo_locations?.countries?.join(", ") || "None"}
              </div>
              <MetaAdManager adSetId={a.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MetaAdSetManager;
