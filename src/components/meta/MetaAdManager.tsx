
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMetaCampaigns } from "@/hooks/useMetaCampaigns";

const MetaAdManager: React.FC<{ adSetId: string }> = ({ adSetId }) => {
  const { fetchAds, createAd, updateAd, ads, adsLoading } = useMetaCampaigns();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formState, setFormState] = useState({
    name: "",
    status: "ACTIVE",
    headline: "",
    body: "",
    image_url: "",
  });

  useEffect(() => {
    fetchAds(adSetId);
    // eslint-disable-next-line
  }, [adSetId]);

  const resetForm = () => {
    setEditing(null);
    setFormState({
      name: "",
      status: "ACTIVE",
      headline: "",
      body: "",
      image_url: "",
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(fs => ({ ...fs, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const creative = {
      name: formState.name + " Creative",
      object_story_spec: {
        link_data: {
          name: formState.headline,
          description: formState.body,
          image_url: formState.image_url,
          link: "https://example.com",
          call_to_action: { type: "LEARN_MORE" }
        }
      }
    };
    if (editing) {
      await updateAd(editing.id, {
        ...formState,
        creative,
      });
    } else {
      await createAd({
        ...formState,
        adset_id: adSetId,
        creative,
      });
    }
    setShowForm(false);
    resetForm();
    fetchAds(adSetId);
  };

  const handleEdit = (ad: any) => {
    setEditing(ad);
    setFormState({
      name: ad.name || "",
      status: ad.status,
      headline: ad.creative?.object_story_spec?.link_data?.name || "",
      body: ad.creative?.object_story_spec?.link_data?.description || "",
      image_url: ad.creative?.object_story_spec?.link_data?.image_url || "",
    });
    setShowForm(true);
  };

  return (
    <div className="border mt-3 p-3 bg-zinc-50 rounded">
      <div className="flex justify-between items-center">
        <div className="font-semibold">Ads</div>
        <Button onClick={() => { resetForm(); setShowForm(v => !v); }} size="sm" variant="outline">
          {showForm ? "Cancel" : "New Ad"}
        </Button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-2 my-2">
          <Input name="name" placeholder="Ad Name" value={formState.name} onChange={handleInput} required />
          <select name="status" value={formState.status} onChange={handleInput} className="w-full border px-2 py-1 rounded">
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="ARCHIVED">Archived</option>
            <option value="DELETED">Deleted</option>
          </select>
          <Input name="headline" placeholder="Headline" value={formState.headline} onChange={handleInput} />
          <Input name="body" placeholder="Body Text" value={formState.body} onChange={handleInput} />
          <Input name="image_url" type="url" placeholder="Image URL" value={formState.image_url} onChange={handleInput} />
          {/* Extend with video_url etc. */}
          <Button size="sm" className="w-full">{editing ? "Update" : "Create"} Ad</Button>
        </form>
      )}
      {adsLoading ? <div>Loading ads...</div> : (
        <div className="space-y-1">
          {ads.map(ad => (
            <div key={ad.id} className="bg-white p-1 rounded mb-1 flex flex-col border">
              <div className="flex justify-between items-center">
                <div className="font-bold">{ad.name}</div>
                <Button size="sm" variant="secondary" onClick={() => handleEdit(ad)}>Edit</Button>
              </div>
              <div className="text-xs mt-1">
                Status: {ad.status} <br />
                Headline: {ad.creative?.object_story_spec?.link_data?.name || "N/A"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MetaAdManager;
