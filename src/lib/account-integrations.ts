
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch account integrations for the current user's team.
 */
export async function getTeamIntegrations(teamId: string) {
  const { data, error } = await supabase
    .from("account_integrations")
    .select("*")
    .eq("team_id", teamId);

  if (error) throw error;
  return data;
}

/**
 * Upsert an integration for the current team.
 */
export async function upsertTeamIntegration({
  teamId,
  platform,
  accessToken,
  refreshToken,
  expiresIn,
  tokenType,
  accountLabel,
  providerAccountId,
  extraData,
}: {
  teamId: string;
  platform: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number | null;
  tokenType?: string | null;
  accountLabel?: string | null;
  providerAccountId?: string | null;
  extraData?: any;
}) {
  const { data, error } = await supabase
    .from("account_integrations")
    .upsert(
      [
        {
          team_id: teamId,
          platform,
          access_token: accessToken,
          refresh_token: refreshToken ?? null,
          expires_in: expiresIn ?? null,
          token_type: tokenType ?? null,
          account_label: accountLabel ?? null,
          provider_account_id: providerAccountId ?? null,
          extra_data: extraData ?? null,
        },
      ],
      { onConflict: "team_id,platform" } // Upsert using unique team/platform
    )
    .select();

  if (error) throw error;
  return data?.[0] || null;
}
