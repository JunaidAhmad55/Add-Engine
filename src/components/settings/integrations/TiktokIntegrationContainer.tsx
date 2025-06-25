
// Handles TikTok connect/disconnect, clean state

import { useState } from "react";
import TiktokIntegrationCard from "./TiktokIntegrationCard";
import { useToast } from "@/hooks/use-toast";
import { connectToTikTok } from "@/lib/tiktok-oauth";
import { upsertTeamIntegration } from "@/lib/account-integrations";
import { Button } from "@/components/ui/button";

interface Props {
  teamIntegrations: any[];
  teamId: string | undefined;
  refreshIntegrations: () => void;
}

const TiktokIntegrationContainer = ({ teamIntegrations, teamId, refreshIntegrations }: Props) => {
  const [isTiktokConnecting, setIsTiktokConnecting] = useState(false);
  const { toast } = useToast();

  const tiktokIntegration = teamIntegrations.find(acc => acc.platform === "tiktok_ads");
  const isConnected = !!tiktokIntegration;

  async function handleConnect() {
    setIsTiktokConnecting(true);
    try {
      const result = await connectToTikTok();
      await upsertTeamIntegration({
        teamId,
        platform: "tiktok_ads",
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
        providerAccountId: result.openId,
      });
      refreshIntegrations();
      toast({
        title: "Account Connected",
        description: "Successfully connected your TikTok Ads account."
      });
    } catch (err: any) {
      toast({
        title: "TikTok Connection Failed",
        description: err?.message || "Could not connect to TikTok Ads.",
        variant: "destructive"
      });
    } finally {
      setIsTiktokConnecting(false);
    }
  }

  async function handleDisconnect() {
    if (!teamId || !isConnected) return;
    await upsertTeamIntegration({
      teamId,
      platform: "tiktok_ads",
      accessToken: null,
      expiresIn: null,
      providerAccountId: null,
    });
    toast({ title: "Disconnected", description: "Successfully disconnected your TikTok Ads account." });
    refreshIntegrations();
  }

  return (
    <div>
      <TiktokIntegrationCard
        isConnected={isConnected}
        isConnecting={isTiktokConnecting}
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

export default TiktokIntegrationContainer;

