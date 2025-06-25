
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState, useEffect } from "react";
import { getTeamIntegrations } from "@/lib/account-integrations";
import ConnectedAccountsList from "./integrations/ConnectedAccountsList";
import AvailableIntegrationsGrid from "./integrations/AvailableIntegrationsGrid";

const IntegrationsTab = () => {
  const { userProfile } = useUserProfile();
  const teamId = userProfile?.team_id;
  const [teamIntegrations, setTeamIntegrations] = useState<any[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);

  useEffect(() => {
    const fetchIntegrations = async () => {
      if (!teamId) return;
      setLoadingIntegrations(true);
      try {
        const data = await getTeamIntegrations(teamId);
        setTeamIntegrations(data);
      } catch (e) {
        console.error("Failed to fetch integrations:", e);
      } finally {
        setLoadingIntegrations(false);
      }
    };
    fetchIntegrations();
  }, [teamId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Manage your connected platforms and services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ConnectedAccountsList
          teamIntegrations={teamIntegrations}
          loading={loadingIntegrations}
        />
        <AvailableIntegrationsGrid
          teamIntegrations={teamIntegrations}
          refreshIntegrations={() => teamId && setTeamIntegrations([])}
          teamId={teamId}
        />
      </CardContent>
    </Card>
  );
};

export default IntegrationsTab;
