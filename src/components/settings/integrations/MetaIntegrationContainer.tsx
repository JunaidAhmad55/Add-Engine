
// Handles all Meta OAuth connect/disconnect logic, decoupled from main grid

import { useState } from "react";
import MetaIntegrationCard from "./MetaIntegrationCard";
import { useToast } from "@/hooks/use-toast";
import { connectToMeta } from "@/lib/meta-oauth";
import { upsertTeamIntegration } from "@/lib/account-integrations";
import { Button } from "@/components/ui/button";

interface Props {
  teamIntegrations: any[];
  teamId: string | undefined;
  refreshIntegrations: () => void;
}

const MetaIntegrationContainer = ({ teamIntegrations, teamId, refreshIntegrations }: Props) => {
  const [isMetaConnecting, setIsMetaConnecting] = useState(false);
  const { toast } = useToast();

  const metaIntegration = teamIntegrations.find(acc => acc.platform === "meta_ads");
  const isConnected = !!metaIntegration;

  async function handleConnect() {
    setIsMetaConnecting(true);
    try {
      const result = await connectToMeta();
      await upsertTeamIntegration({
        teamId,
        platform: "meta_ads",
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
        providerAccountId: result.userId,
      });
      refreshIntegrations();
      toast({
        title: "Account Connected",
        description: "Successfully connected your Facebook Ads account."
      });
    } catch (err: any) {
      toast({
        title: "Meta Connection Failed",
        description: err?.message || "Could not connect to Facebook Ads.",
        variant: "destructive"
      });
    } finally {
      setIsMetaConnecting(false);
    }
  }

  async function handleDisconnect() {
    if (!teamId || !isConnected) return;
    await upsertTeamIntegration({
      teamId,
      platform: "meta_ads",
      accessToken: null,
      expiresIn: null,
      providerAccountId: null,
    });
    toast({ title: "Disconnected", description: "Successfully disconnected your Facebook Ads account." });
    refreshIntegrations();
  }

  return (
    <div>
      <MetaIntegrationCard
        isConnected={isConnected}
        isConnecting={isMetaConnecting}
        onConnect={handleConnect}
      />
      {isConnected && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="ml-2 mt-2"
        >
          Disconnect
        </Button>
      )}
    </div>
  );
};

export default MetaIntegrationContainer;

