
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AISettingsData {
  openai_api_key: string;
  god_mode_enabled: boolean;
}

interface TeamAIQuota {
  token_quota: number;
  token_used: number;
}

const AITab: React.FC<{ orgId: string; isAdmin: boolean }> = ({ orgId, isAdmin }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [aiSettings, setAISettings] = useState<AISettingsData | null>(null);
  const [quota, setQuota] = useState<TeamAIQuota | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm<AISettingsData>({
    defaultValues: { openai_api_key: "", god_mode_enabled: false },
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const settingsRes = await supabase
        .from("team_ai_settings")
        .select("openai_api_key, god_mode_enabled")
        .eq("org_id", orgId)
        .maybeSingle();
      if (settingsRes.data) {
        setAISettings(settingsRes.data);
        reset(settingsRes.data);
      }
      const quotaRes = await supabase
        .from("team_ai_quota")
        .select("token_quota, token_used")
        .eq("org_id", orgId)
        .maybeSingle();
      if (quotaRes.data) setQuota(quotaRes.data);
      setLoading(false);
    })();
  }, [orgId, reset]);

  const onSubmit = async (values: AISettingsData) => {
    setSaving(true);
    let { error } = await supabase
      .from("team_ai_settings")
      .upsert({
        org_id: orgId,
        openai_api_key: values.openai_api_key,
        god_mode_enabled: values.god_mode_enabled,
        updated_at: new Date().toISOString(), // <-- Fix: use ISO string
      });
    setSaving(false);
    if (!error) toast({ title: "Updated AI settings", description: "Changes saved." });
    else toast({ title: "Error", description: error.message });
    setAISettings(values);
  };

  const tokenUsagePct = quota && quota.token_quota
    ? Math.round((quota.token_used / quota.token_quota) * 100)
    : 0;

  // Hide API key for non-admins
  const keyDisplay = isAdmin
    ? <Input
        id="openai_key"
        {...register("openai_api_key")}
        placeholder="OpenAI API key (sk-...)"
        type="password"
        className="w-full"
        autoComplete="off"
        disabled={!isAdmin}
      />
    : <Input
        id="openai_key_masked"
        value={aiSettings?.openai_api_key ? "**************" : ""}
        placeholder="You must be an admin to view key"
        disabled
      />;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">AI Integration</h3>
      <p className="text-gray-600 mb-4">
        Manage your team's OpenAI API key and "God Mode" generation privileges. Your API key is securely stored and only visible to admins.
      </p>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="openai_key" className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key <span className="text-xs">(encrypted, admin only)</span>
            </label>
            {keyDisplay}
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              id="god_mode_enabled"
              checked={!!watch("god_mode_enabled")}
              {...register("god_mode_enabled")}
              disabled={!isAdmin}
              onCheckedChange={val => setValue("god_mode_enabled", val as boolean)}
            />
            <label htmlFor="god_mode_enabled" className="text-sm">Enable God Mode (AI generation features)</label>
          </div>
          {quota && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Team token usage</span>
                <span className="text-xs">{quota.token_used?.toLocaleString() || 0} / {quota.token_quota?.toLocaleString()} tokens</span>
              </div>
              <div className="h-2 mt-2 rounded bg-gray-200">
                <div
                  className="h-2 rounded bg-emerald-400 transition-all"
                  style={{ width: `${tokenUsagePct}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Meter resets monthly or when quota increases.
              </div>
            </div>
          )}
          <Button type="submit" className="mt-4" disabled={!isAdmin || saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default AITab;
